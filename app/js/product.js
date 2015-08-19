(function ($, window, VITILITY) {
    'use strict';

    VITILITY.Product = function () {
        this._$elem = $('.p-product');
        
        this._$galleryThumbnail = $('.js-gallery-thumbnail');
        this._$galleryThumbnailVideo = $('.js-gallery-thumbnail-video');
        this._$galleryMainImage = $('.js-gallery-main_image');
        this._$gallerySpinner = $('.js-gallery-spinner');
        this._$videos = null;
        
        this._tplYoutube = $('#tpl-youtube').html();
    };
    
    VITILITY.Product.prototype._preloadImage = function(src, callback) {
        var img = new Image();
        img.src = src;
        
        $(img).on('load', function() {
            if (typeof callback === 'function') {
                callback(img);
            }
        });
        
        if ($(img)[0].complete) {
            $(img).load();
        }
    };
    
    VITILITY.Product.prototype._loadGalleryImage = function(src) {
        var self = this;
        
        this._$gallerySpinner.show();
        this._$galleryMainImage.find('img, .iframe-youtube').remove();
        
        this._preloadImage(src, function(img) {
            self._$galleryMainImage.append($(img).hide().fadeIn());
            self._$gallerySpinner.hide();
        });
    };
    
    VITILITY.Product.prototype._loadVideo = function(src) {
        var self = this;
        var data = { id: src };
        
        this._$gallerySpinner.show();
        this._$galleryMainImage.find('img, .iframe-youtube').remove();
        this._$galleryMainImage.append(Mustache.render(this._tplYoutube, data));
        this._$gallerySpinner.hide();
        
        this._prepareVideo();
        this._resizeVideo();
    };
    
    VITILITY.Product.prototype._prepareVideo = function() {
    
        this._$videos = $('.iframe-youtube');
        
        this._$videos.each(function() {
            $(this)
            .attr('data-aspectRatio', this.height / this.width)
            .removeAttr('height')
            .removeAttr('width');
        });
    };
    
    VITILITY.Product.prototype._resizeVideo = function() {
        var newWidth = this._$galleryMainImage.width();
        
        this._$videos.each(function() {
            $(this)
            .width(newWidth)
            .height(Math.floor(newWidth * $(this).attr('data-aspectRatio')));
        });
    };
    
    
    /*
     * http://stackoverflow.com/questions/5830387/how-to-find-all-youtube-video-ids-in-a-string-using-a-regex/5831191#5831191
     */
     
    VITILITY.Product.prototype._getYoutubeId = function(url) {
        var re = /https?:\/\/(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\S*[^\w\s-])([\w-]{11})(?=[^\w-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*/ig;
        return re.exec(url)[1];
    };
    
    VITILITY.Product.prototype.init = function() {
        var self = this;
        
        if (this._$elem.length) {
            Modernizr.load({
                test: window.Mustache === undefined,
                yep: WWWROOT+'js/vendor/mustache-0.8.1.min.js'
            });
            
            this._$galleryThumbnail.on('click', function(e) {
                $(this).addClass('-active').siblings().removeClass('-active');
                
                // Video
                if ($(this).is(self._$galleryThumbnailVideo)) {
                    var url = $(this).find('a').attr('href');
                    var youtubeId = self._getYoutubeId(url);                
                    self._loadVideo(youtubeId);
                // Image
                } else {
                    var src = $(this).find('a').attr('href');
                    self._loadGalleryImage(src);
                }
    
                e.stopPropagation();
                e.preventDefault();
            });
            
            this._prepareVideo();
            this._resizeVideo();
    
            $(window).resize(function() {
                self._resizeVideo();
            }).resize();
        }
    };
    
}(jQuery, window, window.VITILITY));