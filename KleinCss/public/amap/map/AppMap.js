/**
 * Created by apple on 15/12/10.
 */
define('amap/map/AppMap',
    [
        'backbone',
        'leaflet',
	    'underscore'
    ],
    function(backbone, L, _){
        var MapView = backbone.View.extend({
            events:{
                'map-did-load':"onMapDidLoad"
            },
            initialize:function(options){
                console.log(options);
                this.option = {
	                //地图底图地址
	                lyrurl:'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
	                //定位中心点
	                center:[30,-120],
	                //定位层级
	                level:13
                };

	            _.extend(this.option, options);

	            this.dataSource = [];

	            this.isRender = false;

                //this.render();
            },
            render:function(){
	            if (this.isRender) return;

                var opt = this.option;
                this.map = L.map('mapDiv');
                this.map.setView(opt.center, opt.level);
                this.tiledLayer = L.tileLayer(opt.lyrurl);
                this.tiledLayer.addTo(this.map);

	            this.isRender = true;

                this.onMapDidLoad({load:true});
            },
	        setDataSource:function(data){
				this.dataSource = data;

		        this._draw();
	        },
	        redraw:function(){
		        this._draw();
	        },
            test:function(){
                console.log(1111);
            },
	        _draw:function(){

	        },
            onMapDidLoad:function(model){
                this.trigger('map-did-load', model);
            }
        });

        return MapView;
    })