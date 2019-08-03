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
            $('#loading').hide();

            leads.forEach((lead, index) => {
                $('#leads').append(`<tr id="lead${index}"> </tr>`);

                $(`#lead${index}`).append(`
                    <td scope="row">${lead.FirstName} ${lead.LastName}</td>
                    <td scope="row">${lead.Company}</td>
                `);
                if(!lead.Zoom_Meeting__c == " "){
                    $(`#lead${index}`).append(`
                        <td scope="row">${moment(lead.Zoom_Meeting__c).format('MMM D')}<br><b>${moment(lead.Zoom_Meeting__c).format('h:mm A')}</b> </td>
                        <td scope="row">${lead.Zoom_Meeting_ID__c} </td>
                        `);
                } else {
                    $(`#lead${index}`).append(`
                        <td scope="row"> </td>
                        <td scope="row"> </td>
                        `);
                };
                $(`#lead${index}`).append(`
                    <td scope="row"><a href="https://www.google.com/" style="color:#572e5e">View</a> </td>
                    <td scope="row">${lead.Status} </td>
                    <td scope="row"><button type="button" class="btn btn-sm more" data-toggle="modal" id="moreButton" data-target="#mModal" data-index="${index}" data-name="${lead.Name}" style="background-color:#572e5e; color: white">More</button></td>
                    `);
            });

            // add event handlers to each more button
            $('.more').each(function () {
                $(this).click(function (e) {
                    e.preventDefault();
                    var lead = leads[$(this).data('index')];

                    $(`#modal-body`).empty();

                    $(`#modal-body`).append(`
                        <div id="Statusinfo">Status: <b>${lead.Status}</b></div>
                        <span id="FirstNameinfo">First Name: <b>${lead.FirstName}</b></span> &emsp;&emsp;&emsp;
                        <span id="LastNameinfo">Last Name: <b>${lead.LastName}</b></span>
                        <br>
                        <span id="Companyinfo">Company Name: <b>${lead.Company}</b></span> &emsp;&emsp;&emsp;
                        <span id="Titleinfo">Title: <b>${lead.Title}</b></span>
                        <hr>
                        <div id="Phoneinfo">Phone Number: <b>(${parseInt(lead.Phone/10000000)}) ${parseInt((lead.Phone%10000000)/10000)} - ${lead.Phone%10000}</b></div>
                        <div id="Emailinfo">Email: <b>${lead.Email}</b></div>
                        <hr>
                        `);

                    $(`#modal-body`).append(`<div id="CreatedDateinfo">Date Created: <b>${moment(lead.CreatedDate).format('MMM Do, YYYY')}</b></div>`);


                    $('#mModalLabel').text(`${lead.FirstName} ${lead.LastName}'s Information`);
                });
            });


        })
        .fail((err) => console.log(err));


});
