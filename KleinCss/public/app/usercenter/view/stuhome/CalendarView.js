/**
 * Created by Administrator on 2016/1/17.
 */
define('app/usercenter/view/stuhome/CalendarView',
    [
        'underscore',
        'backbone',
        'jquery',
        'moment',
        'fullcalendar',
        'text!/app/usercenter/template/stuhome/Calendar.ejs',
        'i18n!/nls/uchome.js'
    ],
    function (_, Backbone, $, moment, fullcalendar, tmpl,local) {
        var v = Backbone.View.extend({
            events: {
                'click #btn': 'getResource'
            },
            initialize: function (option) {
                this.eventBus = option.eventBus;
                this.template = _.template(tmpl);
                this.elems = {
                    'calendar': '#home-calendar'
                }
            },
            render: function () {
                $(this.el).html(this.template({
                }));
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
                    editable: false,
                    eventLimit: false,
                    droppable: false,
                    selectable:false,
                    weekMode: 'liquid',
                    eventDurationEditable:false,//不允许跨天
                    buttonText:{
                        today: local.Home.CalendarView.today,
                        prev:"<<",
                        next:">>"
                    },
                    monthNames:local.Home.CalendarView.monthNames,
                    dayNamesShort: local.Home.CalendarView.dayNamesShort,
                    dayNames:local.Home.CalendarView.dayNames,
                    events:data,
                    eventClick: function(calEvent, jsEvent, view) {
                        self.eventBus.trigger('eventClick',calEvent);
                    },
                    dayClick: function (date, jsEvent, view) {
                        self.eventBus.trigger('dayClick');
                    }
                });

            },
        });
        return v;
    })