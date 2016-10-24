/**
 * Created by lqk on 2015/12/8.
 */
/**
 * Created by apple on 15/12/6.
 */
var md5 = require('md5');
var usersDBModel = require('../model/user');
var cremsgsDBmodel = require('../model/cremsg');
var tcredSchemaDBmodel = require('../model/tcred');
var agencySchemaDBmodel = require("../model/agencyred");
var userMod = new usersDBModel.Schema('user').model;
var cremsgsMod = new cremsgsDBmodel.Schema('cremsg').model;
var teachercertMod = new tcredSchemaDBmodel.Schema('tcred').model;
var agencyredMod = new agencySchemaDBmodel.Schema("agencyred").model;
var mailCtlr = require('../controller/mail');
var uuid = require('node-uuid');
var multiparty = require('multiparty');
var fs = require("fs");
var async = require('async');
exports.register = function(req,
                            res, next) {
    var data={};
    var email = req.body.email;
    var vcCode = req.body.vcCode;
	vcCode = vcCode.toUpperCase();
    var vcode = mailCtlr.getVcList(email);
	vcode = vcode.toUpperCase();
    if(vcCode!=vcode) {
        data.success=false;
        data.message='验证码错误！';
        res.json(data);
        return;
    }else{
        var password = req.body.password;
        password = md5(password);
	    var uid = uuid.v4();
        var entity = new userMod({
            email:email,
            password:password,
	        _id:uid,
	        enable:1,
	        usertype:0


        });
        userMod.find({"email": email}, function(err, collection){
            if(err) {

            } else{
                if( collection==null || collection.length==0) {
                    entity.save(function (err, user) {
                        if(!err) {
                            data = {
                                success:true,
                                message:'保存成功！',
	                            uid:uid
                            };
                            return res.json(data);
                        }else{
	                        data = {
		                        success:false,
		                        message:'保存失败！'
	                        };
	                        return res.json(data);
                        }
                    });
                }else{
                    data={
                        success:false,
                        message:'用户已存在！'
                    };
                    return res.json(data);
                }
            }
        })
    }

}

//陈世（登陆）
exports.loginIn = function(req, res, next){
    var username = req.body.username;
    var password = req.body.password;
    console.log("用户名:"+username+",password:"+password);
    password = md5(password);
	console.log("用户名:"+username+",password:"+password);
    userMod.find({"email": username}, function(err, collection){
        if(err) {
            console.log("bad query!");
        } else{
            if( collection==null || collection.length==0) {
                console.log("用户名;"+username+"不存在!");
	            res.json({"code":202,msg:"用户名"+username+"不存在!"});
                //res.redirect('/');
            }else{
                console.log("用户名;"+username+"存在!");
                console.log("用户名;"+username+"开始密码验证!");
                userMod.find({"email": username,"password":password}, function(err, collection){
                    if(err) {
                        console.log("bad query!");
	                    res.json({"code":202,msg:"数据库问题"});
                       // res.redirect('/demo');
                    } else {
                        if (collection == null || collection.length == 0) {
                            console.log("密码不正确！");
	                        res.json({"code":202,msg:"密码不正确"});
	                       // res.redirect('/demo');
                        } else {
							var co = collection[0];
	                        var userid = co._doc._id;
	                        var usertype = co._doc.usertype;
							var portrait = co._doc.portrait;
                            console.log("用户名密码正确，跳转到登陆成功页面！");

                            //res.writeHead(301, {'Location':'/demo'});
                            //res.end();
                            req.session.user = {username:username, userid:userid,sid:uuid.v4(),usertype:usertype,portrait:portrait};
                            //res.json({status:"true"});
                            console.log(req.session.user);
	                        res.json({"code":200,msg:"登陆成功"});
                          //  res.redirect('/users/center');
                        }
                    }
                });
            }
        }
    });
}
//add by lcc 图片上传
exports.fileUpload = function(req,res,next) {
	var maxuploadsize =1*1024*1024;

	if (req.headers['content-length']> maxuploadsize){
		res.json({"code":"202","msg":"请上传少于1M的文件"});
		return;
	}
	var form = new multiparty.Form();
	form.uploadDir='public/files';
	//上传完成后处理

	if(!fs.existsSync( './public/files/')){
		fs.mkdirSync( './public/files/');
	}
	form.parse(req, function(err, fields, files) {
		var filesTmp = JSON.stringify(files,null,2);

		if(err){
			console.log('parse error: ' + err);
		} else {

			var inputFile = files.file[0];
			var uploadedPath = inputFile.path;
			var picUUID = uuid.v4();
			var originalFileName =  inputFile.originalFilename.toLowerCase();
			var arr = originalFileName.split(".");
			if(arr.length != 2|| !isImage(arr[1]) ){
				res.json({code: 500, msg: "请上传正确格式的图片"});
				return;
			}

			var dstPath = './public/files/' +  picUUID+"."+arr[1];
			var fileName = 'files/' + picUUID+"."+arr[1];
			//重命名为真实文件名
			fs.rename(uploadedPath, dstPath, function(err) {
				if(err){
					console.log('rename error: ' + err);
					res.json({code: 500, msg: "图片上传失败"});
					return;
				} else {
					console.log('rename ok');
					res.json({code: 200, msg: {url: 'http://' + req.headers.host + '/' + fileName}});
				}
			});

		}



	});
}

exports.toBasicAuth = function(req,res,next) {
	var userId = req.body.userId;

	userId = 1;
	res.render("register/basicAuth", {
		title:"认证",
		page:"index",
		login:"login",
		sessinfo:{}

	});

}


//lcc 注册之后让他登陆
exports.regToSession = function(req, res, next){
	var username = req.body.username;
	var uid = req.body.userId;
	userMod.find({"_id":uid},function(err,collection){
		if(err){
			req.session.user = {username:username, userid:uid,usertype:"0"};
		}else{
			if(collection.length == 1){
				req.session.user = {username:username, userid:uid,usertype:collection[0].usertype};
			}else{
				req.session.user = {username:username, userid:uid,usertype:"0"};
			}

		}

		res.json({});
	});


}

//暂时定为教师认证选项
exports.authenticate = function(req,res,next){


	var userrole = req.body.userrole;
	var content = new Array();
	var name = req.body.name;
	content.push(pushContent("name","真实姓名",name,"1"));
	var credentype = req.body.credentype;
	content.push(pushContent("credentype","证件类型",credentype,"1"));
	var credencode = req.body.credencode;
	content.push(pushContent("credencode","证件号码",credencode,"1"));
	var credenImg = req.body.credenImg;
	content.push(pushContent("credenimage","证件照片",credenImg,"2"));
	var payway = req.body.payway;
	content.push(pushContent("payway","付款方式",payway,"1"));
	var acadecerti = req.body.acadecerti;
	if( acadecerti != undefined && acadecerti != 'undefined' ){
		acadecerti = JSON.parse(acadecerti);
		content.push(pushContent("acadecerti.level","学历",acadecerti.level,"1"));
		content.push(pushContent("acadecerti.image","学位证",acadecerti.image,"2"));
		content.push(pushContent("acadecerti.code","学位证号码",acadecerti.code,"1"));

	}
	var servexerti = req.body.servexerti;
	if( servexerti != undefined && servexerti != 'undefined' ){

		content.push(pushContent("servexerti","荣誉资质", servexerti,"3"));
	}
	var workexp = req.body.workexp;
	if(workexp  !==undefined && workexp !='undefined'){
		content.push(pushContent("workexp","工作经验",workexp,"1"));
	}
	//将userid改为session中用户uid  req.session.user.uid
	var uid = uuid.v4();
	var session = req.session;
	var userid = '';
	if(session){
		var user = session.user;
		userid = user.userid;
	}
	var entity = new cremsgsMod({
		_id:uid,
		type:"1",
		userid:userid,
		status:"1",
		content:content

	});

	cremsgsMod.find({"userid":userid,"status":'1'},function(err,collection) {
		if(err){
			res.json({"code":202,"msg":"系统错误"});
		}else{
			console.log(collection);
			if(collection.length == 0){
				entity.save(function (err, user) {
					if(err){
						res.json({'code':500,success:false});
					}else{
						res.json({'code':200,success:true});

					}
				});
			}else{
				res.json({"code":202,"msg":"您还有一条身份验证未被认证，请等待。"});
			}
		}
	});


}


//暂时定为机构认证选项
exports.authagency = function(req,res,next){


	var userrole = req.body.userrole;
	var content = new Array();
	var name = req.body.name;
	content.push(pushContent("name","公司名字",name,"1"));
	var image = req.body.image;
	content.push(pushContent("image","营业执照",image,"2"));

	var acadecerti = req.body.legalinfo ;
	if( acadecerti != undefined && acadecerti != 'undefined' ){
		acadecerti = JSON.parse(acadecerti);
		content.push(pushContent("legalinfo.name","法人名字",acadecerti.name,"1"));
		content.push(pushContent("legalinfo.image","法人证件",acadecerti.image,"2"));
		content.push(pushContent("legalinfo.code","法人证件号码",acadecerti.code,"1"));

	}
	var servexerti = req.body.servexerti;
	if( servexerti != undefined && servexerti != 'undefined' ){

		content.push(pushContent("servexerti","荣誉资质", servexerti,"3"));
	}

	//将userid改为session中用户uid  req.session.user.uid
	var uid = uuid.v4();
	var session = req.session;
	var userid = '';
	if(session){
		var user = session.user;
		userid = user.userid;
	}
	var entity = new cremsgsMod({
		_id:uid,
		type:4,
		userid:userid,
		status:"1",
		content:content

	});
	cremsgsMod.find({"userid":userid,"status":'1'},function(err,collection) {
		if(err){
			res.json({"code":202,"msg":"系统错误"});
		}else{
			console.log(collection);
			if(collection.length == 0){
				entity.save(function (err, user) {
					if(err){
						res.json({'code':500,success:false});
					}else{
						res.json({'code':200,success:true});

					}
				});
			}else{
				res.json({"code":202,"msg":"您还有一条身份验证未被认证，请等待。"});
			}
		}
	});



}




//暂时定为机构再次认证选项
exports.authagencyDB = function(req,res,next){

	var session = req.session;
	var userid = '';
	if(session){
		var user = session.user;
		if(user == undefined){
			res.reject("/");
			return;
		}
		userid = user.userid;
	}
	var _id = req.body._id;
	var content = new Array();
	cremsgsMod.find({"userid":userid,"status":'1'},function(err,collection) {
		if(err){
			res.json({"code":202,"msg":"系统错误"});
		}else{
			console.log(collection);
			if(collection.length == 0){
				agencyredMod.find({"userid":userid,"enable":true},function(err,coll){
					var data = coll[0];
					var name = req.body.name;
					console.log(data);
					if(name != data.name){
						content.push(pushContent("name","公司名字",name,"1"));
					}

					var image = req.body.image;
					if(image != data.image){
						content.push(pushContent("image","营业执照",image,"2"));
					}

					var acadecerti = req.body.legalinfo ;
					if( acadecerti != undefined && acadecerti != 'undefined' ){
						acadecerti = JSON.parse(acadecerti);
						if(acadecerti.name != data.legalinfo.name || acadecerti.image != data.legalinfo.image || acadecerti.code!= data.legalinfo.code ){
							content.push(pushContent("legalinfo.name","法人名字",acadecerti.name,"1"));
							content.push(pushContent("legalinfo.image","法人证件",acadecerti.image,"2"));
							content.push(pushContent("legalinfo.code","法人证件号码",acadecerti.code,"1"));
						}

					}
					var servexerti = req.body.servexerti;
					if( servexerti != undefined && servexerti != 'undefined' ){

						content.push(pushContent("servexerti","荣誉资质", servexerti,"3"));
					}

					//将userid改为session中用户uid  req.session.user.uid
					var uid = uuid.v4();
					var session = req.session;
					var userid = '';
					if(session){
						var user = session.user;
						userid = user.userid;
					}
					var entity = new cremsgsMod({
						_id:uid,
						type:4,
						userid:userid,
						status:"1",
						content:content

					});
					entity.save(function (err, user) {
						if(err){
							res.json({'code':500,success:false});
						}else{
							res.json({'code':200,success:true});

						}
					});
				});

			}else{
				res.json({"code":202,"msg":"您还有一条身份验证未被认证，请等待。"});
			}
		}
	});


}


//暂时定为教师再次认证选项
exports.authenticateDB = function(req,res,next){

	var session = req.session;
		var userid = '';
		if(session){
			var user = session.user;
			if(user == undefined){
				res.reject("/");
				return;
			}
			userid = user.userid;
		}
		var _id = req.body._id;
		var content = new Array();
		cremsgsMod.find({"userid":userid,"status":'1'},function(err,collection){
			if(err){
				res.reject("/");
				return;
			}else{
			if(collection.length == 0){

				teachercertMod.find({"_id":_id},function(err, collection){
					if(err){
						res.json({"code":202,"msg":"数据库服务有问题，请联系管理员"});
					}else{
						var dd ;
						if(collection == null || collection.length == 0){
							//这种情况应该不存在，这个当作教师的再次认证界面，所以这个数据必须存在。
						}else{
							dd = collection[0];
							var name = req.body.name;
							//当和原先的认证数据不相同的时候，发送给管理员进行重新认证
							if(name != dd.name){
								content.push(pushContent("name","真实姓名",name,"1"));
							}
							var credentype = req.body.credentype;

							var credencode = req.body.credencode;

							var credenimg = req.body.credenImg;
							if(credentype != dd.credentype || credencode != dd.credencode ||  credenimg != dd.credenimage ){
								content.push(pushContent("credencode","证件号码",credencode,"1"));
								content.push(pushContent("credentype","证件类型",credentype,"1"));
								content.push(pushContent("credenimage","证件照片",credenimg,"2"));
							}

							var payway = req.body.payway;
							if(payway != dd.payway){
								content.push(pushContent("payway","付款方式",payway,"1"));
							}

							var acadecerti = req.body.acadecerti;
							if( acadecerti != undefined && acadecerti != 'undefined' ){
								acadecerti = JSON.parse(acadecerti);
								if(acadecerti.level != dd.acadecerti.level || acadecerti.image != dd.acadecerti.image || acadecerti.code != dd.acadecerti.code) {
									content.push(pushContent("acadecerti.level", "学历", acadecerti.level, "1"));
									content.push(pushContent("acadecerti.image", "学位证", acadecerti.image, "2"));
									content.push(pushContent("acadecerti.code", "学位证号码", acadecerti.code, "1"));
								}


							}
							var servexerti = req.body.servexerti;
							if( servexerti != undefined && servexerti != 'undefined' ){

								content.push(pushContent("servexerti","荣誉资质", servexerti,"3"));
							}

							var workexp = req.body.workexp;
							if(workexp  !==undefined && workexp !='undefined'){
								if(workexp != dd.workexp){
									content.push(pushContent("workexp","工作经验",workexp,"1"));
								}
							}
							//将userid改为session中用户uid  req.session.user.userid
							var uid = uuid.v4();
							var entity = new cremsgsMod({
								_id: uid,
								type:"1",
								userid:userid,
								status:"1",
								content:content

							})
							entity.save(function (err, user) {
								if(err){
									res.json({'code':500,success:true});
								}else{
									//cremsgsMod.find({"_id":uid},function(err,docs){
									//	if(docs.length != 1){
									//		return {"code":202,"msg":"存在多条数据"};
									//	}else{
									//		var doc = docs[0];
									//		userMod.update({"_id":userid},{'usertype':"1"},{},function(){});
									//		cremsgsMod.update({"_id":uid},{status:2} ,{},function(err,dd){
                                    //
									//		});
									//		var arr = doc._doc.content;
									//		var fileds = {};
									//		var ent = {}
									//		try{
									//			for(var i = 0 ; i < arr.length ; i++){
									//				var n = arr[i]._doc.filedname;
									//				var att = n.split(".");
									//				if(att.length > 1){
									//					var aa = ent[att[0]];
									//					if(typeof aa == 'undefined'){
									//						aa = {};
                                    //
									//					}
									//					aa[att[1]] = arr[i]._doc.value;
									//					ent[att[0]] = aa;
									//				}else{
									//					ent[n] = arr[i]._doc.value;
									//				}
                                    //
									//				fileds[n] = arr[i]._doc.value;
									//			}}catch(e){
									//			console.log(e);
									//		}
									//		teachercertMod.find({"userid":userid},function(err,co){
									//			if(co.length == 1){
									//				var mod = co[0];
									//				teachercertMod.update({"_id":mod._id},{ $set: ent},{},function(err,dddd){
									//					teachercertMod.find({"userid":userid},function(err,xx){
									//						userMod.update({"_id":userid},{"tcredinfo":xx[0]},{},function(err){});
									//					});
									//				});
									//			}else if(co.length == 0){
									//				ent.userid = userid;
									//				ent._id = uuid.v4();
									//				var en = new teachercertMod(ent);
									//				en.save(function(err,eee){
									//					console.log(eee);
									//					teachercertMod.find({"userid":userid},function(err,xx){
									//						userMod.update({"_id":userid},{"tcredinfo":xx[0]},{},function(err){});
									//					});
									//				})
									//			}
									//		});
                                    //
                                    //
                                    //
									//	}
									//});
									res.json({'code':200,success:true});
								}
							});
						}
					}

				});

			}else{
				res.json({"code":202,"msg":"您还有一条身份验证未被认证，请等待。"});
			}
		}
	})




}

exports.forgetpwd = function(req, res,next){
	res.render('register/forgetpwd', {
		title:"B&C Platform",
		page:"",
		login:"login",
		sessinfo:{},
		courses:{},
		teachers:{},
		agency:{}
	});
}



//获得json格式的数据
	function pushContent(fieldname,filedaliases,value,fieldtype){

		var obj =  {'filedname':fieldname, 'filedaliases':filedaliases, 'value':value , 'fieldtype':fieldtype }; // 1:文本形式，2：图片形式
		return obj;
}
//是否是照片格式
	function isImage(fileEnd){
		fileEnd = fileEnd.toLowerCase();
		if("png" == fileEnd || "jpg" == fileEnd || "gif" == fileEnd ){
			return true;
		}else{
			return false;
		}
	}

//将验证通过
	function passRet(id){
		console.log(id);

	}
exports.findUser = function(req,res,next){
	var email = req.body.email;
	userMod.find({"email":email},function(err,data){
		if(err){
			res.json({"code":"202","msg":"数据库错误，请联系管理员"})
		}else{
			if(data.length == 1){
				res.json({"code":"200"})
			}else{
				res.json({"code":"202","msg":"用户不存在"})
			}
		}
	})
}

exports.checkValidate = function(req,
                            res, next) {
	var data = {};
	var email = req.body.email;
	var vcCode = req.body.vcCode;
	vcCode = vcCode.toUpperCase();
	var vcode = mailCtlr.getVcList(email);
	if(vcCode == vcode){
		res.json({"code":"200"});
	}else{
		res.json({"code":"202"});
	}
}


exports.checkValidate = function(req,
                                 res, next) {
	var data = {};
	var email = req.body.email;
	var vcCode = req.body.vcCode;
	vcCode = vcCode.toUpperCase();
	var vcode = mailCtlr.getVcList(email);
	if(vcCode == vcode){
		res.json({"code":"200"});
	}else{
		res.json({"code":"202"});
	}
}

exports.updatePwdForForget = function(req,res,next){
	var email = req.body.email;
	var password = req.body.password;
	password = md5(password);
	userMod.update({"email":email},{password:password},{},function(){});
	res.json({"code":"200"});

}


exports.toBasicAuthXg = function(req,res,next) {
	var userId = req.body.userId;

	userId = 1;
	res.render("register/basicAuthSecond", {
		title:"认证",
		page:"index",
		login:"login",
		sessinfo:{}

	});

}

//查询用户的基本信息
exports.baseinfoDetail = function(req, res){
	console.log(__('language'));
	var usertype = req.session.user.usertype;
	var userid = req.session.user.userid;
	var series = ['userinfo', 'teacherinfo'];
	var teacherinfo = {};
	var userinfo = {};
	var resultEnd = {};

	if(usertype == 1){

		async.eachSeries(
			series,
			function(item, callback){
				switch (item){
					case 'userinfo':

						userMod.find({
								_id:userid
							},
							'-_id, -password'
							, function(err, useritem){
								if (err){
									res.json({
										state:false,
										msg:'fail',
										data:null
									});
									callback();
								}else{
									userinfo = {
										state: true,
										msg: 'success',
										data: useritem[0]
									};

									callback();
								}
							});
						break;
					case 'teacherinfo':
						if(userinfo.state){

							teachercertMod.find({
									_id:userinfo.data.tcredid
								},
								'info _id'
								, function(err, list){
									if (err){
										res.json({
											state:false,
											msg:'fail',
											data:null
										});
										callback();
									}else{
										teacherinfo = {
											state: true,
											msg: 'success',
											data: list[0].info
										};
										callback();
									}
								});
						}
						break;
				}
			},
			function (err) {
				if (err) {
					res.json(resultEnd);
				} else {
					resultEnd = {
						userinfo:userinfo.data,
						teacherinfo:teacherinfo.data
					};
					res.json(
						resultEnd
					);

				}
			}
		);
	}else {
		userMod.find({
				_id:userid
			},
			'-_id, -password'
			, function(err, useritem){
				if (err){
					res.json({
						state:false,
						msg:'fail',
						data:null
					});

				}else{
					resultEnd = {
						userinfo:useritem[0]
					};
					res.json(
						resultEnd
					);
				}
			});
	}

}

//更新用户基本信息（包括更新tcred中的info字段）
exports.updateInfo = function(req, res){
	var userid = req.session.user.userid;
	var info = JSON.parse(req.body.data);
	var series = ['userinfo', 'teacherinfo'];
	if(info.tcredinfo){
		async.eachSeries(
			series,
			function(item, callback){
				switch (item){
					case 'userinfo':
						userMod.update({
								_id:userid
							},{
								$set:{
									name:info['name'],
									sex:info['sex'],
									age:info['age'],
									email:info['email'],
									phone:info['phone'],
									birth:info['birth'],
									city:info['city'],
									nationality:info['nationality'],
									location:{lat:info['lat'],lng:info['lng']}
								}
							},
							function(err){
								if (err){
									res.json({
										state:false,
										msg:'fail',
										data:null
									});
									callback();
								}else{
									res.json({
										state:true,
										msg:'success',
										data:info
									});
									callback();
								}
							});
						break;
					case 'teacherinfo':
						teachercertMod.update({
								_id:info.tcredinfo._id
							},
							{
								$set:{
									info:{
										mothertongue:{value:info['tcredinfo'].mothertongue},
										info:{value:info['tcredinfo'].info},
										language:{value:info['tcredinfo'].language},
										skilledcourse:{value:info['tcredinfo'].skilledcourse},
										almaMater:{value:info['tcredinfo'].almaMater},
										currentAgency:{value:info['tcredinfo'].currentAgency}
									}
								}
							}
							, function(err){
								if (err){
									res.json({
										state:false,
										msg:'fail',
										data:null
									});
									callback();
								}else{
									callback();
								}
							});
						break;
				}
			},
			function (err) {
				if (err) {
					res.json({
						state:false,
						msg:'fail',
						data:null
					})
				} else {

				}
			}
		);
	}else {
		userMod.update({
				_id:userid
			},{
				$set:{
					name:info['name'],
					sex:info['sex'],
					age:info['age'],
					email:info['email'],
					phone:info['phone'],
					birth:info['birth'],
					city:info['city'],
					nationality:info['nationality'],
					location:{lat:info['lat'],lng:info['lng']}
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
					res.json({
						state:true,
						msg:'success',
						data:info
					})
				}
			});
	}
	teachercertMod.find({"userid":userid},function(err,list){
		userMod.update({"_id":userid},{"tcredinfo":list[0]},{},function(err){});
	});
};


exports.updateUserPassword = function(req, res){
	var userid = req.session.user.userid;
	var info = JSON.parse(req.body.data);
	var oPassword =md5(String(info.oldPassword));
	var nPassword = md5(String(info.newPassword));
	userMod.find({
			_id:userid
		},
		'password',
		function(err , list){
			if (err){
				res.json({
					state:false,
					msg:'fail'
				})
			}else{
				if(list[0].password ==oPassword){
					userMod.update({
							_id:userid
						},
						{
							$set:{
								password:nPassword
							}
						},
						function(err){
							if (err){
								res.json({
									state:false,
									msg:'fail'
								})
							}else{
								req.session.destroy(function(err) {
									// cannot access session here
									res.json({
										state:true,
										msg:'success'
									});
								})

							}
						})
				}else{
					res.json({
						state:false,
						msg:'fail'
					})
				}
			}
		});
};