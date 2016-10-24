/**
 * Created by Administrator on 2016/1/6.
 */
define('app/agenciescenter/view/home/DetailInfoView',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/agenciescenter/template/home/DetailInfo.ejs',
        'i18n!/nls/uchome.js'
    ],
    function(_, Backbone, $, tmpl,local){
        var v = Backbone.View.extend({
            initialize:function(option){
                this.eventBus = option.eventBus;
                this.template = _.template(tmpl);
                this.fieldArr1 = ['name', 'info','introduction','catalog','price'];
                this.fieldArr2=local.Home.fieldArr2;

            },
            render:function(data){
                $(this.el).html(this.template({
                    data:data,
                    fieldNext:this.fieldArr1,
                    fieldPre:this.fieldArr2,
                    local:local.Home.detailInformation
                }));
                return this;
            }
        });
        return v;
    })