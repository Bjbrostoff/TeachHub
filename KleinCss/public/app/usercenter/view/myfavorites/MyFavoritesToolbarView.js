/**
 * Created by cs on 2016/1/1.
 */
define('app/usercenter/view/myfavorites/MyFavoritesToolbarView',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/usercenter/template/myfavorites/MyFavoritesToolbarView.ejs',
        'i18n!/nls/uchome.js'
    ],
    function(_, Backbone, $, tmpl,MyFavorites){
        var v = Backbone.View.extend({
            events:{
                'click .fav-classify':'favClassifyClickHandler'
            },
            initialize:function(options){
                this.eventBus = options.eventBus;
                this.template = _.template(tmpl);
                this.activeindex = options.activeindex;
                this.types = options.types;
                this.elems = {
                    favClassifyBtns:'.fav-classify'
                }
                this.eventBus.on('fav-toolbar-changed', this.onToolBarChangedHander, this);
            },
            onToolBarChangedHander: function (id) {
                $(this.elems.favClassifyBtns).removeClass('active');
                _.each($(this.elems.favClassifyBtns), function (el) {
                    if ($(el).attr("data-id") == id) {
                        $(el).addClass('active');
                    }
                });
                this.eventBus.trigger('fav-data-changed', id);
            },
            render:function(){
                $(this.el).html(this.template({
                    ident:'favorites',
                    activeindex:this.activeindex,
                    types:this.types.toJSON(),
                    locale:MyFavorites
                }));
                return this;
            },
            favClassifyClickHandler:function(evt){
                $(this.elems.favClassifyBtns).removeClass('active');
                $(evt.currentTarget).addClass('active');
                this.eventBus.trigger('fav-data-changed',$(evt.currentTarget).attr("data-id"));
            }
        });
        return v;
    })
