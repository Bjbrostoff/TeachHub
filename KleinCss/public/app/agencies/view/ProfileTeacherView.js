/**
 * Created by xiaoguo on 16/3/8.
 */
define('app/agencies/view/ProfileTeacherView',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/agencies/template/ProfileTeacherView.ejs',

        'app/agencies/view/ProfileTeacherItemView',

        'app/agencies/collection/ProfileTeacherCollection',
        'i18n!/nls/SearchAgency.js',
        'sweetalert'
    ],
    function(_, Backbone, $, tmpl,
             TeacherItemView,
             TeacherCollection,
             SearchAgency){
        var v = Backbone.View.extend({
            events:{
                'click .pager-prev':'pagePrev_clickHandler',
                'click .pager-next':'pageNext_clickHandler'
            },
            initialize:function(options){
                this.template = _.template(tmpl);
                this.els = {
                    'pageprevbtn':'#paget-prev-btn',
                    'pagenextbtn':'#paget-next-btn',
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

                this.models.teacherCollection = new TeacherCollection();

                this.models.teacherCollection.on('add', this._addItem, this);

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
            searchProxyTeachers: function () {
                var self = this;
                this.models.teacherCollection.reset();
                this._removeAllItem();
                $.ajax({
                    url:'/teachers/searchProxyTeachers',
                    data:{
                        type:1,
                        qo:{
                            'agencyid':self.profileid
                        },
                        page:self.searchCd.page,
                        limit:self.searchCd.limit
                    },
                    type:'get',
                    success:function(json){
                        //console.log(json);
                        //console.log(self.models.teacherCollection);
                        self.models.teacherCollection.set(json.collection);
                        //console.log(json);
                        self.teacherCountChanged(json.count);
                    }
                });
            },

            teacherCountChanged:function(count){
                this.teachertotal = count;

                this.totalpage = Math.ceil(this.teachertotal/this.searchCd.limit);
                //console.log(this.totalpage);
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
                    this.searchProxyTeachers();
                }


            },
            pageNext_clickHandler:function(evt){
                if(!$(evt.currentTarget).hasClass('disabled')){
                    this.searchCd.page +=1;
                    this.searchProxyTeachers();
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
                var itemview = new TeacherItemView({model: item});
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
