/**
 * Created by Administrator on 2016/1/30.
 */
define('app/usercenter/model/stuhome/DetailInfoModel',
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
                    url:'/events/studentGetInformation',
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