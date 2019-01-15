var FoxyAPI = {
    getFoxycartPaymentUrl: function(callback) {
        $.post('/api/v3/foxy/get_payment_url', {
            esub: acrum_extra.esub,
            name: product_extra.name,
            price: product_extra.price,
            thumbnail: product_extra.thumbnails && product_extra.thumbnails.length ? product_extra.thumbnails[0] : null,
            country_code: $('[name="country_code"]').val(),
            variant_id: $('[name="variant_id"]').val(),
            quantity: $('[name="quantity"]').val(),
            currency: product_extra.currency,
        }, function(data) {
            if (!data.hasOwnProperty('payment_url')) {
                alert('Cannot get foxycart payment url');
                return
            }

            callback(data.payment_url);
        })
    },
    createOrder: function() {
        $('input[name=esub]').val(acrum_extra.esub);
        var form = $('input[name=esub]').first().closest('form');

        FoxyAPI.getFoxycartPaymentUrl(function(payment_url) {
            $('.js_submit').prop('disabled', false);
            document.location.href = payment_url;
        });
    },
};
