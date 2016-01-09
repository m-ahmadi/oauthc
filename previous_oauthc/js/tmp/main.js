$(function () {
	a.dom.shakeUser.on( a.constants.ANI_END_EVENTS, a.aniCssEnd);
	a.dom.shakePass.on( a.constants.ANI_END_EVENTS, a.aniCssEnd);
	a.dom.username.on('keyup keydown', a.submit.breakSaltRdy);
	a.dom.username.on('focus focusout', a.inputAni);
	a.dom.username.on('focus focusout', a.ie.inputUserIe);
	a.dom.password.on('focus focusout', a.ie.inputPassIe);
	
	$( a.dom.submit ).on('click', function (event) {
		if ( typeof $(this).attr('disabled') !== 'undefined' ) { return; }
		if ( a.dom.shakeUser.is(':animated') || a.dom.shakeUser.is(':animated') ) { return; }
		event.preventDefault();
		
		a.validate();	// validate will set uRdy and pRdy flags.
		
		if (a.flags.uRdy && a.flags.pRdy) {
			//form.submit();
			a.flags.formSubmitted = true;
			a.submit.beforeSend();
			
			if ( a.flags.saltRdy === true ) {
				a.submit.makeAjaxCall(true);
			} else if ( a.flags.saltRdy === false )  {
				
				var flagChecker = setInterval(function () {
					if (a.flags.saltRdy === true) {
						clearInterval(flagChecker);
						a.submit.makeAjaxCall(true);
						
					} else if ( a.flags.saltReqSuccess === false ) {
						clearInterval(flagChecker);
						a.submit.makeAjaxCall(false);
					}
				}, a.constants.FLAG_CHECK_INTERVAL );
			}
			
			//a.dom.hiddenUsername	.val(	$( a.selectors.username ).val().trim()		);
			//a.dom.hiddenSalt		.val(	a.data.salt									);
			//a.dom.hiddenPassword	.val(	$( a.selectors.password ).val().trim()		);
			/*
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
				
				if ( a.flags.saltRdy === true ) { // if salt request from change event is done and two second is passed
					a.submit.callback(success, data[0], true);
				} else if ( a.flags.saltRdy === false ) { // if salt request is not failed and two second is not passed
					var flagChecker = setInterval(function () {
						console.log(a.flags.saltRdy);
						
						if (a.flags.saltRdy === true) {
							clearInterval(flagChecker);
							a.submit.callback(success, data[0], true);
							
						} else if ( a.flags.saltReqSuccess === false ) {
							clearInterval(flagChecker);
							a.submit.callback(success, data[0], false);
						}
					}, a.constants.FLAG_CHECK_INTERVAL );
				}
			
				/*	issue
					if the user changes the username at the last minute, we set saltRdy to false,
					so the form will submit and sees that saltRdy is false, and thinks a salt proccess is in action,
					(weather the request isn't finished, or the request is finished but the salt waiting time isn't passed)
					so we start checking (every 500ms) the two flags that represent the two states of a salt proccess,
					inevitably one of those two flags will be set and we call the callback,
					but the thing is,
					because user didn't focusout of the input a new salt proccess is not going to be initiated,
					so the salt proccess in action is for the previous value of the username input right before user changed it and clicked submit.
				
				
			})
			.fail(function () {
				a.submit.callback(false, undefined, false);
			});
			
			*/
		}
	});
	
	$( a.dom.username ).on('change', function () {
		//console.log(  $(this).val().trim()  );
		if ( $(this).val().trim().length === 0 ) { return; }
		if ( a.flags.formSubmitted === true ) { return; }
		
		a.flags.saltRdy = false;
		
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
			a.flags.saltReqSuccess = true;
			a.data.salt = data;
			
			setTimeout(function () {
				a.flags.saltRdy = true;
			}, a.constants.SALT_WAIT_TIME );
			
			if ( a.flags.formSubmitted === false ) { a.change.callback(true, data); }
		})
		.fail(function () {
			a.flags.saltReqSuccess = false;
			if ( a.flags.formSubmitted === false ) { a.change.callback(false); }
		});
		
	});
	
	$('.overlap').fadeOut();
});