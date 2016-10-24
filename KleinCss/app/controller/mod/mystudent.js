/**
 * Created by cs on 2016/1/30.
 */
var mongoose = require('mongoose');
var turelSchema = require('../../model/turel');
var turelMod = turelSchema.Schema('turel').model;
var async = require('async');
//####################################################################
//查询我的学生
//@param state -1：所有,0:正在授课 1:曾经授课(默认-1)
//url: http://localhost:3000/mod/user/queryMyStudents?state=0
//####################################################################
exports.queryMyStudents = function (req, res, next) {
    var reset = -1;
    var state = -1;
    var mUserid = '';
    var mUsertype = 0;
    //session
    if (req.session.user) {
        if (req.session.user.userid) mUserid = req.session.user.userid;
        if (req.session.user.usertype) mUsertype = req.session.user.usertype;
    }
    //query params
    var keyword = '';
    var count = 20; //默认数据20个
    if (req.query) {
        if (req.query.reset) reset = parseInt(req.query.reset);
        if (req.query.state) state = parseInt(req.query.state);
        if (req.query.keyword) keyword = req.query.keyword;
        if (req.query.count) count = parseInt(req.query.count);
    }
    var studentArr = [];
    var query;
    if (state == -1) {
        query = {"subjectid": mUserid, "relation.type": 0, "state.type": 0};
    } else if (state == 0) {
        query = {"subjectid": mUserid, "relation.type": 0, "state.type": 0, "coursecount": {$gt: 0}};
    } else if (state == 1) {
        query = {"subjectid": mUserid, "relation.type": 0, "state.type": 0, "coursecount": 0};
    }
    turelMod.find(query)
        .populate(
            {
                path: 'objectid',
                select: {},
                model: "user",
                match: {usertype: mUsertype}
            }
        )
        .exec(function (err, docs) {
            if (err) console.log(err);
            docs.forEach(function (value) {
                if (value.objectid && value.objectid.name.indexOf(keyword) > -1) {
                    studentArr.push({
                        //@see front model 'app/usercenter/model/myteachers/MyTeacherListItemModel'
                        id: value.objectid._id,
                        student: value.objectid,
                        state: value.state
                    });
                }

            });
            res.json(studentArr);
        });
    /*var tasks = ['get-teachers','get-courseIds','get-courses'];
     var teacherArr = [];
     var courseArr = [];
     var teacherIds = [];
     var courseIds = [];
     async.eachSeries(tasks, function (item, callback) {
     switch (item) {
     case 'get-teachers':
     //教学关系
     var query;
     if(state == -1) query = {"subjectid": mUserid,"relation.type": 0};
     else query = {"subjectid": mUserid,"relation.type": 0,"state.type":state};
     turelMod.find(query)
     .populate(
     {
     path: 'objectid',
     select: {},
     model: "user",
     match: {usertype: 1}
     }
     )
     .exec(function (err, docs) {
     if (err) console.log(err);
     docs.forEach(function (value) {
     teacherIds.push(value.objectid._id);
     teacherArr.push({
     //@see front model 'app/usercenter/model/myteachers/MyTeacherListItemModel'
     id:value.objectid._id,
     name:value.objectid.name,
     email:value.objectid.email,
     portrait:value.objectid.portrait,
     phone:value.objectid.phone,
     state:value.state,
     courses:[]
     });
     });
     console.log(teacherIds);
     callback();
     });
     break;
     case 'get-courseIds':
     console.log(teacherIds);
     tcrelMod.find(
     {"teacherid": {$in: teacherIds}},
     {'_id': 0,'courseid': 1})
     .exec(function (err, docs) {
     if (err) console.log(err);
     docs.forEach(function (doc) {
     courseIds.push(doc.courseid);
     });
     callback();
     });
     /!*tcrelMod.find({"teacherid": { $in:teacherIds}})
     .populate(
     {
     path: 'courseid',
     select: {},
     model: 'course',
     match: {'statelv.lv': 2},
     sort: { 'statelv.lv.type': 1 }
     }
     )
     .exec(function (err, docs) {
     if (err) console.log(err);
     courseArr = docs;
     callback();
     });*!/
     break;
     case 'get-courses':
     courseMod.find(
     {"_id": {$in: courseIds}})
     .sort({ 'statelv.lv.type': 1 })
     .exec(function (err, docs) {
     if (err) console.log(err);
     docs.forEach(function (doc) {
     courseArr.push(doc);
     });
     callback();
     });
     break;
     }
     }, function (err) {
     if(err) res.json(err);
     var result = [];
     teacherArr.forEach(function (teacher) {
     courseArr.forEach(function (course) {
     if(teacher.id == course.userid){
     teacher.courses.push(course);
     }
     })
     teacher.courses.sort(function(a, b) {
     return a.statelv.lv.type - b.statelv.lv.type;
     });
     result.push(teacher);
     });
     res.json(result);
     });*/
},
//####################################################################
//统计（统计图表用）
//url: http://localhost:3000/mod/user/queryMyStudentsCharts
//####################################################################
exports.queryMyStudentsCharts = function (req, res) {
    var mUserid = '';
    if (req.session.user) {
        mUserid = req.session.user.userid;
    }
    var dataArr = [];
    var tasks = ["teaching", "teached"];
    var totalCount = 0;
    var countFun = function(dataArr,task,labelName,callback){
        turelMod.count(
            {
                "subjectid" : mUserid,
                "enable":true,
                "relation.type": 0,
                "coursecount": task=="teaching"?{$gt: 0}:{$eq: 0}
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
    async.each(tasks, function (task, callback) {
        switch (task){
            case "teaching":
                countFun(dataArr,task,__('chartName.Teaching'),callback);
                break;
            case "teached":
                countFun(dataArr,task,__('chartName.Taught'),callback);
                break;
        }
    }, function (err) {
        res.json({
            total:totalCount,
            data:dataArr,
            colors:['#87d6c6', '#1ab394']
        });
    });
}
