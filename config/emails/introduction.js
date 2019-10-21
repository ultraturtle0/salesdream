const moment = require('moment');

module.exports = (template) => {
    var q_text = [];

    q_text.push(`<html style="background-color: #572e5e">
                <body style="margin-left: 100px; margin-right: 100px; padding: 30px 30px 30px 30px; background-color: #e3e2e7;">
                <div style="font-size: 18px">`);
    q_text.push(`<img src="http://138.197.20.29:9600/assets/header.png" alt="header" class="responsive" style="width:100%;height:auto;"><br><br>`);
    q_text.push(`Thank you for contacting GSW Financial Partners to discuss your bookkeeping needs!<br>`);

    var questionnaire = [
        `Here's a link to a questionnaire that is designed to give us a better idea of the current status of your accounting:<br><br>`,
        `<div style="width:100%;padding:5px;text-align:center;background-color:#572e5e; border-radius:8px">
            <a href="${template.link}" style="text-decoration:none;color:#000;display:block;width:100%;font-size:12px" target="_blank">
                <div style="font-size:18px; color:#fff">Questionnaire</div>
            </a>
        </div>`,
        `Please note, none of these questions are mandatory.`,
        `We ask that you submit the survey by <b>${template.dateQuestionnaire}.</b><hr>`
    ];

    var meeting = [
        `We have set up a virtual meeting to discuss your bookkeeping needs on Zoom.us for <b>${template.time}</b> on <b>${template.date}</b>.`,
        `Zoom allows us to discuss and share screens so that every party in the call may see what is being discussed. ` +
        `We are very likely to ask to view your current accounting software. For this reason, please ensure that your camera and microphone are working properly.`,
        `At the scheduled time, click below to join us on Zoom.`,
        `<div style="width:100%;padding:5px;text-align:center;background-color:#572e5e; border-radius:8px">
            <a href="http://zoom.us/j/${template.code}" style="text-decoration:none;color:#000;display:block;width:100%;font-size:12px" target="_blank">
                <div style="font-size:18px; color:#fff">Join Zoom Call</div>
            </a>
        </div>`
    ];

    if (template.questionnaire && template.date) {
        q_text = q_text.concat(questionnaire.concat(meeting));
    } else if (template.questionnaire) {
        q_text = q_text.concat(questionnaire);
    } else {
        q_text = q_text.concat(meeting);
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
    console.log(message);

    const encodedMessage = Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

    return encodedMessage;
}
