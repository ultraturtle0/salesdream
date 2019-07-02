$(document).ready(() => {
	$("#ar-deatial").hide();
	$("#customer-deatial").hide();
	$("#ap-deatial").hide();
	$("#vendor-deatial").hide();
	$("#payroll-deatial").hide();
	$("#inventory-deatial").hide();
	$("#generalAccounting-deatial").hide();
	$("#generalAccounting-deatial2").hide();


	$("#button-ar").click((e) => {
		console.log("ar button pressed");
		$("#ar-deatial").show();
		$("#customer-deatial").hide();
		$("#ap-deatial").hide();
		$("#vendor-deatial").hide();
		$("#payroll-deatial").hide();
		$("#inventory-deatial").hide();
		$("#generalAccounting-deatial").hide();
		$("#generalAccounting-deatial2").hide();


	});

	$("#button-customer").click((e) => {
		console.log("customer button pressed");
		$("#ar-deatial").hide();
		$("#customer-deatial").show();
		$("#ap-deatial").hide();
		$("#vendor-deatial").hide();
		$("#payroll-deatial").hide();
		$("#inventory-deatial").hide();
		$("#generalAccounting-deatial").hide();
		$("#generalAccounting-deatial2").hide();


	});

	$("#button-ap").click((e) => {
		console.log("ap button pressed");
		$("#ar-deatial").hide();
		$("#customer-deatial").hide();
		$("#ap-deatial").show();
		$("#vendor-deatial").hide();
		$("#payroll-deatial").hide();
		$("#inventory-deatial").hide();
		$("#generalAccounting-deatial").hide();
		$("#generalAccounting-deatial2").hide();

	});

	$("#button-vendor").click((e) => {
		console.log("headhunter button pressed");
		$("#ar-deatial").hide();
		$("#customer-deatial").hide();
		$("#ap-deatial").hide();
		$("#vendor-deatial").show();
		$("#payroll-deatial").hide();
		$("#inventory-deatial").hide();
		$("#generalAccounting-deatial").hide();
		$("#generalAccounting-deatial2").hide();


	});

	$("#button-payroll").click((e) => {
		console.log("headhunter button pressed");
		$("#ar-deatial").hide();
		$("#customer-deatial").hide();
		$("#ap-deatial").hide();
		$("#vendor-deatial").hide();
		$("#payroll-deatial").show();
		$("#inventory-deatial").hide();
		$("#generalAccounting-deatial").hide();
		$("#generalAccounting-deatial2").hide();


	});

	$("#button-inventory").click((e) => {
		console.log("headhunter button pressed");
		$("#ar-deatial").hide();
		$("#customer-deatial").hide();
		$("#ap-deatial").hide();
		$("#vendor-deatial").hide();
		$("#payroll-deatial").hide();
		$("#inventory-deatial").show();
		$("#generalAccounting-deatial").hide();
		$("#generalAccounting-deatial2").hide();


	});

	$("#button-generalAccounting").click((e) => {
		console.log("headhunter button pressed");
		$("#ar-deatial").hide();
		$("#customer-deatial").hide();
		$("#ap-deatial").hide();
		$("#vendor-deatial").hide();
		$("#payroll-deatial").hide();
		$("#inventory-deatial").hide();
		$("#generalAccounting-deatial").show();
		$("#generalAccounting-deatial2").hide();


	});

	$("#button-journals").click((e) => {
		console.log("headhunter button pressed");
		$("#generalAccounting-deatial2").show();
		


	});
});