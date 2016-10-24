/**
 * Created by apple on 16/1/8.
 */
define('app/usercenter/view/StHomeworkView',
[
    'underscore',
    'backbone',
    'jquery',
    'text!/app/usercenter/template/StHomeworkView.ejs',
    'app/usercenter/view/sthomework/CreateUncheckedView',
    'app/usercenter/view/sthomework/CreateCheckedView',
    'app/usercenter/view/sthomework/CreateArrangeHomeworkView',
    'app/usercenter/model/sthomework/CreateUncheckedModel',
    'app/usercenter/model/sthomework/CreateCheckedModel',
    'app/usercenter/model/sthomework/CreateArrangeHomeworkModel',
    'i18n!/nls/uchome.js',
    'summernote',
    'dropzone'
],
function(_, Backbone, $, tmpl, CreateUncheckedView, CreateCheckedView,
         CreateArrangeHomeworkView, CreateUncheckedModel, CreateCheckedModel, CreateArrangeHomeworkModel,StudentHomework){
    var v = Backbone.View.extend({
        el:'.sthomework-container',
        events:{

        },
        initialize:function(){
            this.template = _.template(tmpl);
            this.elems = {
                'sthuncheckedview':'#sthomework-unchecked-acting-tab',
                'sthcheckedview':'#sthomework-checked-acting-tab',
                'stharrangehomeworkview':'#sthomework-arrange-acting-tab',
                'sthcheckbox':'#sthomework-checkbox-field',
                'sthomeworkcheckboxfield':'#sthomework-checkbox-field'
            };
            this.views = {

            };
            this.models = {

            };
            this.models.createuncheckedmodel = new CreateUncheckedModel();
            this.models.createcheckedmodel = new CreateCheckedModel();
            this.models.createarrangehwmodel = new CreateArrangeHomeworkModel();
        },
        render:function(){
            $(this.el).html(this.template({locale:StudentHomework}));
            this.changeBackGround();
            return this;

        },
        changeBackGround:function () {
            $(".st-homework-nav-tab").click(function (e) {
                $(this).parent().children().removeClass("on");
                $(this).addClass("on");
            });
        },
        hide:function(){
            $(this.el).css({
                'display':'none'
            });
        },
        show:function(){
            $(this.el).css({
                'display':'block'
            });
        },
        createSubViews:function(){
            this.showuncheckedview();
            this.showcheckedview();
            this.showArrangeHomeworkView();
        },
        showuncheckedview:function(){
            if (!this.views.unCheckedView) {
                this.views.unCheckedView = new CreateUncheckedView({
                    eventBus: this.eventBus,
                    el: this.elems.sthuncheckedview,
                    model:this.models.createuncheckedmodel
                   // model: this.models.baseinfoModel
                });
            }
            //$(this.elems.sthuncheckedview).append(this.views.unCheckedView.render().el);

            var self = this;
            this.models.createuncheckedmodel.fetch({
                success: function (collection, resp) {
                    $(self.elems.sthuncheckedview).append(self.views.unCheckedView.render(resp).el);

                }
            });

            ////$(this.elems.userinfo).append(this.views.myUserFormView.render().el);
            //var self = this;
            //this.models.baseinfoModel.fetch().complete(function () {
            //
            //
            //});
        },
        showcheckedview:function(){
            if (!this.views.CheckedView) {
                this.views.CheckedView = new CreateCheckedView({
                    eventBus: this.eventBus,
                    el: this.elems.sthcheckedview,
                    model:this.models.createcheckedmodel
                });
            }
            //$(this.elems.sthcheckedview).append(this.views.CheckedView.render().el);
            var self = this;
            this.models.createcheckedmodel.fetch({
                success: function (collection, resp) {
                    $(self.elems.sthcheckedview).append(self.views.CheckedView.render(resp).el);
                }
            });
        },
        showArrangeHomeworkView:function(){
            if (!this.views.ArrangeHomeworkView) {
                this.views.ArrangeHomeworkView = new CreateArrangeHomeworkView({
                    eventBus: this.eventBus,
                    el: this.elems.stharrangehomeworkview,
                    model: this.models.createarrangehwmodel
                });
            }
           // $(this.elems.stharrangehomeworkview).append(this.views.ArrangeHomeworkView.render().el);
            var self = this;
            this.models.createarrangehwmodel.fetch({
                success: function (collection, resp) {
                    $(self.elems.stharrangehomeworkview).append(self.views.ArrangeHomeworkView.render(resp).el);
                    $('#summernotereleasehomework').summernote({
                        lang: 'zh-CN', // default: 'en-US'
                        height:240,
                        onImageUpload: function(files, editor, welEditable) {
                            sendFile(files[0],editor,welEditable);
                        },
                        toolbar: [
                            //['style', ['style']], // no style button
                            ['style', ['bold', 'italic', 'underline', 'clear']],
                            ['fontsize', ['fontsize']],
                            ['color', ['color']],
                            ['para', ['ul', 'ol', 'paragraph']],
                            ['height', ['height']]
                            //['insert', ['picture', 'link']], // no insert buttons
                            //['table', ['table']], // no table button
                            //['help', ['help']] //no help button
                        ]

                    });
                }
            });


        }
    });
    return v;
});
