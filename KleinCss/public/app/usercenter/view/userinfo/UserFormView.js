/**
 * Created by Administrator on 2016/2/18.
 */
define('app/usercenter/view/userinfo/UserFormView',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/usercenter/template/userinfo/UserFormView.ejs',
        'app/usercenter/view/userinfo/BaseModalView',
        'app/usercenter/model/BaseInfoModel',
        'app/map/view/MapView',
        'app/usercenter/view/userinfo/WorkExp',
        'i18n!/nls/uchome.js',

        'jquery.validate',
        'bootstrap-datepicker',
        'sweetalert'

    ],
    function(_, Backbone, $, tmpl, BaseModalView, BaseinfoModel, MapView,WorkExp,BaseInfo){
        var v = Backbone.View.extend({
            events:{
                'click #baseinfo-save-btn':'baseinfo_saveHandler',
                'click #baseinfo-modifycode-btn':'baseinfo_editPwdHandler',
                'click .userinfo-pin-locate':'pinLocate_clickHandler',
                'click #userFormView_newWorkExp_Add':"new_workexp_add",
                'click #userFormView_newWorkExp_remove':"remove_workex_dd"
            },
            initialize:function(option){
                // this.eventBus = option.eventBus;
                this.template = _.template(tmpl);
                this.views = {};
                this.eventBus = option.eventBus;
                this.models = {

                };
                this.coords = {};
                this.models.baseinfoModel = new BaseinfoModel();
                this.elems = {
                    'userForm':'#baseinfo-userform-field',
                    'modifyBtn':'#baseinfo-modifycode-btn',
                    'mapView':'#userinfo-form-map-container',
                    'coord':'.useinfo-form-field[name="locate"]'
                }
                this.model.on("add_rows",this.add_workex_dd,this);
            },
            render:function(resp,coords){
                this.lat = coords.latitude;
                this.lng = coords.longitude;
                //this.setValidate();
                if( resp.userinfo.tcredid){
                    this.tcredid = resp.userinfo.tcredid;
                }
                $(this.el).html(this.template({data:resp,locale:BaseInfo}));

                return this;
            },
            setValidate:function(){
                $.extend($.validator.messages, {
                    required: "必选字段",
                    email: "请输入正确格式的电子邮件,如:XXX@163.com",
                    number: "请输入合法的数字",
                    equalTo: "请再次输入相同的值",
                    maxlength: jQuery.validator.format("请输入一个 长度最多是 {0} 的字符串"),
                    minlength: jQuery.validator.format("请输入一个 长度最少是 {0} 的字符串"),
                    max: jQuery.validator.format("请输入一个最大为{0} 的值"),
                    min: jQuery.validator.format("请输入一个最小为{0} 的值")
                });
                $(this.elems.userForm).validate({
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
                this.updateModel = new BaseinfoModel();
                var form = document.getElementById("baseinfo-userform-field");
                if(form.elements.length>8){
                    var data ={
                        'name':$("#baseinfo-userform-name").val(),
                        'sex':$("#baseinfo-userform-sex").val(),
                        'age':$("#baseinfo-userform-age").val(),
                        'email':$("#baseinfo-userform-email").val(),
                        'phone':$("#baseinfo-userform-phone").val(),
                        'birth':$("#baseinfo-userform-birth").val(),
                        'city':$("#baseinfo-userform-city").val(),
                        'nationality':$("#baseinfo-userform-nationality").val(),
                        'lat':this.lat,
                        'lng':this.lng,
                        'tcredinfo':{
                            '_id':this.tcredid,
                            'mothertongue':$("#baseinfo-userform-nativelanguage").val(),
                            'skilledcourse':$("#baseinfo-userform-goodcurriculum").val(),
                            'almaMater':$("#baseinfo-userform-almamater").val(),
                            'currentAgency':$("#baseinfo-userform-currentagency").val(),
                            'language':$("#baseinfo-userform-language").val(),
                            'info':$("#baseinfo-userform-personalinfo").val()
                        }
                    };
                }else{
                    var data ={
                        'name':$("#baseinfo-userform-name").val(),
                        'sex':$("#baseinfo-userform-sex").val(),
                        'age':$("#baseinfo-userform-age").val(),
                        'email':$("#baseinfo-userform-email").val(),
                        'phone':$("#baseinfo-userform-phone").val(),
                        'birth':$("#baseinfo-userform-birth").val(),
                        'city':$("#baseinfo-userform-city").val(),
                        'nationality':$("#baseinfo-userform-nationality").val(),
                        'lat':this.lat,
                        'lng':this.lng
                    };
                }


                this.updateModel.set(data);
                this.updateModel.on(this.updateModel.eventNames['updateComplete'],this._updateModel, this);
                this.updateModel.saveChanges(data);
            },
            getFormData:function(){
                var form = document.getElementById("baseinfo-userform-field");
                var data ={
                    'name':form.elements[0].value,
                    'sex':form.elements[1].value,
                    'age':form.elements[2].value,
                    'email':form.elements[3].value,
                    'phone':form.elements[4].value,
                    'birth':form.elements[5].value,
                    'city':form.elements[6].value,
                    'nationality':form.elements[7].value,
                    'lat':this.lat,
                    'lng':this.lng
                };
            },
            baseinfo_editPwdHandler:function() {
                var modal = new BaseModalView({
                    modalData: {
                        title: BaseInfo.BaseInfo.tip
                    }
                });
                modal.show({
                    show: true
                });
                modal.setValidate();

            },
            datepicker_handler:function(){

                $('#baseinfo-userform-birth').datepicker({
                    todayBtn: "linked",
                    keyboardNavigation: true,
                    forceParse: false,
                    calendarWeeks: true,
                    autoclose: true,
                    todayHighlight : true
                });
            },
            _updateModel:function(json){
                if (json.state == true){
                    alert(BaseInfo.BaseInfo.swal.Savedsuccessfully);
                    // swal({
                    //     title: BaseInfo.BaseInfo.swal.Savedsuccessfully,
                    //     type: "success"
                    // });
                }else{
                    //swal(BaseInfo.BaseInfo.swal.Savefail,BaseInfo.BaseInfo.swal.Pleasecheckyourinputiscorrect, "error");
                    alert(BaseInfo.BaseInfo.swal.Savefail,BaseInfo.BaseInfo.swal.Pleasecheckyourinputiscorrect);
                }
            },
            createMapView:function(params){
                this.mapView = new MapView({
                    el:'#baseinfo-form-map-container',
                    mapDomId:'baseinfo-form-map'

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
            },
            new_workexp_add:function(){
                if(this.views.WorkExpView){
                    this.views.WorkExpView.remove();
                }
                this.views.WorkExpView = new WorkExp({model:this.model});
                this.views.WorkExpView.render();
                this.views.WorkExpView.buildDialog();

            },
            add_workex_dd:function(rowData){
                if(rowData != undefined){
                    $("#work_exp_tbody").prepend(" <tr id='"+rowData.id+"'><td>"+rowData.location+"</td><td>"+rowData.organization+"</td>"
                        +   " <td>"+rowData.dates+"</td>"
                        +"<td>"+rowData.jobs+"</td>"

                        +"   <td><a class='fa fa-minus-square''  href='javaScript:;' attr-id='"+rowData.id+"' id='userFormView_newWorkExp_remove' ></a></td></tr>");
                }
            },
            remove_workex_dd:function(eve){
                var id =  $(eve.target).attr("attr-id");
                $.post("/users/removeWorkExp",{id:id},function(data){
                    if(data.code == '200'){
                        alert(BaseInfo.BaseInfo.swal.Savedsuccessfully);
                        $("#"+id).remove();
                    }else{
                        alert(BaseInfo.BaseInfo.swal.Savefail)
                    }

                })
                ;

            }
        });
        return v;
    });