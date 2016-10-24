/**
 * Created by Administrator on 2016/3/7.
 */
define('app/agenciescenter/collection/teachermanage/ExistTeacherCollection',
    [
        'underscore',
        'backbone',
        'jquery',

        'app/agenciescenter/model/teachermanage/ExistTeacherModel'
    ],
    function(_, Backbone, $, Model){
        var c = Backbone.Collection.extend({
            model:Model,
            url:'/teachers/getAllProxyTeacher'
        })
        return c;
    });