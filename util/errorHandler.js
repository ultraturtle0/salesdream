module.exports = (options) => {
    var body = {
        errors: []
    };
    if (options.custom) {
        console.log(options.custom);
        body.errors.push(options.custom);
    };
    console.log(options.err);
    if (options.err) {
        console.log(options.err.response.data.errors);
        body.errors.push(options.err.response.data.errors.join('\n'));
    };

    return options.res.status(options.status || 500).send(body);
};

