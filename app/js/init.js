(function ($, window, VITILITY, Modernizr) {
    'use strict';

    var EqualHeights = new VITILITY.EqualHeights();
    EqualHeights.init();

    var Global = new VITILITY.Global();
    Global.init();

    var Product = new VITILITY.Product();
    Product.init();

    var Category = new VITILITY.Category();
    Category.init();

    var Checkout = new VITILITY.Checkout();
    Checkout.init();

    var dealerOverview = new VITILITY.dealerOverview();
    dealerOverview.init();
    
    var dealerDetail = new VITILITY.dealerDetail();
    dealerDetail.init();

}(jQuery, window, window.VITILITY, window.Modernizr));