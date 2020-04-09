var port = location.port ? ':' + location.port : '';

var permissions = ['GET', 'POST', 'ADMIN'];

var permSelect = (id) => `
    <select multiple id="${id}">
        ${permissions.map((perm) => `<option value=${perm}>${perm}</option>`)}
    </select>
`;

var username_gen = (e) =>
    $('#username').val(
        ($('#firstName').val()[0] + 
        $('#lastName').val()).toLowerCase()
    );

$(document).ready(() => {

    $('#perm-group').html(`
        <label for="perms">Permissions</label>
        ${permSelect('perms')}
    `);

    $.get(`${location.protocol}//${location.hostname}:9600/api/admin`)
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
                            <span>Permissions: </span>${permSelect('newPerms')}</div>
                    `);
                    $('#update').click(function (e) {
                        e.preventDefault();
                        let body = { perms: $('#newPerms').val() };
                        console.log(body);
                        $.post(`${location.protocol}//${location.hostname}${port}/api/admin/${user._id}`, body)
                            .done((res) => {
                                console.log(res);
                                $('#update')
                                    .addClass('btn-success')
                                    .text('Success!')
                                    .prop('disabled', true);
                            })
                            .fail((err) => {
                                console.log(err);
                                $('#update')
                                    .addClass('btn-danger')
                                    .text('Error updating.')
                                    .prop('disabled', true);
                                setTimeout(() =>
                                    $('#update')
                                        .removeClass('btn-danger')
                                        .text('Save changes')
                                        .prop('disabled', false),
                                    2500);
                            });
                    });

                });
            });
        });

    $('#firstName').change(username_gen);
    $('#lastName').change(username_gen);

    

    $('#submit').click(function(e) {
        e.preventDefault();
        var body = { user: {}};
        ['firstName', 'lastName', 'username', 'email', 'perms']
            .forEach((field) => body.user[field] = $('#' + field).val());
        console.log(body);
        $.post(`${location.protocol}//${location.hostname}${port}/api/admin/`, body)
            .done((res) => {
                console.log(res);
                $('#submit')
                    .addClass('btn-success')
                    .text('Success!')
                    .prop('disabled', true);
            })
            .fail((err) => {
                console.log(err);
                $('#submit')
                    .addClass('btn-danger')
                    .text('Error submitting.')
                    .prop('disabled', true);
                setTimeout(() =>
                    $('#submit')
                        .removeClass('btn-danger')
                        .text('Submit')
                        .prop('disabled', false),
                    2500);
            });
    });
});

