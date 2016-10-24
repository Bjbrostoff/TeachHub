define('app/usercenter/view/HomeView',
    [
        'underscore',
        'backbone',
        'jquery',
        'jqueryui',

        'text!/app/usercenter/template/HomeView.ejs',

        'app/usercenter/view/home/CalendarView',
        'app/usercenter/collection/home/CalendarCollection',

        'app/usercenter/view/home/HomeRightView',
        'app/usercenter/collection/home/HomeRightCollection',

        'app/usercenter/view/home/DetailInfoView',
        'app/usercenter/collection/home/DetailInfoCollection',
        'app/usercenter/model/home/DetailInfoModel',

        'app/usercenter/view/home/RightArrangeCalendarView',
        'app/usercenter/collection/home/RightArrangeCalendarCollection',

        'app/usercenter/view/home/TodayInfoView',
        'app/usercenter/collection/home/TodayInfoCollection',
        'app/usercenter/model/home/TodayInfoModel',

        'app/usercenter/view/home/PerfectInfoView',
        'app/usercenter/model/home/PerfectInfoModel',

        'i18n!/nls/uchome.js'


    ],
    function (_, Backbone, $, jqueryui,
              tmpl,
              CalendarView,
              CalendarCollection,
              HomeRightView,
              HomeRightCollection,
              DetailInfoView,
              DetailInfoCollection,
              DetailInfoModel,
              RightArrangeCalendarView,
              RightArrangeCalendarCollection,
              TodayInfoView,
              TodayInfoCollection,
              TodayInfoModel,
              PerfectInfoView,
              PerfectInfoModel,
        LocaleHome) {
        var v = Backbone.View.extend({
            el: '.home-container',
            events: {
                'click .close-link': 'removeDetailInfo'
            },
            elms: {
                'tabs': ".change-background"
            },
            initialize: function (option) {
                this.eventBus = option.eventBus;
                this.els = {
                    'myCalendar': '#home-manage-act-calendar',
                    'myHomeRight': '#home-manage-act-right',
                    'myDetailInfo': '#detail-container',
                    'myArrangeCalendar': '#home-arrange-calendar',
                    'myTodayInfo': '#home-manage-act-today',
                    'myPerfectInfo': '#modal-content'

                };
                this.models = {};
                this.views = {};
                this.models = {
                    'myCalendarCollection': new CalendarCollection(),
                    'myHomeRightCollection': new HomeRightCollection(),
                    'myArrangeCalendarCollection': new RightArrangeCalendarCollection(),
                    'myDetailInfoCollection': new DetailInfoCollection(),
                    'myTodayInfoCollection': new TodayInfoCollection()
                };

                this.eventNames = {
                    'dayClick': 'dayClick',
                    'eventClick': 'eventClick'
                };

                this.eventBus.on('dayClick', this.showRightArrange, this);
                this.eventBus.on('eventClick', this.showDetailInfo, this);
                this.eventBus.on('eventReceive', this.showPerfectInfo, this);

                this.template = _.template(tmpl);


            },
            render: function () {

                $(this.el).html(this.template({
                    locale:LocaleHome
                }));
                this.showMyCalendar();
                this.showMyHomeRight();
                this.showTodayInfo();
                this._refreshBindElem();
                this.changeBackGround();
                return this;

            },
            changeBackGround:function () {
                $(".change-background").click(function (e) {
                    $(this).parent().children().removeClass("on");
                    $(this).addClass("on");
                });
            },
            showMyCalendar: function () {
                if (!this.views.myCalendarView) {
                    this.views.myCalendarView = new CalendarView({
                        eventBus: this.eventBus,
                        el: this.els.myCalendar,
                        collection: this.models.myCalendarCollection
                    });
                }

                var self = this;
                $(self.els.myCalendar).append(self.views.myCalendarView.render().el);
                var calData = [];
                this.models.myCalendarCollection.fetch({
                    success: function (collection, resp) {
                        if (resp.stuData.length > 0) {
                            for (var j = 0; j < resp.stuData.length; j++) {
                                var a = {
                                    start: resp.stuData[j].tdate,
                                    ch: resp.stuData[j].courseid,
                                    title: resp.stuData[j].name,
                                    editable: false,
                                    di: 0,                         //区分作为老师还是作为学生
                                    color: '#0EB83A'
                                };
                                calData.push(a);
                            }
                            ;
                        }
                        if (resp.teaData.length > 0) {
                            for (var i = 0; i < resp.teaData.length; i++) {
                                var a = {
                                    start: resp.teaData[i].tdate,
                                    ch: resp.teaData[i].courseid,
                                    title: resp.teaData[i].name,
                                    color: '#178fe6'
                                };
                                calData.push(a);
                            }
                        }
                        self.views.myCalendarView.buildCalendar(calData);
                    }
                });
            },

            showMyHomeRight: function () {
                if (!this.views.myHomeRightView) {
                    this.views.myHomeRightView = new HomeRightView({
                        eventBus: this.eventBus,
                        el: this.els.myHomeRight
                    });
                }
                var self = this;
                this.models.myHomeRightCollection.fetch({
                    success: function (collection, resp) {
                        if (resp.imgUrl == undefined) {
                            resp.imgUrl = '/images/test/touxiang.jpg';
                        }
                        $(self.els.myHomeRight).append(self.views.myHomeRightView.render(resp).el);
                    }
                });
            },
            showDetailInfo: function (data) {
                this.removeDetailInfo();
                this.removeRightArrange();
                if (!this.views.detailInfoView) {
                    this.views.detailInfoView = new DetailInfoView({
                            eventBus: this.eventBus,
                            el: this.els.myDetailInfo
                        }
                    );
                }
                var self = this;
                var tdate = data.start.format().substring(0, 19);
                var searchDate = {
                    id: data.ch,
                    date: tdate.replace(/T/i, ' ')
                };
                var detailModel = new DetailInfoModel();
                detailModel.getDetailInfo(searchDate);
                detailModel.on('success', function (json) {
                    var part;
                    if (data.di != undefined) {
                        part = 0;
                        json.info = [];
                    } else {
                        part = 1;
                    }
                    json.part = part;
                    $(self.els.myDetailInfo).append(self.views.detailInfoView.render(json).el);
                });


            },
            removeDetailInfo: function () {
                $(this.els.myDetailInfo).empty();
            },
            showRightArrange: function () {
                this.removeDetailInfo();
                this.removeRightArrange();
                if (!this.views.myArrangeCalendarView) {
                    this.views.myArrangeCalendarView = new RightArrangeCalendarView({
                        eventBus: this.eventBus,
                        el: this.els.myArrangeCalendar
                    });
                }
                var self = this;
                this.models.myArrangeCalendarCollection.fetch({
                    success: function (collection, resp) {
                        var result = [];
                        for (var i = 0; i < resp.length; i++) {
                            var t = {
                                _id: resp[i]._id,
                                name: resp[i].name,
                            };
                            result.push(t);
                        }
                        $(self.els.myArrangeCalendar).append(self.views.myArrangeCalendarView.render(result).el);
                    }
                })
            },
            removeRightArrange: function () {
                $(this.els.myArrangeCalendar).empty();
            },
            showTodayInfo: function () {
                if (!this.views.myTodayInfoView) {
                    this.views.myTodayInfoView = new TodayInfoView({
                        eventBus: this.eventBus,
                        el: this.els.myTodayInfo,
                        collection: this.models.myTodayInfoCollection
                    });

                }
                var d = this.getMonday();
                var arr = [];
                for (var i = 0; i < 7; i++) {
                    arr.push(d.getFullYear() + '-' + this.appendZero(d.getMonth() + 1) + '-' + this.appendZero(d.getDate()) + ' ' + '00:00:00');
                    d.setDate(d.getDate() + 1);
                }
                var todayModel = new TodayInfoModel();
                todayModel.getWeekArrange(arr);

                var self = this;
                var endData = [];
                for (var i = 0; i < arr.length; i++) {
                    arr[i] = arr[i].substring(0, 10);
                }
                var time = LocaleHome.Home.CalendarView.oneWeekName;
                var a = [];
                todayModel.on('success', function (json) {
                    a.push(json.Mon);
                    a.push(json.Tues);
                    a.push(json.Wed);
                    a.push(json.Thur);
                    a.push(json.Fri);
                    a.push(json.Sat);
                    a.push(json.Sun);
                    for (var i = 0; i < a.length; i++) {
                        if (a[i].data.length > 0) {
                            var ad = a[i].data[0].tdate.substring(0, 10);
                            var che;
                            var stu = [];
                            for (var m = 0; m < a[i].data.length; m++) {
                                var dat = a[i].data[m];
                                var part = dat.tdate.substring(0, 10);
                                for (var k = 0; k < arr.length; k++) {
                                    if (part == arr[k]) {
                                        che = time[k];
                                        break;
                                    }
                                }
                                var s = {
                                    name: a[i].data[m].name,
                                    student: a[i].data[m].students,
                                    address:a[i].data[m].address,
                                    cdata:a[i].data[m].tdate.substring(11,16)
                                };
                                stu.push(s);
                            }

                            var end = {
                                date: che,
                                info: stu,
                                i: ad
                            };
                            endData.push(end);
                        }
                    }
                    var resultData=self.sortByKey(endData,'i');
                    console.log(resultData);
                    $(self.els.myTodayInfo).append(self.views.myTodayInfoView.render(resultData).el);
                });

            },
            //获取当前周的星期一日期
            getMonday: function () {
                var d = new Date();
                var day = d.getDay();
                var date = d.getDate();
                if (day == 1){
                    return d;
                }
                if (day == 0){
                    d.setDate(date - 6);
                }
                else{
                    d.setDate(date - day + 1);
                }
                return d;


            },
            appendZero: function (obj) {
                if (obj < 10) return "0" + "" + obj;
                else return obj;
            },
            //对结果数据排序
            sortByKey: function (array, key) {
                return array.sort(function (a, b) {
                    var x = a[key];
                    var y = b[key];
                    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                });
            },
            //?
            showPerfectInfo: function (event) {
                var self = this;
                var id = event.ch;
                if (!this.views.myPerfectView) {
                    this.views.myPerfectView = new PerfectInfoView({
                        el: '#homeview-course-define-dialog',
                        eventBus: this.eventBus,
                        model: new PerfectInfoModel(),
                        calendarData: event
                    });
                } else {

                    this.views.myPerfectView.options.model = new PerfectInfoModel();
                    this.views.myPerfectView.options.calendarData = event;
                }
                self.views.myPerfectView.fetchStudents(id);

            },
            show: function () {
                this._show();
            },
            hide: function () {
                this._hide();
            },
            _refreshBindElem: function () {
                this.elems = {
                    'dom': $('.page-content-home')
                }
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
