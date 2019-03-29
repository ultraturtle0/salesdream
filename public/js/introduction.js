$(document).ready(() => 
    ['Referral', 'Preparer'].forEach((item) =>
        $(`#${item}`).change(function () {
            ($(this).val() === 'Other') ?
                $(`#${item}Other`).show() :
                $(`#${item}Other`).hide();
        })
    )
);
