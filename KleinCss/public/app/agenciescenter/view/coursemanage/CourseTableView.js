/**
 * Created by clock on 2015/12/30.
 */
define('app/agenciescenter/view/coursemanage/CourseTableView',
[
    'underscore',
    'backbone',
    'jquery',
    'text!/app/agenciescenter/template/coursemanage/CourseTableView.ejs',
    'i18n!/nls/achome.js',
],
function(_, Backbone, $, tmpl,CourseManage){
    var v = Backbone.View.extend({
        initialize:function(option){
            this.eventBus = option.eventBus;
            this.template = _.template(tmpl);
        }
        ,render:function(){
            $(this.el).html(this.template({
                ident:'identity',
                fields:[{fname:'name', falias:CourseManage.CourseManage.name},
                        {fname:'type', falias:CourseManage.CourseManage.type},
                        {fname:'state', falias:CourseManage.CourseManage.state}
                        ],
                datas:this.collection.toJSON()
            }));

            return this;
        }
    });
    return v;
})
