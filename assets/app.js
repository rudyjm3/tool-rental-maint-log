// Open close Log New Maintenance Form function
function formOpenClose() {
   const formContainer = document.getElementById('entry-form-container');
   const entryForm = document.getElementById('entry-form');
   if (formContainer.className == 'open-form-container') {
      entryForm.reset();
      formContainer.classList.toggle('open-form-container');
   } else {
      formContainer.classList.toggle('open-form-container');
   }
};

