/**
 * Created by Administrator on 2016/3/8.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var proxyreqSchema = new Schema({
    _id:{
        type:Schema.Types.String
    },
    type:Number,      //1:老师申请机构名下老师 2：老师授权课程给机构
    status :Number,   //-> 1:申请 2: 通过，3：未通过,4:解除
    teacherid:{
        type:Schema.Types.String, ref:'user'
    },
    courseid:{
        type:Schema.Types.String, ref:'course'
    },
    enable:Boolean,    // ->
    agencyid:{
        type:Schema.Types.String, ref:'user'
    },
});

mongoose.model('proxyreq', proxyreqSchema);

module.exports.Schema = function(modelName) {
    return {
        model:mongoose.model(modelName)
    }
};