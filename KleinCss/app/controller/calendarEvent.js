/**
 * Created by Administrator on 2016/1/3.
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
//日历事件
//学生ID去ucrel里取出课程ID,课程ID去calnode里取出日历信息。
// 在老师的界面下，用老师的id去ucrel取出courseid,（先以老师id,后以userid，兼容老师是学生的情况）
//学生
exports.stuCalnode = function (req, res) {
    var userid = req.session.user.userid;
    var series = ['course', 'calnode'];
    var result = {};
    var resultEnd = {};
    async.eachSeries(
        series,
        function (item, callback) {
            switch (item) {
                case 'course':
                    ucrelMod.find({
                            userid: userid,
                        },
                        'courceid',
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
                        var arr = [];
                        for (var i = 0; i < result.data.length; i++) {
                            arr.push(result.data[i].courceid);
                        }
                        calnodeMod.find({
                                'courseid': {$in: arr}
                            },
                            {tdate: 1, name: 1, courseid: 1, _id: 0},
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
//老师
    //先取出以学生身份的课程，设置color和editable:false，
    //然后以老师身份取出课程，设置color和editable:true
    exports.teaCalnode = function (req, res) {
        var userid = req.session.user.userid;
        var series = ['student', 'stuCalnode', 'teacher', 'teaCalnode'];
        var result = {};
        var resultEnd = {};
        var calnodeData = {};
        async.eachSeries(
            series,
            function (item, callback) {
                switch (item) {
                    case 'student':
                        ucrelMod.find({
                                userid: userid,
                            },
                            'courceid -_id',
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
                    case 'stuCalnode':
                        var stuArr = [];
                        for (var i = 0; i < result.data.length; i++) {
                            stuArr.push(result.data[i].courceid)
                        }
                        if (result.state) {
                            calnodeMod.find(
                                {'courseid': {$in: stuArr}},
                                {tdate: 1, name: 1, courseid: 1, _id: 0},
                                function (err, list) {
                                    if (err) {
                                        calnodeData = {
                                            state: false,
                                            stuData: null
                                        };
                                        callback()
                                    }
                                    else {
                                        calnodeData = {
                                            state: true,
                                            stuData: list
                                        };
                                        callback();
                                    }
                                })
                        }
                        else {
                            calnodeData = {
                                state: false,
                                stuData: null
                            };
                            callback();
                        }
                        break;
                    case 'teacher':
                        if (calnodeData.state) {
                            ucrelMod.find({
                                    'teacherid': userid
                                },
                                'courceid -_id',
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
                            };
                            callback();
                        }
                        break;
                    case 'teaCalnode':
                        var courseArr = [];
                        for (var i = 0; i < resultEnd.data.length; i++) {
                            courseArr.push(resultEnd.data[i].courceid);
                        }
                        if (resultEnd.state) {
                            calnodeMod.find({
                                    'courseid': {$in: courseArr}
                                },
                                {tdate: 1, name: 1, courseid: 1, _id: 0},
                                function (err, list) {
                                    if (err) {
                                        calnodeData.state = false;
                                        calnodeData.teaData = null;
                                        callback();
                                    }
                                    else {
                                        calnodeData.state = true;
                                        calnodeData.teaData = list;
                                        callback();
                                    }
                                }
                            );
                        } else {
                            calnodeData = {
                                state: false,
                                teaData: null
                            };
                            callback();
                        }
                        break;
                }
            },
            function (err) {
                if (err) {
                    res.json(calnodeData);
                } else {
                    res.json(calnodeData);
                }
            }
        );


    },

    //老师的一周安排
    exports.getWeekDate2 = function (req, res) {
        var userid = req.session.user.userid;
        var arr = req.query.data;
        var time = ['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];
        var resultData = {};//最后返回数据

        calnodeMod.find({
                teacherid: userid,
                tdate: {
                    $gte: arr[0],
                    $lte: arr[1]
                }
            },
            {tdate: 1, name: 1, students: 1, _id: 0})
            .populate(
                {
                    path: 'students.stuid',
                    select: 'email name'
                })
            .exec(function (err, list) {
                if (err) {
                    resultData[time[0]] = {
                        state: false,
                        data: []
                    };
                } else {
                    resultData[time[0]] = {
                        state: true,
                        data: list
                    };
                }
            });



    }

//老师的一周安排
exports.getWeekDate = function (req, res) {
    var userid = req.session.user.userid;
    var arr = req.query.data;
    var time = ['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];
    var resultData = {};//最后返回数据

    var index=0;
    for (var i = 0; i <= 6; i++) {
        calnodeMod.find({
                teacherid: userid,
                tdate: {
                    $gte: arr[i],
                    $lte: arr[i+1]
                }
            }, {tdate: 1, name: 1, students: 1, address:1, _id: 0})
            .populate(
                {
                    path: 'students.stuid',
                    select: 'email name'
                })
            .exec(function (err, list) {
                if (err) {
                    resultData[time[index]] = {
                        state: false,
                        data: []
                    };
                }
                else {
                    resultData[time[index]] = {
                        state: true,
                        data: list
                    };
                }
                index++;
                if(index==7){
                    res.json(resultData);
                }
            });


    }
},

    //老师删除日历中的安排数据
exports.deleteCalnode=function(req,res){
    var userid = req.session.user.userid;
    var data=req.query;

    var tdate=data.tdate;
    var courseid=data.courseid;
    var a={};
    calnodeMod.remove({
        teacherid:userid,
        tdate:tdate,
        courseid:courseid
    },function(err){
        if(err){
           a={
                state:false
            };
            res.json(a);
        }else{
            a={
                state:true
            };
            res.json(a);
        }
    })
}



