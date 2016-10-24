define('app/agenciescenter/view/studentmanage/StudentManageMoreView',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/agenciescenter/template/studentmanage/StudentManageMoreView.ejs',
        'i18n!/nls/achome.js',
    ],
    function(_, Backbone, $, tmpl,StudentManage){
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
            render:function(data){
                $(this.el).html(this.template({
                    data:data,
                    locale:StudentManage
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
