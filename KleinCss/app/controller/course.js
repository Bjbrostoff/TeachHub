var async = require('async');
var uuid = require('node-uuid');
var  i18n = require("i18n");
var userSchemaDBmodel = require('../model/user');
var courseSchemaDBModel = require('../model/course');
var cremsgSchemaDBModel = require('../model/cremsg');
var ucrelSchemaDBModel = require('../model/ucrel');
var turelSchemaDBModel = require('../model/turel');
var turelSchemaDBModel = require('../model/turel');
var proxyreqSchemaDBModel = require('../model/proxyreq');

var userMod = new userSchemaDBmodel.Schema('user').model;

var courseMod = new courseSchemaDBModel.Schema('course').model;

var cremsgMod = new cremsgSchemaDBModel.Schema('cremsg').model;

var ucrelMod = new ucrelSchemaDBModel.Schema('ucrel').model;

var turelMod = new turelSchemaDBModel.Schema('turel').model;

var proxyreqMod = new proxyreqSchemaDBModel.Schema('proxyreq').model;

var _courseStatelv ={
    acting:2, //进行中
    publish:1, //发布中
    sellout:3, //已下架
    new:0,//未公开
    all:-1//所有课程
}

//---------------------------
//课程管理获取进行中、发布中、已下架、未公开等课程
//@method： get
//@author: chenshi
//@param userid:可选（不传则从session里面取）
//@param usertype:可选（不传则从session里面取）
//
getCourses = function(req, res,statelv){
    var userid = req.session.user.userid;
    var usertype = req.session.user.usertype;
    if (req.query) {
        if(req.query.usertype) usertype = req.query.usertype;
        if(req.query.userid) userid = req.query.userid;
    }
    //教师用户
    if(usertype == 1){
        var query = {
            userid:userid,
            'statelv.lv':statelv
        };
        if(statelv == _courseStatelv.all){
            query = {
                userid:userid,
                enable:true
            }
        }
        courseMod.find(query,
            function(err, courseList){
                if (err){
                    res.json([]);
                }else{
                    for (var i = 0; i < courseList.length; i++){
                        var item = courseList[i];
                        item._doc.id = item._id;
                    }
                    res.json(courseList);
                }
            });
    } else if (usertype == 2) {
        var courses = [];
        var match = {
            'statelv.lv':statelv
        };
        if(statelv == _courseStatelv.all){
            match = {
                enable:true
            }
        }
        proxyreqMod.find(
            {
                agencyid: userid,
                status:2 //必须通过审核的课程
            }
            )
            .populate(
                {
                    path: 'courseid',
                    select: {},
                    model: "course",
                    match: match
                }
            )
            .exec(function(err,docs){
                if(err){
                    res.json("query error");
                }
                docs.forEach(function (value) {
                    if(value.courseid) {
                        var course = value.courseid;
                        course._doc.id = course._id;
                        courses.push(course);
                    }
                });
                res.json(courses);
            });
    }else{
        res.json("you have not permission!");
    }

}
//进行中的课程
exports.myActCourses = function(req, res){
    getCourses(req,res,_courseStatelv.acting);
    /*var userid = req.session.user.userid;

    courseMod.find({
        userid:userid,
        'statelv.lv':2
    },
    function(err, courseList){
        if (err){
            res.json([]);
        }else{
            for (var i = 0; i < courseList.length; i++){
                var item = courseList[i];
                item._doc.id = item._id;
            }
            res.json(courseList);
        }
    });*/
}

//已发布的课程
exports.myPubCourses = function(req, res){
    getCourses(req,res,_courseStatelv.publish);
    /*var userid = req.session.user.userid;

    courseMod.find({
            userid:userid,
            'statelv.lv':1
        },
        function(err, courseList){
            if (err){
                res.json([]);
            }else{
                for (var i = 0; i < courseList.length; i++){
                    var item = courseList[i];
                    item._doc.id = item._id;
                }
                res.json(courseList);
            }

        });*/
}

//未公开的课程
exports.myNewCourses = function(req, res){
    getCourses(req,res,_courseStatelv.new);
    /*var userid = req.session.user.userid;

    courseMod.find({
            userid:userid,
            'statelv.lv':0
        },
        function(err, courseList){
            if (err){
                res.json([]);
            }else{
                for (var i = 0; i < courseList.length; i++){
                    var item = courseList[i];
                    item._doc.id = item._id;
                }
                res.json(courseList);
            }
        });*/
}

//已下架的课程
exports.mySelloutCourses = function(req, res){
    getCourses(req,res,_courseStatelv.sellout);
    /*var userid = req.session.user.userid;

    courseMod.find({
            userid:userid,
            'statelv.lv':3
        },
        function(err, courseList){
            if (err){
                res.json([]);
            }else{
                for (var i = 0; i < courseList.length; i++){
                    var item = courseList[i];
                    item._doc.id = item._id;

                }
                res.json(courseList);
            }
        });*/
}

//所有课程
exports.myAllCourses = function(req, res){
    getCourses(req,res,_courseStatelv.all);
    /*var userid = req.session.user.userid;

    courseMod.find({
            userid:userid,
            enable:true
        },
        function(err, courseList){
            if (err){
                res.json([]);
            }else{
                for (var i = 0; i < courseList.length; i++){
                    var item = courseList[i];
                    item._doc.id = item._id;
                }
                res.json(courseList);
            }
        });*/
}

//图表统计
exports.myAllCoursesCharts = function(req, res){
    var obj=__('courseManage');
    var mUserid,mUserType;
    if (req.session.user) {
        mUserid = req.session.user.userid;
        mUserType = req.session.user.usertype;
    }
    if (req.query) {
        if(req.query.usertype) mUserType = req.query.usertype;
        if(req.query.userid) userid =  req.query.userid;
    }


    var dataArr = [];
    var tasks = ["myActCourses", "myPubCourses","myNewCourses","mySelloutCourses"];
    var totalCount = 0;
    var countFun = function(statelv,labelName,callback){
        //教师用户
        if(mUserType == 1){
            courseMod.count(
                {
                    userid:mUserid,
                    'statelv.lv':statelv,
                    enable:true
                },
                function(err,count){
                    if(err){
                        dataArr.push(
                            {
                                "label":labelName,
                                "value":0
                            }
                        )
                    }else{
                        totalCount+=count;
                        dataArr.push(
                            {
                                "label":labelName,
                                "value":count
                            }
                        )
                    }
                    callback();
                });
        }
        else if(mUserType == 2){
            var match = {
                'statelv.lv':statelv
            };
            if(statelv == _courseStatelv.all){
                match = {
                    enable:true
                }
            }
            proxyreqMod.find(
                {
                    agencyid: mUserid,
                    status:2 //必须通过审核的课程
                }
                )
                .populate(
                    {
                        path: 'courseid',
                        select: {_id:1},
                        model: "course",
                        match: match
                    }
                )
                .exec(function(err,docs){
                    if(err){
                        dataArr.push(
                            {
                                "label":labelName,
                                "value":0
                            }
                        )
                        callback();
                    }else{
                        var count = 0;
                        docs.forEach(function (value) {
                            if(value.courseid) {
                                count++;
                            }
                        });
                        totalCount+=count;
                        dataArr.push(
                            {
                                "label":labelName,
                                "value":count
                            }
                        )
                        callback();
                    }
                });
        }
    }
    async.eachSeries(tasks, function (task, callback) {
        switch (task){
            case "myNewCourses":
                countFun(0,obj.Undisclosed,callback);
                break;
            case "mySelloutCourses":
                countFun(3,obj.offShelf,callback);
                break;
            case "myPubCourses":
                countFun(1,obj.release,callback);
                break;
            case "myActCourses":
                countFun(2,obj.acting,callback);
                break;
        }
    }, function (err) {
        var status = 'ok';
        if(totalCount == 0){ //default count
            status = 'empty reset default';
            dataArr.forEach(function (data) {
                data.value = 10;
                totalCount += 10;
            });
        }
        res.json({
            total:totalCount,
            status:status,
            data:dataArr,
            colors:[
                '#87d6c6', '#54cdb4','#1ab394','#1ab6ff'
            ]
        });
    });
};

/*****  xiaoguo  2016-01-02  *****/

var fs = require('fs');

var coursepath = "./app/config/recommendcourses.json";
var conditionpath = "./app/config/coursesearchcondition_cn.json";

//
exports.index = function(req, res){
    res.render('index/courses', {
        title:'Teach Hub'
    });
}

//推荐的课程
exports.recommendation = function(req, res){
    //console.log(req.query);
    if (typeof(req.query.type ) != 'undefined'){
        var qo = req.query.qo;
        //console.log(qo);
        //console.log(sorttag);
        var courseqo = {};
        if(qo.method != 'all'){
            if(qo.method != 'else'){
                courseqo['method.type'] = qo.method;
            }else{
                courseqo['method.type'] = -1;
            }
        }
        if(qo.range!="all"){
            if(qo.range != 'else'){
                courseqo['range.max'] = {$gte: qo.range.split("-")[0]-0};
                courseqo['range.min'] = {$lte: qo.range.split("-")[1]-0};
            }else{
                courseqo['range.max'] = -1;
                courseqo['range.min'] = -1;
            }
        }
        if(qo.billing!="all"){
            if(qo.billing != 'else'){
                courseqo['billing.fvalue'] = qo.billing;
            }else{
                courseqo['billing.fvalue'] = -1;
            }
        }
        if(qo.mode!="all"){
            if(qo.mode != 'else'){
                courseqo['mode.type'] = qo.mode;
            }else{
                courseqo['mode.type'] = -1;
            }
        }
        if(req.query.fuzzyquery!='all'){
            var fuzzyquery = [];
            var queryreg = new RegExp(req.query.fuzzyquery);
            fuzzyquery.push({'name':queryreg});
            fuzzyquery.push({'introduction':queryreg});
            fuzzyquery.push({'info':queryreg});
            fuzzyquery.push({'catalog':queryreg});
            fuzzyquery.push({'billing.fdetail':queryreg});
            fuzzyquery.push({'method.name':queryreg});
            fuzzyquery.push({'mode.name':queryreg});
            courseqo['$or'] = fuzzyquery;
        }
        courseqo['statelv.lv'] = 1;
        courseqo['statelv.type'] = 0;
        courseqo['enable'] = true;
        //var sorttag = req.query.sorttag;
        var sorttag = {};
        if(req.query.sorttag=='likes'){
            sorttag = {'likes':-1};
        }else if(req.query.sorttag=='score'){
            sorttag = {'score':-1};
        }
        //console.log(courseqo);
        courseMod.find(courseqo)
            .populate({
                path:'userid',
                select:'_id tcredinfo',
                model:"user"
            })
            .sort(sorttag)
            .exec(function(err, docs){
                console.log(err);
                var resjson = {};
                var count;
                var arr = [];
                for (var i=0; i < docs.length; i++){
                    var doc = docs[i];
                    if (doc.userid != null){
                        arr.push(doc);
                    }
                }
                count = arr.length;
                var page = req.query.page;
                var num = req.query.limit;
                //console.log(page);
                //console.log(num);
                var arr2 = [];
                var total = page*num;
                if (total > arr.length){
                    total = arr.length;
                }
                for (var j = (page-1)*num; j < total; j++){
                    arr2.push(arr[j]);
                }
                var collection = [];
                for(var i=0; i<arr2.length; i++){
                    var model = {};
                    model['courseId'] = arr2[i]._id;
                    model['name'] = arr2[i].name;
                    model['image'] = arr2[i].image;
                    model['introduction'] = arr2[i].introduction;
                    model['price'] = arr2[i].price;
                    model['teacherid'] = arr2[i].userid._id;
                    model['teachername'] = (arr2[i].userid.tcredinfo)?arr2[i].userid.tcredinfo.name:"";
                    model['agencyid'] = arr2[i].agencyid;
                    model['agencyname'] = arr2[i].agencyname;
                    collection.push(model);
                }
                resjson['count'] = count;
                resjson['collection'] = collection;
                //console.log(resjson);
                res.json(resjson);
            })
    }else{
        var coursejson = indexUtil.recomcourses();
        res.json(coursejson);
    }
}

//特定老师的课程
exports.SearchTeacherCourses = function(req, res){
    //console.log(req.query);
    if (typeof(req.query.type ) != 'undefined'){
        var qo = req.query.qo;
        //console.log(qo);
        //console.log(sorttag);
        var courseqo = {};

        if(qo.userid!='undefined'){
            courseqo['userid'] = qo.userid;
        }
        courseqo['statelv.lv'] = 1;
        courseqo['statelv.type'] = 0;
        courseqo['enable'] = true;

        console.log(courseqo);
        courseMod.find(courseqo)

            .exec(function(err, docs){
                console.log(err);
                var resjson = {};
                var count;

                count = docs.length;
                var page = req.query.page;
                var num = req.query.limit;
                //console.log(page);
                //console.log(num);
                var arr2 = [];
                var total = page*num;
                if (total > docs.length){
                    total = docs.length;
                }
                for (var j = (page-1)*num; j < total; j++){
                    arr2.push(docs[j]);
                }
                var collection = [];
                for(var i=0; i<arr2.length; i++){
                    var model = {};
                    model['courseId'] = arr2[i]._id;
                    model['name'] = arr2[i].name;
                    model['image'] = arr2[i].image;
                    model['introduction'] = arr2[i].introduction;
                    model['price'] = arr2[i].price;
                    model['info'] = arr2[i].info;
                    model['catalog'] = arr2[i].catalog;
                    model['billing'] = arr2[i].billing.fdetail;
                    model['method'] = arr2[i].method.name;
                    model['classroom'] = arr2[i].classroom;
                    model['mode'] = arr2[i].mode.name;
                    model['range'] = arr2[i].range;
                    model['score'] = arr2[i].score;
                    model['comment'] = arr2[i].comment;
                    model['cdate'] = arr2[i].cdate;
                    model['signnum'] = arr2[i].signnum;
                    model['favnum'] = arr2[i].favnum;
                    model['agencyid'] = arr2[i].agencyid;
                    model['agencyname'] = arr2[i].agencyname;
                    collection.push(model);
                }
                resjson['count'] = count;
                resjson['collection'] = collection;
                //console.log(resjson);
                res.json(resjson);
            })
    }else{

    }
}

//机构下的课程
exports.searchProxyCourses = function(req, res){
    //console.log(req.query);
    if (typeof(req.query.type ) != 'undefined'){
        var qo = req.query.qo;
        //console.log(qo);
        //console.log(sorttag);
        var courseqo = {};

        if(qo.agencyid!='undefined'){
            courseqo['agencyid'] = qo.agencyid;
        }
        courseqo['isproxy'] = 1;
        courseqo['statelv.lv'] = 1;
        courseqo['statelv.type'] = 0;
        courseqo['enable'] = true;

        console.log(courseqo);
        courseMod.find(courseqo)

            .exec(function(err, docs){
                console.log(err);
                var resjson = {};
                var count;

                count = docs.length;
                var page = req.query.page;
                var num = req.query.limit;
                //console.log(page);
                //console.log(num);
                var arr2 = [];
                var total = page*num;
                if (total > docs.length){
                    total = docs.length;
                }
                for (var j = (page-1)*num; j < total; j++){
                    arr2.push(docs[j]);
                }
                var collection = [];
                for(var i=0; i<arr2.length; i++){
                    var model = {};
                    model['courseId'] = arr2[i]._id;
                    model['name'] = arr2[i].name;
                    model['image'] = arr2[i].image;
                    model['introduction'] = arr2[i].introduction;
                    model['price'] = arr2[i].price;
                    model['info'] = arr2[i].info;
                    model['catalog'] = arr2[i].catalog;
                    model['billing'] = arr2[i].billing.fdetail;
                    model['method'] = arr2[i].method.name;
                    model['classroom'] = arr2[i].classroom;
                    model['mode'] = arr2[i].mode.name;
                    model['range'] = arr2[i].range;
                    model['score'] = arr2[i].score;
                    model['comment'] = arr2[i].comment;
                    model['cdate'] = arr2[i].cdate;
                    model['signnum'] = arr2[i].signnum;
                    model['favnum'] = arr2[i].favnum;
                    collection.push(model);
                }
                resjson['count'] = count;
                resjson['collection'] = collection;
                //console.log(resjson);
                res.json(resjson);
            })
    }else{

    }
}

//课程的详细资料
exports.searchOneDetail = function(req, res){
    if (typeof(req.query.type ) != 'undefined'){
        var qo = req.query.qo;
        courseMod.find(qo)
            .populate({
                path:'userid',
                select:'_id tcredinfo',
                model:"user"
            })
            .exec(function(err, docs){
                console.log(err);
                var doc = docs[0];
                var model = {};
                model['courseId'] = doc._id;
                model['name'] = doc.name;
                model['image'] = doc.image;
                model['introduction'] = doc.introduction;
                model['price'] = doc.price;
                model['teacherid'] = doc.userid._id;
                model['teachername'] = (doc.userid.tcredinfo)?doc.userid.tcredinfo.name:"";
                model['info'] = doc.info;
                model['catalog'] = doc.catalog;
                model['billing'] = doc.billing.fdetail;
                model['method'] = doc.method.name;
                model['classroom'] = doc.classroom;
                model['mode'] = doc.mode.name;
                model['range'] = doc.range;
                model['score'] = doc.score;
                model['comment'] = doc.comment;
                model['cdate'] = doc.cdate;
                model['signnum'] = doc.signnum;
                model['favnum'] = doc.favnum;
                model['agencyid'] = doc.agencyid;
                model['agencyname'] = doc.agencyname;
                res.json(model);
            })
    }else{
        var coursejson = indexUtil.recomcourses();
        res.json(coursejson);
    }
}

//搜索条件
exports.searchCondition = function(req, res){
    console.log(__("searchcconditionpath"));
    var conditionjson = JSON.parse(fs.readFileSync(__("searchcconditionpath")));
    res.json(conditionjson);

}

exports.courses = function(req, res, next) {
    var obj=__('courseManage');
    courseMod.find({}, function(err, listitems){
        if (err){
            console.log(err);
            res.render('index', {
                title:'404'
            })
        }else{
            res.render('course', {
                courses:listitems,
                title:obj.teacher
            });
        }

    });

}

//------------------------------------------ 用户课程逻辑 -----------------------------------------
//新建课程
exports.createNewCourse = function(req, res){
    var obj=__('courseManage');
    var userid = req.session.user.userid;
    var series = ['user', 'course'];
    var result = {};
    async.eachSeries(
        series,
        function(item, callback){
            switch (item) {
                case 'user':
                    userMod.findOne({_id:userid}, function(err, user){
                        if (err) {
                            result.user = {
                                state:false,
                                msg:'fail',
                                data:null
                            }
                            callback();

                        }else {
                            result.user = {
                                state:true,
                                msg:'success',
                                data:user
                            }
                            callback();
                        }

                    });
                    break;
                case 'course':
                    if (result.user.state == false){
                        result.course = {
                            state:false,
                            msg:'fail',
                            data:null
                        }
                        callback();
                    }
                    var theUser = result.user;
                    var crs = JSON.parse(req.body.data);
                    var uuuid = uuid.v4();
                    var course = {
                        _id:uuuid,
                        userid:userid,
                        name:crs.name,
                        introduction:crs.introduction,
                        info:crs.info,
                        catalog:crs.catalog,
                        billing:crs.billing,
                        price:crs.price,
                        method:crs.method,
                        classroom:'',
                        mode:crs.mode,
                        range:crs.range,
                        image:(crs.image)?crs.image:'/images/course1.jpg',
                        thumbnail:'',
                        score:0,
                        comment:0,
                        enable:1,
                        cdate:new Date(),
                        statelv:{
                            lv:0,
                            type:0,
                            name:obj.Notreviewed
                        },
                        signnum:0,
                        actnum:0
                    };
                    var courseEntity = new courseMod(course);
                    courseEntity.save(function(err){
                        if (err){
                            result.course = {
                                state:false,
                                msg:'fail',
                                data:null
                            }
                            callback();
                        }else{
                            course.id = course._id;
                            result.course = {
                                state:true,
                                msg:'success',
                                data:course
                            }
                            callback();
                        }
                    });
                    break;
            }
        },
        function(err){
            if (err){
                res.json({
                    state:false,
                    msg:obj.addNewCourse1,
                    data:err
                })
            }else{
                if (!result.course.state){
                    res.json({
                        state:false,
                        msg:obj.addNewCourse2+'!',
                        data:null
                    });
                }else{
                    result.course.id = result.course._id;
                    res.json({
                        state:true,
                        msg:obj.addNewCourse3+'!',
                        data:result.course.data
                    });
                }

            }
    });
}
//提交审核
exports.commitCourse = function(req, res){
    var obj=__('courseManage');
    var crsid = req.query.courseid;
    var result = {};
    var series = ['course', 'queue', 'update'];

    async.eachSeries(
        series,
        function(item, callback){
            switch (item){
                case 'course':
                    courseMod.findOne({_id:crsid}, function(err, course) {
                        if (err){
                            result.course = {
                                state:false,
                                msg:''
                            }

                        }else{
                            result.course = course;
                            result.coursemsg = {
                                state:'success',
                                msg:''
                            };


                        }
                        callback();
                    });
                    break;
                case 'queue':
                    if (result.coursemsg.state == 'fail'){
                        result.queue = null;
                        result.queuemsg = {
                            state:'fail',
                            msg:obj.fail
                        };
                        callback();
                    }
                    var cremsg = {
                        _id:uuid.v4(),
                        userid:result.course.userid,
                        type:3,
                        status:"1",
                        commitdate:new Date(),
                        finishdate:null,
                        content:null,
                        teacher:result.course.userid,
                        course:result.course._id
                    };
                    var cremsgEntity = new cremsgMod(cremsg);
                    cremsgEntity.save(function(err){
                        if (err){
                            result.queue = null;
                            result.queuemsg = {
                                state:'fail',
                                msg:obj.fail
                            };
                            callback();
                        }else{
                            result.queue = cremsg;
                            result.queuemsg = {
                                state:'success',
                                msg:obj.success
                            };
                            callback();
                        }
                    })
                    break;
                case 'update':
                    if (result.queuemsg.state == 'fail'){
                        result.update = null;
                        result.updatemsg = {
                            state:'fail',
                            msg:obj.fail
                        };
                        callback();
                    }
                    courseMod.update(
                        {_id:result.course._id},
                        {$set:{
                            statelv:{
                                lv:0,
                                type:1,
                                name:obj.waitCheck
                            }
                        }},
                        function(err){
                            if (err){
                                result.update = null;
                                result.updatemsg = {
                                    state:'fail',
                                    msg:''
                                };
                                cremsgEntity.delete({_id:result.queue._id});
                                callback();
                            }else{
                                result.course.statelv={
                                    lv:0,
                                    type:1,
                                    name:obj.waitCheck
                                };
                                result.update = {};
                                result.updatemsg = {
                                    state:'success',
                                    msg:''
                                }
                                callback();
                            }

                        });

                    break;
            }
        },
        function(err){
            if (err){
                res.json({
                    state:false,
                    msg:obj.submit2,
                    data:null
                });
            }else{
                if (result.updatemsg.state == 'fail'){
                    res.json({
                        state:false,
                        msg:obj.submit2,
                        data:null
                    });
                }else{
                    res.json({
                        state:true,
                        msg:obj.submit1,
                        data:result.course
                    });
                }

            }
        })

}
//发布课程
exports.pubCourse = function(req, res){
    var obj=__('courseManage');
    var code = req.query.courseid;

    var series = ['update', 'course', 'courses', 'redundancy'];

    var result = {};

    async.eachSeries(
        series,
        function(item, callback){
            switch (item) {
                case 'update':
                    courseMod
                        .update(
                            {
                                _id:code
                            },
                            {
                                $set:{
                                    statelv:{
                                        lv:1,
                                        type:0,
                                        name:obj.Invites
                                    }

                                }
                            },
                            function(err){
                                if (err){
                                    result.update = {
                                        state:false,
                                        msg:'fail',
                                        data:null
                                    };

                                    callback();
                                }else{
                                    result.update = {
                                        state:true,
                                        msg:'success',
                                        data:null
                                    };

                                    callback();
                                }
                            }
                        )
                    break;
                case 'course':
                    if (!result.update.state){
                        result.course = {
                            state:false,
                            msg:'fail',
                            data:null
                        };
                        callback();
                    }
                    courseMod
                        .findOne({
                            _id:code
                        },
                        function(err, course){
                            if (err){
                                result.course = {
                                    state:false,
                                    msg:'fail',
                                    data:null
                                };
                                callback();
                            }else{
                                course._doc.id = course._id;
                                result.course = {
                                    state:true,
                                    msg:'success',
                                    data:course
                                };
                                callback();
                            }
                        })
                    break;
                case 'courses':
                    if (!result.course.state){
                        result.courses = {
                            state:false,
                            msg:'fail',
                            data:null
                        };
                        callback();
                    }

                    courseMod
                        .find({
                            userid:result.course.userid,
                            'statelv.lv':{
                                $gt:0
                            }
                        },function(err, list){
                            if (err){
                                result.courses = {
                                    state:false,
                                    msg:'fail',
                                    data:null
                                };
                                callback();
                            }else{
                                result.courses = {
                                    state:true,
                                    msg:'success',
                                    data:list
                                }
                                callback();
                            }
                        })
                    break;
                case 'redundancy':
                    if (!result.courses.state){
                        result.redundancy = {
                            state:false,
                            msg:'fail',
                            data:null
                        };
                        callback();
                    }else{
                        userMod
                            .update({
                                _id:result.course.userid
                            },{
                                $set:{
                                    managecourses:result.courses.data
                                }
                            },function(err){
                                if (err){
                                    result.redundancy = {
                                        state:false,
                                        msg:'fail',
                                        data:null
                                    }
                                    callback();
                                }else{
                                    result.redundancy = {
                                        state:true,
                                        msg:'success',
                                        data:null
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
                    state:false,
                    msg:'fail',
                    data:null
                })
            }else{
                if (!result.redundancy.state){
                    res.json({
                        state:false,
                        msg:'fail',
                        data:null
                    })
                }else{
                    res.json({
                        state:true,
                        msg:'success',
                        data:result.course.data
                    })
                }

            }
        }
    )
}
//准备开课 结束接收报名
exports.readyCourse = function(req, res){
    var obj=__('courseManage');
    var userid = req.session.user.userid;
    var data = JSON.parse(req.body.data);
    var courseid = data.courseid;
    console.log('--------courseid:'+courseid);
    console.log('--------userid:'+userid);
    var signed = data.select;
    var unselect = data.unselect;

    /*
    1.更新
    2.处理学生与课程的关系
    3.处理学生与老师关系
    4.查询课程
    5.查询老师的所有课程
    6.课程数据冗余到老师的用户表
     */

    var series = ['update', 'relation', 'turel', 'course', 'courses', 'redundancy'];

    var result = {};

    async.eachSeries(
        series,
        function(item, callback){
            switch (item) {
                case 'update':
                    courseMod
                        .update(
                            {
                                _id:courseid
                            },
                            {
                                $set:{
                                    statelv:{
                                        lv:2,
                                        type:0,
                                        name:obj.ready
                                    },
                                    actnum:signed.length

                                },
                                $inc:{
                                    totalactnum:signed.length
                                }
                            },
                            function(err){
                                if (err){
                                    result.update = {
                                        state:false,
                                        msg:'fail',
                                        data:null
                                    };

                                    callback();
                                }else{
                                    result.update = {
                                        state:true,
                                        msg:'success',
                                        data:null
                                    };

                                    callback();
                                }
                            }
                        )
                    break;
                case 'relation':
                    if (!result.update.state){
                        result.relation = {
                            state:false,
                            msg:'fail',
                            data:null
                        }
                        callback();
                    }
                    else{
                        var bulk = ucrelMod.collection.initializeOrderedBulkOp();

                        for (var i=0; i < signed.length; i++){
                            bulk
                                .find(
                                    {
                                        userid:signed[i].code,
                                        courceid:courseid,
                                        'relation.type':1
                                    }
                                )
                                .update(
                                    {
                                        $set:{
                                            relation:{
                                                type:2,
                                                name:obj.class
                                            }
                                        }
                                    }
                                )
                        }

                        for (var i=0; i<unselect.length; i++){
                            bulk
                                .find({
                                    userid:unselect[i].code,
                                    courceid:courseid,
                                    'relation.type':1
                                })
                                .update({
                                    $set:{
                                        enable:false
                                    }
                                });
                        }

                        bulk.execute(function(err){
                            if (err){
                                result.relation = {
                                    state:false,
                                    msg:'fail',
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
                        })
                    }

                    break;
                case 'turel':
                    if (!result.relation.state){
                        result.turel = {
                            state:false,
                            msg:'fail',
                            data:null
                        };
                        callback();
                    }
                    else{
                        var bulk = turelMod.collection.initializeOrderedBulkOp();
                        for (var i=0; i < signed.length; i++) {
                            bulk
                                .find({
                                    subjectid: userid,
                                    objectid: signed[i].code,
                                    'relation.type': 0,
                                    enable: true
                                })
                                .update({
                                    $set: {
                                        state: {
                                            type: 0,
                                            name: obj.classing
                                        }

                                    },
                                    $inc:{
                                        coursecount:1
                                    }
                                });
                        }
                        bulk.execute(function(err){
                            if (err){
                                result.turel = {
                                    state:false,
                                    msg:'fail',
                                    data:null
                                };
                                callback();
                            }
                            else{
                                result.turel = {
                                    state:true,
                                    msg:'success',
                                    data:null
                                };
                                callback();
                            }
                        })
                    }
                    break;
                case 'course':
                    if (!result.turel.state){
                        result.course = {
                            state:false,
                            msg:'fail',
                            data:null
                        };
                        callback();
                    }else{
                        courseMod
                            .findOne({
                                    _id:courseid
                                },
                                function(err, course){
                                    if (err){
                                        result.course = {
                                            state:false,
                                            msg:'fail',
                                            data:null
                                        };
                                        callback();
                                    }else{
                                        course._doc.id = course._id;
                                        result.course = {
                                            state:true,
                                            msg:'success',
                                            data:course
                                        };
                                        callback();
                                    }
                                })
                    }

                    break;
                case 'courses':
                    if (!result.course.state){
                        result.courses = {
                            state:false,
                            msg:'fail',
                            data:null
                        };
                        callback();
                    }else{
                        courseMod
                            .find({
                                userid:result.course.userid,
                                'statelv.lv':{
                                    $gt:0
                                }
                            },function(err, list){
                                if (err){
                                    result.courses = {
                                        state:false,
                                        msg:'fail',
                                        data:null
                                    };
                                    callback();
                                }else{
                                    result.courses = {
                                        state:true,
                                        msg:'success',
                                        data:list
                                    }
                                    callback();
                                }
                            })
                    }


                    break;
                case 'redundancy':
                    if (!result.courses.state){
                        result.redundancy = {
                            state:false,
                            msg:'fail',
                            data:null
                        };
                        callback();
                    }else{
                        userMod
                            .update({
                                _id:result.course.userid
                            },{
                                $set:{
                                    managecourses:result.courses.data
                                }
                            },function(err){
                                if (err){
                                    result.redundancy = {
                                        state:false,
                                        msg:'fail',
                                        data:null
                                    }
                                    callback();
                                }else{
                                    result.redundancy = {
                                        state:true,
                                        msg:'success',
                                        data:null
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
                    state:false,
                    msg:'fail',
                    data:null
                })
            }else{
                if (!result.redundancy.state){
                    res.json({
                        state:false,
                        msg:'fail',
                        data:null
                    })
                }else{
                    res.json({
                        state:true,
                        msg:'success',
                        data:result.course.data
                    })
                }

            }
        }
    )
}
//开课 课程状态变为进行中 可以进行课程日历排课
exports.beginCourse = function(req, res){
    var obj=__('courseManage');
    var code = req.query.courseid;

    var series = ['update', 'course', 'courses', 'redundancy'];

    var result = {};

    async.eachSeries(
        series,
        function(item, callback){
            switch (item) {
                case 'update':
                    courseMod
                        .update(
                            {
                                _id:code
                            },
                            {
                                $set:{
                                    statelv:{
                                        lv:2,
                                        type:1,
                                        name:obj.acting
                                    }

                                }
                            },
                            function(err){
                                if (err){
                                    result.update = {
                                        state:false,
                                        msg:'fail',
                                        data:null
                                    };

                                    callback();
                                }else{
                                    result.update = {
                                        state:true,
                                        msg:'success',
                                        data:null
                                    };

                                    callback();
                                }
                            }
                        )
                    break;
                case 'course':
                    if (!result.update.state){
                        result.course = {
                            state:false,
                            msg:'fail',
                            data:null
                        };
                        callback();
                    }
                    courseMod
                        .findOne({
                            _id:code
                        },
                        function(err, course){
                            if (err){
                                result.course = {
                                    state:false,
                                    msg:'fail',
                                    data:null
                                };
                                callback();
                            }else{
                                course._doc.id = course._id;
                                result.course = {
                                    state:true,
                                    msg:'success',
                                    data:course
                                };
                                callback();
                            }
                        })
                    break;
                case 'courses':
                    if (!result.course.state){
                        result.courses = {
                            state:false,
                            msg:'fail',
                            data:null
                        };
                        callback();
                    }

                    courseMod
                        .find({
                            userid:result.course.userid,
                            'statelv.lv':{
                                $gt:0
                            }
                        },function(err, list){
                            if (err){
                                result.courses = {
                                    state:false,
                                    msg:'fail',
                                    data:null
                                };
                                callback();
                            }else{
                                result.courses = {
                                    state:true,
                                    msg:'success',
                                    data:list
                                }
                                callback();
                            }
                        })
                    break;
                case 'redundancy':
                    if (!result.courses.state){
                        result.redundancy = {
                            state:false,
                            msg:'fail',
                            data:null
                        };
                        callback();
                    }else{
                        userMod
                            .update({
                                _id:result.course.userid
                            },{
                                $set:{
                                    managecourses:result.courses.data
                                }
                            },function(err){
                                if (err){
                                    result.redundancy = {
                                        state:false,
                                        msg:'fail',
                                        data:null
                                    }
                                    callback();
                                }else{
                                    result.redundancy = {
                                        state:true,
                                        msg:'success',
                                        data:null
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
                    state:false,
                    msg:'fail',
                    data:null
                })
            }else{
                if (!result.redundancy.state){
                    res.json({
                        state:false,
                        msg:'fail',
                        data:null
                    })
                }else{
                    res.json({
                        state:true,
                        msg:'success',
                        data:result.course.data
                    })
                }

            }
        }
    )
}
//结课 课程上完 接受评分
exports.endCourse = function(req, res){
    var obj=__('courseManage');
    var userid = req.session.user.userid;
    var code = req.query.courseid;
    /*
    1.更新课程管理中课程状态为"结课"
    2.查询被更新的课程(获取到用户id)
    3.学生课程关系更新
    4.该课程的所有学生
    5.老师学生关系 教学课程计数减1
    6.查询用户的所有审核通过的课程
    7.课程查询结果冗余到用户表
     */
    var series = ['update', 'course', 'allstu', 'turel', 'relation', 'courses', 'redundancy'];

    var result = {};

    async.eachSeries(
        series,
        function(item, callback){
            switch (item) {
                case 'update':
                    courseMod
                        .update(
                            {
                                _id:code
                            },
                            {
                                $set:{
                                    statelv:{
                                        lv:2,
                                        type:2,
                                        name:obj.end
                                    },
                                    actnum:0,
                                    signnum:0

                                }
                            },
                            function(err){
                                if (err){
                                    result.update = {
                                        state:false,
                                        msg:'fail',
                                        data:null
                                    };

                                    callback();
                                }else{
                                    result.update = {
                                        state:true,
                                        msg:'success',
                                        data:null
                                    };

                                    callback();
                                }
                            }
                        )
                    break;
                case 'course':
                    if (!result.update.state){
                        result.course = {
                            state:false,
                            msg:'fail',
                            data:null
                        };
                        callback();
                    }
                    else{
                        courseMod
                            .findOne(
                                {
                                    _id:code
                                },
                                function(err, course){
                                    if (err){
                                        result.course = {
                                            state:false,
                                            msg:'fail',
                                            data:null
                                        };
                                        callback();
                                    }else{
                                        course.id = course._doc._id;
                                        result.course = {
                                            state:true,
                                            msg:'success',
                                            data:course
                                        };
                                        callback();
                                    }
                                }
                            )
                    }

                    break;
                case 'allstu':
                    if (!result.course.state){
                        result.allstu = {
                            state:false,
                            msg:'fail',
                            data:null
                        }
                        callback();
                    }
                    else{
                        console.log(code);
                        ucrelMod.find({
                                courceid:code,
                                'relation.type':2,
                                enable:true
                            },
                            function(err, list){
                                console.log(list);
                                if (err){
                                    result.allstu = {
                                        state:false,
                                        msg:'fail',
                                        data:null
                                    }
                                    callback();
                                }
                                else{
                                    if (list.length < 1){
                                        result.allstu = {
                                            state:false,
                                            msg:'fail',
                                            data:null
                                        }
                                        callback();
                                    }else{
                                        result.allstu = {
                                            state:true,
                                            msg:'success',
                                            data:list
                                        }
                                        callback();
                                    }

                                }
                            })

                    }
                    break;
                case 'turel':
                    if (!result.allstu.state){
                        result.turel = {
                            state:false,
                            msg:'fail',
                            data:null
                        }
                        callback();
                    }
                    else{
                        var bulk = turelMod.collection.initializeOrderedBulkOp();
                        for (var i=0;i<result.allstu.data.length;i++)
                        {
                            var titem = result.allstu.data[i];
                            bulk
                                .find({
                                    subjectid:userid,
                                    objectid:titem.userid,
                                    'relation.type':0,
                                    enable:true
                                })
                                .update({
                                    $inc:{
                                        coursecount:-1
                                    }
                                });

                        }

                        bulk.execute(function(err){
                            if (err){
                                result.turel = {
                                    state:false,
                                    msg:'fail',
                                    data:null
                                }
                                callback();
                            }
                            else{
                                result.turel = {
                                    state:true,
                                    msg:'success',
                                    data:null
                                }
                                callback();
                            }
                        })
                    }
                    break;
                case 'relation':
                    if (!result.turel.state){
                        result.relation = {
                            state:false,
                            msg:obj.operate,
                            data:null
                        };
                        callback();
                    }
                    else{
                        ucrelMod
                            .update(
                                {
                                    teacherid:userid,
                                    courceid:result.course.data._id,
                                    'relation.type':2,
                                    enable:true
                                },
                                {
                                    $set: {
                                        relation: {
                                            type: 3,
                                            name: obj.finish
                                        }
                                    }
                                },
                                function(err){
                                    if (err){
                                        result.relation = {
                                            state:false,
                                            msg:obj.operate,
                                            data:null
                                        };
                                        callback();
                                    }
                                    else{
                                        result.relation = {
                                            state:true,
                                            msg:'success',
                                            data:null
                                        };
                                        callback();
                                    }
                                }
                            )
                    }

                    break;

                case 'courses':
                    if (!result.turel.state){
                        result.courses = {
                            state:false,
                            msg:obj.operate,
                            data:null
                        };
                        callback();
                    }
                    else{
                        courseMod
                            .find({
                                userid:result.course.userid,
                                'statelv.lv':{
                                    $gt:0
                                }
                            },function(err, list){
                                if (err){
                                    result.courses = {
                                        state:false,
                                        msg:obj.operate,
                                        data:null
                                    };
                                    callback();
                                }else{
                                    result.courses = {
                                        state:true,
                                        msg:'success',
                                        data:list
                                    }
                                    callback();
                                }
                            })
                    }


                    break;
                case 'redundancy':
                    if (!result.courses.state){
                        result.redundancy = {
                            state:false,
                            msg:obj.operate,
                            data:null
                        };
                        callback();
                    }
                    else{
                        userMod
                            .update({
                                _id:result.course.userid
                            },{
                                $set:{
                                    managecourses:result.courses.data
                                }
                            },function(err){
                                if (err){
                                    result.redundancy = {
                                        state:false,
                                        msg:obj.operate,
                                        data:null
                                    }
                                    callback();
                                }else{
                                    result.redundancy = {
                                        state:true,
                                        msg:'success',
                                        data:null
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
                    state:false,
                    msg:obj.operate,
                    data:null
                })
            }else{
                if (!result.redundancy.state){
                    res.json({
                        state:false,
                        msg:obj.operate,
                        data:null
                    })
                }else{
                    res.json({
                        state:true,
                        msg:obj.finishEnd,
                        data:result.course.data
                    })
                }

            }
        }
    )
}

//下架
exports.selloutCourse = function(req, res){
    var obj=__('courseManage');
    var code = req.query.courseid;

    var series = ['update', 'course', 'courses', 'redundancy'];

    var result = {};

    async.eachSeries(
        series,
        function(item, callback){
            switch (item) {
                case 'update':
                    courseMod
                        .update(
                            {
                                _id:code
                            },
                            {
                                $set:{
                                    statelv:{
                                        lv:3,
                                        type:0,
                                        name:obj.offShelf
                                    }

                                }
                            },
                            function(err){
                                if (err){
                                    result.update = {
                                        state:false,
                                        msg:'fail',
                                        data:null
                                    };

                                    callback();
                                }else{
                                    result.update = {
                                        state:true,
                                        msg:'success',
                                        data:null
                                    };

                                    callback();
                                }
                            }
                        )
                    break;
                case 'course':
                    if (!result.update.state){
                        result.course = {
                            state:false,
                            msg:'fail',
                            data:null
                        };
                        callback();
                    }
                    courseMod
                        .findOne({
                            _id:code
                        },
                        function(err, course){
                            if (err){
                                result.course = {
                                    state:false,
                                    msg:'fail',
                                    data:null
                                };
                                callback();
                            }else{
                                course._doc.id = course._id;
                                result.course = {
                                    state:true,
                                    msg:'success',
                                    data:course
                                };
                                callback();
                            }
                        })
                    break;
                case 'courses':
                    if (!result.course.state){
                        result.courses = {
                            state:false,
                            msg:'fail',
                            data:null
                        };
                        callback();
                    }

                    courseMod
                        .find({
                            userid:result.course.userid,
                            'statelv.lv':{
                                $gt:0
                            }
                        },function(err, list){
                            if (err){
                                result.courses = {
                                    state:false,
                                    msg:'fail',
                                    data:null
                                };
                                callback();
                            }else{
                                result.courses = {
                                    state:true,
                                    msg:'success',
                                    data:list
                                }
                                callback();
                            }
                        })
                    break;
                case 'redundancy':
                    if (!result.courses.state){
                        result.redundancy = {
                            state:false,
                            msg:'fail',
                            data:null
                        };
                        callback();
                    }else{
                        userMod
                            .update({
                                _id:result.course.userid
                            },{
                                $set:{
                                    managecourses:result.courses.data
                                }
                            },function(err){
                                if (err){
                                    result.redundancy = {
                                        state:false,
                                        msg:'fail',
                                        data:null
                                    }
                                    callback();
                                }else{
                                    result.redundancy = {
                                        state:true,
                                        msg:'success',
                                        data:null
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
                    state:false,
                    msg:'fail',
                    data:null
                })
            }else{
                if (!result.redundancy.state){
                    res.json({
                        state:false,
                        msg:'fail',
                        data:null
                    })
                }else{
                    res.json({
                        state:true,
                        msg:'success',
                        data:result.course.data
                    })
                }

            }
        }
    )
}

//报名参与课程的学生
exports.courseSigned = function(req, res){
    var crsid = req.query.courseid;
    ucrelMod
        .find({
            'relation.type':1,
            'courceid':crsid
        })
        .populate({
            path:'teacherid',
            select:'_id name',
            model:"user"
        })
        .populate({
            path:'userid',
            select:'_id name',
            model:"user"
        })
        .exec(function(err, rels){
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
                    data:rels
                })
            }
        });
}

//学生报名参与课程
exports.courseSignUp = function(req, res){
    var obj=__('courseManage');
    if (!req.session.user){
        res.json({
            state:false,
            msg:obj.login,
            data:null
        });
        return;
    }

    var userid = req.session.user.userid;
    var courseid = req.query.courseid;

    var series = ["cando", "course", "relation", "turel"];
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
                                msg:obj.operate,
                                data:null
                            };
                            callback();
                        }else{
                            if (courseList.length > 0){
                                result.cando = {
                                    state:false,
                                    msg:obj.courseSelf,
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
                            //.populate([{
                            //    'path':userid
                            //}])
                            .exec(function(err, course){
                                if (err){
                                    result.course = {
                                        state:false,
                                        msg:obj.operate,
                                        data:null
                                    };
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

	                    var xx = {"userid":userid,"courceid":result.course.data._id,"teacherid":result.course.data.userid,"enable":true,'relation.type':1};

	                    ucrelMod.find(xx,
	                    function(err,coll){

		                    if(err){
			                    result.relation = {
				                    state:false,
				                    msg:obj.operate,
				                    data:null
			                    }
			                    callback();
		                    }else{
			                    if(coll.length == 0){
				                    var ucrel = {
					                    userid:userid,
					                    relation:{
						                    type:1,
						                    name:obj.Signup
					                    },
					                    courceid:result.course.data._id,
					                    teacherid:result.course.data.userid,
					                    state:1,
					                    enable:true
				                    }

				                    var entity = new ucrelMod(ucrel);
				                    entity.save(function(err){
					                    if (err){
						                    result.relation = {
							                    state:false,
							                    msg:obj.operate,
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
					                    msg:obj.haveLogin,
					                    data:null
				                    }
				                    callback();
			                    }
		                    }
	                    })

                    }
                    break;
                case "turel":
                    if (!result.relation.state){
                        result.turel = {
                            state:false,
                            msg:'fail',
                            data:null
                        }
                        callback();
                    }else{
                        turelMod.find({
                            subjectid:result.course.data.userid,
                            objectid:userid,
                            enable:true
                        },
                        function(err, list){
                            if (err){
                                result.turel = {
                                    state:false,
                                    msg:'fail',
                                    data:null
                                }
                                callback();
                            }else{
                                if (list.length > 0){
                                    result.turel = {
                                        state:true,
                                        msg:'success',
                                        data:null
                                    }
                                    callback();
                                }else{
                                    var entity = new turelMod({
                                        subjectid:result.course.data.userid,
                                        objectid:userid,
                                        relation:{
                                            type:0,
                                            name:obj.relation
                                        },
                                        state:{
                                            type:2,
                                            name:obj.process
                                        },
                                        enable:true,
                                        coursecount:0
                                    });

                                    entity.save(function(err){
                                        if (err){
                                            result.turel = {
                                                state:false,
                                                msg:'fail',
                                                data:null
                                            }
                                            callback();
                                        }else{
                                            result.turel = {
                                                state:true,
                                                msg:'success',
                                                data:null
                                            }
                                            callback();
                                        }
                                    })
                                }

                            }
                        })
                    }
                    break;
            }
        },
        function(err){
            if (err){
                res.json({
                    state:false,
                    msg:obj.operate,
                    data:null
                });
            }else{
                if (!result.turel.state){
                    res.json({
                        state:false,
                        msg:result.relation.msg,
                        data:null
                    })
                }else{
	                courseMod.update({"_id":courseid},  {"$inc":{"signnum":1}},{},function(err){

		                res.json({
			                state:true,
			                msg:obj.SignSuccess,
			                data:null
		                })
	                });

                }
            }
        }
    )

}

//学生收藏课程
exports.courseFavMark = function(req, res){
    var obj=__('courseManage');
    if (!req.session.user){
        res.json({
            state:false,
            msg:obj.login,
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
                                    msg:obj.operate,
                                    data:null
                                };
                                callback();
                            }else{
                                if (courseList.length > 0){
                                    result.cando = {
                                        state:false,
                                        msg:obj.collect,
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
                                        msg:obj.operate,
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
					                    msg: obj.operate,
					                    data: null
				                    }
				                    callback();
			                    } else {
				                    if (coll.length == 0) {
					                    var ucrel = {
						                    userid:userid,
						                    relation:{
							                    type:0,
							                    name:obj.coll
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
								                    msg:obj.operate,
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
						                    msg:obj.collected,
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
                    msg:obj.operate,
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
			                msg:obj.collectedSuccess,
			                data:null
		                })
	                });

                }
            }
        }
    )
},
//--------------------------
// 课程授权给机构
//@author: chenshi
//@method： post
//@param status:1:申请2: 通过，3：未通过,4:解除
//
exports.proxyCourse = function(req, res){
    var obj=__('courseManage');
    console.log('proxyCourse'+req.body.data);
    var agencyid = req.session.user.userid;
    var data = JSON.parse(req.body.data);
    var courseid = data.courseid;
    if(data.agencyid){
        agencyid = data.agencyid;
    }

    var status = parseInt(data.status);
    var confirm = data.confirm; //confirm>0表示已经确认
    var result = {
        state:false,
        msg:obj.operate
    };
    //var statusArr = ['申请','通过','未通过','解除'];
    var tasks = ['verify','proxyreq', 'agency-name','course'];
    var step = '';
    console.log(status);
    var agencyName = '';
    var proxyreqid;
    async.eachSeries(tasks, function (item, callback) {
        switch (item) {
            case 'verify':
                //授权申请表
                proxyreqMod.findOne({"courseid": data.courseid,agencyid:agencyid})
                    .exec(function (err, doc) {
                        if (err){ console.log(err);step = null;result.state = false; callback();};
                        if (doc){
                            proxyreqid = doc._id;
                            if (status == 1 && confirm == 0) {
                                switch (doc.status){
                                    case 1:
                                        result.msg = obj.msg1+'！';
                                        break;
                                    case 2:
                                        result.msg = obj.msg2+'！';
                                        break;
                                    case 3:
                                        result.msg = obj.msg3+'？';
                                        result.confirm = 1;
                                        break;
                                    case 4:
                                        result.msg = obj.msg4+'？';
                                        result.confirm = 1;
                                        break;
                                }
                                result.state = true;
                                step = null;
                                callback();
                            }else{
                                step = 'proxyreq';
                                result = {
                                    state:true,
                                    msg:obj.operate
                                };
                                callback();
                            }
                        }else{
                            step = 'proxyreq';
                            result = {
                                state:true,
                                msg:obj.operateSucc
                            };
                            callback();
                        }
                    });
                break;
            case 'proxyreq':
                if (result.state && step == 'proxyreq') {
                    console.log(proxyreqid);
                    if (!proxyreqid) {
                        var  proxyreq = {
                            _id:uuid.v4(),
                            type:2,      //1:老师申请机构名下老师 2：老师授权课程给机构
                            status:status,   //-> 1:申请 2: 通过，3：未通过,4:解除
                            teacherid:data.teacherid,
                            courseid:data.courseid,   //->
                            enable:true,    // ->
                            agencyid: data.agencyid    // ->
                        }
                        proxyreqMod.collection.insert(proxyreq, function (err, docs) {
                            if (err) {
                                console.error(err);
                                result = {
                                    state:false,
                                    msg:obj.operate
                                };
                                step = null;
                            }
                            else {
                                result = {
                                    state:true,
                                    msg:obj.operateSucc
                                };
                                step = 'agency-name';
                            }
                            callback();
                        })
                    }
                    else{
                        console.log("proxyreqMod update");
                        proxyreqMod.update({"_id":proxyreqid},  {
                            "$set":
                            {
                                "status":status
                            }},{},function(err){
                            if (err) {
                                console.error(err);
                                result = {
                                    state:false,
                                    msg:obj.operate
                                };
                                step = null;
                            }else{
                                if(status == 2){ //通过
                                    step = null; //直接跳转不需更新user和course表了
                                }else{
                                    step = 'agency-name';
                                }
                                result = {
                                    state:true,
                                    msg:obj.operateSucc
                                };
                            }
                            callback();
                        });
                    }
                }else{
                    callback();
                }
                break;
            case 'agency-name':
                if (result.state && step == 'agency-name') {
                    userMod.findOne({"_id": agencyid})
                        .exec(function (err, doc) {
                            if (err) {
                                console.log(err);
                                step = null;
                                result.state = false;
                                callback();
                            } else {
                                if(doc.name){
                                    agencyName = doc.name;
                                }
                                step = 'course';
                                result = {
                                    state: true,
                                    msg: obj.operateSucc
                                };
                                callback();
                            }
                        });
                }else {
                    callback();
                }
                break;
            case 'course':
                if (result.state && step == 'course') {
                    var iIsproxy = 0;
                    if(status <= 2){//未申请或通过
                        iIsproxy = 1;
                    }
                    courseMod.update({"_id":courseid},  {
                        "$set":
                    {
                        "agencyid": iIsproxy == 1 ? data.agencyid : '',
                        "isproxy":iIsproxy,
                        "agencyname":iIsproxy == 1 ? agencyName : ''
                    }},{},function(err){
                        result = {
                            state:true,
                            msg:obj.operateSucc
                        };
                        callback();
                    });
                }else{
                    callback();
                }
                break;
        }
    }, function (err) {
        if(err){
            res.json({
                state:false,
                msg:obj.operate,
                data:null
            })
        }
        res.json(result);
    });

}

//---------------------------
//机构用户课程授权管理列表
//@method： get
//@author: chenshi
//@param agencyid:可选（不传则从session里面取userid）
//@param status:1:申请2: 通过，3：未通过,4:解除
//
exports.myProxyCourses = function(req, res){
    var obj=__('courseManage');
    var agencyid = req.session.user.userid;
    var status = 0; //全部
    //query params
    var limit = 10; //一页个数
    var page = 0; //默认从0开始
    if (req.query) {
        if(req.query.agencyid) agencyid = req.query.agencyid;
        if(req.query.status) status = parseInt(req.query.status);
        if (req.query.limit) limit = parseInt(req.query.limit);
        if (req.query.page) page = parseInt(req.query.page);
    }
    var skip = page * limit;
    if(!agencyid){
        res.json("need session or param agencyid");
        return;
    }
    var results = [];
    var stausArr = obj.statusArr;
    proxyreqMod.find(status != 0 ?
        {agencyid:agencyid,
            status: status} :
        { agencyid:agencyid}
        )
        .populate([
            {
                path: 'courseid',
                select: {},
                model: "course",
                match: {}
            },
            {
                path: 'teacherid',
                select: {},
                model: "user",
                match: {}
            }
            ]
        )
        .limit(limit).skip(skip)
        .exec(function(err,docs){
            if(err){
                res.json("query error");
            }else{
                docs.forEach(function (doc) {
                    if(doc.courseid) {
                        results.push({
                            id: doc._id,
                            course: doc.courseid,
                            status:{
                                value:doc.status,
                                name:stausArr[doc.status]
                            },
                            teacher:doc.teacherid?doc.teacherid:{}
                        });
                    }
                });
                res.json(results);
            }
        });

}