/**
 * Created by apple on 16/1/9.
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

var calnodeDBSchema = require("../../model/calnode");
var calnodeMod = calnodeDBSchema.Schema("calnode").model;



exports.modcourses = function(req, res){
    var statusArr = [0,1,2,3];

    for (var i=0; i < 50; i++){

    }
}


exports.createCourse = function(req,res,next){
	userMod.find({},function(err,collection){
		if(collection.length > 0 ){
			for(var xx = 0 ; xx < collection.length ;xx++){
				var cc = collection[xx];
				var userid = cc._id;
				for(var i = 0 ; i < 10; i++){
					var courseId = uuid.v4();
					var entity = new courseMod({
						_id:courseId,
						name:"英语"+i,
						introduction:"这是个简介",
						info:"这是一门英语课",
						catalog:"这是课程目录",
						billing:
						{
							type:{
								fvalue:1,
								fdetail:"标准"
							},
							info:{
								total:10,
								duration:60
							}
						},
						price:"50",
						method:{
							type: 1,
							name: "上门授课"
						},
						mode:{
							type: 0,
							name: "一对一"
						},range:{
							min:1,max:10
						},


						//课程评分 (接收程度。。。。)
						score:"6",
						//课程点赞
						comment:100+i,
						//可用状态 (老师删除掉的课程状态不可用 0不可用 1可用)
						enable:1,
						//----审核信息----
						//创建日期
						cdate: new Date(),
						//审核状态 0未审核 1等待审核 2审核中 3审核成功 4审核失败
						checkstate:{
							type: 3,
							name: '审核成功'
						},
						//发布状态 0未发布 1已发布 2已下架
						pubstate:
						{
							type: 1,
							name: "已发布"
						},
						//进行状态 0未开课 1进行中 2已结束
						actstate:{
							type: 0,
							name: "未开课"
						}
					});
					entity.save(function(err){

					});
					var tcl = new tcrels({
						teacherid:userid,//教师id
						relation:{//#关系 （0拥有,1创建 ?待定）
							type:1,
							name:"拥有"
						},
						courceid:courseId//课程id
					});
					tcl.save(function(err){
						console.log("tcl"+err);
					})
				}
			}
		}
	});
	res.json({
		state:'success'
	})
}

exports.modMyCourses = function(req, res){
	var series = ['teachers',  'courses', 'redundancy'];
	var result = {};

	async.eachSeries(
		series,
		function(item, callback){
			switch (item){
				case 'teachers':
					userMod
						.find(
							{
								usertype:1
							},
							'-credinfo',
							function(err, list){
								if (err){
									result.teachers = {
										state:false,
										msg:'fail',
										data:null
									}

									callback();
								}else{
									console.log(111);
									result.teachers = {
										state:true,
										msg:'success',
										data:list
									};
									callback();
								}
							})
					break;
				case 'courses':
					if (!result.teachers.state){
						result.courses = {
							state:false,
							msg:'fail',
							data:null
						};
						callback();
					}else{
						var courseArr = [];
						var courseDic = {};
						console.log(result.teachers.data.length);
						for (var i = 0; i < result.teachers.data.length; i++){
							var teacher = result.teachers.data[i];
							var arr = [];
							for (var j = 0; j < 10; j++){
								var courseId = uuid.v4();
								var course = {
									_id:courseId,
									userid:teacher._id,
									name:"英语"+(i*10+j),
									image:"/images/course1.jpg",
									introduction:"这是个简介",
									info:"这是一门英语课",
									catalog:"这是课程目录",
									billing:
									{
										fvalue:j%2+1,
										fdetail:"标准收费"
									},
									price:"50",
									method:{
										type: j%3+1,
										name: "上门授课"
									},
									classroom:'',
									mode:{
										type: j%2,
										name: "一对一"
									},range:{
										min:1,max:10
									},

									//课程评分 (接收程度。。。。)
									score:i*10+j,
									//课程点赞
									comment:i*10+j,
									//可用状态 (老师删除掉的课程状态不可用 0不可用 1可用)
									enable:true,
									//----审核信息----
									//创建日期
									cdate: new Date(),
									statelv:{
										lv:1,
										type:0,
										name:'接受报名中'
									},
									signnum:0,
									actnum:0,
									favnum:0
								};
								courseArr.push(course);
								arr.push(course);
							}
							courseDic[teacher._id]=arr;

						}
						courseMod.collection.insert(courseArr, function(err){
							if (err){
								result.courses = {
									state:false,
									msg:'fail',
									data:null
								}
								callback();
							}else{
								result.courses = {
									state:true,
									msg:'success',
									data:courseDic
								}
								callback();
							}
						});

					}
					break;
				case 'redundancy':
					if (!result.courses.state){
						result.redundancy = {
							state:false,
							msg:'fail',
							data:null
						}
						callback();
					}else{
						var bulk = userMod.collection.initializeOrderedBulkOp();

						for (var i = 0; i < result.teachers.data.length; i++){
							var teacher = result.teachers.data[i];
							bulk.find({'_id': teacher._id})
								.update({$set: {
									managecourses:result.courses.data[teacher._id]
								}});
						}

						bulk.execute(function (err) {
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
						});
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
				if (!result.redundancy.state){
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
		}
	);
}

//创建可安排课程，加入老师的ID
//statelv:{lv:2,type:1,name:'进行中'}
//enable要为true
exports.createCalendar=function(req,res){
	userMod.find({},function(err,collection){
		if(collection.length > 0 ){
			for(var xx = 0 ; xx < collection.length ;xx++){
				var cc = collection[xx];
				var userid = cc._id;
				for(var i = 0 ; i < 2; i++){
					var courseId = uuid.v4();
					var entity = new courseMod({
						_id:courseId,
						userid:userid,
						name:"英语"+i,
						introduction:"这是个简介",
						info:"这是一门英语课",
						catalog:"这是课程目录",
						billing:
						{
							type:{
								fvalue:1,
								fdetail:"标准"
							},
							info:{
								total:10,
								duration:60
							}
						},
						price:"50",
						method:{
							type: 1,
							name: "上门授课"
						},
						mode:{
							type: 0,
							name: "一对一"
						},range:{
							min:1,max:10
						},

						//课程评分 (接收程度。。。。)
						score:"6",
						//课程点赞
						comment:100+i,
						//可用状态 (老师删除掉的课程状态不可用 0不可用 1可用)
						enable:true,
						//----审核信息----
						//创建日期
						cdate: new Date(),
						//审核状态 0未审核 1等待审核 2审核中 3审核成功 4审核失败
						checkstate:{
							type: 3,
							name: '审核成功'
						},
						//发布状态 0未发布 1已发布 2已下架
						pubstate:
						{
							type: 1,
							name: "已发布"
						},
						//进行状态 0未开课 1进行中 2已结束
						actstate:{
							type: 0,
							name: "未开课"
						},
						// lv=0, 未发布 0:未审核 1:等待审核 2:审核中 3:审核成功 4:审核失败
						// lv=1, 发布 0:报名 1:报名截至
						// lv=2, 进行中 0:准备开课 1:进行中 2:结课
						// lv=3, 下架 0:已下架
						// lv=-1
						statelv:{
							lv:2,
							type:1,
							name:'进行中'
						}
					});
					entity.save(function(err){

					});
					//var tcl = new tcrels({
					//	teacherid:userid,//教师id
					//	relation:{//#关系 （0拥有,1创建 ?待定）
					//		type:1,
					//		name:"拥有"
					//	},
					//	courceid:courseId//课程id
					//});
					//tcl.save(function(err){
                    //
					//})
				}
			}
		}
	});
	res.json({
		state:'success'
	})
}

