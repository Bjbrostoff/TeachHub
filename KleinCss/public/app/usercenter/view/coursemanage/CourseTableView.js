/**
 * Created by clock on 2015/12/30.
 */
define('app/usercenter/view/coursemanage/CourseTableView',
[
    'underscore',
    'backbone',
    'jquery',
    'text!/app/usercenter/template/coursemanage/CourseTableView.ejs',
    'i18n!/nls/uchome.js'
],
function(_, Backbone, $, tmpl,localName){
    var v = Backbone.View.extend({
        initialize:function(option){
            this.eventBus = option.eventBus;
            this.template = _.template(tmpl);
        }
        ,render:function(){
            $(this.el).html(this.template({
                ident:'identity',
                fields:[{fname:'name', falias:localName.CourseManage.courseTable.name},
                        {fname:'type', falias:localName.CourseManage.courseTable.type},
                        {fname:'state', falias:localName.CourseManage.courseTable.state},
                        ],
                datas:this.collection.toJSON()
            }));

            return this;
        }
    });
    return v;
})
