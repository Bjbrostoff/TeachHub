/**
 * Created by Administrator on 2016/1/5.
 */
define('app/usercenter/collection/home/RightArrangeCalendarCollection',
    [
        'underscore',
        'backbone',
        'jquery',

        'app/usercenter/model/home/RightArrangeCalendarModel'
    ],
    function(_, Backbone, $, Model){
        var c = Backbone.Collection.extend({
            model:Model,
            url:'/events/courseArrange'
        })
        return c;
    })