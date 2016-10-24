/**
 * Created by Administrator on 2016/1/4.
 */
define('app/usercenter/model/home/HomeRightModel',
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