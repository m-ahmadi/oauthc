$(function () {
	a.misc.adjustHeight();
	$(window).on('resize', a.misc.adjustHeight);
	a.misc.time();
	$(document).on('keypress', a.misc.enterHandler);
	a.dom.username[0].focus();
	a.dom.shakeUser.on( a.constants.ANI_END_EVENTS, a.misc.aniCssEnd);
	a.dom.shakePass.on( a.constants.ANI_END_EVENTS, a.misc.aniCssEnd);
	a.dom.username.on('keyup keydown', a.submit.breakSaltRdy);
	a.dom.username.on('focus focusout', a.misc.inputAni);
	
	a.dom.username.on('focus', a.misc.ie.focus);
	a.dom.password.on('focus', a.misc.ie.focus);
	a.dom.username.on('focusout', a.misc.ie.focusout);
	a.dom.password.on('focusout', a.misc.ie.focusout);
	
	a.dom.submit.on('click', a.submit.main);
	a.dom.username.on('change', a.change.main);
	//$('.overlap').fadeOut();
});