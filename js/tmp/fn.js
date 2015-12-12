var a  = (function () {

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
var salt = '',
	highlight = 'red', // FFCACA
	aniDur = 800,
	
	selectors = {
		form : 'form[id="login-form"',
		username: 'input[id=username]',
		password: 'input[id="password"]',
		submit: 'button[id="login-button"]',
		redirectUri : 'input[name=redirect_uri]'
	},
	
	flags = {
		uRdy : false,
		pRdy : false,
		saltRdy : false
	},
	
	messages = {
		undefinedUser: 'این نام کاربری در سایت وجود ندارد',
		wrongPass: 'رمز عبور اشتباه است',
		success: 'شما با موفقیت وارد سامانه شدید',
		during: 'در حال دریافت اطلاعات...',
		heading: 'ورود به سامانه'
	},
	
	colors = {
		success: 'rgba(127, 255, 0, 0.36)',
		error: 'rgba(255, 0, 0, 0.36)',
		opacity : '0.36'
	};

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@



function getFormData () {
	var data = '';
	data += 'action=authent&';
	data += $('form').serialize();
	data += '&redirect_uri=';
	data += $('#login-form input[name=redirect_uri]').val();
	return data;
}





function beforeSend () {
	$('.wrapper').addClass('form-success');
	$('.fn-heading').animate({fontSize: '16px'}, 400);
	$('.fn-heading').text(messages.during);
	$('#username').attr({disabled: true});
	$('#password').attr({disabled: true});
	$('#login-button').attr({disabled: true});
	$('#login-form').animate({opacity: 0}, 400);
	$('.card').prepend( $.parseHTML('<img src="images/ajax-loader (abi).gif" style="position: absolute; top:50%; left:11em;" />') );
}


function done (success) {
	if ( typeof success !== 'boolean' ) { throw new Erro('callback:  Argument is not boolean.'); }
	
	$('.wrapper').removeClass('form-success');
	$('.fn-heading').animate({fontSize: '40px'}, 400);
	$('.fn-heading').text(messages.heading);
	$('.card > img').remove();
	$('.a-messages').empty();
	if ( success === true ) {
		$('.a-messages').css({background : colors.success});
		$('.a-messages').append( $.parseHTML('<p>' + messages.success + '</p>') );
	} else if ( success === false ) {
		$('.a-messages').css({background : colors.error});
		$('.a-messages').append( $.parseHTML('<p>' + messages.wrongPass + '</p>') );
	}
	$('.a-messages').css('opacity', '1');
	
	if ( success === true ) {
		$('.a-messages p').toggleClass('animated tada');
		setTimeout(function () {
			$('.a-messages').animate({opacity: '0'}, {
				duration: 1000,
				complete: function () {
					window.location.href = data[0].url;
				}
			});
		}, 2000);
	} else if ( success === false ) {
		$('.a-messages p').toggleClass('animated wobble');
		setTimeout(function () {
			$('.a-messages').animate({opacity: '0'}, {
				duration: 1000,
				complete: function () {
					$('#login-form').animate({opacity: 1}, 1000);
				}
			});
			form[0].reset();
			
			saltRdy = false;
			username[0].focus();
		}, 3000);
	}
}

function always () {

	$('#username').attr({disabled: false});
	$('#password').attr({disabled: false});
	$('#login-button').attr({disabled: false});
	
}

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
return {
	salt: salt,
	selectors: selectors,
	flags : flags,
	
	getFormData: getFormData,
	beforeSend : beforeSend,
	done: done,
	always: always
};


}());