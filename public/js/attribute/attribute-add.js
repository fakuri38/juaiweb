$(document).ready(function () {
    var price_check = document.querySelector('#price_check');
    var stock_check = document.querySelector('#stock_check');
    var modalEl = document.querySelector('#AttributeModal');
    var modal = new bootstrap.Modal(modalEl);
    form = document.querySelector('#Attribute_form');
    formAttributeButtons = document.querySelector('[data-kt-stepper-action="test"]');
    price_check.addEventListener('change', function (event) {
        if (this.checked) {
            document.getElementById("price_add").innerHTML =
                `<label class="d-flex align-items-center fs-5 fw-bold mb-2">
                        <span class="required">Harga Option</span>
                    </label>
                    
                    <!--end::Label-->
                    <!--begin::Input-->
                    <input type="text" class="form-control form-control-lg form-control-solid" id="attribute_price" name="price" placeholder=""/>
                    `;

        } else {
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
                    <input type="text" class="form-control form-control-lg form-control-solid" id="attribute_price" name="price" placeholder=""/>
                    `;

        } else {
            document.getElementById("stock_add").innerHTML = "";
        }
    });

    price_check.addEventListener('change', function (event) {
        if (this.checked) {
            document.getElementById("price_add").innerHTML =
                `<label class="d-flex align-items-center fs-5 fw-bold mb-2">
                        <span class="required">Harga Option</span>
                    </label>
                    
                    <!--end::Label-->
                    <!--begin::Input-->
                    <input type="text" class="form-control form-control-lg form-control-solid" id="attribute_stock" name="stock" placeholder=""/>
                    `;

        } else {
            document.getElementById("price_add").innerHTML = "";
        }
    });

    formAttributeButtons.addEventListener('click', function (e) {
        // Prevent default button action
        e.preventDefault();

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