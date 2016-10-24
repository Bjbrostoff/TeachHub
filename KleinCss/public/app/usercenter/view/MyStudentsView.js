/**
 * Created by cs on 2016/1/27.
 */
define('app/usercenter/view/MyStudentsView',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/usercenter/template/MyStudentsView.ejs',
        'app/usercenter/view/mystudents/MyStudentsListView',
        'app/usercenter/view/mystudents/MyStudentsFilterView',
        'app/usercenter/collection/mystudents/MyStudentsListDataCollection',
        'app/usercenter/collection/mystudents/MyStudentsFilterDataCollection',
        'app/usercenter/collection/mystudents/MyStudentsChartCollection',
        'app/usercenter/view/myfavorites/MyFavoritesChartDescView',
        'i18n!/nls/uchome.js'
    ],
    function (_, Backbone, $, tmpl,MyStudentsListView,MyStudentsFilterView,
              MyStudentsListDataCollection,MyStudentsFilterDataCollection,MyStudentsChartCollection,
              FavoritesChartDescView,MyStudents) {
        var v = Backbone.View.extend({
            el: '.mystudents-container',
            events: {
                'click li.mystudents-nav-tab': 'myStudentsTabChangeHandler',
                'click #btn-refresh': 'btnRefresh_clickHandler',
                'click #btn-trash': 'btnTrash_clickHandler',
                'click #btn-search': 'btnSearch_clickHandler'
            },
            elms: {
                'tabs': ".mystudents-nav-tab",
                'list': "#mystudents-list",
                'chart':"#mystudents-chart",
                'chartId':"mystudents-chart",
                'chartDesc':"#mystudents-chart-desc",
                'filter':"#mystudent-filter"
            },
            states: {
                all: -1,//所有
                schooling: 0, //正在上课
                finished: 1  //已经结束
            },
            initialize: function (option) {
                if (option.state)  this.curState = option.state
                else this.curState = this.states.all;
                var arr=MyStudents.MyStudents.dayNames;
                this.eventBus = option.eventBus;
                this.views = {};
                this.collections = {};
                this.template = _.template(tmpl);
                this.collections.students = new MyStudentsListDataCollection();
                this.collections.charts = new MyStudentsChartCollection();
                this.collections.filters = new MyStudentsFilterDataCollection();
                this.collections.filters.add([
                    {day:"0",name: arr[0]},{day:"7",name: arr[1]},{day:"1",name: arr[2]},{day:"2",name: arr[3]},
                    {day:"3",name: [4]},{day:"4",name: [5]},{day:"5",name: [6]},{day:"6",name: [7]}
                    ]);
                this.eventBus.on('myStudents-showCourseHistoryInfo', this.showCourseHistoryInfo, this);
                this.eventBus.on('myStudents-showDetailInfo', this.showTeacherDetailInfo, this);
            },
            showListView: function (state,searchKey) {
                var self = this;
                var keyword = "";
                if (searchKey) keyword = searchKey;
                this.collections.students.fetch({
                    data: $.param({usertype:0,state: state,keyword:keyword})
                }).complete(function () {
                    if (!self.views.studentsListView) {
                        self.views.studentsListView = new MyStudentsListView({
                            eventBus: self.eventBus,
                            students: self.collections.students
                        });
                        $(self.elms.list).append(self.views.studentsListView.render().el);
                    } else {
                        $(self.elms.list).append(self.views.studentsListView.render(self.collections.students).el);
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
            initFilter:function(){
                if (!this.views.filterView) {
                    this.views.filterView = new MyStudentsFilterView({
                        eventBus: this.eventBus,
                        filters:this.collections.filters
                    });
                    $(this.elms.filter).append(this.views.filterView.render().el);
                }
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
                var mStarlevel = MyStudents.MyStudents.level;
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
                                degree:MyStudents.MyStudents.degree,//"学位"
                                servexerti:tcredinfo.servexerti
                            },
                            optioninfo:tcredinfo.info
                        }
                    });
                    $(self.el).append(self.views.teacherDetailInfoView.render().el);
                });
            },
            myStudentsTabChangeHandler: function (evt) {
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
                    url: '/mod/user/modMyTeachers?usertype=0&count=40',
                    type: 'get',
                    success: function (json) {
                        self.showListView(self.curState);
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
                $(this.el).html(this.template({locale:MyStudents}));
                this.initFilter();
                this.showListView(this.states.all);
                this.showChart();
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