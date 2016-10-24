define('app/forgetpwd/ForgetPwdApp',
	[
		'underscore',
		'backbone',
		'jquery',
		'app/forgetpwd/controller/Router'
	],
	function(_, Backbone, $,  Router){
		function initialize(){
			var app = new Router();
			Backbone.history.start();
		};

		return {
			initialize:initialize
		};
	})
