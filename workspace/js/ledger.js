$(document).ready(() => {
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
	$("#addBank").click(function (f) {
        b += 1;
        newBankRow(b);
    });
    $("#addOther").click(function (g) {
        o += 1;
        newOtherRow(o);
    });
    $("#submit").click(function (h) {
    	var input = ["#CardTable", "#BankTable", "#OtherTable", c, b, o, cards];
 		submit(input);
    });

});

function newCardRow(c) {
	$('#CardTable tbody').append(`
        <tr id="row${c}"> 
			<th scope="row${c}">${c}</th>
			<td><input type="text" id="CardName${c}" name="CardName${c}"></td>
			<td><select name="CardType${c}">
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
			<td><input type="text" id="CardLastReconciled${c}" name="CardLastReconciled${c}"></td>
			<td>&ensp;	<button type="button" id="delete${c}" class="btn btn-default btn-sm">Delete</button></td>
		</tr> 
    `);
    $('#delete' + c).click(function (e) {
 		$('#row' + c).remove();
    });
};
function newBankRow(b) {
	$('#BankTable tbody').append(`
        <tr id="row${b}"> 
			<th scope="row${b}">${b}</th>
			<td><input type="text" id="BankName${b}" name="BankName${b}"></td>
			<td><select name="BankType${b}">
				<option value="debit">Debit</option>
				<option value="credit">Credit</option>
			</td>
			<td><input type="text" id="Bank${b}" name="Bank${b}"></td>
			<td><input type="text" id="CardDigits${b}" name="CardDigits${b}"></td>
			<td><input type="text" id="CardStatemtCycle${b}" name="CardStatementCycle${b}"></td>
			<td><input type="text" id="CardLastReconciled${b}" name="CardLastReconciled${b}"></td>
			<td>&ensp;	<button type="button" id="delete${b}" class="btn btn-default-sm">Delete</button></td>
		</tr> 
    `);
    $('#delete' + b).click(function (f) {
 		$('#row' + b).remove();
    });
};
function newOtherRow(o) {
	$('#OtherTable tbody').append(`
        <tr id="row${o}"> 
			<th scope="row${o}">${o}</th>
			<td><input type="text" id="OtherName${o}" name="OtherName${o}"></td>
			<td><select name="OtherType${o}">
				<option value="debit">Debit</option>
				<option value="credit">Credit</option>
			</td>
			<td><input type="text" id="OtherBank{o}" name="OtherBank${o}"></td>
			<td><input type="text" id="OtherDigits${o}" name="OtherDigits${o}"></td>
			<td><input type="text" id="OtherStatemtCycle${o}" name="OtherStatementCycle${o}"></td>
			<td><input type="text" id="OtherLastReconciled${o}" name="OtherLastReconciled${o}"></td>
			<td>&ensp;	<button type="button" id="delete${o}" class="btn btn-default btn-sm">Delete</button></td>
		</tr> 
    `);
    $('#delete' + o).click(function (g) {
 		$('#row' + o).remove();
    });
};
function submit(data) {
	fillarrays(data)
	axios({
 		method: 'post',
		url: '/api/needs',
		data: cards
	});
	consol.log(cards);
};
function fillarrays(data) {
	var i = c;
	for (i; i > 0; i--){
		cards.push([["#CardName"i], ["#CardType"i], ["#CardBank"i], ["#CardStatementCycle"i], ["CardLastReconciled"i]]);
	};
	return cards;
};


