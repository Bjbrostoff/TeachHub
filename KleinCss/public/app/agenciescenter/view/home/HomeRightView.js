define('app/agenciescenter/view/home/HomeRightView',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/agenciescenter/template/home/HomeRight.ejs'
    ],
    function (_, Backbone, $, tmpl) {
        var v = Backbone.View.extend({
            initialize: function (option) {
                this.eventBus = option.eventBus;
                this.template = _.template(tmpl);
            },
            render: function (homework) {
                $(this.el).html(this.template({
                    homework: homework
                }));
                return this;
            }
        });
        return v;
    })