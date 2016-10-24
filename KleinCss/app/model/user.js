/**
 * Created by apple on 15/12/5.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
    _id:{
        type:Schema.Types.String
    },
    tcredid:{
        type:Schema.Types.String, ref:'tcred'
    },
    acredid:{
        type:Schema.Types.String, ref:'agencyred'
    },
    tcredinfo:{},
    agencyredinfo:{},//机构认证信息
    agenciesinfo:String,//机构用户信息简介
    name:String,
    email:String,
    phone:String,
    password:String,
    age:String,
    sex:String,
    nationality:String,
    birth:String,
    enable:Number,
    usertype:Number,//0普通 1老师 2机构 3审核员 4.管理员
    portrait:{
        type:String,
        default:'/Inspinia/img/a1.jpg'
    },
    location:{
        lng:Number,
        lat:Number
    },
    city:String,
    //评分
    score:{
        type:Number,default:6.0
    },
    //星级，后台评分
    starlevel:Number,
    //点赞数
    likes:{
        type:Number,default:0
    },
    //课程维护
    managecourses:[],
    //我的课程
    mycourses:[],
	enable:{type:Boolean,default:true}, //1:可用，0：不可用
    workhistory:[],
    agencyname:String,
    teachercount:{
        type:Number,default:0
    },
    coursecount:{
        type:Number,default:0
    }

}, {
    _id:false
});

mongoose.model('user', userSchema);

module.exports.Schema = function(modelName) {
    return {
        model:mongoose.model(modelName)
    }
}