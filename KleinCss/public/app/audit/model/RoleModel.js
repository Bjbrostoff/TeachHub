/**
 * Created by apple on 16/1/17.
 */
define('app/audit/model/RoleModel',
    [
        'underscore',
        'backbone',
        'jquery'
    ],
    function(_, Backbone, $){
        var m = Backbone.Model.extend({
            defaults:{

            },
            url:'/users/role'
        });
        return m;
    })
