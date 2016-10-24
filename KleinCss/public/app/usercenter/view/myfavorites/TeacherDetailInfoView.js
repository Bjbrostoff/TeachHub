define('app/usercenter/view/myfavorites/TeacherDetailInfoView',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/usercenter/template/myfavorites/TeacherDetailInfoView.ejs',
        'i18n!/nls/uchome.js',
        'jquery.validate'
    ],
    function(_, Backbone, $, tmpl,MyFavorites){
        var v = Backbone.View.extend({
            events:{
                'click .teacher-detail-close':'closeView_handler',
                'click #profile-button':'openProfileView_handler'
            },
            initialize:function(options){
                if (options.hasOwnProperty('eventBus')){
                    this.eventBus = options.eventBus;
                }
                this.teacher = options.teacher;
                this.template = _.template(tmpl);

                this.elems = {
                    'close':'.btn-close'
                }
            },
            render:function(){
                $(this.el).html(this.template({
                    teacher:this.teacher,
                    locale:MyFavorites
                }));
                return this;
            },
            save:function(){

            },
            cancel:function(){

            },
            closeView_handler:function(){
                this.remove();
            },
            openProfileView_handler:function(e){
                var userid = $(e.currentTarget).attr("data-id");
                window.location.href = '/teachers'+'#profile/'+userid;
            }

        });
        return v;
    })
