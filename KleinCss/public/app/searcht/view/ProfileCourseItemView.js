/**
 * Created by xiaoguo on 16/1/30.
 */

define('app/searcht/view/ProfileCourseItemView',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/searcht/template/ProfileCourseItemView.ejs',
        'app/searcht/model/ProfileCourseModel',
        'i18n!/nls/SearchTeacher.js',
        'sweetalert'
    ],
    function(_, Backbone, $, tmpl,
             ProfileCourseModel,SearchTeacher){
        var v = Backbone.View.extend({
            events:{
                'click .searchc-course-signed-up':'courseSignedUp',
                'click .searchc-course-fav-mark':'courseFavMark'
            },
            initialize:function(options){

                this.template = _.template(tmpl);
                this.eventNames = {
                    'signUpComplete':'course-sign-up-complete',
                    'favMarkComplete':'course-fav-mark-complete'
                }

                this.model = new ProfileCourseModel();
                this.model.on(this.eventNames.signUpComplete, this._signUpComplete, this);
                this.model.on(this.eventNames.favMarkComplete, this._favMarkComplete, this);
            },

            render:function(){
                $(this.el).html(this.template(
                    {
                        course:this.model.toJSON(),
                        profilecourseitem:SearchTeacher.profilecourseitem
                    }));
                return this;
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
