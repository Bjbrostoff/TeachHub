/**
 * Created by Administrator on 2016/3/3.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var agencyTeacherSchema = new Schema({
    //主体 主题唯一标识
    _id:{
        type:Schema.Types.String
    },
    name:String,
    portrait:String,           //头像
    sex:String,                //男女
    age:Number,                //年龄
    workexp:Number,            //工作经验
    teachyears:Number,         //教龄
    mothertongue:String,       //母语
    skilledcourse:String,      //擅长学科
    language:String,           //擅长语言
    agencyid:{
        type:Schema.Types.String, ref:'user'           //user
    }
});


mongoose.model('agencyteacher', agencyTeacherSchema);

module.exports.Schema = function(modelName) {
    return {
        model:mongoose.model(modelName)
    }
}