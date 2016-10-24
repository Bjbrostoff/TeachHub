var async = require('async');
var uuid = require('node-uuid');

var homeworkSchemaDBmodel = require('../model/homework');
var hwrelSchemaDBModel = require('../model/hwrel');
var courseSchemaDBmodel = require('../model/course');
var tcrelSchemaDBmodel = require('../model/tcrel');
var ucrelSchemaDBmodel = require('../model/ucrel');
var homeworkMod = new homeworkSchemaDBmodel.Schema('homework').model;
var hwrelMod = new hwrelSchemaDBModel.Schema('hwrel').model;
var userSchemaDBmodel = require('../model/user');
var userMod = new userSchemaDBmodel.Schema('user').model;
var courseMod = new courseSchemaDBmodel.Schema('course').model;
var tcrelMod= new tcrelSchemaDBmodel.Schema('tcrel').model;
var ucrelMod = new ucrelSchemaDBmodel.Schema('ucrel').model;
//var sthomeworkMod = new homeworkSchemaDBmodel.Schema('homework').model;

exports.getAllHomeWork = function(req,res){
	var session = req.session;
	if(session == undefined){
		res.reject ="/";
		return;
	}
	var user = session.user;
	var userid = user.userid;
	var type = req.query.type ;
	if(type == undefined){
		type = 0;
	}
	hwrelMod.find({'userid':userid,'type':type,'enable':true}).populate({"path":"hwid"}).exec(function(err,collection){
		console.log(err);
		if (err){
			res.json({
				"code":"202",
				"msg":"数据不存在"
			})
		}else{
			console.log(collection);
			res.json(collection);
		}
	});
};

exports.saveStuWork = function(req,res){
	var id = req.body.hwrelid;
	var content = req.body.content;
	hwrelMod.update({"_id":id},{$set:{hwcontent:content}},{},function(err,dd){
		if(err){
			res.json({"code":"202","msg":"数据库异常！"})
		}else{
			res.json({"code":"200"})
		}
	});

};

exports.commitStuWork  = function(req,res){
	var id = req.body.hwrelid;
	var content = req.body.content;
	hwrelMod.update({"_id":id},{$set:{hwcontent:content,type:1,commitdate:new Date()}},{},function(err,dd){
		if(err){
			res.json({"code":"202","msg":"数据库异常！"})
		}else{
			res.json({"code":"200"})
		}
	});
}

exports.createData = function(req,res){
	var task = ['stu','tea','homework'];
	var stu_id = "66373b0f-539d-47d6-bc3a-5c27b5133bfe";
	var teacherid = "5dd8c7ec-7991-47d1-a363-61661055334c";
	var courseid = "test-favoritee10aa060-da2b-4d39-bfa2-8e153cdb0deb";
	/*async.eachSeries(tasks, function (item, callback) {
			switch(item){
				case 'stu':{
					userMod.findone({"usertype":0}).exec(function(err,o){
						stu_id = o._id;
					});
					break;
				}
			}
	},function(err){
		if (err){
			res.json({
				"code":"202",
				"msg":"数据不存在"
			})
		}else{
			res.json(result.ucrel);
		}
	});*/
	var hms = [];
	var rels = [];
	for(var i = 0; i < 10; i++)
	{
		var id = uuid.v4();
		var xx = {
			'_id': id ,
			'teacherid': teacherid,
				'courseid':courseid,
			'hwcontent': "vavavv"+ i,
			'hwtitle':"title"+i
		};
		hms.push(xx);
		var yy = {
			'_id':uuid.v4(),
			'userid':stu_id,
			'hwid':id,
			'type':0
		};
		rels.push(yy);
	}
	var homework = new homeworkMod(hms);
	homeworkMod.collection.insert(hms,function(err,doc){
		hwrelMod.collection.insert(rels,function(errx,dd){
			res.json({"code":"200"});
		})
	})

}
exports.sthwunchecked = function( req , res){//查询未批改的作业

	var userid = req.session.user.userid;
	hwrelMod.find({"teacherid":userid,"type":1}).populate([
		   {"path":"userid","select":"name"},
		   {"path":"courseid","select":"name"},
		   {"path":"hwid","select":"hwtitle hwcontent"}
	   ]).sort({"commitdate":-1})
	    	.exec(function(err,coll){
		    	res.json(coll);
	    	});

};

exports.markingHomework = function(req , res){//老师批改作业后提交，更新作业状态
	var series = ['updatehwrel', 'updatehomework'];
	var data = JSON.parse(req.body.data);

					hwrelMod.update(
						{
							_id:data.id
						},{
							$set:{
								score:data['hwscores'],
								teamarkdate:data['hwcheckdate'],
								hwcontent:data['hwcontent'],
								type:2
							}
						}
						,function(err, list){
							if(err){
								callback();
							}else{
								res.json({
									state:true,
									msg:'success',
									data:list
								});
							}
						}
					)

};

exports.findcheckedhw = function( req , res){//查询已批改的作业
	var userid = req.session.user.userid;
	hwrelMod.find({"teacherid":userid, "type":2}).populate([
		{"path":"userid","select":"name"},
		{"path":"courseid","select":"name"},
		{"path":"hwid","select":"hwtitle hwcontent"}
	  ]).sort({"teamarkdate":-1}).exec(function(err,collection){
			res.json(collection);
		});
};


exports.stharrangeselect = function( req , res){//老师发布时，选择课程

	var userid = req.session.user.userid;
	var series = ['courseName', 'userId'];
	var courseNameResult = {};
	var userinfo = {};
	var resultEnd = {};
	var uu = {};
	var index = 0;
	async.eachSeries(
		series,
		function(item, callback){
			switch (item){
				case 'courseName':
					courseMod.find(
						{
							userid:userid
						},'_id name', function(err, list){
							if (err){
								res.json({
									state:false,
									data:null
								});
								callback();
							}else{
								courseNameResult={
									state:true,
									data:list
								};
								callback();
							}
						}
					);
					break;
				case 'userId':
					if(courseNameResult.state){
						var arr = [];
						for (var i = 0; i < courseNameResult.data.length; i++) {
							var ccid = courseNameResult.data[i]._id;
							arr.push(ccid);
							ucrelMod.find(
								{'courceid':ccid},"_id userid"
							).populate({"path":"userid","select":"name email"}).exec(function (err ,list){
								if(err){
									index++;
									courseNameResult = {
										state:false,
										data:null
									};

								}else{
									userinfo[arr[index]] = list;
									index++;
									if(index == arr.length){
										callback();
									}

								}
							});
						}

					}
					else {
						resultEnd = {
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
				res.json(resultEnd);
			} else {
				resultEnd = {
					courseName:courseNameResult.data,
					userid:userinfo
				};

				res.json(
					resultEnd
				);

			}
		}
	);
};

exports.homeworkrelease = function(req, res){//老师在学生作业中布置作业发布

	var teacherid = req.session.user.userid;
	var data = JSON.parse(req.body.data);
	var useridarr = data.useridarray;//某门课程下，学生id数组
	var hwid = uuid.v4();
	var series = ['homework', 'hwrcel'];
	var result = {};
	var zindex = 0;
	console.log(useridarr);
	async.eachSeries(
		series,
		function(item, callback){
			switch (item){
				case 'homework':{
				homeworkMod.find({
					},
					function(err ,list){
						var array = {
							_id:hwid,
							courseid:data['courseid'],
							teacherid:teacherid,
							hwtitle:data['hwtitle'],
							hwcontent:data['hwcontent']
						};
						if (err ){
							result = {
								state:false,
								msg:'fail',
								data:null
							};
							callback();
						}else{
							var homeworkEntity = new homeworkMod(array);
							homeworkEntity.save(function(err){
								console.log(err);
							});
							callback();
						}
					});
					break;
				}
				case  'hwrcel':{

					if(result.state == false){
						callback();
						return;
					}

					var hwrcelid ;
					for(var i = 0 ; i < useridarr.length; i++){
						hwrcelid = uuid.v4();
						var array = {
							_id:hwrcelid,
							userid:useridarr[i],
							courseid:data['courseid'],
							teacherid:teacherid,
							hwid:hwid
						};
						var hwrelEntity = new hwrelMod(array);
						hwrelEntity.save(function(err){
							console.log(err);
							if(zindex  == useridarr.length-1){
								callback();
							}
							zindex++;
						});
					}
					break;
				}
			}
		},
		function(err){
			if (err){
				res.json({
					state:false,
					msg:'fail'
				})
			}else{
				res.json({
					state:true,
					msg:'success'
				})
			}
		}
	)

}
