"use strict";

const element = document.getElementById('modal_add_product');
const form = element.querySelector('#add_product_form');
const modal = new bootstrap.Modal(element);
const submitButton = element.querySelector('[data-kt-users-modal-action="submit"]');

var validator = FormValidation.formValidation(
    form,
    {
        fields: {
            'product_name': {
                validators: {
                    notEmpty: {
                        message: 'Nama Produk Tidak Boleh Kosong'
                    }
                }
            },
            'sku_id': {
                validators: {
                    notEmpty: {
                        message: 'SKU tidak boleh kosong'
                    }
                }
            },
        },

        plugins: {
            trigger: new FormValidation.plugins.Trigger(),
            bootstrap: new FormValidation.plugins.Bootstrap5({
                rowSelector: '.fv-row',
                eleInvalidClass: '',
                eleValidClass: ''
            })
        }
    }
).on('core.form.valid', function () {

    submitButton.setAttribute('data-kt-indicator', 'on');

    // Disable button to avoid multiple click 
    submitButton.disabled = true;
    setTimeout(function () {
        // Remove loading indication
        submitButton.removeAttribute('data-kt-indicator');

        // Enable button
        submitButton.disabled = false;

        // Show popup confirmation 
        Swal.fire({
            text: "Form has been successfully submitted!",
            icon: "success",
            buttonsStyling: false,
            confirmButtonText: "Ok, got it!",
            customClass: {
                confirmButton: "btn btn-primary"
            }
        }).then(function (result) {
            if (result.isConfirmed) {
                modal.hide();
            }
        });

        //form.submit(); // Submit form
    }, 2000);

});


submitButton.addEventListener('click', e => {
    e.preventDefault();

    // Validate form before submit
    validator.validate();
});




// Class definition
var KTUsersAddUser = function () {
    // Shared variables


    // Init add schedule modal
    var initAddUser = () => {

        // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/


        // Submit button handler


        // Cancel button handler
        const cancelButton = element.querySelector('[data-kt-users-modal-action="cancel"]');
        cancelButton.addEventListener('click', e => {
            e.preventDefault();

            Swal.fire({
                text: "Are you sure you would like to cancel?",
                icon: "warning",
                showCancelButton: true,
                buttonsStyling: false,
                confirmButtonText: "Yes, cancel it!",
                cancelButtonText: "No, return",
                customClass: {
                    confirmButton: "btn btn-primary",
                    cancelButton: "btn btn-active-light"
                }
            }).then(function (result) {
                if (result.value) {
                    form.reset(); // Reset form			
                    modal.hide();
                } else if (result.dismiss === 'cancel') {
                    Swal.fire({
                        text: "Your form has not been cancelled!.",
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it!",
                        customClass: {
                            confirmButton: "btn btn-primary",
                        }
                    });
                }
            });
        });

        // Close button handler
        const closeButton = element.querySelector('[data-kt-users-modal-action="close"]');
        closeButton.addEventListener('click', e => {
            e.preventDefault();

            Swal.fire({
                text: "Are you sure you would like to cancel?",
                icon: "warning",
                showCancelButton: true,
                buttonsStyling: false,
                confirmButtonText: "Yes, cancel it!",
                cancelButtonText: "No, return",
                customClass: {
                    confirmButton: "btn btn-primary",
                    cancelButton: "btn btn-active-light"
                }
            }).then(function (result) {
                if (result.value) {
                    form.reset(); // Reset form			
                    modal.hide();
                } else if (result.dismiss === 'cancel') {
                    Swal.fire({
                        text: "Your form has not been cancelled!.",
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, got it!",
                        customClass: {
                            confirmButton: "btn btn-primary",
                        }
                    });
                }
            });
        });
    }

    return {
        // Public functions
        init: function () {
            initAddUser();
        }
    };
}();

// On document ready
KTUtil.onDOMContentLoaded(function () {
    KTUsersAddUser.init();
});