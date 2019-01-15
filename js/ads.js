var AdcomboAdvertTop = $(".ac_advertisement");
AdcomboAdvertTop.css({
    position: "fixed", top: 0, right: 0,
    width: "100%%", "text-align": "right", "z-index": 99999
});
var AdvertHeight = AdcomboAdvertTop.height();
$(window).scroll(function () {
    var o = $(window).scrollTop();
    o > AdvertHeight ? AdcomboAdvertTop.hide() : AdcomboAdvertTop.show()
});
