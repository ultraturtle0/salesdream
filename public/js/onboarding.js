
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
