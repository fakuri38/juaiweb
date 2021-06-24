$(document).ready(function () {
    var price_check = document.querySelector('#price_check');
    var stock_check = document.querySelector('#stock_check');
    var modalEl = document.querySelector('#AttributeModal');
    var modal = new bootstrap.Modal(modalEl);
    form = document.querySelector('#Attribute_form');
    formAttributeButtons = document.querySelector('[data-kt-stepper-action="test"]');

    priceValidators = {
        validators: {
            notEmpty: {
                message: 'Harga Tidak Boleh Kosong'
            },
            regexp: {
                regexp: /^\d+(\.\d{1,2})?$/,
                message: 'Harga mesti dalam bentuk: exp. 123.45'
            }
        }
    };

    stockValidators = {
        validators: {
            notEmpty: {
                message: 'Stok Tidak Boleh Kosong'
            },
            regexp: {
                regexp: /^[0-9]*$/,
                message: 'Stok mesti dalam bentuk nombor'
            }
        }
    };

    validator = FormValidation.formValidation(form, {
        fields: {
            'name': {
                validators: {
                    notEmpty: {
                        message: 'Nama Option Tidak Boleh Kosong'
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
            url: OPTION_URL,
            data: {
                id: ATTRIBUTE_ID,
                form: $('#Attribute_form').serialize(),
            },
            success: function (data) {
                console.log(data);
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
                console.log(data);
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
    });

    price_check.addEventListener('change', function (event) {
        if (this.checked) {
            document.getElementById("price_add").innerHTML =
                `<label class="d-flex align-items-center fs-5 fw-bold mb-2">
                        <span class="required">Harga Option</span>
                    </label>
                    
                    <!--end::Label-->
                    <!--begin::Input-->
                    <input type="text" data-type="currency" class="form-control form-control-lg form-control-solid" id="price" name="price" placeholder=""/>
                    `;
            validator.addField('price', priceValidators);

        } else {
            validator.removeField('price');
            document.getElementById("price_add").innerHTML = "";
        }
    });

    stock_check.addEventListener('change', function (event) {
        if (this.checked) {
            document.getElementById("stock_add").innerHTML =
                `<label class="d-flex align-items-center fs-5 fw-bold mb-2">
                        <span class="required">Bilangan Stok</span>
                    </label>
                    
                    <!--end::Label-->
                    <!--begin::Input-->
                    <input type="text" class="form-control form-control-lg form-control-solid" id="stock" name="stock" placeholder=""/>
                    `;
            validator.addField('stock', stockValidators);
        } else {
            validator.removeField('stock');
            document.getElementById("stock_add").innerHTML = "";
        }
    });





    $('body').on('click', '#editOptionID', function () {
        form.reset()
        editID = $(this).data('id');
        $.ajax({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            type: 'GET',
            url: OPTION_ID,
            data: {
                id: editID,
                attribute_id: ATTRIBUTE_ID,
            },
            success: function (data) {
                var name_input = form.querySelector('input[name="name"]');
                name_input.value = data.option_name;
                modal.show();
            },
            error: function (data) {
            },
        });


    })




    formAttributeButtons.addEventListener('click', function (e) {
        // Prevent default button action
        e.preventDefault();

        validator.validate();


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
                    url: DELETE_URL,
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


});


