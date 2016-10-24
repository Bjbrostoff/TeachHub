define('app/agenciescenter/view/StudentManageView',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/agenciescenter/template/StudentManageView.ejs',
        'app/agenciescenter/view/studentmanage/StudentManageListView',
        'app/agenciescenter/view/studentmanage/StudentManageFilterView',
        'app/agenciescenter/collection/studentmanage/StudentManageListDataCollection',
        'app/agenciescenter/collection/studentmanage/StudentManageFilterDataCollection',
        'app/agenciescenter/collection/studentmanage/StudentManageChartCollection',
        'app/usercenter/view/myfavorites/MyFavoritesChartDescView',
        'i18n!/nls/achome.js',
        'jquery.slimscroll'
    ],
    function (_, Backbone, $, tmpl,StudentManageListView,StudentManageFilterView,
              StudentManageListDataCollection,StudentManageFilterDataCollection,StudentManageChartCollection,
              FavoritesChartDescView,StudentManage) {
        var v = Backbone.View.extend({
            el: '.studentmanage-container',
            events: {
                'click li.studentmanage-nav-tab': 'StudentManageTabChangeHandler',
                'click #btn-search': 'btnSearch_clickHandler'
            },
            elms: {
                'list': "#studentmanage-list",
                'chart':"#agencies-studentmanage-chart",
                'chartId':"mystudents-chart",
                'chartDesc':"#agencies-studentmanage-chart-desc",
                'filter':"#agencies-studentmanage-filter"
            },
            states: {
                all: -1,//所有
                schooling: 0, //正在上课
                finished: 1  //已经结束
            },
            initialize: function (option) {
                this.eventBus = option.eventBus;
                this.views = {};
                this.collections = {};
                this.template = _.template(tmpl);
                this.collections.students = new StudentManageListDataCollection();
                this.collections.charts = new StudentManageChartCollection();
                this.collections.filters = new StudentManageFilterDataCollection();
                this.collections.filters.add([
                    {day:"0",name: "全部"},{day:"7",name: "星期日"},{day:"1",name: "星期一"},{day:"2",name: "星期二"},
                    {day:"3",name: "星期三"},{day:"4",name: "星期四"},{day:"5",name: "星期五"},{day:"6",name: "星期六"}
                    ])
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
                        self.views.studentsListView = new StudentManageListView({
                            eventBus: self.eventBus,
                            students: self.collections.students
                        });
                        $(self.elms.list).append(self.views.studentsListView.render(self.collections.students).el);
                    } else {
                        $(self.elms.list).append(self.views.studentsListView.render(self.collections.students).el);
                    }
                    $('#agencies-studentmanage-listscroll').slimScroll({
                        height: '500px'

                    });
                });
            },
            showChart:function(){
                var self = this;
                var colors = ['#87d6c6', '#54cdb4', '#1ab394'];
                //this.collections.charts.fetch({}).complete(function () {
                    //var charts =  self.collections.charts;
                    //var datas = charts.toJSON()[0];
                    //$(self.elms.chart).empty();
                    //if (datas.total && datas.total > 0) {
                    //    Morris.Donut({
                    //        element: self.elms.chartId,
                    //        data: datas.data,
                    //        resize: true,
                    //        colors: datas.colors
                    //    });
                    //    self.views.favoritesChartDescView = new FavoritesChartDescView({
                    //        eventBus: self.eventBus,
                    //        el: self.elms.chartDesc,
                    //        datas: datas.data,
                    //        colors: datas.colors
                    //    });
                    //    $(self.elms.chartDesc).append(self.views.favoritesChartDescView.render().el);
                   // }
               // });
            },
            btnSearch_clickHandler: function () {
                var searchKey = $('#input-search').val();
                this.showListView(this.curState,searchKey);
            },
            initFilter:function(){
                if (!this.views.filterView) {
                    this.views.filterView = new StudentManageFilterView({
                        eventBus: this.eventBus,
                        filters:this.collections.filters
                    });
                    $(this.elms.filter).append(this.views.filterView.render().el);
                }
            },

            StudentManageTabChangeHandler: function (evt) {
                var state = parseInt($(evt.currentTarget).attr('data-state'));
                this.curState = state;
                this.showListView(state);
            },
            render: function () {
                $(this.el).html(this.template({locale:StudentManage}));
                this.initFilter();
                this.showListView(this.states.all);
                this.showChart();
                this.changeBackGround();
                return this;

            },
            changeBackGround:function () {
                $(".studentmanage-nav-tab").click(function (e) {
                    $(this).parent().children().removeClass("on");
                    $(this).addClass("on");
                });
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