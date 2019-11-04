module.exports = (template) => {
    const { firstName, lastName, email, username } = template.user;
    const subject = `Hello ${firstName}!`;
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
    const messageParts = [
        'From: GSWFP <gswfp@gswfinancialpartners.com>',
        `To: ${[firstName, lastName].join(' ')} <${email}>`,
        'Content-Type: text/html; charset=utf-8',
        'MIME-Version: 1.0',
        `Subject: ${utf8Subject}`,
        '',
        '<html><body>',
        '<p>Here is your new login for GSW Financial Partners:</p>',
        '<br>',
        `<p>Username: <strong>${username}</strong></p>`,
        `<p>Temporary password: <strong>${template.pwd}</strong></p>`,
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
