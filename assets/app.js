
// Open form //
// const formContainer = document.getElementById("entry-form-container");
// const newFormBtn = document.getElementById("new-form-btn");
// const closeFormBtn = document.getElementById('close-form-btn');
// const maintForm = document.getElementById('entry-form');

// function toggleForm() {
//    debugger;
//    if (closeFormBtn) {
//       maintForm.reset();
//       formContainer.classList.toggle('open-form-container');
//    } else {
//       formContainer.classList.toggle('open-form-container');
//    }
// };


const newFormBtn = document.getElementById('new-form-btn');
const formContainer = document.getElementById('entry-form-container');
const closeBtn = document.getElementById('close-form-btn');
const entryForm = document.getElementById('entry-form');


newFormBtn.addEventListener('click', openForm);
closeBtn.addEventListener('click', closeForm);

function openForm() {
  formContainer.style.display = 'block';
  formContainer.style.transform = 'scale(1)';
}

function closeForm() {
   entryForm.reset();
  formContainer.style.display = 'none';
  formContainer.style.transform = 'scale(0)';
}
