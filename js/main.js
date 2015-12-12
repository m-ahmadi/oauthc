$(function () {
	a.dom.username.on('focus', a.inputAni);
	a.dom.username.on('focusout', a.inputAni);
	
	$( a.selectors.submit ).on('click', function (event) {
		if ( typeof $(this).attr('disabled') !== 'undefined' ) { return; }
		if ( a.dom.shakeUser.is(':animated') || a.dom.shakeUser.is(':animated') ) { return; }
		event.preventDefault();
		
		a.validate(); // validate will set some flags, we act base on those flags from this point forward.
		
		if (a.flags.uRdy && a.flags.pRdy) {
			//form.submit();
			a.dom.hiddenUsername	.val(	$( a.selectors.username ).val().trim()		);
			a.dom.hiddenSalt		.val(	a.salt										);
			a.dom.hiddenPassword	.val(	$( a.selectors.password ).val().trim()		);
			$.ajax({
				url: a.urls.auth,
				type: 'GET',
				dataType: 'json',
				data: a.submit.getFormData(),
				beforeSend: a.submit.beforeSend
			})
			.done(function (data) {
				var success = false;
				if ( data[0].status === 'success' )  {
					success = true;
					alertify.success(data[0].status);
				}  else if ( data[0].status === 'error' ) {
					success = false;
					alertify.error(data[0].status + '<br />' + data[0].desc );
				}
				a.submit.callback(success, data[0]);
			})
			.fail(function () {
				a.submit.callback(false);
			});
		}
	});
	
	$( a.dom.username ).on('change', function () {
		//console.log(  $(this).val().trim()  );
		if ( $(this).val().trim() == 0 ) { return; }
		
		$.ajax({
			url: a.urls.auth,
			type: 'GET',
			dataType: 'text',
			data: {
				action: a.actions.getSalt,
				username: a.dom.username.val().trim()
			},
			beforeSend: a.change.beforeSend
		})
		.done(function (data) {
			a.change.callback(true, data);
		})
		.fail(function () {
			a.change.callback(false);
		});
		
	});
	
	$('.overlap').fadeOut();
	
	$( a.dom.shakeUser ).on( a.constants.ANI_END_EVENT, a.aniCssEnd);
	$( a.dom.shakePass ).on( a.constants.ANI_END_EVENT, a.aniCssEnd);
});