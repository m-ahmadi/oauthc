$(function () {
	var highlight = 'red', // FFCACA
		aniDur = 800;
	
	$( a.selectors.submit ).click(function (event) {
		if ( typeof $(this).attr('disabled') !== 'undefined' ) { return; }
		if ( $('#fn-shake-username').is(':animated') || $('#fn-shake-password').is(':animated') ) { return; }
		
		event.preventDefault();
		var form = form = $( a.selectors.form ),
			username = $( a.selectors.username ),
			password = $( a.selectors.password ),
			submit = $( this ),
			uLength = username.val().trim().length,
			pLength = password.val().trim().length;
			
		var dis = function () {
			submit.attr({disabled: true});
			setTimeout(function () {
				submit.attr({disabled: false});
			}, aniDur);
		}
		
		if (uLength < 4) {
			username.effect('highlight', {color: highlight}, aniDur);
			$('#fn-shake-username').toggleClass('animated shake');
			dis();
			a.flags.uRdy = false;
			username[0].focus();
		} else {
			a.flags.uRdy = true;
			if (!a.flags.pRdy) { password[0].focus(); }
		}
		
		if (pLength < 3) {
			password.effect('highlight', {color: highlight}, aniDur);
			$('#fn-shake-password').toggleClass('animated shake');
			dis();
			a.flags.pRdy = false;
			if (a.flags.uRdy) { password[0].focus(); } else { username[0].focus(); }
		} else {
			a.flags.pRdy = true;
			if (!a.flags.uRdy) { username[0].focus(); }
		}
		
		if ( a.flags.saltRdy === true ) {
			a.flags.uRdy = true;
			alertify.success('سالت آماده شد');
		} else if ( a.flags.saltRdy === false ) {
			if ( a.flags.uRdy === true ) {
				$('#login-button').attr( {disabled: true} );
				username.effect('highlight', {color: highlight}, aniDur, function () {
					$('#login-button').attr( {disabled: false} );
				});
				alertify.error('سالت آماده نیست');
				a.flags.uRdy = false;
			}
		}
		
		
		if (a.flags.uRdy && a.flags.pRdy) {
			//form.submit();
			alert();
			$('#login-form input[name=username]').val(	$('#username').val().trim()		);
			$('#login-form input[name=salt]').val(		a.salt		);
			$('#login-form input[name=password]').val(	$('#password').val().trim()		);
			
			$.ajax({
				url: 'http://10.255.148.60/cgi-bin/oauth2/authenticate',
				type: 'GET',
				dataType: 'json',
				data: a.getFormData,
				beforeSend: a.beforeSend
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
				a.done(success);
			})
			.fail(function () {
				a.callback(false);
			})
			.always(a.always);
		}
	});
	
	
	
	$('#username').on('change', function () {
		console.log(  $(this).val().trim()  );
		if ( $(this).val().trim() == 0 ) { return; }
		
		a.flags.saltRdy = false;
		setTimeout(function () {
			a.flags.saltRdy = true;
		}, 2000);
		/*
		$.ajax({
			url: 'http://10.255.148.60/cgi-bin/oauth2/authenticate',//'http://185.4.29.188/cgi-bin/oauth2/authenticate',
			type: 'GET',
			dataType: 'text',
			data: {
				action: 'GetSalt',
				username: $( a.selectors.username ).val().trim()
			},
			beforeSend: function () {
				
			}
		}).done(function (data) {
			a.salt = data;
			setTimeout(function () {
				a.flags.saltRdy = true;
			}, 2000);
		});
		*/
	});
	
	$('.overlap').fadeOut();
	
	
	
	function aniEnd () {
		$(this).removeClass('animated shake tada');
	}
	$('#fn-shake-username').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', aniEnd);
	$('#fn-shake-password').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', aniEnd);
});