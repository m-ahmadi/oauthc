var a  = (function () {
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
var htmls = {
		ajaxImg: ''
		+	'<img '
		+	'src="images/ajax-loader (abi).gif" '
		+	'style="'
		+		'position: absolute;'
		+		'top: 50%;'
		+		'left: 11em;'
		+	'"'
		+	' />'
	},
	selectors = {
		form:					'form[id=login-form]'						,
		username:				'input[id=username]'						,
		password:				'input[id=password]'						,
		submit:					'button[id=login-button]'					,
		hiddenRedirectUri:		'input[name=redirect_uri]'					,
		hiddenUsername:			'input[name=username]'						,
		hiddenSalt:				'input[name=salt]'							,
		hiddenPassword:			'input[name=password]'						,
		wrapper:				'div.wrapper'								,
		title:					'h1.fn-heading'								,
		card:					'div.card'									,
		messages:				'div.a-messages'							,
		shakePrefix:			'div#fn-shake-'								,
		shakeUser:				'div#fn-shake-username'						,
		shakePass:				'div#fn-shake-password'						,
		userLabel:				'label#fn-label-user'						,
		passLabel:				'label#fn-label-pass'						,
		
		later: {
			resultMessage:		'.a-messages p'								,
			ajaxImg:			'.card > img'								,
		}
	},
	messages = {
		undefinedUser:			'این نام کاربری در سایت وجود ندارد.'					,
		wrongPass:				'رمز عبور اشتباه است.'							,
		success:				'شما با موفقیت وارد سامانه شدید.'					,
		during:					'در حال دریافت اطلاعات...'						,
		heading:				'ورود به سامانه'								,
		checkingUser:			'در حال بررسی نام کاربری.'						,
		userCheckSuccess:		'نام کاربری تایید شد.'							,
		userCheckFailed:		'خطا در بررسی نام کاربری، دوباره نام کاربری را بنویسید.',
		userCheckPending:		'بررسی نام کاربری هنوز به اتمام نرسیده است.',
		everythingOk:			'آماده برای ورود به سامانه'
	},
	colors = {
		highlight:				'red'										, // FFCACA
		success:				'rgba(127, 255, 0, 0.36)'					,
		error:					'rgba(255, 0, 0, 0.36)'						,
		usernameDefaultBg:		'rgba(255, 255, 255, 0.2)'					,
		usernameDefaultColor:	'black'										,
		usernameDisabledBg:		'rgba(74, 74, 74, 0.45)'					,
		usernameDisabledColor:	'rgba(206, 206, 206, 0.52)'					,
		usernameSuccessBg:		'rgba(169, 255, 0, 0.36)'					,
		usernameSuccessColor:	'rgb(180, 255, 0)'							,
		userCheck:				'rgba(0, 196, 255, 0.36)'					, // rgba(0, 0, 0, 0.36)
		userCheckSuccess:		'rgba(180, 255, 0, 0.36)'					,
		userCheckFailed:		'rgba(255, 0, 0, 0.36)'			
	},
	dom = {
		form:					$( selectors.form				)			,
		username:				$( selectors.username			)			,
		password:				$( selectors.password			)			,
		submit:					$( selectors.submit				)			,
		hiddenRedirectUri:		$( selectors.hiddenRedirectUri 	)			,
		hiddenUsername:			$( selectors.hiddenUsername 	)			,
		hiddenSalt:				$( selectors.hiddenSalt			)			,
		hiddenPassword:			$( selectors.hiddenPassword 	)			,
		wrapper:				$( selectors.wrapper 			)			,
		title:					$( selectors.title 				)			,
		card:					$( selectors.card				)			,
		messages:				$( selectors.messages 			)			,
		shakeUser:				$( selectors.shakeUser			)			,
		shakePass:				$( selectors.shakePass 			)			,
		userLabel:				$( selectors.userLabel			)			,
		passLabel:				$( selectors.passLabel 			)	
	},
	css = {
		messagesDefault: {
			top: '40%',
			padding: '1em'
		},
		messagesTop: {
			top: '0',
			padding: '0'
		},
		usernameDefault: {
			cursor: 'auto',
			background: colors.usernameDefaultBg,
			color: colors.usernameDefaultColor
		},
		usernameDisabled: {
			cursor: 'wait',
			background: colors.usernameDisabledBg,
			color: colors.usernameDisabledColor
		},
		usernameSuccess: {
			cursor: 'auto',
			background: colors.usernameDefaultBg,
			color: colors.usernameSuccessColor
		},
		userLabelDefault: {
			transform: ''
		},
		userLabelFocused: {
			transform: 'translate(10%, -100%) scale(0.70)'
		}
	},
	flags = {
		uRdy : false,
		pRdy : false,
		saltRdy : false
	},
	urls = {
		auth: 'http://10.255.148.60/cgi-bin/oauth2/authenticate' //'http://185.4.29.188/cgi-bin/oauth2/authenticate'
	},
	actions = {
		authenticate: 'authenticate',
		getSalt: 'GetSalt'
	},
	salt = '',
	constants = {
		ANI_DUR: 800,
		USER_MIN_CHAR: 3,
		PASS_MIN_CHAR: 1,
		ANI_CLASSES_USED: 'animated shake tada flash',
		ANI_END_EVENT: 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
		SALT_WAIT_TIME: 2000
	};
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
function isObject (a) {
	return ( Object.prototype.toString.call(a) === "[object Object]" ) ? true : false;
}
function isArray (a) {
	return ( Object.prototype.toString.call(a) === "[object Array]" ) ? true : false;
}
function isEmptyString (a) {
	return ( typeof a === 'string'  &&  a.length === 0 ) ? true : false;
}


function aniCssEnd () {
	$(this).removeClass( constants.ANI_CLASSES_USED );
}
function inputAni(e) {
	if ( a.dom.username.val().length !== 0 ) {
		a.dom.userLabel.css( css.userLabelFocused );
	} else {
		a.dom.userLabel.css( css.userLabelDefault );
	}
}
	
var validate = (function () {
	var main = function () {
		var form = dom.form,
			submit = dom.submit
			username = dom.username,
			password = dom.password,
			uLength = username.val().trim().length,
			pLength = password.val().trim().length;
			
		var disable = function () {
			submit.attr({disabled: true});
			setTimeout(function () {
				submit.attr({disabled: false});
			}, constants.ANI_DUR);
		};
		var effect = function (which) {
			if ( typeof which === 'undefined' || isEmptyString(which) ) { throw new Error('effect:  Invalid argument.'); }
			
			dom[which].effect('highlight', {color: colors.highlight}, constants.ANI_DUR);
			$( selectors.shakePrefix + which ).toggleClass('animated shake');
		};
	
		if ( uLength < constants.USER_MIN_CHAR ) {	// username not ready
			effect('username');
			disable();
			a.flags.uRdy = false;
			username[0].focus();
		} else {
			a.flags.uRdy = true;
			if (!a.flags.pRdy) { password[0].focus(); }
		}
		
		if ( pLength < constants.PASS_MIN_CHAR ) {	// password not ready
			effect('password');
			disable();
			a.flags.pRdy = false;
			if (a.flags.uRdy) { password[0].focus(); } else { username[0].focus(); }
		} else {
			a.flags.pRdy = true;
			if (!a.flags.uRdy) { username[0].focus(); }
		}
		
		if ( a.flags.saltRdy === true ) {
			a.flags.uRdy = true;
			alertify.success(messages.everythingOk);
		} else if ( a.flags.saltRdy === false ) {
			if ( a.flags.uRdy === true ) {
				dom.submit.attr( {disabled: true} );
				username.effect('highlight', {color: colors.highlight}, constants.ANI_DUR, function () {
					dom.submit.attr( {disabled: false} );
				});
				alertify.error( messages.userCheckPending );
				a.flags.uRdy = false;
			}
		}
	};
	return main;
}());

var submit = (function () {
	var getFormData = function () {
		var data = '';
		data += 'action=authent&';
		data += dom.form.serialize();
		data += '&redirect_uri=';
		data += dom.hiddenRedirectUri.val();
		return data;
	}
	var beforeSend = function () {
		a.dom.messages.animate( {opacity: '0'} );
		a.dom.username.css( css.usernameDefault );
		
		
		dom.wrapper.addClass('form-success');
		dom.title.animate({fontSize: '16px'});
		dom.title.text(messages.during);
		dom.username.attr({disabled: true});
		dom.password.attr({disabled: true});
		dom.submit.attr({disabled: true});
		dom.form.animate({opacity: 0}, function () {
			dom.form.css({visibility: 'hidden'});
		});
		dom.card.prepend( $.parseHTML( htmls.ajaxImg ) );
	}
	var callback = function (success, data) {
		if ( typeof success !== 'boolean' ) { throw new Erro('done:  Argument is not boolean.'); }
		
		if ( success === true ) {
			
		} else if ( success === false ) {
			
		}
		dom.wrapper.removeClass('form-success');
		dom.title.animate({fontSize: '40px'}, 400);
		dom.title.text(messages.heading);
		$( selectors.later.ajaxImg ).remove();
		a.dom.messages.css(css.messagesDefault);
		dom.messages.empty();
		
		if ( success === true ) {
			dom.messages.css({background : colors.success});
			dom.messages.append( $.parseHTML('<p>' + messages.success + '</p>') );
		} else if ( success === false ) {
			dom.messages.css({background : colors.error});
			dom.messages.append( $.parseHTML('<p>' + messages.wrongPass + '</p>') );
		}
		
		dom.messages.css({opacity: '1'});
		
		if ( success === true ) {
			dom.messages.toggleClass('animated tada');
			setTimeout(function () {
				dom.messages.animate({opacity: '0'}, {
					duration: 1000,
					complete: function () {
						//window.location.replace( data.url );
					}
				});
			}, 2000);
		} else if ( success === false ) {
			$( selectors.later.resultMessage ).toggleClass('animated wobble');
			setTimeout(function () {
				dom.messages.animate({opacity: '0'}, 1000, function () {
					dom.form.css({visibility: 'visible'});
					dom.form.animate({opacity: 1}, 1000, function () {
						dom.form[0].reset();
						dom.username.attr({disabled: false});
						dom.password.attr({disabled: false});
						dom.submit.attr({disabled: false});
						dom.username[0].focus();
					});
				});
				flags.saltRdy = false;
			}, 3000);
		}
	}
	return {
		getFormData: getFormData,
		beforeSend: beforeSend,
		callback: callback
	};
}());

var change = (function () {
	var timer;
	
	var beforeSend = function () {
		alertify.log( a.messages.checkingUser );
		a.dom.username.attr({disabled: true});
		a.dom.username.css( css.usernameDisabled );
		
		a.dom.messages.animate( {opacity: '0'}, function () {
			a.dom.messages.empty();
			a.dom.messages.css( css.messagesTop );
			a.dom.messages.css( {background : a.colors.userCheck} );
			a.dom.messages.append( $.parseHTML('<p>' + a.messages.checkingUser + '</p>') );
			a.dom.messages.animate( {opacity: '1'}, function () {
				// var currentText = $(selectors.later.resultMessage).text(),
					// counter = 0;
				// timer = setInterval(function () {
					// if (counter < 3) {
						// $(selectors.later.resultMessage).text( currentText += '.' );
					// } else if ( counter === 4 ) {
						// $(selectors.later.resultMessage).text( currentText );
					// }
				// }, 500);
			});
		});
		
	}
	var callback = function (success, data) {
		if ( success === true ) {
			a.salt = data;
			setTimeout(function () {
				clearInterval(timer);
				a.flags.saltRdy = true;
				alertify.success( messages.userCheckSuccess );
				
				a.dom.messages.animate( {opacity: '0'}, function () {
					a.dom.messages.css( {background : a.colors.userCheckSuccess} );
					a.dom.messages.empty();
					a.dom.messages.append( $.parseHTML('<p>' + a.messages.userCheckSuccess + '</p>') );
					a.dom.messages.animate( {opacity: '1'}, function () {
						a.dom.userLabel.css( css.userLabelDefault ); // important
						a.dom.username.css( css.usernameSuccess );
						a.dom.username.attr({disabled: false});
					});
				});
				
			}, constants.SALT_WAIT_TIME );
			
		} else if (success === false) {
			clearInterval(timer);
			alertify.error( messages.userCheckFailed );
			
			a.dom.messages.animate( {opacity: '0'}, function () {
				a.dom.messages.css( {background : a.colors.userCheckFailed} );
				a.dom.messages.empty();
				a.dom.messages.append( $.parseHTML('<p>' + a.messages.userCheckFailed + '</p>') );
				a.dom.messages.animate( {opacity: '1'}, function () {
					a.dom.userLabel.css( css.userLabelDefault ); // important
					a.dom.username.css( css.usernameDefault );
					a.dom.username.attr({disabled: false});
					a.dom.username.val('');
					a.dom.username[0].focus();
				});
			});
		}
	}

	return {
		beforeSend: beforeSend,
		callback: callback
	};
}());
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
return {
	selectors: selectors,
	dom: dom,
	messages: messages,
	colors: colors,
	flags : flags,
	urls: urls,
	actions: actions,
	salt: salt,
	constants: constants,
	
	validate: validate,
	submit: submit,
	change: change,
	
	aniCssEnd: aniCssEnd,
	inputAni: inputAni
};


}());