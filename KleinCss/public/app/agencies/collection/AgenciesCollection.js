define('app/agencies/collection/AgenciesCollection',
[
    'underscore',
    'backbone',
    'jquery',

    'app/agencies/model/AgenciesModel'
],
function(_, Backbone, $,
        Model){
    var c = Backbone.Collection.extend({
        model:Model,
        url:'/teachers/recommendation'
    });
    return c;
})
