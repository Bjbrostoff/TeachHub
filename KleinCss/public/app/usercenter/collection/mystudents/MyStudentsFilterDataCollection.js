/**
 * Created by cs on 2016/1/27.
 */
define('app/usercenter/collection/mystudents/MyStudentsFilterDataCollection',
    [
        'underscore',
        'backbone',
        'jquery',
        'app/usercenter/model/mystudents/MyStudentsFilterItemModel'

    ],
    function(_, Backbone, $, Model){
        var c = Backbone.Collection.extend({
            model:Model
        });
        return c;
    })
