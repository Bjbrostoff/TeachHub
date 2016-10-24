/**
 * Created by Administrator on 2016/1/15.
 */
define('app/usercenter/collection/home/TodayInfoCollection',
    [
        'underscore',
        'backbone',
        'jquery',

        'app/usercenter/model/home/TodayInfoModel'
    ],
    function(_, Backbone, $, Model){
        var c = Backbone.Collection.extend({
            model:Model,
            url:'/today/dayInfo'
        })
        return c;
    })