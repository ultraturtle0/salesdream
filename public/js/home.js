var modalLoader = (lead) => {
    $('#modal-body-calendar').hide();
    var link = lead.link;
    var meeting;
    
    if (!lead.Zoom_Meeting__c) {
        meeting = 'Unscheduled. Schedule a meeting <a id="scheduler" href="#">here</a>.';
    } else {
        meeting_format = moment(lead.Zoom_Meeting__c).format('MMMM Do YYYY at h:mm a');
        if (moment(lead.Zoom_Meeting__c).isBefore(Date.now())) {
            meeting = `Completed on ${meeting_format}.`;
        } else {
            meeting = `Scheduled for ${meeting_format}. <a href="http://zoom.us/j/${lead.Zoom_Meeting_ID__c}">Launch meeting</a>`;
        }
    };

    var ledger;
    console.log(lead);
    if (!link.l_sent.length) {
        ledger = 'Account ledger has not been sent.';
    } else if (link.l_completed.length) {
        ledger = 'Account ledger last updated: ' + moment(link.l_completed[link.l_completed.length-1]).format('MMM Do, YYYY');
    } else if (link.l_opened.length) {
        ledger = `Account ledger last opened: ${moment(link.l_opened[link.l_opened.length-1]).format('MMM Do, YYYY')}`;
    } else {
        ledger = `Account ledger has not been opened. Last sent: ${moment(link.l_sent[link.l_sent.length-1]).format('MMM Do, YYYY')}`;
    }
        
    $(`#modal-body-top`).html(`
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
        <div id="CreatedDateinfo">Date Created: <b>${moment(lead.CreatedDate).format('MMM Do, YYYY')}</b></div>
        <hr>
        <div><a href="${location.protocol}//${location.hostname}${port}/view/${link.link}">View Questionnaire</a></div>
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

    $('#submitCal').click(function (e) {
        e.preventDefault();
        console.log(calendarGet());
        $.post(`${location.protocol}//${location.hostname}${port}/api/calendar/create`, {
            _id: lead.Toolkit_ID__c,
            FirstName: lead.link.firstName,
            LastName: lead.link.lastName,
            Email: lead.link.email,
            startEvent: calendarGet()
        })
            // WRITE SUCCESS/FAILURE LATER
            .then((res) => console.log(res))
            .catch((err) => console.log(err));
    });

    $('#scheduler').click(function (e) {
        e.preventDefault();
        $('#modal-body-calendar').toggle();
    });

    $('#mModalLabel').text(`${lead.FirstName} ${lead.LastName}'s Information`);

    $('#sendLedger').click(function (e) {
        e.preventDefault();
        $.post(`${location.protocol}//${location.hostname}${port}/api/ledger/create`, {
            _id: lead.Toolkit_ID__c
        })
        .then((res) => {
            return $.post(`${location.protocol}//${location.hostname}${port}/api/sendledger`, {
                FirstName: lead.FirstName,
                LastName: lead.LastName,
                Email: lead.Email,
                link: `${location.protocol}//${location.hostname}${port}/ledger/${res.ledgerLink}`
            })
            .then((res) => console.log(res));
        });
    });
};


$(document).ready(() => {
    window['moment-range'].extendMoment(moment);

    var picklist;
    var port;
    if (location.port) {
        port = ':' + location.port;
    } else {
        port = '';
    };

    $.get(`${location.protocol}//${location.hostname}${port}/leads`)
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
                        $.get(`${location.protocol}//${location.hostname}${port}/links/${lead.Toolkit_ID__c}`)
                            .then((link) => {
                                lead.link = link[0];
                                console.log(lead);
                                console.log(link);
                                modalLoader(lead);
                            })
                            .catch((err) => console.log(err));
                });
            });


        })
        .fail((err) => console.log(err));
    
    calendarLoad('#modal-body-calendar');
    $('#modal-body-calendar').append(`
        <button type="button" class="btn btn-primary" id="submitCal">Schedule</button>
    `);



});
