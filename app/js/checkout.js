(function ($, window, VITILITY) {
    'use strict';

    VITILITY.Checkout = function () {
        this._$elem = $('.p-checkout');
        
        this._$wrapperShipping = $('.js-shipping');
        this._$wrapperShippingAddress = $('.js-shipping_address');
        this._$wrapperShippingCosts = $('.js-shipping_costs');
        this._$wrapperTotal = $('.js-total');
        
        this._$country = $('.js-country');

        this._urlShippingCosts = this._$wrapperShippingCosts.attr('data-url-shipping_costs');

        this._tplShippingCosts = $.trim($('#tpl-shipping_costs').html());
        this._tplTotal = $.trim($('#tpl-total').html());
    };
    
    VITILITY.Checkout.prototype._updateShippingCosts = function() {
        var self = this;
        var iso;
        
        if (this._$wrapperShippingAddress.is(':visible')) {
            iso = this._$wrapperShippingAddress.find(this._$country).val();
        } else {
            iso = this._$country.filter(':visible').val();
            this._$country.val(iso);
        }
        
        var data = { iso : iso };

        $.getJSON(this._urlShippingCosts, data, function (data) {
            self._$wrapperShippingCosts.html(Mustache.render(self._tplShippingCosts, data));
            self._$wrapperTotal.html(Mustache.render(self._tplTotal, data));
        });
    };
    
    VITILITY.Checkout.prototype.init = function() {
        var self = this;
        
        if (this._$elem.length) {
            Modernizr.load({
                test: window.Mustache === undefined,
                yep: WWWROOT+'js/vendor/mustache-0.8.1.min.js'
            });
            
            this._$wrapperShipping.on('change', 'input[type="radio"]', function() {
                self._updateShippingCosts();
            });
            
            this._$country.on('change', function() {
                self._updateShippingCosts();
            });
        }
    };
    
}(jQuery, window, window.VITILITY));