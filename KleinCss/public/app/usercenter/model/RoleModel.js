define('app/usercenter/model/RoleModel',
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
