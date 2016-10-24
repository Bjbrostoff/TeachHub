/**
 * Created by Administrator on 2016/2/18.
 */
define('app/usercenter/view/myhomework/SubmitedMyHomeworkView',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/usercenter/template/myhomework/SubmitedMyHomeworkView.ejs',
        'app/usercenter/view/myhomework/FindMyHomeworkBoxView',
        'i18n!/nls/uchome.js'
    ],
    function(_, Backbone, $, tmpl ,FindMyHomeworkBoxView,MyHomework){
        var v = Backbone.View.extend({
            events:{
                'click .mhw-find-view-tab':'myhFindBox_Handler'
            },
            initialize:function(options){
                //if (options.hasOwnProperty('eventBus')){
                //    this.eventBus = options.eventBus;
                //}
                this.template = _.template(tmpl);
                this.views = {

                };
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
            myhFindBox_Handler:function(evt){
                var modelid =  $(evt.currentTarget).attr("modelid");
                var model = this.collection.get(modelid);
                if (this.views.findBoxMyHomeworkView) {
                    this.views.findBoxMyHomeworkView.remove();
                    this.views.findBoxMyHomeworkView = undefined;
                }
                if (!this.views.findBoxMyHomeworkView) {
                    this.views.findBoxMyHomeworkView = new FindMyHomeworkBoxView({
                        eventBus: this.eventBus,
                        model: model
                    });
                }

                $(this.elems['myhomework-container']).append(this.views.findBoxMyHomeworkView.render().el);
                var findboxviewmhwview =  this.views.findBoxMyHomeworkView;
                $(document).ready(function(){
                    $(".myhomework-findbox-close").click(function(){
                        findboxviewmhwview.remove();
                    });
                });
                $(document).ready(function(){
                    $(".my-homework-nav-tab").click(function(){
                        findboxviewmhwview.remove();
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
