/**
 * Created by cs on 2016/3/10.
 */
define('app/usercenter/view/coursemanage/AgencyPaginationView',
    [
        'underscore',
        'backbone',
        'jquery',

        'text!/app/usercenter/template/coursemanage/AgencyPaginationView.ejs'
    ],
    function(_, Backbone, $, tmpl){
        var v = Backbone.View.extend({
            events:{
                'click .agency-page':'pageItem_clickHandler'
            },
            eventNames:{
                chooseAgencyPagination:'course-manager-agency-choose-pagination'
            },
            initialize:function(options){
                this.eventBus = options.eventBus;
                this.totalPage = options.totalPage;
                this.page = options.page;
                this.template = _.template(tmpl);
            },
            render:function(){
                this.$el.html(this.template({page:this.page,totalPage:this.totalPage}));
                return this;
            },
            pageItem_clickHandler:function(e){
                this.eventBus.trigger(this.eventNames.chooseAgencyPagination, $(e.currentTarget).attr("page-num"));
            }
        });
        return v;
    })