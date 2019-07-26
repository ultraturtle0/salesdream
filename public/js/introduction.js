var startEvent;
var endEvent;
//time slot button function
var buttonClick = function(id){
    $("#laterDate")[0].checked = false;
    $(`#selected`).empty();
    var dateName = id.split("_");
    var date = moment()
                .add(3, 'days')
                .add(dateName[4], 'days');

    $(`#selected`).append(`
        <br><b>Date-Time Selected:</b> ${dateName[2]}, ${date.format("MMMM D")} at ${moment(dateName[3], "HH:mm").format("h:mm A")}
    `);
    startEvent = date
                    .set('hour', moment(dateName[3], "HH:mm").format("HH"))
                    .set('minute', moment(dateName[3], "HH:mm").format("mm"))
                    .set('second', 0)
                    .format('YYYY-MM-DDTHH:mm:ssZ');
    /*endEvent = moment(startEvent)
                    .add(1, 'hours')
                    .format('YYYY-MM-DDTHH:mm:ssZ');
                    */
    $('#startEvent').val(startEvent);
};

$(document).ready(() => {
    window['moment-range'].extendMoment(moment);
    $("#carouselPrev").hide();
    $(`#incomplete`).hide();

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
    
    //get event information from google calendar
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
                                        $(`#week${index}_col${i}`).append(`
                                            <div style="font-style: italic;">${day}</div>
                                        `);
                                        $(`#week${index}_col${i}`).append(`
                                            ${moment().add(3, 'days').add(counter, 'days').format('MMMM D')}
                                        `);
                                    Object
                                        .keys(weeks[index][day])
                                        .forEach((slot, slotIndex) => {
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
                                                        padding:2px 2px"
                                                    ${(weeks[index][day][slot]) ? '' : 'disabled'} 
                                                    >${moment(slot, "HH:mm").format("h:mm A")}</button>
                                                `);
                                        });
                                };
                            });
                    };
                });

                $(`#carousel_week${weeksCounter*4}`).addClass("active");

                $('#loading').hide();
                $('#form').show();

            });
    };
    getFromGoogle();

    function carouselRot(dir) {
        var currentIndex = $('div.active').index();
        if (currentIndex + dir == 0){
            $("#carouselPrev").hide();
        } else {
            $("#carouselPrev").show();
        };
        if (currentIndex + dir == weeks.length){
            $("#carouselNext").hide();
        } else {
            $("#carouselNext").show();
        };
        if (currentIndex == weeks.length - 1){
            console.log("needs a get request from google");
            weeksCounter++;
            $(`#carouselBody`).empty();
            getFromGoogle();
            $("#carouselNext").show();
        };
    };

    $("#carouselNext").click((e) => carouselRot(1));
    $("#carouselPrev").click((e) => carouselRot(-1));

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
        var validation = true;
        $(`#incomplete`).hide();
        $(`#validation`).empty();

        var required = ['FirstName', 'LastName', 'Company', 'Email', 'Phone']
        var fields = ['Referral', 'ReferralLength', 'Description', 'questionnaire', 'startEvent'];
        var others = ['Referral', 'Preparer'];

        var requiredFields = [];
        var body = {};
        var invalid = [];

        required.forEach((field) => {
            var val = $('#' + field).val();
            if (val){
                body[field] = val;
            } else {
                invalid.push('#' + field);
            };
            requiredFields.push('#' + field);
        });
        fields.forEach((field) => {
            var val = $('#' + field).val();
            if (val) body[field] = val;
        });
        others.forEach((other) => {
            var val = $('#' + other + 'Other').val();
            if ($('#' + other).val() === 'Other')
                (val) ?
                body[other + 'Other'] = val :
                invalid.push('#' + other + 'Other');
        });

        body.laterDate = $('#laterDate').prop('checked');

        if (invalid.length) {
            validation = false;
            $(`#incomplete`).show();
            requiredFields.forEach((requiredField) => $(`${requiredField}Box`).css("color","black") );
            invalid.forEach((invalidField)=> $(`${invalidField}Box`).css("color","red") );
        };

        if ((!$(`#laterDate`)[0].prop('checked')) && !($('#startEvent').val())) { 
            validation = false;
            $(`#incomplete`).show();
            $(`#validation`).append(`
                <div style="color:red">Please pick a date and a time or select to pick one later</div>
            `);
        };

        if (!validation) return;
        $('#buttonStatus').text('Submitting...');
        $('#submitStatus').show();

        $.post(`http://${location.hostname}${port}/api/introduction/`, body)
            .done((res) => {
                $('#buttonStatus').text('Success!');
                $('#submitStatus').hide();
                $('#submit').toggleClass('btn-primary');
                $('#submit').toggleClass('btn-success');
                $('#submit').attr('disabled', true);
                console.log(res);
            })
            .fail((err) => {
                $('#buttonStatus').text('Internal Error.');
                $('#submitStatus').hide();
                $('#submit')
                    .toggleClass('btn-primary')
                    .toggleClass('btn-danger')
                    .attr('disabled', true)
                    .after(err.responseJSON.errors.map((error) => {
                        console.log(error);
                        return `<span>${error}</span>`;
                    }).join('\n'));
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
