require.config({
    locale:localeName?"zh_CN":"",
    //locale:"zh_CN",
    paths:{
        jquery:'/jquery/dist/jquery.min',
        underscore:'/underscore/underscore-min',
        backbone:'/backbone/backbone-min',
        text:'/text/text',
        d3:'/d3/d3.min',
        leaflet:'/leaflet/dist/leaflet',
        bootstrap:'/bootstrap/dist/js/bootstrap.min',
        moment:'/moment/moment',
        fullcalendar:'/fullcalendar/dist/fullcalendar',
        raphael:'/raphael/raphael-min',
        morris:'/morrisjs/morris.min',
        sweetalert:'/Inspinia/js/plugins/sweetalert/sweetalert.min',
        'bootbox':'/bootbox/bootbox',
        app:'/app',
        'jquery.validate':'/jquery-validation/dist/jquery.validate',
        'jqueryui':'/jquery-ui/jquery-ui.min',
        'bootstrap-datepicker':'/bootstrap-datepicker/js/bootstrap-datepicker',
        'jquery.steps':'/jquery.steps/build/jquery.steps.min',
        'jquery.slimscroll':'/jquery.slimscroll/jquery.slimscroll',

        'summernote':'/summernote/dist/summernote',
        'icheck':'/iCheck/icheck.min',
        'timepicker':'/bootstrap-timepicker/js/bootstrap-timepicker',
        'dropzone':'/dropzone/dist/dropzone',
        'i18n':'/requirejs-i18n/i18n'

    },
    shim:{
        'jquery.validate':['jquery'],
        'jquery.steps':['jquery']

    }
});

require(
    [
        'underscore',
        'backbone',
        'jquery',
        'app/agenciescenter/AgenciesApp',
        'raphael',
        'morris',
        'jquery.slimscroll'
    ],function(_, Backbone, $, App){
        App.initialize();
    })
