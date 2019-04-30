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
            console.log(data);
            $('#loading').hide();
            $('#introForm').show();
            picklist = data.picklists;
            [
                {id: 'Referral', field: 'Lead Source'},
                {id: 'Preparer', field: 'Tax Preparer'}
            ]
            .forEach((drop) =>
                $(`#${drop.id}`).html(
                    picklist[drop.field]
                        .map(item => `
                            <option
                                value="${item}"
                            >${item}</option>
                        `)
                        .join('\n')
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
            )
        });

    $('#submit').click(function (e) {
        e.preventDefault();
        var fields = ['FirstName', 'LastName', 'Company', 'Email', 'Phone', 'Referral', 'ReferralLength', 'Preparer', 'Description'];
        var others = ['Referral', 'Preparer'];

        var body = {};
        var invalid = [];
        fields.forEach((field) => {
            var val = $('#' + field).val();
            val ? body[field] = val : invalid.push('#' + field);
        });
        others.forEach((other) => {
            var val = $('#' + other + 'Other').val();

            if ($('#' + other).val() === 'Other')
                (val) ?
                body[other + 'Other'] = val :
                invalid.push('#' + other + 'Other');
        });

        console.log(invalid);
        // add invalid handling here
        if (invalid.length) return 0; 

        $('#buttonStatus').text('Submitting...');
        $('#submitStatus').show();

        $.post(`http://${location.hostname}${port}/api/introduction/`, body)
            .done((res) => {
                $('#buttonStatus').text('Success!');
                $('#submitStatus').hide();
                $('#submit').toggleClass('btn-primary');
                $('#submit').toggleClass('btn-success');
                $('#submit').attr('disabled', true);
            })
            .fail((err) => {
                $('#buttonStatus').text('Internal Error.');
                $('#submitStatus').hide();
                $('#submit')
                    .toggleClass('btn-primary')
                    .toggleClass('btn-danger')
                    .attr('disabled', true)
                    .after(err.responseJSON.errors.map((error) => `<span>${error}</span>`).join('\n'));
                setTimeout(() => {
                    $('#submit')
                        .toggleClass('btn-danger')
                        .toggleClass('btn-primary')
                        .attr('disabled', false);
                    $('#buttonStatus')
                        .text('Submit');
                }, 2000);
            });

    });


});
