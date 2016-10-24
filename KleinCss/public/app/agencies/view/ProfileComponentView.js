/**
 * Created by xiaoguo on 16/3/8.
 */
define('app/agencies/view/ProfileComponentView',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/agencies/template/ProfileComponentView.ejs',

        'app/agencies/view/ProfileTeacherView',
        'app/agencies/view/ProfileCourseView',
        'i18n!/nls/SearchAgency.js'
    ],
    function(_, Backbone, $, tmpl,
             ProfileTeacherView,
             ProfileCourseView,
             SearchAgency
             ){
        var v = Backbone.View.extend({
            events:{
                'click #agency-teacher-table':'teacherTable_clickHandler',
                'click #agency-course-table':'courseTable_clickHandler'
            },
            initialize:function(options){
                this.template = _.template(tmpl);
                this.elems = {
                    'teachertablebtn':'#agency-teacher-table',
                    'coursetablebtn':'#agency-course-table',
                    'teacherlist': '.agency-teacher-list',
                    'courselist': '.agency-course-list'
                };

                this.profileid = '';

                this.views = {

                };
                this.models = {};

                this.subItems = [];

            },
            setProfileId:function(profileid){
                this.profileid = profileid;
            },
            render: function () {
                $(this.el).html(this.template({profilecomponent:SearchAgency.profilecomponent}));

                return this;
            },

            initSubView: function(){
                this.teacherTable_clickHandler();
            },

            teacherTable_clickHandler: function(){

                if(this.views.courseListView){
                   this.views.courseListView.hide();
                }
                if(this.views.teacherListView){
                    this.views.teacherListView.show();
                }
                this._detectSubView("teacher");
                if($(this.elems.coursetablebtn).hasClass('active')){
                    $(this.elems.coursetablebtn).removeClass('active');
                };
                if(!($(this.elems.teachertablebtn).hasClass('active'))){
                    $(this.elems.teachertablebtn).addClass('active');
                }

            },

            courseTable_clickHandler: function(){

                if(this.views.teacherListView){
                    this.views.teacherListView.hide();
                }
                if(this.views.courseListView){
                    this.views.courseListView.show();
                }
                this._detectSubView("course");
                if($(this.elems.teachertablebtn).hasClass('active')){
                    $(this.elems.teachertablebtn).removeClass('active');
                };
                if(!($(this.elems.coursetablebtn).hasClass('active'))){
                    $(this.elems.coursetablebtn).addClass('active');
                }

            },
            _detectSubView:function(viewname){
                switch (viewname) {
                    case "teacher":
                        if (!this.views.teacherListView){
                            this.views.teacherListView = new ProfileTeacherView();
                            this.views.teacherListView.setProfileId(this.profileid);
                            $(this.elems.teacherlist).append(this.views.teacherListView.render().el);
                            this.views.teacherListView.searchProxyTeachers();
                        }
                        break;
                    case "course":
                        if (!this.views.courseListView){
                            this.views.courseListView = new ProfileCourseView();
                            this.views.courseListView.setProfileId(this.profileid);
                            $(this.elems.courselist).append(this.views.courseListView.render().el);
                            this.views.courseListView.searchProxyCourses();
                        }
                        break;
                }
            },
            _hideAllSubViews:function(){
                var self = this;
                _.each(this.views, function(item){
                    item.hide();
                });
            },

            show: function () {
                this._show();
            },
            hide: function () {
                this._hide();
            },
            _hide: function () {
                $(this.el).css({
                    'display': 'none'
                })
            },
            _show: function () {
                $(this.el).css({
                    'display': 'block'
                });
            },

        });
        return v;
    })
