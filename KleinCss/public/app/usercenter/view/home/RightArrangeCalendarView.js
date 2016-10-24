/**
 * Created by Administrator on 2016/1/5.
 */
define('app/usercenter/view/home/RightArrangeCalendarView',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/usercenter/template/home/RightArrangeCalendar.ejs',
        'icheck',
        'i18n!/nls/uchome.js'
    ],
    function(_, Backbone, $, tmpl,icheck,local){
        var v = Backbone.View.extend({
            initialize:function(option){
                this.eventBus = option.eventBus;
                this.template = _.template(tmpl);
                this.eventBus.on('drop',this.getTimeAndDay,this);
            },
            render:function(result){
                $(this.el).html(this.template({
                    calendarData:result,
                    local:local.Home.RightArrange
                }));
                this.preparePage();
                return this;
            },
            preparePage:function(){
                $(document).ready(function () {
                    $('.i-checks').iCheck({
                        checkboxClass: 'icheckbox_square-blue',
                        radioClass: 'iradio_square-blue'
                    });

                    $('#external-events div.external-event').each(function () {
                        $(this).data('event', {
                            ch: $(this).attr('_id'),
                            title: $.trim($(this).text()),
                            stick: true
                        });
                        $(this).draggable({
                            zIndex: 1111999,
                            revert: true,
                            revertDuration: 0
                        });
                    });
                });
            },
            getTimeAndDay:function(){
              console.log(222)
            }

        });
        return v;
    })