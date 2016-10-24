define('app/searcht/collection/TeacherCollection',
[
    'underscore',
    'backbone',
    'jquery',

    'app/searcht/model/TeacherModel'
],
function(_, Backbone, $,
        Model){
    var c = Backbone.Collection.extend({
        model:Model,
        url:'/teachers/recommendation'
    });
    return c;
})
