/**
 * Created by xiaoguo on 16/1/30.
 */
define('app/searcht/collection/ProfileCourseCollection',
    [
        'underscore',
        'backbone',
        'jquery',

        'app/searcht/model/ProfileCourseModel'
    ],
    function(_, Backbone, $,
             Model){
        var c = Backbone.Collection.extend({
            model:Model,
            url:'/courses/SearchTeacherCourses'
        });
        return c;
    })