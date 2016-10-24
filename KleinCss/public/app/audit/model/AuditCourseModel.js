/**
 * Created by apple on 16/1/17.
 */
define('app/audit/model/AuditCourseModel',
[
    'underscore',
    'jquery',
    'backbone',
    'i18n!/nls/audit.js'
],
function(_, $, Backbone,localName){
    var m = Backbone.Model.extend({
        initialize:function(){
            this.eventNames = {
                fetchedAnalysisMsg:'audit-analysis-msg-fetched',
                dealAnalysisPass:'audit-analysis-pass'
            }
        },
        fetchAnalysisMsg:function(code){
            if (!code) return;
            var self = this;
            $.ajax({
                url:'/users/audit/fetchAnalysisMsg',
                data:{
                    code:code
                },
                success:function(json){
                    self.trigger(self.eventNames.fetchedAnalysisMsg, json);
                },
                error:function(json){
                    self.trigger(self.eventNames.fetchedAnalysisMsg, {
                        state:false,
                        msg:localName.main.error,
                        data:null
                    });
                }
            });
        },
        auditCourseAnalysisPass:function(pass){
            var code = this.attributes['_id'];
            var courseid = this.attributes['course']['_id'];
            if (!code || !courseid) return;

            var self = this;
            $.ajax({
                url:'/users/audit/analysisPass',
                data:{
                    code:code,
                    pass:pass,
                    courseid:courseid
                },
                success:function(json){
                    var  coll = self.collection;
                    coll.remove(self);
                    self.trigger(self.eventNames.dealAnalysisPass, json);
                },
                error:function(json){
                    self.trigger(self.eventNames.dealAnalysisPass, {
                        state:false,
                        msg:localName.main.error,
                        data:null
                    });
                }
            })
        }
    });

    return m;
})
