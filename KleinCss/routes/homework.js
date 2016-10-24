/**
 * Created by Administrator on 2016/1/4.
 */
var express = require('express');
var router = express.Router();


var homeworkCtrl = require('../app/controller/homework');


router.get('/sthwunchecked',homeworkCtrl.sthwunchecked);//请求未批改的数据
router.post('/markingHomework',homeworkCtrl.markingHomework);//批改作业的数据请求
router.get('/findcheckedhw',homeworkCtrl.findcheckedhw);//已批改作业的查询
router.get('/stharrangeselect',homeworkCtrl.stharrangeselect);
router.post('/homeworkrelease',homeworkCtrl.homeworkrelease);





module.exports = router;