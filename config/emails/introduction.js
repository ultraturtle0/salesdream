const moment = require('moment');

module.exports = (template) => {
    var q_text = [];

    q_text.push(`Thank you for contacting GSW Financial Partners to discuss your bookkeeping needs!`);

    if (template.questionnaire && template.date) {
        q_text.push(`Here's a link to a brief questionnaire so we can get a better idea of your accounting situation: ${template.link}.` +
        `We ask that you please answer all questions to the best of your ability and submit the survey by ${moment(template.date).format("MMMM Do")} (<b>48 hours</b> before your scheduled meeting).`);
        q_text.push(`A virtual meeting to discuss your bookkeeping has been set up on Zoom.us for ${template.time} on ${template.date}.`);
        q_text.push(`Please ensure that your camera and microphone are working properly and join us at the scheduled time at http://zoom.us/j/${template.code}`);

    } else if (template.questionnaire) {
        q_text.push(`Here's a link to a brief questionnaire so we can get a better idea of your accounting situation: ${template.link}. We'll reach out in the coming days to schedule a virtual meeting.`)

    } else {
        q_text.push(`A virtual meeting to discuss your bookkeeping has been set up on Zoom.us for ${template.time} on ${template.date}.`);
        q_text.push(`Please ensure that your camera and microphone are working properly and join us at the scheduled time at http://zoom.us/j/${template.code}`);
    }

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
        q_text.join('<br>')
    ];

    const message = messageParts.join('\n');

    const encodedMessage = Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

    return encodedMessage;
}
