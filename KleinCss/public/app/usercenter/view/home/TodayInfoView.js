/**
 * Created by Administrator on 2016/1/14.
 */
define('app/usercenter/view/home/TodayInfoView',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/usercenter/template/home/TodayInfo.ejs',

        'i18n!/nls/uchome.js'
    ],
    function(_, Backbone, $, tmpl,local){
        var v = Backbone.View.extend({
            initialize:function(option){
                this.eventBus = option.eventBus;
                this.template = _.template(tmpl);
            },
            render:function(json){
                $(this.el).html(this.template({
                    dateInfo:json,
                    local:local
                }));
                return this;
            }
        });
        return v;
    })