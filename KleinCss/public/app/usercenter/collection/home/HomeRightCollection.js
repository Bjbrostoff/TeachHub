/**
 * Created by Administrator on 2016/1/4.
 */
define('app/usercenter/collection/home/HomeRightCollection',
    [
        'underscore',
        'backbone',
        'jquery',

        'app/usercenter/model/home/HomeRightModel'
    ],
    function(_, Backbone, $, Model){
        var c = Backbone.Collection.extend({
            model:Model,
            url:'/events/getImageArrange'
        })
        return c;
    })