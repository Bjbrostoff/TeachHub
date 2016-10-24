var express = require('express');
var router = express.Router();

var modCourseCtlr = require('../app/controller/mod/course');
var modUserCtlr = require('../app/controller/mod/user');
var favoriteCtlr = require('../app/controller/favorites');
var myTeacherCtlr = require('../app/controller/mod/myteacher');
var myStudentCtlr = require('../app/controller/mod/mystudent');
var modHomeworkCtlr = require('../app/controller/mod/homework');

//用户
router.get('/user/modUserList', modUserCtlr.modUserList);
router.get('/user/modteacheruser', modUserCtlr.modTeacherUser);
router.get('/user/modAgencyUser', modUserCtlr.modAgencyUser);
router.get('/user/modAuditUser', modUserCtlr.modAuditUser);
router.get('/user/modAdminUser', modUserCtlr.modAdminUser);
router.get('/homework/modstudenthomework',modHomeworkCtlr.modStudentHomework);
router.get('/user/modProxy', modUserCtlr.modProxy);


router.get('/user/query/teacher', modUserCtlr.queryTeacher);

//收藏
router.get('/user/modFavorites', favoriteCtlr.modFavorites);
router.get('/user/queryFavorite', favoriteCtlr.queryFavorite);
router.get('/user/clearFavorite', favoriteCtlr.clearFavorite);
router.get('/user/queryFavoriteCharts', favoriteCtlr.queryFavoriteCharts); //图表
router.get('/user/queryFavoriteTypes', favoriteCtlr.queryFavoriteTypes);
router.get('/user/queryTcreds', favoriteCtlr.queryTcreds);
router.get('/user/removeFavorite', favoriteCtlr.removeFavorite);

//我的老师
router.get('/user/modMyTeachers', myTeacherCtlr.modMyTeachers);
router.get('/user/clearMyTeachersTestData', myTeacherCtlr.clearMyTeachersTestData);
router.get('/user/queryMyTeachers', myTeacherCtlr.queryMyTeachers);
router.get('/user/queryMyTeacherCoursesByUserId', myTeacherCtlr.queryMyTeacherCoursesByUserId);
router.get('/user/queryMyTeacherCharts', myTeacherCtlr.queryMyTeacherCharts);
//我的学生
router.get('/user/queryMyStudents', myStudentCtlr.queryMyStudents);
router.get('/user/queryMyStudentsCharts', myStudentCtlr.queryMyStudentsCharts);
//MapReduce
router.get('/user/mapReduce', modUserCtlr.mapReduce);
router.get('/course/createCourse', modCourseCtlr.createCourse);
router.get("/user/saveCalnode",modUserCtlr.saveCalnode);

//创建可安排课程
router.get('/user/modcalendar', modCourseCtlr.createCalendar);

router.get("/course/modMyCourses", modCourseCtlr.modMyCourses);
module.exports = router;
