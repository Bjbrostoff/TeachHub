define('app/searcht/SearchTeachersApp',
[
    'underscore',
    'backbone',
    'jquery',
    'app/searcht/controller/Router'
],
function(_, Backbone, $,  Router){
    function initialize(){
        var app = new Router({
            login:user_login
        });
        Backbone.history.start();
    };

    return {
        initialize:initialize
    };
})
