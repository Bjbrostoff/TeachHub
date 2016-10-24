define('app/agenciescenter/collection/studentmanage/StudentManageChartCollection',
    [
        'underscore',
        'backbone',
        'jquery'

    ],
    function(_, Backbone, $, Model){
        var c = Backbone.Collection.extend({
            url:'/agencies/queryMyStudentsCharts'
        });
        return c;
    })

