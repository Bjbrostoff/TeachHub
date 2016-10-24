define('app/usercenter/view/coursemanage/CourseTiledView',
[
    'underscore',
    'backbone',
    'jquery',

    'text!/app/usercenter/template/coursemanage/CourseTiledView.ejs',
    'i18n!/nls/uchome.js'
],
function(_, Backbone, $, tmpl,localName){
    var v = Backbone.View.extend({
        initialize:function(options){
            if (!options.hasOwnProperty('eventBus')){
                this.eventBus = options.eventBus;
            }

            this.template = _.template(tmpl);
        },
        render:function(){
            $(this.el).html(this.template({
                datas:this.collection.toJSON(),
                local:localName.CourseManage.courseList.offCourse
            }));
            return this;
        }
    });
    return v;
})
