var surveys = {}

var loadlist = ['newClient'] //, 'newHire'];

loadlist.forEach((survey) => surveys[survey] = require(`./${survey}`));

module.exports = surveys;
