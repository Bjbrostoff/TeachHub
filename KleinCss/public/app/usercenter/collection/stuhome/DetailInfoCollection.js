/**
 * Created by Administrator on 2016/1/6.
 */
define('app/usercenter/collection/stuhome/DetailInfoCollection',
    [
        'underscore',
        'backbone',
        'jquery',

        'app/usercenter/model/stuhome/DetailInfoModel'
    ],
    function(_, Backbone, $, Model){
        var c = Backbone.Collection.extend({
            model:Model,
            //url:'/events/events'
        })
        return c;
    })