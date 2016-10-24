/**
 * Created by Administrator on 2016/1/23.
 */
define('app/usercenter/model/home/PerfectInfoModel',
    [
        'underscore',
        'backbone',
        'jquery'
    ],
    function(_, Backbone, $){
        var m = Backbone.Model.extend({
            initialize:function(){
                this.eventNames = {
                }
            },
            fetchStudents:function(code){
                if (!code) return;
                var self = this;
                $.ajax({
                    type:"get",
                    url:'/events/getStuNameId',
                    data:{
                        cid:code,
                    },
                    success:function(json){
                        self.set(json);
                        self.trigger('success',json);
                    },
                    error:function(json){
                        self.set(json);
                        self.trigger('error',json);
                    }
                });
                return self;
            }
        });
        return m;
    })