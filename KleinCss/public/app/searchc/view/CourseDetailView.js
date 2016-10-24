/**
 * Created by xiaoguo on 16/1/7.
 */
define('app/searchc/view/CourseDetailView',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/searchc/template/CourseDetailView.ejs',

        'app/searchc/model/CourseDetailModel',
        'i18n!/nls/SearchCourse.js',
        'sweetalert'

    ],
    function(_, Backbone, $, tmpl,
             CourseDetailModel,
             SearchCourse){
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

                this.profileid = '';

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
            _removeAllItem: function(){
                for (var i = 0; i < this.subItems.length; i++){
                    var item = this.subItems[i];
                    item.remove();
                }
                this.subItems = [];
            },
            setProfileId:function(profileid){
                this.profileid = profileid;
            },
            render:function(json){
                //console.log(this.profileid);
                var self = this;
                $.ajax({
                    url:'/courses/searchOneDetail',
                    data:{
                        type:1,
                        qo:{
                            '_id':self.courseId
                        }
                    },
                    type:'get',
                    success:function(json){
                        //console.log(json);
                        $(self.el).html(self.template({
                            course:json,
                            coursedetail:SearchCourse.coursedetail
                        }));
                        self.model.set(json);
                    }
                });
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
