/**
 * 统计收藏分类个数的
 * Created by cs on 2016/1/10.
 */
define('app/usercenter/collection/myfavorites/MyFavoritesCountCollection',
    [
        'underscore',
        'backbone',
        'jquery',

        'app/usercenter/model/myfavorites/MyFavoritesModel'
    ],
    function(_, Backbone, $, Model){
        var c = Backbone.Collection.extend({
            model:Model,
            url:'/mod/user/queryFavorite'
        });
        return c;
    })
