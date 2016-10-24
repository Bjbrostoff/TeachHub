/**
 * Created by cs on 2016/1/30.
 */
/**
 * Created by cs on 2016/1/27.
 */
define('app/usercenter/view/mystudents/MyStudentsFilterView',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/usercenter/template/mystudents/MyStudentsFilterView.ejs'
    ],
    function(_, Backbone, $,MyStudentFilterView){
        var v = Backbone.View.extend({
            events: {
                'click .mystudent-item':'MyStudent_ItemclickHandler'
            },
            initialize:function(options){
                this.eventBus = options.eventBus;
                this.views = [];
                this.filters = options.filters;
                this.template = _.template(MyStudentFilterView);
            },
            MyTeacher_ItemclickHandler:function(e){
                var id = $(e.currentTarget).attr("data-id");
                var student = this.teachers.findWhere({_id: id});
                //0正在授课:1:曾经授课
                var stateType = student.attributes.state.type;
                this.eventBus.trigger('myStudents-showDetailInfo', id,stateType);
            },
            render:function(){
                $(this.el).html(this.template({
                    filters:this.filters.toJSON()
                }));
                return this;
            }
        });
        return v;
    })