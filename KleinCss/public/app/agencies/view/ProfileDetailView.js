/**
 * Created by xiaoguo on 16/1/9.
 */
define('app/agencies/view/ProfileDetailView',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/agencies/template/ProfileDetailView.ejs',

        'app/agencies/model/AgenciesDetailModel',
        'i18n!/nls/SearchAgency.js',
    ],
    function(_, Backbone, $, tmpl,
             AgenciesDetailModel,SearchAgency){
        var v = Backbone.View.extend({
            events:{
                'click #join-agency-btn':'joinAgency'
            },
            initialize:function(options){
                this.template = _.template(tmpl);

                this.eventNames = {
                    'joinAgencyComplete':'join-agency-complete'
                }

                this.model = new AgenciesDetailModel();
                this.model.on(this.eventNames.joinAgencyComplete, this._joinAgencyComplete, this);

                this.profileid = '';

            },
            setProfileId:function(profileid){
                this.profileid = profileid;
            },
            render:function(){
                //console.log(this.profileid);
                var self = this;
                $.ajax({
                    url:'/agencies/searchOneDetail',
                    data:{
                        type:1,
                        qo:{
                            '_id':self.profileid
                        }
                    },
                    type:'get',
                    success:function(json){
                        //console.log(json);
                        $(self.el).html(self.template({
                            agency:json,
                            agencydetail:SearchAgency.agencydetail
                        }));
                        self.model.set(json);
                    }
                });
                return this;
            },

            joinAgency:function(){
                this.model.joinAgency();
            },
            _joinAgencyComplete:function(json){
                if (!json.state){
                    swal({
                        title:json.msg
                    })
                }else{
                    swal({
                        title:json.msg
                    })
                }
            },

            show: function () {
                this._show();
            },
            hide: function () {
                this._hide();
            },
            _hide: function () {
                $(this.el).css({
                    'display': 'none'
                })
            },
            _show: function () {
                $(this.el).css({
                    'display': 'block'
                });
            }
        });
        return v;
    })