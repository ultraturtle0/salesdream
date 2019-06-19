
$(document).ready(() => {

    var port;
    var picklist;
    if (location.port) {
        port = ':' + location.port;
    } else {
        port = '';
    };

    $.get(`http://${location.hostname}${port}/api/introduction/`)
        .done((data) => {
            console.log(data);
            $('#loading').hide();
            $('#introForm').show();
            picklist = data.picklists;
            [
                {id: 'Referral', field: 'Lead Source'},
                {id: 'Preparer', field: 'Tax Preparer'}
            ]
            .forEach((drop) =>
                $(`#${drop.id}`).html(
                    `<option
                        disabled selected value></option>
                    \n${
                        picklist[drop.field]
                            .map(item => `
                                <option
                                    value="${item}"
                                >${item}</option>
                            `) 
                            .join('\n')
                    }`
                ).after(function () {
                    $(this).change(function () {
                        ($(this).val()==='Other') ?
                            $(`#${drop.id}OtherDiv`).show() :
                            $(`#${drop.id}OtherDiv`).hide();
                    });
                    return `
                        <div id="${drop.id + 'OtherDiv'}" style="display:none;">
                            <label for="${drop.id + 'Other'}">Other</label>
                            <input type="text" id="${drop.id + 'Other'}" name="${drop.id + 'Other'}">
                        </div>
                    `
                })
            );
            $('#loading').hide();
            $('#form').show();

        });
    var dates = [
    ];
    var times /*= [
        (moment("09:30", "HH:mm")).format("HH:mm A"),
        (moment("10:00", "HH:mm")).format("HH:mm A"),
        (moment("10:30", "HH:mm")).format("HH:mm A"),
        (moment("11:00", "HH:mm")).format("HH:mm A"),
        (moment("11:30", "HH:mm")).format("HH:mm A"),
        (moment("12:00", "HH:mm")).format("HH:mm A"),
        (moment("12:30", "HH:mm")).format("HH:mm A"),
        (moment("13:00", "HH:mm")).format("HH:mm A"),
        (moment("13:30", "HH:mm")).format("HH:mm A"),
        (moment("14:00", "HH:mm")).format("HH:mm A"),
        (moment("14:30", "HH:mm")).format("HH:mm A"),
        (moment("15:00", "HH:mm")).format("HH:mm A"),
        (moment("15:30", "HH:mm")).format("HH:mm A"),
        (moment("16:00", "HH:mm")).format("HH:mm A"),
        (moment("16:30", "HH:mm")).format("HH:mm A"),
        (moment("17:00", "HH:mm")).format("HH:mm A"),
        ];*/
    console.log(times);
    
    var currentDate;
    var twoWeeksDate;
    var events;
    $.get(`http://${location.hostname}${port}/api/scheduling/`)
        .done((data) => {
            console.log(data);
            $('#loading').hide();
            $('#introForm').show();
            currentDate = data.currentDate;
            twoWeeksDate = data.twoWeeksDate;
            events = data.data;
            console.log(currentDate);
            console.log(twoWeeksDate);
            console.log(events);
            console.log((moment(events[1].start.dateTime).startOf('day')).toDate());
            
            for (i=0; i<14; i++) {
                $(`#col${i}Week`).append(`
                    ${(moment(currentDate).add(i, 'days')).format('ddd')}
                `);
                $(`#col${i}Date`).append(`
                    ${(moment(currentDate).add(i, 'days')).format('MMMM D')}
                `);
                //dates[i] = new Array (moment(currentDate).add(i, 'days'));
            };
            console.log(dates);

            for(j=0; j < events.length; j++){

            
          /*  var timeRemovefirst;
            var timeRemovelast;
            for(j=0; j < events.length; j++){
                for(k=0; k<14; k++){
                    if (moment((moment(events[j].start.dateTime).startOf('day')).toDate()).isSame(moment((moment(dates[k][0]).startOf('day')).toDate()))) { //problems with this line and maybe some others later
                        console.log("TESTING1");
                        //console.log(moment("09:25", "HH:mm").isBefore(moment(events[j].end.DateTime)));
                        if(moment("09:25", "HH:mm").isBefore(moment(events[j].end.DateTime)) && moment("17:30", "HH:mm").isAfter(moment(events[j].start.DateTime))){
                            console.log("TESTING2");
                            console.log(moment(dates[k][1][1]));
                            console.log(moment(events[j].start.DateTime));
                            console.log(moment(moment(events[j].start.DateTime).toDate()).isAfter(moment(dates[k][1][0])));
                            for(l=0; l<16; l++){
                                if (moment(events[j].start.DateTime).isAfter(moment(dates[k][1][l]))) {
                                    console.log("TESTING3");
                                   if (moment((moment(events[j].start.DateTime)).format("HH:mm")).isBefore(moment((moment(dates[k][1][l+1])).format("HH:mm")))) {
                                        timeRemovefirst = l;
                                        if(moment((moment(events[j].end.DateTime)).format("HH:mm")).isBefore(moment((moment(dates[k][1][l+1])).format("HH:mm")))) {
                                            delete dates[k][1][l];
                                        }else{
                                            for(m=2; m<(15-l) ;m++){
                                                if(moment((moment(events[j].end.DateTime)).format("HH:mm")).isBefore(moment((moment(dates[k][1][l+m])).format("HH:mm")))) {
                                                    timeRemovelast = l+m;
                                                    dates.splice([k][1][timeRemovefirst], timeRemovelast-timeRemovefirst);
                                                    for(n=timeRemovefirst; n<timeRemoveLast+1; n++){
                                                        delete dates[k][1][n];
                                                    }
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
            console.log(dates);*/

            $('#loading').hide();
            $('#form').show();

        });

    $('#submit').click(function (e) {
        e.preventDefault();
        var fields = ['FirstName', 'LastName', 'Company', 'Email', 'Phone', 'Referral', 'ReferralLength', 'Description', 'questionnaire'];
        var others = ['Referral', 'Preparer'];

        var body = {};
        var invalid = [];
        fields.forEach((field) => {
            var val = $('#' + field).val();
            val ? body[field] = val : invalid.push('#' + field);
        });
        others.forEach((other) => {
            var val = $('#' + other + 'Other').val();

            if ($('#' + other).val() === 'Other')
                (val) ?
                body[other + 'Other'] = val :
                invalid.push('#' + other + 'Other');
        });

        console.log(invalid);
        // add invalid handling here
        if (invalid.length) return 0; 

        $('#buttonStatus').text('Submitting...');
        $('#submitStatus').show();

        $.post(`http://${location.hostname}${port}/api/introduction/`, body)
            .done((res) => {
                $('#buttonStatus').text('Success!');
                $('#submitStatus').hide();
                $('#submit').toggleClass('btn-primary');
                $('#submit').toggleClass('btn-success');
                $('#submit').attr('disabled', true);
            })
            .fail((err) => {
                $('#buttonStatus').text('Internal Error.');
                $('#submitStatus').hide();
                $('#submit')
                    .toggleClass('btn-primary')
                    .toggleClass('btn-danger')
                    .attr('disabled', true)
                    .after(err.responseJSON.errors.map((error) => `<span>${error}</span>`).join('\n'));
                setTimeout(() => {
                    $('#submit')
                        .toggleClass('btn-danger')
                        .toggleClass('btn-primary')
                        .attr('disabled', false);
                    $('#buttonStatus')
                        .text('Submit');
                }, 2000);
            });

    });


});
