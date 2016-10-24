/**
 * Created by cs on 2016/1/26.
 */
define('app/usercenter/collection/mystudents/MyStudentsChartCollection',
    [
        'underscore',
        'backbone',
        'jquery'

    ],
    function(_, Backbone, $, Model){
        var c = Backbone.Collection.extend({
            url:'/mod/user/queryMyStudentsCharts'
        });
        return c;
    })

