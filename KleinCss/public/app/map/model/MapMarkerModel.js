/**
 * Created by apple on 16/1/15.
 */
define('app/map/model/MapMarkerModel',
[
    'underscore',
    'jquery',
    'backbone'
],
function(_, $, Backbone){
    var m = Backbone.Model.extend({
        defaults:{
            lgtd:0.0,
            lttd:0.0,
            name:'undefined'
        }
    });

    return m;
})