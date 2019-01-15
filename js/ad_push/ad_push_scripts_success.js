setTimeout(function () {
    var scr = document.createElement("script");
    scr.src = "https://%(domain)s.just-news.pro/subscriber.php?data_callback=get_params";
    scr.onload = function () {
        window.pushwru_init_iframe && window.pushwru_init_iframe('', function () {
            pushwru_show();
        });
    };
    document.head.appendChild(scr);

    if (navigator.userAgent.toLowerCase().indexOf("android") >= 0) {
        // android. blocking backpress
        console.log('popstate bind');

        // donot touch. without calling pushState the popstate binding will not work
        history.pushState({init: true}, "unused argument", "");

        $(window).on('popstate', function (e) {
            history.pushState({init: true}, "unused argument", "");
            console.log(e);
            pushwru_show && setTimeout(pushwru_show);
            e.preventDefault();
            return false;
        });
    }
}, 250);