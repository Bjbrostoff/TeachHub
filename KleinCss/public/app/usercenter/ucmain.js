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
        'jquery.slimscroll':'/jquery.slimscroll.min',
        'summernote':'/summernote/dist/summernote',
        'icheck':'/iCheck/icheck.min',
        'timepicker':'/bootstrap-timepicker/js/bootstrap-timepicker',
        'dropzone':'/dropzone/dist/dropzone',
        'i18n':'/requirejs-i18n/i18n',
        'phantom':'/phantom/',
        'pdfmake':'/pdfmake/build/pdfmake.min',
        'vfs_fonts':'/pdfmake/build/vfs_fonts'

    },
    shim:{
        'jquery.validate':['jquery'],
        'jquery.steps':['jquery'],
        //'pdfmake':['jquery'],
        //'vfs_fonts':['jquery'],
        pdfmake :
        {
            exports: 'vfs_fonts'
        },
        vfs_fonts :
        {
            deps: ['pdfmake'],
            exports: 'vfs_fonts'
        },
    }
});

//console.log('+++++++'+localeName);

require(
    [
        'underscore',
        'backbone',
        'jquery',
        'app/usercenter/UserCenterApp',
        'raphael',
        'morris'
    ],function(_, Backbone, $, App){
        App.initialize();
    })