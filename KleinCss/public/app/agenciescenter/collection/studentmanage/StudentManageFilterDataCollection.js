define('app/agenciescenter/collection/studentmanage/StudentManageFilterDataCollection',
    [
        'underscore',
        'backbone',
        'jquery',
        'app/agenciescenter/model/studentmanage/StudentManageFilterItemModel'

    ],
    function(_, Backbone, $, Model){
        var c = Backbone.Collection.extend({
            model:Model
        });
        return c;
    })
