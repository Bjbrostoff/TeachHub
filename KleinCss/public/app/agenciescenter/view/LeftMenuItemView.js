define('app/agenciescenter/view/LeftMenuItemView',
[
    'underscore',
    'backbone',
    'jquery',
    'text!/app/agenciescenter/template/LeftMenuItem.ejs'
],
function(_, Backbone, $, tmpl){
    var v = Backbone.View.extend({
        initialize:function(){
            this.template = _.template(tmpl);
        },
        render:function(){
            this.el=this.template({menu:this.model.toJSON()});
            this.changeClass();
            return this;
        },
        changeClass: function () {
            // $("li").click(function (e) {
            //     console.log(e);
            //     // $(this).parent().children().removeClass("on");
            //     // $(this).addClass("on");
            //     // console.log($(this));
            // });
        },
    });
    return v;
})
