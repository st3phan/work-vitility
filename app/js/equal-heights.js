(function ($, window, VITILITY) {
    'use strict';
    
    $.fn.equalHeights = function () {
        var currentTallest = 0,
            $elem = $(this),
            $singleElem;

        $elem.each(function () {
            $singleElem = $(this);

            if ($singleElem.outerHeight() > currentTallest) { currentTallest = $singleElem.outerHeight(); }
        });
        
        $elem.css({'height': currentTallest});
        
        return currentTallest;
    };

    VITILITY.EqualHeights = function () {
        this._wrapper = $('.eqh-wrapper');
        this._items = $('.eqh-item');
        this._resizing = false;
        this._resizeTimeout = 0;
    };
    
    VITILITY.EqualHeights.prototype._getResponsiveTag = function() {
        var tag = window.getComputedStyle(document.body,':after').getPropertyValue('content');
        tag = tag.replace( /"/g,''); // Firefox bugfix
        return tag;
    };
    
    VITILITY.EqualHeights.prototype.setEqualHeights= function ($wrapper) {
        var $items = $wrapper.find(this._items);
        $items.css({ height: 'auto' });
        
        if (this._getResponsiveTag() !== 'none' && this._getResponsiveTag() !== 'small-up' && this._getResponsiveTag() !== 'medium-up') {
            $items.equalHeights();
        }
    };
    
    VITILITY.EqualHeights.prototype.loopElementsForResize = function () {
        var self = this;
        
        this._wrapper.each(function () {
            self.setEqualHeights($(this));
        });
    };
    
    VITILITY.EqualHeights.prototype.checkResize = function() {
        var self = this;

        if (!this._resizing) {
            this._resizing = true;
            clearTimeout(this._resizeTimeout);

            this._resizeTimeout = setTimeout(function () { // wait a while so the function won't overflow the stack
                self.loopElementsForResize();
                self._resizing = false;
            }, 250);
        }
    };
          
    VITILITY.EqualHeights.prototype.init = function() {
        var self = this;

        $(window).on('resize load', function () {
            self.checkResize();
        });

        $(window).on('makeEqual', function () {
            self._wrappers = $('.equal-heights');
            self.checkResize();
        });

        $(window).trigger('makeEqual');
    };
    
}(jQuery, window, window.VITILITY));