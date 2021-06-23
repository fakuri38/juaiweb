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
            }
        }
    };

    stockValidators = {
        validators: {
            notEmpty: {
                message: 'Stok Tidak Boleh Kosong'
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




    formAttributeButtons.addEventListener('click', function (e) {
        // Prevent default button action
        e.preventDefault();

        validator.validate();


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

    // Jquery Dependency

    $("input[data-type='currency']").on({
        keyup: function () {
            formatCurrency($(this));
        },
        blur: function () {
            formatCurrency($(this), "blur");
        }
    });


    function formatNumber(n) {
        // format number 1000000 to 1,234,567
        return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }


    function formatCurrency(input, blur) {
        // appends $ to value, validates decimal side
        // and puts cursor back in right position.

        // get input value
        var input_val = input.val();

        // don't validate empty input
        if (input_val === "") { return; }

        // original length
        var original_len = input_val.length;

        // initial caret position 
        var caret_pos = input.prop("selectionStart");

        // check for decimal
        if (input_val.indexOf(".") >= 0) {

            // get position of first decimal
            // this prevents multiple decimals from
            // being entered
            var decimal_pos = input_val.indexOf(".");

            // split number by decimal point
            var left_side = input_val.substring(0, decimal_pos);
            var right_side = input_val.substring(decimal_pos);

            // add commas to left side of number
            left_side = formatNumber(left_side);

            // validate right side
            right_side = formatNumber(right_side);

            // On blur make sure 2 numbers after decimal
            if (blur === "blur") {
                right_side += "00";
            }

            // Limit decimal to only 2 digits
            right_side = right_side.substring(0, 2);

            // join number by .
            input_val = left_side + "." + right_side;

        } else {
            // no decimal entered
            // add commas to number
            // remove all non-digits
            input_val = formatNumber(input_val);
            input_val = input_val;

            // final formatting
            if (blur === "blur") {
                input_val += ".00";
            }
        }

        // send updated string to input
        input.val(input_val);

        // put caret back in the right position
        var updated_len = input_val.length;
        caret_pos = updated_len - original_len + caret_pos;
        input[0].setSelectionRange(caret_pos, caret_pos);
    }



})