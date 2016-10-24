/**
 * Created by lqk on 2015/12/12.
 */
var nodemailer = require("nodemailer");
var hostmail = "15868812582@163.com";
// 开启一个 SMTP 连接池
var smtpTransport = nodemailer.createTransport({
    service: '163',
    auth: {
        user:hostmail, // 账号
        pass: "dqamvfaszngauyef" // 密码
    }
});
var vcList={} ;
exports.getVcList=function(email){
    return vcList[email];
},
exports.sendEmail=function(req,res,next){
    var verifycode='';
    var toemail = req.body.email;
    var codeLength = 6;//验证码的长度 
    var selectChar = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9,'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z');//所有候选组成验证码的字符，当然也可以用中文的 

    for (var i = 0; i < codeLength; i++) {
        var charIndex = Math.floor(Math.random() * 36);
        verifycode += selectChar[charIndex];
    }
    vcList[toemail] = verifycode;
    console.log(vcList);
    if(!toemail)
        toemail="862217046@qq.com";
    // 设置邮件内容
    var mailOptions = {
        from: hostmail, // 发件地址
        to: toemail,
        subject: "Hello world", // 标题
        html: "<b>您好，您的验证码为：</b>"+verifycode // html 内容
    }
// 发送邮件
    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log("Message sent: " + response.message);
        }
    });
}