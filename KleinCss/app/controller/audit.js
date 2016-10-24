/**
 * Created by apple on 16/1/17.
 */
//审核

var async = require('async');
var uuid = require('node-uuid');
var cremsgDBModel = require('../model/cremsg');
var courseDBModel = require('../model/course');
var usersDBModel = require('../model/user');
var tcredSchemaDBmodel = require('../model/tcred');
var agencySchemaDBmodel = require("../model/agencyred");
var userMod = new usersDBModel.Schema('user').model;

var teachercertMod = new tcredSchemaDBmodel.Schema('tcred').model;
var cremsgMod = new cremsgDBModel.Schema('cremsg').model;
var courseMod = new courseDBModel.Schema('course').model;
var agencyredMod = new agencySchemaDBmodel.Schema("agencyred").model;

//等待审核状态的item
exports.waitAuditCourses = function(req, res){
    cremsgMod.find({status:"1","type":"3"})
        .populate({
            path:'teacher',
            select:'name'
        })
        .populate({
            path:'course',
            select:'name'
        })
        .exec(function(err, cremsgList){
            if (err){
                res.json({
                    data:[],
                    state:'fail',
                    msg:''
                });
            }else {
                console.log(cremsgList);
                for (var i = 0; i < cremsgList.length; i++) {
                    var item = cremsgList[i];
                    item._doc.id = item._id;
                };

                res.json({
                    data: cremsgList,
                    state: 'success',
                    msg: ''
                });
            }
    });
}

//审核中状态的item
exports.actAuditCourses = function(req, res){
    var userid = req.session.user.userid;
    cremsgMod.find({status:"4","type":"3", auditid:userid})
        .populate({
            path:'teacher',
            select:'name'
        })
        .populate({
            path:'course',
            select:'name'
        })
        .exec(function(err, cremsgList){
            if (err){
                res.json({
                    data:[],
                    state:'fail',
                    msg:''
                });
            }else {
                for (var i = 0; i < cremsgList.length; i++) {
                    var item = cremsgList[i];
                    item._doc.id = item._id;
                }

                res.json({
                    data: cremsgList,
                    state: 'success',
                    msg: ''
                });
            }
        }
    );
}

//已审核状态的item
exports.doneAuditCourses = function(req, res){
    var userid = req.session.user.userid;
    cremsgMod
        .find({
            "type":"3",
            auditid:userid,
            $or:[{status:'2'}, {status:'3'}]
        })
        .populate({
            path:'teacher',
            select:'-_id name age sex'
        })
        .populate({
            path:'course',
            select:'name'
        })
        .exec(function(err, cremsgList){
            if (err){
                res.json({
                    data:[],
                    state:'fail',
                    msg:''
                });
            }else {
                for (var i = 0; i < cremsgList.length; i++) {
                    var item = cremsgList[i];
                    item._doc.id = item._id;
                }

                res.json({
                    data: cremsgList,
                    state: 'success',
                    msg: ''
                });
            }
        }
    );
}

//待审核转审核中
exports.actingAuditCourse = function(req, res){
    var obj=__('audit');
    var userid = req.session.user.userid;
    var codes = JSON.parse(req.body.data);
    var series = ['query', 'mark', 'change'];
    var result = {};

    async.eachSeries(
        series,
        function(item, callback){
            switch (item) {
                case 'query':
                    cremsgMod.find(
                        {
                            '_id':{$in:codes}
                        },
                        '-_id course',
                        function(err, list){
                            if (err){
                                result.query = {
                                    state:false,
                                    msg:'fail',
                                    data:null
                                }
                                callback();
                            }else{
                                result.query = {
                                    state:true,
                                    msg:'success',
                                    data:list
                                }
                                callback();
                            }
                        }
                    )
                    break;
                case 'mark':
                    if (result.query.state){
                        var bulk = cremsgMod.collection.initializeOrderedBulkOp();
                        bulk.find({'_id': {$in: codes}})
                            .update({$set: {
                                auditid: userid,
                                status:'4'
                            }});
                        bulk.execute(function (error) {
                             if (error){
                                 result.mark = {
                                     state:false,
                                     msg:'fail',
                                     data:null
                                 }
                                 callback();
                             }else{
                                 result.mark = {
                                     state:true,
                                     msg:'success',
                                     data:null
                                 }
                                 callback();
                             }
                        });
                    }else{
                        result.mark = {
                            state:false,
                            msg:'fail',
                            data:null
                        }
                        callback();
                    }

                    break;
                case 'change':
                    if (result.mark.state){
                        var courses = [];
                        result.query.data.forEach(function(item){
                            courses.push(item.course);
                        });

                        var bulk = courseMod.collection.initializeOrderedBulkOp();
                        bulk.find({'_id': {$in: courses}})
                            .update({$set: {
                                statelv: {
                                    lv:0,
                                    type:2,
                                    name:obj.auditing
                                }
                            }});
                        bulk.execute(function (error) {
                            if (error){
                                result.change = {
                                    state:false,
                                    msg:'fail',
                                    data:null
                                }
                                callback();
                            }else{
                                result.change = {
                                    state:true,
                                    msg:'success',
                                    data:null
                                }
                                callback();
                            }
                        });


                    }else{
                        result.change = {
                            state:false,
                            msg:'fail',
                            data:null
                        }
                        callback();
                    }
                    break;
            }
        },
        function(err){
            if (err){
                res.json({
                    state:false,
                    msg:'fail',
                    data:null
                })
            }else{
                if (result.change.state){
                    res.json({
                        state:true,
                        msg:'success',
                        data:null
                    })
                }else{
                    res.json({
                        state:false,
                        msg:'fail',
                        data:null
                    })
                }
            }
        }
    );
}

exports.fetchAuditMsg = function(req, res){
    var code = req.query.code;

    var series = ['queue'];

    var result = {};

    async.eachSeries(
        series,
        function(item, callback){
            switch (item) {
                case 'queue':
                    cremsgMod
                        .findOne({_id:code})
                        .populate({
                            path:'teacher',
                            select:'_id, name'
                        })
                        .populate({
                            path:'course',
                            select:'_id, name'
                        })
                        .exec(function(err, cremsg){
                            if (err){
                                result.queue = {
                                    state:false,
                                    msg:'fail',
                                    data:null
                                }
                                callback();
                            }else{
                                result.queue = {
                                    state:true,
                                    msg:'success',
                                    data:cremsg
                                }
                                callback();
                            }
                        })

                    break;

            }
        },
        function(err){
            if (err){
                res.json({
                    state:false,
                    msg:'fail',
                    data:null
                });
            }else{
                res.json({
                    state:true,
                    msg:'success',
                    data:result.queue.data
                })
            }
        }
    )
}

//是否通过审核
exports.analysisPass = function(req, res){
    var obj=__('audit');
    var code = req.query.code;
    var pass = req.query.pass;
    var courseid = req.query.courseid;

    var series = ['queue', 'course'];

    var result = {};

    async.eachSeries(
        series,
        function(item, callback){
            switch (item) {
                case 'queue':
                    cremsgMod.update(
                        {
                            _id:code
                        },
                        {
                            $set:{
                                status:(pass=='true')?"2":"3"
                            }
                        },
                        function(err){
                            if (err){
                                result.queue = {
                                    state:false,
                                    msg:'fail',
                                    data:null
                                }
                                callback();
                            }else{
                                result.queue = {
                                    state:true,
                                    msg:'success',
                                    data:null
                                }
                                callback();
                            }
                        }
                    )

                    break;
                case 'course':
                    if (!result.queue.state){
                        result.course = {
                            state:false,
                            msg:'fail',
                            data:null
                        }
                        callback();
                    }else{
                        courseMod.update(
                            {
                                '_id':courseid
                            },
                            {
                                $set:{
                                    statelv:{
                                        lv:0,
                                        type:(pass=='true')?3:4,
                                        name:(pass=='true')?obj.success:obj.fail
                                    }
                                }
                            },
                            function(err){
                                if (err){
                                    result.course = {
                                        state:false,
                                        msg:'fail',
                                        data:null
                                    };
                                    callback();
                                }else{
                                    result.course = {
                                        state:true,
                                        msg:'success',
                                        data:null
                                    }
                                    callback()
                                }
                            }
                        )
                    }

                    break;
            }
        },
        function(err){
            if (err){
                res.json({
                    state:false,
                    msg:'fail',
                    data:null
                });
            }else{
                res.json({
                    state:true,
                    msg:'success',
                    data:null
                })
            }
        }
    );

}
exports.getWaitAuthList = function(req, res){
    var obj=__('audit');
    cremsgMod.find({"type":{$in:["1","4"]},"status":"1","enable":true}).populate({
        path:'userid',select:'_id name email'
    }).exec(function(err,coll){

        if (err){
            res.json({
                data:[],
                state:'202',
                msg:obj.sysError
            });
        }else{
            res.json(coll
              );
        }
    });
}



exports.getActAuthList = function(req, res){
    var obj=__('audit');
    cremsgMod.find({"type":{$in:["1","4"]},"status":"4","enable":true}).populate({
        path:'userid',
        select:'_id name email'
    }).exec(function(err,coll){
        console.log(coll);
        if (err){
            res.json({
                data:[],
                state:'202',
                msg:obj.sysError
            });
        }else{
            res.json(coll
            );
        }
    });
}



exports.getDoneAuthList = function(req, res){
    var obj=__('audit');
    cremsgMod.find({"type":{$in:["1","4"]},"status":{$in:["2","3"]},"enable":true}).populate({
        path:'userid',
        select:'_id name email'
    }).exec(function(err,coll){
        if (err){
            res.json({
                data:[],
                state:'202',
                msg:obj.sysError
            });
        }else{
            console.log(coll);
            res.json(coll);
        }
    });
}



exports.getPassAuth = function(req, res){
    var obj=__('audit');
    cremsgMod.find({"type":{$in:["1","4"]},"status":"2","enable":true}).populate({
        path:'userid',
        select:'_id, name,email'
    }).exec(function(err,coll){
        if (err){
            res.json({
                data:[],
                state:'202',
                msg:obj.sysError
            });
        }else{
            res.json(
                coll

            );
        }
    });
}
exports.actingAuditCert = function(req,res){
    var codes  = req.body.codes;
    if(codes != undefined){
        codes  = JSON.parse(codes);
    }
    var userid = req.session.user.userid;
    var result = {};

    var bulk = cremsgMod.collection.initializeOrderedBulkOp();
    bulk.find({'_id': {$in: codes}})
        .update({$set: {
            auditid: userid,
            status:'4'
        }});
    bulk.execute(function (error) {
        if (error){
            result.mark = {
                state:false,
                msg:'fail',
                data:null
            }
            callback();
        }else{
            result.mark = {
                state:true,
                msg:'success',
                data:null
            }


        }
        res.json(result.mark);
    });
}
exports.passTheAuth = function(req, res){
    var obj=__('audit');
    var cremsgid = req.body.cremsgid;
    var result = req.body.result;
    if(result == 'pass'){
        cremsgMod.find({"_id":cremsgid},function(err,docs){
            if(docs.length != 1){
                res.json({"code":202,"msg":obj.more});
            }else{
                var doc = docs[0];
                var userid = doc.userid;
                var type= doc.type;
                cremsgMod.update({"_id":cremsgid},{status:2} ,{},function(err,dd){

                });
                var arr = doc._doc.content;
                var fileds = {};
                var ent = {}
                try{
                    for(var i = 0 ; i < arr.length ; i++){
                        var n = arr[i]._doc.filedname;
                        var att = n.split(".");
                        if(att.length > 1){
                            var aa = ent[att[0]];
                            if(typeof aa == 'undefined'){
                                aa = {};

                            }
                            aa[att[1]] = arr[i]._doc.value;
                            ent[att[0]] = aa;
                        }else{
                            ent[n] = arr[i]._doc.value;
                        }

                        fileds[n] = arr[i]._doc.value;
                    }}catch(e){
                    console.log(e);
                }
                if(type == 1){
                    userMod.update({"_id":userid},{'usertype':"1"},{},function(){});
                    teachercertMod.find({"userid":userid},function(err,co){
                        if(co.length == 1){
                            var mod = co[0];
                            if(ent.servexerti != undefined){
                                ent.servexerti = JSON.parse(ent.servexerti);
                            }
                            teachercertMod.update({"_id":mod._id},{ $set: ent},{},function(err,dddd){
                                teachercertMod.find({"userid":userid},function(err,xx){
                                    userMod.update({"_id":userid},{"tcredinfo":xx[0]},{},function(err){});
                                });
                            });
                        }else if(co.length == 0){
                            ent.userid = userid;
                            ent._id = uuid.v4();
                            if(ent.servexerti != undefined){
                                ent.servexerti = JSON.parse(ent.servexerti);
                            }
                            var en = new teachercertMod(ent);
                            en.save(function(err,eee){
                                console.log(eee);
                                teachercertMod.find({"userid":userid},function(err,xx){
                                    userMod.update({"_id":userid},{"tcredinfo":xx[0]},{},function(err){});
                                });
                            })
                        }
                    });
                }else{
                    userMod.update({"_id":userid},{'usertype':"2"},{},function(){});
                    console.log(12233);
                    agencyredMod.find({"userid":userid},function(err,co){
                        if(co.length == 1){
                            var mod = co[0];
                            if(ent.servexerti != undefined){
                                ent.servexerti = JSON.parse(ent.servexerti);
                            }
                            agencyredMod.update({"_id":mod._id},{ $set: ent},{},function(err,dddd){
                                agencyredMod.find({"userid":userid},function(err,xx){
                                    userMod.update({"_id":userid},{"agencyredinfo":xx[0]},{},function(err){});
                                });
                            });
                        }else if(co.length == 0){
                            ent.userid = userid;
                            var agencyid = uuid.v4();
                            ent._id = agencyid;
                            if(ent.servexerti != undefined){
                                ent.servexerti = JSON.parse(ent.servexerti);
                            }
                            var en = new agencyredMod(ent);

                            console.log(ent);
                            en.save(function(err,eee){
                                console.log(err);
                                agencyredMod.find({"userid":userid},function(err,xx){
                                    userMod.update({"_id":userid},{"agencyredinfo":xx[0],"acredid":agencyid},{},function(err){});
                                });
                            })
                        }
                    });
                }

                res.json({ "code":200,
                    "msg":obj.operate});


            }
        });

    }else{
        cremsgMod.update({"_id":cremsgid},{$set:{"status":"3"}},{},function(dd){
            res.json({
                "code":200,
                "msg":obj.operate
            });
        });
    }
}

