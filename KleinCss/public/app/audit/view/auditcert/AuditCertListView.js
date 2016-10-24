/**
 * Created by apple on 16/1/17.
 */
define('app/audit/view/auditcert/AuditCertListView',
[
    'underscore',
    'jquery',
    'backbone',

    'text!/app/audit/template/auditcert/AuditCertListView.ejs',
    "app/audit/view/auditcert/AuditCertDetailView",
    'i18n!/nls/audit.js'
],
function(_, $, Backbone, tmpl,AuditCertDetailView,localName){
    var v = Backbone.View.extend({
        el:this.el,
        events:{
            //'click .audit-course-btn-audit':'audit_clickHandler',
            //'click .audit-course-forum-item':'item_clickHandler'
        },
        initialize:function(options){

            this.options = options;
            this.template = _.template(tmpl);

            this.elems = {
                waitItemChkbox:'.audit-cert-wait-check',
                detailBtn:'.audit-cert-btn-detail',
                prepareBtn:'#audit-precert-btn-audit',
                auditBtn:'.audit-cert-btn-audit',
                auditCertBtn:"#audit-cert-btn-audit"

            }
            this.views = {};



            this.currentId = null;
        },
        render:function(){
            var self = this;
            $(this.el).html(this.template({
                data:this.collection.toJSON(),
                status:this.options.state,
                local:localName
            }));
            $(this.elems.prepareBtn).click(function(){
                self.prepare_clickHandler();
            });
            $(this.elems.detailBtn).click(function(){
                self.auditdetail_clickHandler();
            });
            $(this.elems.auditCertBtn).click(function(){
                self.auditdetail_clickHandler("1");

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

                this.collection.actingAuditCert(codes);
            }else{
                alert(localName.auditCert.chooseOne);
            }
        },
        auditdetail_clickHandler:function(isDetail){
            var chks = $(this.elems.waitItemChkbox+':checked');
            if (chks.length == 1){
                var code = $(chks[0]).attr('code');

                this.showDetailCertView( this.collection.get(code),isDetail);
            }else{
                alert(localName.auditCert.chooseOne);
            }
        },showDetailCertView:function(data,isDetail){

            if(this.views.auditCertDetailView){
                this.views.auditCertDetailView.remove();
            }
            this.views.auditCertDetailView = new AuditCertDetailView({
                model:data,
                isdetail:isDetail

            })
            $(this.el).append(this.views.auditCertDetailView.render().el);

        }
    });
    return v;
})
