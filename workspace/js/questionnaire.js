$(document).ready(() => {

	$("#FYcontainer").hide();

	$("#submit").click((e) => {
		e.preventDefault();
		var body = {};

		body.Volume = $("#Volume").val();
		console.log($("#Volume").val());
	});

	$("input[type='radio'][name='AccountingYear']").change(function(e) {
		console.log(this.value);
		if (this.value === 'true') {
			$("#FYcontainer").show();

		} else {
			$("#FYcontainer").hide();

		}
	});

});

