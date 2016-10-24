/**
 * Created by Administrator on 2016/1/5.
 */
define('app/usercenter/model/home/RightArrangeCalendarModel',
    [
        'underscore',
        'backbone',
        'jquery'
    ],
    function(_, Backbone, $){
        var m = Backbone.Model.extend({
            initialize:function(){
                this.id = this.attributes._id;
            }
        });
        return m;
    })