/**
 * Created by xiaoguo on 16/6/18.
 */

define('app/searchc/view/CourseImagePanelView',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/searchc/template/CourseImagePanelView.ejs',
        'i18n!/nls/SearchCourse.js'
    ],
    function(_, Backbone, $, tmpl,
             CourseImagePanelView){
        var v = Backbone.View.extend({
            events:{

            },
            initialize:function(options){
                this.template = _.template(tmpl);
                this.els = {
                };
            },
            render:function(){
                $(this.el).html(this.template(
                    {
                    }));
                return this;
            },
            show: function () {
                this._show();
            },
            hide: function () {
                this._hide();
            },
            _hide: function () {
                $(this.el).css({
                    'display': 'none'
                })
            },
            _show: function () {
                $(this.el).css({
                    'display': 'block'
                });
            },
            _removeAllItem: function(){
                for (var i = 0; i < this.subItems.length; i++){
                    var item = this.subItems[i];
                    item.remove();
                }
                this.subItems = [];
            },

        });
        return v;
    })
