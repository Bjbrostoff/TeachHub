/**
 * Created by cs on 2016/2/24.
 */
define('app/admin/model/RoleModel',
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