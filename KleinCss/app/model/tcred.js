

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var tcredSchema = new Schema({
    _id:{
        type:Schema.Types.String
    },
    userid:{
        type:Schema.Types.String, ref:'user'
    },
    name:String,
    credentype:String,
    credencode:String,
    credenimage:String,
    payway:String,
    acadecerti:{
        level:Number,
        image:String,
        code:String
    },
    servexerti:[{
        info:String,
        image:String,
        time:String,
        _id:String
    }],
    workexp:String,
    info:{
        mothertongue:{//母语
            value:String,
            pub:String
        },
        skilledcourse:{//擅长学科
            value:String,
            pub:String
        },
        language:{//擅长语言
            value:String,
            pub:String
        },
        info:{//简介
            value:String,
            pub:String
        },
        currentAgency:{//当前机构
            value:String,
            pub:String
        },
        almaMater:{//母校
            value:String,
            pub:String
        },
        collegeDegree:{ //学位
            value:String,
            pub:String
        }
    },
    enable:{type:Boolean,default:true}//1:可用，0：不可用
}, {
    _id:false
});


mongoose.model('tcred', tcredSchema);

module.exports.Schema = function(modelName) {
    return {
        model:mongoose.model(modelName)
    }
}