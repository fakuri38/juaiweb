$(document).ready(function () {

    var modalEl = document.querySelector('#AttributeModal');
    var modal = new bootstrap.Modal(modalEl);
    form = document.querySelector('#Attribute_form');
    formAttributeButtons = document.querySelector('[data-kt-stepper-action="test"]');

    validator = FormValidation.formValidation(form, {
        fields: {
            'attribute_name': {
                validators: {
                    notEmpty: {
                        message: 'Nama Atribut Tidak Boleh Kosong'
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
    }).on('core.form.valid', function () {
        // Disable button to avoid multiple click 
        formAttributeButtons.disabled = true;

        // Show loading indication
        formAttributeButtons.setAttribute('data-kt-indicator', 'on');
        $.ajax({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            type: 'GET',
            url: ATTRIBUTE_ADD,
            data: $('#Attribute_form').serialize(),
            success: function (data) {
                formAttributeButtons.removeAttribute('data-kt-indicator');
                formAttributeButtons.disabled = false;
                Swal.fire({
                    text: "Atribut Telah Dicipta",
                    icon: "success",
                    buttonsStyling: false,
                    confirmButtonText: "Tutup",
                    customClass: {
                        confirmButton: "btn btn-primary"
                    }
                }).then(function (result) {
                    if (result.isConfirmed) {
                        $('#example').DataTable().ajax.reload();
                        modal.hide(); // close modal
                        //form.submit(); // Submit form
                    }
                });
                //console.log(data);
            },
            error: function (data) {
                response = $.parseJSON(data.responseText);
                console.log($.parseJSON(data.responseText));
                formAttributeButtons.removeAttribute('data-kt-indicator');
                formAttributeButtons.disabled = false;
                Swal.fire({
                    text: response.error,
                    icon: "error",
                    buttonsStyling: false,
                    confirmButtonText: "Tutup",
                    customClass: {
                        confirmButton: "btn btn-primary"
                    }
                }).then(function (result) {
                    if (result.isConfirmed) {
                        //form.submit(); // Submit form
                    }
                });
            },
        });


    });


    formAttributeButtons.addEventListener('click', function (e) {
        // Prevent default button action
        e.preventDefault();
        validator.validate();
        /*.then(function (status) {
        if (status == 'Valid') {

            // Disable button to avoid multiple click 
            formAttributeButtons.disabled = true;

            // Show loading indication
            formAttributeButtons.setAttribute('data-kt-indicator', 'on');
            $.ajax({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                type: 'GET',
                url: ATTRIBUTE_ADD,
                data: $('#Attribute_form').serialize(),
                success: function (data) {
                    formAttributeButtons.removeAttribute('data-kt-indicator');
                    formAttributeButtons.disabled = false;
                    Swal.fire({
                        text: "Atribut Telah Dicipta",
                        icon: "success",
                        buttonsStyling: false,
                        confirmButtonText: "Tutup",
                        customClass: {
                            confirmButton: "btn btn-primary"
                        }
                    }).then(function (result) {
                        if (result.isConfirmed) {
                            $('#example').DataTable().ajax.reload();
                            modal.hide(); // close modal
                            //form.submit(); // Submit form
                        }
                    });
                    //console.log(data);
                },
                error: function (data) {
                    console.log($.parseJSON(data.responseText));
                    formAttributeButtons.removeAttribute('data-kt-indicator');
                    formAttributeButtons.disabled = false;
                    Swal.fire({
                        text: "Atribut Telah Dicipta",
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "Tutup",
                        customClass: {
                            confirmButton: "btn btn-primary"
                        }
                    }).then(function (result) {
                        if (result.isConfirmed) {
                            //form.submit(); // Submit form
                        }
                    });
                },
            });

        }
    });*/

    });

});


var deleteID;
$('body').on('click', '#getDeleteId', function () {
    deleteID = $(this).data('id');
    Swal.fire({
        text: "Hapus Atribut?",
        icon: "warning",
        buttonsStyling: false,
        confirmButtonText: "Ya",
        showCancelButton: true,
        cancelButtonText: "Tidak",
        customClass: {
            confirmButton: "btn btn-danger",
            cancelButton: "btn btn-secondary"
        }
    }).then(function (result) {
        if (result.isConfirmed) {
            $.ajax({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                type: 'GET',
                url: ATTRIBUTE_DESTROY,
                data: {
                    id: deleteID,
                },
                success: function (data) {
                    $('#example').DataTable().ajax.reload();
                    Swal.fire('Telah Dihapus!', '', 'success')
                },
                error: function (data) {

                },
            });


            //form.submit(); // Submit form
        }
    });
})