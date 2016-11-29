/**
 * Created by xiaoguo on 2015/12/14.
 */

var userDBSchema = require('../model/user');
var userMod = userDBSchema.Schema('user').model;
var tcredSBSchema = require('../model/tcred');
var tcredMod = tcredSBSchema.Schema('tcred').model;
var courseSchemaDBModel = require('../model/course');
var courseMod = new courseSchemaDBModel.Schema('course').model;
var indexUtil = require("../util/index");
var i18n =  require("i18n");
var config=require('../config/config');
var json = indexUtil.indexjson();
var recomteachersArr = indexUtil.recomTeachers();
var recomcoursesArr = indexUtil.recomCourses();
var recomagenciesArr = indexUtil.recomAgencies();

exports.index = function(req, res, next){
    var lang = i18n.getLocale() === 'en'?'en':'cn';
    i18n.setLocale(lang);
    req.session.locale = lang;

    if (recomteachersArr.length < 1||recomcoursesArr.length < 1){
        var sorttagt = {'likes':-1};
        var sorttagc = {'comment':-1};
        var sorttaga = {'starlevel':-1};
        var userqo = {};
        userqo['usertype'] = 1;
        userqo['enable'] = 1;
        userMod.find(userqo)
            .populate({
                path:'tcredid',
                select:'name acadecerti servexerti info'
            })
            .sort(sorttagt)
            .exec(function(err, docs){
                console.log(err);
                var arr = [];
                for (var i=0; i < docs.length; i++){
                    var doc = docs[i];
                    if (doc.tcredid != null){
                        arr.push(doc);
                    }
                }
                var page = 1;
                var num = 3;
                var arr2 = [];
                var total = page*num;
                if (total > arr.length){
                    total = arr.length;
                }
                for (var j = (page-1)*num; j < total; j++){
                    arr2.push(arr[j]);

                }
                var degreearray = ['学士以下','学士','硕士','博士','无'];
                var stararray = ['无星级','一星级','二星级','三星级','四星级','五星级'];
                for(var i=0; i<arr2.length; i++){
                    var model = {};


                    var userinfo = {};
                    userinfo['uuid'] = arr2[i]._id;
                    userinfo['name'] = arr2[i].tcredid.name;
                    userinfo['nationality'] = arr2[i].nationality;
                    userinfo['city'] = arr2[i].city;
                    userinfo['portrait'] = arr2[i].portrait;

                    var custominfo = {};
                    custominfo['degree'] = degreearray[arr2[i].tcredid.acadecerti.level];
                    custominfo['servexerti'] = arr2[i].tcredid.servexerti;
                    custominfo['starlevel'] = stararray[arr2[i].starlevel];

                    var optioninfo = arr2[i].tcredid.info;

                    model['userinfo'] = userinfo;
                    model['custominfo'] = custominfo;
                    model['optioninfo'] = optioninfo;
                    recomteachersArr.push(model);
                }
                var courseqo = {};
                courseqo['statelv.lv'] = 1;
                courseqo['statelv.type'] = 0;
                courseqo['enable'] = true;
                console.log(courseqo);
                courseMod.find(courseqo)
                    .populate({
                        path:'userid',
                        select:'_id tcredinfo',
                        model:"user"
                    })
                    .sort(sorttagc)
                    .exec(function(err, docs){
                        console.log("111"+docs.length);
                        var arr = [];
                        for (var i=0; i < docs.length; i++){
                            var doc = docs[i];
                            if (doc.userid != null){
                                arr.push(doc);
                            }
                        }
                        var page = 1;
                        var num = 8;
                        var arr2 = [];
                        var total = page*num;
                        if (total > arr.length){
                            total = arr.length;
                        }
                        for (var j = (page-1)*num; j < total; j++){
                            arr2.push(arr[j]);
                        }
                        for(var i=0; i<arr2.length; i++){
                            var model = {};
                            model['courseId'] = arr2[i]._id;
                            model['name'] = arr2[i].name;
                            if(typeof(arr2[i].image)=='undefined'){
                                model['image'] = "/images/course1.jpg";
                            }else{
                                model['image'] = arr2[i].image;
                            }
                            model['introduction'] = arr2[i].introduction;
                            model['price'] = arr2[i].price;
                            model['teacherid'] = arr2[i].userid._id;
                            model['teachername'] = (arr2[i].userid.tcredinfo)?arr2[i].userid.tcredinfo.name:"";

                            recomcoursesArr.push(model);
                        }
                        var agencyqo = {};
                        agencyqo['usertype'] =2;
                        agencyqo['enable'] = 1;
                        userMod.find()
                            .sort(sorttaga)
                            .exec(function(err, docs){
                                var page = 1;
                                var num = 4;
                                var arr2 = [];
                                var total = page*num;
                                if (total > docs.length){
                                    total = docs.length;
                                }
                                for (var j = (page-1)*num; j < total; j++){
                                    arr2.push(docs[j]);
                                }
                                var stararray = ['一星级','二星级','三星级','四星级','五星级'];
                                for(var i=0; i<arr2.length; i++){
                                    var model = {};
                                    model['uuid'] = arr2[i]._id;
                                    model['name'] = (arr2[i].agencyredinfo)?arr2[i].agencyredinfo.name:'';
                                    model['city'] = arr2[i].city;
                                    model['phone'] = arr2[i].phone;
                                    model['image'] = (arr2[i].agencyredinfo)?arr2[i].agencyredinfo.image:'';
                                    model['starlevel'] = stararray[arr2[i].starlevel];
                                    model['coursecount'] = arr2[i].coursecount;
                                    model['teachercount'] = arr2[i].teachercount;
                                    recomagenciesArr.push(model);
                                }
                            })
                        indexRender(req,res);
                    })
            })
    }else{
        indexRender(req,res);
    }
	function indexRender(req, res){
		var sinfo = {};
		if (req.session){
			sinfo = {
				user:req.session.user
			}
		}
		res.render("index", {
			title:"Teach Hub",
			page:"index",
			login:"login",
			language:req.session.language,
			sessinfo:sinfo,
			courses:recomcoursesArr,
			users:json.users,
			teachers:recomteachersArr,
			agencies:recomagenciesArr
		});
	}
}