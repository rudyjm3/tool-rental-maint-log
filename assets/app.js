// Open close Log New Maintenance Form function ===================
function formOpenClose() {
   const formContainer = document.getElementById('entry-form-container');
   const entryForm = document.getElementById('entry-form');
   if (formContainer.className == 'open-form-container') {
      entryForm.reset();
      formContainer.style.display = 'none';
      formContainer.classList.toggle('open-form-container');
   } else {
      formContainer.style.display = 'block';
      formContainer.classList.toggle('open-form-container');
   }
};

// Table header sort function ============================
function sortTable(n) {
   var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
   table = document.getElementById("equipment-log-table");
   switching = true;
   // Set the sorting direction to descending:
   dir = "desc";
   /* Make a loop that will continue until
   no switching has been done: */
   while (switching) {
      // Start by saying: no switching is done: 
      switching = false;
      rows = table.rows; 
      /* Loop through all table rows (except the
         first, which contains table headers): */
      for (i = 1; i < (rows.length - 1); i++) {
         // Start by saying there should be no switching:
         shouldSwitch = false;
         /* Get the two elements you want to compare,
         one from current row and one from the next: */
         x = rows[i].getElementsByTagName("TD")[n];
         y = rows[i + 1].getElementsByTagName("TD")[n];
         /* Check if the two rows should switch place,
         based on the direction, asc or desc: */
         if (dir == "asc") {
            if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
               // If so, mark as a switch and break the loop:
               shouldSwitch= true;
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
      // If no switching has been done AND the direction is "asc",   
      // set the direction to "desc" and run the while loop again.
      if (shouldSwitch) {
         /* If a switch has been marked, make the switch
         and mark that a switch has been done: */
         rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
         switching = true;
         // Each time a switch is done, increase this count by 1:
         switchcount ++;
      } else {
         /* If no switching has been done AND the direction is "asc",
         set the direction to "desc" and run the while loop again. */
         if (switchcount == 0 && dir == "desc") {
            dir = "asc";
            switching = true;
         }
      }
   }
};

// Preform mouse cliick action on the date table header so that it sorts the table for the most recent date
// const sortDesending = document.getElementById("date-header");;
// sortDesending.click();

// Search Filter Function ===============================
function searchFilter() {
   var input, filter, table, tr, td, i, j, txtValue;
   input = document.getElementById("search-input");
   filter = input.value.toUpperCase();
   table = document.getElementById("equipment-log-table");
   tr = table.getElementsByTagName("tr");

 
   for (i = 1; i < tr.length; i++) {
      // console.log("for i ran");
     td = tr[i].getElementsByTagName("td");
     if (td) {

      txtValue = "";
      for (j = 0; j < td.length; j++) {
      // console.log("for j ran");
      // Check if the hidden column (entry number) needs to be excluded from search
      if (j !== 0 ) {
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


// Send form data to database function and create new table row functions.
document.getElementById('entry-form').addEventListener('submit', function(event) {
   event.preventDefault();

   const formData = {
       rentalId: document.getElementById('rental-id-number').value,
       equipmentDescription: document.getElementById('equipment-description-input').value,
       serviceType: document.getElementById('service-type').value,
       serviceDescription: document.getElementById('service-description').value,
       hourMeter: document.getElementById('hour-meter').value,
       serviceDate: document.getElementById('service-date').value,
       techName: document.getElementById('name-input').value
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
   console.log("This is the parse'd data - " + newEntryData);
   // Create new table row element for the new entry
   const newRow = document.createElement('tr');
 
   // Create table cells for each data point in the new entry
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
   dateCell.textContent = formatDate(data.serviceDate); // Format the date

   const techNameCell = document.createElement('td');
   techNameCell.classList.add('tech-name-col');
   techNameCell.textContent = newEntryData.techName;
 
   const editColCell = document.createElement('td');
   editColCell.classList.add('edit-col');
   editColCell.innerHTML = '<div class="col-wrapper"><button class="edit-log-btn" onclick="editLogBtnClick(this);"><i class="fa-solid fa-pen-to-square"></i></button> <button class="delete-log-btn" onclick="deleteBtnClick(this);"><i class="fa-solid fa-trash-can"></i></button></div>';
 
   // Append the data cells to the new row
   newRow.appendChild(entryLogNumCell);
   newRow.appendChild(rentalIdCell);
   newRow.appendChild(equipmentDescriptionCell);
   newRow.appendChild(serviceTypeCell);
   newRow.appendChild(serviceDescriptionCell);
   newRow.appendChild(hourMeterCell);
   newRow.appendChild(dateCell);
   newRow.appendChild(techNameCell);
   newRow.appendChild(editColCell);
 
   // Append the new row to the table body
   tableBody.appendChild(newRow);
}

// Get entries from data base on load and populate
document.addEventListener('DOMContentLoaded', function() {
   fetchEntries();
});
// This is the function that will get the entries from the database
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
// This is the function that will populate the table with the data from the database that was fetched above
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

function formatDate(dateString) {
   const date = new Date(dateString);
   const month = String(date.getMonth() + 1).padStart(2, '0'); // Add 1 because months are zero-indexed
   const day = String(date.getDate()).padStart(2, '0');
   const year = date.getFullYear();
   return `${month}/${day}/${year}`;
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
// Check if form is in Edit mode
document.getElementById('entry-form').addEventListener('submit', function(event) {
   event.preventDefault();

   // Check if the form is in edit mode
   const isEditMode = document.getElementById('entry-form').dataset.editMode === 'true';

   const formData = {
       rentalId: document.getElementById('rental-id-number').value,
       equipmentDescription: document.getElementById('equipment-description-input').value,
       serviceType: document.getElementById('service-type').value,
       serviceDescription: document.getElementById('service-description').value,
       hourMeter: document.getElementById('hour-meter').value,
       serviceDate: document.getElementById('service-date').value,
       techName: document.getElementById('name-input').value
   };

   if (isEditMode) {
       const entryLogNum = document.getElementById('entry-form').dataset.editEntryLogNum;
       updateFormDataOnServer(entryLogNum, formData);
   } else {
       sendFormDataToServer(formData);
   }
});
// Edit Function ++++++++++++++++++++++++++++
function editLogBtnClick(button) {
   console.log("edit log button clicked");
   const row = button.parentNode.closest('tr');
   formOpenClose();
   populateFormForEdit(row);
}


function populateFormForEdit(row) {
   console.log("populate form for edit started");

   // Get data from the row
   const entryLogNum = row.querySelector('.entry-log-num-col').textContent.trim();
   const rentalId = row.querySelector('.rental-id-col').textContent.trim();
   const equipmentDescription = row.querySelector('.equipment-description-col').textContent.trim();
   const serviceType = row.querySelector('.service-type-col').textContent.trim();
   const serviceDescription = row.querySelector('.service-description-col').textContent.trim();
   const hourMeter = row.querySelector('.hour-meter-col').textContent.trim();
   const serviceDate = row.querySelector('.date-col').textContent.trim();
   const techName = row.querySelector('.tech-name-col').textContent.trim();

   // Populate the form
   document.getElementById('rental-id-number').value = rentalId;
   document.getElementById('equipment-description-input').value = equipmentDescription;
   document.getElementById('service-type').value = serviceType;
   document.getElementById('service-description').value = serviceDescription;
   document.getElementById('hour-meter').value = hourMeter;
   document.getElementById('service-date').value = serviceDate;
   document.getElementById('name-input').value = techName;

   // Set the form to edit mode and store the entry log number
   document.getElementById('entry-form').dataset.editMode = 'true';
   document.getElementById('entry-form').dataset.editEntryLogNum = entryLogNum;
}

function updateFormDataOnServer(entryLogNum, formData) {
   console.log("updateFormDataOnServer function started.");
   console.log("formData: ", formData);

   fetch('update-entry.php', {
       method: 'POST',
       headers: {
           'Content-Type': 'application/json'
       },
       body: JSON.stringify({ entryLogNum: entryLogNum, formData: formData })
   })
   .then(response => response.text())
   .then(text => {
       try {
           const data = JSON.parse(text);
           if (data.error) {
               console.error("Error:", data.error);
           } else {
               console.log("Success:", data);
               updateTableRow(entryLogNum, formData);
               clearForm();
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
   const table = document.getElementById('equipment-log-table');
   const rows = table.getElementsByTagName('tr');

   for (let row of rows) {
       if (row.querySelector('.entry-log-num-col').textContent.trim() === entryLogNum) {
           row.querySelector('.rental-id-col').textContent = formData.rentalId;
           row.querySelector('.equipment-description-col').textContent = formData.equipmentDescription;
           row.querySelector('.service-type-col').textContent = formData.serviceType;
           row.querySelector('.service-description-col').textContent = formData.serviceDescription;
           row.querySelector('.hour-meter-col').textContent = formData.hourMeter;
           row.querySelector('.date-col').textContent = formData.serviceDate; // You may need to format this
           row.querySelector('.tech-name-col').textContent = formData.techName;
       }
   }
}

function clearForm() {
   document.getElementById('entry-form').reset();
   document.getElementById('entry-form').dataset.editMode = 'false';
   document.getElementById('entry-form').dataset.editEntryLogNum = '';
}

// Delete Log Entry functions
function deleteBtnClick(button) {
   console.log('Delete Log Entry button clicked');
   const row = button.parentNode.closest('tr');
   const entryLogNum = row.querySelector('.entry-log-num-col').textContent;

   if (confirm("Are you sure you want to delete this entry?")) {
      deleteEntry(entryLogNum, row);
  }
};

function deleteEntry(entryLogNum, row) {
   fetch('delete-entry.php', {
       method: 'POST',
       headers: {
           'Content-Type': 'application/json'
       },
       body: JSON.stringify({ id: entryLogNum }) // id = database column name
   })
   .then(response => response.json())
   .then(data => {
       if (data.success) {
           row.remove();
       } else {
           console.error("Error:", data.error);
       }
   })
   .catch(error => {
       console.error("Error:", error);
   });
}
