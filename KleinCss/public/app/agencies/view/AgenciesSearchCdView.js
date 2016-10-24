/**
 * Created by xiaoguo on 16/1/1.
 */
define('app/agencies/view/AgenciesSearchCdView',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/agencies/template/AgenciesSearchCdView.ejs',
        'i18n!/nls/SearchAgency.js'
    ],
    function(_, Backbone, $, tmpl,
             SearchAgency){
        var v = Backbone.View.extend({

            events:{
                'click .sort-item':'sortTlist_clickHandler',
                'click .pager-prev':'pagePrev_clickHandler',
                'click .pager-next':'pageNext_clickHandler',
                'click .search-button':'searchButton_clickHandler'
            },

            initialize:function(option){
                this.options = {
                    login:false
                };
                _.extend(this.options, option);

                this.template = _.template(tmpl);

                this.els = {
                    'itemlist':'#condition-item-list',
                    'sortlist':'#sort-t-list',
                    'pageprevbtn':'#page-prev-btn',
                    'pagenextbtn':'#page-next-btn',
                    'nowpage':'#searcha-nowpage',
                    'totalpage':'#searcha-totalpage',
                    'searchinput':"#search-agency-input"
                }

                this.models = {

                };
                this.agencytotal = 0;
                this.totalpage = 0;
                if(this.options.login){
                    this.searchCd ={
                        'sorttag':'distance',
                        'limit':15,
                        'page':1,
                        'fuzzyquery':"all"
                    };
                }else{
                    this.searchCd ={
                        'sorttag':'score',
                        'limit':15,
                        'page':1,
                        'fuzzyquery':"all"
                    };
                };
            },
            render:function(){
                $(this.el).html(this.template(
                    {
                        nowpage:this.searchCd.page,
                        totalpage:this.totalpage,
                        login:this.options.login,
                        conditionview:SearchAgency.conditionview
                    }));

                return this;
            },
            show: function () {
                this._show();
            },
            hide: function () {
                this._hide();
            },
            sortTlist_clickHandler:function(evt){
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

            agencyCountChanged:function(m){
                this.agencytotal = m.arr;
                //this.searchCd.page = 1;
                this.totalpage = parseInt(this.agencytotal/this.searchCd.limit)+1;
                //console.log('agencytotal:'+m.arr+'----'+'totalpage:'+this.totalpage);
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
