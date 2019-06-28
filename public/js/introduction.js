$(document).ready(() => {
    window['moment-range'].extendMoment(moment);

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
    

    var firstWeekDate;
    var secondWeekDate;
    var events;
    var dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    var timeSlots = ["9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"];

    var weeks = [{}, {}].map((week) => {
        dayNames.forEach((name) => {
            var times = {}
            timeSlots.forEach((slot) => times[slot] = true);
            week[name] = times;
        });
        return week;
    });

    console.log(weeks);

        

    $.get(`http://${location.hostname}${port}/api/scheduling/`)
        .done((data) => {
            console.log(data);
            $('#loading').hide();
            $('#introForm').show();
            firstWeekDate = data.currentDate;
            secondWeekDate = moment(firstWeekDate)
                                .add(7, 'days')
                                .toDate();
            events = data.data;

            // split between two weeks
            events.forEach((event) => {
                var start = moment(event.start.dateTime);
                var end = moment(event.end.dateTime);
                var which_week = start.isAfter(secondWeekDate) ? 1 : 0;
                var which_day = start.format('dddd');
                var event_time = moment.range(start, end);
                
                if (!dayNames.includes(which_day)) 
                    return;
                
                Object
                    .keys(weeks[which_week][which_day])
                    .forEach((slot) => {
                        var [hr, min] = slot.split(':').map((str) => parseInt(str));
                        var mslot = start.clone();
                        mslot
                            .hour(hr)
                            .minute(min);
                        var mslot_end = moment(mslot).add(60, 'minutes');
                        var time = moment.range(mslot, mslot_end);
                        if (event_time.overlaps(time)){
                            weeks[which_week][which_day][slot] = false;
                        };
                    });
                });


            var counter = -1;

            for(weekIndex=0; weekIndex <2; weekIndex++) {
                for(i=0; i<5; i++){
                    if (weekIndex == 0){
                        var j = i;
                    };
                    if (weekIndex == 1){
                        var j = i + 5;
                    };
                    console.log("JAYYYYYYYYYYsafjhdfhaldfadf" + j);
                    counter ++;
                    var dayStart = moment(firstWeekDate).add(counter, 'days').format('dddd');
                    
                    if (dayStart == "Saturday"){
                        dayStart = moment(dayStart, 'dddd').add(2, 'days').format('dddd');
                        counter += 2;
                    };
                    if (dayStart == "Sunday"){
                        dayStart = moment(dayStart, 'dddd').add(1, 'days').format('dddd');
                        counter += 1;
                    };
                    
                    Object
                        .keys(weeks[weekIndex])
                        .forEach((day) => {
                            if (dayStart == day){
                                console.log("DAY" +day);
                                console.log("DAYSTART" +dayStart);
                                $(`#col${j}Week`).append(`
                                    ${day}
                                `);
                                $(`#col${j}Date`).append(`
                                    ${(moment(firstWeekDate).add(counter, 'days')).format('MMMM D')}
                                `);
                                Object
                                    .keys(weeks[weekIndex][day])
                                    .forEach((slot, index) => {
                                        if (index%2 == 0){
                                            if(weeks[weekIndex][day][slot] == true){
                                                $(`#col${j}Date`).append(`
                                                    <br><button type="button" id="week1${day}${slot}" class="btn btn-sm" style="background-color:#572e5e;color:#ffffff;width:85px">${moment(slot, 'HH:mm').format('hh:mm A')}</button>
                                                `);
                                            } else {
                                                $(`#col${j}Date`).append(`
                                                    <br><button type="button" id="week1${day}${slot}" class="btn btn-sm" style="background-color:#572e5e;color:#ffffff;width:85px" disabled>${moment(slot, 'HH:mm').format('hh:mm A')}</button>
                                                `);
                                            };
                                        } else {
                                            if(weeks[weekIndex][day][slot] == true){
                                                $(`#col${j}Date`).append(`
                                                    <button type="button" id="week1${day}${slot}" class="btn btn-sm" style="background-color:#572e5e;color:#ffffff;width:85px">${moment(slot, 'HH:mm').format('hh:mm A')}</button>
                                                `);
                                            } else {
                                                $(`#col${j}Date`).append(`
                                                    <button type="button" id="week1${day}${slot}" class="btn btn-sm" style="background-color:#572e5e;color:#ffffff;width:85px" disabled>${moment(slot, 'HH:mm').format('hh:mm A')}</button>
                                                `);
                                            };
                                        };

                                    });
                            };
                        });
                };
            };

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
