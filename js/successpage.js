var SuccessPage = (function () {
	return {
		sendDetails: function($form, callback) {
			$.post($form.attr('action'),
				   $form.serialize())
			.done(function(){
				callback();
			})
			.error(function(resp){
				var jsonResp = $.parseJSON(resp.responseText)
				if (jsonResp.hasOwnProperty('error')) {
					alert(jsonResp.error);
				} else {
					alert('Error')
				}
			});
		}

	}
})();
