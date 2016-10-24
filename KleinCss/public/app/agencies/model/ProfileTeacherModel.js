/**
 * Created by xiaoguo on 16/3/8.
 */
define('app/agencies/model/ProfileTeacherModel',
    [
        'underscore',
        'backbone',
        'jquery'
    ],
    function(_, Backbone, $){
        var m = Backbone.Model.extend({
            defaults:{

                uuid: "id000001",
                name: "张三",
                nationality: "nationality",
                city: "杭州",
                portrait: "/Inspinia/img/a1.jpg",
                starlevel:"一星级",
                degree:"学位",
                workexp:"",
                mothertongue:"",
                almaMater:"",
                collegeDegree:"",
                skilledcourse:"",
                introduction:""

            },
            url:'/'
        });
        return m;
    })

