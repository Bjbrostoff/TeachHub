/**
 * Created by xiaoguo on 16/1/2.
 */
define('app/searcht/model/SearchConditionModel',
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