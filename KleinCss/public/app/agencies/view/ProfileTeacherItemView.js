/**
 * Created by xiaoguo on 16/3/8.
 */

define('app/agencies/view/ProfileTeacherItemView',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/agencies/template/ProfileTeacherItemView.ejs',
        'app/agencies/model/ProfileTeacherModel',
        'i18n!/nls/SearchAgency.js',
        'sweetalert'
    ],
    function(_, Backbone, $, tmpl,
             ProfileTeacherModel,
             SearchAgency){
        var v = Backbone.View.extend({
            events:{
                'click .teacher-img':'teacherimg_clickHandler'
            },
            initialize:function(options){

                this.template = _.template(tmpl);
                this.els = {
                    'teacherimg':'.teacher-img'
                }

                this.model = new ProfileTeacherModel();
            },

            render:function(){
                $(this.el).html(this.template(
                    {
                        teacher:this.model.toJSON(),
                        profileteacheritem:SearchAgency.profileteacheritem
                    }));
                return this;
            },

            teacherimg_clickHandler: function(){
                var teacherid = $(this.els.teacherimg).attr('teacherid');
                //console.log(teacherid);
                window.location.href = '/teachers#profile/'+teacherid;
            }
        });
        return v;
    })
