/**
 * Created by cs on 2016/1/19.
 */
define('app/usercenter/view/MyTeachersView',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/usercenter/template/MyTeachersView.ejs',
        'app/usercenter/view/myteachers/MyTeachersListView',
        'app/usercenter/view/myteachers/CourseDetailInfoView',
        'app/usercenter/collection/myteachers/MyTeachersListDataCollection',
        'app/usercenter/collection/myteachers/MyTeachersCourseDataCollection',
        'app/usercenter/collection/myteachers/MyTeachersChartCollection',
        'app/usercenter/collection/myfavorites/TcredInfoCollection',
        'app/usercenter/view/myfavorites/TeacherDetailInfoView',
        'app/usercenter/view/myfavorites/MyFavoritesChartDescView',
        'i18n!/nls/uchome.js'
    ],
    function (_, Backbone, $, tmpl, TeachersListView, CourseDetailInfoView, TeachersListDataCollection,
              TeachersCourseDataCollection,TeachersChartCollection,TcredInfoCollection,TeacherDetailInfoView,
              FavoritesChartDescView,MyTeachers) {
        var v = Backbone.View.extend({
            el: '.myteachers-container',
            events: {
                'click li.myteachers-nav-tab': 'myTeachersTabChangeHandler',
                'click #btn-refresh': 'btnRefresh_clickHandler',
                'click #btn-trash': 'btnTrash_clickHandler',
                'click #btn-search': 'btnSearch_clickHandler'
            },
            elms: {
                'tabs': ".myteachers-nav-tab",
                'list': "#myteachers-list",
                'chartId':"myteachers-chart",
                'chart':"#myteachers-chart",
                'chartDesc':"#myteachers-chart-desc"
            },
            states: {
                all: -1,//所有
                schooling: 0, //正在上课
                finished: 1  //已经结束
            },
            initialize: function (option) {
                if (option.state)  this.curState = option.state
                else this.curState = this.states.all;
                this.eventBus = option.eventBus;
                this.views = {};
                this.collections = {};
                this.template = _.template(tmpl);
                this.collections.teachers = new TeachersListDataCollection();
                this.collections.courses = new TeachersCourseDataCollection();
                this.collections.charts = new TeachersChartCollection();
                this.collections.tcredInfoCollection = new TcredInfoCollection();
                this.eventBus.on('myTeachers-showCourseHistoryInfo', this.showCourseHistoryInfo, this);
                this.eventBus.on('myTeachers-showDetailInfo', this.showTeacherDetailInfo, this);
            },
            showListView: function (state,searchKey) {
                var self = this;
                var keyword = "";
                if (searchKey) keyword = searchKey;
                this.collections.teachers.fetch({
                    data: $.param({state: state,keyword:keyword})
                }).complete(function () {
                    if (!self.views.teachersListView) {
                        self.views.teachersListView = new TeachersListView({
                            eventBus: self.eventBus,
                            teachers: self.collections.teachers
                        });
                        $(self.elms.list).append(self.views.teachersListView.render().el);
                    } else {
                        $(self.elms.list).append(self.views.teachersListView.render(self.collections.teachers).el);
                    }
                });
            },
            showChart:function(){
                var self = this;
                var colors = ['#87d6c6', '#54cdb4', '#1ab394'];
                this.collections.charts.fetch({}).complete(function () {
                    var charts =  self.collections.charts;
                    var datas = charts.toJSON()[0];
                    $(self.elms.chart).empty();
                    if (datas.total && datas.total > 0) {
                        Morris.Donut({
                            element: self.elms.chartId,
                            data: datas.data,
                            resize: true,
                            colors: datas.colors
                        });
                        self.views.favoritesChartDescView = new FavoritesChartDescView({
                            eventBus: self.eventBus,
                            el: self.elms.chartDesc,
                            datas: datas.data,
                            colors: datas.colors
                        });
                        $(self.elms.chartDesc).append(self.views.favoritesChartDescView.render().el);
                    }

                });
            },
            showCourseHistoryInfo: function (teacherId, stateType) {
                var self = this;
                if (this.views.CourseHistoryInfoView)
                    this.views.CourseHistoryInfoView.remove();
                this.collections.courses.fetch({
                    data: $.param({teacherid: teacherId, stateType: stateType})
                }).complete(function () {
                    self.views.CourseHistoryInfoView = new CourseDetailInfoView({
                        courses: self.collections.courses.toJSON()
                    });
                    $(self.el).append(self.views.CourseHistoryInfoView.render().el);
                });
            },
            showTeacherDetailInfo: function (teacher) {
                var mStarlevel = MyTeachers.MyTeachers.mStarlevel;//["无星级","一星级","二星级","三星级","四星级","五星级"]
                var tcredid = teacher.tcredid;
                var self = this;
                this.collections.tcredInfoCollection.fetch({
                    data: $.param({id: tcredid})
                }).complete(function () {
                    var tcredinfo = self.collections.tcredInfoCollection.toJSON()[0];
                    self.views.teacherDetailInfoView = new TeacherDetailInfoView({
                        teacher:{
                            userinfo:{
                                uuid: teacher._id,
                                name: teacher.name,
                                sex: teacher.sex,
                                age:teacher.age,
                                nationality: teacher.nationality,
                                city:teacher.city,
                                portrait:teacher.portrait?teacher.portrait:"/inspinia/img/a1.jpg"
                            },
                            custominfo:{
                                starlevel:mStarlevel[parseInt(tcredinfo.acadecerti.level)],
                                degree:MyTeachers.MyTeachers.degree,//"学位"
                                servexerti:tcredinfo.servexerti
                            },
                            optioninfo:tcredinfo.info
                        }
                    });
                    $(self.el).append(self.views.teacherDetailInfoView.render().el);
                });
            },
            myTeachersTabChangeHandler: function (evt) {
                var state = parseInt($(evt.currentTarget).attr('data-state'));
                var self = this;
                _.each($(this.elms.tabs), function (el) {
                    if ($(el).attr("data-state") == self.curState) {
                        $(el).removeClass("on");
                    } else if ($(el).attr("data-state") == state) {
                        $(el).addClass("on");
                    }
                });
                this.curState = state;
                this.showListView(state);
            },
            btnRefresh_clickHandler: function () {
                var self = this;
                $.ajax({
                    url: '/mod/user/modMyTeachers?count=40',
                    type: 'get',
                    success: function (json) {
                        self.showListView(self.curType);
                        self.showChart();
                    }
                });
            },
            btnTrash_clickHandler: function () {
                var self = this;
                $.ajax({
                    url: '/mod/user/clearMyTeachersTestData',
                    type: 'get',
                    success: function (json) {
                        $(self.elms.list).empty();
                        $(self.elms.chart).empty();
                    }
                });
            },
            btnSearch_clickHandler: function () {
                var searchKey = $('#input-search').val();
                this.showListView(this.curState,searchKey);
            },
            render: function () {
                $(this.el).html(this.template({locale:MyTeachers}));
                this.showListView(this.states.all);
                //this.showChart();
                return this;
            },
            hide: function () {
                this._hide();
            },
            show: function () {
                this._show();
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
        });
        return v;
    })