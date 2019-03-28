$(document).ready(() => {
    $('#Referral').change(function () {
        ($(this).val() === 'Other') ?
            $('#ReferralOther').show() :
            $('#ReferralOther').hide();
    })

});
