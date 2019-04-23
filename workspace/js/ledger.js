$(document).ready(() => {
    $('#newCard').click(function (e) {
        // START ADDING CARDS HERE
        $('#cardTable').append(`
            <tr>hello ${}, new table row!</tr>
        `);
    });


});
