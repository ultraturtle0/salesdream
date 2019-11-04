$(document).ready(() => {
    var port;
    var accounts;
    if (location.port) {
        port = ':' + location.port;
    } else {
        port = '';
    };
    $.get(`http://${location.hostname}${port}/api/ledger`)
        .done((data) => {
            accounts = data.accounts;
            console.log(data);
            $('#id').html(
                data.accounts.map((acc, index) =>
                    `<option
                        value="${acc.Id}">${acc.Name}</option>`
                ).join('')
            );
        })
        .fail(err => console.log(err));

                




	var c = 1;
	var b = 1;
	var o = 1;
	var body;
	var cards = [];
	newCardRow(c);
	newBankRow(b);
	newOtherRow(o);

    $("#addCard").click(function (e) {
        c += 1;
        newCardRow(c);
    });
	$("#addBank").click(function (e) {
        b += 1;
        newBankRow(b);
    });
    $("#addOther").click(function (e) {
        o += 1;
        newOtherRow(o);
    });
    $("#submit").click(function (e) {
    	e.preventDefault();
    	$(this).attr("disabled", true);
        acc = $('#id').find('option:selected');
    	var input = {
            fields: ["#CardTable", "#BankTable", "#OtherTable"],
            cardIndex: c, 
            bankIndex: b, 
            otherIndex: o,
            cards: cards,
            id: acc.val(),
            name: acc.text() 
        };
 		submit(input);
    });

});

function newCardRow(c) {
	$('#CardTable tbody').append(`
        <tr id="cardrow${c}"> 
			<th scope="row${c}">${c}</th>
			<td><input type="text" id="CardName${c}" name="CardName${c}"></td>
			<td><select name="CardType${c}" id="CardType${c}">
				<option value="debit">Debit</option>
				<option value="credit">Credit</option>
			</td>
			<td><input type="text" id="CardBank${c}" name="CardBank${c}"></td>
			<td><input type="text" id="CardDigits${c}" name="CardDigits${c}"></td>
			<td><div class="input-group date" data-provide="datepicker">
					<input type="text" class="form-control datepicker" id="CardStatementCycle${c}">
					<div class="input-group-addon">
						<span class="glyphicon glyphicon-th"></span>
					</div>
				</div>
			</td>
			<td><div class="input-group date" data-provide="datepicker">
					<input type="text" class="form-control datepicker" id="CardLastReconciled${c}">
					<div class="input-group-addon">
						<span class="glyphicon glyphicon-th"></span>
					</div>
				</div>
			</td>
			<td>&ensp;	<button type="button" id="carddelete${c}" class="btn btn-default btn-sm">Delete</button></td>
		</tr> 
    `);
    $('#carddelete' + c).click(function (e) {
 		$('#cardrow' + c).remove();
    });
};
function newBankRow(b) {
	$('#BankTable tbody').append(`
        <tr id="bankrow${b}"> 
			<th scope="row${b}">${b}</th>
			<td><input type="text" id="BankName${b}" name="BankName${b}"></td>
			<td><select name="BankType${b}" id=BankType${b}>
				<option value="debit">Debit</option>
				<option value="credit">Credit</option>
			</td>
			<td><input type="text" id="Bank${b}" name="Bank${b}"></td>
			<td><input type="text" id="CardDigits${b}" name="CardDigits${b}"></td>
			<td><div class="input-group date" data-provide="datepicker">
					<input type="text" class="form-control datepicker" id="BankStatementCycle${b}">
					<div class="input-group-addon">
						<span class="glyphicon glyphicon-th"></span>
					</div>
				</div>
			</td>
			<td><div class="input-group date" data-provide="datepicker">
					<input type="text" class="form-control datepicker" id="BankLastReconciled${b}">
					<div class="input-group-addon">
						<span class="glyphicon glyphicon-th"></span>
					</div>
				</div>
			</td>
			<td>&ensp;	<button type="button" id="bankdelete${b}" class="btn btn-default btn-sm">Delete</button></td>
		</tr> 
    `);
    $('#bankdelete' + b).click(function (f) {
 		$('#bankrow' + b).remove();
    });
};
function newOtherRow(o) {
	$('#OtherTable tbody').append(`
        <tr id="otherrow${o}"> 
			<th scope="row${o}">${o}</th>
			<td><input type="text" id="OtherName${o}" name="OtherName${o}"></td>
			<td><select name="OtherType${o}" id="OtherType${o}">
				<option value="debit">Debit</option>
				<option value="credit">Credit</option>
			</td>
			<td><input type="text" id="OtherBank{o}" name="OtherBank${o}"></td>
			<td><input type="text" id="OtherDigits${o}" name="OtherDigits${o}"></td>
			<td><div class="input-group date" data-provide="datepicker">
					<input type="text" class="form-control datepicker" id="OtherStatementCycle${o}">
					<div class="input-group-addon">
						<span class="glyphicon glyphicon-th"></span>
					</div>
				</div>
			</td>
			<td><div class="input-group date" data-provide="datepicker">
					<input type="text" class="form-control datepicker" id="OtherLastReconciled${o}">
					<div class="input-group-addon">
						<span class="glyphicon glyphicon-th"></span>
					</div>
				</div>
			</td>
			<td>&ensp;	<button type="button" id="otherdelete${o}" class="btn btn-default btn-sm">Delete</button></td>
		</tr> 
    `);
    $('#otherdelete' + o).click(function (g) {
 		$('#otherrow' + o).remove();
    });
};

function submit(data) {
	var inputData = fillarrays(data);
    console.log(inputData);
	$.post("/ledger",inputData)
		.done((res) => {
			console.log(res.messages);
		})
		.fail((err) => {
			console.error(err);
		});

};

function fillarrays(data) {
	var i = data.cardIndex;
	var j = data.bankIndex;
	var k = data.otherIndex;
	var cardInfo = [];
	var bankInfo = [];
	var otherInfo = [];
	for (i; i > 0; i--) {
		if ($(`#CardName${i}`).val() ||
			$(`#CardBank${i}`).val() ||
			$(`#CardStatementCycle${i}`).val() || 
			$(`#CardLastReconciled${i}`).val()) {
				var cardFields = {};
				['CardName', 'CardType', 'CardBank', 'CardStatementCycle', 'CardLastReconciled'].forEach((field) => {
					cardFields[field] = ($(`#${field}${i}`).val());
				});			
				cardInfo.push(cardFields);
		} else {

		};
	};
	for (j; j > 0; j--) {
		if ($(`#BankName${j}`).val() || 
			$(`#Bank${j}`).val() || 
			$(`#BankStatementCycle${j}`).val() || 
			$(`#BankLastReconciled${j}`).val()) {
				var bankFields = {};
				['BankName', 'BankType', 'Bank', 'BankStatementCycle', 'BankLastReconciled'].forEach((field) => {
					bankFields[field] = ($(`#${field}${j}`).val());
				});
				bankInfo.push(bankFields);
		} else {

		};
	};
		for (k; k > 0; k--) {
			if ($(`#OtherName${k}`).val() || 
			$(`#OtherBank${k}`).val() || 
			$(`#OtherStatementCycle${k}`).val() || 
			$(`#OtherLastReconciled${k}`).val()) {
				var otherFields = {};
				['OtherName', 'OtherType', 'OtherBank', 'OtherStatementCycle', 'OtherLastReconciled'].forEach((field) => {
					otherFields[field] = ($(`#${field}${k}`).val());
				});
				otherInfo.push(otherFields);
			} else {

			};
	};
	console.log(cardInfo);
	console.log(bankInfo);
	console.log(otherInfo);
	var inputData = {
		cardInfo,
		bankInfo,
		otherInfo,
        id: data.id,
        name: data.name
	}
	return inputData;
};

//fix errors
//make blank rows not work
//fix spacing 

