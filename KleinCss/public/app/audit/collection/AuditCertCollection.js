/**
 * Created by apple on 16/1/17.
 */
define('app/audit/collection/AuditCertCollection',
[
    'underscore',
    'jquery',
    'backbone',
    'app/audit/model/AuditCertModel',
    'i18n!/nls/audit.js'
],
function(_, $, Backbone,Model,localName){
    var c = Backbone.Collection.extend({
        model:Model,
        url:'/users/getWaitAuthList',
        initialize:function(options){
            if (options && options.hasOwnProperty('url')){
                this.url = options.url;
            }
        },
        //待审核转审核列表 审核员id标记进入待审核对象
        actingAuditCert:function(codes){
            var self = this;
            console.log(codes);
            $.ajax({
                url:'/users/actingAuditCert',
                type:'post',
                data:{codes:JSON.stringify(codes)},
                success:function(json){
                    for(var i = 0 ; i < codes.length; i++){
                        self.remove(self.get(codes[i]));
                    }
                    alert(localName.main.start)

                },
                error:function(json){
                    console.log(json);
                }
            })
        },
        actingPassAuditCert:function(code,result){
            var self = this;

            $.ajax({
                url:'/users/passTheAuth',
                type:'post',
                data:{"cremsgid":code,"result":result},
                success:function(json){

                        self.remove(self.get(code));
                    alert(localName.main.end);

                },
                error:function(json){
                 alert(localName.main.sysError);
                }
            })
        }
    });

    return c;
})
