
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var tcrelsSchema = new Schema({
	teacherid:String,//教师id
	relation:{//#关系 （0拥有,1创建 ?待定）
		type:{type: Number},
		name:String
	},
	//课程id
	courceid:{
		type:Schema.Types.String, ref:'course'
	},
	enable:{type:Boolean,default:true} //1:可用，0：不可用
});

mongoose.model('tcrel', tcrelsSchema);

module.exports.Schema = function(modelName) {
	return {
		model:mongoose.model(modelName)
	}
}