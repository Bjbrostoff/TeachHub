define('app/searcht/view/TeacherListView',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/searcht/template/TeacherListView.ejs',

        'app/searcht/view/TeacherItemView',

        'app/searcht/collection/TeacherCollection',
        'app/searcht/view/TeacherDetailView'
    ],
    function (_, Backbone, $, tmpl,
              TeacherItemView,
              TeacherCollection,
              TeacherDetailView) {
        var v = Backbone.View.extend({
            events:{
                'click #pager-prev':'pagePrev_clickHandler',
                'click #pager-next':'pageNext_clickHandler',
                'click #page-btn':'pageBtn_clickHandler',
                'click #input-btn':'inputBtn_clickHandler'

            },
            initialize: function (options) {

                this.options = {
                    login:false
                };
                _.extend(this.options, options);

                this.template = _.template(tmpl);

                this.els = {
                    'itemlist': '#searcht-item-list',
                    'pageinput': '#searcht-page-input'
                };
                this.views = {

                };
                this.teachertotal = 0;
                this.totalpage = 0;
                //console.log(this.options.login);
                if(this.options.login){
                    this.searchCd ={
                        'condition':[],
                        'sorttag':'distance',
                        'limit':15,
                        'page':1,
                        'fuzzyquery':"all"
                    };
                }else{
                    this.searchCd ={
                        'condition':[],
                        'sorttag':'score',
                        'limit':15,
                        'page':1,
                        'fuzzyquery':"all"
                    };
                };

                this.models = {};

                this.subItems = [];

                this.locations = [];

                this.models.teacherCollection = new TeacherCollection();

                this.models.teacherCollection.on('add', this._addItem, this);

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
            /*
            recommendation: function () {

                var self = this;
                this.models.teacherCollection.fetch(

                ).complete(function () {
                    console.log('success');
                    var count = self.models.teacherCollection.length;
                    self.trigger('teachercount-has-changed', {arr:count});
                });
            },*/

            /*---- 默认加载时请求全部数据 ------*/
            recommendation: function () {
                var self = this;
                var sortvalue;
                if(this.options.login){
                    sortvalue = 'distance';
                }else{
                    sortvalue = 'score';
                }
                $.ajax({
                    url:'/teachers/recommendation',
                    data:{
                        type:1,
                        qo:{
                            'skilledcourse': 'all',
                            'city': 'all',
                            'degree': 'all',
                            'starlevel': 'all',
                            'enable':1
                        },
                        sorttag:sortvalue,
                        page:'1',
                        limit:'15',
                        fuzzyquery:"all"
                    },
                    type:'get',
                    success:function(json){
                        self.models.teacherCollection.set(json.collection);
                        self.trigger('teachercount-has-changed', {arr:json.count});
                        var localjson = [];
                        for(var i =0; i<json.collection.length; i++){
                            var itemjson = {};
                            itemjson['lgtd'] = json.collection[i].location.lng;
                            itemjson['lttd'] = json.collection[i].location.lat;
                            itemjson['name'] = json.collection[i].name;
                            localjson.push(itemjson);
                        }
                        self.locations = localjson;
                        self.trigger('teacherlocation-has-changed', {arr:localjson});
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
                            'skilledcourse': 'all',
                            'city': 'all',
                            'degree': 'all',
                            'starlevel': 'all',
                            'enable':1
                        }
                }else{
                    for(var i=0;i< m.arr.length;i++){
                        var obj= m.arr[i];
                        nv[obj.cate]=obj.cvalue;
                    }
                }
                //console.log(JSON.stringify(nv));

                this.models.teacherCollection.reset();
                this._removeAllItem();

                var self = this;
                $.ajax({
                    url:'/teachers/recommendation',
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
                        self.models.teacherCollection.set(json.collection);
                        self.trigger('teachercount-has-changed', {arr:json.count});
                        var localjson = [];
                        for(var i =0; i<json.collection.length; i++){
                            var itemjson = {};
                            itemjson['lgtd'] = json.collection[i].location.lng;
                            itemjson['lttd'] = json.collection[i].location.lat;
                            itemjson['name'] = json.collection[i].name;
                            localjson.push(itemjson);
                        }
                        self.locations = localjson;
                        self.trigger('teacherlocation-has-changed', {arr:localjson});
                    },
                    error:function(json){
                        //console.log('----------------');
                        //console.log(json);
                    }
                });
            },
            _onSearchFinished: function(json){
                this.models.teacherCollection.set(json.collection);
                this.trigger('teachercount-has-changed', {arr:json.count});
                var localjson = [];
                for(var i =0; i<json.collection.length; i++){
                    var itemjson = {};
                    itemjson['lgtd'] = json.collection[i].location.lng;
                    itemjson['lttd'] = json.collection[i].location.lat;
                    itemjson['name'] = json.collection[i].name;
                    localjson.push(itemjson);
                }
                this.locations = localjson;
                this.trigger('teacherlocation-has-changed', {arr:localjson});

            },
            pagePrev_clickHandler:function(){

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
                var itemview = new TeacherItemView({model: item});
                $(this.els.itemlist).append(itemview.render().el);
                this.subItems.push(itemview);
                var self = this;
                itemview.on('open-profile-view', function(e){
                    self.trigger('open-profile-view', {userid:e.userid});
                });
                //itemview.on('teacher-did-collect', function(e){
                //    if (self.views.teacherDetailView) self.views.teacherDetailView.remove();
                //
                //    $.ajax({
                //        url:'/teachers/searchOneDetail',
                //        data:{
                //            type:1,
                //            qo:{
                //                '_id':item.attributes.uuid
                //            }
                //        },
                //        type:'get',
                //        success:function(json){
                //            //console.log(json);
                //            self.views.teacherDetailView = new TeacherDetailView({model: json});
                //            $(self.el).append(self.views.teacherDetailView.render(json).el);
                //            self.views.teacherDetailView.addSlimScroll();
                //            self.views.teacherDetailView.on('open-profile-view', function(e){
                //                //console.log(e);
                //                self.trigger('open-profile-view', {userid: e.userid});
                //            })
                //        }
                //    });
                //})
            }

        });
        return v;
    })
