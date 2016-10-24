/**
 * Created by Administrator on 2016/1/19.
 */
define('app/usercenter/view/sthomework/CreateCheckedFindBox',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/usercenter/template/sthomework/CreateCheckedFindBox.ejs',
        'i18n!/nls/uchome.js'
    ],
    function(_, Backbone, $, tmpl,StudentHomework){
        var v = Backbone.View.extend({
            //el:'.sthomework-checkbox-field',
            events:{

            },
            initialize:function(options){
                if (options.hasOwnProperty('eventBus')){
                    this.eventBus = options.eventBus;
                }
                this.template = _.template(tmpl);
                this.views = {};
                this.elems = {};

            },
            render:function(resp){
                $(this.el).html(this.template({
                    data:resp,
                    locale:StudentHomework
                }));
                return this;

            },
            closeCheckedFindBoxView_handler:function(){
                this.remove();
            },
            sthCheckedSubmit_handler:function(){

            }
        });
        return v;
    });
