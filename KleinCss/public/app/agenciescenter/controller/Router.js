define('app/agenciescenter/controller/Router',
    [
        'underscore',
        'backbone',
        'jquery',

        'app/agenciescenter/collection/LeftMenuCollection',
        'app/agenciescenter/view/LeftMenuListView',
        'app/agenciescenter/view/BaseInfoView',

        'app/agenciescenter/view/HomeView',
        'app/agenciescenter/view/TeacherManageView',
        'app/agenciescenter/view/StudentManageView',
        'app/usercenter/view/CourseManageView',
        'app/usercenter/view/MyCertView',
        'app/usercenter/model/MyCertModel'
    ],
    function(_, Backbone, $,
             LeftMenuCollection, MenuListView,BaseInfoView,
             HomeView,TeacherManageView, StudentManageView,CourseManageView,MyCertView,MyCertModel){
        var r = Backbone.Router.extend({
            el:'.page-wrapper',
            initialize:function(options){
                this.options = {
                    rolelevel:0,
                    routes:{
                        '':'sthome',
                        'home':'sthome',
                        'mycourse':'mycourse',
                        'mycert':'mycert',
                        'baseinfo':'baseinfo',
                        'myfavorites':'myfavorites'
                    },
                    leftMenus:[
                        {
                            'name':'主页',
                            'url':'home'
                        },
                        {
                            'name':'我的课程',
                            'url':'mycourse'
                        },
                        {
                            'name':'我的收藏',
                            'url':'myfavorites '
                        },
                        {
                            'name':'用户信息',
                            'url':'baseinfo'
                        },
                        {
                            'name':'我的认证',
                            'url':'mycert'
                        }

                    ]
                };
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
                //5.role user
                this.user = options.user || {};
                this.models = {};
                this.models.myCertModel = new MyCertModel();

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
            teachermanage:function(){
                this._detectSubView('menu');
                this._detectSubView('teachermanage');
                this._hideAllSubViews();
                this.views.TeacherManageView.show();
            },
            studentmanage:function(){
                this._detectSubView('menu');
                this._detectSubView('studentmanage');
                this._hideAllSubViews();
                this.views.StudentManageView.show();
            },




            mycert:function(){
                this._detectSubView('menu');
                this._detectSubView('mycert');

                this._hideAllSubViews();
                this.views.mycertView.show();
            },
            baseinfo:function(){
                this._detectSubView('menu');
                this._detectSubView('baseinfo');

                this._hideAllSubViews();
                this.views.baseinfoView.show();
                this.views.baseinfoView.showAgenciesInfo();
            },
            coursemanage:function(){
                this._detectSubView('menu');
                this._detectSubView('coursemanage');

                this._hideAllSubViews();
                this.views.courseManageView.show();

            },

            myfavorites:function(){
                this._detectSubView('menu');
                this._detectSubView('myfavorites');
                this._hideAllSubViews();
                this.views.myfavoritesView.show();
            },


            sthomework:function(){
                this._detectSubView('menu');
                this._detectSubView('sthomework');

                this._hideAllSubViews();
                this.views.stHomeworkView.show();
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
                            this.eventBus.on('homeView-edit', this._homeView_edit, this);
                            this.views.homeView.on('before-edit', function(){
                            });
                            this.elems.contentSector.append(this.views.homeView.render().el);
                        };
                        break;
                    case "teachermanage":
                        if (!this.views.TeacherManageView){
                            this.views.TeacherManageView = new TeacherManageView({eventBus:this.eventBus});
                            this.elems.contentSector.append(this.views.TeacherManageView.render().el);
                        };

                        break;
                    case "studentmanage":
                        if (!this.views.StudentManageView){
                            this.views.StudentManageView = new StudentManageView({eventBus:this.eventBus});
                            this.elems.contentSector.append(this.views.StudentManageView.render().el);
                        }
                        break;

                    case "mycourse":
                        if (!this.views.myCourseView){
                            this.views.myCourseView = new MyCourseView();
                            this.elems.contentSector.append(this.views.myCourseView.render().el);
                        };
                        break;
                    case "mycert":
                        if (this.views.mycertView) this.views.mycertView.remove();
                        if (!this.views.mycertView){
                            this.views.mycertView = new MyCertView({
                                model:this.models.myCertModel
                            });

                        };
                        var self = this;
                        this.models.myCertModel.fetch({
                            data:{

                            },
                            success:function(){
                                self.elems.contentSector.append(self.views.mycertView.render().el);
                            }
                        });
                        break;
                    case "baseinfo":
                        if (!this.views.baseinfoView){
                            this.views.baseinfoView = new BaseInfoView();
                            this.elems.contentSector.append(this.views.baseinfoView.render().el);
                        };
                        break;
                    case "coursemanage":
                        if (!this.views.courseManageView){
                            this.views.courseManageView = new CourseManageView({user:this.user,eventBus:this.eventBus});
                            this.elems.contentSector.append(this.views.courseManageView.render().el);
                        }
                        break;

                    case "myteachers":
                        if (!this.views.myTeachersView){
                            this.views.myTeachersView = new MyTeachersView({eventBus:this.eventBus});
                            this.elems.contentSector.append(this.views.myTeachersView.render().el);
                        }
                        break;
                    case "myhomework":
                        if (!this.views.myHomeworkView){
                            this.views.myHomeworkView = new MyHomeworkView({eventBus:this.eventBus});
                            this.elems.contentSector.append(this.views.myHomeworkView.render().el);
                            this.views.myHomeworkView.createSubViews();
                        }
                        break;
                    case "myfavorites":
                        if (!this.views.myfavoritesView){
                            this.views.myfavoritesView = new MyFavoritesView({eventBus:this.eventBus});
                            this.elems.contentSector.append(this.views.myfavoritesView.render().el);
                        }
                        break;
                    case "sthomework":
                        if (!this.views.stHomeworkView){
                            this.views.stHomeworkView = new StHomeworkView({eventBus:this.eventBus});
                            this.elems.contentSector.append(this.views.stHomeworkView.render().el);
                            this.views.stHomeworkView.createSubViews();
                        }
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
            },
            _homeView_edit:function(){
                console.log('1');
            }

        });
        return r;
    });
