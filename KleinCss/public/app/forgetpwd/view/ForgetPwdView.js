
/**
 * Created by xiaoguo on 16/1/1.
 */
define('app/forgetpwd/view/ForgetPwdView',
	[
		'underscore',
		'backbone',
		'jquery',
		'text!/app/forgetpwd/template/ForgetPwdView.ejs'

	],
	function(_, Backbone, $, tmpl){
		var v = Backbone.View.extend({
			events:{
				'click #forget_sub':'forget_sub',
				'click #hsbtn':'forget_hssub'
			},
			initialize:function(options){
				// if (this.hasOwnProperty('eventBus')){
				//     this.eventBus = options.eventBus;
				// }

				this.template = _.template(tmpl);
				console.log(444);
				this.elems = {
					'forget_sub':'#forget_sub',
					'forget_hsbtn':'#hsbtn',
					'forget_mail':'#forget_mail',
					'forget_emsg':'#forget_emsg',

					'forget_code':'#forget_code',
					'forget_vmsg':'#forget_vmsg'
				};

			},
			render:function(){
				//console.log(this.model);
				$(this.el).html(this.template({

				}));
				return this;
			},forget_sub:function(){
				var  email = $(this.elems.forget_mail).val();
				var code = $(this.elems.forget_code).val();
				if (!email) {
					$(this.elems.forget_emsg).html('请输入邮箱');
					$(this.elems.forget_emsg).css({
						color: 'red',
						display: 'block'
					});
					return false;
				} else {
					$(this.elems.forget_emsg).html('');
					$(this.elems.forget_emsg).css({
						display: 'none'
					});
				}
				if (email && !this.verifyEmail(email)) {
					$(this.elems.forget_emsg).html('邮箱格式错误');
					$(this.elems.forget_emsg).css({
						color: 'red',
						display: 'block'
					});
					return false;
				}
				else {
					$(this.elems.forget_emsg).html('');
					$(this.elems.forget_emsg).css({
						display: 'none'
					});
				}

				if (!code) {
					$(this.elems.forget_vmsg).html('请输入验证码');
					$(this.elems.forget_vmsg).css({
						color: 'red',
						display: 'block'
					});
					return false;
				} else {
					$(this.elems.forget_vmsg).html('');
					$(this.elems.forget_vmsg).css({
						display: 'none'
					});
				}
				var that = this;
				$.ajax({
					type:"post",
					url:"/users/checkValidate",
					data:{email:email,vcCode:code},
					success:function(data){
						if(data.code == '200'){
							window.location.href = "#enterpwd";
						}else{

							$(that.elems.forget_vmsg).html('验证码不正确');
							$(that.elems.forget_vmsg).css({
								color: 'red',
								display: 'block'
							});


						}

					},
					error:function(data){

					}
				})

			},forget_hssub:function() {
				var email = $(this.elems.forget_mail).val();
				if (!email) {
					$(this.elems.forget_emsg).html('请输入邮箱');
					$(this.elems.forget_emsg).css({
						color: 'red',
						display: 'block'
					});
					return false;
				} else {
					$(this.elems.forget_emsg).html('');
					$(this.elems.forget_emsg).css({
						display: 'none'
					});
				}
				if (email && !this.verifyEmail(email)) {
					$(this.elems.forget_emsg).html('邮箱格式错误');
					$(this.elems.forget_emsg).css({
						color: 'red',
						display: 'block'
					});
					return false;
				}
				else {
					$(this.elems.forget_emsg).html('');
					$(this.elems.forget_emsg).css({
						display: 'none'
					});
				}
				var that = this;
				$.ajax({
					type:'post',
					url:'/users/findUser',
					data:{email:email},
					success:function(data){
						if(data.code == '200'){
							$.ajax({
								type: 'post',
								url: '/users/sendEmail',
								data: {email: email},
								success: function (data) {
								}, error: function () {
								}
							});
							that.forget_wait(60);
						}else{

							$(that.elems.forget_emsg).html('账号不存在');
							$(that.elems.forget_emsg).css({
								color: 'red',
								display: 'block'
							});
						}
					},error:function(data){
						$(that.elems.forget_emsg).html('账号不存在');
						$(that.elems.forget_emsg).css({
							color: 'red',
							display: 'block'
						});
					}
				})

			},forget_wait:function (wait) {
				var that = this;
				if (wait == 0) {
					$(that.elems.forget_hsbtn).removeAttr("disabled").html('请重发验证码');

				} else {

					$(that.elems.forget_hsbtn).attr("disabled", true).html('在' + wait + '秒后点此重发');
					wait--;
					setTimeout(function () {
						that.forget_wait(wait);
					}, 1000)
				}
			},forget_validate:function(){


			},verifyEmail:function (value){
			return /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(value);
		}

	});
		return v;
	});
