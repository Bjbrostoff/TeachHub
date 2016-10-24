/**
 * Created by xiaoguo on 16/1/2.
 */
define('app/searchc/collection/SearchConditionCollection',
    [
        'underscore',
        'backbone',
        'jquery',

        'app/searchc/model/SearchConditionModel'
    ],
    function(_, Backbone, $,
             Model){
        var c = Backbone.Collection.extend({
            model:Model,
            url:'/courses/searchCondition'
        });
        return c;
    })
