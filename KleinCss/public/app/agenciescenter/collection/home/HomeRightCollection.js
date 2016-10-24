define('app/agenciescenter/collection/home/HomeRightCollection',
    [
        'underscore',
        'backbone',
        'jquery',

        'app/agenciescenter/model/home/HomeRightModel'
    ],
    function(_, Backbone, $, Model){
        var c = Backbone.Collection.extend({
            model:Model,
            url:'/events/getImageArrange'
        })
        return c;
    })