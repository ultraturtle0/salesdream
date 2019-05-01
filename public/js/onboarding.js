const states = [
     'CA','AL','AK','AS','AZ','AR','CO','CT','DE','DC','FM','FL','GA',
     'GU','HI','ID','IL','IN','IA','KS','KY','LA','ME','MH','MD','MA',
     'MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND',
     'MP','OH','OK','OR','PW','PA','PR','RI','SC','SD','TN','TX','UT',
     'VT','VI','VA','WA','WV','WI','WY'
];

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
            picklist.BillingState = states;
            picklist.ShippingState = states;
            $('#loading').hide();

            leads.forEach((lead, index) => 
                $('#leads').append(`<tr>
                    <td scope="row">${moment(lead.CreatedDate).format('MMM Do, YYYY')}</td>
                    <td scope="row">${lead.FirstName} ${lead.LastName}</td>
                    <td scope="row">${lead.Company}</td>
                    <td scope="row">${lead.Phone}</td>
                    <td scope="row">${lead.Email}</td>
                    <td scope="row"><button type="button" class="btn btn-danger dismiss" data-toggle="modal" data-target="#dModal" data-index="${index}" data-name="${lead.Name}">Dismiss</button></td>
                    <td scope="row"><button type="button" class="btn btn-primary update" data-toggle="modal" data-target="#uModal" data-index="${index}" data-name="${lead.Name}">Update</button></td>
                </tr>`)
            );

            // CHANGE THIS - ONLY Preparer NEEDS A TEMPORARY OTHER BOX
            // populate all dropdown menus with Salesforce picklists
            ['Account Source', 'Tax Preparer', 'Business Classification', 'BillingState', 'ShippingState'].forEach((select) => {
                var lists = picklist[select] || [];
                var id = select.replace(/\s+/g, '');
                $('#' + id).html(
                    lists
                        .map(item => `
                            <option
                                value="${item}"
                                ${(['Software', 'Industries'].includes(item)) ? ' multiple' : ''}
                            >${item}</option>
                        `)
                        .join('\n')
                ).after(function () {
                    $(this).change(function () {
                        console.log($(this).val());
                        ($(this).val()==='Other') ?
                            $(`#${id}OtherDiv`).show() :
                            $(`#${id}OtherDiv`).hide();
                    });
                    return `
                        <div id="${id + 'OtherDiv'}" style="display:none;">
                            <label for="${id + 'Other'}">Other</label>
                            <input type="text" id="${id + 'Other'}" name="${id + 'Other'}">
                        </div>
                    `
                })
            });

            ['Account Source'].forEach((select) => {
                var lists = picklist[select] || [];
                var id = select.replace(/\s+/g, '');
                $('#d' + id).html(
                    lists
                        .map(item => `
                            <option value="${item}">${item}</option>
                        `)
                        .join('\n')
                ).after(function () {
                    $(this).change(function () {
                        console.log($(this).val());
                        ($(this).val()==='Other') ?
                            $(`#d${id}OtherDiv`).show() :
                            $(`#d${id}OtherDiv`).hide();
                    });
                    return `
                        <div id="d${id + 'OtherDiv'}" style="display:none;">
                            <label for="d${id + 'Other'}">Other</label>
                            <input type="text" id="d${id + 'Other'}" name="d${id + 'Other'}">
                        </div>
                    `
                });
            });


            ['Software', 'Industries'].forEach((select) => {
                var lists = picklist[select] || [];
                $('#' + select + '-div').append(
                    lists
                        .map(item => {
                        var str = `${select}-${item.replace(/[\s&:,]/g, '_')}`;
                        return `
                            </br>
                            <input type="checkbox"
                                id="${str}"
                                name="${str}"
                                value="${item}">
                            <label class="form-check-label"
                                for="${str}">${item}</label>
                        `})
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

            $('#dReasons-div').append(
                picklist['Reasons for Rejection']
                    .map(item => {
                        var str = `${'Reasons'}-${item.replace(/[\s&:,]/g, '_')}`;
                        return `
                            </br>
                            <input type="checkbox"
                                id="d${str}"
                                name="d${str}"
                                value="${item}">
                            <label class="form-check-label"
                                for="d${str}">${item}</label>
                        `
                    })
                    .join('\n')
                )
                .after(`
                    <div id="dReasonsOtherDiv"
                        style="display:none;">
                        <input type="text" id="dReasonsOther" name="dReasonsOther">
                    </div>
                `);
                $(`#dReasons-Other`).change(function () {
                    (this.checked) ?
                        $(`#dReasonsOtherDiv`).show() :
                        $(`#dReasonsOtherDiv`).hide();
                });



            // add datepicker
            $('.datepicker').datepicker({
                format: 'mm/dd/yyyy'
            });
            /*$('.datepicker').on('change dp.change', function(e){
                console.log($(this).data('date'));
                $('#datepicker').val($(this).data('date'));
            });
            */


            // add event handlers to each dismiss button
            $('.dismiss').each(function () {
                $(this).click(function () {
                    var lead = leads[$(this).data('index')];

                    // populate known fields
                    ['Id', 'FirstName', 'LastName', 'Company', 'Email', 'Phone', 'Description'].forEach((field) => $('#d' + field).val(lead[field]));

                    ['LeadSource'].forEach((field) => {
                        var value = lead[field + '__c'];
                        var valueOther = lead[field + 'Other__c'];
                        console.log(value);
                        console.log(valueOther);
                        if (value) {
                            $(`#d${field} option[value='${value}']`).prop('selected', true);
                            if (value === 'Other') $(`#d${field}OtherDiv`).show();
                        }
                        $(`#d${field}Other`).val(valueOther || '');
                    });


                    $('#dModalLabel').text(`Sorry ${lead.FirstName} didn't work out.`);
                });

            });



            // add event handlers to each update button
            $('.update').each(function () {
                $(this).click(function () {
                    var lead = leads[$(this).data('index')];

                    // populate known fields
                    ['Id', 'FirstName', 'LastName', 'Company', 'Email', 'Phone', 'Description'].forEach((field) => $('#' + field).val(lead[field]));


                    // select known dropdown menus
                    ['LeadSource', 'Preparer'].forEach((field) => {
                        var value = lead[field + '__c'];
                        var valueOther = lead[field + 'Other__c'];
                        if (value) {
                            $(`#${field} option[value='${value}']`).prop('selected', true);
                            if (value === 'Other') $(`#${field}OtherDiv`).show();
                        }
                        $(`#${field}Other`).val(valueOther || '');
                    });

                    $('#uModalLabel').text(`Great, let's get ${lead.FirstName} updated.`);
                });
            });


        })
        .fail((err) => console.log(err));

        //$('#Id').value(leadId);
    //

    $('#submit').click(function (e) {
        e.preventDefault();
        var fields = ['Id', 'FirstName', 'LastName', 'Company', 'Title', 'PastBookkeeper', 'Frequency', 'Hours', 'Rating', 'Phone', 'AccountSource', 'AccountSourceOther', 'TaxPreparer', 'TaxPreparerOther', 'Email', 'Company', 'Title', 'BillingStreet','BillingCity','BillingState','BillingPostalCode', 'ShippingStreet','ShippingCity','ShippingState','ShippingPostalCode', 'BusinessClassification', 'Description'];
        var body = {};
        body['Converted'] = true;
        fields.forEach((field) => {
            var val = $('#' + field).val();
            val ? body[field] = val : false;
        });
        body['Current'] = $('.datepicker').val();

        // for Salesforce, these need to be converted to a semicolon-separated string
        ['Industries', 'Software'].forEach((cat) =>
            body[cat] = picklist[cat]
                .reduce((acc, field) => {
                    var str = `#${cat}-${field.replace(/[\s&,:]/g, '_')}`;
                    var checked = $(str).prop('checked');
                    if (checked) 
                        acc.push(field);
                    console.log(acc);
                    return acc;
                }, [])
                .join('; ')
        );

        console.log(body);
        
        $.post(`http://${location.hostname}${port}/api/onboarding/`, body)
            .done((res) => {
                res.errors.forEach((err) => console.error(err));
                res.messages.forEach((msg) => console.log(msg));
            })
            .fail((err) => {
                //PUT ERROR MODAL HERE
                console.log(err);
            });
    });

    $('#dismiss').click(function (e) {
        e.preventDefault();
        var fields = ['Id', 'FirstName', 'LastName', 'Company', 'Phone', 'AccountSource', 'AccountSourceOther', 'Email', 'Company', 'Description', 'Reasons', 'ReasonsOther'];
        var dbody = {};
        dbody['Converted'] = false;


        var cat = 'Reasons';
        dbody[cat] = picklist['Reasons for Rejection']
            .reduce((acc, field) => {
                var str = `#d${cat}-${field.replace(/[\s&,:]/g, '_')}`;
                var checked = $(str).prop('checked');
                if (checked) 
                    acc.push(field);
                console.log(acc);
                return acc;
            }, [])
            .join('; ');

        fields.forEach((field) => {
            var val = $('#d' + field).val();
            val ? dbody[field] = val : false;
        });
        console.log(dbody);

        $.post(`http://${location.hostname}${port}/api/onboarding/`, dbody)
            .done((res) => {
                if ('error' in res)
                    res.error.forEach((err) => console.error(err));
                if ('message' in res)
                    res.message.forEach((msg) => console.log(msg));
            })
            .fail((err) => {
                //PUT ERROR MODAL HERE
                console.log(err);
            });

    });


});
