/**
 * Created by Administrator on 2016/3/10.
 */
define('app/agenciescenter/collection/teachermanage/AddTeacherCollection',
    [
        'underscore',
        'backbone',
        'jquery',

        'app/agenciescenter/model/teachermanage/AddTeacherModel'
    ],
    function(_, Backbone, $, Model){
        var c = Backbone.Collection.extend({
            model:Model,
            url:'/teachers/AddProxyTeacher'
        });
        return c;
    });