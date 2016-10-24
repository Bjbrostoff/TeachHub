/**
 * 课程授权管理
 * Created by cs on 2016/3/12.
 */
define('app/usercenter/view/coursemanage/CourseProxyListView',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/usercenter/template/coursemanage/CourseProxyListView.ejs',
        'app/usercenter/view/coursemanage/GenerateMsgModalView',
        'i18n!/nls/uchome.js',
        'sweetalert'
    ],
    function(_, Backbone, $, tmpl,GenerateMsgModalView,localName){
        var v = Backbone.View.extend({
            events:{
                'click .course-manage-course-detail':'courseDetail_clickHandler',
                'click .course-manage-forum-item':'courseItem_clickHandler',
                'click .course-manage-proxy-operate':'proxyOperate_clickHandler',
            },
            initialize:function(options){
                if (!options.hasOwnProperty('eventBus')){
                    this.eventBus = options.eventBus;
                }
                this.selectlv = options.selectlv || 0;
                this.template = _.template(tmpl);
                this.views={};
                this.elems = {
                    'detailBtn':'.course-manage-course-detail',
                    'courseItem':'.course-manage-forum-item',
                    'openDialog':'#course-manage-open-dialog'
                };
                this.currentItem = null;
                this.eventNames = {
                    'detail':'course-manage-detail-btn-did-click',
                    'proxyOperate':'course-manage-proxy-operate-btn-did-click'
                };

            },
            render:function(){
                $(this.el).html(this.template({
                    selectlv:this.selectlv,
                    datas:this.collection.toJSON(),
                    local:localName
                }));

                return this;
            },
            activeListener:function(){
                this.collection.on('remove', this.collection_removeHandler, this);
                this.collection.on('add', this.collection_addHandler, this);
                this.collection.on('change', this.collection_changeHandler, this);
            },
            courseDetail_clickHandler:function(){
                if (!this.currentItem) {
                    //swal({
                    var title=localName.CourseManage.courseList.noChoose;
                    if (!this.views.generateMsgModalView) {
                        this.views.generateMsgModalView = new GenerateMsgModalView({
                        });
                    }
                    $(this.elems.openDialog).append(this.views.generateMsgModalView.render(title));
                    //});
                    return;
                }
                this.trigger(this.eventNames.detail, this.currentItem);
            },
            courseItem_clickHandler:function(evt){
                $(this.elems.courseItem).removeClass('active');

                var itemId = $(evt.currentTarget).attr('dataid');
                var select = parseInt($(evt.currentTarget).attr('select'));

                var item = this.collection.get(itemId);
                if (item) this.currentItem = {item:item.get('course'),isproxy:true};

                $(evt.currentTarget).addClass('active');
            },
            proxyOperate_clickHandler:function(e){
                var id = $(e.currentTarget).attr('data-id');
                var data = this.collection.get(id);
                var proxyStatus =  $(e.currentTarget).attr('data-proxy-status');//要改变的状态
                this.trigger(this.eventNames.proxyOperate, data,proxyStatus);
            },
            collection_removeHandler:function(){
                this.render();

            },
            collection_addHandler:function(){
                this.render();
            },
            collection_changeHandler:function(){
                this.render();
            }
        });
        return v;
    })
