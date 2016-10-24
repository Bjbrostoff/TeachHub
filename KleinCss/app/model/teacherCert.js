/**
 * Created by apple on 15/12/5.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var acadecerti = new Schema({
	level:String,//学位：0学士以下 1学士 2硕士 3博士 ...
	image:String,//学位照
	code:String//学位号
});
var servexerti = new Schema({
	info:String,//
	image:String
});
var teachercert = new Schema({
	_id:{
		type:Schema.Types.String
	},
	userid:String,//教师id
	name:String,//真实姓名
	credentype:String, //证件类型
	credencode:String,//证件号码
	credenimage:String ,//证件照片（存地址）
	payway:String ,//付款方式
	acadecerti:{
		level:String,//学位：0学士以下 1学士 2硕士 3博士 ...
		image:String,//学位照
		code:String//学位号
	},

	servexerti:{
		info:String,//
		image:String
	},//资质认证
	workexp:String,//工作历史认证,
	expinfo:String,
	enable:{type:Boolean,default:true} //1:可用，0：不可用
}, {
	_id:false
});


mongoose.model('teachercert', teachercert);

module.exports.Schema = function(modelName) {
    return {
        model:mongoose.model(modelName)
    }
}