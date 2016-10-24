/**
 * Created by cs on 2016/3/9.
 */
define('app/usercenter/collection/coursemanage/AgencyCollection',
    [
        'underscore',
        'backbone',
        'jquery',

        'app/usercenter/model/coursemanage/AgencyModel'
    ],
    function(_, Backbone, $, Model){
        var c = Backbone.Collection.extend({
            model:Model,
            url:'/agencies/agenciesListByTeacherId?datestamp='+new Date().getTime(),
            initialize:function(options){
                if (options && options.hasOwnProperty('url')){
                    this.url = options.url;
                }
            }
        });
        return c;
    })
