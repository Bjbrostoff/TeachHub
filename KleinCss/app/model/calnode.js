/**
 * Created by cs on 2016/1/9.
 */
//老师学生关系 [turels] teacher-user
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var calnodeSchema = new Schema({
    //主体 主题唯一标识
	_id:{
		type:Schema.Types.String
	},
	tdate:{
		//type:Schema.Types.Date
		type:Schema.Types.String
	},
	name:String,
	teacherid:{
        type:Schema.Types.String, ref:'user'
    },
	courseid:{
		type:Schema.Types.String, ref:'course'
	},
	state:Number,// (0未上课，1已上课)
	students:[{
		stuid:{type:Schema.Types.String,ref:"user"},
		status:Number //0：未来上课，1：已经来上课
	}],
	address:String,
	enable:{type:Boolean,default:true} //1:可用，0：不可用


});


mongoose.model('calnode', calnodeSchema);

module.exports.Schema = function(modelName) {
    return {
        model:mongoose.model(modelName)
    }
}