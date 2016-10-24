/**
 * Created by cs on 2016/2/24.
 */
require.config({
    paths:{
        jquery:'/jquery/dist/jquery.min',
        underscore:'/underscore/underscore-min',
        backbone:'/backbone/backbone-min',
        text:'/text/text',
        d3:'/d3/d3.min',
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
        'summernote':'/summernote/dist/summernote.min',
        'icheck':'/iCheck/icheck.min'

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
        'app/admin/App',
        'raphael',
        'morris'
    ],function(_, Backbone, $, App){
        App.initialize();
    })
