/**
 * Created by Administrator on 2016/2/18.
 */
/**
 * Created by Administrator on 2016/1/23.
 */
define('app/usercenter/collection/HomeworkCollection',
    [
        'underscore',
        'backbone',
        'jquery',
        'app/usercenter/model/HomeworkModel'
    ],
    function(_, Backbone, $, Model){
        var c = Backbone.Collection.extend({
            model:Model,
            url:'/users/getAllHomeWork?type=0',
            initialize:function(options){
                if (options && options.hasOwnProperty('url')){
                    this.url = options.url;
                }
            }
        });
        return c;
    })
