/**
 * Created by xiaoguo on 2016/1/5.
 */
define('app/usercenter/model/MyCertModel',
[
	'underscore',
	'backbone',
	'jquery'
],
function(_, Backbone, $){
	var m = Backbone.Model.extend({
		defaults:{

		},
		url:'/users/mycertdemo'
	});
	return m;
})