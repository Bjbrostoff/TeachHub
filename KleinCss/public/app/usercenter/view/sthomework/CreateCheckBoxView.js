/**
 * Created by Administrator on 2016/1/10.
 */
define('app/usercenter/view/sthomework/CreateCheckBoxView',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/usercenter/template/sthomework/CreateCheckBoxView.ejs',
        'app/usercenter/model/sthomework/CreateCheckBoxModel',
        'i18n!/nls/uchome.js',
    ],
    function(_, Backbone, $, tmpl, CreateCheckBoxModel,StudentHomework){
        var v = Backbone.View.extend({
            //el:'.sthomework-checkbox-field',
            events:{
                'click #sthomework-editview-submit':'sthCheckedSubmit_handler'
            },
            initialize:function(options){
                //if (options.hasOwnProperty('eventBus')){
                //    this.eventBus = options.eventBus;
                //}
                this.template = _.template(tmpl);
                this.views = {};
                this.elems = {};
                this.models = {};
                this.models.createcheckboxmodel = new CreateCheckBoxModel();
            },
            render:function(resp){
                $(this.el).html(this.template({
                    data:resp,
                    locale:StudentHomework
                }));
                this.data = resp;
                return this;
            },
            closeBoxView_handler:function(){
                this.remove();
            },
            sthCheckedSubmit_handler:function(){
                this.updateHwModel = new CreateCheckBoxModel();
                var homeworkscores = document.getElementById("sth-sthw-getscores");
                //var homeworkcontent = document.getElementById("sth-checkhwbox-homeworkcontent");
                //var a = homeworkcontent[0];
                //var content = $('.summernote').eq(3).parent().find(".note-editable").html();
                var content = $('#sth-checkhwbox-homeworkcontent').parent().find(".note-editable").html();
                var subdata = {
                    id:this.data._id,//hwrel的di
                    hwscores:homeworkscores[1].value,
                    hwcontent:content,
                    hwcheckdate:new Date()

                };
                this.updateHwModel.set(subdata);
                this.updateHwModel.on(this.updateHwModel.eventNames['markingHomeworkComplete'],this._updateHwModel, this);
                this.updateHwModel.markingHomeworkSaveData(subdata);
            },
            _updateHwModel:function(json){
                if (json.state == true){
                    swal({
                        title: StudentHomework.StudentHomework.Submittedsuccessfully,//"提交成功"
                        type: "success"
                    });
                }else{
                    swal(StudentHomework.StudentHomework.SubmissionFailed, StudentHomework.StudentHomework.CheckjobScore, "error");
                }
            }
        });
        return v;
    });
