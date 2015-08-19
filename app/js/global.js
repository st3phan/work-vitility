window.VITILITY = {};

(function ($, window, VITILITY) {
    'use strict';

    VITILITY.Global = function () {
        
        // shipping
        this._$wrapperShipping = $('.js-shipping');
        this._$wrapperShippingAddress = $('.js-shipping_address');
        this._$wrapperShippingCosts = $('.js-shipping_costs');
        this._$wrapperTotal = $('.js-total');
        this._$toggleShippingAddress = $('.js-toggle-shipping_address');
        this._$country = $('.js-country');
        
        // navigation
        this._$primaryNav = $('.js-primary-navigation');
        this._$mastheadNav = $('.js-masthead-navigation');
        this._$wrapperMobileNav = $('.js-mobile-navigation');
        this._$toggleMobileNav = $('.js-mobile-navigation-toggle');
        this._$languageSelect = $('.js-language-select');
        this._$valutaSelect = $('.js-valuta-select');
        
        // templates
        this._tplMobileNav = $('#tpl-mobile-navigation').html();
        
        // sidebar
        this._$sidebarToggle = $('.js-sidebar-toggle');
    };
    
    VITILITY.Global.prototype._toggleShippingAddress = function() {
        if (this._$toggleShippingAddress.is(':checked')) {
            this._$wrapperShippingAddress.show();
        } else {
            this._$wrapperShippingAddress.hide();
        }
    };
    
    VITILITY.Global.prototype._initMobileNav = function() {
    
        var data = {};
        var linkClass = 'mobile-navigation__link';
        
        // primary nav
        data.primary = this._$primaryNav.html();
        data.primary = data.primary.replace(/primary-navigation__link/g, linkClass);

        // masthead nav
        var $mastheadClone = this._$mastheadNav.clone();
        $mastheadClone.find('a').addClass(linkClass).removeClass('button medium inverse');
        data.masthead = $mastheadClone.html();
        
        // language & valuta select
        data.language = this._$languageSelect.html();
        data.valuta = this._$valutaSelect.html();

        // render        
        this._$wrapperMobileNav.html(Mustache.render(this._tplMobileNav, data));

    };

    VITILITY.Global.prototype.init = function() {
        var self = this;
        
        Modernizr.load({
            test: window.Mustache === undefined,
            yep: WWWROOT+'js/vendor/mustache-0.8.1.min.js',
            complete: function() {
                self._initMobileNav();
            }
        });
        
        if (this._$wrapperShipping.length) {
            this._$wrapperShipping.on('change', 'input[type="radio"]', function() {
                self._toggleShippingAddress();
            });

            this._toggleShippingAddress();
        }
        
        // Navigation
        
        this._$toggleMobileNav.on('touchend click', function (e) {
            $('body').toggleClass('show-navigation');
            e.preventDefault();
        });
        
        this._$wrapperMobileNav.on('change', 'select', function(e) {
            var href = $(this).find('option:selected').val();
            window.location = href;
        });
        
        // Sidebar

        this._$sidebarToggle.on('touchend click', function (e) {
            if (Modernizr.csstransforms) {
                $('body').toggleClass('show-basket');
                e.preventDefault();
            }
        });
        
        // Ogone
        
       if($('form[action*="ogone"]').length) {
            setTimeout(function () {
                $('form[action*="ogone"]').submit();
            }, 3000);
            //setTimeout(countdownTimer, 1000);
        }
        
/*
        function countdownTimer() {
            var time = $('#timer .time')
            current = parseInt(time.html());
            if (current > 0) {
                time.html(current - 1);
                current = parseInt(time.html())
                if (current == 1) {
                    $('#timer .seconds').html('second');
                }
                else if (current == 0) {
                    $('#timer .seconds').html('seconds');
                }
                setTimeout(countdownTimer, 1000);
            }
        }
*/
    };
    
}(jQuery, window, window.VITILITY));