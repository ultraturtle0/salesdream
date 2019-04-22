$(document).ready(() => {

    var port;
    var picklist;
    if (location.port) {
        port = ':' + location.port;
    } else {
        port = '';
    };

    $.get(`http://${location.hostname}${port}/api/introduction/`)
        .done((data) => {
            picklist = data.picklists;
            [
                {id: 'Referral', field: 'Lead Source'},
                {id: 'Preparer', field: 'Tax Preparer'}
            ]
            .forEach((drop) =>
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
                            <label for="${drop.id + 'Other'}">Other</label>
                            <input type="text" id="${drop.id + 'Other'}" name="${drop.id + 'Other'}">
                        </div>
                    `
                })
            );
            $('#loading').hide();
            $('#form').show();

        });

    $('#submit').click(function (e) {
        e.preventDefault();
        var fields = ['FirstName', 'LastName', 'Company', 'Email', 'Phone', 'Referral', 'ReferralOther', 'Preparer', 'PreparerOther', 'Description'];

        var body = {};
        fields.forEach((field) => {
            var val = $('#' + field).val();
            val ? body[field] = val : false;
        });

        $.post(`http://${location.hostname}${port}/api/introduction/`, body)
            .done((res) => console.log(res))
            .fail((err) => console.log(err));

    });


});
