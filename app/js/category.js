(function ($, window, VITILITY, Modernizr) {
    'use strict';

    VITILITY.Category = function () {
        this._$elem = $('.p-category');
        
        this._$filters = $('.js-filters');
        this._$products = $('.js-products');
        this._$activeFilters = $('.js-active-filters');
        this._$activeFiltersList = $('.js-active-filters-list');
        this._$paging = $('.js-paging');
        
        this._urlProducts = this._$filters.attr('data-url-products');
        
        this._tplProducts = $.trim($('#tpl-products').html());
        this._tplActiveFilters = $.trim($('#tpl-activeFilters').html());
        this._tplPaging = $.trim($('#tpl-paging').html());
    };
    
    VITILITY.Category.prototype._createSlider = function($el) {
        var self = this;

        $el.each(function () {
            var sliderMin = $(this).data('min');
            var sliderMax = $(this).data('max');
            var sliderStart = $(this).data('start');
            var sliderEnd = $(this).data('end');
            var sliderStep = $(this).data('step');
            var sliderMargin = $(this).data('margin');
            var $sliderLower = $(this).find('.lower');
            var $sliderUpper = $(this).find('.upper');
            var $sliderContainer = $(this).find('[class*="__container"]');
        
            $sliderContainer.noUiSlider({
            	start: [sliderStart, sliderEnd],
            	step: sliderStep,
            	margin: sliderMargin,
            	connect: true,
            	range: {
            		'min': sliderMin,
            		'max': sliderMax
            	},
                serialization: {
                    lower: [
                        $.Link({
                            target: $sliderLower
                        })
                    ],
                    upper: [
                        $.Link({
                            target: $sliderUpper
                        })
                    ],
                    format: {
                        decimals: 0
                    }
                }
            }).on('set', function() {
                var query = self._getQueryString();
                var url = self._urlProducts + query;
    
                self.getProducts(url, function() {
                    if(history.pushState) {
                        history.pushState(null, null, query);
                    }
                });
            });
        });
    };
    
    VITILITY.Category.prototype._getQueryString = function () {

        var queryString = this._$filters.find('input:not(:checkbox)').serialize();
        
        $('.product-filters__set').each(function() {
            var $checkboxes = $(this).find(':checked');
            var name = $checkboxes.eq(0).attr('name');
        
            if ($checkboxes.length) {
                var group = name+'='+$checkboxes.map(function() { 
                    return this.value; 
                }).get().join(',');
                
                if (queryString.indexOf('&') !== -1) {
                    queryString += '&' + group;
                } else {
                    queryString += group;
                }
            }
        });
        
        // return query string
        return '?' + queryString;
    };
    
    VITILITY.Category.prototype.getProducts = function (url, callback) {
        var self = this;

        $.getJSON(url, function (data) {
            self._setProducts(data);

            if (typeof callback === 'function') {
                callback();
            }
        });
    };
    
    VITILITY.Category.prototype._setProducts = function (data) {
        this._$products.html(Mustache.render(this._tplProducts, data));
    
        if (data.paging) {
            this._$paging.html(Mustache.render(this._tplPaging, data.paging));
        } else {
            this._$paging.hide();        
        }
    };
    
    VITILITY.Category.prototype._removeFilters = function (data) {
       this._$filters.find(':checked').trigger('click');
    };
    
    VITILITY.Category.prototype._setActiveFilters = function () {
        var $checkboxes = this._$filters.find(':checked');
        var data = {};
        data.filters = [];
        
        $checkboxes.each(function() {
            data.filters.push({
                name: $(this).attr('name'),
                value: $(this).val(),
                description: $(this).parent().text()
            });
        });

        JSON.stringify(data);
        this._$activeFiltersList.html(Mustache.render(this._tplActiveFilters, data));
        
        if (data.filters.length) {
            this._$activeFilters.removeClass('hide');
        } else {
            this._$activeFilters.addClass('hide');
        }
    };
    
    VITILITY.Category.prototype.init = function() {
        var self = this;
    
        if (this._$elem.length) {
            Modernizr.load({
                test: window.Mustache === undefined,
                yep: WWWROOT+'js/vendor/mustache-0.8.1.min.js',
                complete: function() {
                    self._$filters.show();
                }
            });
            
            this._$filters.on('change', '[type="checkbox"]', function() {
                var query = self._getQueryString();
                var url = self._urlProducts + query;
    
                self.getProducts(url, function() {
                    if(history.pushState) {
                        history.pushState(null, null, query);
                    }
                    
                    self._setActiveFilters();
                });
                
            }).on('click', '[data-link-name]', function(e) {
                var name = $(this).attr('data-link-name');
                var value = $(this).attr('data-link-value');
                $(':checkbox[name="'+name+'"][value="'+value+'"]:checked').trigger('click');
                $(this).parent().remove();
                e.preventDefault();
            }).on('click', '.category', function(e) {
                var href = $(this).attr('href');
                var query = href + window.location.search;
                window.location = window.location.origin + query;
                e.preventDefault();
            }).on('click', '#filters-remove', function(e) {
                self._removeFilters();
                e.preventDefault();
            });
            
            this._createSlider($('.slider'));
        }
    };
    
}(jQuery, window, window.VITILITY, window.Modernizr));