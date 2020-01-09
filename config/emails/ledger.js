module.exports = (template) => {
    const subject = 'Please update your accounting information for us.';
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
    const messageParts = [
        // when full login system is implemented, use the name/email of the onboarding user
        'From: gswfp <gswfp@gswfinancialpartners.com>',
        `To: ${template.FirstName} ${template.LastName} <${template.Email}>`,
        'Content-Type: text/html; charset=utf-8',
        'MIME-Version: 1.0',
        `Subject: ${utf8Subject}`,
        '',
        `<html style="background-color: #572e5e">
                        <body style="margin-left: 100px; margin-right: 100px; padding: 30px 30px 30px 30px; background-color: #e3e2e7;">
                        <div style="font-size: 18px">`,
        `<img src="http://138.197.20.29:9600/assets/header.png" alt="header" class="responsive" style="width:100%;height:auto;"><br><br>`,
        `Hi ${template.FirstName},<br>` +
        '<br>' +
        `<p>Please complete a brief assessment of your existing bank and credit card accounts for our bookkeeping team, found at the link below. </p><br><br>` +
        `<div style="width:100%;padding:5px;text-align:center;background-color:#572e5e; border-radius:8px">
            <a href="${template.link}" style="text-decoration:none;color:#000;display:block;width:100%;font-size:12px" target="_blank">
                <div style="font-size:18px; color:#fff">Accounts Schedule</div>
            </a>
        </div>`
    ];

    const message = messageParts.join('\n');

    const encodedMessage = Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

    return encodedMessage;
}
