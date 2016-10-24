/**
 * Created by xiaoguo on 2015/12/14.
 */

var demoUtil = require("../util/demo");
exports.demo = function(req, res, next){
	//console.log(req);
	var json = demoUtil.demojson();
	var sinfo = {};
	if (req.session){
		sinfo = {
			user:req.session.user
		}
	};
	console.log(sinfo);
	res.render("demo", {
		title:"demo",
		page:"index",
		login:"login",
		sessinfo:sinfo,
		courses:json.courses,
		teachers:json.teachers,
		agency:json.agency
	});
}