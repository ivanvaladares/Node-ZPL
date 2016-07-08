$(function () {

	$( document ).on('click', '#changePrinter', function(){
		window.location.href = "printer.html"
	});
	
	$( document ).on('click', '#returnButton', function(){
		window.location.href = "index.html?returnPrint=s"
	});

});