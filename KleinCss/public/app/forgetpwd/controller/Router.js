define('app/forgetpwd/controller/Router',
[
    'underscore',
    'backbone',
    'jquery',
	'app/forgetpwd/view/ForgetPwdView',
	'app/forgetpwd/view/ForgetEnterPwdView'



],
function(_, Backbone, $,ForgetPwdView,ForgetEnterPwdView
        ){
    var r = Backbone.Router.extend({
        el:'.page-wrapper',
	    routes:{
		    '':'validate',
		    'validate':'validate',
		    'enterpwd':'enterpwd'

	    },
        initialize:function(options){
            console.log(options);
            this.options = {
                rolelevel:0

            };
            _.extend(this.options, options);
            //1.顶级元素
            this.elems = {

                'contentSector':'#contentSector'
            };
            //2.eventbus
            this.eventBus = _.extend({}, Backbone.Events);
            //3.视图们
            this.views = {};
            //3.集合们
            this.collections = {};
            //4.菜单的集合

			this.models = {};


        },
        index:function(){
            this._detectSubView('menu');
            this._detectSubView('validate');
        },
	    validate:function(){

            this._detectSubView('home');

            //this._hideAllSubViews();
            //this.views.homeView.show();
        },
	    enterpwd:function(){
		    this._detectSubView('enterpwd');
	    },
        _detectSubView:function(viewname){
            switch (viewname){
                case "home":{
	                if(this.views.forgetEnterPwdView) {
		                this.views.forgetEnterPwdView.remove();
	                }
	                this.views = {};

                    if (!this.views.forgetPwdView){
                        this.views.forgetPwdView = new ForgetPwdView({eventBus:this.eventBus});
                        $(this.elems.contentSector).append(this.views.forgetPwdView.render().el);
                    };
                    break;
                }
	            case "enterpwd":{

		            if (!this.views.forgetPwdView ){
			            window.location.href = "/users/forgetpwd";
			         /*   console.log(115155515);
			            this.views.forgetPwdView = new ForgetPwdView({eventBus:this.eventBus});
			            $(this.elems.contentSector).append(this.views.forgetPwdView.render().el);*/
			            break;
		            }else{

		            }

		            var email =  $(this.views.forgetPwdView.elems.forget_mail).val();

		            this.views.forgetPwdView.remove();
		            if(!this.views.forgetEnterPwdView){

			            this.views.forgetEnterPwdView = new ForgetEnterPwdView({eventBus:this.eventBus});
			            $(this.elems.contentSector).append(this.views.forgetEnterPwdView.render({
				            forget_enter_pwd_mail:email
			            }).el);
		            }

		            break;
	            }
            }
        },
        _homeView_edit:function(){
            console.log('1');
        }

    });
    return r;
})
