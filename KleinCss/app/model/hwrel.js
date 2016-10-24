/**
 * Created by xiaoguo on 2016/1/23.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var tt = new Schema();
var hwrels = new Schema({
	_id:{
		type:Schema.Types.String
	},
	userid:{//学生id
		type:Schema.Types.String, ref:'user'
	},
	hwid :{//作业id
		type:Schema.Types.String, ref:'homework'
	},
	teacherid:{
		type:Schema.Types.String,ref:'user'
	},
	courseid:{
	type:Schema.Types.String,ref:'course'
	},
	hwcontent:String,//学生上传作业

	type:{//default :0 未提交，1 学生已提交作业，2 教师已审核作业
		type:Number,default:0
	},
	score:Number,
	commitdate:{type:Date},//学生提交时间
	teamarkdate:{type:Date},//教师批阅时间
	enable:{type:Boolean,default:true} //1:可用，0：不可用
}, {
	_id:false
});


mongoose.model('hwrel', hwrels);

module.exports.Schema = function(modelName) {
	return {
		model:mongoose.model(modelName)
	}
}