module.exports = (template) => {
    const subject = 'hello world';
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
    const messageParts = [
        'From: Jordan Kusel <jordan@gswfinancialpartners.com>',
        'To: Jordan Kusel <jordan@gswfinancialpartners.com>',
        'Content-Type: text/html; charset=utf-8',
        'MIME-Version: 1.0',
        `Subject: ${utf8Subject}`,
        '',
        'This is a message just to say hello.',
        'So... <b>Hello!</b>',
    ];

    const message = messageParts.join('\n');

    const encodedMessage = Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

    return encodedMessage;
}
