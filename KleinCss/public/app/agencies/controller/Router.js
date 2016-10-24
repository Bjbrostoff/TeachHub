define('app/agencies/controller/Router',
    [
        'underscore',
        'backbone',
        'jquery',

        'app/agencies/view/AgenciesSearchCdView',
        'app/agencies/view/AgenciesListView',
        'app/agencies/view/ProfileDetailView',
        'app/agencies/view/ProfileComponentView',
        'app/map/view/MapView'

    ],
    function(_, Backbone, $,
             TeacherSearchCdView,TeacherListView,
             ProfileDetailView,ProfileComponentView, MapView){
        var r = Backbone.Router.extend({
            el:'body',
            routes:{
                '':'index',
                'profile/:id':'profile',
                'search/:text':'search'
            },
            initialize:function(option){
                this.options = {
                    login:false
                };
                _.extend(this.options, option);
                this.elems = {
                    'resultView':'#agencies-result-view',
                    'conditionView':'#agencies-condition-view',
                    'profileDetailView':'#agencies-profile-detail',
                    'ProfileComponentView':'#agencies-profile'
                };
                this.views = {

                };
                this.models = {

                };
                this.profileid ='';
            },
            index:function(){
                this._detectSubView("mapview");
                this._detectSubView("searchcondition");
                this._detectSubView("searchresult");

                this._hideAllSubViews();
                this.views.conditionView.show();
                this.views.resultView.show();
                this.views.mapView.show();

            },
            profile:function(id){
                this.profileid = id;
                this._detectSubView("profiledetail");
                this._detectSubView("profilecomponent");
                this._hideAllSubViews();
                this.views.profileDetailView.show();
                this.views.ProfileComponentView.show();
            },
            search:function(text){
                //console.log('search');
                this._detectSubView("mapview");
                this._detectSubView("searchcondition");
                this._detectSubView("fuzzysearchresult");

                this._hideAllSubViews();
                this.views.conditionView.show();
                this.views.resultView.show();
                this.views.mapView.show();

                var searchcondi = {};
                var fuzzyquery = text;
                $('#web_search_header').val(fuzzyquery);
                $('.top-dropdown-btn').html('机构&nbsp;<span class="caret"></span>');
                var all = $('.dropdown-menu').find('.top-dropdown-chosebtn');
                for (var i = 0; i < all.length; i++){
                    $(all[i]).removeClass('top-dropdown-chosebtn-active');
                }
                $('.top-dropdown-chosebtn'+'[topsearchtag='+"agencies"+']').addClass('top-dropdown-chosebtn-active');

                if(this.options.login){
                    searchcondi ={
                        'sorttag':'distance',
                        'limit':15,
                        'page':1,
                        'fuzzyquery':fuzzyquery
                    };
                }else{
                    searchcondi ={
                        'sorttag':'score',
                        'limit':15,
                        'page':1,
                        'fuzzyquery':fuzzyquery
                    };
                };
                var me ={};
                me.arr = searchcondi;
                this.views.resultView.fetchBy(me);

            },
            _detectSubView:function(viewname){
                switch (viewname) {
                    case "searchcondition":
                        if (!this.views.conditionView){
                            this.views.conditionView = new TeacherSearchCdView({login:this.options.login});
                            $(this.elems.conditionView).append(this.views.conditionView.render().el);
                            this.views.conditionView.render();
                            this.views.conditionView.on('condition-has-changed', this._conditionHasChanged, this);
                        }
                        break;
                    case "searchresult":
                        if (!this.views.resultView){
                            this.views.resultView = new TeacherListView({login:this.options.login});
                            $(this.elems.resultView).append(this.views.resultView.render().el);
                            this.views.resultView.render();
                            this.views.resultView.on('agencycount-has-changed',this._agencyCountChanged, this);
                            this.views.resultView.on('agencylocation-has-changed',this._agencyLocationChanged, this);
                            this.views.resultView.on('open-profile-view',this._openProfileView, this);
                            this.views.resultView.recommendation();
                        }
                        break;
                    case "profiledetail":
                        if(this.views.profileDetailView){
                            this.views.profileDetailView.remove();
                        }
                        //console.log(this.profileid);
                        this.views.profileDetailView = new ProfileDetailView();
                        this.views.profileDetailView.setProfileId(this.profileid);
                        $(this.elems.profileDetailView).append(this.views.profileDetailView.render().el);
                        break;
                    case "profilecomponent":
                        if(this.views.ProfileComponentView){
                            this.views.ProfileComponentView.remove();
                        }
                        this.views.ProfileComponentView = new ProfileComponentView();
                        this.views.ProfileComponentView.setProfileId(this.profileid);
                        $(this.elems.ProfileComponentView).append(this.views.ProfileComponentView.render().el);
                        this.views.ProfileComponentView.initSubView();
                        break;
                    case "mapview":
                        if (!this.views.mapView){
                            this.views.mapView = new MapView({
                                el:'#map-container',
                                mapDomId:'map'

                            });

                            this.views.mapView.render()
                                .locateMe();
                        }
                        break;
                    case "fuzzysearchresult":
                        if (!this.views.resultView){
                            this.views.resultView = new TeacherListView({login:this.options.login});
                            $(this.elems.resultView).append(this.views.resultView.render().el);
                            this.views.resultView.render();
                            this.views.resultView.on('agencycount-has-changed',this._agencyCountChanged, this);
                            this.views.resultView.on('agencylocation-has-changed',this._agencyLocationChanged, this);
                            this.views.resultView.on('open-profile-view',this._openProfileView, this);
                        }
                        break;
                }
            },
            _hideAllSubViews:function(){
                var self = this;
                _.each(this.views, function(item){
                    item.hide();
                });
            },
            _conditionHasChanged:function(e){
                this.views.resultView.fetchBy(e);
            },
            _agencyCountChanged: function(e){
                this.views.conditionView.agencyCountChanged(e);
            },
            _agencyLocationChanged: function(e){
                this.views.mapView.clearMarkers();
                this.views.mapView.setMarkers(e.arr);
            },
            _openProfileView: function(e){
                this.profileid = e.userid;
                window.location.href = '#profile/'+e.userid
            }

        });

        return r;
    })
