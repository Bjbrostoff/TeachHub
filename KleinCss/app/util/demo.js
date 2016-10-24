/**
 * Created by xiaoguo on 2015/12/14.
 */

var fs = require('fs');

var path = "./app/config/demo.json";

var courses = [],
	teachers = [],
	agency = [];

exports.demojson = function(){
	if (courses.length < 1) {
		var json = JSON.parse(fs.readFileSync(path));
		courses = json.courses;
		teachers = json.teachers;
		agency = json.agency;
	}

	return {
		courses:courses,
		teachers:teachers,
		agency:agency
	}
}
