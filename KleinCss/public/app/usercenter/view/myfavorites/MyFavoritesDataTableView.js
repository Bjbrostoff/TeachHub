/**
 * Created by cs on 2016/1/1.
 */
define('app/usercenter/view/myfavorites/MyFavoritesDataTableView',
    [
        'underscore',
        'backbone',
        'jquery',
        'text!/app/usercenter/template/myfavorites/MyFavoritesDataCourseListview.ejs',
        'text!/app/usercenter/template/myfavorites/MyFavoritesDataCourseTableView.ejs',
        'text!/app/usercenter/template/myfavorites/MyFavoritesDataTeacherListview.ejs',
        'i18n!/nls/uchome.js'
    ],
    function(_, Backbone, $,CourseListview,CourseTableView,TeacherListview,MyFavorites){
        var v = Backbone.View.extend({
            el:'.detail-container',
            events: {
                'click .fav-item-del': 'favItemDel_clickHandler',
                'click .fav-item-more':'favitemMore_clickHandler',
                'click .fav-item-like': 'favItemLike_clickHandler'
            },
            initialize:function(options){
                this.eventBus = options.eventBus;
                this.curId = 0;
                this.views = [];
                this.viewType = options.viewType;
                switch(options.viewType)
                {
                    case 0:
                        this.template = _.template(TeacherListview);
                        break;
                    case 1:
                        this.template = _.template(CourseListview);
                        break;
                    case 2:
                        this.template = _.template(TeacherListview);
                        break;
                    case 3:
                        this.template = _.template(TeacherListview);
                        break;
                    default:
                        break;
                }
                this.datas = options.datas;
                this.eventBus.on('fav-data-changed', this.onDataChangedHander, this);
            },
            onDataChangedHander:function(id){
                this.curId = id;
                if(id == 0){
                    this.render();
                }else{
                    var searchs = this.models.datas.where({type:id.toString()});
                    var results = [];
                    searchs.forEach(function (e) {
                        results.push($(e).get(0).attributes);
                    });
                    this._filter(results);
                }
            },
            favItemDel_clickHandler:function(evt){
                this.datas.remove(this.datas.get({id: $(evt.currentTarget).attr("data-id")}));
                $(this.el).html(this.template({
                    ident:'favorites',
                    datas:this.datas.toJSON(),
                }));
            },
            favitemMore_clickHandler:function(e){
                switch(this.viewType) {
                    case 1:
                        var details = this.datas.get({id: $(e.currentTarget).attr("data-id")});
                        var course = details.attributes.course;
                        this.eventBus.trigger('myFavorite-showDetailInfo', "course", course);
                        break;
                    case 2:
                        var details = this.datas.get({id: $(e.currentTarget).attr("data-id")});
                        var data = details.attributes;
                        this.eventBus.trigger('myFavorite-showDetailInfo', "teacher", data);
                        break;
                }
            },
            render:function(){
                $(this.el).html(this.template({
                    ident:'favorites',
                    datas:this.datas.toJSON()[0].data,
                    locale:MyFavorites
                }));
                return this;
            }
        });
        return v;
    })
