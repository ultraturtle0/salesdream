const { google } = require('googleapis');

// creates folder, returns promise with google drive id

var ls = ({ auth, id }) =>
    google.drive({ version: 'v3', auth })
        .files.list({
            q: `('${id}' in parents)`,
            fields: 'files(id, name)'
        });

var mv = ({ auth, id, addParents, removeParents }) =>
    google.drive({ version: 'v3', auth })
        .files.update({
            fileId: id,
            addParents: (addParents ? addParents.join(',') : []),
            removeParents: (removeParents ? removeParents.join(',') : []),
            fields: 'id'
        });


var mkdir = ({ auth, name, parents }) => {
    return google.drive({ version: 'v3', auth })
        .files.create({
            resource: {
                name,
                'mimeType': 'application/vnd.google-apps.folder',
                parents
            },
            fields: 'id'
        });
};

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
    .then((res) => {
        console.log('PARENTS');
        console.log(res.data.parents);
        console.log(parents);
        return drive.files.update({
            fileId: res.data.id,
            addParents: (parents || []).join(','),
            removeParents: res.data.parents,
            fields: 'id'
        })
        .then((file) => {
            sheets.spreadsheets.values.update({
                spreadsheetId: file.data.id,
                range,
                valueInputOption: 'USER_ENTERED',
                resource: { values }
            });
            return new Promise((r, rej) => {
                sheets.spreadsheets.values.update({
                    spreadsheetId: file.data.id,
                    range,
                    valueInputOption: 'USER_ENTERED',
                    resource: { values }
                })
                .then((sheet) => {
                    sheet.data.id = sheet.data.spreadsheetId;
                    sheet.data.parents = parents;
                    r(sheet)
                })
                .catch((err) => rej(err));
            })
        })
    });
};
        

module.exports = {
    mv,
    ls,
    mkdir,
    mksheet
};

