function randomInteger(min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
}


$(function () {


    setTimeout(function () {
        var cc_vid = $('.cc_widget');
        cc_vid.fadeIn();
        cc_vid.animate({"right": "0px"}, "slow");
    }, 200);

    var cc_check = $('.cc_js_count_peoples').length;
    var cc_check1 = $('.cc_js_count').length;


    if (cc_check1 || cc_check) {
        var ccInt = setInterval(function () {

            var cc_peoples = $('.cc_js_count_peoples');
            var cc_count = $('.cc_js_count');
            var valCount = 0;
            var val = 0;

            if (cc_peoples.length) {
                valCount = parseInt(cc_peoples.text())
            }
            if (cc_count.length) {
                val = parseInt(cc_count.text());
            }


            if (val > 1) {
                val--;
                if (cc_count.length) {
                    cc_count.text(val)
                }

            }
            if (randomInteger(1, 2) == 1 && valCount > 2) {
                valCount--;
            }
            else {
                valCount++;
            }
            if (cc_peoples.length) {
                cc_peoples.text(valCount)
            }

        }, 10000);
    }


});