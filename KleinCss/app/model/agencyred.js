var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var agencyredSchema = new Schema({
    _id:{
        type:Schema.Types.String
    },
    userid:{//用户Id
        type:Schema.Types.String, ref:'user'
    },
    legalinfo:{//法人信息
        name:  Schema.Types.String,
        code: Schema.Types.String,
        image:Schema.Types.String
    },
    introduction:Schema.Types.String,
    name:Schema.Types.String,//公司名字
    image:Schema.Types.String,//营业执照
    servexerti:[{
        info:String,
        time:String,
        image:String
    }
],

enable:{type:Boolean,default:true}//1:可用，0：不可用
}, {
    _id:false
});


mongoose.model('agencyred', agencyredSchema);

module.exports.Schema = function(modelName) {
    return {
        model:mongoose.model(modelName)
    }
}