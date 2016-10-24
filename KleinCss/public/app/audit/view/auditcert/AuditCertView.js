/**
 * Created by apple on 16/1/17.
 */
define('app/audit/view/auditcert/AuditCertView',
[
    'underscore',
    'jquery',
    'backbone',
    'text!/app/audit/template/auditcert/AuditCertView.ejs'   ,
    'app/audit/collection/AuditCertCollection',
    'app/audit/view/auditcert/AuditCertListView',
    'i18n!/nls/audit.js'
],
function(_, $, Backbone, tmpl,AuditCertCollection,AuditCertListView,localName){
    var v = Backbone.View.extend({
        el:'.auditcert-container',
        events:{
            "click .audit-waitcert-nav-tab":"myWaitCert_handler",
            "click .audit-actcert-nav-tab":"myActCert_handler",
            "click .audit-donecert-nav-tab":"myDoneCert_handler"


        },
        initialize:function(){

            this.template = _.template(tmpl);
            this.status =  '1';
            this.elems = {
                waitcert:'#audit-cert-wait-tab',
                actcert:'#audit-cert-act-tab',
                donecert:'#audit-cert-done-tab'

            };
            this.collection = {};

            this.views =  {};

        },
        render:function(){

            $(this.el).html(this.template({
             local:localName
            }));
            this.myWaitCert_handler();

            return this;
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
        },myWaitCert_handler:function(){
            this.collection.MyWaitCertCollection = new AuditCertCollection({
                url: '/users/getWaitAuthList'
            });

            if(this.views.myWaitCertView){
                this.views = {};
            }
            this.views.myWaitCertView = new AuditCertListView({
                collection:this.collection.MyWaitCertCollection,
                state:'1',
                el:this.elems.waitcert
            });
            var self =this;
            this.collection.MyWaitCertCollection.fetch({
                success:function(){
                    $(self.elems.waitcert).append( self.views.myWaitCertView.render().el)
                }
            });
            this.views.myWaitCertView.actListener();
        },myActCert_handler:function(){
            this.collection.MyActCertCollection = new AuditCertCollection({
                url: '/users/getActAuthList'
            });
            if(this.views.myActCertView){
                this.views= {};
            }
            var self =this;
            this.views.myActCertView = new AuditCertListView({
                collection:this.collection.MyActCertCollection,
                state:'2',
                el:self.elems.actcert
            });
            this.collection.MyActCertCollection.fetch({
                success:function(){
                    $(self.elems.actcert).append( self.views.myActCertView.render().el);
                }
            });
            this.views.myActCertView.actListener();
        },myDoneCert_handler:function(){
            this.collection.MyDoneCertCollection = new AuditCertCollection({
                url: '/users/getDoneAuthList'
            });
            if(this.views.myWaitCertView){
                this.views = {};
            }
            var self =this;
            this.views.myDoneCertView = new AuditCertListView({
                collection:this.collection.MyDoneCertCollection,
                state:'3',
                el:this.elems.donecert
            });
            this.collection.MyDoneCertCollection.fetch({
                success:function(){
                    $(self.elems.donecert).append( self.views.myDoneCertView.render().el)
                }
            });
            this.views.myDoneCertView.actListener();
        }
    });
    return v;
})