define('app/usercenter/view/myhomework/FindMyHomeworkBoxView',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/usercenter/template/myhomework/FindMyHomeworkBoxView.ejs',
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
            closeFindBoxView_handler:function(){
                this.remove();
            },
            sthCheckedSubmit_handler:function(){

            }
        });
        return v;
    });
