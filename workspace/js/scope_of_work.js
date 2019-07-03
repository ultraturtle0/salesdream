$(document).ready(() => {
	$("#ar-deatial").hide();
	$("#customer-deatial").hide();
	$("#ap-deatial").hide();
	$("#vendor-deatial").hide();
	$("#payroll-deatial").hide();
	$("#inventory-deatial").hide();
	$("#generalAccounting-deatial").hide();
	$("#generalAccounting-deatial2").hide();
	$("#dropdown").hide();


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
		$("#generalAccounting-deatial2").show();
		


	});
	$("#button-invoicing").click((e) => {
		$("#dropdown").show();
	});
	$("#button-moneyReceived").click((e) => {
		$("#dropdown").show();
	});


	$("#button-customerCommunication").click((e) => {
		$("#dropdown").show();
	});
	$("#button-jobTracking").click((e) => {
		$("#dropdown").show();
	});


	$("#button-recordingBills").click((e) => {
		$("#dropdown").show();
	});
	$("#button-payingBills").click((e) => {
		$("#dropdown").show();
	});
	$("#button-creditCards").click((e) => {
		$("#dropdown").show();
	});
	$("#button-creditCardsPayable").click((e) => {
		$("#dropdown").show();
	});
	$("#button-recordingExpenses").click((e) => {
		$("#dropdown").show();
	});


	$("#button-vedorCommunicaton").click((e) => {
		$("#dropdown").show();
	});
	$("#button-classTracking").click((e) => {
		$("#dropdown").show();
	});


	$("#button-enteringPayroll").click((e) => {
		$("#dropdown").show();
	});
	$("#button-runningPayroll").click((e) => {
		$("#dropdown").show();
	});
	$("#button-recordingPayroll").click((e) => {
		$("#dropdown").show();
	});
	$("#button-payingPayrollTaxes").click((e) => {
		$("#dropdown").show();
	});
	$("#button-payrollProcessing").click((e) => {
		$("#dropdown").show();
	});


	$("#button-costOfGoodsSold").click((e) => {
		$("#dropdown").show();
	});


	$("#button-reconciliation").click((e) => {
		$("#dropdown").show();
	});
	$("#button-bankingCashMonitoring").click((e) => {
		$("#dropdown").show();
	});
	$("#button-AccessToDocumentation").click((e) => {
		$("#dropdown").show();
	});
	$("#button-monthlyReconciliations").click((e) => {
		$("#dropdown").show();
	});
	$("#button-classifications").click((e) => {
		$("#dropdown").show();
	});
	$("#button-journals").click((e) => {
		$("#dropdown").show();
	});
	$("#button-annualCompliance").click((e) => {
		$("#dropdown").show();
	});
	$("#button-1099Filing").click((e) => {
		$("#dropdown").show();
	});
	$("#button-businessTaxes").click((e) => {
		$("#dropdown").show();
	});
	$("#button-salesTax").click((e) => {
		$("#dropdown").show();
	});
	$("#button-yearEndTaxes").click((e) => {
		$("#dropdown").show();
	});


	



});