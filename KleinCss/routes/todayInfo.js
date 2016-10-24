/**
 * Created by Administrator on 2016/1/15.
 */
var express = require('express');
var router = express.Router();

var courseCtrl = require('../app/controller/todayInfo');


router.get('/dayInfo', courseCtrl.dayInfo);

module.exports = router;