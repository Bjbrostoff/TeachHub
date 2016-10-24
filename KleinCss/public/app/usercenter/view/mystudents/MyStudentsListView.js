/**
 * Created by cs on 2016/1/27.
 */
define('app/usercenter/view/mystudents/MyStudentsListView',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/usercenter/template/mystudents/MyStudentsListView.ejs',
        'i18n!/nls/uchome.js'
    ],
    function(_, Backbone, $,MyStudentsListView,MyStudents){
        var v = Backbone.View.extend({
            events: {
                'click .mystudents-item-course':'MyStudent_ItemCourseHistoryClickHandler',
                'click .mystudents-item-more':'MyStudent_ItemMoreClickHandler',
            },
            initialize:function(options){
                this.eventBus = options.eventBus;
                this.students = options.students;
                this.views = [];
                this.template = _.template(MyStudentsListView);
            },
            MyStudent_ItemCourseHistoryClickHandler:function(e){
                var StudentId = $(e.currentTarget).attr("data-id");
                var student = this.teachers.findWhere({id: StudentId});
                //0正在授课:1:曾经授课
                var stateType = student.attributes.state.type;
                this.eventBus.trigger('myStudents-showCourseHistoryInfo', StudentId,stateType);
            },
            MyStudent_ItemMoreClickHandler:function(e){
                var StudentId = $(e.currentTarget).attr("data-id");
                var student = this.students.findWhere({id: StudentId}).attributes.student;
                this.eventBus.trigger('myStudents-showDetailInfo', student);
            },
            render:function(datas){
                var students;
                if(datas)
                    students = datas;
                else
                    students = this.students;
                $(this.el).html(this.template({
                    students:students.toJSON(),
                    locale:MyStudents
                }));
                return this;
            }
        });
        return v;
    })