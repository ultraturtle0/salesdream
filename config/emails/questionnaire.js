module.exports = (template) => {
    const subject = 'It was great chatting with you about your bookkeeping needs!';
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
    const messageParts = [
        // when full login system is implemented, use the name/email of the onboarding user
        'From: gswfp <gswfp@gswfinancialpartners.com>',
        `To: ${template.FirstName} ${template.LastName} <${template.Email}>`,
        'Content-Type: text/html; charset=utf-8',
        'MIME-Version: 1.0',
        `Subject: ${utf8Subject}`,
        '',
        `Hi ${template.FirstName},<br>` +
        '<br>' +
        `It was a pleasure chatting with you today about your bookkeeping needs! Here's a link to a brief questionnaire so we can get a better idea of your accounting situation: ` +
        template.link
    ];

    const message = messageParts.join('\n');

    const encodedMessage = Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

    return encodedMessage;
}
