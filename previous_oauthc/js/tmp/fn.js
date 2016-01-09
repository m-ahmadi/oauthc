var a  = (function () {
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
var htmls = {
		ajaxImg: ''
		+	'<img '
		+	'src="images/ajax-loader.gif" ' // ajax-loader-728.gif
		+	'style="'
		+		'position: absolute;'
		+		'top: 50%;'
		+		'left: 11em;'// left: 43%;
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
		undefinedUser:			'این نام کاربری در سایت وجود ندارد.'							,
		wrongPass:				'رمز عبور اشتباه است.'								,
		success:				'شما با موفقیت وارد سامانه شدید.'							,
		during:					'در حال دریافت اطلاعات...'								,
		heading:				'ورود به سامانه'									,
		checkingUser:			'در حال بررسی نام کاربری.'								,
		userCheckSuccess:		'نام کاربری تایید شد.'									,
		userCheckFailed:		'خطا در ارتباط با سرور، دوباره نام کاربری را بنویسید.'					, // 'خطا در بررسی نام کاربری، دوباره نام کاربری را بنویسید.'
		userCheckPending:		'بررسی نام کاربری هنوز به اتمام نرسیده است.'						,
		everythingOk:			'آماده برای ورود به سامانه.'								,
		saltReqFailed:			'خطا در ارتباط با سرور، دوباره امتحان کنید.'
	},
	colors = {
		highlight:				'red'										, // FFCACA
		success:				'rgba(127, 255, 0, 0.9)'					, // rgba(127, 255, 0, 0.36)
		error:					'rgba(255, 0, 0, 0.9)'						, // rgba(255, 0, 0, 0.36)
		usernameDefaultBg:		'rgba(255, 255, 255, 0.2)'					,
		usernameDefaultColor:	'black'										,
		usernameDisabledBg:		'rgba(74, 74, 74, 0.45)'					,
		usernameDisabledColor:	'rgba(206, 206, 206, 0.52)'					,
		usernameSuccessBg:		'rgba(169, 255, 0, 0.36)'					,
		usernameSuccessColor:	'rgb(180, 255, 0)'							,
		userCheck:				'rgb(150, 150, 150)'						, // rgba(0, 196, 255, 0.36)		rgba(0, 0, 0, 0.36)
		userCheckSuccess:		'rgba(180, 255, 0, 0.36)'					,
		userCheckFailed:		'rgb(150, 150, 150)'						  // rgba(255, 0, 0, 0.36)
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
			padding: '1em',
			borderRadius: ''
		},
		messagesTop: {
			top: '0',
			padding: '0',
			borderRadius: '1em 1em 0px 0px'
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
	urls = {
		auth: 'http://10.255.148.60/cgi-bin/oauth2/authenticate' //'http://185.4.29.188/cgi-bin/oauth2/authenticate'
	},
	actions = {
		authenticate: 'authenticate',
		getSalt: 'GetSalt'
	},
	flags = {
		uRdy : false,
		pRdy : false,
		saltRdy : false,
		saltReqSuccess: undefined,
		formSubmitted: false
	},
	constants = {
		ANI_DUR_BASE: 800,
		ANI_DUR_VERYFAST: 100,
		ANI_DUR_FAST: 200,
		ANI_DUR_MEDIUM: 1000,
		ANI_DUR_SLOW: 2000,
		ANI_CLASSES_USED: 'animated shake tada flash',
		ANI_END_EVENTS: 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
		USER_MIN_CHAR: 3,
		PASS_MIN_CHAR: 1,
		SALT_WAIT_TIME: 2000,
		FLAG_CHECK_INTERVAL: 1000
	},
	data = {
		salt: ''
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
	if ( dom.username.val().length !== 0 ) {
		dom.userLabel.css( css.userLabelFocused );
	} else {
		dom.userLabel.css( css.userLabelDefault );
	}
}
var ie = (function () {
	return {
		inputUserIe: function () {
			if ( dom.userLabel.css('transform') === 'none' ) {
				dom.userLabel.css('top', '-2em');
			} else {
				dom.userLabel.css('top', '0');
			}
			
		},
		inputPassIe: function  () {
			if ( dom.passLabel.css('transform') === 'none' ) {
				dom.passLabel.css('top', '-2em');
			} else {
				dom.passLabel.css('top', '0');
			}
		}
	};
}());

	
var validate = (function () {
	var main = function () {
		var submit = dom.submit,
			username = dom.username,
			password = dom.password,
			uLength = username.val().trim().length,
			pLength = password.val().trim().length;
			
		var disable = function () {
			submit.attr({disabled: true});
			setTimeout(function () {
				submit.attr({disabled: false});
			}, constants.ANI_DUR_BASE);
		};
		var effect = function (which) {
			if ( typeof which === 'undefined' || isEmptyString(which) ) { throw new Error('effect:  Invalid argument.'); }
			
			dom[which].effect('highlight', {color: colors.highlight}, constants.ANI_DUR_BASE);
			$( selectors.shakePrefix + which ).toggleClass('animated shake');
		};
	
		if ( uLength < constants.USER_MIN_CHAR ) {	// username not ready
			effect('username');
			disable();
			flags.uRdy = false;
			username[0].focus();
		} else {
			flags.uRdy = true;
			if (!a.flags.pRdy) { password[0].focus(); }
		}
		
		if ( pLength < constants.PASS_MIN_CHAR ) {	// password not ready
			effect('password');
			disable();
			flags.pRdy = false;
			if (a.flags.uRdy) { password[0].focus(); } else { username[0].focus(); }
		} else {
			flags.pRdy = true;
			if (!a.flags.uRdy) { username[0].focus(); }
		}
		
		/*
		if ( a.flags.saltRdy === true ) {
			a.flags.uRdy = true;
			alertify.success(messages.everythingOk);
		} else if ( a.flags.saltRdy === false ) {
			if ( a.flags.uRdy === true ) {
				dom.submit.attr( {disabled: true} );
				username.effect('highlight', {color: colors.highlight}, constants.ANI_DUR_BASE, function () {
					dom.submit.attr( {disabled: false} );
				});
				alertify.error( messages.userCheckPending );
				a.flags.uRdy = false;
			}
		}
		*/
	};
	return main;
}());

var submit = (function () {
	var breakSaltRdy = function () {
		a.flags.saltRdy = false;
	};
	var getFormData = function () {
		var data = '';
		data += 'action=authent&';
		data += dom.form.serialize();
		data += '&redirect_uri=';
		data += dom.hiddenRedirectUri.val();
		return data;
	};
	var beforeSend = function () {
		dom.username.css( css.usernameDefault );
		dom.messages.animate( {opacity: '0'}, constants.ANI_DUR_VERYFAST );
		
		dom.wrapper.addClass('form-success');
		dom.title.animate({fontSize: '16px'}, constants.ANI_DUR_BASE);
		dom.title.text(messages.during);
		dom.username.attr({disabled: true});
		//dom.password.attr({disabled: true});	if password is disabled "form.serialize" will not pick it up
		dom.submit.attr({disabled: true});
		dom.form.animate({opacity: 0}, function () {
			dom.form.css({visibility: 'hidden'});
		});
		dom.card.prepend( $.parseHTML( htmls.ajaxImg ) );
	};
	var undoBeforeSend = function () {
		dom.wrapper.removeClass('form-success');
		dom.title.animate({fontSize: '40px'}, constants.ANI_DUR_BASE);
		dom.title.text(messages.heading);
		$( selectors.later.ajaxImg ).remove();
		dom.messages.css(css.messagesDefault);
		dom.messages.empty();
	};
	var callback = function (success, data, saltReqStat) {
		if ( typeof success !== 'boolean' ) { throw new Error('submit callback:  First argument must be boolean.'); }
		if ( typeof saltReqStat !== 'boolean' ) { throw new Error('submit callback:  Third argument must be boolean.'); }
		
		if ( success === true ) {
			undoBeforeSend();
			dom.messages.css({background : colors.success});
			dom.messages.append( $.parseHTML('<p>' + messages.success + '</p>') );
			dom.messages.animate({opacity: '1'}, constants.ANI_DUR_VERYFAST, function () {
				$( selectors.later.resultMessage ).toggleClass('animated tada');
			});
			
			
			setTimeout(function () {
				dom.messages.animate({opacity: '0'}, constants.ANI_DUR_MEDIUM, function () {
					//window.location.replace( data.url );
					window.location.reload();
				});
			}, constants.ANI_DUR_SLOW);
			
		} else if ( success === false ) {
			undoBeforeSend();
			dom.messages.css({background : colors.error});
			
			var msg = ( saltReqStat === true ) ? messages.wrongPass : messages.saltReqFailed; // important
			console.log(msg);
			dom.messages.append( $.parseHTML('<p>' + msg + '</p>') );
			dom.messages.animate({opacity: '1'}, constants.ANI_DUR_VERYFAST, function () {
				$( selectors.later.resultMessage ).toggleClass('animated wobble');
			});
			
			
			setTimeout(function () {
				dom.messages.animate({opacity: '0'}, constants.ANI_DUR_MEDIUM, function () {
					dom.form.css({visibility: 'visible'});
					dom.form[0].reset();
					dom.form.animate({opacity: 1}, constants.ANI_DUR_MEDIUM, function () {
						flags.formSubmitted = false;
						
						dom.username.attr({disabled: false});
						dom.password.attr({disabled: false});
						dom.submit.attr({disabled: false});
						
						dom.username[0].focus();
					});
				});
				flags.saltRdy = false;
			}, constants.ANI_DUR_SLOW);
		}
		
		
		
		/* // previous way
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
		*/
	};
	var makeAjaxCall = function (saltStatus) {
		dom.hiddenSalt.val( a.data.salt );
		
		$.ajax({
			url: a.urls.auth,
			type: 'GET',
			dataType: 'json',
			data: a.submit.getFormData()
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
			submit.callback( success, data[0], saltStatus );
		})
		.fail(function () {
			submit.callback(false, undefined, saltStatus);
		});
	};
	return {
		breakSaltRdy: breakSaltRdy,
		getFormData: getFormData,
		beforeSend: beforeSend,
		callback: callback,
		makeAjaxCall: makeAjaxCall
	};
}());

var change = (function () {
	var timer;
	
	var beforeSend = function () {
		if ( flags.formSubmitted === true ) { return; }
		dom.messages.css( css.messagesTop );
		dom.messages.css( {opacity: '0'} );
		alertify.log( a.messages.checkingUser );
		dom.username.attr({disabled: true});
		//dom.username.css( css.usernameDisabled );

		dom.messages.animate( {opacity: '0'}, constants.ANI_DUR_VERYFAST, function () {
			dom.messages.empty();
			dom.messages.css( {background : a.colors.userCheck} );
			dom.messages.append( $.parseHTML('<p>' + a.messages.checkingUser + '</p>') );
			dom.messages.animate( {opacity: '1'}, constants.ANI_DUR_VERYFAST );
		});
		
		/* // ticking dots function
		function () {
			var currentText = $(selectors.later.resultMessage).text(),
				counter = 0;
			timer = setInterval(function () {
				if (counter < 3) {
					$(selectors.later.resultMessage).text( currentText += '.' );
				} else if ( counter === 4 ) {
					$(selectors.later.resultMessage).text( currentText );
				}
			}, 500);
		}
		*/
	};
	var callback = function (success, data) {
		if ( success === true ) {
			flags.saltRdy = true;
			dom.messages.animate( {opacity: '0'} );
			dom.username.attr({disabled: false});
			/*
			setTimeout(function () {
				flags.saltRdy = true;
				//alertify.success( messages.userCheckSuccess );
				dom.messages.animate( {opacity: '0'} );
				//dom.messages.animate( {opacity: '0'}, function () {
				//	dom.messages.css( {background : a.colors.userCheckSuccess} );
				//	dom.messages.empty();
				//	dom.messages.append( $.parseHTML('<p>' + a.messages.userCheckSuccess + '</p>') );
				//	dom.messages.animate( {opacity: '1'}, function () {
				//		dom.userLabel.css( css.userLabelDefault ); // important
						//dom.username.css( css.usernameSuccess );
						dom.username.attr({disabled: false});
				//	});
				//});
				
			}, constants.SALT_WAIT_TIME );
			*/
			
		} else if (success === false) {
			flags.saltRdy = false;
			alertify.error( messages.userCheckFailed );
			
			dom.messages.animate( {opacity: '0'}, function () {
				dom.messages.css( {background : a.colors.userCheckFailed} );
				dom.messages.empty();
				dom.messages.append( $.parseHTML('<p>' + a.messages.userCheckFailed + '</p>') );
				dom.messages.animate( {opacity: '1'}, function () {
					dom.userLabel.css( css.userLabelDefault ); // important
					//dom.username.css( css.usernameDefault );
					dom.username.attr({disabled: false});
					dom.username.val('');
					dom.username[0].focus();
				});
			});
		}
	};
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
	data: data,
	constants: constants,
	
	validate: validate,
	submit: submit,
	change: change,
	
	aniCssEnd: aniCssEnd,
	inputAni: inputAni,
	ie: ie
};


}());