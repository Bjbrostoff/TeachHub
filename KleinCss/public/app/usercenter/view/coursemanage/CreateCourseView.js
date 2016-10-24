define('app/usercenter/view/coursemanage/CreateCourseView',
[
    'underscore',
    'backbone',
    'jquery',
    'text!/app/usercenter/template/coursemanage/CreateCourseView.ejs',

    'app/usercenter/view/coursemanage/GenerateMsgModalView',

    'app/usercenter/model/coursemanage/CourseModel',
    'i18n!/nls/uchome.js',

    'sweetalert',

    'jquery.validate'

],
function(_, Backbone, $, tmpl,
    GenerateMsgModalView,
         CourseModel,localName){
    var v = Backbone.View.extend({
        events:{
            'click .course-manage-generate-close':'closeView_handler',
            'click .course-manage-generate-cancel':'closeView_handler',
            'click .course-manage-generate-save':'courseGenerate_saveHandler'
        },
        initialize:function(options){
            if (options.hasOwnProperty('eventBus')){
                this.eventBus = options.eventBus;
            }
            this.template = _.template(tmpl);

            this.models = {};

            this.elems = {
                'close':'.course-mangage-generate-close',
                'form':'#course-manage-generate-form',
                'nameField':'.course-manage-generate-course[name="name"]',
                'introductionField':'.course-manage-generate-course[name="introduction"]',
                "infoField":'.course-manage-generate-course[name="info"]',
                "catalogField":'.course-manage-generate-course[name="catalog"]',
                "billingField":'.course-manage-generate-course[name="billing"]',
                "priceField":'.course-manage-generate-course[name="price"]',
                "methodField":'.course-manage-generate-course[name="method"]',
                "modeField":'.course-manage-generate-course[name="mode"]',
                "classroomField":'.course-manage-generate-course[name="classroom"]',
                "rangemaxField":'.course-manage-generate-course[name="range-max"]',
                "rangeminField":'.course-manage-generate-course[name="range-min"]',
                "imageField":'.course-manage-generate-course[name="image"]',
                'openDialog':'#course-manage-open-dialog'
            };

            this.eventNames = {
                'generate':'course-manage-generate-course',
                'saveComplete':'manage-course-generate-complete'
            };
            this.views={};

            this.models.courseModel = new CourseModel();

            this.models.courseModel.on(this.eventNames.saveComplete, this._courseSaveComplete, this);
        },
        render:function(){
            $(this.el).html(this.template({
                local:localName.CourseManage.createCourse,
                fields:this.model
            }));
            return this;
        },
        save:function(){

        },
        cancel:function(){

        },
        setValidate:function(){
            //$.extend($.validator.messages, {
            //    required: "必选字段",
            //    remote: "请修正该字段",
            //    email: "请输入正确格式的电子邮件",
            //    url: "请输入合法的网址",
            //    date: "请输入合法的日期",
            //    dateISO: "请输入合法的日期 (ISO).",
            //    number: "请输入合法的数字",
            //    digits: "只能输入整数",
            //    creditcard: "请输入合法的信用卡号",
            //    equalTo: "请再次输入相同的值",
            //    accept: "请输入拥有合法后缀名的字符串",
            //    maxlength: jQuery.validator.format("请输入一个 长度最多是 {0} 的字符串"),
            //    minlength: jQuery.validator.format("请输入一个 长度最少是 {0} 的字符串"),
            //    rangelength: jQuery.validator.format("请输入 一个长度介于 {0} 和 {1} 之间的字符串"),
            //    range: jQuery.validator.format("请输入一个介于 {0} 和 {1} 之间的值"),
            //    max: jQuery.validator.format("请输入一个最大为{0} 的值"),
            //    min: jQuery.validator.format("请输入一个最小为{0} 的值")
            //});
            $(this.elems.form).validate({
                rules: {
                    name: {
                        required: true,
                        maxlength:100,
                        minlength:2
                    },
                    price:{
                        required:true,
                        number:true,
                        max:999999,
                        min:0
                    },
                    catalog:{
                        required:true
                    },
                    introduction:"required"
                }
            });
        },
        closeView_handler:function(){
            this.remove();
        },
        courseGenerate_saveHandler:function(){
            var crs = {
                name:$(this.elems.nameField).val(),

                introduction:$(this.elems.introductionField).val(),
                info:$(this.elems.infoField).val(),
                catalog:$(this.elems.catalogField).val(),
                billing:{
                    fvalue:$(this.elems.billingField).val(),
                    fdetail:$(this.elems.billingField+' option:selected').text()
                },
                price:$(this.elems.priceField).val(),
                method:{
                    type:$(this.elems.methodField).val(),
                    name:$(this.elems.methodField+' option:selected').text()
                },
                classroom:"",
                mode:{
                    type:$(this.elems.modeField).val(),
                    name:$(this.elems.modeField+ ' option:selected').text()
                },
                range:{
                    max:$(this.elems.rangemaxField).val(),
                    min:$(this.elems.rangeminField).val()
                },
                thumbnail:'',
                image:'',
                statelv:{
                    lv:0,
                    type:0,
                    name:localName.CourseManage.createCourse.status
                }
            };
            if($(this.elems.imageField).val() != ''){
                crs.image = $(this.elems.imageField).val();
            }
            this.models.courseModel.verifyAndSave(crs);
        },
        _courseSaveComplete:function(json){
            this.trigger(this.eventNames.saveComplete, json);
            //swal({
               var title=json.msg;
           // });

            if (!this.views.generateMsgModalView) {
                this.views.generateMsgModalView = new GenerateMsgModalView({
                    //eventBus: this.eventBus,
                    //el: this.els.openDialog
                    //title:title
                });
            }
            $(this.elems.openDialog).append(this.views.generateMsgModalView.render(title));

            if (!json.state){

            }else{
                this.remove();
            }


        }
    });
    return v;
})
