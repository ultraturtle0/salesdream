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

/*$(document).ready(() => {
    $.get(`http://${location.hostname}
    $('#update').click(function () {
        var lead = window.leads[$(this).data('index')];
        lead.keys.forEach((key) => $('#' + key).value(lead[key]));
        var leadName = $(this).data('name');
        $('#uModalLabel').text(`Great, let's get ${leadName} updated.`);

        //$('#Id').value(leadId);
    });
});*/
