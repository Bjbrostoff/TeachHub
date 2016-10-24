/**
 * Created by xiaoguo on 16/3/8.
 */
define('app/agencies/collection/ProfileTeacherCollection',
    [
        'underscore',
        'backbone',
        'jquery',

        'app/agencies/model/ProfileTeacherModel'
    ],
    function(_, Backbone, $,
             Model){
        var c = Backbone.Collection.extend({
            model:Model,
            url:'/teachers/searchProxyTeachers'
        });
        return c;
    })