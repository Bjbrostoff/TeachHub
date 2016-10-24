var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo/es5')(session);

var routes = require('./routes/index');
var users = require('./routes/users');
var teachers = require('./routes/teachers');
var demo = require('./routes/demo');
var courses = require('./routes/courses');
var mod = require('./routes/mod');
var  i18n = require("i18n");
var uuid = require('node-uuid');

var events=require('./routes/calendar');

var homework=require('./routes/homework');

var todayInfo=require('./routes/todayInfo');

//test
var amap = require('./routes/amap/map');
//agencies
var agencies=require('./routes/agencies');
var config=require('./app/config/config');

var app = express();
var memoryStore = session.MemoryStore;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  name:'sid',
  cookie:{maxAge:config.sessionTime},
  resave:false,
  saveUninitialized:true,
  secret: 'keyboard cat',
  store: new MongoStore({
    url: 'mongodb://localhost:27017/Klein',
    ttl:  config.sessionTime
  })
}));

app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

var mongoHelper = require('./app/util/mongoUtil');

mongoHelper.connect(function(error){
  if (error) throw error;
});

app.on('close', function(error) {
  mongoHelper.disconnect(function(err){

  })
});
i18n.configure({
  // setup some locales - other locales default to en silently
  locales: ['en', 'cn'],
  // you may alter a site wide default locale
  defaultLocale: 'cn',
  // sets a custom cookie name to parse locale settings from - defaults to NULL
  //cookie: 'i18nCooker',
  // query parameter to switch locale (ie. /home?lang=ch) - defaults to NULL
  queryParameter: 'lang',
  // enable object notation
  objectNotation: true,
  // watch for changes in json files to reload locale on updates - defaults to false
  autoReload: true,
  // object or [obj1, obj2] to bind the i18n api and current locale to - defaults to null
  register: global,
  // whether to write new locale information to disk - defaults to true
  updateFiles: true,

  // sync locale information accros all files - defaults to false
  syncFiles: true,
  directory: __dirname+'/locales'
});


app.use(i18n.init);

//filter
app.use( function(req, res, next){

  if ( req.originalUrl == "gulp" ||  req.originalUrl == "/"  || req.originalUrl == "/users/loginIn" || req.originalUrl.indexOf('register') > -1
    || req.originalUrl == "/users/sendEmail" || req.originalUrl == '/courses' || req.originalUrl == '/teachers'|| req.originalUrl == '/agencies'
    || req.originalUrl.indexOf('/courses' )!=-1 || req.originalUrl.indexOf('/teachers' )!=-1 || req.originalUrl.indexOf('/agencies' )!=-1
    || req.originalUrl == '/users/regToSession'|| req.originalUrl == '/mod/course/createCourse'|| req.originalUrl.indexOf('/mod' )!=-1
    || req.originalUrl == "/switchLang")

  {
	  if (req.session.user){
		  console.log('has session');
		  res.locals ={
			  sessinfo : req.session,
			  user :req.session.user
		  }

	  }
    var lang = i18n.getLocale() == 'en'?'en':'cn';
    req.session.locale = lang;
    if (req.session.locale) {
      i18n.setLocale(req, req.session.locale);
    }

    res.locals.__ = res.__ = function() {
      return i18n.__.apply(req, arguments);
    };
    next();
  }else{

    if (req.session.user){
      console.log('has session');
      res.locals ={
	      sessinfo : req.session,
	      user :req.session.user
      }
      var lang = i18n.getLocale() == 'en'?'en':'cn';
      req.session.locale = lang;
      if (req.session.locale) {
        i18n.setLocale(req, req.session.locale);
      }

      res.locals.__ = res.__ = function() {
        return i18n.__.apply(req, arguments);
      };
      next();
    }else{
	    console.log(req.originalUrl);
      console.log('no session');
      res.redirect('/');
    }
  }

});

app.use('/',routes);
app.use('/demo', demo);
app.use('/users', users);
app.use('/teachers', teachers);
app.use('/courses', courses);
app.use('/mod', mod);

app.use('/events', events);
app.use('/homework',homework);

app.use('/today',todayInfo);

//test
app.use('/amap', amap);

//agencies
app.use('/agencies',agencies);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  var locale = 'cn';
  req.setLocale(locale);
  res.locals.language = locale;
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
