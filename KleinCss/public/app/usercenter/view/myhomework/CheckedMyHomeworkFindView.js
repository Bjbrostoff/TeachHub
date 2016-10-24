/**
 * Created by Administrator on 2016/1/19.
 */
define('app/usercenter/view/myhomework/CheckedMyHomeworkFindView',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/usercenter/template/myhomework/CheckedMyHomeworkFindView.ejs',
        'i18n!/nls/uchome.js'
    ],
    function(_, Backbone, $, tmpl,MyHomework){
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
            render:function(){
                $(this.el).html(this.template({
                    fields:this.model.toJSON(),
                    locale:MyHomework
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
