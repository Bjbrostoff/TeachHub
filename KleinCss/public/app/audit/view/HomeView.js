/**
 * Created by apple on 16/1/17.
 */
define('app/audit/view/HomeView',
[
    'underscore',
    'jquery',
    'backbone',

    'text!/app/audit/template/HomeView.ejs',
    'bootstrap'
],
function(_, $, Backbone, tmpl){
    var v = Backbone.View.extend({
        el: '.home-container',
        initialize:function(){
            this.template = _.template(tmpl);
        },
        render:function(){
            $(this.el).html(this.template({

            }));

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