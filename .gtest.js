const { google } = require('googleapis');
const config = require('./config/config');

const calendar = google.calendar('v3');
calendar.calendarList.list({
    key: config.g_calendar.installed.project_id,
    auth: config.g_calendar.api_key,
    //calendarId: 'primary',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const events = res.data.items;
    if (events.length) {
      console.log('Upcoming 10 events:');
      events.map((event, i) => {
        const start = event.start.dateTime || event.start.date;
        console.log(`${start} - ${event.summary}`);
      });
    } else {
      console.log('No upcoming events found.');
    }
  });

