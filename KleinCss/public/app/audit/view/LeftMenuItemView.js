/**
 * Created by apple on 16/1/17.
 */
define('app/audit/view/LeftMenuItemView',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/audit/template/LeftMenuItemView.ejs'
    ],
    function(_, Backbone, $, tmpl){
        var v = Backbone.View.extend({
            initialize:function(){
                this.template = _.template(tmpl);
            },
            render:function(){
                this.el=this.template({menu:this.model.toJSON()});
                return this;
            },
            hide:function(){
                $(this.el).css({
                    'display':'none'
                });
            },
            show:function(){
                $(this.el).css({
                    'display':'block'
                });
            }
        });
        return v;
    })
