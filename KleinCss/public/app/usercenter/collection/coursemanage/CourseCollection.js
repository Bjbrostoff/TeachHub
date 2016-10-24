define('app/usercenter/collection/coursemanage/CourseCollection',
[
    'underscore',
    'backbone',
    'jquery',

    'app/usercenter/model/coursemanage/CourseModel'
],
function(_, Backbone, $, Model){
    var c = Backbone.Collection.extend({
        model:Model,
        url:'/users/mycoursemanage',
        initialize:function(options){
            if (options && options.hasOwnProperty('url')){
                this.url = options.url;
            }
        }
    });
    return c;
})
