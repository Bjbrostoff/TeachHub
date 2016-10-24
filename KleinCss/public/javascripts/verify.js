/**
 * Created by lqk on 2015/12/12.
 */
function verifyPhone(value){
    return /^1[3|4|5|8][0-9]\d{4,8}$/.test(val);
}
function verifyEmail(value){
    return /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(value);
}
