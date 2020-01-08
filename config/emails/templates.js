var referral = {
    subject: "Thank you for your referral!",
    body:
`Hi [[Referral]],

We've just spoken with [[FirstName]] [[LastName]] at [[Company]] regarding their bookkeeping needs, and would like to extend our gratitude for your referral. GSW Financial Partners values our business partnership and we look forward to returning the favor soon!

Best regards,
[[UserName]]
`
};

var tax_filing = {
    subject: "Request for tax filing documentation for [[Company]]",
    body: 
`Hi [[Preparer]] and [[FirstName]],

We are emailing on behalf of our mutual client [[FirstName]] [[LastName]] at [[Company]] to request their tax filing documentation for the years [TaxFilingBeginning] - [TaxFilingEnd]. [[FirstName]], please reply-all to this email to grant GSW Financial Partners permission to access these files from [[Preparer]].

Best regards,
[[UserName]]
`
};

module.exports = {
    referral,
    tax_filing
};
