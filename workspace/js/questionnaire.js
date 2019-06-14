$(document).ready(() => {
	var person = 0;


	//HIDDEN FUNCTIONS

		//Accounting
	$("#FYcontainer").hide();

		//Accounting Service
	$("#externalBookkeeper").hide();
	$("#cleanupBooks").hide();



	//EVENT LISTENERS
	$("#submit").click((e) => {
		e.preventDefault();
		var body = {};

		body.Volume = $("#Volume").val();
		console.log($("#Volume").val());
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

