define('app/agenciescenter/collection/studentmanage/StudentManageListDataCollection',
    [
        'underscore',
        'backbone',
        'jquery',
        'app/agenciescenter/model/studentmanage/StudentManageListItemModel'

    ],
    function(_, Backbone, $, Model){
        var c = Backbone.Collection.extend({
            model:Model,
            url:'/agencies/queryMyStudents'
        });
        return c;
    })
