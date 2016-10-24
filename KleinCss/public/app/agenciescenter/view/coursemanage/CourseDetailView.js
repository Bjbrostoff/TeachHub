define('app/agenciescenter/view/coursemanage/CourseDetailView',
[
    'underscore',
    'backbone',
    'jquery',

    'text!/app/agenciescenter/template/coursemanage/CourseDetailView.ejs'
],
function(_, Backbone, $, tmpl){
    var v = Backbone.View.extend({
        events:{
            'click .course-manage-course-detail-close':'courseDetailView_clickHandler'
        },
        initialize:function(){
            this.template = _.template(tmpl);
        },
        render:function(){
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },
        courseDetailView_clickHandler:function(){
            this.remove();
        }
    });
    return v;
})