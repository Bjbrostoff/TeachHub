/**
 * Created by xiaoguo on 16/1/2.
 */
define('app/searcht/collection/SearchConditionCollection',
    [
        'underscore',
        'backbone',
        'jquery',

        'app/searcht/model/SearchConditionModel'
    ],
    function(_, Backbone, $,
             Model){
        var c = Backbone.Collection.extend({
            model:Model,
            url:'/teachers/searchCondition'
        });
        return c;
    })
