/**
 * Created by Administrator on 2016/1/9.
 */
define('app/usercenter/view/sthomework/CreateCheckedView',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/usercenter/template/sthomework/CreateCheckedView.ejs',
        'app/usercenter/view/sthomework/CreateCheckedFindBox',
        'app/usercenter/model/sthomework/CreateCheckedModel',
        'i18n!/nls/uchome.js'
    ],
    function(_, Backbone, $, tmpl, CreateCheckedFindBox,  CreateCheckedModel,StudentHomework){
        var v = Backbone.View.extend({
            events:{
                'click .sthw-checked-find-view-tab':'sthCheckedFindBox_Handler'
            },
            initialize:function(options){
                //if (options.hasOwnProperty('eventBus')){
                //    this.eventBus = options.eventBus;
                //}
                this.template = _.template(tmpl);

                this.elems = {
                    'sthomeworkcontainer':'.sthomework-container'
                };
                this.views = {

                }
            },
            render:function(resp){
                $(this.el).html(this.template({
                    data:resp,
                    locale:StudentHomework
                }));
                this.data = resp;
                return this;
               // this.shchecked_findHandler();
            },
            sthCheckedFindBox_Handler:function(evt){
                var num =  $(evt.currentTarget).attr("num");
                if (this.views.checkedFindsthView) this.views.checkedFindsthView.remove();
                if (!this.views.checkedFindsthView) {
                    this.views.checkedFindsthView = new CreateCheckedFindBox({
                        eventBus: this.eventBus
                    });
                }

                var data = this.data;
                $(this.elems['sthomeworkcontainer']).append(this.views.checkedFindsthView.render(data[num]).el);
                $('.summernote').summernote({
                    lang: 'zh-CN', // default: 'en-US'
                    height:242,
                    toolbar: [
                        //['style', ['style']], // no style button
                        ['style', ['bold', 'italic', 'underline', 'clear']],
                        ['fontsize', ['fontsize']],
                        ['color', ['color']],
                        ['para', ['ul', 'ol', 'paragraph']],
                        ['height', ['height']]
                        //['insert', ['picture', 'link']], // no insert buttons
                        //['table', ['table']], // no table button
                        //['help', ['help']] //no help button
                    ]
                });
                var checkedfindshwview = this.views.checkedFindsthView;
                $(document).ready(function(){
                    $(".sth-checked-findbox-close").click(function(){
                        checkedfindshwview.remove();
                    });
                });

            },
            save:function(){

            },
            cancel:function(){

            },
            closeView_handler:function(){
                this.remove();
            }
        });
        return v;
    });
