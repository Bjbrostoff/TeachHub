/**
 * Created by cs on 2016/6/14.
 */
define('app/usercenter/view/PaginationView',
    [
        'underscore',
        'backbone',
        'jquery',

        'text!/app/usercenter/template/PaginationView.ejs'
    ],
    function(_, Backbone, $, tmpl){
        var v = Backbone.View.extend({
            events:{
                'click .page-jump':'pageJump_clickHandler'
            },
            eventNames:{
                favPageJumpEvent:'fav-pageJumpEvent'
            },
            initialize:function(options){
                this.eventBus = options.eventBus;
                this.datas = options.datas;
                this.template = _.template(tmpl);
            },
            render:function(){
                var data = this.datas.toJSON()[0];
                var page = data.page;
                var limit = data.limit;
                var totalPage = data.total % limit > 0 ? parseInt(data.total / limit) + 1: parseInt(data.total / limit);
                this.$el.html(this.template({totalPage:totalPage,page:page,limit:limit}));
                return this;
            },
            pageJump_clickHandler:function(e){
                this.eventBus.trigger(this.eventNames.favPageJumpEvent, $(e.currentTarget).attr("page-num"));
            }
        });
        return v;
    })