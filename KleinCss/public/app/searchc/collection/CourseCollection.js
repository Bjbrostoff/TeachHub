
define('app/searchc/collection/CourseCollection',
[
    'underscore',
    'backbone',
    'jquery',

    'app/searchc/model/CourseModel'
],
function(_, Backbone, $,
        Model){
    var c = Backbone.Collection.extend({
        model:Model,
        url:'/courses/recommendation'
    });
    return c;
})
