/**
 * Created by Administrator on 2016/2/18.
 */
define('app/usercenter/view/userinfo/BaseModalView',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/usercenter/template/userinfo/BaseModalView.ejs',
        'app/usercenter/model/userinfo/UserInfoModel',
        'i18n!/nls/uchome.js',
        'jquery.validate'

    ],
    function (_, Backbone, $, tmpl, UserinfoModel,BaseInfo ) {
        var v = Backbone.View.extend({
            id: '#modify-msg-modal',
            className: 'modal fade',
            events: {
                'click #baseinfo-codesave-btn':'baseinfoModal_codeSaveHandler'
            },
            initialize: function (option) {
                this.eventBus = option.eventBus;
                this.template = _.template(tmpl);
                this.options = {
                    modalData: {
                        title: 'Title'
                    }
                };
                this.elems = {
                    'codeConfirmForm':'#baseinfo-codeConfirm-form'
                };
                _.extend(this.options, option);
                this.render();
            },
            render: function () {
                this.$el.html(this.template({ title: 'Title',locale:BaseInfo}));

                this.$el.modal({show: false});
                //this.setValidate();
                return this;
            },
            show: function () {
                this.$el.modal('show');
            },
            teardown: function () {
                this.$el.data('modal', null);
                this.remove();
            },
            setValidate:function(){
                $.extend($.validator.messages, {
                    required: "必选字段",
                    remote: "请修正该字段",
                    email: "请输入正确格式的电子邮件,如:XXX@163.com",
                    url: "请输入合法的网址",
                    date: "请输入合法的日期",
                    dateISO: "请输入合法的日期 (ISO).",
                    number: "请输入合法的数字",
                    digits: "只能输入整数",
                    creditcard: "请输入合法的信用卡号",
                    equalTo: "两次输入密码不一致",
                    accept: "请输入拥有合法后缀名的字符串",
                    maxlength: jQuery.validator.format("请输入一个 长度最多是 {0} 的字符串"),
                    minlength: jQuery.validator.format("密码不能小于{0}个字 符"),
                    rangelength: jQuery.validator.format("请输入 一个长度介于 {0} 和 {1} 之间的字符串"),
                    range: jQuery.validator.format("请输入一个介于 {0} 和 {1} 之间的值"),
                    max: jQuery.validator.format("请输入一个最大为{0} 的值"),
                    min: jQuery.validator.format("请输入一个最小为{0} 的值")

                });
                $(this.elems.codeConfirmForm).validate({
                    rules: {
                        oldpassword: {
                            required: true,
                            minlength: 5
                        },
                        newpassword: {
                            required: true,
                            minlength: 5
                        },
                        confirmpassword: {
                            required: true,
                            minlength: 5,
                            equalTo: "#baseinfo-userform-password"
                        }
                    }
                });
            },
            baseinfoModal_codeSaveHandler:function(evt){
                this.updateCodeModel = new UserinfoModel();
                var form = document.getElementById("baseinfo-codeConfirm-form");
                var data ={
                    'oldPassword':form.elements[0].value,
                    'newPassword':form.elements[1].value,
                    'conformPassword':form.elements[2].value
                };
                if(data.newPassword !=data.conformPassword){
                    swal(BaseInfo.BaseInfo.swal.Savefail,BaseInfo.BaseInfo.swal.Inconsistent, "error");
                }else {
                    this.updateCodeModel.set(data);
                    this.updateCodeModel.on(this.updateCodeModel.eventNames['updateCodeComplete'],this._updateCodeModel, this);
                    this.updateCodeModel.saveCodeChanges(data);
                }

            },
            _updateCodeModel:function(json){
                if (json.state == true){
                    swal({
                        title:BaseInfo.BaseInfo.swal.title,
                        type: "success"
                    });
                    setTimeout(function(){window.location.href='/';}, 3000);
                }else{
                    swal(BaseInfo.BaseInfo.swal.Savefail, BaseInfo.BaseInfo.swal.notcorrect, "error");
                }
            }
        });
        return v;
    });
