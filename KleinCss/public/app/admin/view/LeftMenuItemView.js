/**
 * Created by cs on 2016/2/25.
 */
define('app/admin/view/LeftMenuItemView',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/admin/template/LeftMenuItemView.ejs'
    ],
    function(_, Backbone, $, tmpl){
        var v = Backbone.View.extend({
            initialize:function(){
                this.template = _.template(tmpl);
            },
            render:function(){
                this.el=this.template({menu:this.model.toJSON()});
                return this;
            }
        });
        return v;
    })
