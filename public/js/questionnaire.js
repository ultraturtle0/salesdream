// for booksAccess
var person = 0;

var fillForm = (link, picklists) => {
    [
        'FirstName',
        'LastName',
        'Email',
        'Phone',
        'Company',
        'title',
        'bizAddrStreet',
        'bizAddrCity',
        'bizAddrState',
        'bizAddrZip',
        'mailAddrStreet',
        'mailAddrCity',
        'mailAddrState',
        'mailAddrZip',
        'website',
        'industry',
        'state',
        'bizClass',
        'ownershipYear',
        'Volume',
        'Value',
        'AnnualRevenue',
        'AccountingYear',
        'FiscalYear',
        'Cash',
        'FinancialReports',
        'DateOfStart',
        'currentBookkeepingMethod',
        'externalBookkeeperCompany',
        'externalBookkeeperName',
        'externalBookkeeperEmail',
        'externalBookkeeperPhone',
        'externalBookkeeperLocation',
        'externalBookkeeperFutureRole',
        'externalBookkeeperLikeDislike',
        'newBookkeeperReason',
        'currentBookkeepingTimeSpent',
        'currentbookkeepingSoftware',
        'currentBookkeepingToolsOther',
        'currentBookkeepingMonthlyExpenditure',
        'issuesToBeReviewed',
        'currentBookkeepingConcerns',
        'booksLastMonthFinished',
        'booksLastYearFinished',
        'communicationExpectations',
        'responseTimeExpectations',
        'preferredCommunicationMethodChoice',
        'AccWho',
        'AccWhen',
        'IndWho',
        'IndWhen',
        'TaxReturnBusiness',
        'TaxReturnPersonal',
        'ExtensionDate',
        'employeeCount',
        'restructureMonth',
        'restructureYear',
        'handlePayrollOther',
    ].forEach((field) => {
        var newval = link.questionnaire[field];
        $('#' + field).val(newval);
    });

    if (link.questionnaire.currentbookkeepingSoftware === 'Other') {
        $('#currentbookkeepingSoftwareOther').val(link.questionnaire.currentbookkeepingSoftwareOther);
        $('#currentbookkeepingSoftwareOtherDiv').show();
    };


    if ('Other' in link.questionnaire.currentBookkeepingTools) {
    };


    // RADIO BUTTONS
    ['partnersYN', 'restructureYN', 'moreCompaniesYN', 'companiesSeparateBooksYN',
        'companiesSeparateAccountsYN', 'directOwnershipOfBooksYN', 'externalBookkeeperYN',
        'externalBookkeeperInformedYN', 'externalBookkeeperReachOutYN', 'invoiceCustomers', 
        'Inventory', 'collectSalesTax', 'employeesYN', 'subcontractors',
        'currentBookkeepingInvolvementScale', 'desiredBookkeepingInvolvementScale',
        'currentBookkeepingRatingScale', 'booksRequiringCleanupYN', 'ongoingMaintenanceYN',
        'AppointmentAccountant', 'Extension', 'AppointmentIndividual', 'selfreportYN',
    ]
        .forEach((field) => {
            $(`input[type='radio'][name='${field}'][value='${link.questionnaire[field]}']`)
                .prop('checked', true)
                .trigger("change");
        });
    // DROPDOWNS
    [
        //{id: 'Referral', field: 'Lead Source'},
        //{id: 'Preparer', field: 'Tax Preparer'},
        {id: 'industry', field: 'Industry'},
        {id: 'bizClass', field: 'Business Classification'},
        {id: 'restructureStart', field: 'Business Classification'},
        {id: 'restructureEnd', field: 'Business Classification'},
        {id: 'currentbookkeepingSoftware', field: 'Software'}
    ].forEach((drop) => {
        if (link.questionnaire[drop.id]) {
            $('#' + drop.id).val(link.questionnaire[drop.id])
        }
    });


    link.questionnaire.currentBookkeepingTools.forEach((tool, index) => {
        if (tool === 'Other') {
            $('#currentBookkeepingToolsOtherCheckbox')
                .prop('checked', true)
                .trigger("change");
            $('#currentbookkeepingToolsOther').val(link.questionnaire.currentbookkeepingToolsOther);

            $('#currentbookkeepingToolsOtherBox').show();
        };
        $('#currentBookkeepingTools' + tool.replace(/ /g, "-"))
            .prop('checked', true);
    });

    methods = {
        Email: 'Email',
        Texting: 'Texting',
        'Phone Calls': 'Calls',
        'In-Person': 'Person'
    };

    if (link.questionnaire.preferredCommunicationMethodChoice)
        link.questionnaire.preferredCommunicationMethodChoice.forEach((method) =>
            $('#preferredCommunicationMethod' + methods[method])
                .prop('checked', true)
        );

    if (link.questionnaire.handlePayroll) {
        link.questionnaire.handlePayroll.forEach((tool, index) =>
            $(`input[type='checkbox'][name='handlePayroll'][value='${tool}']`)
                .prop('checked', true)
                .trigger('change')
        );
        if (link.questionnaire.handlePayroll.includes('Other')) {
            //$('#handlePayrollOther').val(link.questionnaire.handlePayrollOther);
            $('#handlePayrollOtherBox').show();
        };
    };

    if (link.questionnaire.partners)
        link.questionnaire.partners.forEach((partner, index) =>
            $('#partnersNames').append(`
                <tr id="partnerNameRow${index}"> 
                    <td id ="${index}"></td>
                    <td>Name</td>
                    <td><input type="text" id="partnerName${index}" name="partnerName${index}" value="${partner.Name}"></td>
                    <td>Role</td>
                    <td><input type="text" id="partnerRole${index}" name="partnerRole${index}" value="${partner.Role}"></td>
                    <td><button type="button" id="partnerNameDelete${index}" class="btn btn-default btn-sm" style="background-color:#572e5e;color:#ffffff;">Delete</button></td>
                </tr> 
            `));

    if (link.questionnaire.differentFromBizAddr && link.questionnaire.differentFromBizAddr === 'true') {
        ['mailAddrCity', 'mailAddrState', 'mailAddrStreet', 'mailAddrZip']
            .forEach((field) => $('#' + field).val(link.questionnaire[field]));
        $('#differentFromBizAddr').prop('checked', true);
        $('#mailAddr').show();
    };

    if (link.questionnaire.booksAccess)
        link.questionnaire.booksAccess.forEach((access) => {
            person += 1;
            $('#booksAccess').append(`
                <tr id="booksAccessRow${person}"> 
                    <td id ="${person}"></td>
                    <td>Name</td>
                    <td><input type="text" id="booksAccessName${person}" name="booksAccessName${person}" value="${access.Name}"></td>
                    <td>Role</td>
                    <td><input type="text" id="booksAccessRole${person}" name="booksAccessRole${person}" value="${access.Role}"></td>
                    <td><button type="button" id="booksAccessDelete${person}" class="btn btn-default btn-sm" style="background-color:#572e5e;color:#ffffff;margin:0px;">Delete</button></td>
                </tr> 
            `);
            $('#booksAccessDelete' + person).click(function (e) {
                $('#booksAccessRow' + person).remove();
            });
        });



}

var index = 1;

$(document).ready(() => {

    $('#submitStatus').hide();

    var port;
    var picklist;
    if (location.port) {
        port = ':' + location.port;
    } else {
        port = '';
    };
    
    // hide all pages
    Array(7).fill().forEach((_, ind) => $('#page-' + (ind + 2)).hide());
    $('#submit').hide();

    // rotate pages
    $('#next').click(function (e) {
        e.preventDefault();
        $('#page-' + index).hide();
        index = index + 1;
        if (index > 7) index = 7;
        $('#page-' + index).show();
        if (index === 7) {
            $('#next').hide();
            $('#submit').show();
        } else {
            $('#submit').hide();
        }
        (index === 1) ?
            $('#previous').hide() :
            $('#previous').show();
    });
    $('#previous').click(function (e) {
        e.preventDefault();
        $('#page-' + index).hide();
        index = index - 1;
        if (index < 1) index = 1;
        $('#page-' + index).show();
        (index === 1) ?
            $('#previous').hide() :
            $('#previous').show();
        if (index !== 7) {
            $('#next').show();
            $('#submit').hide();
        };
    });



    // POPULATE STATES MENU
    [
         'CA','AL','AK','AS','AZ','AR','CO','CT','DE','DC','FM','FL','GA',
             'GU','HI','ID','IL','IN','IA','KS','KY','LA','ME','MH','MD','MA',
             'MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND',
             'MP','OH','OK','OR','PW','PA','PR','RI','SC','SD','TN','TX','UT',
    ].forEach((state) => 
        ['bizAddrState', 'mailAddrState', 'state']
            .forEach((id) => $('#' + id).append(`<option value="${state}">${state}</option>`))
    );
    

	//HIDDEN FUNCTIONS
    [
		//General
        "mailAddr",

		//Business
        "addPartnerNames",
        "restructureBox",
        "otherCompanies",

        //Accounting
        "FYAppointmentAccountant",
        "FYcontainer",

	    //Accounting Service
        "externalBookkeeper",
        "externalBookkeeperReachOut",
        "booksRequiringCleanup",
        "currentbookkeepingSoftwareOtherBox",
        "currentBookkeepingToolsOtherBox",
        
        //Tax Filing
        "FYAppointmentIndividual",
        "FYExtension",

        //Payroll
        "FYemployeeCount",
        "handlePayrollOtherBox",

        // modalForm
        "modalForm",
    ].forEach((field) => $('#' + field).hide());


	//EVENT LISTENERS
	$("#submit").click((e) => {
        $('#buttonStatus').text('Submitting...');
        $('#submitStatus').show();

    // WHAT GOES TO SALESFORCE HERE?
		e.preventDefault();
		var body = {};
        [
            'link',
		    'FirstName',
		    'LastName',
		    'Company',
		    'Email',
		    'Phone',
		    'title',
		    'bizAddrStreet',
		    'bizAddrCity',
		    'bizAddrState',
		    'bizAddrZip',
		    'mailAddrStreet',
		    'mailAddrCity',
		    'mailAddrState',
		    'mailAddrZip',
		    'website',
		    'industry',
		    'state',
		    'bizClass',
		    'ownershipYear',
		    'Volume',
            'Value',
		    'AnnualRevenue',
            'AccountingYear',
		    'FiscalYear',
		    'Cash',
		    'FinancialReports',
		    'DateOfStart',
		    'currentBookkeepingMethod',
		    'externalBookkeeperCompany',
		    'externalBookkeeperName',
		    'externalBookkeeperEmail',
		    'externalBookkeeperPhone',
		    'externalBookkeeperLocation',
		    'externalBookkeeperFutureRole',
		    'externalBookkeeperLikeDislike',
		    'newBookkeeperReason',
		    'currentbookkeepingTimeSpent',
		    'currentbookkeepingSoftware',
		    'currentBookkeepingMonthlyExpenditure',
		    'issuesToBeReviewed',
		    'currentBookkeepingConcerns',
		    'booksLastMonthFinished',
		    'booksLastYearFinished',
		    'communicationExpectations',
		    'responseTimeExpectations',
		    'preferredCommunicationMethodChoice',
		    'AccWho',
            'AccWhen',
		    'IndWho',
            'IndWhen',
		    'TaxReturnBusiness',
		    'TaxReturnPersonal',
		    'ExtensionDate',
		    'employeeCount',
        ].forEach((field) => body[field] = $('#' + field).val());

        body['differentFromBizAddr'] = $('#differentFromBizAddr').prop('checked');
		body['externalBookkeeperReachOut'] = $("input[type='radio'][name='externalBookkeeperReachOut']").val();

        // FILL CHECKBOXES
        [
            'handlePayroll',
            'currentBookkeepingTools',
            'preferredCommunicationMethodChoice'
        ].forEach((field) => 
            body[field] = $(`input[name='${field}']:checked`).map(
                function (checked) {
                    return checked ? $(this).val() : null
                }).get()
        );

        // FILL RADIO BUTTONS
        [
            'AppointmentAccountant',
            'AppointmentIndividual',
            'Extension',
            'invoiceCustomers',
            'collectSalesTax',
            'invoiceCustomers',
            'subcontractors',
            'employeesYN',
            'Inventory',
            'partnersYN',
            'restructureYN',
            'moreCompaniesYN',
            'companiesSeparateBooksYN',
            'companiesSeparateAccountsYN',
            'externalBookkeeperYN',
            'externalBookkeeperInformedYN',
            'externalBookkeeperReachOutYN',
            'directOwnershipOfBooksYN',
            'currentBookkeepingInvolvementScale',
            'desiredBookkeepingInvolvementScale',
            'selfreportYN',
            'currentBookkeepingRatingScale',
            'booksRequiringCleanupYN',
            'ongoingMaintenanceYN'
        ].forEach((field) => body[field] = $(`input[type='radio'][name='${field}']:checked`).val());

        // FILL OTHERS
        if (body.industry === 'Other')
            body.industryOther = $('#industryOther').val();
        if (body.currentbookkeepingSoftware === 'Other')
            body.currentbookkeepingSoftwareOther = $('#currentbookkeepingSoftwareOther').val();
        if ('Other' in body.currentBookkeepingTools)
            body.currentBookkeepingToolsOther = $('#currentbookkepingToolsOther').val();
        if ('Other' in body.handlePayroll)
            body.handlePayrollOther = $('#handlePayrollOther').val();

        // POPULATE PARTNERS
        
        body.partners = []; 
        if ($("input[type='radio'][name='partnersYN']").val() === 'Yes')
            $('#partnersNames').children().each(function (index) {
                var inputs = $($(this).find('input'));
                body.partners.push({
                    Name: inputs[0].value,
                    Role: inputs[1].value
                });
            });

        // POPULATE BOOKS ACCESS
        body.booksAccess = [];
        $('#booksAccess').children().each(function (index) {
            var inputs = $($(this).find('input'));
            body.booksAccess.push({
                Name: inputs[0].value,
                Role: inputs[1].value
            });
        });
        console.log(body);

        $.post(`${location.protocol}//${location.hostname}${port}/questionnaire/${body.link}`, body)
            .done((res) => {
                console.log(res);
                $('#buttonStatus').text('Done!');
                $('#buttonStatus').addClass('btn-success');
                $('#submitStatus').hide();

            })
            .fail((err) => {
                $('#buttonStatus').text('Error, please try again.');
                $('#buttonStatus').attr('class', 'btn btn-danger');
                setTimeout(() => {
                    $('#buttonStatus').attr('class', 'btn btn-primary');
                });
                console.log(err);
            });
	});

		
		//General
	$("input[type='checkbox'][name='differentFromBizAddr']").click(function(e) {
		this.checked ? 
			$("#mailAddr").show() :
			$("#mailAddr").hide();
	});


		//Business
	$("input[type='radio'][name='partnersYN']").change(function(e) {
		this.value === 'Yes' ?
			$("#addPartnerNames").show() :
			$("#addPartnerNames").hide();
	});

	$("input[type='radio'][name='employeesYN']").change(function(e) {
		this.value === 'Yes' ?
			$("#FYemployeeCount").show() :
			$("#FYemployeeCount").hide();
	});

	var name = 0;
	$("#addPartner").click(function (e) {
        name += 1;
        $('#partnersNames').append(`
            <tr id="partnerNameRow${name}"> 
                <td id ="${name}"></td>
                <td>Name</td>
                <td><input type="text" id="partnerName${name}" name="partnerName${name}"></td>
                <td>Role</td>
                <td><input type="text" id="partnerRole${name}" name="partnerRole${name}"></td>
                <td><button type="button" id="partnerNameDelete${name}" class="btn btn-default btn-sm" style="background-color:#572e5e;color:#ffffff;margin:0px;">Delete</button></td>
            </tr> 
        `);
        $('#partnerNameDelete' + name).click(function (e) {
            $(this).closest('tr').remove();
        });
    });

    // GENERATE YEARS SINCE 1970
    var currentYear = new Date().getFullYear(); 

    $('#ownershipYear').append(`<option value=""></option>`);
    $('#restructureYear').append(`<option value=""></option>`);
    Array(currentYear - 1970).fill()
        .forEach((_, index) => {
            var option = `<option value="${currentYear - index}">${currentYear - index}</option>`;
            $('#ownershipYear').append(option);
            $('#restructureYear').append(option);
        });

    $("input[type='radio'][name='restructureYN']").change(function(e) {
		if (this.value === 'Yes') {
			$("#restructureBox").show();
		} else {
			$("#restructureBox").hide();
		}
	});

    $("input[type='radio'][name='moreCompaniesYN']").change(function(e) {
		if (this.value === 'Yes') {
			$("#otherCompanies").show();
		} else {
			$("#otherCompanies").hide();
		}
	});

    //Accounting
	$("#AccountingYear").change(function(e) {
		console.log(this.value);
		this.value === 'Fiscal Year' ?
			$("#FYcontainer").show() :
			$("#FYcontainer").hide();
	});

		//Accounting Service
    ['booksLastYearFinished', 'TaxReturnBusiness', 'TaxReturnPersonal']
        .forEach((field) => {
            $('#' + field).append(`<option value=""></option>`);
            Array(currentYear - 2010).fill()
                .forEach((_, index) =>
                    $('#' + field).append(`
                        <option value="${currentYear - index}">${currentYear - index}</option>
                    `)
                );
        });

    $('#booksLastMonthFinished').append(`<option value=""></option>`);
    $('#restructureMonth').append(`<option value=""></option>`);
    Array(12).fill().forEach((_, ind) => {
        var mo = moment().month(ind).format('MMM');
        var option = `<option value="${mo}">${mo}</option>`;
        $('#booksLastMonthFinished').append(option);
        $('#restructureMonth').append(option);
    });
    
    ['Inventory', 'POS', 'Time Tracking', 'Payroll']
        .forEach(tool => $("#currentBookkeepingTools").append(`<label><input type="checkbox" name="currentBookkeepingTools" id="currentBookkeepingTools${tool.replace(/ /g, "-")}" value="${tool}"> ${tool} </label><br>`));
    $("#currentBookkeepingTools").append(`<label><input type="checkbox" name="currentBookkeepingToolsOther" id="currentBookkeepingToolsOtherCheckbox"> Other</label>`);
    
    $("#currentbookkeepingSoftware").change(function(e) {
		this.value === 'Other' ?
			$("#currentbookkeepingSoftwareOtherBox").show() :
			$("#currentbookkeepingSoftwareOtherBox").hide();
	});

    // OTHER CHECKBOXES 
    ['currentBookkeepingTools', 'handlePayroll']
        .forEach((field) =>
            $(`#${field}OtherCheckbox`).change(function(e) {
                this.checked ?
                    $(`#${field}OtherBox`).show() :
                    $(`#${field}OtherBox`).hide();
            })
        );

    // RADIO BUTTONS
    //
    ['externalBookkeeper', 'externalBookkeeperReachOut', 'booksRequiringCleanup'].forEach((field) => 
        $(`input[type='radio'][name='${field}YN']`).change(function(e) {
            this.value === 'Yes' ?
                $('#' + field).show() :
                $('#' + field).hide();
        })
    );

    ///////
	$("#addBooksAccess").click(function (e) {
        person += 1;
        $('#booksAccess').append(`
            <tr id="booksAccessRow${person}"> 
                <td id ="${person}"></td>
                <td>Name</td>
                <td><input type="text" id="booksAccessName${person}" name="booksAccessName${person}"></td>
                <td>Role</td>
                <td><input type="text" id="booksAccessRole${person}" name="booksAccessRole${person}"></td>
                <td><button type="button" id="booksAccessDelete${person}" class="btn btn-default btn-sm">Delete</button></td>
            </tr> 
        `);
        $('#booksAccessDelete' + person).click(function (e) {
            $('#booksAccessRow' + person).remove();
        });
    });



    //Tax Filing 

    ['AppointmentAccountant', 'AppointmentIndividual', 'Extension']
        .forEach((field) => 
            $(`input[type='radio'][name='${field}']`).change(function(e) {
                this.value === 'Yes' ?
                    $("#FY" + field).show() :
                    $("#FY" + field).hide();
            })
        );


    $.get(`${location.protocol}//${location.hostname}${port}/api/picklists`)
        .done((data) => {
            console.log(data);
            $('#loading').hide();
            $('#introForm').show();
            picklist = data.picklists;
            [
                //{id: 'Referral', field: 'Lead Source'},
                //{id: 'Preparer', field: 'Tax Preparer'},
                {id: 'industry', field: 'Industry'},
                {id: 'bizClass', field: 'Business Classification'},
                {id: 'restructureStart', field: 'Business Classification'},
                {id: 'restructureEnd', field: 'Business Classification'},
                {id: 'currentbookkeepingSoftware', field: 'Software'}
            ]
            .forEach((drop) =>
                $(`#${drop.id}`).html(
                    `<option
                        disabled selected value></option>
                    \n${
                        picklist[drop.field]
                            .map(item => `
                                <option
                                    value="${item}"
                                >${item}</option>
                            `) 
                            .join('\n')
                    }`
                ).after(function () {
                    $(this).change(function () {
                        ($(this).val()==='Other') ?
                            $(`#${drop.id}OtherDiv`).show() :
                            $(`#${drop.id}OtherDiv`).hide();
                    });
                    return `
                        <div id="${drop.id + 'OtherDiv'}" style="display:none;">
                            <label for="${drop.id + 'Other'}">Please specify:</label>
                            <input type="text" id="${drop.id + 'Other'}" name="${drop.id + 'Other'}">
                        </div>
                    `
                })
            );
            // fill form - not working, add loading screen later
            $.get(`${location.protocol}//${location.hostname}${port}/api/questionnaire`, {
                link: $('#link').val()
            })
                .done((data) => {
                    console.log(data);
                    fillForm(data, picklist);
                })
                .fail((err) => console.log(err));

            $('#loading').hide();
            $('#form').show();

        });


})


