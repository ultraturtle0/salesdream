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
    	"AP": {
            recordingBills: "Recording Bills",
            payingBills: "Paying Bills",
            creditCards: "Credit Cards",
            creditCardsPayable: "Credit Cards Payable",
            recordingExpenses: "Recording Expenses"
    	},
    	"Vendor": {
            vendorCommunication: "Vendor Communication",
            classTracking: "Class Tracking"
    	},
    	"Payroll": {
            enteringPayroll: "Entering Payroll",
            runningPayroll: "Running Payroll",
            recordingPayroll: "Recording Payroll",
            payingPayrollTaxes: "Paying Payroll Taxes",
            employeeCommunication: "Employee Communication",
            payrollProcessing: "Payroll Processing"
    	},
    	"Inventory": {
            costOfGoodsSold: "Cost of Goods Sold"
        },
    	"GeneralAccounting": {
            reconciliation: "Reconciliation",
            bankingCashMonitoring: "Banking/Cash Monitoring",
            AccessToDocumentation: "Access to Documentation",
            monthlyReconciliations: "Monthly Reconciliations",
            classifications: "Classifications",
            journals: "Journals",
            endOfMonth: "Journals: End of Month",
            endOfQuarter: "Journals: End of Quarter",
            endOfYear: "Journals: End of Year",
            adjusting: "Journals: Adjusting",
            closing: "Journals: Closing",
            annualCompliance: "Annual Compliance",
            ten99Filing: "1099 Filing",
            businessTaxes: "Business Taxes",
            W2s: "W2s",
            salesTax: "Sales Tax",
            yearEndTaxes: "Year-End Taxes",
    	},
    }

    Object.keys(questions)
        .forEach((category) => {
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
            $(`#${category}Heading`).hide();

            Object.keys(questions[category])
                .forEach((question, index) => {
                $('#' + category + 'Column' + (index+1)%5).append(`<button type="button" id="button-${question}" class="btn btn-small" style="background-color:#572e5e;color:#ffffff;width:220px">${questions[category][question]}</button><br>`);
                $(`#${category}div`).append(`<div id="dropdown-${question}" style="display:none;">
                        <label for="dropD">${questions[category][question]}: </label>
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
                    $(`#button-${question}`).removeClass("disabled");
                    if ($(`#${category}div`).contents().is(':visible') == false) {
                        $(`#${category}Heading`).hide();
                    };
                })
                $(`#button-${question}`).click(function(e){
                    e.preventDefault();
                    $('#dropdown-' + question).show();
                    $(`#button-${question}`).addClass("disabled");
                    $(`#${category}Heading`).show();
                });


            });


    	});

    $("#submit").click(function(e){
        e.preventDefault();
        var data = {};
        Object.keys(questions)
            .forEach((category) => {
                Object.keys(questions[category])
                    .forEach((question) => {
                        if($('#dropdown-' + question).is(':visible'))
                            data[question] = questions[category][question];
                    })
            });
        
        console.log(data);
        });

});
	
	
