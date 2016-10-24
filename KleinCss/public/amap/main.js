/**
 * Created by apple on 15/12/10.
 */

require.config({
    paths:{
        jquery:'/jquery/dist/jquery.min',
        underscore:'/underscore/underscore-min',
        backbone:'/backbone/backbone-min',
        leaflet:'/leaflet/dist/leaflet',
        amap:'/amap'
    }
})

require([
        'jquery',
        'underscore',
        'backbone',
        'amap/map/AppMap'
    ],
    function($, _, backbone, AppMap){
        var appmap = new AppMap({
	        lyrurl:'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
	        center:[30.20,120.20],
	        level:13
        });

        appmap.on('map-did-load', function(evt){
            console.log(evt);
            appmap.test();
        });

        appmap.render();



    });
