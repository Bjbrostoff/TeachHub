/**
 * Created by cs on 2016/3/9.
 */
define('app/usercenter/model/coursemanage/AgencyModel',
    [
        'jquery',
        'underscore',
        'backbone'

    ],
    function($, _, Backbone){
        var m = Backbone.Model.extend({
            defaults:{
                in:false
            }
        });

        return m;
    })
