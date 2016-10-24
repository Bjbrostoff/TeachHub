/**
 * Created by Administrator on 2016/1/9.
 */
define('app/usercenter/view/sthomework/CreateUncheckedView',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/usercenter/template/sthomework/CreateUncheckedView.ejs',
        'app/usercenter/view/sthomework/CreateCheckBoxView',
        'app/usercenter/model/sthomework/CreateUncheckedModel',
        'app/usercenter/model/sthomework/CreateCheckBoxModel',
        'i18n!/nls/uchome.js',
        'summernote'
    ],
    function(_, Backbone, $, tmpl, CreateCheckBoxView,CreateUncheckedModel, CreateCheckBoxModel,StudentHomework){
        var v = Backbone.View.extend({
            events:{
                //'click .sth-check-box-close':'removecheckbox',
                //'click .st-homework-nav-tab':'removecheckbox'
            },
            initialize:function(options){
                //if (options.hasOwnProperty('eventBus')){
                //    this.eventBus = options.eventBus;
                //}
                this.template = _.template(tmpl);
                this.views = {};
                this.models = {};
                this.models.createuncheckedmodel = new CreateUncheckedModel();
                this.models.createcheckboxmodel = new CreateCheckBoxModel();
                this.elems = {
                    'sthomeworkcontainer':'.sthomework-container',
                    'sthomeworkcheckboxfield':'sthomework-checkbox-field'
                }
            },
            render:function(resp){
                $(this.el).html(this.template({
                    data:resp,
                    locale:StudentHomework
                }));
                this.hmwData=resp;
                this.sthCheckHandler();

                return this;
            },
            sthCheckHandler:function(){
                if (this.views.createCheckBoxView) this.views.createCheckBoxView.remove();
                if (!this.views.createCheckBoxView) {
                    this.views.createCheckBoxView = new CreateCheckBoxView({
                        eventBus: this.eventBus,
                        model:  this.models.createcheckboxmodel
                    });
                }
                var self = this;
                var hwCollection = this.hmwData;
                $(".sth-check-pencil-tab").click(
                    function(){
                        var id=$(this).attr('_id');
                        var date ;
                        for(var i=0;i<hwCollection.length;i++){
                            if (id == hwCollection[i]._id){
                                 date =  hwCollection[i];
                            }
                        }
                        $(self.elems.sthomeworkcontainer).append(self.views.createCheckBoxView.render(date).el);
                        $('.summernote').summernote({
                            lang: 'zh-CN', // default: 'en-US'
                            height:243,
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
                        var createcheckboxview = self.views.createCheckBoxView;
                        $(document).ready(function(){
                            $(".sth-check-box-close").click(function(){
                                createcheckboxview.remove();
                            });
                        });
                        $(document).ready(function(){
                            $(".st-homework-nav-tab").click(function(){
                                createcheckboxview.remove();
                            });
                        });
                    }
                );
            },
            save:function(){

            },
            cancel:function(){

            },
            closeView_handler:function(){
                this.remove();
            }

        });
        return v;
    });
