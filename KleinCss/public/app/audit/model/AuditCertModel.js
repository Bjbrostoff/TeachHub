/**
 * Created by apple on 16/1/17.
 */
define('app/audit/model/AuditCertModel',
[
    'underscore',
    'jquery',
    'backbone'
],
function(_, $, Backbone){
    var m = Backbone.Model.extend({
        defaults:{

        },
        initialize:function(){

            this.id = this.attributes._id;
            this.attributes.id = this.attributes._id;;

        }

    });
    return m;
})
