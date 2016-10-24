/**
 * Created by Administrator on 2016/3/12.
 */
define('app/agenciescenter/view/teachermanage/TeacherMoreInfoView',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/agenciescenter/template/teachermanage/TeacherMoreInfo.ejs',

        'i18n!/nls/achome.js'
    ],
    function(_, Backbone, $, tmpl,localName){
        var v = Backbone.View.extend({
            initialize:function(option){
                this.eventBus = option.eventBus;
                this.template = _.template(tmpl);
            },
            render:function(data){
                console.log(data);
                $(this.el).html(this.template({
                    data:data,
                    local:localName
                }));
                return this;
            }
        });
        return v;
    })