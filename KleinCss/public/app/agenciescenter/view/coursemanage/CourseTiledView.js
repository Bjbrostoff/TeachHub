define('app/agenciescenter/view/coursemanage/CourseTiledView',
[
    'underscore',
    'backbone',
    'jquery',

    'text!/app/agenciescenter/template/coursemanage/CourseTiledView.ejs'
],
function(_, Backbone, $, tmpl){
    var v = Backbone.View.extend({
        initialize:function(options){
            if (!options.hasOwnProperty('eventBus')){
                this.eventBus = options.eventBus;
            }

            this.template = _.template(tmpl);
        },
        render:function(){
            $(this.el).html(this.template({
                datas:this.collection.toJSON()
            }));
            return this;
        }
    });
    return v;
})
