/**
 * Created by cs on 2016/1/23.
 */
define('app/usercenter/model/myteachers/MyTeachersCourseModel',
    [
        'underscore',
        'backbone',
        'jquery'
    ],
    function(_, Backbone, $){
        var m = Backbone.Model.extend({
            defaults:{
            }
        });
        return m;
    })
