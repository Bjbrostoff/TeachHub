define('app/searchc/model/CourseModel',
[
    'underscore',
    'backbone',
    'jquery'
],
function(_, Backbone, $){
    var m = Backbone.Model.extend({
        defaults:{
            courseId:"",
            name:"英语",
            image:"/images/course1.jpg",
            introduction:"这是个简介",
            price:"50",
            teacherid:"",
            teachername:"",
            agencyid:"",
            agencyname:""
        },
        url:'/'
    });
    return m;
})
