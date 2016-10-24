/**
 * Created by Administrator on 2016/1/17.
 */
define('app/usercenter/view/userinfo/WorkExp',
    [
        'underscore',
        'backbone',
        'jquery',
        'bootbox',

        'text!/app/usercenter/template/userinfo/WorkExp.ejs',
        'i18n!/nls/uchome.js'
    ],
    function(_, Backbone, $,bootbox,
             tmpl,BaseInfo){
        var v = Backbone.View.extend({
            initialize:function(option){
                this.options = {};
                _.extend(this.options, option);

                this.template = _.template(tmpl);
                this.elems = {
                    'timepicker': '#homeview-complate-timepicker'
                };

            },
            render:function(){
                $(this.el).html(this.template({
                    locale:BaseInfo
                }));
                return this;

            },
            buildTimePicker:function(){
                document.getElementById("homeview-complate-location").focus();
                $(this.elems.timepicker).timepicker({
                    minuteStep: 5,
                    template: false,
                    maxHours:24,
                    appendWidgetTo: 'body',
                    showMeridian: false,
                    defaultTime:'current'
                });
            },
            buildDialog:function(){
                var self=this;
                var event = this.options.calendarData;
                bootbox.dialog({
                    title: BaseInfo.BaseInfo.Workexperienceadd,//"工作经历添加"
                    message: self.el,
                    closeButton:false,
                    buttons: {
                        success: {
                            label: BaseInfo.BaseInfo.submit,
                            className: "btn-primary",
                            callback: function() {

                                var data={};
                                data.location=$('#workexp-location').val();
                                if(data.location=="" || data.location==' ') {
                                    alert(BaseInfo.BaseInfo.Pleaseenteraplaceofwork);

                                    return false;
                                }
                                data.organization=$('#workexp-organization').val();
                                if(data.organization=="" || data.organization==' ') {
                                    alert(BaseInfo.BaseInfo.Pleaseentertheorganization);

                                    return false;
                                }
                                data.dates=$('#workexp-dates').val();
                                if(data.dates=="" || data.dates==' ') {
                                    alert(BaseInfo.BaseInfo.Pleaseenterthedatesofwork);
                                    return false;
                                }
                                data.jobs=$('#workexp-jobs').val();
                                if(data.jobs=="" || data.jobs==' ') {
                                    alert(BaseInfo.BaseInfo.Pleaseenterajob);
                                    return false;
                                }
                                data.description=$('#workexp-description').val();
                                if(data.description=="" || data.description==' ') {
                                    alert(BaseInfo.BaseInfo.Pleaseenteradescription);
                                    return false;
                                }
                                $.post("/users/saveWorkExp",data,function(dd){
                                    console.log(self);
                                    if(dd.code == '202'){
                                        bootbox.alert(BaseInfo.BaseInfo.failedtodelete);
                                    }else {
                                        self.model.trigger("add_rows", dd);
                                    }
                                })
                            }
                        },
                        cancel: {
                            label: BaseInfo.BaseInfo.cancel,
                            className: "btn-primary",
                            callback: function() {

                            }
                        }
                    }
                });
            }
        });
        return v;
    })