$(document).ready(() => {
    
    var questions = {
    	"AR": {
    		invoicing: "Invoicing",
    		moneyReceived: "Money Received"
    	},
    	"Customer": {
    		customerCommunication: "Customer Communcation",
            customerCollections: "Customer Collections",
            jobTracking: "Job Tracking"
    	},
    	/*"AP": {
    		'recordingBills',
    		'payingBills',
    		'creditCards',
    		'creditCardsPayable',
    		'recordingExpenses'
    	},
    	"Vendor": {
    		'vendor-detail',
    		'classTracking'
    	},
    	"Payroll": {
    		'enteringPayroll',
    		'runningPayroll',
    		'recordingPayroll',
    		'payingPayrollTaxes',
    		'payrollProcessing'
    	},
    	"Inventory": {
    		'costOfGoodsSold'
        },
    	"GeneralAccounting": {
    		'reconciliation',
    		'bankingCashMonitoring',
    		'AccessToDocumentation',
    		'monthlyReconciliations',
    		'classifications',
    		'journals',
            'yearEndTaxes',
            'endOfMonth',
            'endOfQuarter',
            'adjusting',
            'closing',
    		'annualCompliance',
    		'1099Filing',
    		'businessTaxes',
    		'W2s',
    		'salesTax'
    	},*/
    }
    console.log(questions);
    console.log(questions.AR);

    Object.keys(questions)
        .forEach((category) => {
            $('#category').append(`<div id="${category}"> </div>`);
            $('#addedQuestions').append(`<div id="form-${category}"></div>`);
            $('#' + category + 'Menu').append(`
                <div class="container" id="${category}Table">
                    <div class="row">
                        <div class="col-3" id="${category}Column1"></div>
                        <div class="col-3" id="${category}Column2"></div>
                        <div class="col-3" id="${category}Column3"></div>
                        <div class="col-3" id="${category}Column4"></div>
                    </div>
                </div>
            `);
            var counter = 0;

            $('#' + category).hide();

            Object.keys(questions[category])
                .forEach((question) => {
                    console.log(question);
                    console.log(category[question]);
                counter ++;
                if (counter > 4) counter = 1;
                $('#' + category + 'Column' + counter).append(`<button type="button" id="button-${question}" class="btn btn-small" style="background-color:#572e5e;color:#ffffff;width:220px">${question}</button><br><br>`);
                $("#form-" + category).append(`<div id="dropdown-${question}" style="display:none;">
                        <label for="dropD">${question}</label>
                            <select name="dropD" id="dropD">
                                <option value="businessOwner">Bussiness Owner</option>
                                <option value="businessStaffer">Business Staffer</option>
                                <option value="bookkeeper">Book Keeper</option>
                                <option value="cpa/ea">CPA/EA</option>
                                <option value="financialAdvisor">Financial Advisor</option>
                            </select>
                            &nbsp<button type="button" id="close-${question}" class="btn btn-sm" style="background-color:#b5b4b8;">Remove</button>
                    </div>`);
                $("#close-" + question).click(function(e) {
                    e.preventDefault();
                    $('#dropdown-' + question).hide();
                })
                $(`#button-${question}`).click(function(e){
                    e.preventDefault();
                    console.log("hi");
                    $('#dropdown-' + question).show();
                });


            });

    // Generate category buttons
    /*Object.keys(questions)
    	.forEach((category) => {
    		$('#category').append(`<div id="${category}"> </div>`);
    		$('#addedQuestions').append(`<div id="form-${category}"></div>`);

    		$('#' + category).hide();

    		questions[category].forEach((question) => {
    			$('#' + category).append(`<button type="button" id="button-${question}" class="btn btn-sm" style="background-color:#572e5e;color:#ffffff;">${question}</button>`);
    			$("#form-" + category).append(`<div id="dropdown-${question}" style="display:none;">
						<label for="dropD">${question}</label>
							<select name="dropD" id="dropD">
								<option value="businessOwner">Bussiness Owner</option>
								<option value="businessStaffer">Business Staffer</option>
								<option value="bookkeeper">Book Keeper</option>
								<option value="cpa/ea">CPA/EA</option>
								<option value="financialAdvisor">Financial Advisor</option>
							</select>
                            &nbsp<button type="button" id="close-${question}" class="btn btn-sm" style="background-color:#b5b4b8;">Remove</button>
					</div>`);
    			$("#close-" + question).click(function(e) {
    				e.preventDefault();
    				$('#dropdown-' + question).hide();
    			})
    			$(`#button-${question}`).click(function(e){
					e.preventDefault();
					console.log("hi");
					$('#dropdown-' + question).show();
				});


    		});	
            // hides categories when they are clicked 
            $('#Buttons').append(`<button type="button" id="button-${category}" class="btn btn-sm" style="background-color:#572e5e;color:#ffffff;">${category}</button>`);
            $(`#button-${category}`).click(function (e) {
            		var cat = $('#' + category);
    				Object.keys(questions)
    					.forEach((category) => {
    						if (category === cat.attr('id')) {
    							$('#' + category).show();
    						} else {
    							$('#' + category).hide();
    						}
    					});
            });*/

       $("#submit").click(function(e){
       	e.preventDefault();
       	var data = {};
       	$("#formDiv").children().each(function(category){
       		$(category).children().each(function(question){
       			var id = $(question).attr('id');
       			data[id] = id;

       		})
       		console.log(data);
       	})
       	

       });



    	});

/*    var button_ids = [
        'AR',
        'Customer',
        'AP',
        'Vendor',
        'Payroll',
        'Inventory',
        'General Accounting'
    ];

    Object.keys(questions).forEach((button) => {
        $('#Buttons').append(`<button type="button" id="button-${button.toLowerCase()}" class="btn btn-sm" style="background-color:#572e5e;color:#ffffff;">${button}</button>`);
        $('#button-' + button.toLowerCase()).click(function (e) {
        	e.preventDefault();
        	questions[button].forEach((q) => {
        		
        	})
        })
    });
*/
	});

	//$("#formPreview").click(addInput);
	
	
