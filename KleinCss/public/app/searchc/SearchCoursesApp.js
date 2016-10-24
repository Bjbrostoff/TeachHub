define('app/searchc/SearchCoursesApp',
[
    'underscore',
    'jquery',
    'backbone',

    'app/searchc/controller/Router'
],
function(_, $, Backbone,  Router){
    function initialize(){

        var app = new Router();
        Backbone.history.start();
    };

    return {
        initialize:initialize
    };
})
