var startEventDateTime;
var endEventDateTime;
var buttonClick = function(id){
    $("#laterDate")[0].checked = false;
    $(`#selected`).empty();
    console.log("CLICKED");
    console.log(id);
    var dateName = id.split("_");
    console.log(dateName);
    var weekNumber = dateName[1];
    var dayName = dateName[2];
    var timeNumber = dateName[3];
    var dayNumber = dateName[4];
    var date = moment()
                .add(3, 'days')
                .add(dayNumber, 'days');

    $(`#selected`).append(`
        <br><b>Date-Time Selected:</b> ${dayName}, ${date.format("MMMM D")} at ${moment(timeNumber, "HH:mm").format("h:mm A")}
    `);
    startEventDateTime = date
                            .set('hour', moment(timeNumber, "HH:mm").format("HH"))
                            .set('minute', moment(timeNumber, "HH:mm").format("mm"))
                            .set('second', 0)
                            .format('YYYY-MM-DDTHH:mm:ssZ');
    endEventDateTime = moment(startEventDateTime)
                            .add(1, 'hours')
                            .format('YYYY-MM-DDTHH:mm:ssZ');
};

$(document).ready(() => {
    window['moment-range'].extendMoment(moment);
    $("#carouselPrev").hide();

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
    var dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    var timeSlots = ["9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"];

    var events = [];
    var weeks = [];
    var weeksStartDate = [];
    var weeksCounter = 0;
    
    var weekDateGetFunction = function(counter) {
        return moment()
                        .add(3, 'days')
                        .add(counter*4, 'weeks')
                        .startOf('day')
                        .toDate();
    };

    var getFromGoogle = function() {
        $.get(`http://${location.hostname}${port}/api/scheduling/`, {startDate: weekDateGetFunction(weeksCounter)})
            .done((data) => {
                console.log(data);
                $('#loading').hide();
                $('#introForm').show();
                firstWeekDate = data.currentDate;
                numberOfWeeks = data.numberOfWeeks;
                if(data.data){
                    data.data.forEach((data) => {
                    events.push(data);
                    });
                };

                for(i=0; i<numberOfWeeks; i++){
                    weeks.push({});
                    weeksStartDate.push(moment(firstWeekDate)
                                            .add(i+1, 'weeks')
                                            .toDate());
                };
                weeks.map((week) => {
                    dayNames.forEach((name) => {
                        var times = {}
                        timeSlots.forEach((slot) => times[slot] = true);
                        week[name] = times;
                    });
                });

                // split between two weeks
                events.forEach((event) => {
                    if (event.location) {
                        var start = moment(event.start.dateTime).subtract(event.travelTime, 'minutes');
                        var end = moment(event.end.dateTime).add(event.travelTime, 'minutes');
                    } else{
                        var start = moment(event.start.dateTime);
                        var end = moment(event.end.dateTime);
                    };

                    var which_week;
                    for(i=0; i<weeks.length; i++){
                        if(start.isBefore(weeksStartDate[0])){
                            which_week = 0;
                        } else if (start.isAfter(weeksStartDate[i])){
                            which_week = i+1;
                        };
                    };

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

                console.log(weeks);

                var counter = -1;
                weeks.forEach((week, index) => {
                    console.log(index);
                    if (index == 0){
                        $(`#carouselBody`).append(`
                            <div class="carousel-item" id="carousel_week${index}">
                                <div class="row" align="center">
                                    <div class="col-1"></div>
                                    <div class="col" id="week${index}_col0"></div>
                                    <div class="col" id="week${index}_col1"></div>
                                    <div class="col" id="week${index}_col2"></div>
                                    <div class="col" id="week${index}_col3"></div>
                                    <div class="col" id="week${index}_col4"></div>
                                    <div class="col-1"></div>
                                </div>
                            </div>
                        `);
                    } else {
                        $(`#carouselBody`).append(`
                            <div class="carousel-item" id="carousel_week${index}">
                                <div class="row" align="center">
                                    <div class="col-1"></div>
                                    <div class="col" id="week${index}_col0"></div>
                                    <div class="col" id="week${index}_col1"></div>
                                    <div class="col" id="week${index}_col2"></div>
                                    <div class="col" id="week${index}_col3"></div>
                                    <div class="col" id="week${index}_col4"></div>
                                    <div class="col-1"></div>
                                </div>
                            </div>
                        `);
                    };
                    for(i=0; i<5; i++){
                        counter ++;
                        var dayStart = moment()
                                            .add(3, 'days')
                                            .add(counter, 'days').format('dddd');
                        
                        if (dayStart == "Saturday"){
                            dayStart = moment(dayStart, 'dddd').add(2, 'days').format('dddd');
                            counter += 2;
                        };
                        if (dayStart == "Sunday"){
                            dayStart = moment(dayStart, 'dddd').add(1, 'days').format('dddd');
                            counter += 1;
                        };
                        
                        Object
                            .keys(weeks[index])
                            .forEach((day) => {
                                if (dayStart == day) {
                                        console.log(day);
                                        $(`#week${index}_col${i}`).append(`
                                            <div style="font-style: italic;">${day}</div>
                                        `);
                                        $(`#week${index}_col${i}`).append(`
                                            ${moment().add(3, 'days').add(counter, 'days').format('MMMM D')}
                                        `);
                                    Object
                                        .keys(weeks[index][day])
                                        .forEach((slot, slotIndex) => {
                                            //if(slotIndex%2 == 0){
                                                $(`#week${index}_col${i}`).append(`
                                                    ${(slotIndex % 2 == 0) ? '<br>' : ''}
                                                    <button 
                                                        onclick="buttonClick(this.id)"
                                                        type="button"
                                                        id="week_${index}_${day}_${slot}_${counter}"
                                                        class="btn timeButton"
                                                        style="
                                                            background-color:#572e5e;
                                                            color:#ffffff;
                                                            width:70px;
                                                            font-size:13px;
                                                            padding:2px 2px
                                                        "
                                                        ${(weeks[index][day][slot]) ? '' : 'disabled'} 
                                                            >${moment(slot, "HH:mm").format("h:mm A")}</button>
                                                    `);


                                                if (weeks[index][day][slot] == true){
                                                    $(`#week${index}_col${i}`).append(`
                                                        <br><button onclick="buttonClick(this.id)" type="button" id="week_${index}_${day}_${slot}_${counter}" class="btn timeButton" style="background-color:#572e5e;color:#ffffff;width:70px;font-size:13px;padding:2px 2px">${moment(slot, "HH:mm").format("h:mm A")}</button>
                                                    `);
                                                } else {
                                                    $(`#week${index}_col${i}`).append(`
                                                        <br><button onclick="buttonClick(this.id)" type="button" id="week_${index}_${day}_${slot}_${counter}" class="btn timeButton" style="background-color:#572e5e;color:#ffffff;width:70px;font-size:13px;padding:2px 2px" disabled>${moment(slot, "HH:mm").format("h:mm A")}</button>
                                                    `);
                                                };
                                            } else {
                                                if (weeks[index][day][slot] == true){
                                                    $(`#week${index}_col${i}`).append(`
                                                        <button onclick="buttonClick(this.id)" type="button" id="week_${index}_${day}_${slot}_${counter}" class="btn timeButton" style="background-color:#572e5e;color:#ffffff;width:70px;font-size:13px;padding:2px 2px">${moment(slot, "HH:mm").format("h:mm A")}</button>
                                                    `);
                                                } else {
                                                    $(`#week${index}_col${i}`).append(`
                                                        <button onclick="buttonClick(this.id)" type="button" id="week_${index}_${day}_${slot}_${counter}" class="btn timeButton" style="background-color:#572e5e;color:#ffffff;width:70px;font-size:13px;padding:2px 2px" disabled>${moment(slot, "HH:mm").format("h:mm A")}</button>
                                                    `);
                                                };

                                            };

                                        });
                                };
                            });
                    };
                });

                /*$(`#carouselBody`).append(`
                    <div class="carousel-item" id="carousel_loading">
                        <div class="row" align="center">
                            <div class="col" style="height: 259px">
                                <br><br><br>
                                <div class="text-center" id="loadingGoogle">
                                    <span class="spinner-border" role="status"></span>
                                    <span>Loading from Google Calendar...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `);*/

                $(`#carousel_week${weeksCounter*4}`).addClass("active");

                $('#loading').hide();
                $('#form').show();

            });
    };
    getFromGoogle();

    $("#carouselNext").click(function(e) {
        var slideAmount = weeks.length;
        console.log("Slide Amount" +slideAmount);
        var currentIndex = $('div.active').index();
        console.log(currentIndex);
        if (currentIndex+1 == 0){
            $("#carouselPrev").hide();
        } else {
            $("#carouselPrev").show();
        };
        if (currentIndex+1 == slideAmount){
            $("#carouselNext").hide();
        } else {
            $("#carouselNext").show();
        };
        if (currentIndex == slideAmount-1){
            console.log("needs a get request from google");
            weeksCounter++;
            $(`#carouselBody`).empty();
            getFromGoogle();
            $("#carouselNext").show();
        };

    });
        $("#carouselPrev").click(function(e) {
        var slideAmount = weeks.length;
        console.log("Slide Amount" +slideAmount);
        var currentIndex = $('div.active').index();
        console.log(currentIndex);
        if (currentIndex-1 == 0){
            $("#carouselPrev").hide();
        } else {
            $("#carouselPrev").show();
        };
        if (currentIndex-1 == slideAmount){
            $("#carouselNext").hide();
        } else {
            $("#carouselNext").show();
        };

    });

    $("#laterDate").change(function(e) {
        if($("#laterDate")[0].checked == false){
            $(`#selected`).empty();
        } else {
            $(`#selected`).empty();
            $(`#selected`).append(`
                <br><b>Date-Time Selected:</b> date and time will be chosen at a later date. 
            `);

        };
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
    $('#submitCalendar').click(function (e) {
        e.preventDefault();
        if ($(`#laterDate`)[0].checked == true) {
            console.log("Later Date");
        } else {
            var googleParameters = {
                startEvent: startEventDateTime, 
                endEvent: endEventDateTime,
                firstName: $("#FirstName").val(),
                lastName: $("#LastName").val(),
                emailAddress: $("#Email").val(),
                description: $("#Description").val()
            };
            var zoomParameters = {startEvent: startEventDateTime, duration: 60};
            console.log(googleParameters);
            console.log(zoomParameters);

            $.post(`http://${location.hostname}${port}/api/scheduling/`, {data: googleParameters, zoomParameters})
                .done((res) => {
                    console.log("Success!");
                    console.log(res);
                })
                .fail((err) => {
                    console.log("error");
                    console.log(err);
                });
        };

    });


});
