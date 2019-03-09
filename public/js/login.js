$('#submit').on('click', (e) => {
    e.preventDefault();
    var body = {};
    ['username', 'password']
        .forEach((id) => {
            body[id] = $('#'+id).val()
        });
    domain = window.location.href;

    $.post(window.location.href, body, (res, status) => {
        // $('#notification') ... "preparing documents" or something
        console.log(res);
        //window.location.href = res.redirect;
    });
        


});
