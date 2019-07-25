module.exports = (template) => {
    const subject = 'Hello Gabriella!';
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
    const messageParts = [
        'From: Jordan Kusel <jordan@gswfinancialpartners.com>',
        'To: Gabriella Sande Waterman <jordan@gswfinancialpartners.com>',
        'Content-Type: text/html; charset=utf-8',
        'MIME-Version: 1.0',
        `Subject: ${utf8Subject}`,
        '',
        '<html><body>',
        '<p>I\'m sending this message automatically from the Gmail API! This will let us easily automate frequently sent</p><h1> emails!</h1>',
        '</body></html>'
    ];

    const message = messageParts.join('\n');

    const encodedMessage = Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

    return encodedMessage;
}
