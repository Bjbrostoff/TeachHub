/**
 * Created by apple on 16/1/8.
 */
define('app/audit/view/auditcert/AuditCertDetailView',
	[
		'underscore',
		'backbone',
		'jquery',
		'text!/app/audit/template/auditcert/AuditCertDetailView.ejs',
		'bootbox',
		'i18n!/nls/audit.js'
	],
	function(_, Backbone, $, tmpl,bootbox,localName
	         ){
		var v = Backbone.View.extend({
			events:{
					"click #mycert_pass_sub_btn":"mycert_passHandler",
				"click #mycert_cancel_btn":"mycert_cancelHandler",
				"click #mycert_unpass_sub_btn":"mycert_unpassHandler"

			},
			initialize:function(options){

				this.template = _.template(tmpl);
				this.options = options;
				this.els = {
					"mycert_pass_sub_btn":"#mycert_pass_sub_btn",
					"mycert_unpass_sub_btn":"#mycert_unpass_sub_btn",
					"mycert_cancel_btn":"#mycert_cancel_btn"

				};


				this.curel = {};


			},
			render:function(){

				var json = this.model.toJSON();



				$(this.el).html(this.template({
					info:json,
					isdetail:this.options.isdetail,
					local:localName
				}));


				return this;
			},
			addSlimScroll:function(){
				$('.full-height-scroll').slimscroll({
					height: '100%'
				});
			},
			openProfileView_handler:function() {
				//console.log(this.model.attributes);
				this.trigger('open-profile-view', {userid: this.model.attributes.uuid});
			},mycert_passHandler:function(){

				var curelid = this.model.attributes._id;
				var  coll = this.model.collection;
				coll.actingPassAuditCert(curelid,"pass");
				coll.remove(this.model);
				this.remove();

			},
			mycert_unpassHandler:function(){
				var curelid = this.model.attributes._id;
				var  coll = this.model.collection;
				coll.actingPassAuditCert(curelid,"unpass");
				coll.remove(this.model);
				this.remove();

		},
			mycert_cancelHandler:function(){
				this.remove();
			}
			});
		return v;
	})
