/**
 * Created by Administrator on 2016/1/11.
 */
define('app/usercenter/view/myhomework/ActingMyHomeworkView',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/usercenter/template/myhomework/ActingMyHomeworkView.ejs',
        'app/usercenter/view/myhomework/EditMyHomeworkView',
        'i18n!/nls/uchome.js'

    ],
    function(_, Backbone, $, tmpl ,EditMyHomeworkView,MyHomework){
        var v = Backbone.View.extend({
            events:{
                'click .mhw-edit-pencil-tab':'myhEdit_Handler'
            },
            initialize:function(options){
                //if (options.hasOwnProperty('eventBus')){
                //    this.eventBus = options.eventBus;
                //}
                this.template = _.template(tmpl);
                this.views = {};
                this.elems = {
                    'myhomework-container':'.myhomework-container'
                   // 'sthomeworkcheckboxfield':'sthomework-checkbox-field'
                }
	            this.collection.on('change', this._modelChange, this);
	            this.collection.on('add', this._modelChange, this);
	            this.collection.on('remove', this._modelChange, this);
            },
            render:function(){
                $(this.el).html(this.template({
                    //fields:this.model
	                datas:this.collection.toJSON(),
                    locale:MyHomework
                }));
                return this;
            },
            myhEdit_Handler:function(evt){
	            var modelid =  $(evt.currentTarget).attr("modelid");
	            var model = this.collection.get(modelid);
                if (this.views.editMyHomeworkView) {
	                this.views.editMyHomeworkView.remove();
	                this.views.editMyHomeworkView = undefined;
                }
                if (!this.views.editMyHomeworkView) {
                    this.views.editMyHomeworkView = new EditMyHomeworkView({
                        eventBus: this.eventBus,
	                    model:model
                        //model: this.models.baseinfoModel
                    });
                }

                $(this.elems['myhomework-container']).append(this.views.editMyHomeworkView.render().el);
                $('.summernote').summernote({
                    lang: 'zh-CN', // default: 'en-US'
                    height:225,
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
	            $('.summernote').parent().children(".note-editor").removeClass("panel");
                var edithomeworkview =  this.views.editMyHomeworkView;
                $(document).ready(function(){
                    $(".myhomework-editview-close").click(function(){

                        edithomeworkview.remove();
                    });
                    $(".my-homework-nav-tab").click(function(){

                        edithomeworkview.remove();
                    });
                });
            },
            save:function(){

            },
            cancel:function(){

            },
            closeView_handler:function(){
                this.remove();
            },
	        _modelChange:function(){
		        this.render();
	        }
        });
        return v;
    });
