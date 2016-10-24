define('app/usercenter/collection/LeftMenuCollection',
[
    'underscore',
    'backbone',
    'jquery',
    'app/usercenter/model/LeftMenuModel'
],
function(_, Backbone, $, Model){
    var c = Backbone.Collection.extend({
        model:Model,
        url:'/users/leftMenu'
    });
    return c;
})
