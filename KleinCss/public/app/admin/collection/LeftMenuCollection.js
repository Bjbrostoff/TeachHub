/**
 * Created by cs on 2016/2/24.
 */
define('app/admin/collection/LeftMenuCollection',
    [
        'underscore',
        'backbone',
        'jquery',
        'app/admin/model/LeftMenuModel'
    ],
    function(_, Backbone, $, Model){
        var c = Backbone.Collection.extend({
            model:Model,
            url:'/users/leftMenu'
        });
        return c;
    })