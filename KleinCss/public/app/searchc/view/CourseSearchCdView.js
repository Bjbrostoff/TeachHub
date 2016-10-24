/**
 * Created by xiaoguo on 16/1/1.
 */

define('app/searchc/view/CourseSearchCdView',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/searchc/template/CourseSearchCdView.ejs',

        'app/searchc/view/SearchConditionItemView',

        'app/searchc/collection/SearchConditionCollection',

        'i18n!/nls/SearchCourse.js'
    ],
    function(_, Backbone, $, tmpl,
             ConditionItemView,
             ConditionCollection,SearchCourse){
        var v = Backbone.View.extend({

            events:{
                'click .sort-item':'sortClist_clickHandler',
                'click .pager-prev':'pagePrev_clickHandler',
                'click .pager-next':'pageNext_clickHandler',
                'click .search-button':'searchButton_clickHandler'
            },

            initialize:function(options){
                //console.log('111');
                // if (options.hasOwnProperty('eventBus')){
                //     this.eventBus = options.eventBus;
                // }

                this.template = _.template(tmpl);

                this.els = {
                    'itemlist':'#condition-item-list',
                    'sortlist':'#sort-c-list',
                    'pageprevbtn':'#page-prev-btn',
                    'pagenextbtn':'#page-next-btn',
                    'nowpage':'#searchc-nowpage',
                    'totalpage':'#searchc-totalpage',
                    'searchinput':"#search-course-input"
                }

                this.models = {

                };

                this.coursetotal = 0;
                this.totalpage = 0;

                this.searchCd ={
                    'condition':[],
                    'sorttag':'score',
                    'limit':16,
                    'page':1,
                    'fuzzyquery':"all"
                };

                this.models.conditionCollection = new ConditionCollection();

                this.models.conditionCollection.on('add', this._addItem, this);
            },
            render:function(){

                $(this.el).html(this.template(
                    {
                        nowpage:this.searchCd.page,
                        totalpage:this.totalpage,
                        conditionview:SearchCourse.conditionview
                    }));

                return this;
            },
            show: function () {
                this._show();
            },
            hide: function () {
                this._hide();
            },
            searchCondition:function(){
                this.models.conditionCollection.fetch().complete(function(){
                    //console.log('success');
                });
                //console.log('12');
            },
            sortClist_clickHandler:function(evt){
                $(this.els.sortlist).find('.active').removeClass('active');
                $(evt.currentTarget).addClass('active');
                this.searchCd.sorttag = $(evt.currentTarget).attr('sorttag');
                this.searchCd.page = 1;
                this.trigger('condition-has-changed', {arr:this.searchCd});
            },
            pagePrev_clickHandler:function(evt){
                if(!$(evt.currentTarget).hasClass('disabled')){
                    this.searchCd.page -= 1;
                    this.trigger('condition-has-changed', {arr:this.searchCd});
                }

            },
            pageNext_clickHandler:function(evt){
                if(!$(evt.currentTarget).hasClass('disabled')){
                    this.searchCd.page +=1;
                    this.trigger('condition-has-changed', {arr:this.searchCd});
                }
            },
            //测试搜索
            searchButton_clickHandler:function(evt){
                var name = $(this.els.searchinput).val();
                if(name==""||name==null){
                    this.searchCd.fuzzyquery = "all";
                }else{
                    this.searchCd.fuzzyquery = name;
                }
                this.trigger('condition-has-changed', {arr:this.searchCd});
            },
            courseCountChanged:function(m){
                this.coursetotal = m.arr;
                //this.searchCd.page = 1;
                this.totalpage = Math.ceil(this.coursetotal/this.searchCd.limit);
                //console.log('coursetotal:'+m.arr+'----'+'totalpage:'+this.totalpage);
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
            _addItem:function(item){
                var item = new ConditionItemView({model:item});
                $(this.els.itemlist).append(item.render().el);
                var self = this;
                item.on('condition-did-collect', function(e){
                    self.searchCd.condition = e ;
                    self.searchCd.page = 1;
                    self.trigger('condition-has-changed', {arr:self.searchCd});
                })
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
            }
        });
        return v;
    })
