/**
 * Created by Administrator on 2016/1/2.
 */
define('app/usercenter/model/home/CalendarModel',
    [
        'underscore',
        'backbone',
        'jquery'
    ],
    function(_, Backbone, $){
        var m = Backbone.Model.extend({
            initialize:function(){
            },
            saveCalendarData:function(data){
                var self=this;
                if (!data) return;
                var dataEnd=JSON.stringify(data);
                $.ajax({
                    type:"post",
                    url:'/events/saveArranged',
                    data:{
                        data:dataEnd
                    },
                    success:function(){

                    },
                    error:function(){

                    }
                });
            },
            deleteOutCalendarDate:function(data){
                if (!data) return;
                var self=this;
                $.ajax({
                    type:"get",
                    url:'/events/deleteCalnodeData',
                    data: data,
                    success:function(){
                       //self.trigger('success',{msg:'删除成功'})
                    },
                    error:function(){
                       // self.trigger('error',{msg:'删除失败'})
                    }
                });
            }
        });

        return m;
    })