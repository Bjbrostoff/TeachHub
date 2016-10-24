/**
 * Created by Administrator on 2016/1/12.
 */
define('app/usercenter/view/myhomework/EditMyHomeworkView',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/usercenter/template/myhomework/EditMyHomeworkView.ejs',
	    'bootbox',
        'i18n!/nls/uchome.js'
    ],
    function(_, Backbone, $, tmpl,bootbox,MyHomework){
        var v = Backbone.View.extend({
            //el:'.sthomework-checkbox-field',
            events:{
                'click #myhomework-editview-submit':'sthCheckedSubmit_handler',
	            'click #myhomework-editview-save':'sthCheckedSave_handler'
            },
            initialize:function(options){
                if (options.hasOwnProperty('eventBus')){
                    this.eventBus = options.eventBus;
                }
                this.template = _.template(tmpl);
                this.views = {};
                this.elems = {
	                "myhomework_summernote":".summernote"

                };
            },
            render:function(){
                $(this.el).html(this.template({
                    fields:this.model.toJSON(),
                    locale:MyHomework
                }));
                return this;
            },
            closeEidtView_handler:function(){
                this.remove();
            },
            sthCheckedSubmit_handler:function(){

	            var content = $(this.elems.myhomework_summernote).parent().find(".note-editable").html();
	            if(content == undefined || content.trim() ==''){
		            bootbox.alert(MyHomework.MyHomework.completehomework);//"请先完成作业"
		            return;
	            }
	                var hwrelid = this.model.id;
	            this.model.commitHomeWork(content,hwrelid,bootbox,this);
            },
            sthCheckedSave_handler:function(){
		        var content = $(this.elems.myhomework_summernote).parent().find(".note-editable").html();
		        if(content == undefined || content.trim() ==''){
			        bootbox.alert(MyHomework.MyHomework.completehomework);
			        return;
		        }
		        var hwrelid = this.model.id;
		        this.model.saveHomeWork(content,hwrelid,bootbox);

	        }
        });
        return v;
    });
