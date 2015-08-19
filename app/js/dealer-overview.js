(function ($, window, VITILITY, Modernizr) {
    'use strict';

    VITILITY.dealerOverview = function () {
        this._$elem = $('.p-dealer-overview');

        this._gmap = null;
        this._$map = $('.js-map');
        
        this._urlDealers = this._$map.attr('data-url-dealers');
        
        this._defaultLat = 52.132633;
        this._defaultLng = 5.291266;
    };
    
    VITILITY.dealerOverview.prototype._getDealers = function(callback) {
        var self = this;
    
        $.getJSON(this._urlDealers, function (data) {
            
            if (typeof callback === 'function') {
                callback(data);
            }
        });
    };
    
    VITILITY.dealerOverview.prototype._initMap = function() {
        var self = this;
        
        self._$map.show();
        
        this._gmap = new GMaps({
            div: '#gmap',
            lat: self._defaultLat,
            lng: self._defaultLng
        });
        
        this._getDealers(function(data) {
            self._gmap.addMarkers(data);
            self._gmap.fitZoom();
        });
        
        $(window).resize(function() {
            self._gmap.fitZoom();
        });

    };
        
    VITILITY.dealerOverview.prototype.init = function() {
        var self = this;
    
        if (this._$elem.length) {
            Modernizr.load({
                test: window.Gmaps === undefined,
                yep: WWWROOT+'js/vendor/gmaps.js',
                complete: function() {
                    self._initMap();
                }
            });
        }
    };
    
}(jQuery, window, window.VITILITY, window.Modernizr));