/**
 * Created by apple on 16/1/15.
 */
define('app/map/collection/MapMarkerCollection',
[
    'underscore',
    'jquery',
    'backbone',
    'app/map/model/MapMarkerModel'
],
function(_, $, Backbone, Model){
    var c = Backbone.Collection.extend({
        model:Model
    });
    return c;
})