/**
 * Created by xiaoguo on 2016/1/17.
 */
define('app/usercenter/model/MyActiveClassModel',
[
	'underscore',
	'backbone',
	'jquery'
],
function(_, Backbone, $){
	var m = Backbone.Model.extend({
		defaults:{

		},
		initialize:function(){

			this.id = this.attributes._id;
			this.attributes.id = this.attributes._id;;

		},
		cancelSign:function(curelid){
			$.post("/users/cancelSign",{"cureid":curelid,"fDate":new Date()},function(data){

			})
		}

	});
	return m;
})