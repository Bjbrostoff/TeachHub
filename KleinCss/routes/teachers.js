/**
 * Created by xiaoguo on 2015/12/6.
 */

var express = require('express');
var router = express.Router();

var teacherCtlr = require('../app/controller/teacher');

//机构中管理老师的
var manageTeacher=require('../app/controller/teacherManage');


/* GET users listing. */
//老师搜索首页
router.get('/', teacherCtlr.index);
router.get('/recommendation', teacherCtlr.recommendation);
router.get('/searchCondition', teacherCtlr.searchCondition);
router.get('/searchOneDetail', teacherCtlr.searchOneDetail);
router.get('/searchCourses', teacherCtlr.searchCourses);
router.get('/searchProxyTeachers', teacherCtlr.searchProxyTeachers);

router.get('/all', teacherCtlr.teachers);


router.get('/getAllProxyTeacher',manageTeacher.proxyTeacher);
router.get('/AddProxyTeacher',manageTeacher.addProxyTeacher);
//申请老师通过
router.get('/teacherPass',manageTeacher.passTeacherReq);
router.get('/teacherNoPass',manageTeacher.noPassTeacherReq);
//机构解除老师
router.get('/teacherRemove',manageTeacher.agencyRemoveTeacher);
router.get('/teacherMoreInfo',manageTeacher.agencyGetTeacherMoreInfo);

module.exports = router;
