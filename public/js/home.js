var modalLoader = (lead) => {
    var link = lead.link;
    var meeting;
    
    if (!lead.Zoom_Meeting__c) {
        meeting = 'Unscheduled. Schedule a meeting here:';
    } else {
        meeting_format = moment(lead.Zoom_Meeting__c).format('MMMM Do YYYY at h:mm a');
        if (moment(lead.Zoom_Meeting__c).isBefore(Date.now())) {
            meeting = `Completed on ${meeting_format}.`;
        } else {
            meeting = `Scheduled for ${meeting_format}. <a href="http://zoom.us/j/${lead.Zoom_Meeting_ID__c}">Launch meeting</a>`;
        }
    };

    var ledger;
    if (!link.l_sent.length) {
        ledger = 'Account ledger has not been sent.';
    } else if (link.l_completed.length) {
        ledger = 'Account ledger last updated: ' + moment(link.l_completed[link.l_completed.length-1]).format('MMM Do, YYYY');
    } else if (link.l_opened.length) {
        ledger = `Account ledger last opened: ${moment(link.l_opened[link.l_opened.length-1]).format('MMM Do, YYYY')}`;
    } else {
        ledger = `Account ledger has not been opened. Last sent: ${moment(link.l_sent[link.l_sent.length-1]).format('MMM Do, YYYY')}`;
    }
        
    
    $(`#modal-body`).empty();
    $(`#modal-body`).append(`
        <input id="modal-id" type="hidden" value="${lead._id}">
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
        <br>
        <span>Zoom Meeting: ${meeting}</span>
        <br>
        <span>${ledger}</span>
        <br>
        <span>Send account ledger form?</span>
        <span>
            <button type="button" id="sendLedger" class="btn btn-default">Send</button>
        </span>
    `);

    $(`#modal-body`).append(`<div id="CreatedDateinfo">Date Created: <b>${moment(lead.CreatedDate).format('MMM Do, YYYY')}</b></div>`);

    $('#mModalLabel').text(`${lead.FirstName} ${lead.LastName}'s Information`);

    $('#sendLedger').click(function (e) {
        e.preventDefault();
        console.log(lead);
        $.post(`http://${location.hostname}:${9600}/api/ledger/create`, {
            _id: lead.Toolkit_ID__c
        })
        .then((res) => console.log(res));
    });
};


$(document).ready(() => {
    var picklist;
    var port;
    if (location.port) {
        port = ':' + location.port;
    } else {
        port = '';
    };

    $.get(`http://${location.hostname}${port}/leads`)
        .done((data) => {
            console.log(data);
            $('#loading').hide();

            data.forEach((lead, index) => {
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
                    var lead = data[$(this).data('index')];

                    // check if link is cached. if not, fetch it from the backend
                    lead.link ?
                        modalLoader(lead) :
                        $.get(`http://${location.hostname}${port}/links/${lead.Toolkit_ID__c}`)
                            .then((link) => {
                                lead.link = link;
                                console.log(link);
                                modalLoader(lead);
                            })
                            .catch((err) => console.log(err));
                });
            });


        })
        .fail((err) => console.log(err));


});
