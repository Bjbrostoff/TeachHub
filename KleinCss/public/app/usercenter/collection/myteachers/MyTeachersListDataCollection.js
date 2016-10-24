/**
 * Created by cs on 2016/1/21.
 */
define('app/usercenter/collection/myteachers/MyTeachersListDataCollection',
    [
        'underscore',
        'backbone',
        'jquery',
        'app/usercenter/model/myteachers/MyTeacherListItemModel'

    ],
    function(_, Backbone, $, Model){
        var c = Backbone.Collection.extend({
            model:Model,
            url:'/mod/user/queryMyTeachers'
        });
        return c;
    })
