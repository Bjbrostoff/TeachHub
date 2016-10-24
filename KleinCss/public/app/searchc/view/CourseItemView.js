
define('app/searchc/view/CourseItemView',
[
    'underscore',
    'backbone',
    'jquery',
    'text!/app/searchc/template/CourseItemView.ejs',
    'i18n!/nls/SearchCourse.js'
],
function(_, Backbone, $, tmpl,
         SearchCourse){
    var v = Backbone.View.extend({
        events:{
            'click .course-list':'courseInfoBox_clickHandler',
            'click #teacher-name-btn':'teachername_clickHandler',
            'click #agency-name-btn':'agencyname_clickHandler'
        },
        initialize:function(options){
            this.template = _.template(tmpl);
            this.els = {
                'agencynamebtn': '#agency-name-btn'
            };
        },
        render:function(){
            $(this.el).html(this.template(
                {
                    course:this.model.toJSON(),
                    courseitem:SearchCourse.courseitem
                }));
            return this;
        },
        courseInfoBox_clickHandler:function(evt){
            //console.log("courseInfoBox_clickHandler");
            this.trigger('open-profile-view', {courseid:this.model.attributes.courseId});
        },
        teachername_clickHandler:function(evt){
            window.location.href = '/teachers#profile/'+this.model.toJSON().teacherid;
        },
        agencyname_clickHandler:function(evt){
            var id = $(this.els.agencynamebtn).attr('agencyid');
            window.location.href = '/agencies#profile/'+id;
        }
    });
    return v;
})
