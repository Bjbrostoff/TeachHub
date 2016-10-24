/**
 * Created by Administrator on 2016/1/3.
 */
var express = require('express');
var router = express.Router();

var courseCtrl = require('../app/controller/calendarEvent');

var courseArrange = require('../app/controller/arrange');

var homeRight = require('../app/controller/assignment');
//头像和最近一次上课安排
router.get('/getImageArrange',homeRight.homeRightImage);



//student  calnode
router.get('/getStuCalnode',courseCtrl.stuCalnode);
//teacher calnode
router.get('/getTeaCalnode',courseCtrl.teaCalnode);
//取出周的数据
router.get('/getCurrentDate',courseCtrl.getWeekDate);
//删除已经安排的数据
router.get('/deleteCalnodeData',courseCtrl.deleteCalnode);

//可安排课程
//走数据库
router.get('/courseArrange', courseArrange.arrangeCourse);

router.get('/getStuNameId',courseArrange.getStuNameId);

router.post('/saveArranged',courseArrange.saveArrangedCourse);

//detail info  and address
router.get('/getCourseDetailInfo',courseArrange.getCourseInfoAndAddress);
//学生的详细信息
router.get('/studentGetInformation',courseArrange.getCourseInformation)
//老师给学生打卡
router.get('/teaSetStudentClock',courseArrange.setStudentClock);
//学生给老师打卡

module.exports = router;