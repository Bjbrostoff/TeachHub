require.config({
    locale:localeName?"zh_CN":"",
    paths:{
        jquery:'/jquery/dist/jquery.min',
        underscore:'/underscore/underscore-min',
        backbone:'/backbone/backbone-min',
        text:'/text/text',
        d3:'/d3/d3.min',
        'leaflet':'/leaflet/dist/leaflet',
        app:'/app',
        sweetalert:'/Inspinia/js/plugins/sweetalert/sweetalert.min',
        'jquery.slimscroll':'/Inspinia/js/plugins/slimscroll/jquery.slimscroll.min',
        'i18n':'/requirejs-i18n/i18n'
        , 'bootstrap' : '/bootstrap/dist/js/bootstrap.min'
    },
    shim:{
        'jquery.slimscroll':['jquery']
        , 'bootstrap' : ['jquery']
    }
});

//console.log(localeName);

require(
[
    'underscore',
    'backbone',
    'jquery',
    'app/searcht/SearchTeachersApp'
],function(_, Backbone, $, App){
    App.initialize();
})
