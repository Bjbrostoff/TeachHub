define('app/agenciescenter/collection/coursemanage/TeacherCollection',
    [
        'underscore',
        'backbone',
        'jquery',

        'app/agenciescenter/model/coursemanage/TeacherModel'
    ],
    function(_, Backbone, $, Model){
        var c = Backbone.Collection.extend({
            model:Model,
            url:'/agencies/teacher',
            initialize:function(options){
                if (options && options.hasOwnProperty('url')){
                    this.url = options.url;
                }
            }
        });
        return c;
    })
