define('app/map/view/MapView',
    [
        'underscore',
        'jquery',
        'backbone',
        'leaflet',

        'app/map/collection/MapMarkerCollection',
        'i18n!/nls/uchome.js'
    ],
    function(_, $, Backbone, L,
             MapMarkerCollection,localName){
        var v = Backbone.View.extend({
            initialize:function(options){
                this.options = {
                    mapDomId:'map',
                    locateZoomLevel:13,
                    locateNearRadius:2000,
                    locateMidRadius:5000,
                    locateFarRadius:10000,
                    locateColor:'#1020f0',
                    locateWeight:2,
                    locateFillColor:'#1020f0',
                    locateFillOpacity:0.2,
                    locateIconUrl:'/app/map/template/LocationDisplay@2x.png',
                    locateIconSize:[32,32],
                    defaultIconUrl:'/leaflet/dist/images/marker-icon-2x.png',
                    defaultIconSize:[20,32],
                    pinIconUrl:'/app/map/template/Thumbtack_pin_24.png',
                    pinIconSize:[24, 24],
                    defaultLoc:[30.1, 120.1]
                };

                _.extend(this.options, options);

                this.eventNames = {
                    pinLocateComplete:'pin-my-locate-complete'
                };

                this.map = null;

                this.collections = {};

                this.collections.markerSourceCollection = new MapMarkerCollection();

                this.collections.markerSourceCollection.on('add', this._addMarker, this);
                this.collections.markerSourceCollection.on('remove', this._removeMarker, this);

                this.markers = [];
                this.myMarker = null;
                this.myPinMarker = null;
                this.myNearCircle = null;
                this.myMidCircle = null;
                this.myFarCircle = null;
                this.myIcon = L.icon({
                    iconUrl: this.options.locateIconUrl,
                    iconSize: this.options.locateIconSize
                });

                this.pinIcon = L.icon({
                    iconUrl: this.options.pinIconUrl,
                    iconSize: this.options.pinIconSize
                });

                this.defaultMarkerIcon = L.icon({
                    iconUrl: this.options.defaultIconUrl,
                    iconSize: this.options.defaultIconSize
                });
            },
            render:function(){
                console.log(arguments);
                if (arguments.length == 0){
                    this.map = L.map(this.options.mapDomId).setView(this.options.defaultLoc, 13);
                }else{
                    this.map = L.map(this.options.mapDomId).setView([arguments[0].latitude,arguments[0].longitude],13);
                }


                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    {
                        attribution:'&copy; OpenStreetMap'
                    })
                    .addTo(this.map);
                if (arguments.length != 0){
                    this._locateUpdate(arguments[0]);
                }

                return this;
            },
            addMarker:function(json){
                this.collections.markerSourceCollection.add(json);
            },
            setMarkers:function(json){
                this.collections.markerSourceCollection.set(json);
            },
            clearMarkers:function(){
                this.collections.markerSourceCollection.reset();

                for (var i=0; i<this.markers.length;i++){
                    var marker = this.markers[i];
                    this.map.removeLayer(marker);
                }

            },
            locateMe:function(){
                if (!navigator.geolocation){
                    alert(localName.locate);
                }

                var self = this;
                navigator.geolocation.getCurrentPosition(function(position){
                    var point = {
                        latitude:position.coords.latitude,
                        longitude:position.coords.longitude
                    }
                   // self._locateUpdate(point);
                });
            },
            beginPin:function(){
                this._beginPin();
            },
            show:function(){
                $(this.el).css({
                    'display':'block'
                });
            },
            hide:function(){
                $(this.el).css({
                    'display':'none'
                });
            },
            _addMarker:function(json){
                console.log('-----------');
                var marker = L.marker([json.get('lttd'), json.get('lgtd')], {
                    icon:this.defaultMarkerIcon
                })
                    .addTo(this.map)
                    .bindPopup("<b>"+json.get('name')+"</b>");

                this.markers.push(marker);
            },
            _removeMarker:function(json){

            },
            _locateUpdate:function(position){
                var self = this;
                var lgtd = position.longitude;
                var lttd = position.latitude;
                self.map.setView([lttd, lgtd], 13);

                self.myMarker = L.marker([lttd, lgtd], {
                        icon:self.myIcon
                    })
                    .addTo(self.map);
                self.myFarCircle = L.circle([lttd, lgtd], this.options.locateFarRadius, {
                        color:'yellow',
                        weight:3,
                        fillColor:'yellow',
                        fillOpacity:0.1
                    })
                    .addTo(self.map);
                self.myMidCircle = L.circle([lttd, lgtd], this.options.locateMidRadius, {
                        color:'#00ff00',
                        weight:3,
                        fillColor:'#00ff00',
                        fillOpacity:0.1
                    })
                    .addTo(self.map);
                self.myNearCircle = L.circle([lttd, lgtd], self.options.locateNearRadius, {
                        color:self.options.locateColor,
                        weight:self.options.locateWeight,
                        fillColor:self.options.locateFillColor,
                        fillOpacity:self.options.locateFillOpacity
                    })
                    .addTo(self.map);

            },
            _beginPin:function(){
                console.log(this.myNearCircle);
                this.myNearCircle?this.myNearCircle.setRadius(0):0;
                this.myMidCircle?this.myMidCircle.setRadius(0):0;
                this.myFarCircle?this.myFarCircle.setRadius(0):0;

                this.map.on('click', this._pinLoc, this);
            },
            _pinLoc:function(evt){
                this.map.off('click', this._pinLoc, this);
                if (!this.myPinMarker){
                    this.myPinMarker = L.marker(evt.latlng, {
                            icon:this.pinIcon
                        })
                        .addTo(this.map);
                }else{
                    this.myPinMarker.setLatLng(evt.latlng);
                }
                (this.myFarCircle)?this.myFarCircle.setLatLng(evt.latlng).setRadius(this.options.locateFarRadius):0;
                (this.myMidCircle)?this.myMidCircle.setLatLng(evt.latlng).setRadius(this.options.locateMidRadius):0;
                (this.myNearCircle)?this.myNearCircle.setLatLng(evt.latlng).setRadius(this.options.locateNearRadius):0;

                this.trigger(this.eventNames.pinLocateComplete, {lat:evt.latlng.lat, lng:evt.latlng.lng});

            }
        });

        return v;
    })