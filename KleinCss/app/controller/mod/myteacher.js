/**
 * Created by cs on 2016/1/20.
 * 我的老师（学生用户、老师用户等...）
 */
var mongoose = require('mongoose');
var turelSchema = require('../../model/turel');
var turelMod = turelSchema.Schema('turel').model;
var ucrelSchema = require('../../model/ucrel');
var ucrelMod = ucrelSchema.Schema('ucrel').model;
var tcrelSchema = require('../../model/tcrel');
var tcrelMod = tcrelSchema.Schema('tcrel').model;
var courseSchema = require('../../model/course');
var courseMod = courseSchema.Schema('course').model;
var userSchema = require('../../model/user');
var userMod = userSchema.Schema('user').model;
var tcredSchema = require('../../model/tcred');
var tcredMod = userSchema.Schema('tcred').model;

var uuid = require('node-uuid');
var md5 = require('md5');
var async = require('async');
var querykey = /test-myteachers/; //测试数据前缀（模糊查询用）
var key = "test-myteachers";      //测试数据关键字（生产id用）

//####################################################################
//生产数据(目前在我的收藏，我的老师测试通过)
//@param count（可选，默认20）
//@param usertype(0:学生用户(默认),1:老师,2:机构，3:管理员)
//url like:http://localhost:3000/mod/user/modMyTeachers?count=100
//####################################################################
exports.modMyTeachers = function (req, res, next) {
    var mUserid = uuid.v4();
    var mUserType = 1;
    //session
    if (req.session.user) {
        if (req.session.user.userid) mUserid = req.session.user.userid;
    }
    //query params
    var count = 20; //默认数据20个
    if (req.query.count) {
        count = parseInt(req.query.count);
    }
    if (req.query.usertype) {
        mUserType = parseInt(req.query.usertype);
    }
    var turels = []; //老师学生关系
    var ucrels = []; //学生与课程关系
    var tcrels = [];  //老师与课程关系
    var courses = []; //课程
    var teachers = []; //老师 user表 usertype 1
    var tcreds = [];  // 老师认证 用户扩展
    var mTeacherid;
    var mTcredid;
    var index = 0;
    var mTurelState = 0;
    //测试数据学生用户四门课程
    for (var i = 0; i < count; i++) {
        if (i % 4 == 0) {
            mTeacherid = key + uuid.v4();
            mTcredid = key + uuid.v4();
        }
        var mCourseid = key + uuid.v4();
        var mRelationArr = ['收藏', '报名', '上课', '学完'];
        var mCourseNameArr = ['日常英语', '职场英语', '数学', '计算机'];
        var mTeacherMethodArr = ['教室授课', '上门授课', '网上远程授课'];
        var mStateArr = ['准备开课', '进行中', '结课'];
        var mCityArr = ['杭州', '北京', '上海', '广州', '深圳'];
        var mStarlevelArr = ['无星级', '一星级', '二星级', '三星级', '四星级', '五星级'];
        var mTestName = ['学生', '老师', '机构', '管理员'];
        var mTestNameEn = ['student', 'teacher', 'agency', 'manager'];
        //老师学生关系 model turel
        if (i % 4 == 0) {
            var mTurelRelation = index % 2;
            var turel = {
                subjectid: mUserid,
                //关系 0教学关系 1收藏关系
                relation: {
                    type: mTurelRelation,
                    name: mTurelRelation == 0 ? '教学关系' : '收藏关系'
                },
                //客体 客体唯一标识
                objectid: mTeacherid,
                //状态 教学关系（0正在授课 1曾经授课）
                state: {
                    type: mTurelState % 2,
                    name: mTurelState % 2 == 0 ? '正在授课' : '曾经授课'
                },
                enable: true
            }
            if (mTurelRelation == 0) mTurelState++;
            turels.push(turel);
        }
        //学生与课程关系 model ucrel
        var ucrel = {
            userid: mUserid,
            //关系(0：收藏 1：报名 2：上课 3：学完)
            relation: {
                type: i % 4,
                name: mRelationArr[i % 4]
            },
            //课程id
            courceid: mCourseid,
            //老师ID
            teacherid: mTeacherid,
            //状态
            state: 0,
            enable: true
        }
        //老师与课程关系 model tcrel
        var tcrel = {
            teacherid: mTeacherid,//教师id
            relation: {//#关系 （0拥有,1创建 ?待定）
                type: i % 2,
                name: i % 2 == 0 ? '拥有' : '创建'
            },
            courceid: mCourseid,//课程id
            enable: true //1:可用，0：不可用
        }
        //课程 model course
        var course = {
            _id: mCourseid,
            userid: mTeacherid,
            //课程名称
            name: mCourseNameArr[i % 3],
            //简介
            introduction: '十年教学经验，每年80%的学生保送国外各个名校',
            //详情
            info: '我们是最专业的，做到最好！',
            //大纲、目录
            catalog: '',
            //计费方式 json
            billing: {
                fvalue: i % 2,
                fdetail: i % 2 == 0 ? '按小时计费' : '标准计费'
            },
            //单价
            price: '20$/h',
            //授课方式 0教室授课，1上门授课，2网上远程授课
            method: {
                type: i % 3,
                name: mTeacherMethodArr[i % 3]
            },
            //授课地点 (教室授课方式指定的地点 其他授课方式不需要)
            classroom: '',
            //授课模式 0一对一 1一对多
            mode: {
                type: i % 2,
                name: i % 2 == 0 ? '一对一' : '一对多'
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
            score: Math.ceil(Math.random() * 40) + 60,
            //课程点赞
            comment: Math.ceil(Math.random() * 100),
            //可用状态 (老师删除掉的课程状态不可用 0不可用 1可用)
            enable: true,
            //----审核信息----
            //创建日期
            cdate: new Date().setFullYear(2016, (3 - i % 3), i),
            // lv=0, 未发布 0:未审核 1:等待审核 2:审核中 3:审核成功 4:审核失败
            // lv=1, 发布 0:报名 1:报名截至
            // lv=2, 进行中 0:准备开课 1:进行中 2:结课
            // lv=3, 下架 0:已下架
            // lv=-1
            statelv: {
                lv: 2, //我的老师只造进行中的数据
                type: i % 3,
                name: mStateArr[i % 3]
            },
            //报名的人数
            signnum: Math.ceil(Math.random() * 10) + 20,
            //上课的人数
            actnum: Math.ceil(Math.random() * 10) + 5
        }
        //用户扩展一 老师认证 model tcred
        if (i % 4 == 0) {
            var tcred = {
                _id: mTcredid,
                userid: mTeacherid,
                name: 'Chris' + i,
                credentype: "idcode",
                credencode: 'ABC-' + i,
                credenimage: '',
                payway: "",
                acadecerti: {
                    level: i % 5,
                    image: '',
                    code: ''
                },
                servexerti: [
                    {
                        time: "2009年",
                        info: '带领哈佛大学篮球队取得常春藤联盟分组冠军，进入NCAA64强',
                        image: ''
                    },
                    {
                        time: "2010年",
                        info: '获得哈弗大学经济学学士学位',
                        image: ''
                    },
                    {
                        time: "2013年",
                        info: '获得哈弗大学经济学博士学位',
                        image: ''
                    },
                    {
                        time: "2014年",
                        info: '与金州勇士队签约，成为自1953年后首位进入NBA的哈佛大学学生',
                        image: ''
                    }
                ],
                workexp: '6 years',
                info: {
                    mothertongue: {
                        value: '英语',
                        pub: '1'
                    },
                    language: {
                        value: '英语',
                        pub: '1'
                    },
                    skilledcourse: {
                        value: mCourseNameArr[i % 4],
                        pub: '1'
                    },
                    info: {
                        value: "来吧同学.来吧同学来吧同学来吧同学来吧同学",
                        pub: '1'
                    },
                    currentAgency:{
                        value:'A机构',
                        pub:'1'
                    },
                    almaMater:{
                        value:'XX大学',
                        pub:'1'
                    }

                }
            };
            tcreds.push(tcred);
        }
        //老师 model user  (usertype:1)
        if (i % 4 == 0) {
            var teacher = {
                _id: mTeacherid,
                tcredid: mTcredid, //老师认证表id
                name: mTestName[mUserType] + i,
                email: mTestNameEn[mUserType] + i + '@163.com',
                phone: '130888888' + (i < 10 ? '0' + i : i),
                password: md5('123456'),
                age: '24',
                sex: 'male',
                nationality: 'U.S.A',
                birth: '1990-10-10',
                enable: 1,
                usertype: mUserType,
                portrait: '/Inspinia/img/a' + (index % 8 + Number(1)) + '.jpg',
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
            if(mUserType==1) {
                teacher.tcredinfo = tcred;
            }
            teachers.push(teacher);
            index++;
        }
        ucrels.push(ucrel);
        tcrels.push(tcrel);
        courses.push(course);
    }

    //async生产数据
    var tasks = ['mod-turel', 'mod-ucrel', 'mod-tcrel', 'mod-course', 'mod-teacher', 'mod-tcred'];
    async.each(tasks, function (item, callback) {
        switch (item) {
            case 'mod-turel':
                turelMod.collection.insert(turels, function (err, docs) {
                    if (err) {
                        console.error(err);
                    }
                    else {
                        console.info('%d count turels were successfully stored.', docs['insertedCount']);
                        callback();
                    }
                })
                break;
            case 'mod-ucrel':
                ucrelMod.collection.insert(ucrels, function (err, docs) {
                    if (err) {
                        console.error(err);
                    }
                    else {
                        console.info('%d count ucrels were successfully stored.', docs['insertedCount']);
                        callback();
                    }
                })
                break;
            case 'mod-tcrel':
                tcrelMod.collection.insert(tcrels, function (err, docs) {
                    if (err) {
                        console.error(err);
                    }
                    else {
                        console.info('%d count tcrels were successfully stored.', docs['insertedCount']);
                        callback();
                    }
                })
                break;
            case 'mod-course':
                courseMod.collection.insert(courses, function (err, docs) {
                    if (err) {
                        console.error(err);
                    }
                    else {
                        console.info('%d count tcrels were successfully stored.', docs['insertedCount']);
                        callback();
                    }
                })
                break;
            case 'mod-teacher':
                userMod.collection.insert(teachers, function (err, docs) {
                    if (err) {
                        console.error(err);
                    }
                    else {
                        console.info('%d count teachers were successfully stored.', docs['insertedCount']);
                        callback();
                    }
                })
                break;
            case 'mod-tcred':
                tcredMod.collection.insert(tcreds, function (err, docs) {
                    if (err) {
                        console.error(err);
                    }
                    else {
                        console.info('%d count tcreds were successfully stored.', docs['insertedCount']);
                        callback();
                    }
                })
                break;
        }
    }, function (err) {
        res.json({
            status: 'success',
            turels: turels,
            ucrels: ucrels,
            tcrels: tcrels,
            courses: courses,
            teachers: teachers,
            tcreds: tcreds
        });
    });
},

//####################################################################
//删除我的老师测试数据
//url: http://localhost:3000/mod/user/clearMyTeachersTestData
//####################################################################
    exports.clearMyTeachersTestData = function (req, res, next) {
        var tasks = ['remove-turel', 'remove-ucrel', 'remove-tcrel', 'remove-course', 'remove-teacher', 'remove-tcred'];
        async.each(tasks, function (item, callback) {
            switch (item) {
                case 'remove-turel':
                    turelMod.remove({'objectid': querykey}, function (err, result) {
                        if (err) console.error(err);
                        callback();
                    });
                    break;
                case 'remove-ucrel':
                    ucrelMod.remove({'courceid': querykey}, function (err, result) {
                        if (err) console.error(err);
                        callback();
                    });
                    break;
                case 'remove-tcrel':
                    tcrelMod.remove({'courceid': querykey}, function (err, result) {
                        if (err) console.error(err);
                        callback();
                    });
                    break;
                case 'remove-course':
                    courseMod.remove({'_id': querykey}, function (err, result) {
                        if (err) console.error(err);
                        callback();
                    });
                    break;
                case 'remove-teacher':
                    userMod.remove({'_id': querykey}, function (err, result) {
                        if (err) console.error(err);
                        callback();
                    });
                    break;
                case 'remove-tcred':
                    tcredMod.remove({'_id': querykey}, function (err, result) {
                        if (err) console.error(err);
                        callback();
                    });
                    break;
            }
        }, function (err) {
            console.log("删除原来测试数据成功！");
            res.json({status: 'success'});
        });
    }

//####################################################################
//查询我的老师
//@param state -1：所有,0:正在授课 1:曾经授课(默认-1)
//url: http://localhost:3000/mod/user/queryMyTeachers?state=0
//####################################################################
exports.queryMyTeachers = function (req, res, next) {
    var reset = -1;
    var state = -1;
    var mUserid = uuid.v4();
    //session
    if (req.session.user) {
        if (req.session.user.userid) mUserid = req.session.user.userid;
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
    var teacherArr = [];
    var query;
    if (state == -1){
        query = {"objectid": mUserid, "relation.type": 0, "state.type": 0};
    } else if (state == 0){
        query = {"objectid": mUserid, "relation.type": 0, "state.type": 0, "coursecount": {$gt: 0}};
    }else if (state == 1){
        query = {"objectid": mUserid, "relation.type": 0, "state.type": 0, "coursecount": 0};
    }

    turelMod.find(query)
        .populate(
            {
                path: 'subjectid',
                select: {},
                model: "user",
                match: {usertype: 1}
            }
        )
        .exec(function (err, docs) {
            if (err) console.log(err);
            docs.forEach(function (value) {
                /**like keyword*/
                if (value.subjectid && value.subjectid.name.indexOf(keyword) > -1) {
                    teacherArr.push({
                        //@see front model 'app/usercenter/model/myteachers/MyTeacherListItemModel'
                        id: value.subjectid._id,
                        teacher: value.subjectid,
                        state: value.state
                    });
                }

            });
            res.json(teacherArr);
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
//查询我的老师的课程
//@param stateType -1：所有,0:正在授课 1:曾经授课(默认-1)
//@param teacherid
//url: http://localhost:3000/mod/user/queryMyTeacherCoursesByUserId?teacherid=
//####################################################################
    exports.queryMyTeacherCoursesByUserId = function (req, res, next) {
        var reset = -1;
        var state = -1;
        var mUserid = uuid.v4();
        var mUserType = 0;
        var mTeacherId;
        var mStateType = -1;
        //session
        if (req.session.user) {
            if (req.session.user.userid) mUserid = req.session.user.userid;
        }
        //query params
        var count = 20; //默认数据20个
        if (req.query) {
            if (req.query.count) count = parseInt(req.query.count);
            if (req.query.teacherid) mTeacherId = req.query.teacherid;
            if (req.query.stateType) mStateType = req.query.stateType;
        }
        if (!mTeacherId) {
            res.json('must param teacherid!');
            return;
        }
        console.log(mTeacherId);

        var tasks = ['get-courseIds', 'get-courses'];
        var teacherArr = [];
        var courseArr = [];
        var teacherIds = [];
        var courseIds = [];
        async.eachSeries(tasks, function (item, callback) {
            switch (item) {
                case 'get-courseIds':
                    //学生与课程关系
                    ucrelMod.find({"userid": mUserid, "teacherid": mTeacherId})
                        .exec(function (err, docs) {
                            if (err) console.log(err);
                            docs.forEach(function (doc) {
                                courseIds.push(doc.courceid);
                            });
                            callback();
                        });
                    break;
                case 'get-courses':
                    var query = {};
                    if (mStateType == 1) {
                        query = {"_id": {$in: courseIds}, "statelv.lv": 2, "statelv.type": 2}
                    } else {
                        query = {"_id": {$in: courseIds}, "statelv.lv": {$in: [1, 2]}};
                    }
                    courseMod.find(query)
                        .sort({'statelv.type': -1, 'cdate': 1})
                        .exec(function (err, docs) {
                            if (err) console.log(err);
                            courseArr = docs;
                            callback();
                        });
                    break;
            }
        }, function (err) {
            if (err) res.json(err);
            res.json(courseArr);
        });


    },
//####################################################################
//统计（统计图表用）
//url: http://localhost:3000/mod/user/queryMyTeacherCharts
//####################################################################
    exports.queryMyTeacherCharts = function (req, res) {
        var mUserid = querykey;
        if (req.session.user) {
        }
        if (req.session.user) {
            mUserid = req.session.user.userid;
        }
        var dataArr = [];
        var tasks = ["teaching", "teached"];
        var totalCount = 0;
        var countFun = function(dataArr,task,labelName,callback){
            turelMod.count(
                {
                    "objectid" : mUserid,
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
        /*var group = {
         key: {state: 1},
         cond: {objectid: mUserid, "relation.type": 0},
         reduce: function (curr, result) {
         result.data++;
         },
         initial: {
         label: "",
         data: 0
         },
         finalize: function (result) {
         result.label = result.state.name;
         delete result.state;
         }
         };
         turelMod.collection.group(
         group.key,
         group.cond,
         group.initial,
         group.reduce,
         group.finalize,
         function (err, results) {
         if (err) res.json(err);
         res.json(results);
         });*/
    },
    getRandomColor = function () {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }