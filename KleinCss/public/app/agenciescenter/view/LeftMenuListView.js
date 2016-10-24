define('app/agenciescenter/view/LeftMenuListView',
[
    'underscore',
    'backbone',
    'jquery',
    'text!/app/agenciescenter/template/LeftMenuList.ejs',

    'app/agenciescenter/view/LeftMenuItemView'
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
