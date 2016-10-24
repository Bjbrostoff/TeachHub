/**
 * Created by Administrator on 2016/1/28.
 */
define('app/usercenter/collection/sthomework/CreateUncheckedCollection',
    [
        'underscore',
        'backbone',
        'jquery',
        'app/usercenter/model/sthomework/CreateUncheckedModel'
    ],
    function(_, Backbone, $, Model){
        var c = Backbone.Collection.extend({
            model:Model,
            url:'/homework/sthwunchecked'
        });
        return c;
    })