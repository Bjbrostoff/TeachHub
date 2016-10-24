define('app/searcht/view/TeacherItemView',
[
    'underscore',
    'backbone',
    'jquery',
    'text!/app/searcht/template/TeacherItemView.ejs',
    'i18n!/nls/SearchTeacher.js'
],
function(_, Backbone, $, tmpl,
         SearchTeacher){
    var v = Backbone.View.extend({
        events:{
            'click #teacher-info-box':'teacherInfoBox_clickHandler',
            'click #agency-name-btn':'agencyname_clickHandler'
        },
        initialize:function(options){
            this.template = _.template(tmpl);
            this.els = {
                'agencynamebtn': '#agency-name-btn'
            };
        },
        render:function(){
            $(this.el).html(this.template({
                teacheritem:SearchTeacher.teacheritem,
                teacher:this.model.toJSON()
        }));
            return this;
        },
        teacherInfoBox_clickHandler:function(evt){
            //console.log("teacherInfoBox_clickHandler");
            this.trigger('open-profile-view', {userid:this.model.attributes.uuid});
            //this.trigger('teacher-did-collect', {});
        },
        agencyname_clickHandler:function(evt){
            var id = $(this.els.agencynamebtn).attr('agencyid');
            window.location.href = '/agencies#profile/'+id;
        }
    });
    return v;
})
