define('app/agenciescenter/collection/LeftMenuCollection',
[
    'underscore',
    'backbone',
    'jquery',
    'app/agenciescenter/model/LeftMenuModel'
],
function(_, Backbone, $, Model){
    var c = Backbone.Collection.extend({
        model:Model,
        url:''
    });
    return c;
})
