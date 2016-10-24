/**
 * Created by cs on 2016/1/1.
 */
define('app/usercenter/view/MyFavoritesView',
    [
        'underscore',
        'backbone',
        'jquery',

        'text!/app/usercenter/template/MyFavoritesView.ejs',
        'app/usercenter/collection/myfavorites/MyFavoritesTypesCollection',
        'app/usercenter/collection/myfavorites/MyFavoritesDataCollection',
        'app/usercenter/collection/myfavorites/MyFavoritesChartCollection',
        'app/usercenter/collection/myfavorites/TcredInfoCollection',
        'app/usercenter/view/myfavorites/MyFavoritesToolbarView',
        'app/usercenter/view/myfavorites/MyFavoritesDataTableView',
        'app/usercenter/view/myfavorites/MyFavoritesChartDescView',
        'app/usercenter/view/myfavorites/CourseDetailInfoView',
        'app/usercenter/view/myfavorites/TeacherDetailInfoView',
        'app/usercenter/view/PaginationView',
        'i18n!/nls/uchome.js'
    ],
    function (_, Backbone, $, tmpl, FavoritesTypesCollection, FavoritesDataCollection,FavoritesChartCollection,
              TcredInfoCollection,FavoritesToolbarView, FavoritesDataTableView,FavoritesChartDescView,
              CourseDetailInfoView,TeacherDetailInfoView,PaginationView,MyFavorites) {
        var v = Backbone.View.extend({
            el: '.myfavorites-container',
            events: {
                'click li.myfavorite-nav-tab':'myFavoriteNavTabChangeHandler',
                'click #btn-search': 'btnSearch_clickHandler',
                'click #btn-refresh': 'btnRefresh_clickHandler',
                'click #btn-trash': 'btnTrash_clickHandler'
            },
            initialize: function (option) {
                this.eventBus = option.eventBus;
                this.els = {
                    'chart': 'myfavorite-chart',
                    'chartDesc': '#myfavorite-chart-desc', //Morris图表下面的描述
                    'courseListEl':'#myfavorite-tab-course',
                    'teacherListEl':'#myfavorite-tab-teacher',
                    'agencyListEl':'#myfavorite-tab-agency',
                    'allListEl':'#myfavorite-tab-all',
                    'detailEl':'#myfavorite-detail-container',
                    'list':'#myfavorite-list',
                    'tabs':'.myfavorite-nav-tab',
                    'pagination':'#myfavorite-pagination'
                },
                this.eventNames ={
                    favPageJumpEvent:'fav-pageJumpEvent'
                },
                this.viewType = 1; //0:table,1:list
                this.curType = 1;
                this.pageNum = 0;
                this.collections = {};
                this.views = {};
                this.template = _.template(tmpl);
                this.collections.favoritesTypesCollection = new FavoritesTypesCollection();
                this.collections.favoritesDataCollection = new FavoritesDataCollection();
                this.collections.favoritesChartCollection = new FavoritesChartCollection();
                this.collections.tcredInfoCollection = new TcredInfoCollection();
                this.eventBus.on('myFavorite-showDetailInfo', this.showDetailInfo, this);
                this.eventBus.on('myFavorite-toolbar-changed', this.TabChangeHandler, this);
                this.eventBus.on(this.eventNames.favPageJumpEvent, this.FavPageJumpEvent, this);
            },
            myFavoriteNavTabChangeHandler:function(evt){
                var type = parseInt($(evt.currentTarget).attr('data-type'));
                var self = this;
                _.each($(this.els.tabs), function (el) {
                    if ($(el).attr("data-type") == self.curType) {
                        $(el).removeClass("on");
                    }else if ($(el).attr("data-type") == type) {
                        $(el).addClass("on");
                    }
                });
               // $(evt.currentTarget).parent().addClass("on");
                this.curType = type;
                this._showCourseTable(type,this.pageNum, false);
            },
            TabChangeHandler:function(type){
                _.each($(this.els.tabs), function (el) {
                    if ($(el).attr("data-type") == type) {
                        //link at <a>
                        $(el)[0].children[0].click();
                    }
                });
            },
            FavPageJumpEvent:function(pageNum){
                this._showCourseTable(this.curType,pageNum,false);
            },
            //初始化Favorites Table()
            _showCourseTable:function(type,pageNum,resetChart){
               switch (type){
                    case 1:
                    default:
                        this.appendTable('courseListView',pageNum,this.els.courseListEl,type,resetChart);
                        break;
                    case 2:
                        this.appendTable('teacherListView',pageNum,this.els.teacherListEl,type,resetChart);
                        break;
                    case 3:
                        this.appendTable('agencyListView',pageNum,this.els.agencyListEl,type,resetChart);
                        break;
                    case 0:
                        this.appendTable('allListView',pageNum,this.els.allListEl,type,resetChart);
                        break;
                }
            },
            appendTable:function(viewKey,pageNum,elm,type,resetChart) {
                var self = this;
                if (!this.views[viewKey]) {
                    var view = new FavoritesDataTableView({
                        viewType: type,
                        eventBus: this.eventBus,
                        el: elm,
                        datas: this.collections.favoritesDataCollection
                    });
                    this.views[viewKey] = view;
                }
                if (!this.views['pagination']) {
                    var view = new PaginationView({
                        viewType: type,
                        eventBus: this.eventBus,
                        el: self.els.pagination,
                        datas: this.collections.favoritesDataCollection
                    });
                    this.views['pagination'] = view;
                }
                //$(elm).addClass("active");
                $(elm).addClass("on");
                this.collections.favoritesDataCollection.fetch({
                    data: $.param({type: type,page:pageNum,limit:10})
                }).complete(function () {
                    $(elm).append(self.views[viewKey].render().el);
                    $(elm).append(self.views['pagination'].render().el);
                    if(resetChart)
                        self.initChart();//重新初始化图表
                });
            },
            //详情
            showDetailInfo:function(type,datas){
                if (this.views.DetailInfoView)
                    this.views.DetailInfoView.remove();
                switch (type){
                    case "course":
                        this.views.DetailInfoView = new CourseDetailInfoView({
                            course:datas
                        });
                        $(this.el).append(this.views.DetailInfoView.render().el);
                        break;
                    case "teacher":
                        var mStarlevel =MyFavorites.MyFavorites.mStarlevel; //["无星级","一星级","二星级","三星级","四星级","五星级"];
                        var tcredid = datas.teacher.tcredid;
                        var self = this;
                        this.collections.tcredInfoCollection.fetch({
                            data: $.param({id: tcredid})
                        }).complete(function () {
                            var tcredinfo = self.collections.tcredInfoCollection.toJSON()[0];
                            self.views.DetailInfoView = new TeacherDetailInfoView({
                                teacher:{
                                    userinfo:{
                                        uuid: datas.teacher._id,
                                        name: datas.teacher.name,
                                        sex:datas.teacher.sex,
                                        age:datas.teacher.age,
                                        nationality: datas.teacher.nationality,
                                        city: datas.teacher.city,
                                        portrait:datas.teacher.portrait?datas.teacher.portrait:"/inspinia/img/a1.jpg"
                                    },
                                    custominfo:{
                                        starlevel:mStarlevel[parseInt(tcredinfo.acadecerti.level)],
                                        degree:MyFavorites.MyFavorites.degree,
                                        servexerti:tcredinfo.servexerti
                                    },
                                    optioninfo:tcredinfo.info
                                }
                            });
                            $(self.el).append(self.views.DetailInfoView.render().el);
                        });
                        break;
                }
            },
            //图表
            initChart:function(){
                var self = this;
                var datas = [];
                this.collections.favoritesChartCollection.fetch().complete(function () {
                    var collect =  self.collections.favoritesChartCollection;
                    var results = collect.toJSON()[0];
                    $('#myfavorite-chart').empty();
                    if (results.total && results.total > 0) {
                        Morris.Donut({
                            element: self.els.chart,
                            data: results.data,
                            resize: true,
                            colors: results.colors
                        });
                        self.views.favoritesChartDescView = new FavoritesChartDescView({
                            eventBus: self.eventBus,
                            el: self.els.chartDesc,
                            datas: results.data,
                            colors: results.colors
                        });
                        $(self.els.chartDesc).append(self.views.favoritesChartDescView.render().el);
                    }
                });
            },
            btnSearch_clickHandler: function () {
                var searchKey = $('#input-search').val();
            },
            btnRefresh_clickHandler: function () {
                var self = this;
                $.ajax({
                    url: '/mod/user/modMyTeachers?count=40',
                    type: 'get',
                    success: function (json) {
                        self._showCourseTable(this.curType,true);
                    }
                });
            },
            btnTrash_clickHandler: function () {
                var self = this;
                $.ajax({
                    url:'/mod/user/clearMyTeachersTestData',
                    type:'get',
                    success:function(json){
                        $(self.els.chartDesc).empty();
                        $(self.els.courseListEl).empty();
                        $(self.els.teacherListEl).empty();
                        $(self.els.agencyListEl).empty();
                        $(self.els.allListEl).empty();
                        $('#myfavorite-chart').empty();
                    }
                });

            },
            render: function () {
                var self = this;
                this.collections.favoritesTypesCollection.fetch().complete(function () {
                    $(self.el).html(self.template(
                        {
                            types: self.collections.favoritesTypesCollection.toJSON(),
                            locale:MyFavorites
                        }))
                    var obj = self.collections.favoritesTypesCollection.at(0);
                    var type = parseInt(obj.attributes.type);
                    this.curType = type;
                    self._showCourseTable(type,true);

                });
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
            }
        });
        return v;
    })
