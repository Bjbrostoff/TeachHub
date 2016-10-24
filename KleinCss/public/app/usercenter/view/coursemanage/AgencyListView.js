/**
 * Created by cs on 2016/3/10.
 */
define('app/usercenter/view/coursemanage/AgencyListView',
    [
        'underscore',
        'backbone',
        'jquery',

        'text!/app/usercenter/template/coursemanage/AgencyListView.ejs',
        'i18n!/nls/uchome.js'
    ],
    function(_, Backbone, $, tmpl,localName){
        var v = Backbone.View.extend({
            initialize:function(options){
                this.agencies = options.agencies;
                this.template = _.template(tmpl);
            },
            render:function(){
                this.$el.html(this.template({
                    agencies:this.agencies,
                    local:localName
                }));
                return this;
            },
        });
        return v;
    })