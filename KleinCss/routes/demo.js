/**
 * Created by xiaoguo on 2015/12/14.
 */

var express = require('express');
var router = express.Router();

var demoCtlr = require("../app/controller/demo");

/* GET home page. */
router.get('/demo', demoCtlr.demo);

router.get('/cources', function(req, res){
	res.render('demo/cources', {title:'课程中心', page:'cources', sessinfo:{user:req.session.user}});
});

router.get('/teachers', function(req, res){
	res.render('demo/teachers', {title:"金牌讲师", page:'teachers', sessinfo:{user:req.session.user}});
});

router.get('/agencies', function(req, res){
	res.render('demo/agencies', {title:"专业机构", page:'agencies', sessinfo:{user:req.session.user}});
});

router.get('/test', function(req, res){
	/*
	 res.header("Content-Type", "text/html");
	 res.write("<html><head></head><body><div>test</div></body></html>");
	 res.end();
	 */
	res.render("index");
});
router.get('/register',function(req,res){
	res.render("register/register");
});

router.get('/demoindex', function(req, res){
	res.render('demo/index');
})

module.exports = router;

