$('#submit').on('click', (e) => {
    e.preventDefault();
    var body = {};
    ['FirstName', 'LastName', 'Company', 'Email', 'Phone', 'Description']
        .forEach((id) => {
            body[id] = $('#'+id).val()
        });
    console.log(body);

    $.post(window.location.href, body, (res, status) => console.log(res, status));
});

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
            console.log(data.leads);
            leads = data.leads;
            picklist = {
                Referral: [
                    'one',
                    'two'
                ],
                Preparer: [
                    'daniel',
                    'chike'
                ]
            }; //data.picklist;

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

            // add event handlers to each update button
            $('.update').each(function () {
                $(this).click(function () {
                    var lead = leads[$(this).data('index')];
                    var names = lead.Name.split(' ');
                    lead.FirstName = names[0];
                    lead.LastName = names[1]; 

                    ['Id', 'FirstName', 'LastName', 'Company', 'Email', 'Phone', 'Description'].forEach((field) =>
                        $('#' + field).val(lead[field]));
                    $('#uModalLabel').text(`Great, let's get ${names[0]} updated.`);

                });
            });

            // populate all dropdown menus with Salesforce picklists
            ['Referral', 'Preparer'].forEach((select) => 
                $('#' + select).html(
                    [...picklist[select], 'Other']
                        .map(item => `<option value=${item}>${item}</option>`)
                        .join('\n')
                )
            );
        })
        .fail((err) => console.log(err));

        //$('#Id').value(leadId);
    });
