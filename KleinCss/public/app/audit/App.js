/**
 * Created by apple on 16/1/17.
 */
define('app/audit/App',
    [
        'underscore',
        'backbone',
        'jquery',
        'app/audit/controller/Router',
        'app/audit/model/RoleModel'
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
            console.log(state);
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
