/**
 * Created by cs on 2016/1/3.
 */
//学生与课程关系 [ucrels] user-course
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ucrelsSchema = new Schema({
    //学生id
    userid:{
        type:Schema.Types.String, ref:'user'
    },
    //关系(0：收藏 1：报名 2：上课 3：学完)
    relation: {
        type: {type: Number},
        name: String
    },
    //课程id
    courceid:{
        type:Schema.Types.String, ref:'course'
    },
    //老师ID
    teacherid:{
        type:Schema.Types.String, ref:'user'
    },
    //状态
    state:Number,
	enable:{type:Boolean,default:true}, //1:可用，0：不可用
	coursescore:Number,//课程评分
	teacherscore:Number,//教师评分
	easyscore:Number//课程难易度评分

});


mongoose.model('ucrel', ucrelsSchema);

module.exports.Schema = function(modelName) {
    return {
        model:mongoose.model(modelName)
    }
}