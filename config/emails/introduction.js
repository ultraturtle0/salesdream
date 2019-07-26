const moment = require('moment');

module.exports = (template) => {
    var q_text = [];

    q_text.push(`<html style="background-color: #572e5e">
                <body style="margin-left: 100px; margin-right: 100px; padding: 30px 30px 30px 30px; background-color: #e3e2e7; min-height: 800px">
                <div style="font-size: 18px">`);
    q_text.push(`Thank you for contacting GSW Financial Partners to discuss your bookkeeping needs!`);

    if (template.questionnaire && template.date) {
        q_text.push(`Here's a link to a brief questionnaire so we can get a better idea of your accounting situation: ${template.link}.<br><br>`);
        q_text.push(`<button onclick="window.location.href = '${template.link}';" style="background-color: #572e5e; color:#fff; border-radius: 8px; width:100%">Questionnaire</button><br><br>`);
        q_text.push(`We ask that you please answer all questions to the best of your ability and submit the survey by <b>${moment(template.date).format("MMMM Do")}</b> <br>(<b>48 hours</b> before your scheduled meeting).<br><hr>`);
        q_text.push(`A virtual meeting to discuss your bookkeeping has been set up on Zoom.us for <b>${template.time}</b> on <b>${template.date}</b>.`);
        q_text.push(`Please ensure that your camera and microphone are working properly and at the scheduled time, click below to join us.<br><br>`);
        q_text.push(`<button onclick="window.location.href = 'http://zoom.us/j/${template.code}';" style="background-color: #572e5e; color:#fff; border-radius: 8px; width:100%">Join Zoom Call</button>`);

    } else if (template.questionnaire) {
        q_text.push(`Here's a link to a brief questionnaire so we can get a better idea of your accounting situation: ${template.link}. We'll reach out in the coming days to schedule a virtual meeting.`)

    } else {
        q_text.push(`A virtual meeting to discuss your bookkeeping has been set up on Zoom.us for ${template.time} on ${template.date}.`);
        q_text.push(`Please ensure that your camera and microphone are working properly and join us at the scheduled time at http://zoom.us/j/${template.code}`);
    }

    q_text.push(`</div>
                </body>
                </html>`);

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
