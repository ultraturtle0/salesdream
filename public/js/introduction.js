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
    var timeSlots = ["9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00"];

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
                console.log(start.format("HH:mm"));
                
                if (!dayNames.includes(which_day)) {
                    console.log(which_day);
                    return;
                };
                
                Object
                    .keys(weeks[which_week][which_day])
                    .forEach((slot) => {
                        var mslot = moment(slot, 'HH:mm');
                        var time = moment.range(mslot, mslot.add(30, 'minutes'))
                        console.log(time.diff('minutes'));
                        if (event_time.overlaps(time))
                            console.log('OVERLAP');//weeks[which_week][which_day][slot] = false;
                    });

                            
                /*var which_time = //start.isAfter(moment(Date.now()).//start.format('HH:mm')
                    
                    start.format('HH:mm')
                        .split(':')
                        .map((str) => parseInt(str))
                        */
                //weeks[which_week].push(event);
                //console.log(start.format('dddd'));
            });
            console.log(weeks);
        });

        /*
            weeks.forEach((week) => {
                console.log(week);
                Object
                    .keys(week)
                    .forEach((day) => {
                        var val = week[day];
                        if (!val.length) //check if empty
                            console.log(day + "NULL");
                            buttonTimes[day]

                    });
            });

/*            for (j=0; j<14; j++) { //loop for days
                var date = ((moment(currentDate).add(j, 'days')).startOf('day')).toDate();
                console.log("TESTING1" + date);
                for (k=0; k<events.length; k++){ //loops through events
                    event = moment(events[k].start.dateTime).startOf('day').toDate();
                    if (moment(date).isSame(moment(event), 'day')) { //checks if an event matches a day
                        emptyDay[j] ++; //counter for how many events on one day
                        console.log("IT WORKED");
                        timeSections[j] = []; //adds a new array for each event on a day
                        var differenceStart = (moment
                                                .duration(moment(events[k].start.dateTime)
                                                .diff(moment("9:30", "HH:mm"))))
                                                .asMinutes();
                        var differenceEnd = (moment
                                                .duration(moment(events[k].end.dateTime)
                                                .diff(moment("9:30", "HH:mm"))))
                                                .asMinutes();
                        /*if(differenceStart > 0){//checks to see if event starts before 9:30 am
                            if(emptyDay[j] == 1){ // if this is the first event of a day
                                console.log("TESTINGTESTING")
                                timeSections[j][0] = [moment("9:30", "HH:mm").format("HH:mm"), moment(events[k].start.dateTime)
                                                                                                            .format("HH:mm")];
                                console.log(timeSections);
                                console.log(timeSections[j]);
                                console.log(timeSections[2]);
                                console.log(timeSections[2][0][0]);
                            };
                            if (emptyDay[j] > 1){ //if this is any event other than the first event of the day
                                var diff = (moment
                                                .duration(moment(events[k-1].end.dateTime)
                                                .diff(moment(events[k].start.dateTime))))
                                                .asMinutes();
                                if(diff > 0){
                                    console.log("TESTINGTESTINGTESTING")
                                    //timeSections[j][emptyDay[j]-1] = [moment(events[k-1].end.dateTime)).format("HH:mm"), moment(events[k].start.dateTime).format("HH:mm")];
                                    timeSections[j][emptyDay[j]-1] = [((moment(events[k-1].end.dateTime))
                                                                            .format("HH:mm")), "17:30"];
                                    console.log(timeSections[j]);
                                    console.log(timeSections[j][0][0]);
                                };
                            };
                        }/*if(differenceEnd > 0){
                            if(emptyDay[j] = 1){
                                var startTime = moment(events[k].start.dateTime).format("HH:mm");
                            }else if(emptyDay[j] = 2){
                                timeSections[j][emptyDay[j]-2] = new Array (startTime, moment(events[k].start.dateTime).format("HH:mm"));
                            }else{
                                var diff = (moment.duration((events[k-1].end.dateTime).diff(events[k].start.dateTime))).asMinutes();
                                if(diff > 0){
                                    timeSections[j][emptyDay[j]-2] = new Array ((moment(events[k-1].end.dateTime)).format("HH:mm"), moment(events[k].start.dateTime).format("HH:mm"));
                                };
                            };

                        };
                    };
                };
                if(emptyDay[j] == 0) { // if event counter is 0, then no events, so all time slots are free
                    timeSections[j] = [];
                    timeSections[j][0] = ["10:00", "17:30"];
                    console.log("time section added for index" + j);
                };
            };*/

            /*for (j=0; j<14; j++) { //loop for days
                var date = ((moment(currentDate).add(j, 'days')).startOf('day')).toDate();
                console.log("TESTING1" + date);
                for (k=0; k<events.length; k++){ //loops through events
                    timeSections[j] = [];
                    timeSections[j][0] = ["10:00", "16:00"];
                    console.log("time section added for index" + j);
                    event = moment(events[k].start.dateTime).startOf('day').toDate();
                    if (moment(date).isSame(moment(event), 'day')) { //checks if an event matches a day
                        
                    };
                };
            }; 
            console.log(timeSections);

            for (l=0; l<14; l++) { //creates time sections for the buttons to be created
                for(m=0; m<timeSections[l].length; m++){
                    //console.log(moment(timeSections[2][0][0], "HH:mm"));
                    var sectionStart = moment(timeSections[l][m][0], "HH:mm");
                    var sectionEnd = moment(timeSections[l][m][1], "HH:mm");
                    console.log(sectionStart);
                    console.log(sectionEnd);
                    var difference = (moment
                                        .duration((sectionEnd)
                                        .diff(sectionStart)))
                                        .asMinutes();
                    console.log(difference);
                    difference = difference - (difference % 60);
                    console.log(difference);
                    sectionNumber = difference / 60;
                    console.log(sectionNumber);
                    buttonSections[l] = [];
                    for (n=0; n<sectionNumber; n++){
                        buttonSections[l][n] = [];
                        buttonSections[l][n][0]= (moment(sectionStart)
                                                    .add((60*n), 'minutes'))
                                                    .format("h:mm A");
                        console.log(buttonSections[l][n][0]);
                        buttonSections[l][n][1]= (moment(sectionStart)
                                                    .add((60*n), 'minutes'))
                                                    .format("HH:mm");
                        console.log(buttonSections[l][n][1]);

                    };
                };
            };

            for (i=0; i<14; i++) { //adds buttons to the HTML file
                if(moment(moment(firstWeekDate).add(i, 'days')).weekday() == 6) {
                    i++;
                }if(moment(moment(firstWeekDate).add(i, 'days')).weekday() == 0) {
                    i++;
                }else{
                    $(`#col${i}Week`).append(`
                        ${(moment(firstWeekDate).add(i, 'days')).format('dddd')}
                    `);
                    $(`#col${i}Date`).append(`
                        ${(moment(firstWeekDate).add(i, 'days')).format('MMMM D')}
                    `);
                    for(h=0; h<buttonSections[i].length; h++){
                        $(`#col${i}Date`).append(`
                        <br><button type="button" id="${buttonSections[i][h][1]}" class="btn btn-sm" style="background-color:#572e5e;color:#ffffff;width:80px">${buttonSections[i][h][0]}</button>
                        `);
                    };
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
    */


});
