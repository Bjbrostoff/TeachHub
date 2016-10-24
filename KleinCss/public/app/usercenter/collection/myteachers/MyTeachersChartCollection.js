/**
 * Created by cs on 2016/1/26.
 */
define('app/usercenter/collection/myteachers/MyTeachersChartCollection',
    [
        'underscore',
        'backbone',
        'jquery',
        'app/usercenter/model/myteachers/MyTeachersPieChartModel'

    ],
    function(_, Backbone, $, Model){
        var c = Backbone.Collection.extend({
            model:Model,
            url:'/mod/user/queryMyTeacherCharts'
        });
        return c;
    })

