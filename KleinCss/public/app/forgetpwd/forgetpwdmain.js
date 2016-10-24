require.config({
    paths:{
        jquery:'/jquery/dist/jquery.min',
        underscore:'/underscore/underscore-min',
        backbone:'/backbone/backbone-min',
        text:'/text/text',
        d3:'/d3/d3.min',
	    'bootbox':'/bootbox/bootbox',
	    bootstrap:'/bootstrap/dist/js/bootstrap.min',
	    'jquery.validate':'/jquery-validation/dist/jquery.validate.min',
         app:'/app'

    },
    shim:{
        'jquery.validate':['jquery']
    }
});

require(
[
    'underscore',
    'backbone',
    'jquery',
    'app/forgetpwd/ForgetPwdApp'
],function(_, Backbone, $, App){
    App.initialize();
})
