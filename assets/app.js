// Open close Log New Maintenance Form function ===================
function formOpenClose() {
   const formContainer = document.getElementById('entry-form-container');
   const entryForm = document.getElementById('entry-form');
   if (formContainer.className == 'open-form-container') {
      resetFormTitle();
      entryForm.reset();
      formContainer.classList.toggle('open-form-container');
      formContainer.style.display = 'none';
   } else {
      formContainer.style.display = 'block';
      formContainer.classList.toggle('open-form-container');
   }
}

// Table header sort function ============================
function sortTable(n) {
   var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
   table = document.getElementById("equipment-log-table");
   switching = true;
   // Set the sorting direction to descending:
   dir = "desc";
   // Make a loop that will continue until no switching has been done:
   while (switching) {
       // Start by saying: no switching is done: 
       switching = false;
       rows = table.rows; 
       // Loop through all table rows (except the first, which contains table headers):
       for (i = 1; i < (rows.length - 1); i++) {
           // Start by saying there should be no switching:
           shouldSwitch = false;
           // Get the two elements you want to compare, one from current row and one from the next:
           x = rows[i].getElementsByTagName("TD")[n];
           y = rows[i + 1].getElementsByTagName("TD")[n];
           // Check if the two rows should switch place, based on the direction, asc or desc:
           if (dir == "asc") {
               if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                   // If so, mark as a switch and break the loop:
                   shouldSwitch = true;
                   break;
               }
           } else if (dir == "desc") {
               if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                   // If so, mark as a switch and break the loop:
                   shouldSwitch = true;
                   break;
               }
           }
       }
       if (shouldSwitch) {
           // If a switch has been marked, make the switch and mark that a switch has been done:
           rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
           switching = true;
           switchcount++;
       } else {
           // If no switching has been done AND the direction is "asc", set the direction to "desc" and run the while loop again.
           if (switchcount == 0 && dir == "desc") {
               dir = "asc";
               switching = true;
           }
       }
   }
}

// Preform mouse click action on the date table header so that it sorts the table for the most recent date
const sortDesending = document.getElementById("date-header-col");
sortDesending.click();

// Search Filter Function ===============================
function searchFilter() {
   var input, filter, table, tr, td, i, j, txtValue;
   input = document.getElementById("search-input");
   filter = input.value.toUpperCase();
   table = document.getElementById("equipment-log-table");
   tr = table.getElementsByTagName("tr");

   for (i = 1; i < tr.length; i++) {
       td = tr[i].getElementsByTagName("td");
       if (td) {
           txtValue = "";
           for (j = 0; j < td.length; j++) {
               // Check if the hidden column (entry number) needs to be excluded from search
               if (j !== 0) {
                   txtValue += td[j].textContent || td[j].innerText;
               }
           }
           if (txtValue.toUpperCase().indexOf(filter) > -1) {
               tr[i].style.display = "";
           } else {
               tr[i].style.display = "none";
           }
       }
   }
}

// Send form data to database functions and create new table row functions.
document.getElementById('entry-form').addEventListener('submit', function(event) {
   event.preventDefault();
   const formData = {
       rentalId: document.getElementById('rental-id-number').value,
       equipmentDescription: document.getElementById('equipment-description-input').value.trim(),
       serviceType: document.getElementById('service-type').value,
       serviceDescription: document.getElementById('service-description').value.trim(),
       hourMeter: document.getElementById('hour-meter').value.trim(),
       serviceDate: document.getElementById('service-date').value,
       techName: document.getElementById('name-input').value.trim()
   };

   if (document.getElementById('entry-id').value) {
       const entryLogNum = document.getElementById('entry-id').value;
       updateFormDataOnServer(entryLogNum, formData);
   } else {
       sendFormDataToServer(formData);
   }
});

function sendFormDataToServer(formData) {
   console.log("sendFormDataToServer function started.");
   console.log("formData: ", formData);

   fetch('process-form2.php', {
       method: 'POST',
       headers: {
           'Content-Type': 'application/json'
       },
       body: JSON.stringify(formData)
   })
   .then(response => response.json())
   .then(data => {
       if (data.error) {
           console.error("Error:", data.error);
       } else {
           console.log("Success:", data);
           updateTable(data);
           clearForm();
           formOpenClose();
       }
   })
   .catch(error => {
       console.error("Error: ", error);
   });
}

function updateTable(data) {
   console.log("updateTable function started.");
   const tableBody = document.getElementById('equipment-log-table').getElementsByTagName('tbody')[0];

   const newEntryData = data;
   const newRow = document.createElement('tr');

   const entryLogNumCell = document.createElement('td');
   entryLogNumCell.classList.add('entry-log-num-col');
   entryLogNumCell.textContent = newEntryData.entryLogNum;

   const rentalIdCell = document.createElement('td');
   rentalIdCell.classList.add('rental-id-col');
   rentalIdCell.textContent = newEntryData.rentalId;

   const equipmentDescriptionCell = document.createElement('td');
   equipmentDescriptionCell.classList.add('equipment-description-col');
   equipmentDescriptionCell.textContent = newEntryData.equipmentDescription;

   const serviceTypeCell = document.createElement('td');
   serviceTypeCell.classList.add('service-type-col');
   serviceTypeCell.textContent = newEntryData.serviceType;

   const serviceDescriptionCell = document.createElement('td');
   serviceDescriptionCell.classList.add('service-description-col');
   serviceDescriptionCell.textContent = newEntryData.serviceDescription;

   const hourMeterCell = document.createElement('td');
   hourMeterCell.classList.add('hour-meter-col');
   hourMeterCell.textContent = newEntryData.hourMeter;

   const dateCell = document.createElement('td');
   dateCell.classList.add('date-col');
   dateCell.textContent = formatDate(newEntryData.serviceDate);

   const techNameCell = document.createElement('td');
   techNameCell.classList.add('tech-name-col');
   techNameCell.textContent = newEntryData.techName;

   const editColCell = document.createElement('td');
   editColCell.classList.add('edit-col');
   editColCell.innerHTML = '<div class="col-wrapper"><button class="edit-log-btn" onclick="editLogBtnClick(this);"><i class="fa-solid fa-pen-to-square"></i></button> <button class="delete-log-btn" onclick="deleteBtnClick(this);"><i class="fa-solid fa-trash-can"></i></button></div>';

   newRow.appendChild(entryLogNumCell);
   newRow.appendChild(rentalIdCell);
   newRow.appendChild(equipmentDescriptionCell);
   newRow.appendChild(serviceTypeCell);
   newRow.appendChild(serviceDescriptionCell);
   newRow.appendChild(hourMeterCell);
   newRow.appendChild(dateCell);
   newRow.appendChild(techNameCell);
   newRow.appendChild(editColCell);

   // tableBody.appendChild(newRow);
   tableBody.prepend(newRow);
}

// Get entries from database on load and populate
document.addEventListener('DOMContentLoaded', function() {
   fetchEntries();
});

function fetchEntries() {
   fetch('get-entries.php')
       .then(response => response.json())
       .then(data => {
           if (data.error) {
               console.error("Error:", data.error);
           } else {
               populateTable(data);
           }
       })
       .catch(error => {
           console.error("Error: ", error);
       });
}

function populateTable(entries) {
   const tableBody = document.getElementById('equipment-log-table').getElementsByTagName('tbody')[0];
   tableBody.innerHTML = ''; // Clear any existing rows

   entries.forEach(entry => {
       const newRow = document.createElement('tr');

       const entryLogNumCell = document.createElement('td');
       entryLogNumCell.classList.add('entry-log-num-col');
       entryLogNumCell.textContent = entry.id;

       const rentalIdCell = document.createElement('td');
       rentalIdCell.classList.add('rental-id-col');
       rentalIdCell.textContent = entry.rental_id;

       const equipmentDescriptionCell = document.createElement('td');
       equipmentDescriptionCell.classList.add('equipment-description-col');
       equipmentDescriptionCell.textContent = entry.equipment_description;

       const serviceTypeCell = document.createElement('td');
       serviceTypeCell.classList.add('service-type-col');
       serviceTypeCell.textContent = entry.service_type;

       const serviceDescriptionCell = document.createElement('td');
       serviceDescriptionCell.classList.add('service-description-col');
       serviceDescriptionCell.textContent = entry.service_description;

       const hourMeterCell = document.createElement('td');
       hourMeterCell.classList.add('hour-meter-col');
       hourMeterCell.textContent = entry.hour_meter;

       const dateCell = document.createElement('td');
       dateCell.classList.add('date-col');
       dateCell.textContent = formatDate(entry.service_date); // Format the date

       const techNameCell = document.createElement('td');
       techNameCell.classList.add('tech-name-col');
       techNameCell.textContent = entry.tech_name;

       const editColCell = document.createElement('td');
       editColCell.classList.add('edit-col');
       editColCell.innerHTML = '<div class="col-wrapper"><button class="edit-log-btn" onclick="editLogBtnClick(this);"><i class="fa-solid fa-pen-to-square"></i></button> <button class="delete-log-btn" onclick="deleteBtnClick(this);"><i class="fa-solid fa-trash-can"></i></button></div>';

       newRow.appendChild(entryLogNumCell);
       newRow.appendChild(rentalIdCell);
       newRow.appendChild(equipmentDescriptionCell);
       newRow.appendChild(serviceTypeCell);
       newRow.appendChild(serviceDescriptionCell);
       newRow.appendChild(hourMeterCell);
       newRow.appendChild(dateCell);
       newRow.appendChild(techNameCell);
       newRow.appendChild(editColCell);

       tableBody.appendChild(newRow);
   });
}

function formatDate(dateStr) {
   const date = new Date(dateStr);
   const day = String(date.getDate()).padStart(2, '0');
   const month = String(date.getMonth() + 1).padStart(2, '0');
   const year = date.getFullYear();
   return `${month}/${day}/${year}`;
}

// Reset form title and button text
function resetFormTitle() {
   document.getElementsByClassName('form-title')[0].textContent = 'Log New Maintenance';
   document.getElementById('submit-button').textContent = 'Add Log Entry';
}

// Handle listening for click on desktop and touch on mobile for delete function
document.addEventListener('DOMContentLoaded', function() {
   const deleteButtons = document.querySelectorAll('.delete-log-btn');
   deleteButtons.forEach(function(button) {
       button.addEventListener('click', function(event) {
           event.preventDefault();
           deleteBtnClick(this);
       });
       button.addEventListener('touchend', function(event) {
           event.preventDefault();
           deleteBtnClick(this);
       });
   });
});

// Edit Log Entry functions ==================================
// Edit Function
function editLogBtnClick(button) {
   console.log("edit log button clicked");
   const row = button.closest('tr');
   formOpenClose();
   // Edit form title to indicate edit mode
   document.getElementsByClassName('form-title')[0].textContent = 'Edit Log Entry';
   // Change form button text to update
   document.getElementById('submit-button').textContent = 'Update Log Entry';
   populateFormForEdit(row); 
}

function populateFormForEdit(row) {
   document.getElementById('entry-id').value = row.getElementsByClassName('entry-log-num-col')[0].textContent;
   document.getElementById('rental-id-number').value = row.getElementsByClassName('rental-id-col')[0].textContent;
   document.getElementById('equipment-description-input').value = row.getElementsByClassName('equipment-description-col')[0].textContent;
   document.getElementById('service-type').value = row.getElementsByClassName('service-type-col')[0].textContent;
   document.getElementById('service-description').value = row.getElementsByClassName('service-description-col')[0].textContent;
   document.getElementById('hour-meter').value = row.getElementsByClassName('hour-meter-col')[0].textContent;
   // Format the date for input
   const serviceDate = row.getElementsByClassName('date-col')[0].textContent;
   document.getElementById('service-date').value = formatDateForInput(serviceDate);
   document.getElementById('name-input').value = row.getElementsByClassName('tech-name-col')[0].textContent;
}

function formatDateForInput(dateString) {
   const [month, day, year] = dateString.split('/');
   return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function updateFormDataOnServer(entryLogNum, formData) {
   console.log("updateFormDataOnServer function started.");
   console.log("formData: ", formData);

   fetch('update-entry.php', {
       method: 'POST',
       headers: {
           'Content-Type': 'application/json'
       },
       body: JSON.stringify({ entryLogNum: entryLogNum, ...formData })
   })
   .then(response => response.text())
   .then(text => {
       console.log("Server response:", text); // Log the response for debugging
       try {
           const data = JSON.parse(text);
           if (data.error) {
               console.error("Error:", data.error);
           } else {
               console.log("Success:", data);
               updateTableRow(entryLogNum, formData);
               clearForm();
               formOpenClose();
           }
       } catch (error) {
           console.error("Failed to parse JSON response:", text);
           console.error("Error:", error);
       }
   })
   .catch(error => {
       console.error("Error: ", error);
   });

}

function updateTableRow(entryLogNum, formData) {
   console.log("updateTableRow function started.");
   const rows = document.getElementById('equipment-log-table').getElementsByTagName('tbody')[0].getElementsByTagName('tr');

   for (let row of rows) {
       if (row.getElementsByClassName('entry-log-num-col')[0].textContent == entryLogNum) {
           row.getElementsByClassName('rental-id-col')[0].textContent = formData.rentalId;
           row.getElementsByClassName('equipment-description-col')[0].textContent = formData.equipmentDescription;
           row.getElementsByClassName('service-type-col')[0].textContent = formData.serviceType;
           row.getElementsByClassName('service-description-col')[0].textContent = formData.serviceDescription;
           row.getElementsByClassName('hour-meter-col')[0].textContent = formData.hourMeter;
           row.getElementsByClassName('date-col')[0].textContent = formatDate(formData.serviceDate);
           row.getElementsByClassName('tech-name-col')[0].textContent = formData.techName;
           break;
       }
   }
}

function clearForm() {
   document.getElementById('entry-id').value = '';
   document.getElementById('rental-id-number').value = '';
   document.getElementById('equipment-description-input').value = '';
   document.getElementById('service-type').value = '';
   document.getElementById('service-description').value = '';
   document.getElementById('hour-meter').value = '';
   document.getElementById('service-date').value = '';
   document.getElementById('name-input').value = '';
}

// Delete Log Entry functions
function deleteBtnClick(button) {
   const row = button.parentNode.closest('tr');
   const entryLogNum = row.getElementsByClassName('entry-log-num-col')[0].textContent;
   const rentalId = row.getElementsByClassName('rental-id-col')[0].textContent;
   const equipmentDescription = row.getElementsByClassName('equipment-description-col')[0].textContent;

   if (confirm(`Are you sure you want to delete Rental ID: ${rentalId}, Equipment Description: ${equipmentDescription}?`)) {
       fetch('delete-entry.php', {
           method: 'POST',
           headers: {
               'Content-Type': 'application/json'
           },
           body: JSON.stringify({ entryLogNum: entryLogNum })
       })
       .then(response => response.json())
       .then(data => {
           if (data.error) {
               console.error("Error:", data.error);
           } else {
               console.log("Success:", data);
               row.remove();
               alert(`Rental ID: ${rentalId}, ${equipmentDescription} has been deleted.`);
           }
       })
       .catch(error => {
           console.error("Error: ", error);
       });
   }
}

