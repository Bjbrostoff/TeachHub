define('app/usercenter/view/CourseManageView',
    [
        'underscore',
        'backbone',
        'jquery',

        'text!/app/usercenter/template/CourseManageView.ejs',

        'app/usercenter/collection/coursemanage/CourseCollection',
        'app/usercenter/model/coursemanage/CourseModel',

        'app/usercenter/view/coursemanage/CourseListView',
        'app/usercenter/view/coursemanage/CreateCourseView',

        'app/usercenter/view/coursemanage/CourseDetailView',

        'app/usercenter/view/coursemanage/SelectStudentsView',
        'app/usercenter/view/coursemanage/CourseChartLegendView',
        'app/usercenter/view/coursemanage/AgencyChooseView',
        'app/usercenter/view/coursemanage/CourseProxyListView',
        'app/usercenter/view/coursemanage/GenerateMsgModalView',
        'i18n!/nls/uchome.js',
        'sweetalert'


    ],
    function (_, Backbone, $,
              tmpl,
              CourseCollection, CourseModel,
              CourseListView, CreateCourseView, CourseDetailView, SelectStudentsView, CourseChartLegendView,
              AgencyChooseView,CourseProxyListView,
              GenerateMsgModalView,
              localName) {
        var v = Backbone.View.extend({
            el: '.course-manage-container',
            events: {
                'click li.course-manage-nav-tab': 'courseManageNavTabChangeHandler',
                'click #course-manage-generate-course': 'createNewCourse_handler'
            },
            initialize: function (option) {
                this.eventBus = option.eventBus || {};
                this.loginUserId = option.loginUserId || '';
                this.user = option.user || {};
                this.usertype = this.user.usertype || 0;

                this.els = {
                    'actCourses': '#course-manage-act-tab',
                    'pubCourses': '#course-manage-pub-tab',
                    'selloutCourses': '#course-manage-sellout-tab',
                    'newCourses': '#course-manage-new-tab',
                    'allCourses': '#course-manage-all-tab',
                    'proxyCourses': '#course-manage-proxy-tab',
                    'chart': 'course-manage-chart',
                    'chartLegend': '#course-manage-chart-legend',
                    'createCourse': 'course-manage-generate',
                    'btn_createCourse': '#course-manage-generate-course',
                    'navTabs':'.course-manage-nav-tab',
                    'openDialog':'#course-manage-open-dialog'
                };

                this.eventNames = {
                    'detail': 'course-manage-detail-btn-did-click',
                    'pub': 'course-manage-pub-btn-did-click',
                    'sellout': 'course-manage-sellout-btn-did-click',
                    'prepare': 'course-manage-prepare-btn-did-click',
                    'begin': 'course-manage-begin-btn-did-click',
                    'end': 'course-manage-end-btn-did-click',
                    'push': 'course-manage-push-btn-did-click',
                    'proxy': 'course-manage-proxy-btn-did-click',
                    'proxyOperate':'course-manage-proxy-operate-btn-did-click',
                    'emitCourseMsg': 'global-msg',
                    'generateCourseComplete': 'manage-course-generate-complete',
                    commitComplete: 'manage-course--commit-complete',
                    pubComplete: 'manage-course--pub-complete',
                    prepareComplete: 'manage-course--prepare-complete',
                    beginComplete: 'manage-course--begin-complete',
                    endComplete: 'manage-course--end-complete',
                    selloutComplete: 'manage-course--sellout-complete',
                    proxyComplete: 'manage-course--proxy-complete',
                    selectStudentConfirm: 'course-manage-select-students-confirm',
                    chooseAgencyComplete: 'course-manager-choose-agency-complete'
                };

                this.urls = {
                    myAct: '/users/myActCourses',
                    myPub: '/users/myPubCourses',
                    mySellout: '/users/mySelloutCourses',
                    myNew: '/users/myNewCourses',
                    myAll: '/users/myAllCourses',
                    myChart: '/users/myCoursesCharts',
                    myProxy: '/users/myProxyCourses'
                };
                this.proxyStaus = {
                    apply:1, //申请
                    pass:2,  //通过
                    fail:3,  //未通过
                    remove:4  //解除
                };


                this.models = {};

                this.template = _.template(tmpl);

                this.views = {};

                this.models.actCourseCollection = new CourseCollection({
                    url: this.urls.myAct
                });
                this.models.pubCourseCollection = new CourseCollection({
                    url: this.urls.myPub
                });
                this.models.selloutCourseCollection = new CourseCollection({
                    url: this.urls.mySellout
                });
                this.models.newCoursesCollection = new CourseCollection({
                    url: this.urls.myNew
                });
                this.models.allCoursesCollection = new CourseCollection({
                    url: this.urls.myAll
                });
                this.models.ChartCollection = new CourseCollection({
                    url: this.urls.myChart
                });
                this.models.proxyCoursesCollection = new CourseCollection({
                    url: this.urls.myProxy
                });
                //this.models.actCourseCollection.on('reset', this.actCourses_dataChange, this);

            },
            render: function () {
                var self = this;
                this.models.ChartCollection.fetch({}).complete(function () {
                    var charts = self.models.ChartCollection;
                    var chartData = charts.toJSON()[0];
                    $(self.els.chart).empty();
                    self.morrisChart(chartData);
                });
                $(this.el).html(this.template({
                    local:localName
                }));
                this.refresh();
                return this;

            },
            changeBackGround:function () {
                $(".course-manage-nav-tab").click(function (e) {
                    $(this).parent().children().removeClass("on");
                    $(this).addClass("on");
                });
            },

            refresh:function(){
                var self = this;
                _.each($(self.els.navTabs), function (el) {
                    if ($(el).hasClass("on")) {
                        self.showCourse($(el).attr("data-bind"));
                    }
                });
            },
            hide: function () {
                this._hide();
            },
            show: function () {
                this._show();
            },
            morrisChart: function (chartData) {
                Morris.Donut({
                    element: this.els.chart,
                    data: chartData.data,
                    resize: true,
                    colors: chartData.colors
                });

                var legendView = new CourseChartLegendView({
                    eventBus: this.eventBus,
                    el: this.els.chartLegend,
                    datas: chartData.data,
                    colors: chartData.colors
                });
                $(this.els.chartLegend).append(legendView.render().el);
            },
            createNewCourse_handler: function () {
                if (this.views.createCourseView) this.views.createCourseView.remove();

                this.views.createCourseView = new CreateCourseView({
                    userid: 'a'
                });
                this.views.createCourseView.on(this.eventNames.generateCourseComplete, this._generateNewCourse, this);
                $(this.el).append(this.views.createCourseView.render().el);
                this.views.createCourseView.setValidate();

            },
            showActCourses: function () {//进行中
                if (!this.views.actCourseTabView) {
                    this.views.actCourseTabView = new CourseListView({
                        eventBus: this.eventBus,
                        el: this.els.actCourses,
                        collection: this.models.actCourseCollection,
                        selectlv: 2,
                        usertype: this.usertype
                    });
                    this.views.actCourseTabView.on(this.eventNames.detail, this._detailCourse, this);
                    this.views.actCourseTabView.on(this.eventNames.end, this._endCourse, this);
                    this.views.actCourseTabView.on(this.eventNames.sellout, this._selloutCourse, this);
                    this.views.actCourseTabView.on(this.eventNames.pub, this._pubCourse, this);
                    this.views.actCourseTabView.on(this.eventNames.begin, this._beginCourse, this);

                    var self = this;
                    this.models.actCourseCollection.fetch({
                        data: {
                            select: 2
                        }
                    }).complete(function () {
                        $(self.els.actCourses).append(self.views.actCourseTabView.render().el);
                        self.views.actCourseTabView.activeListener();
                    });
                }


            },
            showPubCourses: function () {//已发布
                if (!this.views.pubCourseTabView) {
                    this.views.pubCourseTabView = new CourseListView({
                        eventBus: this.eventBus,
                        el: this.els.pubCourses,
                        collection: this.models.pubCourseCollection,
                        selectlv: 1,
                        usertype: this.usertype
                    });

                    this.views.pubCourseTabView.on(this.eventNames.prepare, this._prepareCourse, this);
                    this.views.pubCourseTabView.on(this.eventNames.sellout, this._selloutCourse, this);
                    this.views.actCourseTabView.on(this.eventNames.detail, this._detailCourse, this);

                    var self = this;
                    this.models.pubCourseCollection.fetch({
                        data: {
                            select: 1
                        }
                    }).complete(function () {
                        $(self.els.pubCourses).append(self.views.pubCourseTabView.render().el);
                        self.views.pubCourseTabView.activeListener();
                    });
                }


            },
            showSelloutCourses: function () {//已下架
                if (!this.views.sellOutCourseTabView) {
                    this.views.sellOutCourseTabView = new CourseListView({
                        eventBus: this.eventBus,
                        el: this.els.selloutCourses,
                        collection: this.models.selloutCourseCollection,
                        selectlv: 3,
                        usertype: this.usertype
                    });

                    this.views.sellOutCourseTabView.on(this.eventNames.pub, this._pubCourse, this);
                    this.views.sellOutCourseTabView.on(this.eventNames.detail, this._detailCourse, this);

                    var self = this;
                    this.models.selloutCourseCollection.fetch({
                        data: {
                            select: 3
                        }
                    }).complete(function () {
                        $(self.els.selloutCourses).append(self.views.sellOutCourseTabView.render().el);
                        self.views.sellOutCourseTabView.activeListener();
                    });
                }


            },
            showNewCourses: function () {//未发布
                if (!this.views.newCourseTabView) {
                    this.views.newCourseTabView = new CourseListView({
                        eventBus: this.eventBus,
                        el: this.els.newCourses,
                        collection: this.models.newCoursesCollection,
                        selectlv: 0,
                        usertype: this.usertype
                    });
                    this.views.newCourseTabView.on(this.eventNames.pub, this._pubCourse, this);
                    this.views.newCourseTabView.on(this.eventNames.detail, this._detailCourse, this);
                    this.views.newCourseTabView.on(this.eventNames.push, this._pushCourse, this);
                    this.views.newCourseTabView.on(this.eventNames.proxy, this._proxyCourse, this);

                    var self = this;
                    this.models.newCoursesCollection.fetch({
                        data: {
                            select: 0
                        }
                    }).complete(function () {
                        $(self.els.newCourses).append(self.views.newCourseTabView.render().el);
                        self.views.newCourseTabView.activeListener();
                    });
                }

            },
            showAllCourses: function () {
                if (!this.views.allCourseTabView) {
                    this.views.allCourseTabView = new CourseListView({
                        eventBus: this.eventBus,
                        el: this.els.allCourses,
                        collection: this.models.allCoursesCollection,
                        selectlv: -1
                    });

                    this.views.newCourseTabView.on(this.eventNames.detail, this._detailCourse, this);

                    var self = this;
                    this.models.allCoursesCollection.fetch().complete(function () {
                        $(self.els.allCourses).append(self.views.allCourseTabView.render().el);
                        self.views.allCourseTabView.activeListener();
                    });
                }
            },
            showProxyCourses: function () {
                if (!this.views.proxyCourseTabView) {
                    this.views.proxyCourseTabView = new CourseProxyListView({
                        eventBus: this.eventBus,
                        el: this.els.proxyCourses,
                        collection: this.models.proxyCoursesCollection
                    });

                    this.views.proxyCourseTabView.on(this.eventNames.detail, this._detailCourse, this);
                    this.views.proxyCourseTabView.on(this.eventNames.proxyOperate, this._proxyOperateCourse, this);
                    var self = this;
                    this.models.proxyCoursesCollection.fetch().complete(function () {
                        $(self.els.proxyCourses).append(self.views.proxyCourseTabView.render().el);
                        self.views.proxyCourseTabView.activeListener();
                    });
                }
            },
            showCourse:function(dataBind){
                switch (dataBind) {
                    case 'act':
                        this.showActCourses();
                        break;
                    case 'pub':
                        this.showPubCourses();
                        break;
                    case 'sellout':
                        this.showSelloutCourses();
                        break;
                    case 'new':
                        this.showNewCourses();
                        break;
                    case 'all':
                        this.showAllCourses();
                        break;
                    case 'proxy':
                        this.showProxyCourses();
                        break;
                    default:
                }
            },
            courseManageNavTabChangeHandler: function (evt) {
                var dataBind = $(evt.currentTarget).attr('data-bind');
                this.showCourse(dataBind);
            },
            actCourses_dataChange: function () {
                $(this.els.actCourses).append(this.views.actCourseTabView.render().el);
            },
            _hide: function () {
                $(this.el).css({
                    'display': 'none'
                });
            },
            _show: function () {
                $(this.el).css({
                    'display': 'block'
                });
            },
            _detailCourse: function (data) {
                var detail = new CourseDetailView({
                    model: data.item,
                    isproxy:data.isproxy
                });
                this.$el.append(detail.render().el);
            },
            _proxyOperateCourse:function(data,proxyStatus){
                var title;
                var course = data.get('course');
                //解除授权只能是对未开课和已结课的课程
                var cando = true;
                if (proxyStatus == this.proxyStaus.remove) {
                    if ((course.statelv.lv == 2 && course.statelv.type == 0)
                        || (course.statelv.lv == 2 && course.statelv.type == 2)) {
                        cando = true;
                    }else{
                        cando = false;
                       // swal({
                            title= localName.CourseManage.courseMView.course+' [' + course['name'] + '] '+localName.CourseManage.courseMView.cin+' ['+course.statelv.name+'] '+localName.CourseManage.courseMView.status;
                       // })
                    }
                }
                if (cando) {
                    this.proxyModel = new CourseModel();
                    var params = JSON.stringify({
                        courseid: course['_id'],
                        status: proxyStatus,
                        confirm: 0,
                        timestamp: new Date().getTime()

                    });
                    this.proxyModel.on(this.eventNames.proxyComplete, this._proxyCourseComplete, this);
                    this.proxyModel.proxyCourse(params);
                }

                if (!this.views.generateMsgModalView) {
                    this.views.generateMsgModalView = new GenerateMsgModalView({
                        //eventBus: this.eventBus,
                        //el: this.els.openDialog
                        //title:title
                    });
                }
                $(this.els.openDialog).append(this.views.generateMsgModalView.render(title));
            },
            _pubCourse: function (data) {
                this.pubSelState = data.select;
                switch (data.select) {
                    case 0:
                        if (data.item.get('statelv').type == 3) {
                            this.pubModel = new CourseModel();
                            this.pubModel.set(data.item.toJSON());
                            this.pubModel.on(this.eventNames.pubComplete, this._pubCourseComplete, this);
                            this.pubModel.pubCourse();

                        } else {

                        }
                        break;
                    case 2:
                        if (data.item.get('statelv').type == 2) {
                            this.pubModel = new CourseModel();
                            this.pubModel.set(data.item.toJSON());
                            this.pubModel.on(this.eventNames.pubComplete, this._pubCourseComplete, this);
                            this.pubModel.pubCourse();
                        }
                        break;
                    case 3:
                        this.pubModel = new CourseModel();
                        this.pubModel.set(data.item.toJSON());
                        this.pubModel.on(this.eventNames.pubComplete, this._pubCourseComplete, this);
                        this.pubModel.pubCourse();

                        break;
                }
            },
            _selloutCourse: function (data) {
                this.selloutSelState = data.select;
                switch (data.select) {
                    case 1:
                        if (data.item.get('statelv').type == 0) {
                            this.selloutModel = new CourseModel();
                            this.selloutModel.set(data.item.toJSON());
                            this.selloutModel.on(this.eventNames.selloutComplete, this._selloutCourseComplete, this);
                            this.selloutModel.selloutCourse();
                        } else if (data.item.get('statelv').type == 1) {

                        }

                        break;
                    case 2:
                        if (data.item.get('statelv').type == 2) {
                            this.selloutModel = new CourseModel();
                            this.selloutModel.set(data.item.toJSON());
                            this.selloutModel.on(this.eventNames.selloutComplete, this._selloutCourseComplete, this);
                            this.selloutModel.selloutCourse();
                        } else {

                        }
                        break;
                }
            },
            _prepareCourse: function (data) {
                this.prepareSelect = data;
                this.showSelectStudentPanel();
                return;
            },
            _beginCourse: function (data) {
                switch (data.select) {
                    case 2:
                        if (data.item.get('statelv').type == 0) {
                            this.beginModel = new CourseModel();
                            this.beginModel.set(data.item.toJSON());
                            this.beginModel.on(this.eventNames.beginComplete, this._beginCourseComplete, this);
                            this.beginModel.beginCourse();

                        } else {

                        }
                        break;
                }
            },
            _endCourse: function (data) {
                switch (data.select) {
                    case 2:
                        if (data.item.get('statelv').type == 1) {
                            this.endModel = new CourseModel();
                            this.endModel.set(data.item.toJSON());
                            this.endModel.on(this.eventNames.endComplete, this._endCourseComplete, this);
                            this.endModel.endCourse();
                        }

                        break;
                }
            },
            _generateNewCourse: function (json) {
                if (!json.state) return;
                var model = new CourseModel();
                model.set(json.data);
                this.models.newCoursesCollection.add(model, {
                    at: 0
                });

                var msg = localName.CourseManage.courseMView.newCoursed+'[' + model.get('name') + ']';
                this.eventBus.trigger(this.eventNames.emitCourseMsg, {
                    msg: {
                        info: msg,
                        time: this._formatDate(new Date())
                    }
                });
            },
            _pushCourse: function (data) {
                switch (data.select) {
                    case 0:
                        if (data.item.get('statelv').type == 0) {
                            this.pushModel = new CourseModel();
                            this.pushModel.set(data.item.toJSON());
                            this.pushModel.on(this.eventNames.commitComplete, this._pushCourseComplete, this);
                            this.pushModel.commitCourse();
                        } else {

                        }
                        break;
                }
            },
            _proxyCourse: function (data) { //课程授权给机构
                var title;
                this.select = data.select;
                switch (data.select) {
                    case 0:
                        if (data.item.get('statelv').type == 3) {
                            if (data.item.get('isproxy') == 1) {
                                //swal({
                                    title=  localName.CourseManage.courseMView.course+' [' + data.item.get('name') + '] '+localName.CourseManage.courseMView.auth+' ['+data.item.get('agencyname')+' ]！';
                               // })
                            } else {
                                this.showAgencyChooseView(data.item.get('_id'), data.item.get('userid'));
                                this.eventBus.on(this.eventNames.chooseAgencyComplete, this._chooseAgencyComplete, this);
                            }
                        } else {
                           // swal({
                                title= localName.CourseManage.courseMView.course+' [' + data.item.get('name') + '] '+localName.CourseManage.courseMView.cin+ ' [' + data.item.get('statelv').name + '] '+localName.CourseManage.courseMView.statusSingle;
                            //})
                        }
                        break;
                    case 3:
                        if (data.item.get('isproxy') == 1) {
                            //swal({
                                title= localName.CourseManage.courseMView.course+' [' + data.item.get('name') + '] '+localName.CourseManage.courseMView.toAuth+' ！';
                            //})
                        } else {
                            this.showAgencyChooseView(data.item.get('_id'), data.item.get('userid'));
                            this.eventBus.on(this.eventNames.chooseAgencyComplete, this._chooseAgencyComplete, this);
                        }
                        break;
                }
                
                if (!this.views.generateMsgModalView) {
                    this.views.generateMsgModalView = new GenerateMsgModalView({
                        //eventBus: this.eventBus,
                        //el: this.els.openDialog
                        //title:title
                    });
                }
                $(this.els.openDialog).append(this.views.generateMsgModalView.render(title));
            },
            showAgencyChooseView: function (courseid, teacherid) {
                if (this.views.agencyChooseView) this.views.agencyChooseView.remove();

                this.views.agencyChooseView = new AgencyChooseView({
                    courseid: courseid,
                    teacherid: teacherid,
                    eventBus: this.eventBus
                });
                this.views.agencyChooseView.on(this.eventNames.generateCourseComplete, this._generateNewCourse, this);
                $(this.el).append(this.views.agencyChooseView.render().el);
            },
            _chooseAgencyComplete: function (data) {
                this.proxyModel = new CourseModel();
                var params = JSON.stringify({
                    courseid:data['courseid'],
                    teacherid:data['teacherid'],
                    agencyid:data['agencyid'],
                    status:this.proxyStaus.apply,
                    confirm:0,
                    timestamp:new Date().getTime()
                });
                this.proxyModel.on(this.eventNames.proxyComplete, this._proxyCourseComplete, this);
                this.proxyModel.proxyCourse(params);
            },

            _proxyCourseComplete: function (json) {
                var title;
                if (json.state == false) {
                    //swal({
                        title=json.msg;
                    //});
                } else if (json.state == true) {
                    //swal({
                        title= json.msg;
                    //});
                    this.views.newCourseTabView = null;
                    this.views.sellOutCourseTabView = null;
                    this.views.proxyCourseTabView = null;
                    this.refresh();
                };

                if (!this.views.generateMsgModalView) {
                    this.views.generateMsgModalView = new GenerateMsgModalView({
                        //eventBus: this.eventBus,
                        //el: this.els.openDialog
                        //title:title
                    });
                }
                $(this.els.openDialog).append(this.views.generateMsgModalView.render(title));
            },
            _pushCourseComplete: function (json) {
                var title;
                if (json.state == false) {
                    //swal({
                        title= localName.CourseManage.courseMView.operate;
                    //});
                } else if (json.state == true) {
                    this.views.newCourseTabView.currentItem = null;

                    var msg = localName.CourseManage.courseMView.course+' [' + json.data.name + '] '+localName.CourseManage.courseMView.change +' '+ localName.CourseManage.courseMView.waitState;

                    this.models.newCoursesCollection.get(json.data._id).set(json.data);

                    this.eventBus.trigger(this.eventNames.emitCourseMsg, {
                        msg: {
                            info: msg,
                            time: this._formatDate(new Date())
                        }
                    });

                    //swal({
                        title= msg;
                    //});

                }

                if (!this.views.generateMsgModalView) {
                    this.views.generateMsgModalView = new GenerateMsgModalView({
                        //eventBus: this.eventBus,
                        //el: this.els.openDialog
                        //title:title
                    });
                }
                $(this.els.openDialog).append(this.views.generateMsgModalView.render(title));
            },
            _pubCourseComplete: function (json) {
                var title;
                if (json.state) {
                    switch (this.pubSelState) {
                        case 0:
                            this.models.newCoursesCollection.remove(json.data._id);
                            this.views.newCourseTabView.currentItem = null;
                            break;
                        case 2:
                            this.models.actCourseCollection.remove(json.data._id);
                            this.views.actCourseTabView.currentItem = null;
                            break;
                        case 3:
                            this.models.selloutCourseCollection.remove(json.data._id);
                            this.views.sellOutCourseTabView.currentItem = null;
                            break;
                    }


                    var model = new CourseModel(json.data);

                    this.models.pubCourseCollection.add(model, {at: 0});


                    var msg = localName.CourseManage.courseMView.course+' [' + json.data.name + '] '+localName.CourseManage.courseMView.change +' '+localName.CourseManage.courseMView.release;
                    this.eventBus.trigger(this.eventNames.emitCourseMsg, {
                        msg: {
                            info: msg,
                            time: this._formatDate(new Date())
                        }
                    });
                   // swal({
                        title= msg;
                   // })
                } else {
                   // swal({
                        title= localName.CourseManage.courseMView.operate;
                   // })
                };

                if (!this.views.generateMsgModalView) {
                    this.views.generateMsgModalView = new GenerateMsgModalView({
                        //eventBus: this.eventBus,
                        //el: this.els.openDialog
                        //title:title
                    });
                }
                $(this.els.openDialog).append(this.views.generateMsgModalView.render(title));
            },
            _prepareCourseComplete: function (json) {
                var title;
                if (json.state) {
                    this.models.pubCourseCollection.remove(json.data._id);
                    this.models.actCourseCollection.add(new CourseModel(json.data), {
                        at: 0
                    });
                    this.views.pubCourseTabView.currentItem = null;

                    var msg = localName.CourseManage.courseMView.course+' [' + json.data.name + '] '+localName.CourseManage.courseMView.change+' '+localName.CourseManage.courseMView.ready;
                    this.eventBus.trigger(this.eventNames.emitCourseMsg, {
                        msg: {
                            info: msg,
                            time: this._formatDate(new Date())
                        }
                    });

                    if (this.selStuView) {
                        this.selStuView.remove();
                    }

                    //swal({
                        title=msg;
                   // });
                } else {
                   // swal({
                        title=localName.CourseManage.courseMView.operate;
                    //});
                }

                if (!this.views.generateMsgModalView) {
                    this.views.generateMsgModalView = new GenerateMsgModalView({
                        //eventBus: this.eventBus,
                        //el: this.els.openDialog
                        //title:title
                    });
                }
                $(this.els.openDialog).append(this.views.generateMsgModalView.render(title));

            },
            _beginCourseComplete: function (json) {
                var title;
                if (json.state) {

                    this.models.actCourseCollection.get(json.data._id).set(json.data);

                    this.views.actCourseTabView.currentItem = null;

                    var msg = localName.CourseManage.courseMView.course+' [' + json.data.name + '] '+localName.CourseManage.courseMView.change +" "+localName.CourseManage.courseMView.acting;
                    this.eventBus.trigger(this.eventNames.emitCourseMsg, {
                        msg: {
                            info: msg,
                            time: this._formatDate(new Date())
                        }
                    });

                   // swal({
                        title= msg;
                   // })
                } else {
                   // swal({
                        title=localName.CourseManage.courseMView.operate;
                   // });
                };

                if (!this.views.generateMsgModalView) {
                    this.views.generateMsgModalView = new GenerateMsgModalView({
                        //eventBus: this.eventBus,
                        //el: this.els.openDialog
                        //title:title
                    });
                }
                $(this.els.openDialog).append(this.views.generateMsgModalView.render(title));
            },
            _endCourseComplete: function (json) {
                var title;
                if (json.state) {
                    this.models.actCourseCollection.get(json.data._id).set(json.data);

                    this.views.actCourseTabView.currentItem = null;

                    var msg = localName.CourseManage.courseMView.course+' [' + json.data.name + '] '+localName.CourseManage.courseMView.change +' '+localName.CourseManage.courseMView.end;
                    this.eventBus.trigger(this.eventNames.emitCourseMsg, {
                        msg: {
                            info: msg,
                            time: this._formatDate(new Date())
                        }
                    });

                   // swal({
                        title= msg;
                  //  });
                } else {
                    //swal({
                        title=localName.CourseManage.courseMView.operate;
                   // });
                }

                if (!this.views.generateMsgModalView) {
                    this.views.generateMsgModalView = new GenerateMsgModalView({
                        //eventBus: this.eventBus,
                        //el: this.els.openDialog
                        //title:title
                    });
                }
                $(this.els.openDialog).append(this.views.generateMsgModalView.render(title));
            },
            _selloutCourseComplete: function (json) {
                var title;
                if (json.state) {
                    switch (this.selloutSelState) {
                        case 1:
                            this.models.pubCourseCollection.remove(json.data._id);
                            break;
                        case 2:
                            this.models.actCourseCollection.remove(json.data._id);
                            break;
                    }

                    this.models.selloutCourseCollection.add(new CourseModel(json.data), {
                        at: 0
                    });
                    this.views.actCourseTabView.currentItem = null;

                    var msg = localName.CourseManage.courseMView.course+' [' + json.data.name + '] '+localName.CourseManage.courseMView.change + ' '+localName.CourseManage.courseMView.offShelf;
                    this.eventBus.trigger(this.eventNames.emitCourseMsg, {
                        msg: {
                            info: msg,
                            time: this._formatDate(new Date())
                        }
                    });

                    //swal({
                        title= msg;
                   // })
                } else {
                    //swal({
                        title=localName.CourseManage.courseMView.operate;
                    //})
                }
                if (!this.views.generateMsgModalView) {
                    this.views.generateMsgModalView = new GenerateMsgModalView({
                        //eventBus: this.eventBus,
                        //el: this.els.openDialog
                        //title:title
                    });
                }
                $(this.els.openDialog).append(this.views.generateMsgModalView.render(title));
            },
            _formatDate: function (myDate) {
                var fmt = '';        //获取当前年份(2位)
                fmt = fmt + myDate.getFullYear();    //获取完整的年份(4位,1970-????)
                fmt = fmt + '-' + (myDate.getMonth() + 1);       //获取当前月份(0-11,0代表1月)
                fmt = fmt + '-' + myDate.getDate();        //获取当前日(1-31)
                fmt = fmt + ' ' + myDate.getHours();       //获取当前小时数(0-23)
                fmt = fmt + ':' + myDate.getMinutes();     //获取当前分钟数(0-59)

                return fmt;
            },
            showSelectStudentPanel: function () {
                var selStuView = new SelectStudentsView();
                this.selStuView = selStuView;
                $(this.el).append(selStuView.render().el);
                selStuView.on(this.eventNames.selectStudentConfirm, this._selectStudentConfirm, this);
                selStuView.fetchSignedStudents(this.prepareSelect.item.get('_id'));
            },
            _selectStudentConfirm: function (json) {
                switch (this.prepareSelect.select) {
                    case 1:
                        if (this.prepareSelect.item.get('statelv').type == 0) {
                            this.prepareModel = new CourseModel();
                            this.prepareModel.set(this.prepareSelect.item.toJSON());
                            this.prepareModel.on(this.eventNames.prepareComplete, this._prepareCourseComplete, this);
                            this.prepareModel.prepareCourse(json.data);

                        } else {

                        }
                        break;
                }
            }
        });
        return v;
    });
