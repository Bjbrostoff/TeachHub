/**
 * Created by Administrator on 2016/3/10.
 */
define('app/agenciescenter/view/teachermanage/AddTeacherView',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/agenciescenter/template/teachermanage/AddTeacher.ejs',
        'app/agenciescenter/model/teachermanage/AddTeacherModel',
        'i18n!/nls/achome.js'
    ],
    function (_, Backbone, $,
              tmpl,AddTeacherModel,locale) {
        var v = Backbone.View.extend({
            initialize: function (option) {
                this.eventBus = option.eventBus;
                this.template = _.template(tmpl);

                this.models={
                    'addTeacherModel':new AddTeacherModel()
                };
            },
            render: function (data) {
                $(this.el).html(this.template({
                    data:data,
                    locale:locale
                }));
                this.teacherPass();
                this.teacherNoPass();
                this.buttonClick();
                return this;
            },
            teacherPass:function(){
                $('#teacher-new-detail-container').empty();
                var self=this;
                $('.teacher-new-pass').click(function(a){
                    var id=$(this).attr('_idx');
                    var data={
                        id:id,
                        url:'passUrl',
                        event:'pass'
                    };
                    self.models.addTeacherModel.executer(data);
                    self.models.addTeacherModel.once('teacher-pass',function(e){
                         if(e){
                             alert('操作成功！！！');
                             a.currentTarget.parentNode.parentNode.remove();

                         }else{
                             alert('操作失败！！！');
                         }
                    });


                })
            },
            teacherNoPass:function(){
                $('#teacher-new-detail-container').empty();
                var self=this;
                $('.teacher-new-nopass').click(function(a){
                    var id=$(this).attr('_idx');
                    var data={
                        id:id,
                        url:'noPassUrl',
                        event:'noPass'
                    };
                    self.models.addTeacherModel.executer(data);
                    self.models.addTeacherModel.once('teacher-noPass',function(e){
                        if(e){
                            alert('操作成功！！！');
                            a.currentTarget.parentNode.parentNode.remove();

                        }else{
                            alert('操作失败！！！');
                        }
                    });

                });
            },
            buttonClick:function(){
                var self=this;
                var id;
                $('.teacher-new-moreinfo').click(function(){
                    id=$(this).attr('_idx');
                    self.eventBus.trigger('buttonClick',id);
                });

            }
        });
        return v;
    });