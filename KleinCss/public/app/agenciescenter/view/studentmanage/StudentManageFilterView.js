define('app/agenciescenter/view/studentmanage/StudentManageFilterView',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/agenciescenter/template/studentmanage/StudentManageFilterView.ejs',
        'i18n!/nls/achome.js',
    ],
    function(_, Backbone, $,tmpl,StudentManage){
        var v = Backbone.View.extend({
            events: {
                'click .mystudent-item':'MyStudent_ItemclickHandler'
            },
            initialize:function(options){
                this.eventBus = options.eventBus;
                this.views = [];
                this.filters = options.filters;
                this.template = _.template(tmpl);
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
                    filters:this.filters.toJSON(),
                    locale:StudentManage
                }));
                return this;
            }
        });
        return v;
    })