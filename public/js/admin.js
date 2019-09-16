var port = location.port ? ':' + location.port : '';

var username_gen = (e) =>
    $('#username').val(
        ($('#firstName').val()[0] + 
        $('#lastName').val()).toLowerCase()
    );

$(document).ready(() => {

    $.get(`http://${location.hostname}:9601/api/users`)
        .done((users) =>
            users.forEach((user) => 
                $('#users').append(`<tr>
                    <td scope="col">${user.firstName} ${user.lastName}</td>
                    <td scope="col">${user.email}</td>
                    <td scope="col">${user.username}</td>
                    <td scope="col">${user.perms}</td>
                </tr>`)
            )
        );

    $('#firstName').change(username_gen);
    $('#lastName').change(username_gen);

    $('#submit').click(function(e) {
        e.preventDefault();
        var body = {};
        ['firstName', 'lastName', 'username', 'email']
            .forEach((field) => body[field] = $('#' + field).val());
        $.post(`http://${location.hostname}${port}/api/users/`, { body })
            .done((res) => {
                console.log(res);
            })
            .fail((err) => {
                console.log(err);
            });
    });
});

