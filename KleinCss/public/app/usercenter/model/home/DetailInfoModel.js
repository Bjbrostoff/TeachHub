/**
 * Created by Administrator on 2016/1/6.
 */
define('app/usercenter/model/home/DetailInfoModel',
    [
        'underscore',
        'backbone',
        'jquery'
    ],
    function(_, Backbone, $){
        var m = Backbone.Model.extend({
            initialize:function(){},
            getDetailInfo:function(data){
                var self=this;
                $.ajax({
                    type:"get",
                    url:'/events/getCourseDetailInfo',
                    data:{
                        data:data
                    },
                    success:function(json){
                        self.trigger('success',json);
                    },
                    error:function(json){
                         return json;
                    }
                });
            },
            studentSetClock:function(data){
                var self=this;
                $.ajax({
                    type:"get",
                    url:'/events/teaSetStudentClock',
                    data:data,
                    success:function(json){
                        self.trigger('success',json);
                        console.log(json)
                    },
                    error:function(json){
                        return json;
                    }
                });
            },
        });
        return m;
    })