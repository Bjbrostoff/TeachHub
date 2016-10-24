define('app/usercenter/view/coursemanage/GenerateMsgModalView',
[
    'underscore',
    'backbone',
    'jquery',

    'text!/app/usercenter/template/coursemanage/GenerateMsgModalView.ejs',
    'i18n!/nls/uchome.js'
],
function(_, Backbone, $, tmpl,localName){
    var v = Backbone.View.extend({
        id:'course-manage-msg-modal',
        className:'modal inmodal fade',
        events:{
            'hidden':'teardown'
        },
        initialize:function(){
            //this.render();
        },
        render:function(title){
            this.template = _.template(tmpl);
            this.$el.html(this.template({
                local:localName.CourseManage.generateMsg,
                title:title
            }));
            this.$el.modal({
                //show:false
            });
            return this;
        },
        show:function(){
            this.$el.modal('show');
        },
        teardown:function(){
            this.$el.data('modal', null);
            this.remove();
        }

    });
    return v;
})
