var { batch_mkdir, mkdir, mksheet } = require('./filegen.js');
const gauth = require('./google_token');

const config = require('../config/config').g_drive.folders.client_files;
var values = Array(1, 2, 3).map((_) => Array(1, 2, 3, 4, 5));

gauth('ledger-generator', 'gswfp@gswfinancialpartners.com')
    .then((auth) => 
        batch_mkdir({ auth, names: ['batch1', 'batch2'], parents: [config] })
            .then((files) => console.log(files))
    )

        /*mkdir({ auth, name: 'testing new util script', parents: [] })
            .then((file) => {
                console.log(file);
                return mksheet({ auth, name: 'tester sheet', parents: [file.data.id], range: `Sheet1!1:3`, values })
            })
    )*/
    .catch((err) => console.log(err));
    
