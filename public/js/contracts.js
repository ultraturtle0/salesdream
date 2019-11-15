var port = location.port ? ':' + location.port : '';

function addressCompile(contract) {
    var address_1 = [
        $(`#${contract}_client_address_1_1`).val(),
        $(`#${contract}_client_address_1_2`).val()
    ].join(' ').trim();
    var address_2 = [
        $(`#${contract}_client_address_1_3`).val() + ',',
        $(`#${contract}_client_address_1_4`).val(),
        $(`#${contract}_client_address_1_5`).val()
    ].join(' ').trim();
    return [address_1, address_2].join('\n');
};


$(document).ready(() => {
	$("#Client").show();
	$("#Recruitment").hide();


	$("#submit_client").click((e) => {
		e.preventDefault();
		console.log("SUBMITTING");
		var body = {};
        body.client_address_1_1 = addressCompile('C');
		[	
            'client_name_1',
			'company_name_1',
			'client_email_1',
            'client_phone',
			'rd',
			'hr',
			'tf',
			'lf',
			'rf',
			'term'
		].forEach((field)=> {
			body[field] = $(`#C_${field}`).val();
		});
        body.contract = "client";
		console.log(body);
        console.log(`${location.protocol}//${location.hostname}${port}/api/contracts/`);
        $.post(`${location.protocol}//${location.hostname}${port}/api/contracts/`, body)
            .done((res) => console.log(res))
            .fail((err) => console.log(err));
	});

	$("#submit_recruitment").click((e) => {
		e.preventDefault();
		console.log("SUBMITTING");
		var body = {};
        body.client_address_1_1 = addressCompile('H');

		[	
            'client_name_1',
			'company_name_1',
			'client_email_1',
            'client_phone',
			'af',
			'rd',
			'lf'
		].forEach((field)=> {
			body[field] = $(`#H_${field}`).val();
		});
        body.contract = "recruitment";
		console.log(body);
        console.log(`${location.protocol}//${location.hostname}${port}/api/contracts/`);
        $.post(`${location.protocol}//${location.hostname}${port}/api/contracts/`, body)
            .done((res) => console.log(res))
            .fail((err) => console.log(err));
	});
		
	$("#clientButton").click((e) => {
		console.log("client button pressed");
		$("#Recruitment").hide();
		$("#Client").show();
	});

	$("#recruitmentButton").click((e) => {
		console.log("recruitment button pressed");
		$("#Client").hide();
		$("#Recruitment").show();
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

