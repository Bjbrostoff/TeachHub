/**
 * Created by Administrator on 2016/3/3.
 */
define('app/agenciescenter/model/home/CalendarModel',
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