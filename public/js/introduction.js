// CONSTANTS
const STATES = ['CA','AL','AK','AS','AZ','AR','CO','CT','DE','DC','FM','FL','GA', 'GU','HI','ID','IL','IN','IA','KS','KY','LA','ME','MH','MD','MA', 'MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND', 'MP','OH','OK','OR','PW','PA','PR','RI','SC','SD','TN','TX','UT'];

const HIDDEN = [
    //General
    "mailAddr",

    //Business
    "addPartnerNames", "otherCompanies",

    //Accounting
    "FYAppointmentAccountant", "FYcontainer",

    //Accounting Service
    "externalBookkeeper", "externalBookkeeperReachOut", "booksRequiringCleanup", "currentbookkeepingSoftwareOtherBox", "currentBookkeepingToolsOtherBox",
    
    //Tax Filing
    "FYAppointmentIndividual", "FYExtension",

    //Payroll
    "FYemployees", "handlePayrollOtherBox",

    // Calendar-related
    "carouselPrev", "incomplete",
];

const PICKLISTS = [
    {id: 'Referral', field: 'Lead Source'},
    {id: 'Preparer', field: 'Tax Preparer'},
    {id: 'industry', field: 'Industry'},
    {id: 'bizClass', field: 'Business Classification'},
    {id: 'currentbookkeepingSoftware', field: 'Software'}
];


// GLOBALS
var startEvent;
var endEvent;


//time slot button function
var buttonClick = function(id){
    $("#laterDate")[0].checked = false;
    $(`#selected`).empty();
    var dateName = id.split("_");
    var date = moment()
                .add(3, 'days')
                .add(dateName[4], 'days');

    $(`#selected`).append(`
        <br><b>Date-Time Selected:</b> ${dateName[2]}, ${date.format("MMMM D")} at ${moment(dateName[3], "HH:mm").format("h:mm A")}
    `);
    startEvent = date
                    .set('hour', moment(dateName[3], "HH:mm").format("HH"))
                    .set('minute', moment(dateName[3], "HH:mm").format("mm"))
                    .set('second', 0)
                    .format('YYYY-MM-DDTHH:mm:ssZ');
    $('#startEvent').val(startEvent);
};



$(document).ready(() => {
    window['moment-range'].extendMoment(moment);

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

    $.get(`http://${location.hostname}:${9601}/api/sf/picklists`)
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
                <td><button type="button" id="partnerNameDelete${name}" class="btn btn-default btn-sm">Delete</button></td>
            </tr> 
        `);
        $('#partnerNameDelete' + name).click(function (e) {
            $(this).closest('tr').remove();
        });
    });

    // GENERATE YEARS SINCE 1970
    var currentYear = new Date().getFullYear(); 

    $('#ownershipYear').append(`<option value=""></option>`);
    Array(currentYear - 1970).fill()
        .forEach((_, index) =>
            $('#ownershipYear').append(`
                <option value="${currentYear - index}">${currentYear - index}</option>
            `)
        );

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

    ['Inventory', 'POS', 'Time Tracking', 'Payroll']
        .forEach(tool => $("#currentBookkeepingTools").append(`<label><input type="checkbox" name="currentBookkeepingTools" value="${tool}">${tool}</label>`));
    $("#currentBookkeepingTools").append(`<label><input type="checkbox" name="currentBookkeepingToolsOther" value="Other">Other</label>`);
    
    $("#currentbookkeepingSoftware").change(function(e) {
		this.value === 'Other' ?
			$("#currentbookkeepingSoftwareOtherBox").show() :
			$("#currentbookkeepingSoftwareOtherBox").hide();
	});

    // OTHER CHECKBOXES 
    ['currentBookkeepingTools', 'handlePayroll']
        .forEach((field) =>
            $(`input[type='checkbox'][name='${field}Other']`).click(function(e) {
                this.checked ?
                    $(`#${field}OtherBox`).show() :
                    $(`#${field}OtherBox`).hide();
            })
        );

    // RADIO BUTTONS
    ['externalBookkeeper', 'externalBookkeeperReachOut', 'booksRequiringCleanup'].forEach((field) => 
        $(`input[type='radio'][name='${field}YN']`).change(function(e) {
            console.log(this.value);
            this.value === 'Yes' ?
                $('#' + field).show() :
                $('#' + field).hide();
        })
    );

    ///////
	var person = 0;
	$("#addBooksAccess").click(function (e) {
        person += 1;
        $('#booksAccess').append(`
            <tr id="booksAccessRow${person}"> 
                <td id="${person}"></td>
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

    ['AppointmentAccountant', 'AppointmentIndividual', 'Extension', 'employees']
        .forEach((field) => 
            $(`input[type='radio'][name='${field}']`).change(function(e) {
                this.value === 'Yes' ?
                    $("#FY" + field).show() :
                    $("#FY" + field).hide();
            })
        );

                    

    // mirror form fields between standard form and modal    
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
        var fields = ['Referral', 'ReferralLength', 'Description', 'questionnaire', 'startEvent'];
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

        if (invalid.length) {
            validation = false;
            $(`#incomplete`).show();
            requiredFields.forEach((requiredField) => $(`${requiredField}Box`).css("color","black") );
            invalid.forEach((invalidField)=> $(`${invalidField}Box`).css("color","red") );
        };

        if ((!$(`#laterDate`).prop('checked')) && !($('#startEvent').val())) { 
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
		    'currentbookkeepingTimeSpent',
		    'currentbookkeepingSoftware',
		    'currentBookkeepingMonthlyExpenditure',
		    'issuesToBeReviewed',
		    'currentBookkeepingConcerns',
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
            'employees',
            'Inventory',
            'partnersYN',
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
        //'startEvent':

        $.post(`http://${location.hostname}${port}/introduction`, body)
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
