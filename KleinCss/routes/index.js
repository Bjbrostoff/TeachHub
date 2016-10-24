/**
 * Created by xiaoguo on 2015/12/14.
 */

var express = require('express');
var i18n = require('i18n');
var router = express.Router();
var indexCtlr = require("../app/controller/index");
var config=require('../app/config/config');
/* GET home page. */
router.get('/', indexCtlr.index);


router.get('/courses', function(req, res){
    var login = false;
    if(req.session.user){
        login = true;
    }
    res.render('index/cources', {title:'课程中心', page:'cources', sessinfo:{user:req.session.user}, login:login, title:"Teach Hub", localeName: i18n.getLocale() == 'en'?'':'zh_CN'});
});

router.get('/teachers', function(req, res){
    var login = false;
    if(req.session.user){
        login = true;
    }
    res.render('index/teachers', {title:"金牌讲师", page:'teachers', sessinfo:{user:req.session.user}, login:login, title:"Teach Hub", localeName: i18n.getLocale() == 'en'?'':'zh_CN'});
});

router.get('/agencies', function(req, res){
    var login = false;
    if(req.session.user){
        login = true;
    }
    res.render('index/agencies', {title:"专业机构", page:'agencies', sessinfo:{user:req.session.user}, login:login, title:"Teach Hub", localeName: i18n.getLocale() == 'en'?'':'zh_CN'});
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
  res.render("register/register", {
    title:"注册",
    page:""
  });
});

router.get('/basicAuth',function(req,res){
	res.render("register/basicAuth", {
		title:"基础认证",
		page:"",
		login:"login",
		courses:"",
		teachers:"",
		agency:""
	});
});

router.get('/loginOut',function(req,res){
    i18n.setLocale(''); //destroy the i18n locale
    req.session.destroy(function(err) {
        // cannot access session here
        res.redirect('/');
    })
});

//中英文切换
router.get('/switchLang',function(req,res){
    var lang = i18n.getLocale() == 'en'?'cn':'en';
    i18n.setLocale(lang);
    req.session.locale = lang;
    if (req.headers.referer) res.redirect(req.headers.referer);
    else res.redirect("/");
});


module.exports = router;

