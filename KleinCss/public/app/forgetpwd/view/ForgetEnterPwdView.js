
/**
 * Created by xiaoguo on 16/1/1.
 */
define('app/forgetpwd/view/ForgetEnterPwdView',
	[
		'underscore',
		'backbone',
		'jquery',
		'text!/app/forgetpwd/template/ForgetEnterPwdView.ejs',
		'bootstrap',
		'bootbox'

	],
	function(_, Backbone, $, tmpl,bootstrap,bootbox){
		var v = Backbone.View.extend({
			events:{
				'click #forget_pwdsub':'forget_pwdsub'

			},
			initialize:function(options){
				// if (this.hasOwnProperty('eventBus')){
				//     this.eventBus = options.eventBus;
				// }

				this.template = _.template(tmpl);

				this.elems = {
					'forget_pwdsub':'#forget_pwdsub',
					'forget_pwd':'#forget_pwd',
					'forget_pwd_email':'#forget_pwd_email',
					'forget_pwd1':'#forget_pwd1',
					'forget_epwd1':'#forget_epwd1'

				};

			},
			render:function(data){
				//console.log(this.model);
				$(this.el).html(this.template(data));
				return this;
			},forget_pwdsub:function(){
				console.log($(this.elems.forget_pwd_email).val());
				var password =  $(this.elems.forget_pwd).val();
				var password2 =  $(this.elems.forget_pwd1).val();
				var email = $(this.elems.forget_pwd_email).val();
				if (!password || !password2) {
					$(this.elems.forget_epwd1).html('请输入密码');
					$(this.elems.forget_epwd1).css({
						color: 'red',
						display: 'block'
					});
					return false;
				} else {
					$(this.elems.forget_epwd1).html('');
					$(this.elems.forget_epwd1).css({
						display: 'none'
					});
				}

				if (password.length < 6 || password.length > 13) {
					$(this.elems.forget_epwd1).html('请输入大于6，小于13位的密码');
					$(this.elems.forget_epwd1).css({
						color: 'red',
						display: 'block'
					});
					return false;
				} else {
					$(this.elems.forget_epwd1).html('');
					$(this.elems.forget_epwd1).css({
						display: 'none'
					});
				}

				if (password && password2 && password != password2) {
					$(this.elems.forget_epwd1).html('两次密码不同输入不同');
					$(this.elems.forget_epwd1).css({
						color: 'red',
						display: 'block'
					});
					return false;
				} else {
					$(this.elems.forget_epwd1).html('');
					$(this.elems.forget_epwd1).css({
						display: 'none'
					});
				}

				$.ajax({
					type:"post",
					url:"/users/updatePwdForForget",
					data:{email:email,password:password},
					success:function(data){
						if(data.code == '200'){
							bootbox.alert({
								message:"密码修改成功！",
								callback:function(){
									window.location.href= "/";

								}

							});
						}
					},
					err:function(data){

					}
				})

			},verifyEmail:function (value){
			return /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(value);
		}

	});
		return v;
	});
