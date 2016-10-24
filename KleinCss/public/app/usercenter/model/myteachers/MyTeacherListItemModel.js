/**
 * Created by cs on 2016/1/21.
 */
define('app/usercenter/model/myteachers/MyTeacherListItemModel',
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
