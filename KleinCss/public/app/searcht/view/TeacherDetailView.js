/**
 * Created by xiaoguo on 16/1/7.
 */
define('app/searcht/view/TeacherDetailView',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/searcht/template/TeacherDetailView.ejs',

        'app/searcht/model/TeacherDetailModel',

        'i18n!/nls/SearchTeacher.js',

        'jquery.slimscroll'

    ],
    function(_, Backbone, $, tmpl,
             TeacherDetailModel,SearchTeacher){
        var v = Backbone.View.extend({
            events:{
                'click .teacher-detail-close':'closeView_handler',
                'click #profile-button':'openProfileView_handler'
            },
            initialize:function(options){

                this.template = _.template(tmpl);

                this.els = {

                };
                this.model = new TeacherDetailModel();

            },
            render:function(json){
                //console.log(SearchTeacher);
                $(this.el).html(this.template({
                    teacherdetail:SearchTeacher.teacherdetail,
                    teacher:json
                }));
                this.model.set(json);
                return this;
            },

            closeView_handler:function(){
                //console.log('11');
                this.remove();
            },
            addSlimScroll:function(){
                $('.full-height-scroll').slimscroll({
                    height: '100%'
                });
            },
            openProfileView_handler:function(){
                //console.log(this.model.attributes);
                this.trigger('open-profile-view', {userid:this.model.attributes.uuid});
            }
    });
        return v;
    })
