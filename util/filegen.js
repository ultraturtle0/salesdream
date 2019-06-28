const { google } = require('googleapis');
const gauth = require('./google_token');

// creates folder, returns promise with google drive id
var mkdir = ({ auth, name, parents }) =>
    google.drive({ version: 'v3', auth })
        .files.create({
            resource: {
                name,
                'mimeType': 'application/vnd.google-apps.folder',
                parents: (parents || []).join(',')
            },
            fields: 'id'
        });

var mksheet = ({ auth, name, parents, range, values }) => {
    var sheets = google.sheets({ version: 'v4', auth });
    var drive = google.drive({ version: 'v3', auth });
    return sheets.spreadsheets.create({
        resource: {
            properties: {
                title: name
            }
        },
        fields: 'spreadsheetId'
    })
    .then((res) =>
        drive.files.get({ 
            fileId: res.data.spreadsheetId, 
            fields: 'id, parents'
        })
    )
    .then((res) => 
        drive.files.update({
            fileId: res.data.id,
            addParents: (parents || []).join(','),
            removeParents: res.data.parents,
            fields: 'id'
        })
        .then((file) =>
            sheets.spreadsheets.values.update({
                spreadsheetId: file.data.id,
                range,
                valueInputOption: 'USER_ENTERED',
                resource: { values }
            })
        )
    );
};
        

module.exports = {
    mkdir,
    mksheet
};

