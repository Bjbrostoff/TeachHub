/**
 * Created by apple on 15/12/5.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var tt = new Schema();
var cremsgs = new Schema({
	_id:{
		type:Schema.Types.String
	},
	userid:{
		type:Schema.Types.String, ref:'user'
	},//用户id
	type:String,//审核类型 1:身份审核， 2:头像审核 3.课程审核 4:机构认证
	status:{type:String,default:"1"},//审核状态  1:待审核，2：审核通过，3：审核失败 4:审核中
	commitdate:{  type: Date, default: Date.now},//提交时间
	finishdate:Date,
	content:[{
		filedname:String,
		filedaliases:String,
		value:String ,
		fieldtype:String // 1:文本形式，2：图片形式，3：数组形式{info:string,image:String}
	}],
	teacher:{
		type:Schema.Types.String, ref:'user'
	},
	//课程
	course:{
		type:Schema.Types.String, ref:'course'
	},
	auditid:{
		type:Schema.Types.String, ref:'user'
	}
	,
	enable:{type:Boolean,default:true} //1:可用，0：不可用
}, {
	_id:false
});


mongoose.model('cremsg', cremsgs);

module.exports.Schema = function(modelName) {
	return {
		model:mongoose.model(modelName)
	}
}