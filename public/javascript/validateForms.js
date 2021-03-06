//  This script comes from bootstrap, needed for basic error handling on new/edit requests
// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
  'use strict'
  
  // USED FOR FILE INPUT REFRACTOR
  bsCustomFileInput.init();
  // Fetch all the forms we want to apply custom Bootstrap validation styles to
 // 'validated-form' is looked for in the form  
  var forms = document.querySelectorAll('.validated-form')

  // Loop over them and prevent submission
  Array.from(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })
})()
