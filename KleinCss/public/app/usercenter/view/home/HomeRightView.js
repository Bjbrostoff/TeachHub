/**
 * Created by Administrator on 2016/1/4.
 */
define('app/usercenter/view/home/HomeRightView',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/usercenter/template/home/HomeRight.ejs',
        'i18n!/nls/uchome.js'
    ],
    function (_, Backbone, $, tmpl,localname) {
        var v = Backbone.View.extend({
            initialize: function (option) {
                this.eventBus = option.eventBus;
                this.template = _.template(tmpl);
            },
            render: function (homework) {
                $(this.el).html(this.template({
                    homework: homework,
                    local:localname.Home.HomeRight
                }));
                return this;
            }
        });
        return v;
    })