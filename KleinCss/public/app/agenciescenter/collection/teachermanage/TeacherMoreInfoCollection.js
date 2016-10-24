/**
 * Created by Administrator on 2016/3/12.
 */
define('app/agenciescenter/collection/teachermanage/TeacherMoreInfoCollection',
    [
        'underscore',
        'backbone',
        'jquery',

        'app/agenciescenter/model/teachermanage/TeacherMoreInfoModel'
    ],
    function(_, Backbone, $, Model){
        var c = Backbone.Collection.extend({
            model:Model
            //url:'/teachers/teacherMoreInfo'
        });
        return c;
    });