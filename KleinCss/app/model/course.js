/**
 * Created by cs on 2016/1/5.
 */
//课程 [courses]
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var coursesSchema = new Schema({
    //唯一标识 uuid
    _id:{
        type:Schema.Types.String
    },
    userid:{
        type:Schema.Types.String, ref:'user'
    },
    //课程名称
    name:String,
    //课程图片
    image:{
        type:String,
        default:'/images/course1.jpg'
    },
    //简介
    introduction:String,
    //详情
    info:String,
    //大纲、目录
    catalog:String,
    //计费方式 json
    billing:
    {
        fvalue:Number,
        fdetail:String
    },
    //单价
    price:String,
    //授课方式 0教室授课，1上门授课，2网上远程授课
    method:{
        type: {type: Number},
        name: String
    },
    //授课地点 (教室授课方式指定的地点 其他授课方式不需要)
    classroom:String,
    //授课模式 0一对一 1一对多
    mode:{
        type: {type: Number},
        name: String
    },
    //面向群体年龄
    range:{
        min:Number,max:Number
    },
    //缩略图 (资源路径)
    thumbnail:String,
    //图片 (资源路径)
    image:String,
    //课程评分 (接收程度。。。。)
    score:String,
    //课程点赞
    comment:{type:Number,default:0},
    //可用状态 (老师删除掉的课程状态不可用 0不可用 1可用)
	enable:{type:Boolean,default:true}, //1:可用，0：不可用
    //----审核信息----
    //创建日期
    cdate:{
        type:Date,default:Date.now
    },
    // lv=0, 未发布 0:未审核 1:等待审核 2:审核中 3:审核成功 4:审核失败
    // lv=1, 发布 0:报名 1:报名截至
    // lv=2, 进行中 0:准备开课 1:进行中 2:结课
    // lv=3, 下架 0:已下架
    // lv=-1
    statelv:{
        lv:Number,
        type:{type: Number},
        name:String
    },
    //报名的人数
    signnum:{type:Number,default:0},
    //上课的人数
    actnum:{type:Number,default:0},
    //累计上课人数
    totalactnum:{type:Number, default:0},
    //收藏的人数
    favnum:{type:Number,default:0},
    agencyid:{type:Schema.Types.String,ref:'user'},
    isproxy:{type:Number,default:0}, // 1：授权，0：未授权，
    agencyname:String
},{
    _id:false
});


mongoose.model('course', coursesSchema);

module.exports.Schema = function(modelName) {
    return {
        model:mongoose.model(modelName)
    }
}