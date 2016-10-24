/**
 * Created by cs on 2016/1/23.
 */
define('app/usercenter/view/myteachers/CourseDetailInfoView',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/usercenter/template/myteachers/CourseHistoryInfoView.ejs',
        'i18n!/nls/uchome.js',

        'jquery.validate'
    ],
    function(_, Backbone, $, tmpl,MyTeachers){
        var v = Backbone.View.extend({
            events:{
                'click .btn-close':'closeView_handler'
            },
            initialize:function(options){
                if (options.hasOwnProperty('eventBus')){
                    this.eventBus = options.eventBus;
                }
                this.courses = options.courses;
                this.template = _.template(tmpl);

                this.elems = {
                    'close':'.btn-close'
                }
            },
            render:function(courses){
                if(courses)
                    this.courses = courses;
                $(this.el).html(this.template({
                    courses:this.courses,
                    locale:MyTeachers
                }));
                return this;
            },
            save:function(){

            },
            cancel:function(){

            },
            closeView_handler:function(){
                this.remove();
            }
        });
        return v;
    })
