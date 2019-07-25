$(document).ready(() => {
	$("#Client").show();
	$("#Headhunter").hide();


	$("#submit_client").click((e) => {
		e.preventDefault();
		console.log("SUBMITTING");
		var body = {};
		[	'C_client_name_1',
			'C_company_name_1',
			'C_client_address_1_1',
			'C_client_address_1_2',
			'C_client_address_1_3',
			'C_client_address_1_4',
			'C_client_address_1_5',
			'C_client_email_1',
			'C_rd',
			'C_hr',
			'C_tf',
			'C_lf',
			'C_rf',
			'C_term'
		].forEach((field)=> {
			body[field] = $(`#${field}`).val();
		});
		console.log(body);
	});

	$("#submit_headhunter").click((e) => {
		e.preventDefault();
		console.log("SUBMITTING");
		var body = {};
		[	'H_client_name_1',
			'H_company_name_1',
			'H_client_address_1_1',
			'H_client_address_1_2',
			'H_client_address_1_3',
			'H_client_address_1_4',
			'H_client_address_1_5',
			'H_client_email_1',
			'H_af',
			'H_rd',
			'H_lf'
		].forEach((field)=> {
			body[field] = $(`#${field}`).val();
		});
		console.log(body);
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
	[
         'CA','AL','AK','AS','AZ','AR','CO','CT','DE','DC','FM','FL','GA',
             'GU','HI','ID','IL','IN','IA','KS','KY','LA','ME','MH','MD','MA',
             'MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND',
             'MP','OH','OK','OR','PW','PA','PR','RI','SC','SD','TN','TX','UT',
    ].forEach((state) =>{
		$("#C_client_address_1_4").append(`<option value=${state}>${state}</option>`);
		$("#H_client_address_1_4").append(`<option value=${state}>${state}</option>`);
	});
});

