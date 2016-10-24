/**
 * Created by apple on 16/1/17.
 */
define('app/audit/collection/LeftMenuCollection',
    [
        'underscore',
        'backbone',
        'jquery',
        'app/audit/model/LeftMenuModel'
    ],
    function(_, Backbone, $, Model){
        var c = Backbone.Collection.extend({
            model:Model,
            url:'/users/leftMenu'
        });
        return c;
    })
