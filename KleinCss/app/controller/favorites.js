/**
 * Created by cs on 2016/1/1.
 */

var uuid = require('node-uuid');
var mongoose = require('mongoose');
var ucrelsMod = require('../model/ucrel').Schema('ucrel').model;
var turelsMod = require('../model/turel').Schema('turel').model;
var userMod = require('../model/user').Schema('user').model;
var coursesMod = require('../model/course').Schema('course').model;
var tcredMod = require('../model/tcred').Schema('tcred').model;
var md5 = require('md5');
var async = require('async');
var querykey = /test-favorite/; //测试用模糊查询（正式的换成具体userid）
var key = "test-favorite"; //测试数据关键字
//####################################################################
//****生产我的收藏测试数据（可弃用的）
//****************使用我的老师那边生产数据************************
// like:http://localhost:3000/mod/user/modMyTeachers?count=100
//####################################################################
exports.modFavorites = function (req, res, next) {
    var mUserid;
    var mUserType;//用户类型 0普通 1老师 2机构 3审核员 4.管理员
    //session
    if (req.session.user) {
        if (req.session.user.userid) mUserid = req.session.user.userid;
        if (req.session.user.usertype) mUserType = req.session.user.usertype;
    }
    //query params
    var count = 20; //默认数据20个
    if (req.query.count) {
        count = parseInt(req.query.count);
    }
    var relations = ['收藏', '报名', '上课', '学完'];
    var methods = ['教室授课', '上门授课', '网上远程授课'];
    var checkstates = ['未审核', '等待审核', '审核中', '审核成功', '审核失败'];
    var pubstates = ['未发布', '已发布', '已下架'];
    var actstates = ['未开课', '进行中', '已结束'];
    var mCityArr = ['杭州','北京','上海','广州','深圳'];
    var mStarlevelArr = ['无星级','一星级','二星级','三星级','四星级','五星级'];
    var courcesArr = [];
    var ucrelsArr = [];
    var tucrelsArr = [];
    var teacherArr = [];
    for (var i = 0; i < count; i++) {
        var courceid = key + uuid.v4();
        var teacherId = key + uuid.v4();
        var iRelation = Math.ceil(Math.random() * 4) - 1;
        var iMethod = Math.ceil(Math.random() * 3) - 1;
        var iCheckstate = Math.ceil(Math.random() * 5) - 1;
        var iPubstate = Math.ceil(Math.random() * 3) - 1;
        var iActstate = Math.ceil(Math.random() * 3) - 1;
        var iState = Math.ceil(Math.random() * 2) - 1;
        //学生与课程关系
        var ucrel = {
            userid: mUserid,
            //关系(0：收藏 1：报名 2：上课 3：学完)
            relation: {
                type: iRelation,
                name: relations[iRelation]
            },
            //课程id
            courceid: courceid,
            teacherid: key + uuid.v4(),
            //状态
            state: i % 2
        };
        //课程
        var cource = {
            _id: courceid,
            //课程名称
            name: 'cource-' + i,
            //简介
            introduction: 'introduction-' + i,
            //详情
            info: 'info-' + i,
            //大纲、目录
            catalog: 'catalog' + i,
            //计费方式 json
            billing: {
                fvalue: i % 2,
                fdetail: i % 2 == 0 ? '按标准收费' : '按小时收费',
            },
            //单价
            price: '5$/h',
            //授课方式 0教室授课，1上门授课，2网上远程授课
            method: {
                type: iMethod,
                name: methods[iMethod]
            },
            //授课地点 (教室授课方式指定的地点 其他授课方式不需要)
            classroom: String,
            //授课模式 0一对一 1一对多
            mode: {
                type: i % 2,
                name: i % 2 == 0 ? '一对一' : '一对多',
            },
            //面向群体年龄
            range: {
                min: 10, max: 40
            },
            //缩略图 (资源路径)
            thumbnail: '',
            //图片 (资源路径)
            image: '',
            //课程评分 (接收程度。。。。)
            score: i % 2 == 0 ? 'A' : 'B',
            //课程点赞
            comment: Math.ceil(Math.random() * 100),
            //可用状态 (老师删除掉的课程状态不可用 0不可用 1可用)
            enable: i % 2 == 0,
            //----审核信息----
            //创建日期
            date: Date.now,
            //审核状态 0未审核 1等待审核 2审核中 3审核成功 4审核失败
            checkstate: {
                type: iCheckstate,
                name: checkstates[iCheckstate]
            },
            //发布状态 0未发布 1已发布 2已下架
            pubstate: {
                type: iPubstate,
                name: pubstates[iPubstate]
            },
            //进行状态 0未开课 1进行中 2已结束
            actstate: {
                type: iActstate,
                name: actstates[iActstate]
            }
        };
        //学生与老师关系
        var teacher = {
            _id: teacherId,
            name: 'teacher-test' + i,
            email: 'teacher' + i + '@163.com',
            phone: '1234',
            password: '123456',
            age: '24',
            sex: 'male',
            nationality: 'U.S.A',
            birth: '1990-10-10',
            enable: 1,
            usertype: 1,
            portrait: '/inspinia/img/a' + (i % 8 + Number(1)) + '.jpg',
            city: mCityArr[i % 5],
            starlevel: mStarlevelArr[i % 6],
            //点赞数
            likes: Math.ceil(Math.random() * 10),
            //课程维护
            managecourses: [],
            //我的课程
            mycourses: [],
            enable: true //1:可用，0：不可用
        };
        //老师学生关系
        var turel = {
            subjectid: mUserid,
            //关系 0教学关系 1收藏关系
            relation: {
                type: i % 2,
                name: i % 2 == 0 ? '教学关系' : '收藏关系'
            },
            //客体 客体唯一标识
            objectid: teacherId,
            //状态 教学关系（0正在授课 1曾经授课）
            state: {
                type: iState,
                name: iState == 0 ? '正在授课' : '曾经授课'
            }
        }
        courcesArr.push(cource);
        ucrelsArr.push(ucrel);
        tucrelsArr.push(turel);
        teacherArr.push(teacher);
    }

    //async生产数据
    var tasks = ['mod-ucrel','mod-course','mod-teacher','mod-turel'];
    async.each(tasks, function (item, callback) {
        switch (item) {
            case 'mod-ucrel':
                ucrelsMod.collection.insert(ucrelsArr,function(err,docs){
                    if (err) { console.error(err);}
                    else { console.info('%d count ucrelsArr were successfully stored.', docs['insertedCount']);
                        callback();
                    }
                })
                break;
            case 'mod-course':
                coursesMod.collection.insert(courcesArr,function(err,docs){
                    if (err) { console.error(err);}
                    else { console.info('%d count courcesArr were successfully stored.', docs['insertedCount']);
                        callback();
                    }
                })
                break;
            case 'mod-teacher':
                userMod.collection.insert(teacherArr,function(err,docs){
                    if (err) { console.error(err);}
                    else { console.info('%d count teacherArr were successfully stored.', docs['insertedCount']);
                        callback();
                    }
                })
                break;
            case 'mod-turel':
                turelsMod.collection.insert(tucrelsArr,function(err,docs){
                    if (err) { console.error(err);}
                    else { console.info('%d count tucrelsArr were successfully stored.', docs['insertedCount']);
                        callback();
                    }
                })
                break;
        }
    }, function (err) {
        res.json({
            status: 'success',
            ucrels: ucrelsArr,
            courses: courcesArr,
            teachers: teacherArr,
            tucrels:tucrelsArr
        });
    });
},
//####################################################################
//查询我的收藏类型（nav-tab）
//url: http://localhost:3000/mod/user/queryFavoriteTypes
//####################################################################
exports.queryFavoriteTypes = function (req, res, next) {
    var mUsertype = 0;
    if (req.session.user) {
        mUsertype = req.session.user.usertype;
    }
    switch (mUsertype){
        case 0:
            res.json([
                {
                    id: '1',
                    name:res.__('usercenter.MyFavorites.Courses'),
                    type: '1',
                    tab:'#myfavorite-tab-course',
                    active:true
                },
                {
                    id: '2',
                    name: res.__('usercenter.MyFavorites.Teachers'),
                    tab:'#myfavorite-tab-teacher',
                    type: '2'
                },
                {
                    id: '3',
                    name:res.__('usercenter.MyFavorites.Agencies'),
                    tab:'#myfavorite-tab-agency',
                    type: '3'
                }
            ]);
            break;
        default:
            res.json([
                {
                    id: '1',
                    name:res.__('usercenter.MyFavorites.Courses'),
                    type: '1',
                    tab:'#myfavorite-tab-course',
                    active:true
                },
                {
                    id: '2',
                    name:res.__('usercenter.MyFavorites.Teachers'),
                    tab:'#myfavorite-tab-teacher',
                    type: '2'
                },
                {
                    id: '3',
                    name: res.__('usercenter.MyFavorites.Agencies'),
                    tab:'#myfavorite-tab-agency',
                    type: '3'
                }
            ]);
            break;
    }

},
//####################################################################
//统计（统计图表用）
//url: http://localhost:3000/mod/user/queryFavoriteCharts
//####################################################################
exports.queryFavoriteCharts = function (req, res) {
    var tasks = ['course', 'teacher','agency'];
    var chartDatas = [];
    var colors = ['#87d6c6', '#54cdb4','#1ab394'];
    var mUserid = querykey;
    var mUsertype = 0;
    if (req.session.user) {
    }
    if (req.session.user) {
        mUserid = req.session.user.userid;
        mUsertype = req.session.user.usertype;
    }
    var totalCount = 0;
    async.each(tasks, function (item, callback) {
        switch (item) {
            case 'course':
                ucrelsMod.count({'userid':mUserid,'relation.type':0}, function (err, result) {
                    var count = 0;
                    if (err){
                        chartDatas.push({
                            label: res.__('usercenter.MyFavorites.Courses'),
                            value: 0,
                            type:1
                        });
                    }else{
                        count = result;
                        chartDatas.push({
                            label: res.__('usercenter.MyFavorites.Courses'),
                            value: count,
                            type:1
                        });
                    }
                    totalCount+=count;
                    callback();
                });
                break;
            case 'teacher':
                turelsMod.count({'subjectid': mUserid,'relation.type': 1}, function (err, result) {
                    var count = 0;
                    if (err){
                        chartDatas.push({
                            label:res.__('usercenter.MyFavorites.Teachers'),
                            value: 0,
                            type:2
                        });
                    }else{
                        count = result;
                        chartDatas.push({
                            label:res.__('usercenter.MyFavorites.Teachers'),
                            value: count,
                            type:2
                        });
                    }
                    totalCount+=count;
                    callback();
                });
                break;
            case 'agency': //机构关系暂缺
                chartDatas.push({
                    label: res.__('usercenter.MyFavorites.Agencies'),
                    value: 0,
                    type:3
                });
                callback();
                break;
        }
    }, function (err) {
        console.log("err: " + err);
        res.json({total:totalCount,data:chartDatas,colors:colors});
    });
},
//####################################################################
//查询我的收藏
//@param type 1:课程，2:教师，3：机构，0：所有
//url: http://localhost:3000/mod/user/queryFavorite?type=1&limit=10&page=0&keyword=
//####################################################################
    exports.queryFavorite = function (req, res, next){
        var self = this;
        var mUserid = querykey;
        var mUserType = 0;
        var mKeyWord = "";
        if (req.session.user) {
            mUserid = req.session.user.userid;
            mUserType = req.session.user.usertype;
        }
        var type = 1;
        //query params
        var limit = 10; //一页个数
        var page = 0; //默认从0开始
        if (req.query) {
            if (req.query.type)  type = parseInt(req.query.type);
            if (req.query.limit) limit = parseInt(req.query.limit);
            if (req.query.page) page = parseInt(req.query.page);
            if (req.query.keyword)  mKeyWord = req.query.keyword;
        }
        var skip = page * limit;
        var tasks = ['count','query'];
        var total = 0;
        var results = [];
        async.eachSeries(tasks, function (item, callback) {
            switch (item) {
                case 'count':
                    ucrelsMod.count({"relation.type": 0, "userid": mUserid})
                        .exec(function (err, doc) {
                            if (err) console.log(err);
                            if(doc){
                                total = parseInt(doc);
                            }
                            callback();
                        });
                    break;
                case 'query':
                    switch (type) {
                        case 1: //课程
                            //###1.populate方式
                            ucrelsMod.find({"relation.type": 0, "userid": mUserid})
                                .populate(
                                    {
                                        path: 'userid',
                                        select: {},
                                        model: "user",
                                        match: {usertype: 0,name:{ $regex: mKeyWord }}
                                    }
                                )
                                .sort({score:1}).limit(limit).skip(skip)
                                .exec(function (err, docs) {
                                    if (err) console.log(err);
                                    var courses = [];
                                    docs.forEach(function (value) {
                                        courses.push(value.courceid);
                                    });
                                    coursesMod.find({_id: {$in: courses}}, function (err, datas) {
                                        datas.forEach(function (data) {
                                            docs.forEach(function (ucrel) {
                                                if (data._id == ucrel.courceid) {
                                                    results.push({
                                                        course: data, ucrelUser: ucrel,
                                                        user: ucrel.userid,
                                                        id: data._id,
                                                        type: '1',   //课程
                                                        typename:res.__('usercenter.MyFavorites.Courses')
                                                    });
                                                }
                                            });
                                        });
                                        callback();
                                    })
                                });
                            break;
                        //老师
                        //老师与学生关系（老师收藏学生，老师收藏老师，学生收藏老师）
                        case 2:
                            //relation.type:1 收藏关系
                            console.log(mUserid);
                            turelsMod.find({"relation.type": 1, "subjectid": mUserid})
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
                                        results.push({
                                            data:value,
                                            teacher:value.objectid,
                                            id:value._id
                                        });
                                    });
                                    callback();
                                });
                            break;
                        default:
                            break;
                    }
                    break;
            }
        }, function (err) {
            if (err) res.json(err);
            res.json([{total: total, page:page ,limit :limit, data: results}]);
        });

    },
//####################################################################
//查询我的收藏
//@param type 1:课程，2:教师，3：机构，0：所有
//url: http://localhost:3000/mod/user/queryFavorite?type=1&keyword=
//####################################################################
exports.clearFavorite = function (req, res, next){
    /*res.json({
        title:"操作成功！"
    });*/
    var mUserid = '';
    var mUserType = 0;
    if (req.session.user) {
        mUserid = req.session.user.userid;
        mUserType = req.session.user.usertype;
    }
    var id = ";"
    var type = 1;
    if (req.query.type) {
        type = parseInt(req.query.type);
    }
    if (req.query.id) {
        id = req.query.id;
    }
    switch (type) {
        case 1: //课程
            //###1.populate方式
            ucrelsMod.remove({"_id":id})
                .exec(function (err, docs) {
                    if (err){
                        res.json({
                            title:res.__('usercenter.MyFavorites.success')
                        });
                    }else{
                        res.json({
                            title:res.__('usercenter.MyFavorites.fail')
                        });
                    }
                });
            break;
        //老师与学生关系（老师收藏学生，老师收藏老师，学生收藏老师）
        case 2:
            var result = [];
            console.log(mUserid);
            turelsMod.remove({"relation.type": 1, "subjectid": mUserid})
                .exec(function (err, docs) {
                    if (err) console.log(err);
                });
            break;
        default:
            res.json([]);
            break;
    }
},

//####################################################################
//查询我的收藏(教师用户扩展一 老师认证tcreds)
//@param type 1:课程，2:教师，3：机构，0：所有
//url: http://localhost:3000/mod/user/queryTcreds?id=1
//####################################################################
exports.queryTcreds = function (req, res) {
    var tcredId;
    if (req.query.id) {
        tcredId = req.query.id;
    }
    console.log(tcredId);
    tcredMod.findOne({'_id':tcredId}, function (err, result) {
        if (err) console.log(err);
        res.json(result);
    });
},
//####################################################################
//删除我的收藏
//@parem id
//@param type 1:课程，2:教师，3：机构，0：所有
//url: http://localhost:3000/mod/user/removeFavorite?id=1
//####################################################################
exports.removeFavorite = function (req, res, next){

},
testmapReduce = function () {
        /*
         var teachersModel = mongoose.model('user_teachers',{});
         turelsMod.find({'subjectid':userId,'relation.type':0})
         .populate(
         {
         path:'objectid',
         select:'name email age sex',
         model:"user_teachers"
         })
         .exec(function(err, docs) {
         if (err) console.log(err);
         console.log(docs);
         }
         );*/
        //###2.mapReduce方式
        //获取session的user
        /*var students = this.mapReduceUserMod(0,'user_students');
         userMod.mapReduce(students, function (err, model, stats) {
         console.log('map reduce took %d ms', stats.processtime)
         })
         var teachers = this.mapReduceUserMod(1,'user_teachers');
         userMod.mapReduce(teachers, function (err, model, stats) {
         console.log('map reduce took %d ms', stats.processtime)
         });

         var studentsModel = mongoose.model('user_students',{});
         var teachersModel = mongoose.model('user_teachers',{});

         studentsModel.find({},function(err,docs){
         if(err)console.log(err);
         console.log(docs);
         });
         teachersModel.find({},function(err,docs){
         if(err)console.log(err);
         console.log(docs);
         });
         res.json({status:'success'});*/
    }

//拆分user表为多个表（user-students,user-teachers...）
mapReduceUserMod = function (type, newModelName) {

    var mapReduce = {};
    mapReduce.map = function () {
        emit(this.usertype, this)
    };
    mapReduce.query = {usertype: {$eq: type}};
    mapReduce.reduce = function (k, values) {
        var result = {};
        values.forEach(function (value) {
            var field;
            for (field in value) {
                if (value.hasOwnProperty(field)) {
                    result[field] = value[field].toFixed(0);
                }
            }
        });
        return result;
    };
    mapReduce.out = {reduce: newModelName};

    userMod.mapReduce(mapReduce, function (err, model, stats) {
        console.log('map reduce took %d ms', stats.processtime)
    })
    return mapReduce;
}
