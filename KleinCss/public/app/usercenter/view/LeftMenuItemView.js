define('app/usercenter/view/LeftMenuItemView',
[
    'underscore',
    'backbone',
    'jquery',
    'text!/app/usercenter/template/LeftMenuItem.ejs'
],
function(_, Backbone, $, tmpl){
    var v = Backbone.View.extend({
        initialize:function(){
            this.template = _.template(tmpl);
        },
        render:function(){
            this.el=this.template({menu:this.model.toJSON()});
            this.changeClass();
            this.setFirseChildren();
            return this;
        },
        changeClass: function () {
            $("li").click(function () {
                $(this).parent().children().removeClass("on");
                $(this).addClass("on");
            });
        },
        setFirseChildren: function () {
            //var a=$("li").parent().children(0).addClass("on");
            // console.log(a);
        }
    });
    return v;
})
