/**
 * Created by Administrator on 2016/1/19.
 */
define('app/usercenter/view/sthomework/CreateArrangeHomeworkView',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/usercenter/template/sthomework/CreateArrangeHomeworkView.ejs',
        'app/usercenter/model/sthomework/CreateArrangeHomeworkModel',
        'i18n!/nls/uchome.js',
        'summernote'
    ],
    function(_, Backbone, $, tmpl, CreateArrangeHomeworkModel,StudentHomework){
        var v = Backbone.View.extend({
            events:{
                'click #sth-homework-release':"sthReleaseHandler"

            },
            initialize:function(options){
                this.template = _.template(tmpl);
                this.elems = {
                }
            },
            render:function(resp){
                var hwshowinsummernote = {
                    content:""
                };
                resp.courseName.text = hwshowinsummernote;

                $(this.el).html(this.template({
                    data:resp.courseName,
                    locale:StudentHomework
                }));
                this.course = resp.courseName;
                this.userid = resp.userid;
                return this;
            },
            sthReleaseHandler:function(){
                this.arrangeHwModel = new CreateArrangeHomeworkModel();
                var course = this.course;
                var user = this.userid;

                var content = $('.summernote').parent().find(".note-editable").html();
                //var hwcontent = $('#summernotereleasehomework').code;
                //var homeworktitle = document.getElementById("release-homework-title");
                //var homeworkcoursename = $("#sth-releasehomework-coursename").val();
                var courseID =  $("#sth-releasehomework-coursename").val();//课程ID

                var student ;//该课程下学生

               // var courseid = "1104f141-64f0-47d5-a058-cab2c99c9627";
               //var stuarr =  user[courseid];
               // console.log(stuarr);
               //for(var i=0;i<course.length;i++){
               //    if( course[i].name == homeworkcoursename){
               //        courseID = course[i]._id;//被选中课程的ID
                student = user[courseID];//该课程对应的学生
               //    }
               //}

                var studentID =[];//该课程对应的学生的ID数组
                for(var k=0;k<student.length;k++){
                    studentID.push(student[k].userid._id);
                }
                var homeworktitle = $('#sth-releasehomework-title').val();

                var releaseData = {
                    useridarray:studentID,
                    courseid:courseID,
                    hwtitle:homeworktitle,
                    hwcontent:content
                };
                console.log(releaseData);
                this.arrangeHwModel.set(releaseData);
                this.arrangeHwModel.on(this.arrangeHwModel.eventNames['homeworkReleaseComplete'],this._arrangeHwModel, this);
                this.arrangeHwModel.arrangeHomeworkRelease(releaseData);
            },
            _arrangeHwModel:function(json){
                if (json.state == true){
                    alert(StudentHomework.StudentHomework.Successfullyposted);
                    // swal({
                    //     title: StudentHomework.StudentHomework.Successfullyposted,//"发布成功"
                    //     type: "success"
                    // });
                }else{
                    alert(StudentHomework.StudentHomework.Publishfailed, StudentHomework.StudentHomework.checkinformation);
                    //swal(StudentHomework.StudentHomework.Publishfailed, StudentHomework.StudentHomework.checkinformation, "error");
                }
            },
            save:function(){

            },
            cancel:function(){

            },
            closeView_handler:function(){
                this.remove();
            }
        });
        return v;
    });