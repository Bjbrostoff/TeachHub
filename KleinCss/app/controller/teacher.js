/**
 * Created by xiaoguo on 2015/12/6.
 */
var fs = require('fs');
var teacherpath = "./app/config/recommendteachers.json";
var conditionpath = "./app/config/teachersearchcondition.json";

var underscore  = require('underscore');
var async = require('async');

//var teacherDBModel = require('../model/teacher');
//var userDBModel = require('../model/user');
//var teacherMod = new teacherDBModel.Schema('teacher').model;
//var userMod = new userDBModel.Schema('user').model;

var userDBSchema = require('../model/user');
var userMod = userDBSchema.Schema('user').model;
var tcredSBSchema = require('../model/tcred');
var tcredMod = tcredSBSchema.Schema('tcred').model;

var indexUtil = require('../util/index');

var i18n = require('i18n');




//
exports.index = function(req, res){
    var login = false;
    if(req.session.user){
        login = true;
    }
    console.log(login);
    res.render('index/teachers', {
        wwww:'',
        login:login,
        title:'Teach Hub'
    });
}

//推荐的老师
exports.recommendation = function(req, res){
    console.log(req.query);
    if (typeof(req.query.type ) != 'undefined'){
        var qo = req.query.qo;
        var usern = {};
        if(qo.skilledcourse != 'all'){
            usern['tcredinfo.info.skilledcourse.value'] = qo.skilledcourse;
        }
        if(qo.degree!="all"){
            usern['tcredinfo.acadecerti.level'] = qo.degree;
        }
        if(qo.starlevel!="all"){
            usern['starlevel'] = qo.starlevel;
        }
        if(qo.city!="all"){
            usern['city'] = qo.city;
        }
        if(req.query.fuzzyquery!='all'){
            var fuzzyquery = [];
            var queryreg = new RegExp(req.query.fuzzyquery);
            fuzzyquery.push({'tcredinfo.name':queryreg});
            fuzzyquery.push({'sex':queryreg});
            fuzzyquery.push({'nationality':queryreg});
            fuzzyquery.push({'city':queryreg});
            usern['$or'] = fuzzyquery;
        }
        usern['usertype'] = 1;
        usern['enable'] = 1;
        var sorttag = {};
        var sortdistance = false;
        var userlocation = {lng:120.25,
            lat:30.15};
        if(req.query.sorttag=='likes'){
            sorttag = {'likes':-1};
        }else if(req.query.sorttag=='score'){
            sorttag = {'score':-1};
        }

        var series = ['distance', 'manage'];
        var result = {};

        async.eachSeries(
            series,
            function(serieStep, callback){
                switch (serieStep){
                    case 'distance':
                        if(req.session.user!='undefined' && req.query.sorttag=='distance'){
                            userMod.find({'_id':req.session.user.userid})
                                .exec(function(err, docs){
                                    if (err){
                                        result.distance = {
                                            state:false,
                                            data:{},
                                            msg:'fail'
                                        }
                                        callback();
                                    }else{
                                        var user = docs[0];
                                        if(user.location.lat&&user.location.lng){
                                            userlocation = user.location;
                                            sortdistance= true;
                                        }else{
                                            userlocation = {
                                                lng:120.25,
                                                lat:30.15
                                            };
                                            sortdistance= true;
                                        }

                                        result.distance = {
                                            state:true,
                                            data:{},
                                            msg:'success'
                                        }
                                        callback();
                                    }

                                });
                        }else{
                            result.distance = {
                                state:true,
                                data:null,
                                msg:'success'
                            }
                            callback();
                        }

                        break;
                    case 'manage':
                        if (!result.distance.state){
                            result.manage = {
                                state:false,
                                msg:'fail',
                                data:null
                            }
                            callback();
                        }else{
                            userMod.find(usern, "-managecourses")
                                .sort(sorttag)
                                .exec(function(err, docs){
                                    if (err){
                                        result.manage = {
                                            state:false,
                                            msg:'fail',
                                            data:null
                                        }
                                        callback();
                                    }else{
                                        console.log(docs.length);
                                        var docarr=docs;
                                        if(sortdistance){
                                            underscore.each(docs, function(item){
                                                item.distance = Math.pow(item.location.lat-userlocation.lat, 2)+Math.pow(item.location.lng-userlocation.lng, 2);
                                            });
                                            docarr = underscore.sortBy(docs,function(location){
                                                return location.distance;
                                            });
                                        };

                                        var resjson = {};
                                        var count;

                                        count = docarr.length;
                                        var page = req.query.page;
                                        var num = req.query.limit;
                                        var arr2 = [];
                                        var total = page*num;
                                        if (total > count){
                                            total = count;
                                        }
                                        for (var j = (page-1)*num; j < total; j++){
                                            arr2.push(docarr[j]);

                                        }
                                        console.log('--------mark-------------');
                                        console.log(arr2.length);
                                        var collection = [];
                                        var degreearray = ['学士以下','学士','硕士','博士','无'];
                                        var stararray = ['无星级','一星级','二星级','三星级','四星级','五星级'];
                                        for(var i=0; i<arr2.length; i++){
                                            var model = {};
                                            model['uuid'] = arr2[i]._id;
                                            model['name'] = (arr2[i].tcredinfo)?arr2[i].tcredinfo.name:'';
                                            model['nationality'] = arr2[i].nationality;
                                            model['city'] = arr2[i].city;
                                            model['location'] = arr2[i].location;
                                            model['portrait'] = arr2[i].portrait;
                                            model['degree'] = degreearray[(arr2[i].tcredinfo)?((arr2[i].tcredinfo.acadecerti)?arr2[i].tcredinfo.acadecerti.level:1):1];
                                            model['servexerti'] = (arr2[i].tcredinfo)?arr2[i].tcredinfo.servexerti:[];
                                            model['starlevel'] = stararray[arr2[i].starlevel];
                                            model['agencyid'] = arr2[i].agencyid;
                                            model['agencyname'] = arr2[i].agencyname;
                                            model['workexp'] = (arr2[i].tcredinfo)?arr2[i].tcredinfo.workexp:"";
                                            var hasinfo = true;
                                            console.log(arr2[i].email);
                                            if(typeof arr2[i].tcredinfo  === 'undefined'){
                                                hasinfo = false;
                                            }else if (typeof arr2[i].tcredinfo['info']  === 'undefined'){
                                                hasinfo = false;
                                            }
                                            if (hasinfo){
                                                model['currentagency'] = (arr2[i].tcredinfo.info.currentAgency)?arr2[i].tcredinfo.info.currentAgency.value:'';
                                                model['mothertongue'] = (arr2[i].tcredinfo.info.mothertongue)?arr2[i].tcredinfo.info.mothertongue.value:'';
                                                model['almaMater'] = (arr2[i].tcredinfo.info.almaMater)?arr2[i].tcredinfo.info.almaMater.value:'';
                                                model['collegeDegree'] = (arr2[i].tcredinfo.info.collegeDegree)?arr2[i].tcredinfo.info.collegeDegree.value:'';
                                                model['skilledcourse'] = (arr2[i].tcredinfo.info.skilledcourse)?arr2[i].tcredinfo.info.skilledcourse.value:'';
                                                model['info'] = (arr2[i].tcredinfo.info.info)?arr2[i].tcredinfo.info.info.value:'';

                                            }else {
                                                model['currentagency'] = '';
                                                model['mothertongue'] = '';
                                                model['almaMater'] = '';
                                                model['collegeDegree'] = '';
                                                model['skilledcourse'] = '';
                                                model['info'] = '';
                                            }

                                            collection.push(model);
                                        }

                                        resjson['count'] = count;
                                        resjson['collection'] = collection;

                                        result.manage = {
                                            state:true,
                                            msg:'success',
                                            data:resjson
                                        }

                                        callback();

                                    }


                                })
                        }


                        break;
                }
            },
            function(err){
                if (err){
                    res.json({
                        count:0,
                        collection:[]
                    });
                }else{
                    if (!result.manage.state){
                        res.json({
                            count:0,
                            collection:[]
                        });
                    }else{
                        res.json(result.manage.data);
                    }
                }
            }
        )

    }
    else{
        var teacherjson = indexUtil.recomteachers();
        res.json(teacherjson);
    }
}

//老师的详细资料
exports.searchOneDetail = function(req, res){
    console.log(req.query);
    if (typeof(req.query.type ) != 'undefined'){
        var qo = req.query.qo;

        //console.log(usern);
        userMod.find(qo)
            .exec(function(err, docs){
                console.log(err);

                var doc = docs[0];
                var model = {};

                var degreearray = ['学士以下','学士','硕士','博士','无'];
                var stararray = ['无星级','一星级','二星级','三星级','四星级','五星级'];
                model['uuid'] = doc._id;
                model['name'] = doc.tcredinfo.name;
                model['sex'] = doc.sex;
                model['age'] = doc.age;
                model['nationality'] = doc.nationality
                model['city'] = doc.city;;
                model['location'] = doc.location;
                model['portrait'] = doc.portrait;
                model['degree'] = degreearray[doc.tcredinfo.acadecerti.level];
                model['servexerti'] = doc.tcredinfo.servexerti;
                model['starlevel'] = stararray[doc.starlevel];
                model['agencyid'] = doc.agencyid;
                model['agencyname'] = doc.agencyname;
                model['workhistory'] = (doc._doc.workhistory)?doc._doc.workhistory:[];
                model['workexp'] = (doc.tcredinfo)?doc.tcredinfo.workexp:"";
                model['optioninfo'] = (doc.tcredinfo)?doc.tcredinfo.info:{
                    collegeDegree:{
                        value:'',
                        pub:'1'
                    },
                    currentAgency:{
                        value:'',
                        pub:'1'
                    },
                    almaMater:{
                        value:'',
                        pub:'1'
                    },
                    info:{
                        value:''
                    },
                    skilledcourse:{
                        value:''
                    },
                    language:{
                        value:''
                    },
                    mothertongue:{
                        value:''
                    }
                };

                res.json(model);
            })
    }else{
        var teacherjson = indexUtil.recomteachers();
        res.json(teacherjson);
    }
}

//老师的课程
exports.searchCourses = function(req, res){
    console.log(req.query);
    if (typeof(req.query.type ) != 'undefined'){
        var qo = req.query.qo;

        //console.log(usern);
        userMod.find(qo)
            .exec(function(err, docs){
                console.log(err);

                var doc = docs[0];
                var arr = doc.managecourses;
                var resjson = {};
                var count;
                count = arr.length;
                var page = req.query.page;
                var num = req.query.limit;
                var total = page*num;
                if (total > arr.length){
                    total = arr.length;
                }
                var arr2 = [];
                for (var j = (page-1)*num; j < total; j++){
                    arr2.push(arr[j]);
                }
                resjson['count'] = count;
                resjson['collection'] = arr2;
                res.json(resjson);
            })
    }else{

    }
}

//机构旗下老师
exports.searchProxyTeachers = function(req, res){
    console.log(req.query);
    if (typeof(req.query.type ) != 'undefined'){
        var qo = req.query.qo;

        var teacherqo = {};
        teacherqo['agencyid'] = qo.agencyid;
        teacherqo['usertype'] = 1;
        teacherqo['enable'] = 1;

        userMod.find(teacherqo)
            .exec(function(err, docs){
                console.log(err);

                var resjson = {};
                var count;

                count = docs.length;
                var page = req.query.page;
                var num = req.query.limit;
                var arr2 = [];
                var total = page*num;
                if (total > count){
                    total = count;
                }
                for (var j = (page-1)*num; j < total; j++){
                    arr2.push(docs[j]);

                }
                console.log('--------mark-------------');
                console.log(arr2.length);
                var collection = [];
                var degreearray = ['学士以下','学士','硕士','博士','无'];
                var stararray = ['无星级','一星级','二星级','三星级','四星级','五星级'];
                for(var i=0; i<arr2.length; i++){
                    var model = {};
                    model['uuid'] = arr2[i]._id;
                    model['name'] = (arr2[i].tcredinfo)?arr2[i].tcredinfo.name:'';
                    model['nationality'] = arr2[i].nationality;
                    model['city'] = arr2[i].city;
                    model['portrait'] = arr2[i].portrait;
                    model['degree'] = degreearray[(arr2[i].tcredinfo)?((arr2[i].tcredinfo.acadecerti)?arr2[i].tcredinfo.acadecerti.level:1):1];
                    model['starlevel'] = stararray[arr2[i].starlevel];
                    model['workexp'] = (arr2[i].tcredinfo)?arr2[i].tcredinfo.workexp:'';
                    model['mothertongue'] = (arr2[i].tcredinfo)?((arr2[i].tcredinfo.info.mothertongue)?arr2[i].tcredinfo.info.mothertongue.value:''):'';
                    model['almaMater'] = (arr2[i].tcredinfo)?((arr2[i].tcredinfo.info.almaMater)?arr2[i].tcredinfo.info.almaMater.value:''):'';
                    model['collegeDegree'] = (arr2[i].tcredinfo)?((arr2[i].tcredinfo.info.collegeDegree)?arr2[i].tcredinfo.info.collegeDegree.value:''):'';
                    model['skilledcourse'] = (arr2[i].tcredinfo)?((arr2[i].tcredinfo.info.skilledcourse)?arr2[i].tcredinfo.info.skilledcourse.value:''):'';
                    model['introduction'] = (arr2[i].tcredinfo)?((arr2[i].tcredinfo.info.info)?arr2[i].tcredinfo.info.info.value:''):'';

                    collection.push(model);
                }

                resjson['count'] = count;
                resjson['collection'] = collection;
                res.json(resjson);
            })
    }else{
        res.json({
            count:0,
            collection:[]
        });
    }
}

//搜索条件
exports.searchCondition = function(req, res){

    console.log(__("searchtconditionpath"));
    var conditionjson = JSON.parse(fs.readFileSync(__("searchtconditionpath")));
    res.json(conditionjson);
}

exports.teachers = function(req, res, next) {
    teacherMod.find({}, function(err, listitems){
        if (err){
            console.log(err);
            res.render('index', {
                title:'404'
            })
        }else{
            res.render('teacher', {
                teachers:listitems,
                title:'老师'
            });
        }

    });

}


