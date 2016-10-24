/**
 * Created by xiaoguo on 16/1/8.
 */
define('app/searchc/model/CourseDetailModel',
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
                info:"这是一门英语课",
                catalog:"这是课程目录",
                billing:"标准收费",
                method:"上门授课",
                classroom:'',
                mode:"一对一",
                range:{
                    min:1,max:10
                },
                score:0,
                comment:0,
                cdate: new Date(),
                signnum:0,
                favnum:0,
                agencyid:"",
                agencyname:""

            },
            url:'/',
            initialize:function(){
                this.urls = {
                    'signUp':'/courses/my/signup',
                    'favMark':'/courses/my/favmark'
                };
                this.eventNames = {
                    'signUpComplete':'course-sign-up-complete',
                    'favMarkComplete':'course-fav-mark-complete'
                }
            },
            courseSignUp:function(){
                var data = {
                    courseid:this.attributes['courseId']
                }
                this._doAjax({
                    url:this.urls.signUp,
                    data:data,
                    type:'get',
                    eventName:this.eventNames.signUpComplete
                })
            },
            courseFavMark:function(){
                var data = {
                    courseid:this.attributes['courseId']
                }
                this._doAjax({
                    url:this.urls.favMark,
                    data:data,
                    type:'get',
                    eventName:this.eventNames.favMarkComplete
                })
            },
            _doAjax:function(params){
                var self = this;
                $.ajax({
                    url:params.url,
                    data:params.data,
                    type:params.type,
                    success:function(json){
                        console.log(json);
                        self.trigger(params.eventName, json);
                    },
                    error:function(){
                        self.trigger(params.eventName, {
                            state:false,
                            msg:'操作失败',
                            data:null
                        });
                    }
                })
            }
        });
        return m;
    })

