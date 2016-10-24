/**
 * Created by Administrator on 2016/1/2.
 */
define('app/usercenter/view/home/CalendarView',
    [
        'underscore',
        'backbone',
        'jquery',
        'moment',
        'fullcalendar',
        'text!/app/usercenter/template/home/Calendar.ejs',
        'app/usercenter/model/home/CalendarModel',
        'i18n!/nls/uchome.js'
    ],
    function (_, Backbone, $, moment, fullcalendar, tmpl,model,local) {
        var v = Backbone.View.extend({
            events: {
                'click #btn': 'getResource'
            },
            initialize: function (option) {
                this.eventBus = option.eventBus;
                this.template = _.template(tmpl);
                this.elems = {
                    'calendar': '#home-calendar'
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
                    color:"#178fe6",
                    editable: true,
                    eventLimit: true,
                    droppable: true,
                    selectable: true,
                    weekMode: 'liquid',
                    eventDurationEditable: false,//不允许跨天
                    buttonText: {
                        today: local.Home.CalendarView.today,
                        prev:"<<",
                        next:">>"
                    },
                    monthNames: local.Home.CalendarView.monthNames,
                    dayNamesShort: local.Home.CalendarView.dayNamesShort,
                    dayNames: local.Home.CalendarView.dayNames,
                    events: data,
                    dayClick: function (date, jsEvent, view) {
                        self.eventBus.trigger('dayClick');
                    },
                    eventClick: function (calEvent, jsEvent, view) {
                        self.eventBus.trigger('eventClick', calEvent);
                    },
                    eventDrop: function (event, delta, revertFunc) {
                        alert(event.title +local.Home.CalendarView.move+ event.start.format());
                        if (!confirm(local.Home.CalendarView.confirm)) {
                            revertFunc();
                        }
                    },
                    eventDragStop: function (event,jsEvent) {
                        var fullcal=$(self.elems.calendar);
                        var ofs = fullcal.offset();
                        var x1 = ofs.left;
                        var x2 = ofs.left + fullcal.outerWidth(true);
                        var y1 = ofs.top;
                        var y2 = ofs.top + fullcal.outerHeight(true);
                        if (jsEvent.pageX <= x1 || jsEvent.pageX >= x2 || jsEvent.pageY <= y1 || jsEvent.pageY >= y2) {
                            self.removeEvent(event);

                        }
                    },
                    drop: function (date, jsEvent, ui, resourceId,a) {
                        self.eventBus.trigger('drop',date,jsEvent);

                    },
                    eventReceive:function(event){
                        self.eventBus.trigger('eventReceive',event);
                    }
                });

            },
            removeEvent:function(event){
                $(this.elems.calendar).fullCalendar('removeEvents',event._id);
                var time=event.start.format().replace(/T/i,' ');
                var date={
                    courseid:event.ch,
                    tdate:time
                };
                var calmodel=new model();
                calmodel.deleteOutCalendarDate(date);

            },
            renderEvent:function(event,time,dataEnd){
                var eventNew= {
                    start:event.start.format() +' '+time+':00',
                    title:event.title,
                    ch:event.ch
                };
                this.removeEvent(event);                           //先移除后将时间渲染进事件
                $(this.elems.calendar).fullCalendar('renderEvent', eventNew );
                dataEnd.start=eventNew.start;
                dataEnd.ch=eventNew.ch;
                dataEnd.title=eventNew.title;
                var calmodel=new model();
                calmodel.saveCalendarData(dataEnd);


            }
        });
        return v;
    });