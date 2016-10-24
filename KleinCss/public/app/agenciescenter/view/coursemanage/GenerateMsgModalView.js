define('app/agenciescenter/view/coursemanage/GenerateMsgModalView',
[
    'underscore',
    'backbone',
    'jquery',

    'text!/app/agenciescenter/template/coursemanage/GenerateMsgModalView.ejs'
],
function(_, Backbone, $, tmpl){
    var v = Backbone.View.extend({
        id:'course-manage-msg-modal',
        className:'modal inmodal fade',
        events:{
            'hidden':'teardown'
        },
        initialize:function(){
            this.template = _.template(tmpl);
            this.render();
        },
        render:function(){
            this.$el.html(this.template({}));
            this.$el.modal({
                show:false
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
