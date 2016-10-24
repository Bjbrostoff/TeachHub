/**
 * Created by cs on 2016/2/24.
 */
define('app/admin/view/LeftMenuListView',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/admin/template/LeftMenuListView.ejs',

        'app/admin/view/LeftMenuItemView'
    ],
    function(_, Backbone, $, tmpl, LeftMenuItemView){
        var v = Backbone.View.extend({
            $el:$('#usermenu'),
            initialize:function(){
                this.collection.on('change', this.menuChanged, this);
                this.collection.on('add', this.addMenu, this);
            },
            render:function(){
                this.el=_.template(tmpl);
                return this;
            },
            menuChanged:function(){

            },
            addMenu:function(item){
                var itemView = new LeftMenuItemView({model:item});
                $('ul.left-menu').append(itemView.render().el);
            }
        });
        return v;
    })
