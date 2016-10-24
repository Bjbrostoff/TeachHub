define('app/searcht/controller/Router',
[
    'underscore',
    'backbone',
    'jquery',

    'app/searcht/view/TeacherSearchCdView',
    'app/searcht/view/TeacherListView',
    'app/searcht/view/ProfileDetailView',
    'app/searcht/view/ProfileDetailInfoView',
    'app/searcht/view/ProfileCourseView',
    'app/map/view/MapView'

],
function(_, Backbone, $,
        TeacherSearchCdView,TeacherListView,
        ProfileDetailView,ProfileDetailInfoView,
        ProfileCourseView, MapView){
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
                'resultView':'#result-view',
                'conditionView':'#condition-view',
                'profileDetailView':'#profile-detail',
                'profileDetailInfoView':'#profile-detail-info',
                'profileCourseView':'#profile-course'
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
            //console.log(id);
            this.profileid = id;
            this._detectSubView("profiledetail");
            this._detectSubView("profiledetailinfo");
            this._detectSubView("profilecourse");
            this._hideAllSubViews();
            this.views.profileDetailView.show();
            this.views.profileCourseView.show();
            this.views.profileDetailInfoView.show();
        },

        search:function(text){
            console.log('search');
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
            $('.top-dropdown-btn').html('老师&nbsp;<span class="caret"></span>');
            var all = $('.dropdown-menu').find('.top-dropdown-chosebtn');
            for (var i = 0; i < all.length; i++){
                $(all[i]).removeClass('top-dropdown-chosebtn-active');
            }
            $('.top-dropdown-chosebtn'+'[topsearchtag='+"teachers"+']').addClass('top-dropdown-chosebtn-active');

            if(this.options.login){
                searchcondi ={
                    'condition':[],
                    'sorttag':'distance',
                    'limit':15,
                    'page':1,
                    'fuzzyquery':fuzzyquery
                };
            }else{
                searchcondi ={
                    'condition':[],
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
                        this.views.conditionView.searchCondition();
                    }
                    break;
                case "searchresult":
                    if (!this.views.resultView){
                        this.views.resultView = new TeacherListView({login:this.options.login});
                        $(this.elems.resultView).append(this.views.resultView.render().el);
                        this.views.resultView.render();
                        this.views.resultView.on('teachercount-has-changed',this._teacherCountChanged, this);
                        this.views.resultView.on('teacherlocation-has-changed',this._teacherLocationChanged, this);
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
                case "profiledetailinfo":
                    if(this.views.profileDetailInfoView){
                        this.views.profileDetailInfoView.remove();
                    }
                    //console.log(this.profileid);
                    this.views.profileDetailInfoView = new ProfileDetailInfoView();
                    this.views.profileDetailInfoView.setProfileId(this.profileid);
                    $(this.elems.profileDetailInfoView).append(this.views.profileDetailInfoView.render().el);
                    break;
                case "profilecourse":
                    if(this.views.profileCourseView){
                        this.views.profileCourseView.remove();
                    }
                    this.views.profileCourseView = new ProfileCourseView();
                    this.views.profileCourseView.SearchTeacherCourses(this.profileid);
                    $(this.elems.profileCourseView).append(this.views.profileCourseView.render().el);
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
                        this.views.resultView.on('teachercount-has-changed',this._teacherCountChanged, this);
                        this.views.resultView.on('teacherlocation-has-changed',this._teacherLocationChanged, this);
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
        _teacherCountChanged: function(e){
            this.views.conditionView.teacherCountChanged(e);
        },
        _teacherLocationChanged: function(e){
            //console.log(e.arr);
            this.views.mapView.clearMarkers();
            this.views.mapView.setMarkers(e.arr);
        },
        _openProfileView: function(e){
            //console.log(e);
            this.profileid = e.userid;
            window.location.href = '#profile/'+e.userid
        }

    });

    return r;
})
