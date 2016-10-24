/**
 * Created by Administrator on 2016/2/18.
 */
define('app/usercenter/model/HomeworkModel',
    [
        'underscore',
        'backbone',
        'jquery'
    ],
    function(_, Backbone, $){
        var m = Backbone.Model.extend({
            defaults:{

            },
            initialize:function(){

                this.id = this.attributes._id;
                this.attributes.id = this.attributes._id;
                var commitdate  = this.attributes.commitdate;
                var teamarkdate = this.attributes.teamarkdate;
                if(commitdate != undefined){
                    commitdate = this.dateFormat(commitdate,'yyyy-MM-dd hh');
                    this.attributes.commitdate = commitdate;
                }
                if(teamarkdate != undefined){
                    teamarkdate = this.dateFormat(teamarkdate,'yyyy-MM-dd hh');
                    this.attributes.teamarkdate = teamarkdate;
                }

            },
            saveHomeWork:function(content,hwreiid,bootbox){
                var self = this;
                self.attributes.hwcontent = content;
                console.log(self);
                $.post("/users/saveStuWork",{"hwrelid":hwreiid,"content":content,"fDate":new Date()},function(data){
                    if(data.code != '200'){
                        bootbox.alert("保存失败");
                    }else{
                        bootbox.alert("保存成功");
                    }
                });
            },
            commitHomeWork:function(content,hwreiid,bootbox,editview){
                var self = this;
                self.attributes.hwcontent = content;
                $.post("/users/commitStuWork",{"hwrelid":hwreiid,"content":content,"fDate":new Date()},function(data){
                    if(data.code != '200'){
                        bootbox.alert("提交失败");
                    }else{
                        bootbox.alert("提交成功");

                        editview.remove();
                        self.collection.remove(self);
                    }
                });
            },dateFormat : function(date, format) {
                var obj = new Date(date);
                var o = {
                    "M+" : obj.getMonth() + 1, // month
                    "d+" : obj.getDate(), // day
                    "h+" : obj.getHours(), // hour
                    "m+" : obj.getMinutes(), // minute
                    "s+" : obj.getSeconds(), // second
                    "q+" : Math.floor((obj.getMonth() + 3) / 3), // quarter
                    "S" : obj.getMilliseconds()
                    // millisecond
                };
                if (/(y+)/.test(format)) {
                    format = format.replace(RegExp.$1, (obj.getFullYear() + "")
                        .substr(4 - RegExp.$1.length));
                }
                for ( var k in o) {
                    if (new RegExp("(" + k + ")").test(format)) {
                        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
                            : ("00" + o[k]).substr(("" + o[k]).length));
                    }
                }
                return format;
            }
        });
        return m;
    });
