function searchToObject() {
    var pairs = window.location.search.substring(1).split("&"),
        obj = {},
        pair,
        i;

    for (i in pairs) {
        if (pairs.hasOwnProperty(i)) {
            if (pairs[i] === "") continue;
            pair = pairs[i].split("=");
            obj[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
        }
    }

    return obj;
}

var eventsSender = (function () {
    var params = searchToObject();
    params.esub = (window.acrum_extra && window.acrum_extra.esub) || params.esub;
    var _sender = {
        url: location.protocol + '//' + location.host + '/event/',
        on_focus: true,
        events: {
            scrolled_on_site: 0,
            clicked_on_site: 0,
            time_on_site: 0,
            load_begins: 1,
            dom_loaded: 0,
            fully_loaded: 0,
        },
        params: params,
        get_params: function () {
            var new_obj = {};
            var attrname;
            for (attrname in _sender.params) {
                if (_sender.params.hasOwnProperty(attrname)) {
                    new_obj[attrname] = _sender.params[attrname];
                }
            }
            for (attrname in _sender.events) {
                new_obj[attrname] = _sender.events[attrname];
            }
            return new_obj;
        },
        sendEvents: function (url, data, synk) {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", url, synk);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xhr.send(data);
        }
    };

    var scroll_licener = function () {
        _sender.events.scrolled_on_site = 1;
        window.removeEventListener('scroll', scroll_licener);
    };
    window.addEventListener('scroll', scroll_licener);

    var click_licener = function () {
        _sender.events.clicked_on_site = 1;
        window.removeEventListener('click', click_licener);
    };
    window.addEventListener('blur', function () {
        _sender.on_focus = false;
    });
    window.addEventListener('focus', function () {
        _sender.on_focus = true;
    });
    window.addEventListener('click', click_licener);
    setInterval(function () {
        if (_sender.on_focus) {
            _sender.events.time_on_site++;
        }
    }, 1000);

    document.addEventListener("DOMContentLoaded", function () {
        _sender.events.dom_loaded = 1;
    });

    window.addEventListener("load", function () {
        _sender.events.fully_loaded = 1;
    });
    navigator.sendBeacon = navigator.sendBeacon || _sender.sendEvents;
    window.onbeforeunload = function () {
        var data = JSON.stringify(_sender.get_params());
        navigator.sendBeacon(_sender.url, data, false);
        for (var i = 0; i <= 10000; i++) ;
    };
})();