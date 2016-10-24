/**
 * Created by Administrator on 2016/1/23.
 */

var async = require('async');

var courseDBModel = require('../model/course');
var courseMod = new courseDBModel.Schema('course').model;

var calnodeDBModel = require('../model/calnode');
var calnodeMod = new calnodeDBModel.Schema('calnode').model;

var ucrelDBModel = require('../model/ucrel');
var ucrelMod = new ucrelDBModel.Schema('ucrel').model;

var userDBModel = require('../model/user');
var userMod = new userDBModel.Schema('user').model;

var uuid = require('node-uuid');

//可安排课程
exports.arrangeCourse = function (req, res) {
    var userid = req.session.user.userid;
    courseMod.find(
        {
            "userid": userid,
            "enable" : true,
            "statelv.lv": 2,
            "statelv.type":1
        },
        function (err, courseList) {
            if (err) {
                res.json([]);
            } else {
                res.json(courseList);
            }
        });

},

//存入安排好的的课程
//students:[{
//    stuid:{type:Schema.Types.String,ref:"user"},
//    status:0 //0：未来上课，1：已经来上课
//}],
//enable:{type:Boolean,default:true} //1:可用，0：不可用
exports.saveArrangedCourse = function (req, res) {
    var userid = req.session.user.userid;//teacherid
    var data = JSON.parse(req.body.data);//courseid start students
    var stuArr = [];
    for (var i = 0; i < data.students.length; i++) {
        var a = {
            stuid: data.students[i].id,
            status: 0
        };
        stuArr.push(a);
    }
    var calnode = {
        _id: uuid.v4(),
        tdate: data.start,
        teacherid: userid,
        name: data.title,
        courseid: data.ch,
        state: 0,// (0未上课，1已上课)
        students: stuArr,
        address: data.location,
        enable: true
    }
    var calnodeEntity = new calnodeMod(calnode);
    calnodeEntity.save(function (err) {
        var end;
        if (err) {
            end = {
                state: false,
                data: err,
                msg: '保存失败'
            }
        }
        else {
            end = {
                state: true,
                data: null,
                msg: '保存成功'
            }
        }
        res.json(end)
    })
},
//通过teacherid和课程id，查出学生的id和姓名
    exports.getStuNameId = function (req, res) {
        var teacherid = req.session.user.userid;   //teacherid
        var data = req.query.cid;//courseid
        var series = ['stuId', 'stuName'];
        var result = {};
        var resultEnd = {};
        async.eachSeries(
            series,
            function (item, callback) {
                switch (item) {
                    case 'stuId':
                        ucrelMod.find({
                                teacherid: teacherid,
                                courceid: data,
                                'relation.type': 2
                            },
                            'userid -_id',
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

                                };
                                console.log(list);
                            });
                        break;
                    case 'stuName':
                        if (result.state) {
                            var arr = [];
                            for (var i = 0; i < result.data.length; i++) {
                                arr.push(result.data[i].userid);
                            }
                            userMod.find({
                                    '_id': {$in: arr}
                                },
                                {_id: 1, name: 1,email:1},
                                function (err, list) {
                                    if (err) {
                                        resultEnd.state = false;
                                        resultEnd.data = null;
                                        callback();
                                    }
                                    else {
                                        resultEnd.state = true;
                                        resultEnd.data = list;
                                        callback();
                                    }
                                }
                            );
                        }
                        else {
                            resultEnd = {
                                state: false,
                                data: null
                            }
                            callback();
                        }
                        break;

                }
            },
            function (err) {
                if (err) {
                    res.json(resultEnd);
                } else {
                    res.json(resultEnd)
                }
            }
        );
    },

//课程id和时间，搜索出课程的信息和上课地点（course and calnode）
exports.getCourseInfoAndAddress = function (req, res) {
        data = req.query.data;
        var courseid = data.id;
        var start = data.date;
        var series = ['address', 'info', 'name'];
        var result = {};
        async.eachSeries(
            series,
            function (item, callback) {
                switch (item) {
                    case 'address':
                        calnodeMod.find({
                                courseid: courseid,
                                tdate: start
                            },
                            'tdate address students -_id',
                            function (err, list) {
                                if (err) {
                                    result = {
                                        state: false,
                                        data: null,
                                    };
                                    callback();
                                }
                                else {
                                    result = {
                                        state: true,
                                        data: list[0],
                                    };
                                    callback();

                                }
                            });
                        break;
                    case 'info':
                        if (result.state) {
                            courseMod.find({
                                    '_id': courseid
                                },
                                function (err, array) {
                                    if (err) {
                                        result.state = false;
                                        result.end = null;
                                        callback();
                                    }
                                    else {
                                        result.state = true;
                                        result.end = array[0];
                                        callback();
                                    }
                                }
                            );
                        }
                        else {
                            result = {
                                state: false,
                                end: null
                            }
                            callback();
                        }
                        break;
                    case 'name':
                        var stu = result.data.students;
                        var arr = [];
                        for (var i = 0; i < stu.length; i++) {
                            arr.push(stu[i].stuid)
                        }
                        if (result.state) {
                            userMod.find({
                                    _id: {$in: arr}
                                },
                                {_id: 1, name: 1, email: 1},
                                function (err, list) {
                                    if (err) {
                                        result.state = false;
                                        result.info = null;
                                        callback();
                                    }
                                    else {
                                        result.state = true;
                                        result.info = list;
                                        callback();
                                    }
                                }
                            )
                        }
                        else {
                            result.state = false;
                            result.info = null;
                            callback();
                        }
                        break;

                }
            },
            function (err) {
                if (err) {
                    res.json(result);
                } else {
                    res.json(result)
                }
            });

    },


//课程id,课程时间，学生id,找出学生页面所要显示的课程详细信息
exports.getCourseInformation=function(req,res) {
    data = req.query.data;
    var courseid = data.id;
    var start = data.date;
    var result={};
    var series = ['teacherid', 'name', 'courseinfo'];
    async.eachSeries(
        series,
        function (item, callback) {
            switch (item) {
                case 'teacherid':
                    calnodeMod.find({
                            courseid: courseid,
                            tdate: start
                        },
                        'tdate address teacherid state -_id',
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
                                    data: list[0]
                                };
                                callback();

                            }
                        });
                    break;
                case 'name':
                    if (result.state) {
                        userMod.find({
                                '_id':result.data.teacherid},
                            {name:1,_id:1},
                            function (err, array) {
                                if (err) {
                                    result.state = false;
                                    result.end = null;
                                    callback();
                                }
                                else {
                                    result.state = true;
                                    result.end = array[0];
                                    callback();
                                }
                            }
                        );
                    }
                    else {
                        result = {
                            state: false,
                            end: null
                        }
                        callback();
                    }
                    break;
                case 'courseinfo':
                    if (result.state) {
                        courseMod.find({
                                _id:courseid
                            },
                            function (err, list) {
                                if (err) {
                                    result.state = false;
                                    result.info = null;
                                    callback();
                                }
                                else {
                                    result.state = true;
                                    result.info = list[0];
                                    callback();
                                }
                            }
                        )
                    }
                    else {
                        result.state = false;
                        result.info = null;
                        callback();
                    }
                    break;

            }
        },
        function (err) {
            if (err) {
                res.json(result);
            } else {
                res.json(result);
            }
        });

},
//老师给学生打卡
exports.setStudentClock = function (req, res) {
        var teacherid = req.session.user.userid;//teacherid
        var data = req.query;
        var result = {};
        calnodeMod.update({
                'teacherid': teacherid,
                'tdate': data.tdate,
                'courseid':data.courseid,
                'students.stuid': data.studentid
            },
            {"$set": {'students.$.status':1}},
            function (err) {
                if (err) {
                    result.state = false;
                    res.json(result)
                } else {
                    result.state = true;
                    res.json(result)
                }
            })

    }
//学生给老师打卡
// exports.setTeacherClock = function (req, res) {
