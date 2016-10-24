/**
 * Created by cs on 2016/2/24.
 */
define('app/admin/controller/Router',
    [
        'underscore',
        'jquery',
        'backbone',

        'app/admin/collection/LeftMenuCollection',

        'app/admin/view/LeftMenuListView',
        'app/admin/view/HomeView'
    ],
    function(_, $, Backbone,
             LeftMenuCollection,
             MenuListView, HomeView){
        var r = Backbone.Router.extend({
            el:'.page-wrapper',
            initialize:function(options){
                this.options = {
                    rolelevel:4,
                    routes:{
                        '':'home',
                        'home':'home'
                    },
                    leftMenus:[
                        {
                            'name':'主页',
                            'url':'home'
                        }

                    ]
                }
                _.extend(this.options, options);
                //1.顶级元素
                this.elems = {
                    'menuSector':$('#menu-sector'),
                    'contentSector':$('#content-sector')
                }
                //2.eventbus
                this.eventBus = _.extend({}, Backbone.Events);
                //3.视图们
                this.views = {};
                //3.集合们
                this.collections = {};
                //4.菜单的集合
                this.collections.leftMenuCollection = new LeftMenuCollection();
                this.models = {};

            },
            index:function(){
                this._detectSubView('menu');
                this._detectSubView('home');
            },
            home:function(){
                console.log(222);
                this._detectSubView('menu');
                this._detectSubView('home');

                this._hideAllSubViews();
                this.views.homeView.show();
            },
            _hideAllSubViews:function(){
                var self = this;
                _.each(this.views, function(item){
                    if (item != self.views.menuListView){
                        item.hide();
                    }
                });
            },
            _detectSubView:function(viewname){
                switch (viewname){
                    case "home":
                        if (!this.views.homeView){
                            this.views.homeView = new HomeView({eventBus:this.eventBus});
                            this.elems.contentSector.append(this.views.homeView.render().el);


                        };
                        break;
                    case "menu":
                        if (!this.views.menuListView){
                            this.views.menuListView = new MenuListView({collection:this.collections.leftMenuCollection});
                            this.elems.menuSector.html(this.views.menuListView.render().el);

                            //1.fetch menu data
                            this.collections.leftMenuCollection.set(this.options.leftMenus);
                        }
                        break;
                }
            }

        });
        return r;
    })