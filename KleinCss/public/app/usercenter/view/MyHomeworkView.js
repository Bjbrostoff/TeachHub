/**
 * Created by apple on 16/1/8.
 */
define('app/usercenter/view/MyHomeworkView',
[
    'underscore',
    'backbone',
    'jquery',
    'text!/app/usercenter/template/MyHomeworkView.ejs',
    'app/usercenter/view/myhomework/ActingMyHomeworkView',
    'app/usercenter/view/myhomework/SubmitedMyHomeworkView',
    'app/usercenter/view/myhomework/CheckedMyHomeworkView',
	'app/usercenter/collection/HomeworkCollection',
    'i18n!/nls/uchome.js'
],
function(_, Backbone, $, tmpl, ActingMyHomeworkView, SubmitedMyHomeworkView,
         CheckedMyHomeworkView,HomeWorkCollection,MyHomework){
    var v = Backbone.View.extend({
        el:'.myhomework-container',
        events:{
			"click #myhomework_unfinish_btn":"showactingmhwview",
	        "click #myhomework_commit_btn":"showSubmitedMyhView",
	        "click #myhomework_gard_btn":"showcheckedmyhomeworkview"
        },
        initialize:function(option){
            this.eventBus = option.eventBus || {};
            this.template = _.template(tmpl);
            this.elems = {
                'myhomeworkactingview':'#myhomework-homework-acting-tab',
                'myhomeworkpushedview':'#myhomework-homework-pushed-tab',
                'myhomeworkcheckedview':'#myhomework-homework-checked-tab'
            };
            this.views = {};
            this.models = {};
	        this.collections = {};
	        this.collections.myhomeworkactingcollection = new HomeWorkCollection();
	        this.collections.myhomeworkcommitcollection = new HomeWorkCollection({  'url':'/users/getAllHomeWork?type=1'});
	        this.collections.myhomeworkgardcollection = new HomeWorkCollection({  'url':'/users/getAllHomeWork?type=2'});


        },
        render:function(){
            $(this.el).html(this.template({locale:MyHomework}));
	        this.showactingmhwview();
            this.changeBackGround();
            return this;

        },
        changeBackGround:function () {
            $(".my-homework-nav-tab").click(function (e) {
                $(this).parent().children().removeClass("on");
                $(this).addClass("on");
            });
        },
        createSubViews:function(){

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
        showactingmhwview:function(){
	        this.collections.myhomeworkactingcollection = new HomeWorkCollection();

            if (!this.views.actingMyHomeworkView) {
                this.views.actingMyHomeworkView = new ActingMyHomeworkView({
                    eventBus: this.eventBus,
                    el: this.elems.myhomeworkactingview,
	                collection:this.collections.myhomeworkactingcollection
                    // model: this.models.baseinfoModel
                });
            }
	        var self = this;
	        self.collections.myhomeworkactingcollection.fetch({
		        data:{},
		        success:function(){
			        $(self.elems.myhomeworkactingview).append(self.views.actingMyHomeworkView.render().el);
		        }
	        })

        },
        showSubmitedMyhView:function(){
	        this.collections.myhomeworkcommitcollection = new HomeWorkCollection({  'url':'/users/getAllHomeWork?type=1'});

            if (!this.views.submitedMyHomeworkView) {
                this.views.submitedMyHomeworkView = new SubmitedMyHomeworkView({
                    eventBus: this.eventBus,
                    el: this.elems.myhomeworkpushedview,
	                collection:this.collections.myhomeworkcommitcollection
                    // model: this.models.baseinfoModel
                });
            }
	        var self = this;
	        self.collections.myhomeworkcommitcollection.fetch({data:{},
	            success:function(){
		            $(self.elems.myhomeworkpushedview).append(self.views.submitedMyHomeworkView.render().el);
	            }
	        })

        },
        showcheckedmyhomeworkview:function(){

	        this.collections.myhomeworkgardcollection = new HomeWorkCollection({  'url':'/users/getAllHomeWork?type=2'});
            if (!this.views.checkedMyHomeworkView) {
                this.views.checkedMyHomeworkView = new CheckedMyHomeworkView({
                    eventBus: this.eventBus,
                    el: this.elems.myhomeworkcheckedview,
	                collection :this.collections.myhomeworkgardcollection
                    // model: this.models.baseinfoModel
                });
            }
	        var self = this;
	        self.collections.myhomeworkgardcollection.fetch({data:{},
	            success:function(){
		            $(self.elems.myhomeworkcheckedview).append(self.views.checkedMyHomeworkView.render().el);
	            }
	        })

        }
    });
    return v;
});
