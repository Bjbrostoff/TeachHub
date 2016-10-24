define('app/agenciescenter/view/home/CalendarView',
    [
        'underscore',
        'backbone',
        'jquery',
        'moment',
        'fullcalendar',
        'text!/app/agenciescenter/template/home/Calendar.ejs',
        'app/agenciescenter/model/home/CalendarModel',
        'i18n!/nls/uchome.js'
    ],
    function (_, Backbone, $, moment, fullcalendar, tmpl,model,local) {
        var v = Backbone.View.extend({
            events: {
            },
            initialize: function (option) {
                this.eventBus = option.eventBus;
                this.template = _.template(tmpl);
                this.elems = {
                    'calendar': '#agency-home-calendar'
                };

                this.eventBus.on('success', this.renderEvent, this);
                this.eventBus.on('cancel', this.removeEvent, this);


            },
            render: function () {
                $(this.el).html(this.template({}));
                return this;
            },
            buildCalendar: function (data) {
                var self = this;
                $(this.elems.calendar).fullCalendar({
                    header: {
                        left: '',
                        center: 'title',
                        right: 'prev,today,next'
                    },
                    //defaultDate: t,
                    eventLimit: true,
                    weekMode: 'liquid',
                    eventDurationEditable: false,//不允许跨天
                    buttonText: {
                        today: local.Home.CalendarView.today
                    },
                    monthNames: local.Home.CalendarView.monthNames,
                    dayNamesShort: local.Home.CalendarView.dayNamesShort,
                    dayNames: local.Home.CalendarView.dayNames,
                    events: data,
                    eventClick: function (calEvent, jsEvent, view) {
                        self.eventBus.trigger('eventClick', calEvent);
                    },
                    dayClick: function (date, jsEvent, view) {
                        self.eventBus.trigger('dayClick');
                    }
                });
            },
        });
        return v;
    })