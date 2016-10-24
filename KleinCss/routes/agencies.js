/**
 * Created by xiaoguo on 16/2/29.
 */
var express = require('express');
var router = express.Router();

var userCenterCtrl = require('../app/controller/usercenter');
var agencies = require('../app/controller/agencies');

router.get('/center', userCenterCtrl.center);

router.get('/leftMenu', userCenterCtrl.leftMenu);

router.get('/role', userCenterCtrl.role);

//机构用户基本信息查询
router.get('/basicinfo', agencies.agenciesbasicinfo);
//机构用户基本信息更新
router.post('/updateAgenciesInfo', agencies.updateAgenciesInfo);
//机构用户密码更新
router.post('/updateAgenciesPassword', agencies.updateAgenciesPassword);

//机构搜索默认推荐
router.get('/recommendation',agencies.recommendation);
//特定机构的详细信息
router.get('/searchOneDetail',agencies.searchOneDetail);
//教师申请成为机构旗下老师
router.get('/my/joinAgency',agencies.joinAgency);


//机构用户下学生管理------查询机构下的学生
router.get('/queryMyStudents', agencies.queryMyStudents);
router.get('/queryMyStudentsCharts', agencies.queryMyStudentsCharts);

//机构读取日历中的节点
router.get('/calendarNode',agencies.agenciesCalendar);

//机构教师
router.get('/teacher',agencies.agenciesTeacher);

//查询机构列表通过课程ID（）
router.get('/agenciesListByTeacherId',agencies.agenciesListByTeacherId);

module.exports = router;
