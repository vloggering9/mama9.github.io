// <vclick> ---------------------------------------------------------------------
$().ready(function () {
    function send_vclick(action) {
        s_trk = getQueryVariable('s_trk');

        if (!s_trk) {
            return;
        }

        var url;
        var esub_input = $('input[name="esub"]');
        if (esub_input && esub_input.length > 0) {
            if (!action) {
                url = 'http://log.xoalt.com/?src=adcombo&s_act=a1&s_trk=' + s_trk;
            } else {
                url = 'http://log.xoalt.com/?src=adcombo&s_act=ac&s_trk=' + s_trk + '&action=' + action;
            }
        }
        else if (!action) {
            url = 'http://log.xoalt.com/?src=adcombo&s_act=vc&s_trk=' + s_trk;
        }

        if (url) {
            var cookie_name = 'vc_' + s_trk + '_' + action;

            if (Cookies.get(cookie_name) != 'true') {
                $.ajax({
                    url: url,
                    cache: false
                });
                Cookies.set(cookie_name, 'true', {expires: 30});
            }
        }
    }

    send_vclick();

    $(document).click(function () {
        send_vclick('click');
    });

    $(window).scroll(function () {
        if ($(window).scrollTop() >= 50) {
            send_vclick('scroll');
        }
    });
});
// </vclick> ---------------------------------------------------------------------
