var usersDBModel = require('../model/user');
var userMod = new usersDBModel.Schema('user').model;
var md5 = require('md5');
var uuid = require('node-uuid');

var turelSchema = require('../model/turel');
var turelMod = turelSchema.Schema('turel').model;

var proxyreqSchema = require('../model/proxyreq');
var proxyreqMod = proxyreqSchema.Schema('proxyreq').model;

var ucrelSchemaDBModel = require('../model/ucrel');
var ucrelMod = new ucrelSchemaDBModel.Schema('ucrel').model;

var courseSchemaDBModel = require('../model/course');
var courseMod = new courseSchemaDBModel.Schema('course').model;

var underscore  = require('underscore');
var async = require('async');
var calnodeDBModel = require('../model/calnode');
var calnodeMod = new calnodeDBModel.Schema('calnode').model;

var agencyteacherModel = require('../model/agencyteacher');
var agencyteacherMod = new agencyteacherModel.Schema('agencyteacher').model;

var proxyreqDBModel = require('../model/proxyreq');
var proxyreqMod = new proxyreqDBModel.Schema('proxyreq').model;

exports.agenciesList= function (req, res) {
    var ag=[{
        name:'AGENCIES2',
        imgUrl:'/Inspinia/img/a1.jpg',
        level:'one star',
        location:'Hangzhou',
        area:'Math',
        introduction:'CC DD ZZ'
    },{
        name:'AGENCIES1',
        imgUrl:'/Inspinia/img/a1.jpg',
        level:'five star',
        location:'Beijing',
        area:'English',
        introduction:'CC FF ZZ'
    },{
        name:'AGENCIES3',
        imgUrl:'/Inspinia/img/a1.jpg',
        level:'three star',
        location:'Shanghai',
        area:'English',
        introduction:'CC AA ZZ'
    }];
    res.json(ag)
};

//查询机构用户基本信息
exports.agenciesbasicinfo = function(req, res){
    var usertype = req.session.user.usertype;
    var userid = req.session.user.userid;
    if(usertype == 2){
        userMod.find({
                _id:userid
            },
            '-_id, -password'
            , function(err, item){
                if (err){
                    res.json({
                        state:false,
                        msg:'fail',
                        data:null
                    });
                }else{
                    res.json ( {
                        state: true,
                        msg: 'success',
                        data: item[0]
                    });
                }
            });
    }
};

//机构用户的密码更新
exports.updateAgenciesPassword = function(req, res){
    var usertype = req.session.user.usertype;
    var userid = req.session.user.userid;
    var info = JSON.parse(req.body.data);
    var oPassword =md5(String(info.oldPassword));
    var nPassword = md5(String(info.newPassword));
    if(usertype == 2){
        userMod.find({
                _id:userid
            },
            'password',
            function(err , list){
                if (err){
                    res.json({
                        state:false,
                        msg:'fail'
                    })
                }else{
                    if(list[0].password ==oPassword){
                        userMod.update({
                                _id:userid
                            },
                            {
                                $set:{
                                    password:nPassword
                                }
                            },
                            function(err){
                                if (err){
                                    res.json({
                                        state:false,
                                        msg:'fail'
                                    })
                                }else{
                                    req.session.destroy(function(err) {
                                        // cannot access session here
                                        res.json({
                                            state:true,
                                            msg:'success'
                                        });
                                    })
                                }
                            })
                    }else{
                        res.json({
                            state:false,
                            msg:'fail'
                        })
                    }
                }
            });
    }
};

//机构用户下查询我的学生

//####################################################################
//查询我的学生
//@param state -1：所有,0:正在授课 1:曾经授课(默认-1)
//url: http://localhost:3000/agencies/queryMyStudents?state=0
//####################################################################
exports.queryMyStudents = function (req, res, next) {
    var aUserID = req.session.user.userid;//机构用户id
    var series = ['courseID', 'name'];
    var courseID = {};
    var resultEnd = [];
    var index=0;
    var keyword = '';
    var state = -1;//前端取值，默认状态 -1 为取全部学生，0取正在上课的学生，1取曾经上课的学生
    if (req.query.keyword) keyword = req.query.keyword;
    if (req.query.state) state = parseInt(req.query.state);

    var query;
    if (state == -1) {
        query = {$gte:2};//大于等于2 ->正在上课，曾经上课
    } else if (state == 0) {
        query = 2;       //等于2 ->正在上课
    } else if (state == 1) {
        query = 3;      //等于3 ->曾经上课
    }

    async.eachSeries(
        series,
        function(item, callback){
            switch (item){
                case 'courseID':
                    proxyreqMod.find({'agencyid':aUserID,'type':2,'status':2},//type->2 老师授权给机构，status->2 机构通过
                        "courseid",
                        function(err,list){
                            if (err){
                                res.json({
                                    state:false,
                                    data:null
                                });
                                callback();
                            }else{
                                courseID={
                                    state:true,
                                    data:list
                                };
                                callback();
                            }
                        }
                    );
                    break;
                case 'name':
                    if(courseID.data){
                        courseID.data.forEach(function(value){
                            if(value.courseid){
                                ucrelMod.find({"courceid":value.courseid,"relation.type":query })
                                    .populate([
                                    {"path":"userid","select":"name"},
                                    {"path":"courceid","select":"name"},
                                    {"path":"teacherid","select":"name"}
                                    ])
                                    .exec(function(err,item){
                                        if(err){
                                            console.log(err);
                                        }
                                        else{
                                            if(item[0]){
                                                if(item[0].userid && item[0].userid.name.indexOf(keyword)>-1){
                                                    resultEnd.push(item[0]);
                                                }
                                            }
                                            index++;
                                            if(index==courseID.data.length){
                                                res.json(resultEnd);
                                            }
                                        }
                                    });
                            }
                        })
                    }
                    break;
            }
        },
        function (err) {
            if (err) {
               console.log(err);
            } else {
                res.json(resultEnd);
            }
        }
    );
};

//####################################################################
//统计（统计图表用）
//url: http://localhost:3000/agencies/queryMyStudentsCharts
//####################################################################
exports.queryMyStudentsCharts = function (req, res) {
    //var aUserID = req.session.user.userid;//机构用户id
    //var series = ['courseID', 'name'];
    //var courseID = {};
    //var dataArr = [];
    //var tasks = ["all","teaching","teached"];
    //var totalCount = 0;
    //var studentID = [];
    //var resultid = [],hash = {};
    //var countFun = function(dataArr,task,labelName,callback){
    //        async.eachSeries(
    //        series,
    //        function(item, callback){
    //            switch (item){
    //                case 'courseID':
    //                    proxyreqMod.find({'agencyid':aUserID,'type':2,'status':2},//type->2 老师授权给机构，status->2 机构通过
    //                        "courseid",
    //                        function(err,list){
    //                            if (err) console.log(err);
    //                            else{courseID={state:true, data:list};}
    //                            callback();
    //                        }
    //                    );
    //                    break;
    //                case 'name':
    //                    var index=0;
    //                    var querytype ;
    //                    if(task=="all")querytype =  {'$gte':2};//所有学生
    //                    if(task=="teaching")querytype = 2;//正在授课
    //                    if(task=="teached")querytype =  3;//曾经授课
    //                    courseID.data.forEach(function(value){
    //                        ucrelMod.find({"courceid":value.courseid,"relation.type":querytype },
    //                            'userid',
    //                            function(err,collection){
    //                                if(err) console.log(err);
    //                                else{
    //                                    if(collection[0]){
    //                                        studentID.push(collection[0].userid);
    //                                        index++;
    //                                        console.log("------------------index----------------");
    //                                        console.log(index);
    //                                        if(index==courseID.data.length){
    //                                            for (var i = 0, elem; (elem = studentID[i]) != null; i++) {
    //                                                if (!hash[elem]) {
    //                                                    resultid.push(elem);
    //                                                    hash[elem] = true;
    //                                                }
    //                                            }
    //                                            totalCount++;
    //                                            dataArr.push(
    //                                                {
    //                                                    "label":labelName,
    //                                                    "value":resultid.length
    //                                                }
    //                                            );
    //                                            console.log("++++++++++++++++++++");
    //                                            console.log(totalCount);
    //                                            console.log(dataArr);
    //
    //                                        }
    //                                    }
    //                                    else{
    //                                        dataArr.push(
    //                                            {
    //                                                "label":labelName,
    //                                                "value":0
    //                                            }
    //                                        );
    //                                    }
    //                                }
    //                            })
    //                    });
    //                    break;
    //            }
    //        }
    //    );
    //    callback();
    //};
    //async.each(tasks, function (task, callback) {
    //    switch (task){
    //        case "all":
    //            countFun(dataArr,task,"所有学生",callback);
    //            break;
    //        case "teaching":
    //            countFun(dataArr,task,"正在授课",callback);
    //            break;
    //        case "teached":
    //            countFun(dataArr,task,"曾经授课",callback);
    //            break;
    //    }
    //}, function (err) {
    //    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!");
    //    console.log(dataArr);
    //    res.json({
    //        total:totalCount,
    //        data:dataArr,
    //        colors:['#87d6c6', '#54cdb4', '#1ab394']
    //    });
    //});

};

//读取日历中的节点
//限制条件可能不够
exports.agenciesCalendar=function(req,res){
    var userid=req.session.user.userid;
    var series=['courseid','calnode'];
    var result = {};

    async.eachSeries(
        series,
        function (item, callback) {
            switch (item) {
                case 'courseid':
                    proxyreqMod.find({
                            type:2,
                            status:2,
                            enable:true,
                            agencyid:userid
                        },
                        'courseid -_id',
                        function (err, list) {
                            if (err) {
                                result = {
                                    state: false,
                                    data: null
                                };
                                callback();
                            }
                            else {
                                result = {
                                    state: true,
                                    data: list
                                };
                                callback();

                            }
                        });
                    break;
                case 'calnode':
                    if (result.state) {
                        var course=result.data;
                        var arr=[];
                        for(var i=0;i<course.length;i++){
                            arr.push(course[i].courseid);
                        };
                        calnodeMod.find({
                            courseid:{$in :arr}
                            }, {tdate: 1, name: 1, courseid:1,state:1, _id: 0})
                            .exec(function (err, list) {
                                if (err) {
                                    result.state = false;
                                    result.end = null;
                                    callback();
                                }
                                else {
                                    result.state = true;
                                    result.end = list;
                                    callback();
                                }
                            });
                    }
                    else {
                        result = {
                            state: false,
                            end: null
                        };
                        callback();
                    }
                    break;

            }
        },
        function (err) {
            if (err) {
                res.json({
                    state:result.state,
                    result:result.end
                })
            } else {
                res.json({
                    state:result.state,
                    result:result.end
                })
            }
        });
};

//更改机构用户基本信息
exports.updateAgenciesInfo = function(req,res){
    var usertype = req.session.user.usertype;
    var userid = req.session.user.userid;
    var info = JSON.parse(req.body.data);
    if(usertype == 2){
        userMod.update({
                _id:userid
            },{
                $set:{
                    name:info['name'],
                    email:info['email'],
                    phone:info['phone'],
                    city:info['city'],
                    agenciesinfo:info['agenciesinfo'],
                    location:{lat:info['lat'],lng:info['lng']}
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
                    res.json({
                        state:true,
                        msg:'success',
                        data:info
                    })
                }
            });
    }
};




//推荐的机构
exports.recommendation = function(req, res){
    console.log(req.query);
    if (typeof(req.query.type ) != 'undefined'){

        var usern = {};

        if(req.query.fuzzyquery!='all'){
            var fuzzyquery = [];
            var queryreg = new RegExp(req.query.fuzzyquery);
            fuzzyquery.push({'agencyredinfo.name':queryreg});
            fuzzyquery.push({'agencyredinfo.legalinfo.name':queryreg});
            fuzzyquery.push({'city':queryreg});
            usern['$or'] = fuzzyquery;
        }
        usern['usertype'] = req.query.qo.usertype;
        usern['enable'] = req.query.qo.enable;
        var sorttag = {};
        var sortdistance = false;
        var userlocation = {lng:120.25,
            lat:30.15};
        if(req.query.sorttag=='starlevel'){
            sorttag = {'starlevel':-1};
        }
        var series = ['distance', 'manage'];
        var result = {};
        async.eachSeries(
            series,
            function(serieStep, callback){
                switch (serieStep){
                    case 'distance':
                        if(req.session.user!='undefined' && req.query.sorttag=='distance'){
                            userMod.find({'_id':req.session.user.userid})
                                .exec(function(err, docs){
                                    if (err){
                                        result.distance = {
                                            state:false,
                                            data:{},
                                            msg:'fail'
                                        }
                                        callback();
                                    }else{
                                        var user = docs[0];
                                        if(user.location.lat&&user.location.lng){
                                            userlocation = user.location;
                                            sortdistance= true;
                                        }else{
                                            userlocation = {
                                                lng:120.25,
                                                lat:30.15
                                            };
                                            sortdistance= true;
                                        }

                                        result.distance = {
                                            state:true,
                                            data:{},
                                            msg:'success'
                                        }
                                        callback();
                                    }

                                });
                        }else{
                            result.distance = {
                                state:true,
                                data:null,
                                msg:'success'
                            }
                            callback();
                        }

                        break;
                    case 'manage':
                        if (!result.distance.state){
                            result.manage = {
                                state:false,
                                msg:'fail',
                                data:null
                            }
                            callback();
                        }else{
                            userMod.find(usern, "-managecourses,-tcredinfo,-email,-phone,-password")
                                .sort(sorttag)
                                .exec(function(err, docs){
                                    if (err){
                                        result.manage = {
                                            state:false,
                                            msg:'fail',
                                            data:null
                                        }
                                        callback();
                                    }else{
                                        console.log(docs.length);
                                        var docarr=docs;
                                        if(sortdistance){
                                            underscore.each(docs, function(item){
                                                item.distance = Math.pow(item.location.lat-userlocation.lat, 2)+Math.pow(item.location.lng-userlocation.lng, 2);
                                            });
                                            docarr = underscore.sortBy(docs,function(location){
                                                return location.distance;
                                            });
                                        };

                                        var resjson = {};
                                        var count;

                                        count = docarr.length;
                                        var page = req.query.page;
                                        var num = req.query.limit;
                                        var arr2 = [];
                                        var total = page*num;
                                        if (total > count){
                                            total = count;
                                        }
                                        for (var j = (page-1)*num; j < total; j++){
                                            arr2.push(docarr[j]);

                                        }
                                        console.log('--------mark-------------');
                                        console.log(arr2.length);
                                        var collection = [];
                                        var stararray = ['一星级','二星级','三星级','四星级','五星级'];
                                        for(var i=0; i<arr2.length; i++){
                                            var model = {};
                                            model['uuid'] = arr2[i]._id;
                                            model['name'] = (arr2[i].agencyredinfo)?arr2[i].agencyredinfo.name:'';
                                            model['city'] = arr2[i].city;
                                            model['phone'] = arr2[i].phone;
                                            model['location'] = arr2[i].location;
                                            model['image'] = (arr2[i].agencyredinfo)?arr2[i].agencyredinfo.image:'';
                                            model['starlevel'] = stararray[arr2[i].starlevel];
                                            model['coursecount'] = arr2[i].coursecount;
                                            model['teachercount'] = arr2[i].teachercount;

                                            collection.push(model);
                                        }
                                        resjson['count'] = count;
                                        resjson['collection'] = collection;

                                        result.manage = {
                                            state:true,
                                            msg:'success',
                                            data:resjson
                                        }

                                        callback();

                                    }


                                })
                        }

                        break;
                }
            },
            function(err){
                if (err){
                    res.json({
                        count:0,
                        collection:[]
                    });
                }else{
                    if (!result.manage.state){
                        res.json({
                            count:0,
                            collection:[]
                        });
                    }else{
                        res.json(result.manage.data);
                    }
                }
            }
        )

    }
    else{
        res.json({
            count:0,
            collection:[]
        });
    }
}

//机构的详细资料
exports.searchOneDetail = function(req, res){
    console.log(req.query);
    if (typeof(req.query.type ) != 'undefined'){
        var qo = req.query.qo;

        //console.log(usern);
        userMod.find(qo)
            .exec(function(err, docs){
                console.log(err);

                var doc = docs[0];
                var model = {};

                var stararray = ['一星级','二星级','三星级','四星级','五星级'];
                model['uuid'] = doc._id;
                model['name'] = (doc.agencyredinfo)?doc.agencyredinfo.name:'';
                model['city'] = doc.city;
                model['phone'] = doc.phone;
                model['location'] = doc.location;
                model['image'] = (doc.agencyredinfo)?doc.agencyredinfo.image:'';
                model['introduction'] = (doc.agencyredinfo)?doc.agencyredinfo.introduction:'';
                model['legalname'] = (doc.agencyredinfo)?doc.agencyredinfo.legalinfo.name:'';
                model['servexerti'] = (doc.agencyredinfo)?doc.agencyredinfo.servexerti:[];
                model['starlevel'] = stararray[doc.starlevel];
                model['coursecount'] = doc.coursecount;
                model['teachercount'] = doc.teachercount;
                res.json(model);
            })
    }else{
        res.json(

        );
    }
}

exports.courseFavMark = function(req, res){
    if (!req.session.user){
        res.json({
            state:false,
            msg:'请登录',
            data:null
        });
        return;
    }

    var userid = req.session.user.userid;
    var courseid = req.query.courseid;

    var series = ["cando", "course", "relation"];
    var result = {};

    async.eachSeries(
        series,
        function(item, callback){
            switch (item){
                case 'cando':
                    courseMod.find({
                            _id:courseid,
                            userid:userid,
                            enable:true
                        },
                        function(err, courseList){
                            if (err){
                                result.cando = {
                                    state:false,
                                    msg:'操作失败',
                                    data:null
                                };
                                callback();
                            }else{
                                if (courseList.length > 0){
                                    result.cando = {
                                        state:false,
                                        msg:'此课程为您自己所发布,不可收藏',
                                        data:null
                                    }
                                    callback();
                                }else{
                                    result.cando = {
                                        state:true,
                                        msg:'success',
                                        data:null
                                    }
                                    callback();
                                }
                            }
                        })
                    break;
                case 'course':
                    if (!result.cando.state){
                        result.course = {
                            state:false,
                            msg:result.cando.msg,
                            data:null
                        }
                        callback();
                    }else{
                        courseMod
                            .findOne({
                                _id:courseid,
                                enable:true
                            })
                            .populate({
                                path:userid,
                                select:"_id name"
                            })
                            .exec(function(err, course){
                                if (err){
                                    result.course = {
                                        state:false,
                                        msg:'操作失败',
                                        data:null
                                    }
                                    callback();
                                }else{

                                    result.course = {
                                        state:true,
                                        msg:'success',
                                        data:course
                                    }
                                    callback();
                                }
                            })
                    }
                    break;
                case 'relation':
                    if (!result.course.state){
                        result.relation = {
                            state:false,
                            msg:result.course.msg,
                            data:null
                        }
                        callback();
                    }else{

                        var xx = {"userid":userid,"courceid":result.course.data._id,"teacherid":result.course.data.userid,"enable":true,'relation.type':0};

                        ucrelMod.find(xx,
                            function(err,coll) {

                                if (err) {
                                    result.relation = {
                                        state: false,
                                        msg: '操作失败',
                                        data: null
                                    }
                                    callback();
                                } else {
                                    if (coll.length == 0) {
                                        var ucrel = {
                                            userid:userid,
                                            relation:{
                                                type:0,
                                                name:'收藏'
                                            },
                                            courceid:result.course.data._id,
                                            teacherid:result.course.data.userid,
                                            state:1,
                                            enable:true
                                        };

                                        var entity = new ucrelMod(ucrel);
                                        entity.save(function(err){
                                            if (err){
                                                result.relation = {
                                                    state:false,
                                                    msg:'操作失败',
                                                    data:null
                                                }
                                                callback();
                                            }else{
                                                result.relation = {
                                                    state:true,
                                                    msg:'success',
                                                    data:null
                                                }
                                                callback();
                                            }
                                        });
                                    }else{
                                        result.relation = {
                                            state:false,
                                            msg:"您已经收藏过该课程",
                                            data:null
                                        }
                                        callback();
                                    }
                                }
                            });

                    }
                    break;
            }
        },
        function(err){
            if (err){
                res.json({
                    state:false,
                    msg:'操作失败',
                    data:null
                });
            }else{
                if (!result.relation.state){
                    res.json({
                        state:false,
                        msg:result.relation.msg,
                        data:null
                    })
                }else{
                    courseMod.update({"_id":courseid},  {"$inc":{"favnum":1}},{},function(err){

                        res.json({
                            state:true,
                            msg:'收藏成功',
                            data:null
                        })
                    });

                }
            }
        }
    )
}

//教师申请成为机构旗下教师
exports.joinAgency = function(req, res){
    if (!req.session.user){
        res.json({
            state:false,
            msg:'请登录',
            data:null
        });
        return;
    }

    if (req.session.user.usertype!=1){
        res.json({
            state:false,
            msg:'对不起,请先认证为老师用户',
            data:null
        });
        return;
    }

    var userid = req.session.user.userid;
    var agencyid = req.query.agencyid;

    proxyreqMod.findOne({
            type:1,
            teacherid:userid,
            agencyid:agencyid,
            enable:true
        },
        function(err, proxyreq){
            if (err){
                res.json({
                    state:false,
                    msg:'操作失败',
                    data:null
                });
                return;
            }else{
                if (proxyreq){
                    switch(proxyreq.status){
                        case '1':
                            res.json({
                                state:true,
                                msg:'你的申请正在处理中,请耐心等待!',
                                data:null
                            });
                            break;
                        case '2':
                            res.json({
                                state:false,
                                msg:'你已经是该机构的认证老师,不需要再申请!',
                                data:null
                            });
                            break;
                        case '3':
                            proxyreqMod.update({"_id":proxyreq._id},{"status":1} ,{},function(err,docs){
                                if(err){
                                    res.json({
                                        state:false,
                                        msg:'数据库错误!',
                                        data:null
                                    });
                                }else{
                                    res.json({
                                        state:true,
                                        msg:'你的申请正在处理中,请耐心等待!',
                                        data:null
                                    });
                                }
                            });
                            break;
                        case '4':
                            proxyreqMod.update({"_id":proxyreq._id},{"status":1} ,{},function(err,docs){
                                if(err){
                                    res.json({
                                        state:false,
                                        msg:'数据库错误!',
                                        data:null
                                    });
                                }else{
                                    res.json({
                                        state:true,
                                        msg:'你的申请正在处理中,请耐心等待!',
                                        data:null
                                    });
                                }
                            });
                            break;
                    };
                    return;
                }else{
                    var proxyreq = {
                        _id:uuid.v4(),
                        type:1,
                        status:"1",
                        teacherid:userid,
                        agencyid:agencyid,
                        courseid:'',
                        enable:true
                    };
                    var proxyreqEntity = new proxyreqMod(proxyreq);
                    proxyreqEntity.save(function(err){
                        if (err){
                            res.json({
                                state:false,
                                msg:'操作失败',
                                data:null
                            });
                        }else{
                            res.json({
                                state:true,
                                msg:'你的申请已被受理,请耐心等待!',
                                data:null
                            });
                        }
                    })
                    return;
                }
            }
        })
}

//####################################################################
//查询机构下面的老师
//url: http://localhost:3000/agencies/teacher
//####################################################################
exports.agenciesTeacher = function(req,res){
    var mUserid = '';
    //session
    if (req.session.user) {
        /*if (req.session.user.usertype){
           var usertype = req.session.user.usertype;
        } */
        if (req.session.user.userid) mUserid = req.session.user.userid;
    }
    var mAgencyid;
    //query params
    var keyword = '';
    var count = 20; //默认数据20个
    if (req.query) {
        if (req.query.keyword) keyword = req.query.keyword;
        if (req.query.count) count = parseInt(req.query.count);
        if (req.query.agencyid) mAgencyid = parseInt(req.query.agencyid);
    }
    var teachers;
    var state = 'success';

    var tasks = ['get-agencyid', 'get-agencyteacher'];
    async.eachSeries(tasks, function (item, callback) {
        switch (item) {
            case 'get-agencyid':
                if(!mAgencyid){
                    userMod.findOne({
                            _id:mUserid
                        },
                        '-_id, -password'
                        )
                        .exec(function (err, doc) {
                            if (err){
                                console.log(err);
                            }
                            else{
                                mAgencyid = doc.acredid;
                            }
                            callback();
                        });
                }else{
                    callback();
                }
                break;
            case 'get-agencyteacher':
                if(!mAgencyid){
                    state = 'failed';
                    callback();
                }else{
                    agencyteacherMod.find({agencyid:mAgencyid})
                        .exec(function(err, docs){
                            if(err) state = 'failed';
                            teachers = docs;
                            callback();
                        });
                }

                break;
        }
    }, function (err) {
        if (err) res.json(err);
        res.json({
            state:state,
            teachers:teachers
        })
    });

}

//####################################################################
//查询机构列表(优先级：老师所属机构,星级)
//url: http://localhost:3000/agencies/agenciesListByTeacherId?limit=10&page=1
//####################################################################
//老师授权给机构，机构列表
exports.agenciesListByTeacherId = function(req, res){
    var mTeacherid;
    //session
    if (req.session.user) {
        if (req.session.user.userid) mTeacherid = req.session.user.userid;
    }
    //query params
    var limit = 10; //一页个数
    var page = 0; //默认从0开始
    if (req.query) {
        if (req.query.teacherid) mTeacherid = req.query.teacherid;
        if (req.query.limit) limit = parseInt(req.query.limit);
        if (req.query.page) page = parseInt(req.query.page);
    }
    var skip = page * limit;

    if (!mTeacherid) {
        res.json('need param teacherid!');
        return;
    }

    var tasks = ['count','get-proxyreq', 'get-agencies-in','get-agencies-nin'];
    var agencyidIds = [];
    var results = [];
    var isIns = [];
    var total = 0;
    async.eachSeries(tasks, function (item, callback) {
        switch (item) {
            case 'count':
                userMod.count({usertype:2})
                    .exec(function (err, doc) {
                        if (err) console.log(err);
                        if(doc){
                            total = parseInt(doc);
                        }
                        callback();
                    });
                break;
            case 'get-proxyreq':
                //授权申请表 机构名下老师
                proxyreqMod.find({type:1,"teacherid": mTeacherid})
                    .exec(function (err, docs) {
                        if (err) console.log(err);
                        docs.forEach(function (doc) {
                            agencyidIds.push(doc.agencyid);
                        });
                        callback();
                    });
                break;
            case 'get-agencies-in':
                userMod.find({"_id": { $in: agencyidIds},usertype:2}).sort({starlevel:-1}).limit(limit).skip(skip)
                    .exec(function (err, docs) {
                        if (err) console.log(err);
                        if (docs && docs.length) {
                            console.log('222');
                            docs.forEach(function (doc) {
                                isIns.push({in:1}); //表面是旗下老师
                                results.push(doc);
                            });
                            ///results = docs;
                        }
                        callback();
                    });
                break;
            case 'get-agencies-nin':
                var count = results.length;
                if(count == limit){
                    callback();
                }else{
                    var skip2 =  skip - agencyidIds.length;
                    var limit2 = skip2 + limit;
                    if (skip2 < 0) {
                        skip2 = 0;
                    }
                    if (limit2 > limit) {
                        limit2 = limit;
                    }
                    userMod.find({"_id": { $nin: agencyidIds},usertype:2}).sort({starlevel:-1}).limit(limit2).skip(skip2)
                        .exec(function (err, docs) {
                            if (err) console.log(err);
                            docs.forEach(function (doc) {
                                isIns.push({in:0});
                                results.push(doc);
                            });
                            callback();
                        });
                }

                break;
        }
    }, function (err) {
        if (err) res.json(err);
        res.json({total: total, data: results,isIns:isIns});
    });
}

