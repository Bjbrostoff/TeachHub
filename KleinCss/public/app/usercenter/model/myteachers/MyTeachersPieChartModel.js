/**
 * Created by cs on 2016/1/26.
 */
define('app/usercenter/model/myteachers/MyTeachersPieChartModel',
    [
        'underscore',
        'backbone',
        'jquery'
    ],
    function(_, Backbone, $){
        var m = Backbone.Model.extend({
            defaults:{
                "label":"正在授课",
                "data":3,
                "color":"#87d6c6"
            }
        });
        return m;
    })