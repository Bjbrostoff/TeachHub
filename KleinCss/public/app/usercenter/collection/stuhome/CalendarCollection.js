/**
 * Created by Administrator on 2016/1/2.
 */
define('app/usercenter/collection/stuhome/CalendarCollection',
    [
        'underscore',
        'backbone',
        'jquery',

        'app/usercenter/model/stuhome/CalendarModel'
    ],
    function(_, Backbone, $, Model){
        var c = Backbone.Collection.extend({
            model:Model,
            url:'/events/getStuCalnode'
        })
        return c;
    })