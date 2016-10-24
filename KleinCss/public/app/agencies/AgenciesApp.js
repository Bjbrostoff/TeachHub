define('app/agencies/AgenciesApp',
    [
        'underscore',
        'backbone',
        'jquery',
        'app/agencies/controller/Router'
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
