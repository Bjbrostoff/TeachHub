/**
 * Created by xiaoguo on 16/1/30.
 */
define('app/agencies/collection/ProfileCourseCollection',
    [
        'underscore',
        'backbone',
        'jquery',

        'app/agencies/model/ProfileCourseModel'
    ],
    function(_, Backbone, $,
             Model){
        var c = Backbone.Collection.extend({
            model:Model,
            url:'/courses/SearchAgencyCourses'
        });
        return c;
    })