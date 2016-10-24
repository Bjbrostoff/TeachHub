/**
 * Created by xiaoguo on 2015/12/8.
 */
var fs = require('fs');
var dirpath = require('path');

//var path = dirpath.join(__dirname.split('/util')[0], "/config/index.json");
var path = dirpath.join(__dirname.split(dirpath.sep+'util')[0], "/config/index.json");

var userDBSchema = require('../model/user');
var userMod = userDBSchema.Schema('user').model;
var tcredSBSchema = require('../model/tcred');
var tcredMod = tcredSBSchema.Schema('tcred').model;


var courses = [],
    users = [],
    teachers = [],
    agency = [],
    recomteachersArr = [],
    recomcoursesArr = [],
    recomagenciesArr = [];

exports.indexjson = function(){
    console.log(1111);
    if (courses.length < 1) {
        var json = JSON.parse(fs.readFileSync(path));
        courses = json.courses;
        users = json.users;
        teachers = json.teachers;
        agency = json.agency;
    }

    return {
        courses:courses,
        users:users,
        teachers:teachers,
        agency:agency
    }
}

exports.recomTeachers = function(arr){
    return recomteachersArr ;
}
exports.recomCourses = function(arr){
    return recomcoursesArr ;
}
exports.recomAgencies = function(arr){
    return recomagenciesArr ;
}

exports.setRecomTeachers = function(arr){
    recomteachersArr = arr;
}

exports.setRecomCourses = function(arr){
    recomcoursesArr = arr;
}

//exports.recomteachers = function(){
//    if (recomteachersArr.length < 1){
//        recomteachersArr = JSON.parse(fs.readFileSync('./app/config/recommendteachers.json'));
//    }
//
//    return recomteachersArr;
//}