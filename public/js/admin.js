var port = location.port ? ':' + location.port : '';

var permissions = ['GET', 'POST', 'ADMIN'];

var permSelect = `
    <select multiple id="perms">
        ${permissions.map((perm) => `<option value=${perm}>${perm}</option>`)}
    </select>
`;

var username_gen = (e) =>
    $('#username').val(
        ($('#firstName').val()[0] + 
        $('#lastName').val()).toLowerCase()
    );

$(document).ready(() => {

    $.get(`${location.protocol}//${location.hostname}:9601/api/users`)
        .done((users) => {
            users.forEach((user, index) => 
                $('#users').append(`<tr>
                    <td scope="col">${user.firstName} ${user.lastName}</td>
                    <td scope="col">${user.email}</td>
                    <td scope="col">${user.username}</td>
                    <td scope="col">${user.perms.join(', ')}</td>
                    <td scope="col"><button type="button" class="btn btn-primary edit" data-index="${index}" data-toggle="modal" data-target="#editModal">
                </tr>`)
            );
            $('.edit').each(function () {
                console.log('how many?');
                $(this).click(function (e) {
                    e.preventDefault();
                    var user = users[$(this).data('index')];
                    console.log(user);
                    $('#modal-body').empty();

                    $('#modal-body').append(`
                        <form id="modal-form"
                        <div>
                            <span>Name: <b>${user.firstName} ${user.lastName}</b></span></div>
                        <div>
                            <span>Email: <b>${user.email}</b></span></div>
                        <div>
                            <span>Username: <b>${user.username}</b></span></div>
                        <div>
                            <span>Permissions: </span>${permSelect}</div>
                    `);
                });
            });
        });

    $('#firstName').change(username_gen);
    $('#lastName').change(username_gen);

    $('#submit').click(function(e) {
        e.preventDefault();
        var body = {};
        ['firstName', 'lastName', 'username', 'email']
            .forEach((field) => body[field] = $('#' + field).val());
        $.post(`${location.protocol}//${location.hostname}${port}/api/users/`, { body })
            .done((res) => {
                console.log(res);
            })
            .fail((err) => {
                console.log(err);
            });
    });
});

