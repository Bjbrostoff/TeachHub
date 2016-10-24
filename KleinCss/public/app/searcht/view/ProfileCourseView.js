/**
 * Created by xiaoguo on 16/1/9.
 */
define('app/searcht/view/ProfileCourseView',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/searcht/template/ProfileCourseView.ejs',

        'app/searcht/view/ProfileCourseItemView',

        'app/searcht/collection/ProfileCourseCollection',
        'i18n!/nls/SearchTeacher.js',

        'sweetalert'
    ],
    function(_, Backbone, $, tmpl,
             CourseItemView,
             CourseCollection,
             SearchTeacher){
        var v = Backbone.View.extend({
            events:{
                'click .pager-prev':'pagePrev_clickHandler',
                'click .pager-next':'pageNext_clickHandler'
            },
            initialize:function(options){
                this.template = _.template(tmpl);
                this.els = {
                    'pageprevbtn':'#page-prev-btn',
                    'pagenextbtn':'#page-next-btn',
                    'nowpage':'#searcht-nowpage',
                    'totalpage':'#searcht-totalpage',
                    'itemlist': '.follow-list'
                };

                this.profileid = '';

                this.teachertotal = 0;
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
                        profilecourse:SearchTeacher.profilecourse
                    }
                )
                );

                return this;
            },

            /*---- 默认加载时请求全部数据 ------*/
            SearchTeacherCourses: function (profileid) {
                this.profileid = profileid;
                var self = this;
                this.models.courseCollection.reset();
                this._removeAllItem();
                $.ajax({
                    url:'/courses/SearchTeacherCourses',
                    data:{
                        type:1,
                        qo:{
                            'userid':self.profileid
                        },
                        page:self.searchCd.page,
                        limit:self.searchCd.limit
                    },
                    type:'get',
                    success:function(json){
                        //console.log(json);
                       // console.log(self.models.courseCollection);
                        self.models.courseCollection.set(json.collection);
                        //console.log(json);
                        self.courseCountChanged(json.count);
                    }
                });
            },

            courseCountChanged:function(count){
                this.coursetotal = count;
                //this.searchCd.page = 1;
                this.totalpage = parseInt(this.coursetotal/this.searchCd.limit)+1;
                $(this.els.nowpage).html(this.searchCd.page);
                $(this.els.totalpage).html(this.totalpage);

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
                    this.SearchTeacherCourses(this.profileid);
                }


            },
            pageNext_clickHandler:function(evt){
                if(!$(evt.currentTarget).hasClass('disabled')){
                    this.searchCd.page +=1;
                    this.SearchTeacherCourses(this.profileid);
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
