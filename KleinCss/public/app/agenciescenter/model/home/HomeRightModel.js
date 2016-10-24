define('app/agenciescenter/model/home/HomeRightModel',
    [
        'underscore',
        'backbone',
        'jquery'
    ],
    function(_, Backbone, $){
        var m = Backbone.Model.extend({
            defaults:{}
        });
        return m;
    })