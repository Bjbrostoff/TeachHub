/**
 * Created by Administrator on 2016/1/23.
 */
define('app/usercenter/collection/home/PerfectInfoCollection',
    [
        'underscore',
        'backbone',
        'jquery',

        'app/usercenter/model/home/PerfectInfoModel'
    ],
    function(_, Backbone, $, Model){
        var c = Backbone.Collection.extend({
            model:Model,
            //url:'/today/dayInfo'
        })
        return c;
    })