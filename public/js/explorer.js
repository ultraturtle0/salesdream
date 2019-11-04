$(document).ready(() => {
    window['moment-range'].extendMoment(moment);

    var picklist;
    var port;
    if (location.port) {
        port = ':' + location.port;
    } else {
        port = '';
    };

    $.get(`http://${location.hostname}${port}/api/link`)
        .done((data) => {
            console.log(data);
            $('#loading').hide();

            data.forEach((lead, index) => {
                $('#leads').append(`<tr id="lead${index}"> </tr>`);

                $(`#lead${index}`).append(`
                    <td scope="row">${lead.firstName} ${lead.lastName}</td>
                    <td scope="row">${lead.companyName}</td>
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
