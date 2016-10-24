/**
 * Created by apple on 16/1/8.
 */
define('app/usercenter/view/mycourse/MyCourseInSignView',
	[
		'underscore',
		'backbone',
		'jquery',
		'text!/app/usercenter/template/mycourse/MyCourseInSign.ejs',
		'i18n!/nls/uchome.js'

	],
	function(_, Backbone, $, tmpl,MyCourse){
		var v = Backbone.View.extend({
			el:this.el,
			events:{
				"click .btn_course_in_sign":"cancelSignHandler"
			},
			initialize:function(option){
				this.template = _.template(tmpl);
				this.elems = {
					"btn_course_in_sign":".btn_course_in_sign"
				};
				this.views = {};
				this.models = {};

			},
			render:function(){
				console.log(this.collection);

				$(this.el).html(this.template({datas:this.collection.toJSON(),locale:MyCourse}));
				return this;
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
			_CollectionChange:function(){

				this.render();
			},
			addActionListener:function(){
				this.collection.on('change', this._CollectionChange, this);
				this.collection.on('remove', this._CollectionChange, this);
				this.collection.on('add', this._CollectionChange, this);

			},
			cancelSignHandler:function(evt){
				var ucrelid =  $(evt.currentTarget).attr("keyvalue");
				var mm = this.collection.get(ucrelid);
				mm.cancelSign(ucrelid);
				this.collection.remove(mm);
				console.log(mm);

			}

		});
		return v;
	});
