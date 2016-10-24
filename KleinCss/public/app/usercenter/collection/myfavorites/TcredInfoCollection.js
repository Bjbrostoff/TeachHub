/**
 * Created by cs on 2016/1/30.
 */
define('app/usercenter/collection/myfavorites/TcredInfoCollection',
    [
        'underscore',
        'backbone',
        'jquery',

        'app/usercenter/model/myfavorites/TeacherModel'
    ],
    function(_, Backbone, $, Model){
        var c = Backbone.Collection.extend({
            model:Model,
            url:'/mod/user/queryTcreds'
        })
        return c;
    })
