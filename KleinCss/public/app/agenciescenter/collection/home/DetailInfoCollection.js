define('app/agenciescenter/collection/home/DetailInfoCollection',
    [
        'underscore',
        'backbone',
        'jquery',

        'app/agenciescenter/model/home/DetailInfoModel'
    ],
    function(_, Backbone, $, Model){
        var c = Backbone.Collection.extend({
            model:Model,
            //url:'/events/events'
        });
        return c;
    })