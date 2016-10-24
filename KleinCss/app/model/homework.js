/**
 * Created by xiaoguo on 2016/1/23.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var tt = new Schema();
var homework = new Schema({
	_id:{//唯一主键 uuid生成
		type:Schema.Types.String
	},
	teacherid:{//教师id
		type:Schema.Types.String, ref:'user'
	},
	courseid :{//课程id
		type:Schema.Types.String, ref:'course'
	},
	hwcontent:String,//作业内容

	hwtitle:String,//标题

	enable:{type:Boolean,default:true} //1:可用，0：不可用
}, {
	_id:false
});


mongoose.model('homework', homework);

module.exports.Schema = function(modelName) {
	return {
		model:mongoose.model(modelName)
	}
}