/**
 * Created by apple on 16/1/17.
 */
define('app/audit/view/auditcourse/AuditCourseListView',
[
    'underscore',
    'jquery',
    'backbone',

    'text!/app/audit/template/auditcourse/AuditCourseListView.ejs',
    'i18n!/nls/audit.js'
],
function(_, $, Backbone, tmpl,localName){
    var v = Backbone.View.extend({
        events:{
            'click .audit-course-btn-audit':'audit_clickHandler',
            'click .audit-course-forum-item':'item_clickHandler'
        },
        initialize:function(options){
            this.options = {
                state:'wait'
            };
            _.extend(this.options, options);

            this.el = this.options.el;
            this.template = _.template(tmpl);

            this.elems = {
                waitItemChkbox:'.audit-course-wait-check',
                detailBtn:'.audit-course-btn-detail',
                prepareBtn:'.audit-course-btn-prepare',
                auditBtn:'.audit-course-btn-audit',
                auditItem:'.audit-course-forum-item',
                actItem:'.audit-course-forum-item[select="act"]'
            }

            this.eventNames = {
                selectPrepareAuditCourse:'select-parepare-audit-course'
            };

            this.currentId = null;
        },
        render:function(){
            $(this.el).html(this.template({
                state:this.options.state,
                data:this.collection.toJSON(),
                local:localName
            }));
            var self = this;
            $(this.elems.prepareBtn).click(function(evt){
                self.prepare_clickHandler(evt);
            });
            $(this.elems.auditItem).click(function(evt){
                self.item_clickHandler(evt);
            });
            $(this.elems.auditBtn).click(function(evt){
                self.audit_clickHandler(evt);
            })
            return this;
        },
        actListener:function(){
            this.collection.on('add', this._addAuditCourse, this);
            this.collection.on('remove', this._removeAuditCourse, this);
            return this;
        },
        _addAuditCourse:function(){
            this.render();
        },
        _removeAuditCourse:function(){
            this.render();
        },
        detail_clickHandler:function(){

        },
        prepare_clickHandler:function(){
            var chks = $(this.elems.waitItemChkbox+':checked');
            if (chks.length > 0){
                var codes = [];
                for (var i = 0; i < chks.length; i++){
                    var code = $(chks[i]).attr('code');
                    codes.push(code);
                }

                this.collection.actingAuditCourse(codes);
            }
        },
        audit_clickHandler:function(){
            if (!this.currentId) return;
            this.trigger('audit-course-item-did-click', {
                data:this.currentId
            });
        },
        item_clickHandler:function(evt){
            var state = $(evt.currentTarget).attr('select');
            switch(state){
                case 'wait':
                    break;
                case 'act':
                    this.currentId = $(evt.currentTarget).attr('dataid');

                    $(this.elems.actItem).removeClass('active');
                    $(evt.currentTarget).addClass('active');

                    break;
            }
        }
    });
    return v;
})
