$(window, document, undefined).ready(function () {
	document.getElementById("authen").disabled = true;
	$("#username").blur(function () {
		$.get( "http://10.255.148.60/cgi-bin/oauth2/authenticate?action=GetSalt&username=" + document.getElementById("username").value, function( data ) {
			document.getElementById("authen").disabled = false;
			localStorage.setItem("salt", data);
			document.getElementById("salt").value = data;
		});
	});
	$("#authen").on("click.Ripples", function (e) {
		document.getElementById("theForm").submit();
	})
	$("input").blur(function () {
		var $this = $(this);
		if ($this.val()) {
			$this.addClass("used");
		} else {
			$this.removeClass("used");
		}
	});
	var $ripples = $(".ripples");
	$ripples.on("click.Ripples", function (e) {
		if(document.getElementById("authen").disabled != true) {
			var $this = $(this);
			var $offset = $this.parent().offset();
			var $circle = $this.find(".ripplesCircle");
			var x = e.pageX - $offset.left;
			var y = e.pageY - $offset.top;
			$circle.css({
				top: y + "px",
				left: x + "px"
			});
			$this.addClass("is-active");
		}
	});
	$ripples.on("animationend webkitAnimationEnd mozAnimationEnd oanimationend MSAnimationEnd", function (e) {
	$(this).removeClass("is-active");
	});
});
