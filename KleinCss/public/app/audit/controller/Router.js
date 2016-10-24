/**
 * Created by apple on 16/1/17.
 */
define('app/audit/controller/Router',
    [
        'underscore',
        'jquery',
        'backbone',

        'app/audit/collection/LeftMenuCollection',

        'app/audit/view/LeftMenuListView',
        'app/audit/view/HomeView',
        'app/audit/view/auditcourse/AuditCourseView',
        'app/audit/view/auditcert/AuditCertView'
    ],
    function(_, $, Backbone,
             LeftMenuCollection,
             MenuListView, HomeView, AuditCourseView, AuditCertView){
        var r = Backbone.Router.extend({
            el:'.page-wrapper',
            initialize:function(options){
                this.options = {
                    rolelevel:3,
                    routes:{
                        '':'home',
                        'home':'home',
                        'auditcourse':'auditcourse',
                        'auditcert':'auditcert'
                    },
                    leftMenus:[
                        {
                            'name':'主页',
                            'url':'home'
                        },
                        {
                            'name':'课程审核',
                            'url':'auditcourse'
                        },
                        {
                            'name':'认证审核',
                            'url':'auditcert'
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
                this._detectSubView('menu');
                this._detectSubView('home');
                this._hideAllSubViews();
                this.views.homeView.show();
            },
            auditcourse:function(){
                this._detectSubView('menu');
                this._detectSubView('auditcourse');

                this._hideAllSubViews();
                this.views.auditCourseView.show();
            },
            auditcert:function(){
                this._detectSubView('menu');
                this._detectSubView('auditcert');

                this._hideAllSubViews();
                this.views.auditCertView.show();
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
                    case "auditcourse":
                        if (!this.views.auditCourseView){
                            this.views.auditCourseView = new AuditCourseView();
                            this.elems.contentSector.append(this.views.auditCourseView.render().el);

                            this.views.auditCourseView.loadAuditCourses();
                        };
                        break;
                    case "auditcert":
                        if (!this.views.auditCertView){
                            this.views.auditCertView = new AuditCertView();
                            this.elems.contentSector.append(this.views.auditCertView.render().el);
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
    });
