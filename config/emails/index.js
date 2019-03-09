var emails = {}

var loadlist = ['background_check', 'hello_world'];

loadlist.forEach((email) => emails[email] = require(`./${email}`));

module.exports = emails;
