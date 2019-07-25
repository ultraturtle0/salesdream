$(document).ready(() => {
	var person = 0;
	var name = 0;

    // POPULATE STATES MENU
    [
         'CA','AL','AK','AS','AZ','AR','CO','CT','DE','DC','FM','FL','GA',
             'GU','HI','ID','IL','IN','IA','KS','KY','LA','ME','MH','MD','MA',
             'MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND',
             'MP','OH','OK','OR','PW','PA','PR','RI','SC','SD','TN','TX','UT',
             'VT','VI','VA','WA','WV','WI','WY'
    ].forEach((state) => $('#state').append(`<option value="${state}">${state}</option>`));
    

	//HIDDEN FUNCTIONS
    [
		//General
        "mailAddr",

		//Business
        "addPartnerNames",
        "otherCompanies",

        //Accounting
        "FYcontainer",

	    //Accounting Service
        "externalBookkeeper",
        "booksRequiringCleanup",
        "currentBookkeepingToolsOtherBox",
        
        //Tax Filing
        "FYcontainer1",
        "FYcontainer2"
    ].forEach((field) => $('#' + field).hide());


	//EVENT LISTENERS
	$("#submit").click((e) => {
		e.preventDefault();
		var body = {};

		body.firstName = $("#firstName").val();
		body.lastName = $("#lastName").val();
		body.companyName = $("#companyName").val();
		body.email = $("#email").val();
		body.phone = $("#phone").val();
		body.title = $("#title").val();
		body.bizAddrStreet = $("#bizAddrStreet").val();
		body.bizAddrCity = $("#bizAddrCity").val();
		body.bizAddrState = $("#bizAddrState").val();
		body.bizAddrZip = $("#bizAddrZip").val();
		body.differentFromBizAddr = $("#differentFromBizAddr").val();
		body.mailAddrStreet = $("#mailAddrStreet").val();
		body.mailAddrCity = $("#mailAddrCity").val();
		body.mailAddrState = $("#mailAddrState").val();
		body.mailAddrZip = $("#mailAddrZip").val();
		body.website = $("#website").val();
		body.industry = $("#industry").val();
		body.state = $("#state").val();
		body.bizClass = $("#bizClass").val();
		body.ownershipYear = $("#ownershipYear").val();
		body.partnersYN = $("input[type='radio'][name='partnersYN']").val();
		body.partnersNames = $("#partnersNames").val();
		body.moreCompaniesYN = $("#moreCompaniesYN").val();
		body.companiesSeparateBooksYN = $("#companiesSeparateBooksYN").val();
		body.companiesSeparateAccountsYN = $("#companiesSeparateAccountsYN").val();
		body.Volume = $("#Volume").val();
		body.AnnualRevenue = $("#AnnualRevenue").val();
		body.AccountingYear = $("#AccountingYear").val();
		body.FiscalYear = $("#FiscalYear").val();
		body.Cash = $("#Cash").val();
		body.FinancialReports = $("#FinancialReports").val();
		body.DateOfStart = $("#DateOfStart").val();
		body.currentBookkeepingMethod = $("#currentBookkeepingMethod").val();
		body.externalBookkeeperYN = $("#externalBookkeeperYN").val();
		body.externalBookkeeperCompany = $("#externalBookkeeperCompany").val();
		body.externalBookkeeperName = $("#externalBookkeeperName").val();
		body.externalBookkeeperLocation = $("#externalBookkeeperLocation").val();
		body.externalBookkeeperFutureRole = $("#externalBookkeeperFutureRole").val();
		body.externalBookkeeperInformedYN = $("#externalBookkeeperInformedYN").val();
		body.externalBookkeeperLikeDislike = $("#externalBookkeeperLikeDislike").val();
		body.externalBookkeeperReachOut = $("#externalBookkeeperReachOut").val();
		body.directOwnershipOfBooksYN = $("#directOwnershipOfBooksYN").val();
		body.newBookkeeperReason = $("#newBookkeeperReason").val();
		body.currentbookkeepingTimeSpent = $("#currentbookkeepingTimeSpent").val();
		body.currentbookkeepingSoftware = $("#currentbookkeepingSoftware").val();
		body.currentBookkeepingToolsChoice = $("#currentBookkeepingToolsChoice").val();
		body.booksAccess = $("#booksAccess").val();
		body.currentBookkeepingInvolvementScale = $("#currentBookkeepingInvolvementScale").val();
		body.desiredBookkeepingInvolvementScale = $("#desiredBookkeepingInvolvementScale").val();
		body.currentBookkeepingMonthlyExpenditure = $("#currentBookkeepingMonthlyExpenditure").val();
		body.currentBookkeepingRatingScale = $("#currentBookkeepingRatingScale").val();
		body.booksRequiringCleanupYN = $("#booksRequiringCleanupYN").val();
		body.ongoingMaintenanceYN = $("#ongoingMaintenanceYN").val();
		body.issuesToBeReviewed = $("#issuesToBeReviewed").val();
		body.currentBookkeepingConcerns = $("#currentBookkeepingConcerns").val();
		body.booksLastYearFinished = $("#booksLastYearFinished").val();
		body.communicationExpectations = $("#communicationExpectations").val();
		body.responseTimeExpectations = $("#responseTimeExpectations").val();
		body.preferredCommunicationMethodChoice = $("#preferredCommunicationMethodChoice").val();
		body.AppointmentAccountant = $("#AppointmentAccountant").val();
		body.AppointmentIndividual = $("#AppointmentIndividual").val();
		body.WhoWhen = $("#WhoWhen").val();
		body.TaxReturnBussiness = $("#TaxReturnBussiness").val();
		body.TaxReturnPersonal = $("#TaxReturnPersonal").val();
		body.Extension = $("#Extension").val();
		body.ExtensionDate = $("#ExtensionDate").val();
		body.invoiceCustomers = $("#invoiceCustomers").val();
		body.paidImmediately = $("#paidImmediately").val();
		body.collectSalesTax = $("#collectSalesTax").val();
		body.subcontractors = $("#subcontractors").val();
		body.employees = $("#employees").val();
		body.employeeCount = $("#employeeCount").val();
		body.handlePayroll = $("#handlePayroll").val();
		body.Inventory = $("#Inventory").val();


		//ADD IN LIST OF PARTNERS ADDED
		/*body.moreCompaniesYN = $("#moreCompaniesYN").val();
		body.volume = $("#Volume").val();
		body.currentBookeepingMethod = $("#currentBookeepingMethod").val();
		body.externalBookkeeperYN = $("#externalBookkeeperYN").val();
		body.externalBookkeeperCompany = $("#externalBookkeeperCompany").val();
		body.externalBookkeeperName = $("#externalBookkeeperName").val();
		body.externalBookkeeperLocation = $("#externalBookkeeperLocation").val();
		body.externalBookkeeperFutureRole = $("#externalBookkeeperFutureRole").val();
		body.externalBookkeeperInformedYN = $("#externalBookkeeperInformedYN").val();
		body.externalBookkeeperLikeDislike = $("#externalBookkeeperLikeDislike").val();
		body.externalBookkeeperReachOut = $("#externalBookkeeperReachOut").val();
		body.directOwnershipOfBooksYN = $("#directOwnershipOfBooksYN").val();
		body.newBookkeeperReason = $("#newBookkeeperReason").val();
		body.currentbookkeepingTimeSpent = $("#currentbookkeepingTimeSpent").val();
		body.currentbookkeepingSoftware = $("#currentbookkeepingSoftware").val();
		body.currentBookkeepingToolsChoice = $("#currentBookkeepingToolsChoice").val();*/
		console.log(body);
		console.log($("input[type='radio'][name='partnersYN']").value);
	});

		
		//General
	$("input[type='checkbox'][name='differentFromBizAddr']").click(function(e) {
		console.log(this.checked);
		if (this.checked === true) {
			$("#mailAddr").show();

		} else {
			$("#mailAddr").hide();
		}
	});


		//Business
	$("input[type='radio'][name='partnersYN']").change(function(e) {
		console.log(this.value);
		if (this.value === 'Yes') {
			$("#addPartnerNames").show();

		} else {
			$("#addPartnerNames").hide();

		}
	});

	$("#addPartner").click(function (e) {
        name += 1;
 	console.log(name);
        addPartnerName(name);
    });

	function addPartnerName(name) {
	$('#partnersNames tbody').append(`
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
 			$('#partnerNameRow' + name).remove();
   		});
    }

    // GENERATE YEARS SINCE 1970
    var currentYear = new Date().getFullYear(); 
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
	$("input[type='radio'][name='AccountingYear']").change(function(e) {
		console.log(this.value);
		if (this.value === 'Yes') {
			$("#FYcontainer").show();

		} else {
			$("#FYcontainer").hide();

		}
	});

		//Accounting Service
    Array(currentYear - 2010).fill()
        .forEach((_, index) =>
            ['booksLastYearFinished', 'TaxReturnBusiness', 'TaxReturnPersonal']
                .forEach((field) =>
                    $('#' + field).append(`
                        <option value="${currentYear - index}">${currentYear - index}</option>
                    `)
                )
        );

	$("input[type='checkbox'][name='currentBookkeepingToolsChoiceOther']").click(function(e) {
		this.checked ?
			$("#currentBookkeepingToolsOtherBox").show() :
			$("#currentBookkeepingToolsOtherBox").hide();
	});

    // RADIO BUTTONS
    //
    ['externalBookkeeper', 'booksRequiringCleanup'].forEach((field) => 
        $(`input[type='radio'][name='${field}YN']`).change(function(e) {
            this.value === 'Yes' ?
                $('#' + field).show() :
                $('#' + field).hide();
        })
    );

    ///////
	$("#addBooksAccess").click(function (e) {
        person += 1;
        $('#booksAccess tbody').append(`
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


});

//Tax Filing 

$("input[type='radio'][name='AppointmentIndividual']").change(function(e) {
		console.log(this.value);
		if (this.value === 'Yes') {
			$("#FYcontainer1").show();

		} else {
			$("#FYcontainer1").hide();

		}
	});

$("input[type='radio'][name='Extension']").change(function(e) {
		this.value === 'Yes' ?
			$("#FYcontainer2").show() :
			$("#FYcontainer2").hide();
	});

//Payroll

$("input[type='radio'][name='employeeCount']").change(function(e) {
		console.log(this.value);
		if (this.value === 'Yes') {
			$("#FYcontainer3").show();

		} else {
			$("#FYcontainer3").hide();

		}
	});



