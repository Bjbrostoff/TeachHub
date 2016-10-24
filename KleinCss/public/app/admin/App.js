/**
 * Created by cs on 2016/2/24.
 */
define('app/admin/App',
    [
        'underscore',
        'backbone',
        'jquery',
        'app/admin/controller/Router',
        'app/admin/model/RoleModel'
    ],
    function(_, Backbone, $,  Router, RoleModel){
        var roleModel = new RoleModel();

        function getCookie(objName){//获取指定名称的cookie的值

            var arrStr = document.cookie.split("; ");

            for(var i = 0;i < arrStr.length;i ++){

                var temp = arrStr[i].split("=");

                if(temp[0] == objName) return unescape(temp[1]);

            }
        }


        function initialize(){
            var state = getCookie('usertype');
            roleModel.fetch({
                data:{state:state},
                success:function(json){
                    var role = json.toJSON();
                    var app = new Router(role);
                    Backbone.history.start();
                }
            });

        };

        return {
            initialize:initialize
        };
    })