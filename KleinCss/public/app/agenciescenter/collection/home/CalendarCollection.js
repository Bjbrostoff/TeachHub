/**
 * Created by Administrator on 2016/3/3.
 */
define('app/agenciescenter/collection/home/CalendarCollection',
    [
        'underscore',
        'backbone',
        'jquery',

        'app/agenciescenter/model/home/CalendarModel'
    ],
    function(_, Backbone, $, Model){
        var c = Backbone.Collection.extend({
            model:Model,
            url:'/agencies/calendarNode'
        });
        return c;
    });