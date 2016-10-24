/**
 * Created by Administrator on 2016/2/18.
 */
define('app/usercenter/view/myhomework/CheckedMyHomeworkView',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/usercenter/template/myhomework/CheckedMyHomeworkView.ejs',
        'app/usercenter/view/myhomework/CheckedMyHomeworkFindView',
        'i18n!/nls/uchome.js'
    ],
    function(_, Backbone, $, tmpl, CheckedMyHomeworkFindView,MyHomework){
        var v = Backbone.View.extend({
            events:{
                'click .mhw-checked-find-view-tab':'myhCheckedFindBox_Handler'
            },
            initialize:function(options){
                //if (options.hasOwnProperty('eventBus')){
                //    this.eventBus = options.eventBus;
                //}
                this.template = _.template(tmpl);

                this.views = {};
                this.elems = {
                    'myhomework-container':'.myhomework-container'
                }
            },
            render:function(){
                $(this.el).html(this.template({
                    datas:this.collection.toJSON(),
                    locale:MyHomework
                }));
                return this;
            },
            myhCheckedFindBox_Handler:function(evt){
                var modelid =  $(evt.currentTarget).attr("modelid");
                var model = this.collection.get(modelid);
                if (this.views.checkedFindMyHomeworkView) this.views.checkedFindMyHomeworkView.remove();
                if (!this.views.checkedFindMyHomeworkView) {
                    this.views.checkedFindMyHomeworkView = new CheckedMyHomeworkFindView({
                        eventBus: this.eventBus,
                        model: model
                    });
                }

                $(this.elems['myhomework-container']).append(this.views.checkedFindMyHomeworkView.render().el);
                var checkedfindmhwview = this.views.checkedFindMyHomeworkView;
                $(document).ready(function(){
                    $(".myhomework-checkedfindbox-close").click(function(){
                        checkedfindmhwview.remove();
                    });
                });
                $(document).ready(function(){
                    $(".my-homework-nav-tab").click(function(){
                        checkedfindmhwview.remove();
                    });
                });

            },
            save:function(){

            },
            cancel:function(){

            }
        });
        return v;
    });
