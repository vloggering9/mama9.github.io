function stripeResponseHandler(status, response) {
  // Grab the form:
  var $form = $('#payment-form');

  if (response.error) { // Problem!

    var cardType = $.payment.cardType($('.cc-number').val());
    $('.cc-number').toggleInputError(!$.payment.validateCardNumber($('.cc-number').val()));
    $('.cc-cvc').toggleInputError(!$.payment.validateCardCVC($('.cc-cvc').val(), cardType));
    $('.cc-brand').text(cardType);

    $('.validation').removeClass('text-danger text-success');
    $('.validation').addClass($('.has-error').length ? 'text-danger' : 'text-success');

    // Show the errors on the form:
    $form.find('.payment-errors').text(response.error.message);
    $form.find('.submit').prop('disabled', false); // Re-enable submission

  } else { // Token was created!

    // Get the token ID:
    var token = response.id;

    // Insert the token ID into the form so it gets submitted to the server:
    $form.append($('<input type="hidden" name="stripeToken">').val(token));

    // Submit the form:
//    $form.get(0).submit();

    $.post($form.prop('action'), $form.serialize()).success(function(resp){
      $form.hide();

      var $successMessage = $('<div>');
      $successMessage.html('Thank you, payment was successfull.');
      $successMessage.addClass('success');
      $successMessage.insertAfter($form);
      $form.remove()
    }).fail(function(error) {
      console.log(error);
      $form.find('.submit').prop('disabled', false);
    })
  }
};

$(function() {
  var $form = $('#payment-form'),
      $detailsForm = $('#details');

  $detailsForm.off('submit');
  $form.off('submit');
  $form.hide();
  $('[data-numeric]').payment('restrictNumeric');
  $('.cc-number').payment('formatCardNumber');
  $('.cc-exp').payment('formatCardExpiry');
  $('.cc-cvc').payment('formatCardCVC');

  $.fn.toggleInputError = function(erred) {
    this.parent('.form-group').toggleClass('has-error', erred);
    return this;
  };

  $detailsForm.on('submit', function (e) {
    e.preventDefault();
    var $oThis = $(this);

    SuccessPage.sendDetails($oThis, function() {
      $oThis.fadeOut(200, function() {
        var cardPaymentTypeSelected = $('input[name="payment_type"][value=p_on_account]').is(":checked");
        if (cardPaymentTypeSelected) {
          $form.fadeIn(200);
        } else {
          $form.off('submit');
          $form.remove();
          var $successMessage = $('<div>');
          $successMessage.html('Thank you, your information was updated.');
          $successMessage.insertAfter($detailsForm);
	      $successMessage.addClass('success');
          $detailsForm.remove();
        }
      });
    });
    return false;
  });



  $form.on('submit', function(event) {
    event.preventDefault();
    // Disable the submit button to prevent repeated clicks:
    $form.find('.submit').prop('disabled', true);

    // Request a token from Stripe:
    Stripe.card.createToken($form, stripeResponseHandler);

    // Prevent the form from being submitted:
    return false;
  });
});
