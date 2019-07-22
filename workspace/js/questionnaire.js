$(document).ready(() => {
	var person = 0;
	var name = 0;


	//HIDDEN FUNCTIONS
		//General
	$("#mailAddr").hide();

		//Business
	$("#addPartnerNames").hide();
	$("#otherCompanies").hide();

		//Accounting
	$("#FYcontainer").hide();

		//Accounting Service
	$("#externalBookkeeper").hide();
	$("#cleanupBooks").hide();
	$("#currentBookkeepingToolsOtherBox").hide();
        
        //Tax Filing
    $("#FYcontainer1").hide();
    $("#FYcontainer2").hide();


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

    var currentYear = new Date().getFullYear() + 1;
	var difference1 = currentYear - 1970; 
	for (difference1; difference1 > 0; difference1--) {
		$('#ownershipYear').append(`
			<option value="${currentYear - difference1}">${currentYear - difference1}</option>
		`);
	};

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
	var difference2 = currentYear - 2010; 
	for (difference2; difference2 > 0; difference2--) {
		$('#booksLastYearFinished').append(`
			<option value="booksLastYearFinished${currentYear - difference2}">${currentYear - difference2}</option>
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

//Tax Filing 

$("input[type='radio'][name='AppointmentIndividual']").change(function(e) {
		console.log(this.value);
		if (this.value === 'Yes') {
			$("#FYcontainer1").show();

		} else {
			$("#FYcontainer1").hide();

		}
	});

$("input[type='radio'][name='Extention']").change(function(e) {
		console.log(this.value);
		if (this.value === 'Yes') {
			$("#FYcontainer2").show();

		} else {
			$("#FYcontainer2").hide();

		}
	});

