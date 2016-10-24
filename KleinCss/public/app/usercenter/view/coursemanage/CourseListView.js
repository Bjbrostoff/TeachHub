define('app/usercenter/view/coursemanage/CourseListView',
[
    'underscore',
    'backbone',
    'jquery',
    'text!/app/usercenter/template/coursemanage/CourseListView.ejs',
    'app/usercenter/view/coursemanage/GenerateMsgModalView',
    'i18n!/nls/uchome.js',
    'sweetalert'
],
function(_, Backbone, $, tmpl,GenerateMsgModalView,localName){
    var v = Backbone.View.extend({
        events:{
            'click .course-manage-course-detail':'courseDetail_clickHandler',
            'click .course-manage-forum-item':'courseItem_clickHandler',
            'click .course-manage-btn-pub':'coursePub_clickHandler',
            'click .course-manage-btn-sellout':'courseSellout_clickHandler',
            'click .course-manage-btn-prepare':'coursePrepare_clickHandler',
            'click .course-manage-btn-begin':'courseBegin_clickHandler',
            'click .course-manage-btn-end':'courseEnd_clickHandler',
            'click .course-manage-btn-push':'coursePush_clickHandler',
            'click .course-manage-btn-proxy':'courseProxy_clickHandler',
        },
        initialize:function(options){
            if (!options.hasOwnProperty('eventBus')){
                this.eventBus = options.eventBus;
            }
            this.selectlv = options.selectlv || 0;
            this.template = _.template(tmpl);
            this.elems = {
                'detailBtn':'.course-manage-course-detail',
                'courseItem':'.course-manage-forum-item',
                'openDialog':'#course-manage-open-dialog'
            };
            this.currentItem = null;
            this.views={};
            this.eventNames = {
                'detail':'course-manage-detail-btn-did-click',
                'pub':'course-manage-pub-btn-did-click',
                'sellout':'course-manage-sellout-btn-did-click',
                'prepare':'course-manage-prepare-btn-did-click',
                'begin':'course-manage-begin-btn-did-click',
                'end':'course-manage-end-btn-did-click',
                'push':'course-manage-push-btn-did-click',
                'proxy':'course-manage-proxy-btn-did-click'
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
            $(this.elems.courseItem).removeClass('activeone');

            var itemId = $(evt.currentTarget).attr('dataid');
            var select = parseInt($(evt.currentTarget).attr('select'));

            var item = this.collection.get(itemId);
            if (item) this.currentItem = {item:item,select:select};

            $(evt.currentTarget).addClass('activeone');
        },
        coursePub_clickHandler:function(){
            if (!this.currentItem) {
               // swal({
                var  title=localName.CourseManage.courseList.noChoose;
                if (!this.views.generateMsgModalView) {
                    this.views.generateMsgModalView = new GenerateMsgModalView({
                    });
                }
                $(this.elems.openDialog).append(this.views.generateMsgModalView.render(title));
                //});
                return;
            }
            this.trigger(this.eventNames.pub, this.currentItem);
        },
        courseSellout_clickHandler:function(){
            if (!this.currentItem) {
                //swal({
                var title=localName.CourseManage.courseList.noChoose;
                if (!this.views.generateMsgModalView) {
                    this.views.generateMsgModalView = new GenerateMsgModalView({
                    });
                }
                $(this.elems.openDialog).append(this.views.generateMsgModalView.render(title));
               // });
                return;
            }
            this.trigger(this.eventNames.sellout, this.currentItem)
        },
        coursePrepare_clickHandler:function(){
            if (!this.currentItem) {
                //swal({
                var title=localName.CourseManage.courseList.noChoose;
                if (!this.views.generateMsgModalView) {
                    this.views.generateMsgModalView = new GenerateMsgModalView({
                    });
                }
                $(this.elems.openDialog).append(this.views.generateMsgModalView.render(title));
                //})
                ;return;
            }
            this.trigger(this.eventNames.prepare, this.currentItem)
        },
        courseBegin_clickHandler:function(){
            if (!this.currentItem) {
               // swal({
                var title=localName.CourseManage.courseList.noChoose;
                if (!this.views.generateMsgModalView) {
                    this.views.generateMsgModalView = new GenerateMsgModalView({
                    });
                }
                $(this.elems.openDialog).append(this.views.generateMsgModalView.render(title));
               // });
                return;
            }
            this.trigger(this.eventNames.begin, this.currentItem)
        },
        courseEnd_clickHandler:function(){
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
            this.trigger(this.eventNames.end, this.currentItem)
        },
        coursePush_clickHandler:function(){
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
            this.trigger(this.eventNames.push, this.currentItem)
        },
        courseProxy_clickHandler:function(){
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
            this.trigger(this.eventNames.proxy, this.currentItem)
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
