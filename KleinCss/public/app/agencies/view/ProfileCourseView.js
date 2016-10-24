/**
 * Created by xiaoguo on 16/1/9.
 */
define('app/agencies/view/ProfileCourseView',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/agencies/template/ProfileCourseView.ejs',

        'app/agencies/view/ProfileCourseItemView',

        'app/agencies/collection/ProfileCourseCollection',
        'i18n!/nls/SearchAgency.js',

        'sweetalert'
    ],
    function(_, Backbone, $, tmpl,
             CourseItemView,
             CourseCollection,
             SearchAgency){
        var v = Backbone.View.extend({
            events:{
                'click .pager-prev':'pagePrev_clickHandler',
                'click .pager-next':'pageNext_clickHandler'
            },
            initialize:function(options){
                this.template = _.template(tmpl);
                this.els = {
                    'pageprevbtn':'#pagec-prev-btn',
                    'pagenextbtn':'#pagec-next-btn',
                    'nowpage':'#searchc-nowpage',
                    'totalpage':'#searchc-totalpage',
                    'itemlist': '.follow-list'
                };

                this.profileid = '';

                this.coursetotal = 0;
                this.totalpage = 0;
                this.searchCd ={
                    'limit':5,
                    'page':1
                };

                this.models = {};

                this.subItems = [];

                this.models.courseCollection = new CourseCollection();

                this.models.courseCollection.on('add', this._addItem, this);

            },
            render: function () {
                $(this.el).html(this.template(
                    {
                        nowpage:this.searchCd.page,
                        totalpage:this.totalpage,
                        profilecomponent:SearchAgency.profilecomponent
                    }));

                return this;
            },
            setProfileId:function(profileid){
                this.profileid = profileid;
            },

            /*---- 默认加载时请求全部数据 ------*/
            searchProxyCourses: function () {
                var self = this;
                this.models.courseCollection.reset();
                this._removeAllItem();
                $.ajax({
                    url:'/courses/searchProxyCourses',
                    data:{
                        type:1,
                        qo:{
                            "agencyid":self.profileid
                        },
                        page:self.searchCd.page,
                        limit:self.searchCd.limit
                    },
                    type:'get',
                    success:function(json){
                        //console.log(json);
                        //console.log(self.models.courseCollection);
                        self.models.courseCollection.set(json.collection);
                        //console.log(json);
                        self.courseCountChanged(json.count);
                    }
                });
            },

            courseCountChanged:function(count){
                this.coursetotal = count;

                this.totalpage = Math.ceil(this.coursetotal/this.searchCd.limit);

                $(this.els.nowpage).html(this.searchCd.page);
                $(this.els.totalpage).html(this.totalpage);
                //console.log(this.totalpage);
                if(this.searchCd.page>1){
                    $(this.els.pageprevbtn).removeClass('disabled');
                }else{
                    $(this.els.pageprevbtn).addClass('disabled');
                };
                if(this.searchCd.page<this.totalpage){
                    $(this.els.pagenextbtn).removeClass('disabled');
                }else{
                    $(this.els.pagenextbtn).addClass('disabled');
                };

            },


            pagePrev_clickHandler:function(evt){
                if(!$(evt.currentTarget).hasClass('disabled')){
                    this.searchCd.page -= 1;
                    this.searchProxyCourses();
                }


            },
            pageNext_clickHandler:function(evt){
                if(!$(evt.currentTarget).hasClass('disabled')){
                    this.searchCd.page +=1;
                    this.searchProxyCourses();
                }
            },

            _removeAllItem: function(){
                for (var i = 0; i < this.subItems.length; i++){
                    var item = this.subItems[i];
                    item.remove();
                }
                this.subItems = [];
            },
            _addItem: function (item) {
                //console.log(item);
                var itemview = new CourseItemView({model: item});
                itemview.model.set(item.attributes);
                $(this.els.itemlist).append(itemview.render().el);
                this.subItems.push(itemview);
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
            },

        });
        return v;
    })
