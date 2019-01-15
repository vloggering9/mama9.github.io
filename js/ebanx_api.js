var EbanxApi = {
    send_request: function (reqData) {
        var me = this;
        var $form = $('.sendform1');
        var $trResult = $('<input>');

        var successInp = $('input[name="transaction_result"]');
        var eRscroll = function () {
            var $elem = $(".c_err_mes").offset().top;
            $("html, body").animate({scrollTop: $elem}, 444);
        };
        $.ajax({
            type: 'POST',
            url: location.protocol + '//' + location.host + '/payment/ebanx_co/',
            data: JSON.stringify({data: reqData}),
            success: function (resp) {
                successInp.val(JSON.stringify(resp.payment));
                $('.c_err_mes').html('');
                $('.c_err_mes').append(
                    '<div class="success">' +
                    'Payment success next send form to adcombo' +
                    '</div>'
                );
                eRscroll();
                if (resp.message === "OK") {
                    $form.submit();
                } else {
                    $('.c_err_mes').html('');
                    $('.c_err_mes').append(
                        '<div>' +
                        'Invalid card data, please type again' +
                        '</div>'
                    );
                    eRscroll();
                }

            },
            error: function (err) {
                var err_message = err.responseJSON
                    ? err.responseJSON.message
                    : 'Internal Error';
                $('.c_err_mes').html('');
                $('.c_err_mes').append('<div>' + err_message + '</div>');
                eRscroll();
            },
            dataType: 'json',
            contentType: 'application/json; charset=utf-8'
        });
    },
    prepare_request: function ($frm) {
        this.$form_el = $frm;
        var res = {};
        $.each($frm.serializeArray(), function (idx, val) {
            res[val['name']] = val['value'];
        });
        return res
    },
    send_order: function () {
        this.$form_el.submit();
    },
    pre_order_send: function (el) {
        $('.js_submit').prop('disabled', true);
        var $frm = $(el).closest('form');
        EbanxApi.send_request(
            EbanxApi.prepare_request($frm)
        );
    }
}