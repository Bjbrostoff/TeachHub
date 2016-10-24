define('app/agenciescenter/view/TeacherManageView',
    [
        'underscore',
        'backbone',
        'jquery',
        'jqueryui',

        'text!/app/agenciescenter/template/TeacherManage.ejs',

        'app/agenciescenter/view/teachermanage/ExistTeacherView',
        'app/agenciescenter/collection/teachermanage/ExistTeacherCollection',

        'app/agenciescenter/view/teachermanage/AddTeacherView',
        'app/agenciescenter/collection/teachermanage/AddTeacherCollection',

        'app/agenciescenter/view/teachermanage/TeacherMoreInfoView',
        'app/agenciescenter/model/teachermanage/TeacherMoreInfoModel',

        'i18n!/nls/achome.js'


    ],
    function (_, Backbone, $, jqueryui,
              tmpl,


              ExistTeacherView,
              ExistTeacherCollection,

              AddTeacherView,
              AddTeacherCollection,

              TeacherMoreInfoView,
              TeacherMoreInfoModel,

              LocalName

    ) {
        var v = Backbone.View.extend({
            el: '.teacher-manage-container',
            events: {
                    'click .close-link': 'removeTeacherDetailInfo'
            },
            initialize: function (option) {
                this.eventBus = option.eventBus;
                this.els = {
                   'teacherManageExist':'#teacher-manage-exist',
                   'teacherManageAdd':'#teacher-manage-add',
                    'teacherManageNewInfo':'#teacher-new-detail-container'
                };
                this.models = {};
                this.views = {

                };
                this.models = {
                    'teacherManageExist':new ExistTeacherCollection(),
                    'teacherManageAdd':new AddTeacherCollection()
                };

                this.eventNames = {

                };
                this.eventBus.on('buttonClick',this.showMoreInfo,this);
                this.template = _.template(tmpl);
            },
            render: function () {
                $(this.el).html(this.template({
                    locale:LocalName
                }));
                this._refreshBindElem();
                this.showTeacherExist();
                this.showTeacherAdd();
                return this;

            },

            showTeacherExist:function(){
                if (!this.views.existTeacherView) {
                    this.views.existTeacherView = new ExistTeacherView({
                        eventBus: this.eventBus,
                        el: this.els.teacherManageExist
                    });
                }
                var self = this;
                this.models.teacherManageExist.fetch({
                    success:function(collection,resp){
                       self.views.existTeacherView.render(resp);
                    }
                });
            },
            showTeacherAdd:function(){
                if (!this.views.addTeacherView) {
                    this.views.addTeacherView = new AddTeacherView({
                        eventBus: this.eventBus,
                        el: this.els.teacherManageAdd
                    });
                }
                var self = this;
                this.models.teacherManageAdd.fetch({
                    success:function(collection,resp){
                        self.views.addTeacherView.render(resp);
                    }
                });
            },
            showMoreInfo:function(e){
                this.removeTeacherDetailInfo();
                if (!this.views.teacherMoreInfoView) {
                    this.views.teacherMoreInfoView = new TeacherMoreInfoView({
                            eventBus: this.eventBus,
                            el: this.els.teacherManageNewInfo
                        }
                    );
                }
                var self = this;
                var teacherMoreInfoModel=new TeacherMoreInfoModel();
                teacherMoreInfoModel.getDetailInfo(e);
                teacherMoreInfoModel.once('teacher-moreinfo',function(json){
                    $(self.els.teacherManageNewInfo).append(self.views.teacherMoreInfoView.render(json).el);
                });
            },
            removeTeacherDetailInfo:function(){
                $(this.els.teacherManageNewInfo).empty();
            },
            show: function () {
                this._show();
            },
            hide: function () {
                this._hide();
            },
            _refreshBindElem: function () {
                this.elems = {
                    'dom': $('.page-content-teacher')
                }
            },
            _hide: function () {
                $(this.el).css({
                    'display': 'none'
                })
            },
            _show: function () {
                $(this.el).css({
                    'display': 'block'
                });
            }

        });
        return v;
    });

