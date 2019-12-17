// CONSTANTS
const STATES = ['CA','AL','AK','AS','AZ','AR','CO','CT','DE','DC','FM','FL','GA', 'GU','HI','ID','IL','IN','IA','KS','KY','LA','ME','MH','MD','MA', 'MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND', 'MP','OH','OK','OR','PW','PA','PR','RI','SC','SD','TN','TX','UT'];

const HIDDEN = [
    //General
    "mailAddr",

    //Business
    "addPartnerNames", "otherCompanies", "restructureBox",

    //Accounting
    "FYAppointmentAccountant", "FYcontainer",

    //Accounting Service
    "externalBookkeeper", "externalBookkeeperReachOut", "booksRequiringCleanup", "currentbookkeepingSoftwareOtherBox", "currentBookkeepingToolsOtherBox",
    
    //Tax Filing
    "FYAppointmentIndividual", "FYExtension",

    //Payroll
    "employees", "handlePayrollOtherBox",

    // Calendar-related
    "carouselPrev", "incomplete",
];

const PICKLISTS = [
    {id: 'Referral', field: 'Lead Source'},
    {id: 'Preparer', field: 'Tax Preparer'},
    {id: 'industry', field: 'Industry'},
    {id: 'bizClass', field: 'Business Classification'},
    {id: 'restructureStart', field: 'Business Classification'},
    {id: 'restructureEnd', field: 'Business Classification'},
    {id: 'currentbookkeepingSoftware', field: 'Software'}
];

$(document).ready(() => {
    window['moment-range'].extendMoment(moment);
    calendarLoad('#calendar');
    calendarOnSelect(function (id) {
        $("#laterDate")[0].checked = false;
    });

    // DEBUG
    /*$('#debug').click(function(e) {
        [
            'handlePayroll',
            'currentBookkeepingTools',
            'preferredCommunicationMethodChoice'
        ].forEach((field) => {

            console.log($(`input[name='${field}']:checked`).map(
                function (index, checked) {
                    return checked ? $(this).val() : null
                }).get());
        });
    });
    */


// COPIED FROM QUESTIONNAIRE.JS

    // POPULATE STATES MENU
    STATES.forEach((state) => 
        ['bizAddrState', 'mailAddrState', 'state']
            .forEach((id) => $('#' + id).append(`<option value="${state}">${state}</option>`))
    );
    

	//HIDDEN FUNCTIONS
    HIDDEN.forEach((field) => $('#' + field).hide());


    var port;
    var picklist;
    if (location.port) {
        port = ':' + location.port;
    } else {
        port = '';
    };

    $.get(`${location.protocol}//${location.hostname}${port}/api/picklists`)
        .done((data) => {
            console.log(data);
            $('#loading').hide();
            $('#introForm').show();
            picklist = data.picklists;
            PICKLISTS.forEach((drop) =>
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
            $('#loading').hide();
            $('#form').show();
        });

    $.get(`${location.protocol}//${location.hostname}${port}/api/templates/referral`)
        .done((data) => {
            var referral = load_template('#referral-quill', data.email.body);
            $('#referralSubject').val(data.email.subject);

            // REFERRAL EMAIL SENDER
            $('#referralEmailSend').click(function (e) {
                $('#emailButtonStatus').text('Sending...');
                $('#emailStatus').show();
                var body = {
                    email: $('#referralEmail').val(),
                    subject: $('#referralSubject').val(),
                    body: referral.getContents()
                };
                console.log(body);
                $('emailButtonStatus').text('Sent!');
                $('#emailStatus').hide();
            });
        });

    $.get(`${location.protocol}//${location.hostname}${port}/api/templates/tax_filing`)
        .done((data) => {
            var tax_filing = load_template('#tax_filing-quill', data.email.body);
            $('#taxSubject').val(data.email.subject);
        });


    $('#Referral').change(function (e) {
        $('#rModalLabel').text(
            $(this).val() === 'Other' ?
                `Send a note to ${$('#ReferralOther').val()}:` :
                `Send a note to ${$(this).val()}:`
        );
    });

    // TROUBLESHOOT THIS
    $('#ReferralOtherInput').change(function (e) {
        console.log($(this).val());
        $('#rModalLabel').text(`Send a note to ${$(this).val()}:`);
    });




    // COPIED FROM QUESTIONNAIRE.JS		
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
                <td><button type="button" id="partnerNameDelete${name}" class="btn btn-default btn-sm" style="background-color:#572e5e;color:#ffffff;">Delete</button></td>
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
		console.log(this.value);
		if (this.value === 'Yes') {
			$("#otherCompanies").show();
		} else {
			$("#otherCompanies").hide();
		}
	});

		//Accounting
	$("#AccountingYear").change(function(e) {
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
        .forEach(tool => $("#currentBookkeepingTools").append(`<label><input type="checkbox" name="currentBookkeepingTools" value="${tool.replace(/ /g, "-")}"> ${tool} </label><br>`));
    $("#currentBookkeepingTools").append(`<label><input type="checkbox" name="currentBookkeepingTools" id="currentBookkeepingToolsOtherCheckbox" value="Other"> Other</label>`);
    
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
    ['externalBookkeeper', 'externalBookkeeperReachOut', 'booksRequiringCleanup', 'employees'].forEach((field) => 
        $(`input[type='radio'][name='${field}YN']`).change(function(e) {
            console.log(this.value);
            this.value === 'Yes' ?
                $('#' + field).show() :
                $('#' + field).hide();
        })
    );

    ///////




	var person = 0;

    var add_person = function (e) {
        person += 1;
        $('#booksAccess').append(`
            <tr id="booksAccessRow${person}"> 
                <td id="${person}"></td>
                <td>Name</td>
                <td><input type="text" id="booksAccessName${person}" name="booksAccessName${person}"></td>
                <td>Role</td>
                <td><input type="text" id="booksAccessRole${person}" name="booksAccessRole${person}"></td>
                <td><button type="button" id="booksAccessDelete${person}" class="btn btn-default btn-sm" style="background-color:#572e5e;color:#ffffff;">Delete</button></td>
            </tr> 
        `);

        $('#booksDecision').append(`
            <tr id="booksDecisionRow${person}"> 
                <td id="${person}"></td>
                <td>Name</td>
                <td><input type="text" id="booksDecisionName${person}" name="booksDecisionName${person}"></td>
                <td>Role</td>
                <td><input type="text" id="booksDecisionRole${person}" name="booksDecisionRole${person}"></td>
                <td><button type="button" id="booksDecisionDelete${person}" class="btn btn-default btn-sm" style="background-color:#572e5e;color:#ffffff;">Delete</button></td>
            </tr> 
        `);

        // mirror contact names in both instances
        // ADD EMAIL SENDER TO ADDITIONAL CONTACTS
        /*$('#booksDecisionName' + person).change(() => 
            $('#booksAccessName' + person).val($('#booksDecisionName' + person).val())
        );
        $('#booksDecisionRole' + person).change(() => 
            $('#booksAccessRole' + person).val($('#booksDecisionRole' + person).val())
        );

        $('#booksAccessName' + person).change(() => 
            $('#booksDecisionName' + person).val($('#booksAccessName' + person).val())
        );
        $('#booksAccessRole' + person).change(() => 
            $('#booksDecisionRole' + person).val($('#booksAccessRole' + person).val())
        );
        */

        // delete buttons for both instances
        // DOESN'T WORK YET
        /*
        $('#booksAccessDelete' + person).click(function (e) {
            $('#booksAccessRow' + person).remove();
        });
        $('#booksDecisionDelete' + person).click(function (e) {
            $('#booksDecisionRow' + person).remove();
        });
        */
    };

	$("#addBooksDecision").click(add_person);
	$("#addBooksAccess").click(add_person);

    //Tax Filing 

    ['AppointmentAccountant', 'AppointmentIndividual', 'Extension']
        .forEach((field) => 
            $(`input[type='radio'][name='${field}']`).change(function(e) {
                this.value === 'Yes' ?
                    $("#FY" + field).show() :
                    $("#FY" + field).hide();
            })
        );

                    

    // mirror form fields between standard form and modal    
    //
    //
    

    var copy = {
        FirstName: 'firstName',
        LastName: 'lastName',
        Company: 'companyName',
        Email: 'email',
        Phone: 'phone',
        Description: 'uDescription',
        // REFERRAL
        // PREPARER
        // REFERRAL LENGTH
    };

    Object
        .keys(copy)
        .forEach((key) => {
            $('#' + key).change(function (e) {
                $('#' + copy[key]).val($(this).val());
            });
            $('#' + copy[key]).change(function (e) {
                $('#' + key).val($(this).val());
            });
        });


    $('#submit').click(function (e) {
        
        e.preventDefault();
        var validation = true;
        $(`#incomplete`).hide();
        $(`#validation`).empty();

        var required = ['FirstName', 'LastName', 'Company', 'Email', 'Phone']
        var fields = ['Referral', 'ReferralLength', 'Description', 'questionnaire'];
        var others = ['Referral', 'Preparer'];

        var requiredFields = [];
        var body = {};
        var invalid = [];

        required.forEach((field) => {
            var val = $('#' + field).val();
            if (val){
                body[field] = val;
            } else {
                invalid.push('#' + field);
            };
            requiredFields.push('#' + field);
        });
        fields.forEach((field) => {
            var val = $('#' + field).val();
            if (val) body[field] = val;
        });
        others.forEach((other) => {
            var val = $('#' + other + 'Other').val();
            if ($('#' + other).val() === 'Other')
                (val) ?
                    body[other + 'Other'] = val :
                    invalid.push('#' + other + 'Other');
        });

        body.laterDate = $('#laterDate').prop('checked');
        body.startEvent = calendarGet();

        if (invalid.length) {
            validation = false;
            $(`#incomplete`).show();
            requiredFields.forEach((requiredField) => $(`${requiredField}Box`).css("color","black") );
            invalid.forEach((invalidField)=> $(`${invalidField}Box`).css("color","red") );
        };

        if ((!$(`#laterDate`).prop('checked')) && !(body.startEvent)) { 
            validation = false;
            $(`#incomplete`).show();
            $(`#validation`).append(`
                <div style="color:red">Please pick a date and a time or select to pick one later</div>
            `);
        };

        if (!validation) return;
        $('#buttonStatus').text('Submitting...');
        $('#submitStatus').show();

        [
            'id',
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
            'restructureMonth',
            'restructureYear',
            'restructureStart',
            'restructureEnd',
		    'ownershipYear',
		    'Volume',
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
		    'currentBookkeepingMonthlyExpenditure',
            'currentBookkeepingTimeSpent',
            'handlePayrollOther',
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
            'Value',
        ].forEach((field) => body[field] = $('#' + field).val());

        body['differentFromBizAddr'] = $('#differentFromBizAddr').prop('checked');

        // FILL CHECKBOXES
        [
            'handlePayroll',
            'currentBookkeepingTools',
            'preferredCommunicationMethodChoice'
        ].forEach((field) => 
            body[field] = $(`input[name='${field}']:checked`)
                .map(function (index, checked) {
                    return checked ? $(this).val() : null
                })
                .get()
        );

        // FILL RADIO BUTTONS
        [
            'AppointmentAccountant',
            'AppointmentIndividual',
            'Extension',
            'invoiceCustomers',
            'collectSalesTax',
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
            'currentBookkeepingRatingScale',
            'booksRequiringCleanupYN',
            'ongoingMaintenanceYN',
            'selfreportYN',
        ].forEach((field) => body[field] = $(`input[type='radio'][name='${field}']:checked`).val());

        // FILL OTHERS
        if (body.industry === 'Other')
            body.industryOther = $('#industryOther').val();
        if (body.currentbookkeepingSoftware === 'Other')
            body.currentbookkeepingSoftwareOther = $('#currentbookkeepingSoftwareOther').val();
        if (body.currentBookkeepingTools.includes('Other'))
            body.currentBookkeepingToolsOther = $('#currentBookkeepingToolsOther').val();
        if (body.handlePayroll.includes('Other'))
            body.handlePayrollOther = $('#handlePayrollOther').val();
        

        // FILL PARTNERS
        body.partners = []; 
        if ($("input[type='radio'][name='partnersYN']").val() === 'Yes')
            $('#partnersNames').children().each(function (index) {
                var inputs = $($(this).find('input'));
                body.partners.push({
                    Name: inputs[0].value,
                    Role: inputs[1].value
                });
            });

        // FILL BOOKS ACCESS
        body.booksAccess = [];
        $('#booksAccess').children().each(function (index) {
            var inputs = $($(this).find('input'));
            body.booksAccess.push({
                Name: inputs[0].value,
                Role: inputs[1].value
            });
        });

        console.log(body);
        //'Referral': null
        //'ReferralLength':
        //'Zoom_Meeting_ID':

        $.post(`${location.protocol}//${location.hostname}${port}/introduction`, body)
            .done((res) => {
                $('#id').val(res.link._id);
                $('#buttonStatus').text('Success!');
                $('#submitStatus').hide();
                $('#submit').toggleClass('btn-primary');
                $('#submit').toggleClass('btn-success');
                $('#submit').attr('disabled', true);
                console.log(res);
                /*
                 * PROMPT FOR REFERRAL THANK-YOU EMAIL!
                 */
            })
            .fail((err) => {
                $('#buttonStatus').text('Internal Error.');
                $('#submitStatus').hide();
                $('#submit')
                    .toggleClass('btn-primary')
                    .toggleClass('btn-danger')
                    .attr('disabled', true)
                    .after(err.responseJSON.errors.map((error) => {
                        console.log(error);
                        return `<span>${error}</span>`;
                    }).join('\n'));
                setTimeout(() => {
                    $('#submit')
                        .toggleClass('btn-danger')
                        .toggleClass('btn-primary')
                        .attr('disabled', false);
                    $('#buttonStatus')
                        .text('Submit');
                }, 2000);
            });
    });
});
