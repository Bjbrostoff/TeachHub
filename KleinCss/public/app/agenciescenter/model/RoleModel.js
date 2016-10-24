define('app/agenciescenter/model/RoleModel',
[
    'underscore',
    'backbone',
    'jquery'
],
function(_, Backbone, $){
    var m = Backbone.Model.extend({
        defaults:{

        },
        url:'/agencies/role'
    });
    return m;
})
