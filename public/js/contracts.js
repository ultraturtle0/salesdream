$(document).ready(() => {
	$("#Client").show();
	$("#Headhunter").hide();


	$("#submit").click((e) => {
		e.preventDefault();
		console.log("SUBMITTING");
		var body = {};

		body.C_client_name_1 = $("#C_client_name_1").val();
		body.C_company_name_1 = $("#C_company_name_1").val();
		body.C_client_address_1_1 = $("#C_client_address_1_1").val();
		body.C_client_address_1_1 = $("#C_client_address_2_2").val();
		body.C_client_email_1 = $("#C_client_email_1").val();
		body.C_rd = $("#C_rd").val();
		body.C_hr = $("#C_hr").val();
		body.C_tf = $("#C_tf").val();
		body.C_lf = $("#C_lf").val();
		body.C_rf = $("#C_rf").val();
		body.C_term = $("#C_term").val();

		body.H_client_name_1 = $("#H_client_name_1").val();
		body.H_company_name_1 = $("#H_company_name_1").val();
		body.H_client_address_1_1 = $("#H_client_address_1_1").val();
		body.H_client_address_1_1 = $("#H_client_address_2_2").val();
		body.H_client_email_1 = $("#H_client_email_1").val();
		body.H_af = $("#H_af").val();
		body.H_rd = $("#H_rd").val();
		body.H_lf = $("#H_lf").val();
	});
		
	$("#clientButton").click((e) => {
		console.log("client button pressed");
		$("#Headhunter").hide();
		$("#Client").show();


	});

	$("#headhunterButton").click((e) => {
		console.log("headhunter button pressed");
		$("#Client").hide();
		$("#Headhunter").show();


	});
});

