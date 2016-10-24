/**
 * 图表用
 * Created by cs on 2016/1/10.
 */
define('app/usercenter/collection/myfavorites/MyFavoritesChartCollection',
    [
        'underscore',
        'backbone',
        'jquery',

        'app/usercenter/model/myfavorites/MyFavoritesModel'
    ],
    function(_, Backbone, $, Model){
        var c = Backbone.Collection.extend({
            model:Model,
            url:'/mod/user/queryFavoriteCharts'
        });
        return c;
    })
