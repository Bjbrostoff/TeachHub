define('app/usercenter/view/BaseInfoView',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/usercenter/template/BaseInfoView.ejs',
        'app/usercenter/view/userinfo/UserFormView',
        'app/usercenter/model/BaseInfoModel',
        'i18n!/nls/uchome.js',

        'sweetalert',
        'jquery.validate'


    ],
    function(_, Backbone, $,tmpl,
             UserFormView, BaseinfoModel,BaseInfo ){
        var v = Backbone.View.extend({
            el: '.userinfo-container',
            events:{

            },
            initialize:function(){
                this.template = _.template(tmpl);
                this.elems = {
                    'userInfo':'#user-form'
                };
                this.views = {};

                this.models = {
                };

                this.models.baseinfoModel = new BaseinfoModel();
                this.template = _.template(tmpl);
            },
            render:function(){
                //console.log(this.model.toJSON());
                $(this.el).html(this.template({
                    locale:BaseInfo
                }));
                return this;
            },
            showuserInfo:function(){
                if (!this.views.myUserFormView) {
                    this.views.myUserFormView = new UserFormView({
                        eventBus: this.eventBus,
                        el: this.elems.userInfo,
                        model: this.models.baseinfoModel
                    });
                }
                //$(this.elems.userinfo).append(this.views.myUserFormView.render().el);
                var self = this;
                this.models.baseinfoModel.fetch({
                    success: function (collection, resp) {
                        var coords;
                        if(resp.userinfo.location){
                            coords ={
                                latitude:resp.userinfo.location.lat,
                                longitude:resp.userinfo.location.lng
                            };

                        }else {
                            coords ={
                                latitude:30.150,
                                longitude:120.250
                            };
                        }
                        $(self.elems.userInfo).append(self.views.myUserFormView.render(resp,coords).el);
                        self.views.myUserFormView.setValidate();

                        self.views.myUserFormView.createMapView(coords);
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
