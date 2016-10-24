/**
 * Created by cs on 2016/1/19.
 */
define('app/usercenter/view/myteachers/MyTeachersListView',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/usercenter/template/myteachers/MyTeachersListView.ejs',
        'i18n!/nls/uchome.js'
    ],
    function(_, Backbone, $,MyTeachersListView,MyTeachers){
        var v = Backbone.View.extend({
            events: {
                'click .myteachers-item-course':'MyTeacher_ItemCourseHistoryClickHandler',
                'click .myteachers-item-more':'MyTeacher_ItemMoreClickHandler',
            },
            initialize:function(options){
                this.eventBus = options.eventBus;
                this.teachers = options.teachers;
                this.views = [];
                this.template = _.template(MyTeachersListView);
            },
            MyTeacher_ItemCourseHistoryClickHandler:function(e){
                var teacherId = $(e.currentTarget).attr("data-id");
                var teacher = this.teachers.findWhere({id: teacherId});
                //0正在授课:1:曾经授课
                var stateType = teacher.attributes.state.type;
                this.eventBus.trigger('myTeachers-showCourseHistoryInfo', teacherId,stateType);
            },
            MyTeacher_ItemMoreClickHandler:function(e){
                var teacherId = $(e.currentTarget).attr("data-id");
                var teacher = this.teachers.findWhere({id: teacherId}).attributes.teacher;
                this.eventBus.trigger('myTeachers-showDetailInfo', teacher);
            },
            render:function(datas){
                var teachers;
                if(datas)
                    teachers = datas;
                else
                    teachers = this.teachers;
                $(this.el).html(this.template({
                    teachers:teachers.toJSON(),
                    locale:MyTeachers
                }));
                return this;
            }
        });
        return v;
    })
