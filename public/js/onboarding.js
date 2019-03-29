$(document).ready(() => {
    var leads;
    var picklist;
    var port;
    if (location.port) {
        port = ':' + location.port;
    } else {
        port = '';
    };

    $.get(`http://${location.hostname}${port}/api/onboarding/`)
        .done((data) => {
            console.log(data);
            leads = data.leads;
            picklist = data.picklists;

            $('#loading').hide();

            leads.forEach((lead, index) => 
                $('#leads').append(`<tr>
                    <td scope="row">${moment(lead.CreatedDate).format('MMM Do, YYYY')}</td>
                    <td scope="row">${lead.Name}</td>
                    <td scope="row">${lead.Company}</td>
                    <td scope="row">${lead.Phone}</td>
                    <td scope="row">${lead.Email}</td>
                    <td scope="row"><button type="button" class="btn btn-primary update" data-toggle="modal" data-target="#uModal" data-index="${index}" data-name="${lead.Name}">Update</button></td>
                </tr>`)
            );

            // populate all dropdown menus with Salesforce picklists
            ['Referral', 'Preparer', 'Classification'].forEach((select) => {
                var lists = picklist[select] || [];
                $('#' + select).html(
                    lists
                        .map(item => `
                            <option
                                value="${item}"
                                ${(['Software', 'Industry'].includes(item)) ? ' multiple' : ''}
                            >${item}</option>
                        `)
                        .join('\n')
                ).after(function () {
                    $(this).change(function () {
                        console.log($(this).val());
                        ($(this).val()==='Other') ?
                            $(`#${select}OtherDiv`).show() :
                            $(`#${select}OtherDiv`).hide();
                    });
                    return `
                        <div id="${select + 'OtherDiv'}" style="display:none;">
                            <label for="${select + 'Other'}">Other</label>
                            <input type="text" id="${select + 'Other'}" name="${select + 'Other'}">
                        </div>
                    `
                })
            });
            ['Software', 'Industry'].forEach((select) => {
                var lists = picklist[select] || [];
                $('#' + select + '-div').append(
                    lists
                        .map(item => `
                            <input type="checkbox"
                                id="${select}-${item.replace(/\s/g, '_').replace(/&/g, '_')}"
                                name="${select}-${item.replace(/\s/g, '_').replace(/&/g, '_')}"
                                value="${item}">
                            <label class="form-check-label"
                                for="${item.replace(/\s/g, '_')}">${item}</label>
                        `)
                        .join('\n')
                )
                .after(`
                    <div id="${select}OtherDiv"
                        style="display:none;">
                        <input type="text" id="${select + 'Other'}" name="${select + 'Other'}">
                    </div>
                `);
                $(`#${select}-Other`).change(function () {
                    (this.checked) ?
                        $(`#${select}OtherDiv`).show() :
                        $(`#${select}OtherDiv`).hide();
                });
            });

            // add datepicker
            $('.datepicker').datepicker({
                format: 'mm/dd/yyyy'
            });

            // add event handlers to each update button
            $('.update').each(function () {
                $(this).click(function () {
                    var lead = leads[$(this).data('index')];
                    var names = lead.Name.split(' ');
                    lead.FirstName = names[0];
                    lead.LastName = names[1]; 


                    // populate known fields
                    ['Id', 'FirstName', 'LastName', 'Company', 'Email', 'Phone', 'Description'].forEach((field) =>
                        $('#' + field).val(lead[field]));

                    // select known dropdown menus
                    ['Referral', 'Preparer'].forEach((field) => {
                        var value = lead[field + '__c'];
                        var valueOther = lead[field + 'Other__c'];
                        if (value) {
                            $(`#${field} option[value='${value}']`).prop('selected', true);
                            if (value === 'Other') $(`#${field}OtherDiv`).show();
                        }
                        $(`#${field}Other`).val(valueOther || '');
                    });

                    $('#uModalLabel').text(`Great, let's get ${names[0]} updated.`);

                });
            });


        })
        .fail((err) => console.log(err));

        //$('#Id').value(leadId);
    //

    $('#submit').click(function (e) {
        e.preventDefault();
        var fields = ['Id', 'FirstName', 'LastName', 'pastBookkeeper', 'Frequency', 'Hours', 'Rating', 'Phone', 'Referral', 'ReferralOther', 'Current', 'Preparer', 'PreparerOther', 'Email', 'Company', 'Title', 'BillingAddress', 'ShippingAddress', 'Classification', 'Description'];
        var body = {};
        fields.forEach((field) => {
            var val = $('#' + field).val();
            val ? body[field] = val : false;
        });
        ['Industry', 'Software'].forEach((cat) =>
            body[cat] = picklist[cat]
                .reduce((acc, field) => {
                    $(`#${cat}-${field.replace(/\s/g, '_').replace(/&/g, '_')}`).prop('checked') ? acc.push(field) : false;
                    return acc;
                }, [])
        );
        console.log(body);
        
        //$.post(`http://${location.hostname}${port}/api/onboarding/`,
    });

});
