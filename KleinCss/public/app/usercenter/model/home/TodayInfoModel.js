/**
 * Created by Administrator on 2016/1/15.
 */
define('app/usercenter/model/home/TodayInfoModel',
    [
        'underscore',
        'backbone',
        'jquery'
    ],
    function(_, Backbone, $){
        var m = Backbone.Model.extend({
            initialize:function(){},
            getWeekArrange:function(arr){
                var self=this;
                if (!arr) return;
                $.ajax({
                    type:"get",
                    url:'/events/getCurrentDate',
                    data:
                    {
                        data:arr
                    },
                    success:function(json){
                        self.trigger('success',json);
                    },
                    error:function(json){
                        self.trigger('error',json);
                    }
                });
            }
        });
        return m;
    })