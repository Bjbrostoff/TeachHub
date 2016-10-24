/**
 * Created by Administrator on 2016/1/25.
 */
var uuid = require('node-uuid');
var md5 = require('md5');
var async = require('async');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var userDBSchema = require('../../model/user');

var userMod = userDBSchema.Schema('user').model;

var tcredSBSchema = require('../../model/tcred');
var tcredMod = tcredSBSchema.Schema('tcred').model;
var courseSchema = require('../../model/course');
var courseMod = courseSchema.Schema('course').model;
var tcrelsSchema = require('../../model/tcrel');
var tcrels = tcrelsSchema.Schema('tcrel').model;


var homeworkSchema = require('../../model/homework');
var homeworkMod = homeworkSchema.Schema('homework').model;


//mod学生作业
exports.modStudentHomework = function(req, res){
    userMod.find({},function(err,collection){

        var hws = [];
        for(var i=0;i<3;i++){
            var hwuuid = uuid.v4();
            var userid = "9aee0b06-7cb5-4844-aa03-3e09b17c6857";
            var courseid = "903562ec-37a5-48e9-9e86-b4b00967c911";
            var studentid = "27ad1e73-205f-41ef-836a-13ea3d390b96";
            var stuhomework = {
                _id:hwuuid,
                teacherid:userid,
                courseid:courseid,
                studentid:studentid,
                studentname:"Patrick"+i,
                coursename:"计算机"+i,
                hwsubmitdate:"",
                hwcheckdate:"",
                hwcontent: '作业内容文本'+i,
                hwtitle:'作业'+i,
                hwscores:"",
                hwstatus:false,
                enable:1
            };
            hws.push(stuhomework);

        }
        console.log("++++++++++++=");
        console.log(hws);

        for(var j=0;j<3;j++){
            var homeworkEntity = new homeworkMod(hws[j]);
            homeworkEntity.save(function(err){
                console.log(err);
            });
        }

    });
    res.json({
        status:'sucess'
    })
};
//exports.modStudentHomework = function(req, res){
//    var series = ['teachers', 'courses', 'students'];
//    var result = {};
//
//    async.eachSeries(
//        series,
//        function(item, callback){
//            switch (item){
//                case 'teachers':
//                    userMod
//                        .find(
//                            {
//                                usertype:1
//                            },
//                            'course',
//                            function(err, list){
//                                if (err){
//                                    result.teachers = {
//                                        state:false,
//                                        msg:'fail',
//                                        data:null
//                                    }
//
//                                    callback();
//                                }else{
//                                    console.log(111);
//                                    result.teachers = {
//                                        state:true,
//                                        msg:'success',
//                                        data:list
//                                    };
//                                    callback();
//                                }
//                            })
//                    break;
//                case 'courses':
//                    if (!result.teachers.state){
//                        result.courses = {
//                            state:false,
//                            msg:'fail',
//                            data:null
//                        };
//                        callback();
//                    }else{
//                        var courseArr = [];
//                        var courseDic = {};
//                        for (var i = 0; i < result.teachers.data.length; i++){
//                            var teacherid = result.teachers.data[i]._id;
//                            var arr = [];
//                            courseMod
//                                     .find(
//                                         {userid:teacherid},
//                                         'name'
//                                         ,function(err,list){
//                                             if(err){
//                                                 result.course = {
//                                                     state:false,
//                                                     msg:'fail',
//                                                     data:null
//                                                 };
//                                                 callback();
//
//                                             }
//                                             else {
//                                                 result.course = {
//                                                     state:true,
//                                                     msg:'success',
//                                                     data:list
//                                                 };
//                                                 callback();
//                                             }
//                                         }
//                                     );
//                        }
//                        courseMod.collection.insert(courseArr, function(err){
//                            if (err){
//                                result.courses = {
//                                    state:false,
//                                    msg:'fail',
//                                    data:null
//                                }
//                                callback();
//                            }else{
//                                result.courses = {
//                                    state:true,
//                                    msg:'success',
//                                    data:courseDic
//                                }
//                                callback();
//                            }
//                        });
//
//                    }
//                    break;
//                case 'students':
//                    if (!result.courses.state){
//                        result.redundancy = {
//                            state:false,
//                            msg:'fail',
//                            data:null
//                        }
//                        callback();
//                    }else{
//                        var bulk = userMod.collection.initializeOrderedBulkOp();
//
//                        for (var i = 0; i < result.teachers.data.length; i++){
//                            var teacher = result.teachers.data[i];
//                            bulk.find({'_id': teacher._id})
//                                .update({$set: {
//                                    managecourses:result.courses.data[teacher._id]
//                                }});
//                        }
//
//                        bulk.execute(function (err) {
//                            if (err){
//                                result.redundancy = {
//                                    state:false,
//                                    msg:'fail',
//                                    data:null
//                                }
//                                callback();
//                            }else{
//                                result.redundancy = {
//                                    state:true,
//                                    msg:'success',
//                                    data:null
//                                }
//                                callback();
//                            }
//                        });
//                    }
//
//
//                    break;
//            }
//        },
//        function(err){
//            if (err){
//                res.json({
//                    state:false,
//                    msg:'fail',
//                    data:null
//                });
//            }else{
//                if (!result.redundancy.state){
//                    res.json({
//                        state:false,
//                        msg:'fail',
//                        data:null
//                    });
//                }else{
//                    res.json({
//                        state:true,
//                        msg:'success',
//                        data:null
//                    })
//                }
//            }
//        }
//    );
//}
