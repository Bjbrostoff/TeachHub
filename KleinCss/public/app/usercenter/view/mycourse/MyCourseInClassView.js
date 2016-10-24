/**
 * Created by apple on 16/1/8.
 */
define('app/usercenter/view/mycourse/MyCourseInClassView',
	[
		'underscore',
		'backbone',
		'jquery',
		'text!/app/usercenter/template/mycourse/MyCourseInClass.ejs',
		'i18n!/nls/uchome.js'

	],
	function(_, Backbone, $, tmpl,MyCourse){
		var v = Backbone.View.extend({
			el:this.el,
			events:{

			},
			initialize:function(option){
				console.log(11);

				this.template = _.template(tmpl);
				this.elems = {

				};
				this.views = {};
				this.models = {};

				console.log(this.collection);

			},
			render:function(){

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
			_modelChange:function(){
				this.render();
			},addActionListener:function(){

				this.collection.on('change', this._modelChange, this);
				this.collection.on('add', this._modelChange, this);
				this.collection.on('remove', this._modelChange, this);
			}

		});
		return v;
	});
