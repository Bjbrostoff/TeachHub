define('app/agenciescenter/view/agenciesinfo/AgenciesFormView',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/agenciescenter/template/agenciesinfo/AgenciesFormView.ejs',
        'app/agenciescenter/model/AgenciesFormModel',
        'app/agenciescenter/view/agenciesinfo/AgenciesModalView',
        'app/map/view/MapView',
        'app/usercenter/view/userinfo/WorkExp',
        'i18n!/nls/achome.js',

        'jquery.validate',
        'bootstrap-datepicker',
        'sweetalert'

    ],
    function(_, Backbone, $, tmpl, AgenciesFormModel,AgenciesModalView, MapView,WorkExp,AgencyInfo){
        var v = Backbone.View.extend({
            events:{
                'click #agencies-save-btn':'baseinfo_saveHandler',
                'click #agencies-modifycode-btn':'agenciesInfo_editPwdHandler',
                'click .agenciesinfo-pin-locate':'pinLocate_clickHandler'
            },
            initialize:function(option){
                // this.eventBus = option.eventBus;
                this.template = _.template(tmpl);
                this.views = {};
                this.eventBus = option.eventBus;
                this.models = {

                };
                this.coords = {};
                this.models.agenciesFormModel = new AgenciesFormModel();
                this.elems = {
                    'agenciesform':'#baseinfo-agenciesform-field',
                    'modifyBtn':'#baseinfo-modifycode-btn',
                    'mapView':'#agenciesinfo-form-map-container'
                   // 'coord':'.useinfo-form-field[name="locate"]'
                }
                this.model.on("add_rows",this.add_workex_dd,this);
            },
            render:function(resp,coords){
                this.lat = coords.latitude;
                this.lng = coords.longitude;
                //this.setValidate();
                $(this.el).html(this.template({data:resp.data, locale:AgencyInfo}));

                return this;
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
                    equalTo: "请再次输入相同的值",
                    accept: "请输入拥有合法后缀名的字符串",
                    maxlength: jQuery.validator.format("请输入一个 长度最多是 {0} 的字符串"),
                    minlength: jQuery.validator.format("请输入一个 长度最少是 {0} 的字符串"),
                    rangelength: jQuery.validator.format("请输入 一个长度介于 {0} 和 {1} 之间的字符串"),
                    range: jQuery.validator.format("请输入一个介于 {0} 和 {1} 之间的值"),
                    max: jQuery.validator.format("请输入一个最大为{0} 的值"),
                    min: jQuery.validator.format("请输入一个最小为{0} 的值")
                });
                $(this.elems.agenciesform).validate({
                    rules: {
                        password: {
                            required: true,
                            minlength: 6
                        },
                        email:{
                            required: true,
                            email: true
                        },
                        age:{
                            required:true,
                            minlength:1,
                            maxlength:3

                        },
                        name:{
                            required:true,
                            minlength:1,
                            maxlength:20
                        },
                        phone:{
                            required:true,
                            number: true,
                            minlength:11,
                            maxlength:11
                        },
                        city:{
                            required:true,
                            minlength:1,
                            maxlength:20
                        },
                        nationality:{
                            required:true,
                            minlength:1,
                            maxlength:30
                        },
                        mothertongue:{
                            minlength:1,
                            maxlength:20
                        },
                        skilledcourse:{
                            minlength:1,
                            maxlength:20
                        },
                        language:{
                            minlength:1,
                            maxlength:20
                        }
                    }
                });
                //this.datepicker_handler();
            },
            baseinfo_saveHandler:function(evt){
                this.updateModel = new AgenciesFormModel();
                var agenciesform = document.getElementById("baseinfo-agenciesform-field");
                var data ={
                    'name':$("#baseinfo-agenciesform-name").val(),
                    'email':$("#baseinfo-agenciesform-email").val(),
                    'phone':$("#baseinfo-agenciesform-phone").val(),
                    'city':$("#baseinfo-agenciesform-city").val(),
                    'agenciesinfo':$("#baseinfo-agenciesform-agenciesinfo").val(),
                    'lat':this.lat,
                    'lng':this.lng
                };
                console.log("------data-----");
                console.log(data);
                this.updateModel.set(data);
                this.updateModel.on(this.updateModel.eventNames['updateComplete'],this._updateModel, this);
                this.updateModel.saveChanges(data);
            },
            agenciesInfo_editPwdHandler:function() {
                var modal = new AgenciesModalView({
                    modalData: {
                        title: AgencyInfo.AgencyInfo.tip
                    }
                });
                modal.show({
                    show: true
                });
                modal.setValidate();

            },
            _updateModel:function(json){
                if (json.state == true){
                    alert(AgencyInfo.AgencyInfo.swal.Savedsuccessfully);
                    // swal({
                    //     title: AgencyInfo.AgencyInfo.swal.Savedsuccessfully,
                    //     type: "success"
                    // });
                }else{
                    //swal( AgencyInfo.AgencyInfo.swal.Savefail, AgencyInfo.AgencyInfo.swal.Pleasecheckyourinputiscorrect, "error");
                    alert(AgencyInfo.AgencyInfo.swal.Savefail, AgencyInfo.AgencyInfo.swal.Pleasecheckyourinputiscorrect);
                }
            },
            createMapView:function(params){
                this.mapView = new MapView({
                    el:'#agencies-form-map-container',
                    mapDomId:'agencies-form-map'
                });
                $(this.elems.mapView).html(this.mapView.render(params).el);

                this.mapView.on('pin-my-locate-complete', this._pinComplete, this);

                this.mapView.locateMe();
            },
            pinLocate_clickHandler:function(){
                //console.log('pin');
                if (!this.mapView){
                    return;
                }

                this.mapView.beginPin();
            },
            _pinComplete:function(coord){
                //$(this.elems.coord).val(coord.lat+','+coord.lng);
                this.lat = coord.lat;
                this.lng = coord.lng;
            }
        });
        return v;
    });