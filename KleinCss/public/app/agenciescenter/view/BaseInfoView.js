define('app/agenciescenter/view/BaseInfoView',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/agenciescenter/template/BaseInfoView.ejs',
        'app/agenciescenter/view/agenciesinfo/AgenciesFormView',
        'app/agenciescenter/model/AgenciesFormModel',
        'i18n!/nls/achome.js',

        'sweetalert',
        'jquery.validate'


    ],
    function(_, Backbone, $,tmpl,
             AgenciesFormView,AgenciesFormModel,AgencyInfo){
        var v = Backbone.View.extend({
            el: '.agenciesinfo-container',
            events:{

            },
            initialize:function(){
                this.template = _.template(tmpl);
                this.elems = {
                    'agenciesInfo':'#agencies-form'

                };
                this.views = {};

                this.models = {
                };
                this.models.agenciesFormModel = new AgenciesFormModel();
                this.template = _.template(tmpl);

            },
            render:function(){
                //console.log(this.model.toJSON());
                //$(this.el).html(_.template(tmpl));
                $(this.el).html(this.template({
                    locale:AgencyInfo
                }));

                return this;
            },
            showAgenciesInfo:function(){
                if (!this.views.myAgenciesFormView) {
                    this.views.myAgenciesFormView = new AgenciesFormView({
                        eventBus: this.eventBus,
                        el: this.elems.agenciesInfo,
                        model: this.models.agenciesFormModel
                    });
                }
                //$(this.elems.userinfo).append(this.views.myUserFormView.render().el);
                var self = this;
                this.models.agenciesFormModel.fetch({
                    success: function (collection, resp) {
                        var coords;
                        if(resp.data.location){
                            coords ={
                                latitude:resp.data.location.lat,
                                longitude:resp.data.location.lng
                            };

                        }else {
                            coords ={
                                latitude:30.150,
                                longitude:120.250
                            };
                        }
                        $(self.elems.agenciesInfo).append(self.views.myAgenciesFormView.render(resp,coords).el);
                        self.views.myAgenciesFormView.setValidate();

                        self.views.myAgenciesFormView.createMapView(coords);
                    }
                });
            },

            checkForm:function(){
            },
            validate:function(){
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
            }
        });
        return v;
    });
