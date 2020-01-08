var referral = {
    subject: "Thank you for your referral!",
    body:
`Hi [[ReferralName]],

We've just spoken with [[FirstName]] [[LastName]] at [[CompanyName]] regarding their bookkeeping needs, and would like to extend our gratitude for your referral. GSW Financial Partners values our business partnership and we look forward to returning the favor soon!

Best regards,
[[UserName]]
`
};

var tax_filing = {
    subject: "Request for tax filing documentation for [[Company]]",
    body: 
`Hi [[PreparerName]] and [[FirstName]],

We are emailing on behalf of our mutual client [[FirstName]] [[LastName]] at [[CompanyName]] to request their tax filing documentation for the years [[TaxFilingBeginning]] - [[TaxFilingEnd]]. [[FirstName]], please reply-all to this email to grant GSW Financial Partners permission to access these files from [[PreparerName]].

Best regards,
[[UserName]]
`
};

module.exports = {
    referral,
    tax_filing
};
