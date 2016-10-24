/**
 * Created by cs on 2016/3/6.
 */
define('app/agenciescenter/view/coursemanage/ChooseTeacherItemView',
    [
        'underscore',
        'backbone',
        'jquery',

        'text!/app/agenciescenter/template/coursemanage/ChooseTeacherItemView.ejs'
    ],
    function(_, Backbone, $, tmpl){
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
                    teachers:this.teacher.toJSON()[0]['teachers']
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
                /*var userid = $(e.currentTarget).attr("data-id");
                window.location.href = '/teachers'+'#profile/'+userid;*/
            }

        });
        return v;
    })