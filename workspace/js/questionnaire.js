$(document).ready(() => {
	var person = 0;
	var name = 0;


	//HIDDEN FUNCTIONS
		//General
	$("#mailingAddress").hide();

		//Business
	$("#addPartnerNames").hide();
	$("#otherCompanies").hide();

		//Accounting
	$("#FYcontainer").hide();

		//Accounting Service
	$("#externalBookkeeper").hide();
	$("#cleanupBooks").hide();
	$("#currentBookkeepingToolsOtherBox").hide();



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
		body.businessAddressStreet = $("#businessAddressStreet").val();
		body.businessAddressCity = $("#businessAddressCity").val();
		body.businessAddressState = $("#businessAddressState").val();
		body.businessAddressZip = $("#businessAddressZip").val();
		body.differentFromBusinessAddress = $("#differentFromBusinessAddress").val();
		body.mailingAddressStreet = $("#mailingAddressStreet").val();
		body.mailingAddressCity = $("#mailingAddressCity").val();
		body.mailingAddressState = $("#mailingAddressState").val();
		body.mailingAddressZip = $("#mailingAddressZip").val();
		body.website = $("#website").val();
		body.industry = $("#industry").val();
		body.state = $("#state").val();
		body.businessClassificationChoice = $("#businessClassificationChoice").val();
		body.ownershipYear = $("#ownershipYear").val();
		body.partnersYN = $("#partnersYN").val();
		//ADD IN LIST OF PARTNERS ADDED
		body.moreCompaniesYN = $("#moreCompaniesYN").val();
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
		body.currentBookkeepingToolsChoice = $("#currentBookkeepingToolsChoice").val();
		console.log(body);
	});

		
		//General
	$("input[type='checkbox'][name='differentFromBusinessAddress']").click(function(e) {
		console.log(this.checked);
		if (this.checked === true) {
			$("#mailingAddress").show();

		} else {
			$("#mailingAddress").hide();
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
	var currentYear = new Date().getFullYear() + 1;
	var difference = currentYear - 2010; 
	for (difference; difference > 0; difference--) {
		$('#booksLastYearFinished').append(`
			<option value="booksLastYearFinished${currentYear - difference}">${currentYear - difference}</option>
		`);
	};

	$("input[type='checkbox'][name='currentBookkeepingToolsChoiceOther']").click(function(e) {
		console.log(this.checked);
		if (this.checked === true) {
			$("#currentBookkeepingToolsOtherBox").show();

		} else {
			$("#currentBookkeepingToolsOtherBox").hide();
		}
	});

	$("input[type='radio'][name='externalBookkeeperYN']").change(function(e) {
		console.log(this.value);
		if (this.value === 'Yes') {
			$("#externalBookkeeper").show();

		} else {
			$("#externalBookkeeper").hide();

		}
	});

	$("input[type='radio'][name='booksRequiringCleanupYN']").change(function(e) {
		console.log(this.value);
		if (this.value === 'Yes') {
			$("#cleanupBooks").show();

		} else {
			$("#cleanupBooks").hide();

		}
	});

	$("#addBooksAccess").click(function (e) {
        person += 1;
 	console.log(person);
        addBooksAccess(person);
    });

	function addBooksAccess(person) {
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
    }


});

