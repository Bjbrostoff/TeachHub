define('app/usercenter/view/coursemanage/CourseDetailView',
[
    'underscore',
    'backbone',
    'jquery',

    'text!/app/usercenter/template/coursemanage/CourseDetailView.ejs',
    'i18n!/nls/uchome.js'
],
function(_, Backbone, $, tmpl,localName){
    var v = Backbone.View.extend({
        events:{
            'click .course-manage-course-detail-close':'courseDetailView_clickHandler'
        },
        initialize:function(options){
            this.template = _.template(tmpl);
            this.isproxy = options.isproxy || false;
        },
        render:function(){
            this.$el.html(this.template({
                data:this.isproxy?this.model:this.model.toJSON(),
                local:localName
            }

            ));
            return this;
        },
        courseDetailView_clickHandler:function(){
            this.remove();
        }
    });
    return v;
})