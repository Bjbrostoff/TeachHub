/**
 * Created by Administrator on 2016/1/2.
 */
define('app/usercenter/collection/home/CalendarCollection',
    [
        'underscore',
        'backbone',
        'jquery',

        'app/usercenter/model/home/CalendarModel'
    ],
    function(_, Backbone, $, Model){
        var c = Backbone.Collection.extend({
            model:Model,
            url:'/events/getTeaCalnode'
        })
        return c;
    })