define('app/agencies/model/AgenciesModel',
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
            city: "杭州",
            phone:"123456789",
            image: '/Inspinia/img/gallery/11s.jpg',
            starlevel:"一星级",
            location:{
                lng:120.25,
                lat:30.15
            },
            coursecount:0,
            teachercount:0
        },
        url:'/'
    });
    return m;
})
