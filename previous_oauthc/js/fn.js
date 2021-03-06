var a  = (function () {
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
var htmls = {
	ajaxImg: ''
	+	'<img '
	+	'src="/oauthc/images/ajax-loader.gif" ' // ajax-loader-728.gif
//	+	'style="'
//	+		'position: absolute;'
//	+		'top: 50%;'
//	+		'left: 11em;'// left: 43%;
//	+	'"'
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
	undefinedUser:			'این نام کاربری در سایت وجود ندارد.'						,
	fail:					'ورود ناموفق.'									,
	success:				'شما با موفقیت وارد سامانه شدید.'							,
	during:					'در حال دریافت اطلاعات...'							,
	heading:				'ورود به سامانه'									,
	checkingUser:			'در حال بررسی نام کاربری.'							,
	userCheckSuccess:		'نام کاربری تایید شد.'								,
	userCheckFailed:		'خطا در ارتباط با سرور، دوباره نام کاربری را بنویسید.'				, // 'خطا در بررسی نام کاربری، دوباره نام کاربری را بنویسید.'
	userCheckPending:		'بررسی نام کاربری هنوز به اتمام نرسیده است.'					,
	everythingOk:			'آماده برای ورود به سامانه.'							,
	saltReqFailed:			'خطا در ارتباط با سرور، دوباره امتحان کنید.'
},
colors = {
	highlight:				'red'										, // FFCACA
	success:				'rgb(41, 181, 0)'							, // prev rgba(127, 255, 0, 0.9)		beforePrev rgba(127, 255, 0, 0.36)
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
	server : '', // http://185.4.29.188
	auth: '/cgi-bin/oauth2/authenticate',
	date: '/cgi-bin/oauth2/date' // http://100.80.0.175/fcpni?action=GetDate
},
actions = {
	authenticate: 'authenticate',
	getSalt: 'GetSalt'
},
flags = {
	formRdy: false,
	formSubmitted: false,
	saltRdy: false,
	saltReqSuccess: undefined
},
constants = {
	ANI_DUR_BASE: 800,
	ANI_DUR_VERYFAST: 100,
	ANI_DUR_FAST: 200,
	ANI_DUR_MEDIUM: 1000,
	ANI_DUR_SLOW: 2000,
	ANI_CLASSES_USED: 'animated shake tada flash',
	ANI_END_EVENTS: 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
	ENTER_KEY_CODE: 13,
	USER_MIN_CHAR: 3,
	PASS_MIN_CHAR: 1,
	SALT_WAIT_TIME: 2000,
	FLAG_CHECK_INTERVAL: 200
},
data = {
	salt: ''
};
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
function isObject(v) {
	return Object.prototype.toString.call(v) === "[object Object]";
}
function isArray(v) {
	if ( typeof Array.isArray === 'function' ) {
		return Array.isArray(v);
	} else {
		return Object.prototype.toString.call(v) === "[object Array]";
	}
}
function isEmptyString(v) {
	return ( typeof v === 'string'  &&  v.length === 0 ) ? true : false;
}


var misc = (function () {
	var enterHandler = function (e) {
		if ( e.which === constants.ENTER_KEY_CODE ) { dom.submit.trigger('click'); }
	};
	var aniCssEnd = function () {
		$(this).removeClass( constants.ANI_CLASSES_USED );
	};
	var inputAni = function () {
		if ( dom.username.val().length !== 0 ) {
			dom.userLabel.css( css.userLabelFocused );
		} else {
			dom.userLabel.css( css.userLabelDefault );
		}
	};
	var ie = (function () {
		var support = false,
			transformValue = 'translate(10%, -100%) scale(0.70)', //  matrix(0.7, 0, 0, 0.7, 7.31337, -27.9954)
			prefixes = '-webkit-transform -moz-transform -o-transform -ms-transform transform'.split(' '),
			el = $( document.createElement('div') );
		prefixes.forEach(function (item) {
			if ( typeof el.css(item) === 'string' ) { support = true; }
		});
		
		// since the page relies on :valid pseudo class to detect if the input has any value, do not bring the label down and keep it up,
		// and :valid is supoorted in IE10+, we have to write a fallback for IE9
		// the other behaviour of the page which is to take labels of input up when they get focused is working fine because:
		// :focues is supoorted in IE9,
		
		var focus = function () {
			var type = $(this).attr('type'),
				target = dom[type.slice(0, -4) + 'Label'],
				transformValue;
			if (support) {
				target.css('transform', transformValue);
			} else {
				target.css('top', '-2em');
			}
		};
		var focusout = function () {
			var inputLength = $(this).val().length,
				type = $(this).attr('type'),
				target = dom[type.slice(0, -4) + 'Label'];
			
			if ( inputLength === 0 ) {
				if (support) {
					target.css('transform', '');
				} else {
					target.css('top', '0');
				}
			} else if ( inputLength !== 0 ) {
				if (support) {
					target.css('transform', transformValue);
				} else {
					target.css('top', '-2em');
				}
			}
		};
		return {
			focus: focus,
			focusout: focusout
		};
	}());
	var time = (function () {
		var countTime = function (timestamps) {
			var date = new Date(timestamps),
				hour = date.getHours(),
				minute = date.getMinutes(),
				second = date.getSeconds(),
				secondCounter = second,
				minuteCounter = minute,
				hourCounter = hour,
				elSecond = $('.fn-time-second'),
				elMinute = $('.fn-time-minute'),
				elHour = $('.fn-time-hour');
			setInterval(function () {
				if (secondCounter === 60) {
					minuteCounter += 1;
					elMinute.html( (minuteCounter <= 9) ? '0'+minuteCounter : ''+minuteCounter );
					secondCounter = 0;
					elSecond.html( (secondCounter <= 9) ? '0'+secondCounter : ''+secondCounter );
					secondCounter += 1;
				} else {
					elSecond.html( (secondCounter <= 9) ? '0'+secondCounter : ''+secondCounter );
					secondCounter += 1;
				}
				
				if (minuteCounter === 60 ) {
					minuteCounter = 0;
					elMinute.html( (minuteCounter <= 9) ? '0'+minuteCounter : ''+minuteCounter );
					hourCounter += 1;
					elHour.html( (hourCounter <= 9) ? '0'+hourCounter : ''+hourCounter );
				}
				
				if ( hourCounter === 24 ) {
					hourCounter = 0;
					elHour.html( (hourCounter <= 9) ? '0'+hourCounter : ''+hourCounter );
				}
				
			}, 1000);
		};
		return function () {
			$.ajax({
				url : a.urls.server + a.urls.date,
				type: 'GET',
				dataType: 'json',
				beforeSend: function () {
					$('.header-leftdata').addClass('hidden');
				}
			})
			.done(function (data) {
				var response= data[0],
					timestamp = parseInt(response.timestamp, 10),
					d = new Date(timestamp),
					week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
					month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
					weekday = week[ d.getDay() ],
					monthName = month[ d.getMonth() ];
				
				$('.fn-endate-dayname').html( weekday.toUpperCase() );
				$('.fn-endate-daynumber').html( d.getDate() );
				$('.fn-endate-monthname').html( monthName.toUpperCase() );
				$('.fn-endate-year').html( d.getFullYear() );
				
				$('.fn-fadate-dayname').html(response.day.weekday.name);
				$('.fn-fadate-daynumber').html(response.day.monthday.name);
				$('.fn-fadate-monthname').html(response.month.name);
				var year = '' + response.year.full;
				$('.fn-fadate-year').html( year );
				
				$('.header-leftdata').removeClass('hidden');
				
				$('.fn-time-hour').html( (d.getHours() <= 9) ? '0'+d.getHours() : d.getHours() );
				$('.fn-time-minute').html( (d.getMinutes() <= 9) ? '0'+d.getMinutes() : d.getMinutes()  );
				$('.fn-time-second').html( (d.getSeconds() <= 9) ? '0'+d.getSeconds() : d.getSeconds()  );
				
				countTime(timestamp);
			})
			.fail(function () {
				alertify.error('GetDate failed.');
			});
		};
	}());
	var adjustHeight = (function () {
		var start = 600,
			el = $('.wrapper'),
			currentTop = parseInt( el.css('padding-top'), 10),
			currentBott = parseInt( el.css('padding-bottom'), 10);
		return function () {
			var current = window.innerHeight,
				res;
			
			if ( current > start ) {
				console.log(current);
				res = (current - start) / 2;
				el.css('padding-top', currentTop+res+'px');
				el.css('padding-bottom', currentBott+res+'px');
			}
		};
	}());
	return {
		enterHandler: enterHandler,
		aniCssEnd: aniCssEnd,
		ie: ie,
		time: time,
		adjustHeight: adjustHeight
	};
}());
var ani = (function () {
	var support = false,
	prefixes = '-webkit-animation -moz-animation -o-animation -ms-animation animation'.split(' '),
	el = $( document.createElement('div') );
	
	prefixes.forEach(function (item) {
		if ( typeof el.css(item) === 'string' ) { support = true; }
	});
	
	var successAni = function (selector) {
		if (support) {
			$(selector).toggleClass('animated tada');
		} else {
			$(selector).velocity('callout.tada'); //$(selector).effect('bounce', constants.ANI_DUR_BASE);
		}
	};
	var failAni = function (selector) {
		if (support) {
			$(selector).toggleClass('animated wobble');
		} else {
			$(selector).velocity('callout.shake'); //$(selector).effect('shake', constants.ANI_DUR_BASE);
		}
	};
	var shakeAni = function (selector) {
		if (support) {
			$(selector).toggleClass('animated shake');
		} else {
			$(selector).velocity('callout.shake'); //$(selector).effect('shake', constants.ANI_DUR_BASE);
		}
	};
	
	return {
		successAni: successAni,
		failAni: failAni,
		shakeAni: shakeAni
	};
}());
var validate = (function () {
	var main = function () {
		var uRdy = false,
			pRdy = false,
			submit = dom.submit,
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
			ani.shakeAni( selectors.shakePrefix + which );
		};
	
		if ( uLength < constants.USER_MIN_CHAR ) {	// username not ready
			effect('username');
			disable();
			uRdy = false;
			username[0].focus();
		} else {
			uRdy = true;
			if (!pRdy) { password[0].focus(); }
		}
		
		if ( pLength < constants.PASS_MIN_CHAR ) {	// password not ready
			effect('password');
			disable();
			pRdy = false;
			if (uRdy) { password[0].focus(); } else { username[0].focus(); }
		} else {
			pRdy = true;
			if (!uRdy) { username[0].focus(); }
		}
		
		flags.formRdy = (uRdy === true && pRdy === true) ? true : false;
		
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
		dom.messages.empty();
		dom.messages.animate( {opacity: '0'}, constants.ANI_DUR_VERYFAST, function () {
			dom.messages.empty(); // if here: chrome problem, if not ie problem
		} );
		dom.username.css( css.usernameDefault );
		//dom.messages.animate( {opacity: '0'}, constants.ANI_DUR_VERYFAST );
		
		dom.title.addClass('form-success');
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
		dom.title.removeClass('form-success');
		dom.title.animate({fontSize: '40px'}, constants.ANI_DUR_BASE);
		dom.title.text(messages.heading);
		$( selectors.later.ajaxImg ).remove();
		dom.messages.css(css.messagesDefault);
		dom.messages.empty();
	};
	var callback = function (success, saltReqStat, data) {
		if ( typeof success !== 'boolean' ) { throw new Error('submit.callback:  The first arg is not boolean.'); }
		
		if ( success === true ) {
			undoBeforeSend();
			dom.messages.css({background : colors.success});
			dom.messages.append( $.parseHTML('<p>' + messages.success + '</p>') );
			dom.messages.animate({opacity: '1'}, constants.ANI_DUR_VERYFAST, function () {
				//$( selectors.later.resultMessage ).toggleClass('animated tada');
				ani.successAni( selectors.later.resultMessage );
			});

			setTimeout(function () {
				dom.messages.animate({opacity: '0'}, constants.ANI_DUR_MEDIUM, function () {
					window.location.replace( data.url );
					//window.location.reload();
				});
			}, constants.ANI_DUR_SLOW);
			
		} else if ( success === false ) {
			undoBeforeSend();
			dom.messages.css({background : colors.error});
			
			var msg = ( saltReqStat === true ) ? messages.fail : messages.saltReqFailed; // important
			dom.messages.append( $.parseHTML('<p>' + msg + '</p>') );
			dom.messages.animate({opacity: '1'}, constants.ANI_DUR_VERYFAST, function () {
				//$( selectors.later.resultMessage ).toggleClass('animated wobble');
				ani.failAni( selectors.later.resultMessage );
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
		dom.title.removeClass('form-success');
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
			dom.messages.append( $.parseHTML('<p>' + messages.fail + '</p>') );
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
			url: urls.server + urls.auth,
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
			submit.callback( success, saltStatus, data[0] );
		})
		.fail(function () {
			submit.callback(false, saltStatus);
		});
	};
	var main = function (e) {
		if ( typeof $(this).attr('disabled') !== 'undefined' ) { return; }
		if ( dom.shakeUser.is(':animated') || dom.shakeUser.is(':animated') ) { return; }
		e.preventDefault();
		
		validate();	// validate will set uRdy and pRdy flags.
		
		if ( flags.formRdy === true ) {
			//form.submit();
			flags.formSubmitted = true;
			submit.beforeSend();
			
			if ( flags.saltRdy === true ) {
				submit.makeAjaxCall(true);
			} else if ( flags.saltRdy === false )  {
				
				var flagChecker = setInterval(function () {
					if ( flags.saltRdy === true ) {
						clearInterval(flagChecker);
						submit.makeAjaxCall(true);
						
					} else if ( a.flags.saltReqSuccess === false ) {
						clearInterval(flagChecker);
						submit.makeAjaxCall(false);
					}
				}, constants.FLAG_CHECK_INTERVAL );
			}
			
			/*
			//a.dom.hiddenUsername	.val(	$( a.selectors.username ).val().trim()		);
			//a.dom.hiddenSalt		.val(	a.data.salt									);
			//a.dom.hiddenPassword	.val(	$( a.selectors.password ).val().trim()		);
			
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
	};
	return {
		breakSaltRdy: breakSaltRdy,
		getFormData: getFormData,
		beforeSend: beforeSend,
		callback: callback,
		makeAjaxCall: makeAjaxCall,
		main: main
	};
}());
var change = (function () {
	var timer;
	
	var beforeSend = function () {
		if ( flags.formSubmitted === true ) { return; }
		dom.messages.css( css.messagesTop );
		
		dom.messages.css( {background : colors.userCheck} );
		dom.messages.css( {opacity: '0'} );
		alertify.log( a.messages.checkingUser );
		//dom.username.attr({disabled: true});
		//dom.username.css( css.usernameDisabled );

		dom.messages.animate( {opacity: '0'}, constants.ANI_DUR_VERYFAST, function () {
			dom.messages.empty();
			dom.messages.append( $.parseHTML('<p>' + messages.checkingUser + '</p>') );
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
		if ( flags.formSubmitted === true ) { return; }
		if ( success === true ) {
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
	var main = function () {
		//console.log(  $(this).val().trim()  );
		if ( $(this).val().trim().length === 0 ) { return; }
		if ( a.flags.formSubmitted === true ) { return; }
		
		a.flags.saltRdy = false;
		
		$.ajax({
			url: urls.server + urls.auth,
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
		
	};
	return {
		beforeSend: beforeSend,
		callback: callback,
		main: main
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
	
	ani: ani,
	validate: validate,
	submit: submit,
	change: change,
	
	misc: misc
};


}());