module.exports = (template) => {
    const subject = 'Future Zoom Meeting Information!';
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;;
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
        `A virtual meeting has been set up on zoom.us for ${template.time} on ${template.date}. <br>
        Your zoom meeting code is: ${template.code} <br>
        To join the meeting at the scheduled time, go to zoom.us and click "Join Meeting". Enter your meeting code and join the meeting!
        Make sure that youre camera and microphone are working.`
    ];

    console.log(messageParts);
    const message = messageParts.join('\n');

    const encodedMessage = Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

    return encodedMessage;
}