define('app/agencies/view/AgenciesItemView',
[
    'underscore',
    'backbone',
    'jquery',
        'text!/app/agencies/template/AgenciesItemView.ejs',
    'i18n!/nls/SearchAgency.js'
],
function(_, Backbone, $, tmpl,SearchAgency){
    var v = Backbone.View.extend({
        events:{
            'click .agency-info-box':'agencyInfoBox_clickHandler'
        },
        initialize:function(options){
            this.template = _.template(tmpl);
        },
        render:function(){
            $(this.el).html(this.template({
                agency:this.model.toJSON(),
                agencyitem:SearchAgency.agencyitem
            }));
            return this;
        },
        agencyInfoBox_clickHandler:function(evt){

            this.trigger('agency-did-collect', {});
        },
    });
    return v;
})
