/**
 * Created by xiaoguo on 16/1/7.
 */
define('app/agencies/view/AgenciesDetailView',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/agencies/template/AgenciesDetailView.ejs',

        'app/agencies/model/AgenciesDetailModel',
        'i18n!/nls/SearchAgency.js',

        'jquery.slimscroll'
    ],
    function(_, Backbone, $, tmpl,
             TeacherDetailModel,SearchAgency){
        var v = Backbone.View.extend({
            events:{
                'click .agency-detail-close':'closeView_handler',
                'click #profile-button':'openProfileView_handler'
            },
            initialize:function(options){

                this.template = _.template(tmpl);

                this.els = {

                };
                this.model = new TeacherDetailModel();

            },
            render:function(json){
                $(this.el).html(this.template({
                    agency:json,
                    agencydetail:SearchAgency.agencydetail
                }));
                this.model.set(json);
                return this;
            },

            closeView_handler:function(){
                //console.log('11');
                this.remove();
            },
            addSlimScroll:function(){
                $('.full-height-scroll').slimscroll({
                    height: '100%'
                });
            },
            openProfileView_handler:function(){
                //console.log(this.model.attributes);
                this.trigger('open-profile-view', {userid:this.model.attributes.uuid});
            }
    });
        return v;
    })
