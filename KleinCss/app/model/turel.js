/**
 * Created by cs on 2016/1/9.
 */
//老师学生关系 [turels] teacher-user
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var turelsSchema = new Schema({
    //主体 主题唯一标识
    subjectid:{
        type:Schema.Types.String, ref:'user'
    },
    //关系 0教学关系 1收藏关系
    relation: {
        type: {type: Number},
        name: String
    },
    //客体 客体唯一标识
    objectid:{
        type:Schema.Types.String, ref:'user'
    },
    //状态 教学关系（正在授课[state.type:0&coursecount>0],曾经授课[state.type:0&coursecount:0],报名阶段[state.type:2])
    state:{
        type: {type: Number},
        name: String
    },
    //上课的数量
    coursecount:{
        type:Number,
        default:0
    },
	enable:{type:Boolean,default:true} //1:可用，0：不可用
});


mongoose.model('turel', turelsSchema);

module.exports.Schema = function(modelName) {
    return {
        model:mongoose.model(modelName)
    }
}