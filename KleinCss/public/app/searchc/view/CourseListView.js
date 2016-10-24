
define('app/searchc/view/CourseListView',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/searchc/template/CourseListView.ejs',

        'app/searchc/view/CourseItemView',

        'app/searchc/collection/CourseCollection',
        'app/searchc/view/CourseDetailView'
    ],
    function (_, Backbone, $, tmpl,
              CourseItemView,
              CourseCollection,
              CourseDetailView) {
        var v = Backbone.View.extend({
            initialize: function (options) {
                //console.log('111');
                // if (options.hasOwnProperty('eventBus')){
                //     this.eventBus = options.eventBus;
                // }

                this.template = _.template(tmpl);

                this.els = {
                    'itemlist': '#searchc-item-list'
                };
                this.views = {

                };

                this.models = {};

                this.subItems = [];

                this.models.courseCollection = new CourseCollection();

                this.models.courseCollection.on('add', this._addItem, this);

            },
            render: function () {
                $(this.el).html(this.template({}));

                return this;
            },
            show: function () {
                this._show();
            },
            hide: function () {
                this._hide();
            },
            /*------ 默认加载是加载内存中的数据 -----*/

            //recommendation: function () {
            //
            //    var self = this;
            //    this.models.courseCollection.fetch(
            //
            //    ).complete(function () {
            //        console.log('success');
            //        var count = self.models.courseCollection.length;
            //        self.trigger('coursecount-has-changed', {arr:count});
            //    });
            //},

            /*---- 默认加载时请求全部数据 ------*/
            recommendation: function () {
                var self = this;
                $.ajax({
                    url:'/courses/recommendation',
                    data:{
                        type:1,
                        qo:{
                            'method': 'all',
                            'range': 'all',
                            'billing': 'all',
                            'mode': 'all'
                        },
                        sorttag:'score',
                        page:'1',
                        limit:'16',
                        fuzzyquery:'all'
                    },
                    type:'get',
                    success:function(json){
                        //console.log(json);
                        //console.log(self.models.courseCollection);
                        self.models.courseCollection.set(json.collection);
                        self.trigger('coursecount-has-changed', {arr:json.count});
                        //console.log(json);
                    }
                });
            },

            /*---- 请求搜索条件下的数据 ------*/
            fetchBy: function (me) {
                //console.log(me.arr);
                var m = me.arr.condition;
                var nv={};
                if(m.length==0){
                    nv = {
                            'method': 'all',
                            'range': 'all',
                            'billing': 'all',
                            'mode': 'all'
                        }
                }else{
                    for(var i=0;i< m.arr.length;i++){
                        var obj= m.arr[i];
                        nv[obj.cate]=obj.cvalue;
                    }
                }

                this.models.courseCollection.reset();
                this._removeAllItem();

                var self = this;
                $.ajax({
                    url:'/courses/recommendation',
                    data:{
                        type:1,
                        qo:nv,
                        sorttag:me.arr.sorttag,
                        page:me.arr.page,
                        limit:me.arr.limit,
                        fuzzyquery:me.arr.fuzzyquery
                    },
                    type:'get',
                    success:function(json){
                        self.models.courseCollection.set(json.collection);
                        self.trigger('coursecount-has-changed', {arr:json.count});
                    }
                });
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
                $(this.els.itemlist).append(itemview.render().el);
                this.subItems.push(itemview);
                var self = this;
                itemview.on('open-profile-view', function(e){
                    self.trigger('open-profile-view', {courseid:e.courseid});
                });
                //itemview.on('course-did-collect', function(e){
                //    if (self.views.courseDetailView) self.views.courseDetailView.remove();
                //
                //    $.ajax({
                //        url:'/courses/searchOneDetail',
                //        data:{
                //            type:1,
                //            qo:{
                //                '_id':item.attributes.courseId
                //            }
                //        },
                //        type:'get',
                //        success:function(json){
                //            //console.log(json);
                //            self.views.courseDetailView = new CourseDetailView({model: json});
                //            $(self.el).append(self.views.courseDetailView.render(json).el);
                //            self.views.courseDetailView.addSlimScroll();
                //        }
                //    });
                //})
            }

        });
        return v;
    })
