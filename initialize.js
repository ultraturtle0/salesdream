// copies environment file to config/env folder with environment name

const fs = require('fs');
const path = require('path');

// fetch environment name from arguments
if (process.argv.length > 2) {
    envname = process.argv[2];
    envconfig = path.join(__dirname, `config/env/${envname}.js`);

    fs.access(envconfig, (err) => {
        let readStream = fs.createReadStream(path.join(__dirname, 'templates/env_config.js'));

        readStream.once('error', (err) => console.log(err));
        readStream.once('end', () => console.log(`${envname} env config template initialized`));

        readStream.pipe(fs.createWriteStream(envconfig));
    });
} else {
    console.error('Please specify an environment name (e.g. "-- deployment")');
}


