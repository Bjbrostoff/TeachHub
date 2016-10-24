/**
 * Created by cs on 2016/1/27.
 */
define('app/usercenter/collection/mystudents/MyStudentsListDataCollection',
    [
        'underscore',
        'backbone',
        'jquery',
        'app/usercenter/model/mystudents/MyStudentsListItemModel'

    ],
    function(_, Backbone, $, Model){
        var c = Backbone.Collection.extend({
            model:Model,
            url:'/mod/user/queryMyStudents'
        });
        return c;
    })
