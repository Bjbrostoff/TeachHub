/**
 * Created by apple on 16/1/17.
 */
define('app/audit/view/auditcourse/AuditCourseView',
[
    'underscore',
    'jquery',
    'backbone',

    'text!/app/audit/template/auditcourse/AuditCourseView.ejs',

    'app/audit/view/auditcourse/AuditCourseListView',

    'app/audit/collection/AuditCourseCollection',

    'app/audit/view/auditcourse/AuditCourseAnalysisView',
    'i18n!/nls/audit.js'
],
function(_, $, Backbone, tmpl,
         AuditCourseListView,
         AuditCourseCollection,
     AuditCourseAnalysisView,localName){
    var v = Backbone.View.extend({
        el:'.auditcourse-container',
        initialize:function(){
            this.template = _.template(tmpl);

            this.views = {};

            this.collections = {};

            this.elems = {
                waitList:'#audit-course-wait-tab',
                actList:'#audit-course-act-tab',
                doneList:'#audit-course-done-tab'

            };

            this.eventNames = {
                selectPrepareAuditCourse:'select-parepare-audit-course',
                auditCourseItemDidClick:'audit-course-item-did-click'
            }

            this.collections.waitCollection = new AuditCourseCollection();
            this.collections.waitCollection.on('get-audit-courses', this._getAuditCourses, this);

            this.collections.actCollection = new AuditCourseCollection();
            this.collections.actCollection.on('get-audit-courses', this._getAuditCourses, this);

            this.collections.doneCollection = new AuditCourseCollection();
            this.collections.doneCollection.on('get-audit-courses', this._getAuditCourses, this);

            this.views.waitView = new AuditCourseListView({
                el:this.elems.waitList,
                state:'wait',
                collection:this.collections.waitCollection
            });
            this.views.waitView.on(this.eventNames.selectPrepareAuditCourse, this._selectPrepareAuditCourse, this);

            this.views.actView = new AuditCourseListView({
                el:this.elems.actList,
                state:'act',
                collection:this.collections.actCollection
            });
            this.views.actView.on(this.eventNames.auditCourseItemDidClick, this._auditCourseItemDidClick, this);

            this.views.doneView = new AuditCourseListView({
                el:this.elems.doneList,
                state:'done',
                collection:this.collections.doneCollection
            });
        },
        render:function(){
            $(this.el).html(this.template({
                local:localName
            }));
            return this;
        },
        loadAuditCourses:function(){
            this.views.waitView.render().actListener();
            this.views.actView.render()
                .actListener();
            this.views.doneView.render()
                .actListener();

            this.collections.waitCollection.getAuditCourses('wait');
            this.collections.actCollection.getAuditCourses('act');
            this.collections.doneCollection.getAuditCourses('done');
        },
        hide:function(){
            $(this.el).css({
                'display':'none'
            });
        },
        show:function(){
            $(this.el).css({
                'display':'block'
            });
        },
        _getAuditCourses:function(msg){
            switch (msg.type){
                case 'wait':
                    this.views.waitView.render();
                    break;
                case 'act':
                    this.views.actView.render();
                    break;
                case 'done':
                    this.views.doneView.render();
                    break;
            }

        },
        //选中的待审核课程
        _selectPrepareAuditCourse:function(arr){
            var items = [];
            for (var i=0; i<arr.data.length;i++){
                var item = this.collections.waitCollection.get(arr.data[i]);
                items.push(item);
            }

            this.collections.waitCollection.markAuditId(arr.data);
            /*
            this.collections.actCollection.add(items);
            this.collections.waitCollection.remove(items);
            */
        },
        //审核item被点击，弹出审核页面
        _auditCourseItemDidClick:function(evt){
            var itemid = evt.data;
            var analysisView = new AuditCourseAnalysisView();
            $(this.el).append(analysisView.render().el);
            analysisView.fetchAuditAnalysisMsg(itemid);
        }

    });
    return v;
})
