define('app/usercenter/collection/mycourse/MyActiveCourseInClassCollection',
	[
		'underscore',
		'backbone',
		'jquery',
		'app/usercenter/model/MyActiveClassModel'
	],
	function(_, Backbone, $, Model){
		var c = Backbone.Collection.extend({
			model:Model,
			url:'/users/getStuCourse?type=2',
			initialize:function(options){
				if (options && options.hasOwnProperty('url')){
					this.url = options.url;
				}
			}
		});
		return c;
	})
