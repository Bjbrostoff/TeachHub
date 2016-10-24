define('app/agenciescenter/view/HomeView',
    [
        'underscore',
        'backbone',
        'jquery',
        'jqueryui',

        'text!/app/agenciescenter/template/HomeView.ejs',

        'app/agenciescenter/view/home/CalendarView',
        'app/agenciescenter/collection/home/CalendarCollection',

        'app/agenciescenter/view/home/DetailInfoView',
        'app/agenciescenter/model/home/DetailInfoModel',

        'app/agenciescenter/view/home/HomeRightView',
        'app/agenciescenter/collection/home/HomeRightCollection',

        'i18n!/nls/uchome.js'

    ],
    function (_, Backbone, $, jqueryui,
              tmpl,

              CalendarView,
              CalendarCollection,

              DetailInfoView,
              DetailInfoModel,

              HomeRightView,
              HomeRightCollection,

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
                    'myCalendar': '#home-manage-act-calendar',
                    'myHomeRight': '#home-manage-act-right',
                    'myDetailInfo': '#detail-container'

                };
                this.models = {};
                this.views = {};
                this.models = {
                    'myCalendarCollection': new CalendarCollection(),
                    'myHomeRightCollection': new HomeRightCollection()
                };
                this.template = _.template(tmpl);
                this.eventNames = {
                    'dayClick': 'dayClick',
                    'eventClick': 'eventClick'
                };

                this.eventBus.on('dayClick', this.removeDetailInfo, this);
                this.eventBus.on('eventClick', this.showDetailInfo, this);



            },
            render: function () {
                $(this.el).html(this.template({
                    locale:localName
                }));
                this.showMyCalendar();
                this.showMyHomeRight();
                this._refreshBindElem();
                return this;

            },
            showMyCalendar: function () {
                if (!this.views.myCalendarView) {
                    this.views.myCalendarView = new CalendarView({
                        eventBus: this.eventBus,
                        el: this.els.myCalendar
                        //collection: this.models.myCalendarCollection
                    });
                }

                var self = this;
               $(self.els.myCalendar).append(self.views.myCalendarView.render().el);
                var calData=[];
                this.models.myCalendarCollection.fetch({
                    success: function (collection, resp) {
                        if(resp.state){
                            for(var j=0;j<resp.result.length;j++){
                                var a;
                                if(resp.result[j].state!=0){
                                 a={
                                     start: resp.result[j].tdate,
                                     ch: resp.result[j].courseid,
                                     title: resp.result[j].name,
                                     editable:false,
                                     color:'#D2B48C'
                                 };
                                }else{
                                    a={
                                        start: resp.result[j].tdate,
                                        ch: resp.result[j].courseid,
                                        title: resp.result[j].name,
                                        editable:false,
                                        color: '#178fe6'

                                    };
                                }

                                calData.push(a);
                            };
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
                    success:function(collection,resp){
                        if(resp.imgUrl==undefined)
                        {resp.imgUrl='/images/test/touxiang.jpg';}
                        $(self.els.myHomeRight).append(self.views.myHomeRightView.render(resp).el);
                    }
                });
            },
            showDetailInfo: function (data) {
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
                    var part;
                    if(data.di!=undefined){
                        part=0;
                        json.info=[];
                    }else{
                        part=1;
                    }
                    json.part=part;
                    $(self.els.myDetailInfo).append(self.views.detailInfoView.render(json).el);
                });


            },
            removeDetailInfo: function () {
                $(this.els.myDetailInfo).empty();
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
    });

