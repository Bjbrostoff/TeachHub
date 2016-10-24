/**
 * Created by Administrator on 2016/3/9.
 */

var proxyreqDBModel = require('../model/proxyreq');
var proxyreqMod = new proxyreqDBModel.Schema('proxyreq').model;

var userDBModel = require('../model/user');
var userMod = new userDBModel.Schema('user').model;

var courseSchemaDBModel = require('../model/course');
var courseMod = new courseSchemaDBModel.Schema('course').model;

var async = require('async');


//获取已经注册到机构下的老师信息
exports.proxyTeacher = function (req, res) {
    var agencyid = req.session.user.userid;
    var series = ['teacher', 'info'];
    var result = {};
    async.eachSeries(
        series,
        function (item, callback) {
            switch (item) {
                case 'teacher':
                    proxyreqMod.find({
                            type: 1,
                            status: 2,
                            agencyid: agencyid
                        },
                        'teacherid -_id',
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
                case 'info':
                    if (result.state) {
                        var arr = [];
                        for (var i = 0; i < result.data.length; i++) {
                            arr.push(result.data[i].teacherid);
                        }
                        userMod.find({
                                '_id': {$in: arr}
                            },
                            {_id: 1, name: 1, email: 1, phone: 1},
                            function (err, list) {
                                if (err) {
                                    result.data = null;
                                    result.state = false;
                                    callback();
                                }
                                else {
                                    result.data = list;
                                    result.state = true;
                                    callback();
                                }
                            }
                        );
                    }
                    else {
                        result = {
                            state: false,
                            data: null
                        };
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
        }
    );
};
//获取申请加入到机构下的老师信息
exports.addProxyTeacher = function (req, res) {
    var agencyid = req.session.user.userid;
    var series = ['teacher', 'info'];
    var result = {};
    async.eachSeries(
        series,
        function (item, callback) {
            switch (item) {
                case 'teacher':
                    proxyreqMod.find({
                            type: 1,
                            status: 1,
                            agencyid: agencyid
                        },
                        'teacherid -_id',
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
                case 'info':
                    if (result.state) {
                        var arr = [];
                        for (var i = 0; i < result.data.length; i++) {
                            arr.push(result.data[i].teacherid);
                        }
                        userMod.find({
                                '_id': {$in: arr}
                            },
                            {_id: 1, name: 1, email: 1, phone: 1},
                            function (err, list) {
                                if (err) {
                                    result.data = null;
                                    result.state = false;
                                    callback();
                                }
                                else {
                                    result.data = list;
                                    result.state = true;
                                    callback();
                                }
                            }
                        );
                    }
                    else {
                        result = {
                            state: false,
                            data: null
                        };
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
        }
    );
};
//机构通过老师的申请
exports.passTeacherReq = function (req, res) {
    var agencyid = req.session.user.userid;
    var teacherid = req.query.data;
    var series = ['updateProxyreq', 'getCount', 'updateUser'];
    var result = {};
    async.eachSeries(
        series,
        function (item, callback) {
            switch (item) {
                case 'updateProxyreq':
                    proxyreqMod.update({
                            teacherid: teacherid,
                            agencyid: agencyid,
                            type: 1,
                            status: 1
                        },
                        {
                            $set: {status: 2}
                        },
                        function (err, doc) {
                            if (err) {
                                result = {
                                    state: false
                                };
                                callback();
                            }
                            else {
                                result = {
                                    state: true
                                };
                                callback();
                            }
                        });
                    break;
                case 'getCount':
                    if (result.state) {
                        proxyreqMod.count({
                                agencyid: agencyid,
                                type: 1,
                                status: 2
                            },
                            function (err, list) {
                                if (err) {
                                    result.data = null;
                                    result.state = false;
                                    callback();
                                }
                                else {
                                    result.data = list;
                                    result.state = true;
                                    callback();
                                }
                            }
                        );
                    }
                    else {
                        result = {
                            state: false,
                            data: null
                        };
                        callback();
                    }
                    break;
                case 'updateUser':
                    if (result.state) {
                        var num = result.data;
                        userMod.update({
                                '_id': agencyid
                            },
                            {
                                $set: {
                                    teachercount: num
                                }
                            },
                            function (err, list) {
                                if (err) {
                                    result.state = false;
                                    callback();
                                }
                                else {
                                    result.state = true;
                                    callback();
                                }
                            }
                        );
                    }
                    else {
                        result = {
                            state: false
                        };
                        callback();
                    }
                    break;
            }
        },
        function (err) {
            if (err) {
                res.json(result.state);
            } else {
                res.json(result.state);
            }
        }
    );

};
//机构不通过老师的申请
exports.noPassTeacherReq = function (req, res) {
    var agencyid = req.session.user.userid;
    var teacherid = req.query.data;
    var series = ['updateProxyreq'];
    var result = {};
    async.eachSeries(
        series,
        function (item, callback) {
            switch (item) {
                case 'updateProxyreq':
                    proxyreqMod.update({
                            teacherid: teacherid,
                            agencyid: agencyid,
                            type: 1,
                            status: 1
                        },
                        {
                            $set: {status: 3}
                        },
                        function (err, doc) {
                            if (err) {
                                result = {
                                    state: false
                                };
                                callback();
                            }
                            else {
                                result = {
                                    state: true
                                };
                                callback();
                            }
                        });
                    break;
            }
        },
        function (err) {
            if (err) {
                res.json(result.state);
            } else {
                res.json(result.state);
            }
        }
    );
};
//获取老师的信息
exports.agencyGetTeacherMoreInfo = function (req, res) {

    var teacherid = req.query.data;
    var result = {};
    userMod.find(
        {
            _id: teacherid
        },'name email phone portrait nationality tcredinfo.info tcredinfo.workexp tcredinfo.servexerti -_id'
        ,function(err,list){
            if(err){
               res.json(
                   result={
                       state:false,
                       data:null
                   }
               )
            }else{
                res.json(
                    result={
                        state:true,
                        data:list
                    }
            )
            }
        })
};
//机构解除老师
exports.agencyRemoveTeacher = function (req, res) {
    var agencyid = req.session.user.userid;
    var teacherid = req.query.data;
    var result = {};
    var series = ['getCourseId', 'courseState', 'updateProxyReq', 'getCount', 'updateUser'];
    async.eachSeries(
        series,
        function (item, callback) {
            switch (item) {
                case 'getCourseId':
                    proxyreqMod.find({
                            teacherid: teacherid,
                            agencyid: agencyid,
                            type: 2,
                            status: "2"
                        }, 'courseid -_id',
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
                case 'courseState':
                    if (result.state) {
                        var arr = [];
                        for (var i = 0; i < result.data.length; i++) {
                            arr.push(result.data[i].courseid);
                        }
                        courseMod.find({
                                _id: {$in: arr}
                            },
                            {statelv: 1, _id: 0},
                            function (err, list) {
                                if (err) {
                                    result.data = null;
                                    result.state = false;
                                    callback();
                                } else {
                                    result.data = list;
                                    result.state = true;
                                    callback();
                                }
                            });
                    } else {
                        res.json(result = {
                            state: false,
                            data: null,
                            msg: 'course出错！！！'
                        });
                    }
                    break;
                case 'updateProxyReq':
                    if (result.state) {
                        var arr = [];
                        var c = 0;
                        for (var i = 0; i < result.data.length; i++) {
                            arr.push(result.data[i].statelv);
                        }
                        for (var t = 0; t < arr.length; t++) {
                            if (arr[t].lv == 2) {
                                if (arr[t].type == 1) {
                                    c++;
                                }
                            }
                        }
                        if (c != 0) {
                            res.json(result = {
                                state: false,
                                msg: '此老师有课程进行中！！！'
                            });
                            break;
                            break;
                        } else {
                            proxyreqMod.update({
                                agencyid: agencyid,
                                teacherid: teacherid,
                                type: 1,
                                status: 2
                            }, {
                                $set: {status: 4}
                            }, function (err, doc) {
                                if (err) {
                                    result.state = false;
                                    result.data = 'cc';
                                    callback();
                                } else {
                                    result.state = true;
                                    result.data = 'ccc';
                                    callback();
                                }
                            });
                        }
                    } else {
                        res.json(result = {
                            state: false,
                            msg: '更新出错C！！！3'
                        });
                        callback()
                    }
                    ;
                    break;
                case 'getCount':
                    if (result.state) {
                        proxyreqMod.count({
                                agencyid: agencyid,
                                type: 1,
                                status: 2
                            },
                            function (err, list) {
                                if (err) {
                                    result.data = null;
                                    result.state = false;
                                    callback();
                                }
                                else {
                                    result.data = list;
                                    result.state = true;
                                    callback();
                                }
                            }
                        );
                    }
                    else {
                        result = {
                            state: false,
                            data: null
                        };
                        callback();
                    }
                    break;
                case 'updateUser':
                    if (result.state) {
                        var num = result.data;
                        userMod.update({
                                '_id': agencyid
                            },
                            {
                                $set: {
                                    teachercount: num
                                }
                            },
                            function (err, list) {
                                if (err) {
                                    result.state = false;
                                    result.msg = '操作失败2！！！！1';
                                    callback();
                                }
                                else {
                                    result.state = true;
                                    result.msg = '操作成功2！！！！1';
                                    callback();
                                }
                            }
                        );
                    }
                    else {
                        result = {
                            state: false,
                            msg: 'updateUserErr'
                        };
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
        }
    );
};