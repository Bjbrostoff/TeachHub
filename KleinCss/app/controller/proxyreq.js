/**
 * Created by cs on 2016/3/9.
 */
var async = require('async');
var uuid = require('node-uuid');

var courseSchemaDBModel = require('../model/course');
var proxyreqSchemaDBModel = require('../model/proxyreq');

var courseMod = new courseSchemaDBModel.Schema('course').model;
var proxyreqMod = new proxyreqSchemaDBModel.Schema('proxyreq').model;


//课程授权
exports.proxyCourse = function(req, res){
    //授权给机构前需要提供选择机构功能
    console.log('-proxyCourse----');
    var courseid = req.body.courseid;
    console.log('courseid:'+courseid);
    res.json({
        state:true,
        msg:'课程授权操作成功',
        data:''
    })
}