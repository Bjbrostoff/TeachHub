/**
 * Created by Administrator on 2016/3/10.
 */
define('app/agenciescenter/model/teachermanage/AddTeacherModel',
    [
        'underscore',
        'backbone',
        'jquery'
    ],
    function(_, Backbone, $){
        var m = Backbone.Model.extend({
            defaults:{},
            initialize:function(){
                this.urls={
                    passUrl:'/teachers/teacherPass',
                    noPassUrl:'/teachers/teacherNoPass',
                    removeUrl:'/teachers/teacherRemove'
                  },
                    this.eventNames={
                        pass:'teacher-pass',
                        noPass:'teacher-noPass',
                        removeTeacher:'teacher-remove'
                 }
            },
            executer:function(data){
                this._doAjax(data);
            },
            _doAjax:function(data){
                var self=this;
                $.ajax({
                    type: "get",
                    url: this.urls[data.url],
                    data: {
                        data: data.id
                    },
                    success:function(json){
                        self.trigger(self.eventNames[data.event],json);
                    },
                    error:function(json){
                        self.trigger(self.eventNames[data.event],json);
                    }
                });


            }
        });
        return m;
    });