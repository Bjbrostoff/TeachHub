/**
 * Created by Administrator on 2016/1/17.
 */
define('app/usercenter/view/StudentHomeView',
    [
        'underscore',
        'backbone',
        'jquery',
        'jqueryui',

        'text!/app/usercenter/template/StudentHomeView.ejs',

        'app/usercenter/view/stuhome/CalendarView',
        'app/usercenter/collection/stuhome/CalendarCollection',

        'app/usercenter/view/stuhome/DetailInfoView',
        'app/usercenter/collection/stuhome/DetailInfoCollection',
        'app/usercenter/model/stuhome/DetailInfoModel',
        'i18n!/nls/uchome.js'


        //'app/usercenter/collection/home/InfoCollection',
        //'app/usercenter/view/home/InfoView',
        //'app/usercenter/model/home/InfoModel',
        //

        //
        //'app/usercenter/view/home/HomeRightView',
        //'app/usercenter/collection/home/HomeRightCollection',
        //
        //
        //'app/usercenter/view/home/RightArrangeCalendarView',
        //'app/usercenter/collection/home/RightArrangeCalendarCollection',
        //
        //'app/usercenter/view/home/TodayInfoView',
        //'app/usercenter/collection/home/TodayInfoCollection'



    ],
    function (_, Backbone, $, jqueryui,
              tmpl,
              CalendarView,CalendarCollection,
              DetailInfoView,DetailInfoCollection,DetailInfoModel,
              localName

    ) {
        var v = Backbone.View.extend({
            el: '.home-container',
            events: {
                'click .close-link': 'removeDetailInfo'
            },
            initialize: function (option) {
                this.eventBus = option.eventBus;
                this.els = {
                    'myCalendar': '#home-student-act-calendar',
                    'myInfo': '#home-student-act-info',
                    'myHomeRight': '#home-student-act-right',
                    'myDetailInfo': '#detail-container'

                };
                this.models = {};
                this.views = {};
                this.models = {
                    //'myInfoCollection': new InfoCollection(),
                    'myCalendarCollection': new CalendarCollection()
                    //'myHomeRightCollection': new HomeRightCollection()
                };

                this.eventNames = {
                    'globalMsg': 'global-msg'
                };
                this.eventBus.on('eventClick', this.showDetailInfo, this);
                this.eventBus.on('dayClick', this.removeDetailInfo, this);
                this.eventBus.on(this.eventNames.globalMsg, this._globalMsg, this);

                this.template = _.template(tmpl);
            },
            render: function () {
                $(this.el).html(this.template({
                    locale:localName
                }));


                this.showCalendar();
                this._refreshBindElem();
                return this;

            },

            showCalendar:function(){
                if (!this.views.myCalendarView) {
                    this.views.myCalendarView = new CalendarView({
                        eventBus: this.eventBus,
                        el: this.els.myCalendar,
                        collection: this.models.myCalendarCollection

                    });
                }

                var self = this;
                $(self.els.myCalendar).append(self.views.myCalendarView.render().el);
                this.models.myCalendarCollection.fetch({
                    success: function (collection, resp) {
                        var calData=[];
                        for(var i=0;i<resp.data.length;i++){
                            var a={
                                start:resp.data[i].tdate,
                                ch:resp.data[i].courseid,
                                title:resp.data[i].name,
                                color: '#178fe6'
                            };
                            calData.push(a);
                        }
                        self.views.myCalendarView.buildCalendar(calData);
                    }
                });
            },
            removeDetailInfo: function () {
                $(this.els.myDetailInfo).empty();
            },
            showDetailInfo:function(data){
                this.removeDetailInfo();
                if (!this.views.detailInfoView) {
                    this.views.detailInfoView = new DetailInfoView({
                            eventBus: this.eventBus,
                            el: this.els.myDetailInfo
                        }
                    );
                }
                var self = this;
                var tdate=data.start.format().substring(0,19);
                var searchDate={
                    id:data.ch,
                    date:tdate.replace(/T/i,' ')
                };
                var detailModel=new DetailInfoModel();
                detailModel.getDetailInfo(searchDate);
                detailModel.on('success',function(json){
                    $(self.els.myDetailInfo).append(self.views.detailInfoView.render(json).el);
                });
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
            _globalMsg: function (data) {
                var model = new InfoModel();
                model.set(data.msg);
                this.models.myInfoCollection.add(model, {
                    at: 0
                })
            }

        });
        return v;
    })
