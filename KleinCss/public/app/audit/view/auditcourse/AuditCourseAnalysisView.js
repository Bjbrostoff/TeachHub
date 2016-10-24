define('app/audit/view/auditcourse/AuditCourseAnalysisView',
[
    'underscore',
    'jquery',
    'backbone',
    'text!/app/audit/template/auditcourse/AuditCourseAnalysisView.ejs',

    'app/audit/model/AuditCourseModel',
    'i18n!/nls/audit.js'
],
function(_, $, Backbone, tmpl,
    AuditCourseModel,localName){
    var v = Backbone.View.extend({
        events:{
            'click .audit-course-pass-audit':'pass_clickHandler',
            'click .audit-course-dispass-audit':'dispass_clickHandler',
            'click .audit-course-analysis-close':'close_clickHandler'
        },
        initialize:function(){
            this.template = _.template(tmpl);
            this.model = new AuditCourseModel();

            this.elems = {
                'pass':'.audit-course-pass-audit',
                'dispass':'.audit-course-dispass-audit'
            };

            this.eventNames = {
                fetchedAnalysisMsg:'audit-analysis-msg-fetched',
                dealAnalysisPass:'audit-analysis-pass'
            }

            this.model.on(this.eventNames.fetchedAnalysisMsg, this._auditCourseAnalysisMsgFetched, this);
            this.model.on('change', this._modelChanged, this);
        },
        render:function(){
            $(this.el).html(this.template({
                data:this.model.toJSON(),
                local:localName
            }));

            return this;
        },
        fetchAuditAnalysisMsg:function(code){
            this.model.fetchAnalysisMsg(code);
        },
        _modelChanged:function(){
            this.render();
        },
        pass_clickHandler:function(evt){
            this.model.auditCourseAnalysisPass(true, this.model.toJSON());
        },
        dispass_clickHandler:function(evt){
            this.model.auditCourseAnalysisPass(false, this.model.toJSON());
        },
        close_clickHandler:function(){
            this.remove();
        },
        _auditCourseAnalysisMsgFetched:function(json){
            if (json.state){
                this.model.set(json.data);
            }
        }
    });
    return v;
})
