/**
 * Created by cs on 2016/1/27.
 */
define('app/usercenter/model/mystudents/MyStudentsListItemModel',
    [
        'underscore',
        'backbone',
        'jquery'
    ],
    function(_, Backbone, $){
        var m = Backbone.Model.extend({
            defaults:{
            }
        });
        return m;
    })
