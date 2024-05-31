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
