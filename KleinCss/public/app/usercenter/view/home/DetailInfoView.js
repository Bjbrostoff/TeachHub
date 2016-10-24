/**
 * Created by Administrator on 2016/1/6.
 */
define('app/usercenter/view/home/DetailInfoView',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/usercenter/template/home/DetailInfo.ejs',
        'app/usercenter/model/home/DetailInfoModel',
        'i18n!/nls/uchome.js'
    ],
    function(_, Backbone, $, tmpl,
           detailInfoModel,localname){
        var v = Backbone.View.extend({
            initialize:function(option){
                this.eventBus = option.eventBus;
                this.template = _.template(tmpl);
                this.fieldArr1 = ['name', 'info','introduction','catalog','price'];
                this.fieldArr2=localname.Home.fieldArr2;

            },
            render:function(data){
                $(this.el).html(this.template({
                    data:data,
                    fieldNext:this.fieldArr1,
                    fieldPre:this.fieldArr2,
                    local:localname.Home.detailInformation
                }));
                var a={
                    courseid:data.end._id,
                    tdate:data.data.tdate
                };
                this.studentsClock(a);
                return this;
            },
            studentsClock:function(data){
                $('.homeview-detailinfo-card').click(function(){
                   var stuid= $(this).attr('_id');
                    data.studentid=stuid;
                    var model=new detailInfoModel();
                    model.studentSetClock(data);
                    var self=this;
                    model.on('success',function(data){
                        if(data.state){
                            $(self).attr({"disabled":"disabled"});
                            alert(localname.Home.detailInformation.alertSucc);
                        }else{
                            alert(localname.Home.detailInformation.alertErr);
                        }
                    })

                })
            }
        });
        return v;
    })