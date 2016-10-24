/**
 * Created by Administrator on 2016/2/18.
 */
/**
 * Created by Administrator on 2016/1/23.
 */
define('app/usercenter/collection/BaseInfoCollection',
    [
        'underscore',
        'backbone',
        'jquery',
        'app/usercenter/model/BaseInfoModel'
    ],
    function(_, Backbone, $, Model){
        var c = Backbone.Collection.extend({
            model:Model,
            url:'/users/basicinfo'
        });
        return c;
    })
