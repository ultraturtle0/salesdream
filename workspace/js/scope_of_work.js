$(document).ready(() => {
    
    var category_ids = [
        "#ar-deatial",
        "#customer-deatial",
        "#ap-deatial",
        "#vendor-deatial",
        "#payroll-deatial",
        "#inventory-deatial",
        "#generalAccounting-deatial",
        "generalAccounting-deatial2"
    ];

    for (var i=0; i < category_ids.length; i++) {
        $(category_ids[i]).hide();
    }

    category_ids.forEach((id) => {
        $(id).hide();
        $(id).children('button').each(function (i) {
        	$(this).click()
        })
    })
    
    var questions = {
    	"ar-deatial": [
    		'invoicing',
    		'moneyReceived'
    	]
    }
    // Generate category buttons

    Object.keys(questions)
    	.forEach((category) => {
            // category creation
            $('#Buttons').append(`<button type="button" id="button-${category}" class="btn btn-sm" style="background-color:#572e5e;color:#ffffff;">${category}</button>`);
            $(`#button-${category}`).click(function (e) {
                $(`#${category}`).show();
            });
            
            // question creation
    		questions[category].forEach((question) => {
    			$('#' + category).append(`<button type="button" id="button-${question}" class="btn btn-sm" style="background-color:#572e5e;color:#ffffff;">${question}</button>`);
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

	$("#formPreview").click(addInput);
	function addInput(e){
		e.preventDefault();
		console.log("hi");
        //$(this) .id()
		$("#formDiv").append(`<div id="dropdown">
			<label for="dropD">Question</label>
				<select name="dropD" id="dropD">
					<option value="businessOwner">Bussiness Owner</option>
					<option value="businessStaffer">Business Staffer</option>
					<option value="bookkeeper">Book Keeper</option>
					<option value="cpa/ea">CPA/EA</option>
					<option value="financialAdvisor">Financial Advisor</option>
				</select>
		</div>`);

	}
	
