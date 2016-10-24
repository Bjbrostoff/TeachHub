/**
 * Created by Administrator on 2016/3/12.
 */
define('app/agenciescenter/model/teachermanage/TeacherMoreInfoModel',
    [
        'underscore',
        'backbone',
        'jquery'
    ],
    function(_, Backbone, $){
        var m = Backbone.Model.extend({
            initialize:function(){
                this.eventNames={
                    pass:'teacher-moreinfo'
                }
            },
            getDetailInfo:function(data){
                var self=this;
                $.ajax({
                    type:"get",
                    url:'/teachers/teacherMoreInfo',
                    data:{
                        data:data
                    },
                    success:function(json){
                        self.trigger(self.eventNames.pass,json);
                    },
                    error:function(json){
                        self.trigger(self.eventNames.pass,json);
                    }
                });
            }
        });
        return m;
    });