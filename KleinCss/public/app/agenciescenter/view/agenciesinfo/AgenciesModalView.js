define('app/agenciescenter/view/agenciesinfo/AgenciesModalView',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/agenciescenter/template/agenciesinfo/AgenciesModalView.ejs',
        'app/agenciescenter/model/agenciesinfo/AgenciesModalModel',
        'i18n!/nls/achome.js',
        'jquery.validate',
        'bootstrap'

    ],
    function (_, Backbone, $, tmpl, AgenciesModalModel,AgencyInfo) {
        var v = Backbone.View.extend({
            id: '#my-modify-modal',
            className: 'modal fade',
            events: {
                'click #agenciesinfo-codesave-btn':'agenciesInfoModal_codeSaveHandler'
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
                    'codeConfirmForm':'#agenciesinfo-codeConfirm-form'
                };
                _.extend(this.options, option);
                this.render();
            },
            render: function () {
                this.$el.html(this.template({title: 'Title',locale:AgencyInfo}));
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
                            equalTo: "#agenciesinfo-newcode-field"
                        }
                    }
                });
            },
            agenciesInfoModal_codeSaveHandler:function(evt){
                this.updateCodeModel = new AgenciesModalModel();
                var form = document.getElementById("agenciesinfo-codeConfirm-form");
                var data ={
                    'oldPassword':form.elements[0].value,
                    'newPassword':form.elements[1].value,
                    'conformPassword':form.elements[2].value
                };
                if(data.newPassword !=data.conformPassword){
                    swal(AgencyInfo.AgencyInfo.swal.Savefail, AgencyInfo.AgencyInfo.swal.Inconsistent, "error");
                }else {
                    this.updateCodeModel.set(data);
                    this.updateCodeModel.on(this.updateCodeModel.eventNames['updateCodeComplete'],this._updateCodeModel, this);
                    this.updateCodeModel.saveCodeChanges(data);
                }

            },
            _updateCodeModel:function(json){
                if (json.state == true){
                    swal({
                        title:AgencyInfo.AgencyInfo.swal.success_tohome,
                        type: "success"
                    });
                    setTimeout(function(){window.location.href='/';}, 3000);
                }else{
                    swal(AgencyInfo.AgencyInfo.swal.Savefail, AgencyInfo.AgencyInfo.swal.notcorrect, "error");
                }
            }
        });
        return v;
    });
