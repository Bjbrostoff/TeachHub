/**
 * Created by xiaoguo on 16/1/7.
 */
define('app/searchc/view/CourseInfoDetailView',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/searchc/template/CourseInfoDetailView.ejs',

        'app/searchc/model/CourseDetailModel',
        'i18n!/nls/uchome.js',

        'sweetalert',

        'jquery.slimscroll'
    ],
    function(_, Backbone, $, tmpl,
             CourseDetailModel,MyCourse){
        var v = Backbone.View.extend({
            events:{
                'click .course-detail-close':'closeView_handler',
                'click .searchc-course-signed-up':'courseSignedUp',
                'click .searchc-course-fav-mark':'courseFavMark'
            },
            initialize:function(options){

                this.template = _.template(tmpl);

                this.elems = {

                };

                this.eventNames = {
                    'signUpComplete':'course-sign-up-complete',
                    'favMarkComplete':'course-fav-mark-complete'
                }

                this.model = new CourseDetailModel();
                this.model.on(this.eventNames.signUpComplete, this._signUpComplete, this);
                this.model.on(this.eventNames.favMarkComplete, this._favMarkComplete, this);
            },
            render:function(json){
                $(this.el).html(this.template({
                    course:json,
                    locale:MyCourse
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
            courseSignedUp:function(){
                this.model.courseSignUp();
            },
            _signUpComplete:function(json){
                if (!json.state){
                    swal({
                        title:json.msg
                    })
                }else{
                    swal({
                        title:json.msg
                    })
                }
            },
            courseFavMark:function(){
                this.model.courseFavMark();
            },
            _favMarkComplete:function(json){
                if (!json.state){
                    swal({
                        title:json.msg
                    })
                }else{
                    swal({
                        title:json.msg
                    })
                }
            }
    });
        return v;
    })
