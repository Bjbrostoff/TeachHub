/**
 * Created by cs on 2016/1/23.
 * 我的老师的课程
 */
define('app/usercenter/collection/myteachers/MyTeachersCourseDataCollection',
    [
        'underscore',
        'backbone',
        'jquery',
        'app/usercenter/model/myteachers/MyTeachersCourseModel'

    ],
    function(_, Backbone, $, Model){
        var c = Backbone.Collection.extend({
            model:Model,
            url:'/mod/user/queryMyTeacherCoursesByUserId'
        });
        return c;
    })
