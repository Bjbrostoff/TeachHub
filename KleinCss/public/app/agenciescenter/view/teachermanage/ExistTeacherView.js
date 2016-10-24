define('app/agenciescenter/view/teachermanage/ExistTeacherView',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/agenciescenter/template/teachermanage/ExistTeacher.ejs',
        'app/agenciescenter/model/teachermanage/AddTeacherModel',

        'i18n!/nls/achome.js'
    ],
    function (_, Backbone, $,
              tmpl,AddTeacherModel,localName) {
        var v = Backbone.View.extend({
            initialize: function (option) {
                this.eventBus = option.eventBus;
                this.template = _.template(tmpl);

                this.models={
                    'removeTeacherModel':new AddTeacherModel()
                };
            },
            render: function (data) {
                $(this.el).html(this.template({
                    data:data,
                    locale:localName
                }));
                this.cancelLation();
                this.buttonClick();
                return this;
            },
            cancelLation:function(){
                $('#teacher-new-detail-container').empty();
                var self=this;
                $(".teacher-remove").click(function(a){
                    if(confirm(localName.TeacherManage.asked))
                    {
                        var id=$(this).attr('_idx');
                        var data={
                            id:id,
                            url:'removeUrl',
                            event:'removeTeacher'
                        };
                        self.models.removeTeacherModel.executer(data);
                        self.models.removeTeacherModel.once('teacher-remove',function(e){
                            if(e.state){
                                alert(e.msg+'！！！');
                                a.currentTarget.parentNode.parentNode.remove();

                            }else{
                                alert(e.msg+'！！！');
                            }
                        });
                    }
                    else{

                    }


                })
            },
            buttonClick:function(){
                var self=this;
                var id;
                $('.teacher-remove-moreinfo').click(function(){
                   id=$(this).attr('_idx');
                    self.eventBus.trigger('buttonClick',id);
                });

            }
        });
        return v;
    });