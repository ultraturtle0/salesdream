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
            /*picklist = {
                Referral: [
                    'one',
                    'two'
                ],
                Preparer: [
                    'daniel',
                    'chike'
                ],
                Software: [
                    'QBO',
                    'QBD'
                ],
                Type: [
                    'Sole Prop LLC',
                    'LLP',
                    'S-Corp',
                    'C-Corp'
                ],
                Industry: [
                    'real estate',
                    'finance'
                ]
            };*/
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
            ['Referral', 'Preparer', 'Classification'].forEach((select) => {
                var lists = picklist[select] || [];
                $('#' + select).html(
                    lists
                        .map(item => `
                            <option
                                value=${item}
                                ${(['Software', 'Industry'].includes(item)) ? ' multiple' : ''}
                            >${item}</option>
                        `)
                        .join('\n')
                ).after(function () {
                    $(this).change(function () {
                        console.log($(this).val());
                        ($(this).val()==='Other') ?
                            $(`#${select}Other`).show() :
                            $(`#${select}Other`).hide();
                    });
                    return `
                        <div id="${select + 'Other'}" style="display:none;">
                            <label for="${select + 'OtherInput'}">Other</label>
                            <input type="text" id="${select + 'OtherInput'}" name="${select + 'OtherInput'}">
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
                    <div id="${select}Other"
                        style="display:none;">
                        <input type="text" id="${select + 'OtherInput'}" name="${select + 'OtherInput'}">
                    </div>
                `);
                $(`#${select}-Other`).change(function () {
                    (this.checked) ?
                        $(`#${select}Other`).show() :
                        $(`#${select}Other`).hide();
                });
            });

            // add datepicker
            $('.datepicker').datepicker({
                format: 'mm/dd/yyyy'
            });

        })
        .fail((err) => console.log(err));

        //$('#Id').value(leadId);
    //

    $('#submit').click(function (e) {
        e.preventDefault();
        var fields = ['FirstName', 'LastName', 'pastBookkeeper', 'Frequency', 'Hours', 'Rating', 'Phone', 'Referral', 'Current', 'Preparer', 'Email', 'Company', 'Title', 'BillingAddress', 'ShippingAddress', 'Classification', 'Description'];
        var body = {};
        fields.forEach((field) => {
            var val = $('#' + field).val();
            val ? body[field] = val : false;
        });
        ['Industry', 'Software'].forEach((cat) =>
            body[cat] = picklist[cat].reduce((acc, field) => {
                $(`#${cat}-${field.replace(/\s/g, '_').replace(/&/g, '_')}`).prop('checked') ? acc.push(field) : false;
                return acc;
            }, [])
        );
        console.log(body);
    });

    });
