/**
 * Created by cs on 2016/1/1.
 */
define('app/usercenter/collection/myfavorites/MyFavoritesDataCollection',
    [
        'underscore',
        'backbone',
        'jquery',
        'app/usercenter/model/myfavorites/MyFavoritesModel',
        'sweetalert'
    ],
    function(_, Backbone, $, Model){
        var c = Backbone.Collection.extend({
            model:Model,
            url:'/mod/user/queryFavorite',
            initialize: function () {
                this.on(
                    {
                        "add":this.addFunc,
                        "get":this.getFunc,
                        "remove":this.removeFunc,
                        "where":this.whereFunc
                    });
            },
            addFunc:function(){
              //  alert('add');
            },
            getFunc:function(){
                alert('get');
            },
            removeFunc:function(e){
                var id = e.attributes.ucrelUser._id;
                /*$.ajax({
                    url: '/mod/user/clearFavorite?id=id',
                    type: 'get',
                    success: function (json) {
                        swal({
                            title:json.title
                        });
                    }
                });*/
            },
            whereFunc:function(){
                alert('where');
            }
        });
        return c;
    })
