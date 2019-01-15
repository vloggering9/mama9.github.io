$(document).ready(function () {

    $('.button').on('touchend, click',function(){
  		$(this).closest('form').submit();
	});

    $("form").on('submit', function (e) {
        e.preventDefault();
    	var $form = $(this);

    	SuccessPage.sendDetails($form, function() {
			$form.fadeOut(500, function() {
				var $successMessage = $('<div>');
				$successMessage.html('Thank you, information was saved.');
				$successMessage.insertAfter($form);
			});
    	});
        return false;
    });
});
