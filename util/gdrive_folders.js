const { google } = require('googleapis');
const gauth = require('./google_token');

gauth('gswfp@gswfinancialpartners.com')
    .then((auth) => {
        const drive = google.drive({
            version: 'v3',
            auth
        });

        const params = {
            pageSize: 10,
            fields: 'nextPageToken, files(id, name)',
            q: "name='Client Files'"
        }

        drive.files.list(params, (err, res) => {
            if (err) console.log(err);
            console.log(res.data.files);
        });
    });
