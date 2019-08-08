var User = require('mongoose').model('User');

var post = (req, res, next) => {
    console.log(req.body);
    var new_user = new User(req.body);
    new_user.provider = 'local';
    new_user.save()
        .then((user) => res.send({ messages: ['user successfully saved'] }))
        .catch((err) => res.status(500).send({ errors: ['error saving user', err] }));
}




module.exports = {
    post
}
