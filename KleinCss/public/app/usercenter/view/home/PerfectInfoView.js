/**
 * Created by Administrator on 2016/1/17.
 */
define('app/usercenter/view/home/PerfectInfoView',
    [
        'underscore',
        'backbone',
        'jquery',
        'bootbox',
        'timepicker',
        'text!/app/usercenter/template/home/PerfectInfo.ejs',
        'i18n!/nls/uchome.js'
    ],
    function(_, Backbone, $,bootbox, timepicker,
             tmpl,localName){
        var v = Backbone.View.extend({
            initialize:function(option){
                this.options = {};
                _.extend(this.options, option);
                this.eventBus = option.eventBus;
                this.template = _.template(tmpl);
                this.elems = {
                    'timepicker': '#homeview-complate-timepicker'
                };
                this.model.on('success', this.changeModel, this);
            },
            render:function(){
                $(this.el).html(this.template({
                    model:this.model.toJSON(),
                    local:localName.Home.PerfectInfo
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
                    title:localName.Home.PerfectInfo.dialogTitle,
                    message: self.el,
                    closeButton:false,
                    buttons: {
                        success: {
                            label: localName.Home.PerfectInfo.confirm,
                            className: "btn-primary",
                            callback: function() {
                                var result=$('#homeview-complate-formgroup').serialize();
                                var data={};
                                data.location=$('#homeview-complate-location').val();
                                if(data.location=="" || data.location==' ') {
                                    alert(localName.Home.PerfectInfo.alert);
                                    self.buildDialog();
                                }else{
                                    var dataEnd = [];
                                    result.split('&').forEach(function (param) {
                                        param = param.split('=');
                                        var key = param[0];
                                        var val = param[1];
                                        var p = {};
                                        if (key == 'id') {
                                            p[key] = val;
                                            dataEnd.push(p);
                                        }
                                    });
                                    data.students = dataEnd;

                                    var time = $('#homeview-complate-timepicker').val();
                                    var a = time.split(':')[0];
                                    var end;
                                    if (a.length == 1) {
                                        end = '0' + time
                                    } else {
                                        end = time;
                                    }
                                    self.eventBus.trigger('success', event, end, data);
                                    self.remove();

                                }
                            }
                        },
                        cancel: {
                            label: localName.Home.PerfectInfo.cancel,
                            className: "btn-primary",
                            callback: function() {
                                self.eventBus.trigger('cancel',event);
                                self.remove();
                            }
                        }
                    }
                });
            },
            fetchStudents:function(mid){
                this.model.fetchStudents(mid);
            },
            changeModel:function(){
                this.render();
                this.buildDialog();
                this.buildTimePicker();
            }
        });
        return v;
    })