
define('app/searchc/controller/Router',
[
    'underscore',
    'jquery',
    'backbone',


    'app/searchc/view/CourseSearchCdView',
    'app/searchc/view/CourseListView',
    'app/searchc/view/CourseImagePanelView',
    'app/searchc/view/CourseDetailView'

],
function(_, $, Backbone,
        CourseSearchCdView,CourseListView,CourseImagePanelView,CourseDetailView){
    var r = Backbone.Router.extend({
        el:'body',
        routes:{
            '':'index',
            'search/:text':'search',
            'profile/:id':'profile'
        },
        initialize:function(){
            this.elems = {
                'resultView':'#result-view',
                'conditionView':'#condition-view',
                'profileView':'#course-profile',
                'imagePanelView':'#cousre-image-panel'
            };
            this.views = {

            };
            this.models = {

            };
            this.profileid ='';
        },
        index:function(){
            this._detectSubView("searchcondition");
            this._detectSubView("searchresult");

            this._hideAllSubViews();
            this.views.conditionView.show();
            this.views.resultView.show();

        },
        profile:function(id){
            //console.log(id);
            this.profileid = id;
            this._detectSubView("profiledetail");
            this._detectSubView("imagepanel");
            this._hideAllSubViews();
            this.views.profileView.show();
            this.views.imagePanelView.show();
        },
        search:function(text){
            console.log('search');
            this._detectSubView("searchcondition");
            this._detectSubView("fuzzysearchresult");

            this._hideAllSubViews();
            this.views.conditionView.show();
            this.views.resultView.show();

            var searchcondi = {};
            var fuzzyquery = text;
            $('#web_search_header').val(fuzzyquery);
            $('.top-dropdown-btn').html('课程&nbsp;<span class="caret"></span>');
            var all = $('.dropdown-menu').find('.top-dropdown-chosebtn');
            for (var i = 0; i < all.length; i++){
                $(all[i]).removeClass('top-dropdown-chosebtn-active');
            }
            $('.top-dropdown-chosebtn'+'[topsearchtag='+"courses"+']').addClass('top-dropdown-chosebtn-active');
            searchcondi ={
                'condition':[],
                'sorttag':'score',
                'limit':16,
                'page':1,
                'fuzzyquery':fuzzyquery
            };
            var me ={};
            me.arr = searchcondi;
            this.views.resultView.fetchBy(me);

        },
        _detectSubView:function(viewname){
            switch (viewname) {
                case "searchcondition":
                    if (!this.views.conditionView){
                        this.views.conditionView = new CourseSearchCdView();
                        $(this.elems.conditionView).append(this.views.conditionView.render().el);
                        this.views.conditionView.render();
                        this.views.conditionView.on('condition-has-changed', this._conditionHasChanged, this);
                        this.views.conditionView.searchCondition();
                    }
                    break;
                case "searchresult":
                    if (!this.views.resultView){
                        this.views.resultView = new CourseListView();
                        $(this.elems.resultView).append(this.views.resultView.render().el);
                        this.views.resultView.render();
                        this.views.resultView.on('coursecount-has-changed',this._courseCountChanged, this);
                        this.views.resultView.recommendation();
                        this.views.resultView.on('open-profile-view',this._openProfileView, this);
                    }
                    break;
                case "profiledetail":
                    if(this.views.profileView){
                        this.views.profileView.remove();
                    }
                    //console.log(this.profileid);
                    this.views.profileView = new CourseDetailView();
                    this.views.profileView.setProfileId(this.profileid);
                    $(this.elems.profileView).append(this.views.profileView.render().el);
                    break;
                case "imagepanel":
                    if(this.views.imagePanelView){
                        this.views.imagePanelView.remove();
                    }
                    this.views.imagePanelView = new CourseImagePanelView();
                    $(this.elems.imagePanelView).append(this.views.imagePanelView.render().el);
                    break;
                case "fuzzysearchresult":
                    if (!this.views.resultView){
                        this.views.resultView = new CourseListView();
                        $(this.elems.resultView).append(this.views.resultView.render().el);
                        this.views.resultView.render();
                        this.views.resultView.on('coursecount-has-changed',this._courseCountChanged, this);
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
        _courseCountChanged: function(e){
            this.views.conditionView.courseCountChanged(e);
        },

        _openProfileView: function(e){
            //console.log(e);
            this.profileid = e.courseid;
            window.location.href = '#profile/'+e.courseid;
        }

    });

    return r;
})
