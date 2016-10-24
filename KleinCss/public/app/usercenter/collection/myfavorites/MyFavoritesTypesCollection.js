/**
 * Created by cs on 2016/1/1.
 */
define('app/usercenter/collection/myfavorites/MyFavoritesTypesCollection',
    [
        'underscore',
        'backbone',
        'jquery',

        'app/usercenter/model/myfavorites/MyFavoritesModel'
    ],
    function(_, Backbone, $, Model){
        var c = Backbone.Collection.extend({
            model:Model,
            url:'/mod/user/queryFavoriteTypes'
        })
        return c;
    })
