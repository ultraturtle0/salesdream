var port = location.port ? ':' + location.port : '';

var username_gen = (e) =>
    $('#username').val(
        $('#firstName').val().toLowerCase()[0] + 
        $('#lastName').val().toLowerCase()
    );

$(document).ready(() => {
    $('#firstName').change(username_gen);
    $('#lastName').change(username_gen);

    $('#submit').click(function(e) {
        e.preventDefault();
        var body = {};
        ['firstName', 'lastName', 'username', 'email']
            .forEach((field) => body[field] = $('#' + field).val());
        $.post(`http://${location.hostname}${port}/api/users/`, body)
            .done((res) => {
                console.log(res);
            })
            .fail((err) => {
                console.log(err);
            });
    });
});

