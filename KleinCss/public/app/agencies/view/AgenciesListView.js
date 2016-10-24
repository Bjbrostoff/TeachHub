define('app/agencies/view/AgenciesListView',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/agencies/template/AgenciesListView.ejs',

        'app/agencies/view/AgenciesItemView',

        'app/agencies/collection/AgenciesCollection',
        'app/agencies/view/AgenciesDetailView'
    ],
    function (_, Backbone, $, tmpl,
              AgencyItemView,
              AgencyCollection,
              AgencyDetailView) {
        var v = Backbone.View.extend({
            initialize: function (options) {
                this.options = {
                    login:false
                };
                _.extend(this.options, options);

                this.template = _.template(tmpl);

                this.els = {
                    'itemlist': '#searcha-item-list'
                };
                this.views = {

                };

                this.models = {};

                this.subItems = [];

                this.locations = [];

                this.models.agencyCollection = new AgencyCollection();

                this.models.agencyCollection.on('add', this._addItem, this);

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
            recommendation: function () {
                var self = this;
                var sortvalue;
                if(this.options.login){
                    sortvalue = 'distance';
                }else{
                    sortvalue = 'starlevel';
                }
                $.ajax({
                    url:'/agencies/recommendation',
                    data:{
                        type:1,
                        qo:{
                            'usertype': 2,
                            'enable':1
                        },
                        sorttag:sortvalue,
                        page:'1',
                        limit:'15',
                        fuzzyquery:"all"
                    },
                    type:'get',
                    success:function(json){
                        self.models.agencyCollection.set(json.collection);
                        self.trigger('agencycount-has-changed', {arr:json.count});
                        var localjson = [];
                        for(var i =0; i<json.collection.length; i++){
                            var itemjson = {};
                            itemjson['lgtd'] = json.collection[i].location.lng;
                            itemjson['lttd'] = json.collection[i].location.lat;
                            itemjson['name'] = json.collection[i].name;
                            localjson.push(itemjson);
                        }
                        self.locations = localjson;
                        self.trigger('agencylocation-has-changed', {arr:localjson});
                    }
                });
            },

            /*---- 请求搜索条件下的数据 ------*/
            fetchBy: function (me) {

                this.models.agencyCollection.reset();
                this._removeAllItem();

                var self = this;
                var sortvalue;
                if(this.options.login){
                    sortvalue = 'distance';
                }else{
                    sortvalue = 'starlevel';
                }
                $.ajax({
                    url:'/agencies/recommendation',
                    data:{
                        type:1,
                        qo:{
                            'usertype': 2,
                            'enable':1
                        },
                        sorttag:sortvalue,
                        page:me.arr.page,
                        limit:me.arr.limit,
                        fuzzyquery:me.arr.fuzzyquery
                    },
                    type:'get',
                    success:function(json){
                        self.models.agencyCollection.set(json.collection);
                        self.trigger('agencycount-has-changed', {arr:json.count});
                        var localjson = [];
                        for(var i =0; i<json.collection.length; i++){
                            var itemjson = {};
                            itemjson['lgtd'] = json.collection[i].location.lng;
                            itemjson['lttd'] = json.collection[i].location.lat;
                            itemjson['name'] = json.collection[i].name;
                            localjson.push(itemjson);
                        }
                        self.locations = localjson;
                        self.trigger('agencylocation-has-changed', {arr:localjson});
                    },
                    error:function(json){
                        //console.log('----------------');
                        //console.log(json);
                    }
                });
            },
            _onSearchFinished: function(json){
                this.models.agencyCollection.set(json.collection);
                this.trigger('agencycount-has-changed', {arr:json.count});
                var localjson = [];
                for(var i =0; i<json.collection.length; i++){
                    var itemjson = {};
                    itemjson['lgtd'] = json.collection[i].location.lng;
                    itemjson['lttd'] = json.collection[i].location.lat;
                    itemjson['name'] = json.collection[i].name;
                    localjson.push(itemjson);
                }
                this.locations = localjson;
                this.trigger('agencylocation-has-changed', {arr:localjson});

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
                var itemview = new AgencyItemView({model: item});
                $(this.els.itemlist).append(itemview.render().el);
                this.subItems.push(itemview);
                var self = this;
                itemview.on('agency-did-collect', function(e){
                    if (self.views.agencyDetailView) self.views.AgencyDetailView.remove();

                    $.ajax({
                        url:'/agencies/searchOneDetail',
                        data:{
                            type:1,
                            qo:{
                                '_id':item.attributes.uuid
                            }
                        },
                        type:'get',
                        success:function(json){
                            //console.log(json);
                            self.views.agencyDetailView = new AgencyDetailView({model: json});
                            $(self.el).append(self.views.agencyDetailView.render(json).el);
                            self.views.agencyDetailView.addSlimScroll();
                            self.views.agencyDetailView.on('open-profile-view', function(e){
                                //console.log(e);
                                self.trigger('open-profile-view', {userid: e.userid});
                            })
                        }
                    });
                })
            }

        });
        return v;
    })
