const equipmentLogTable = document.getElementById('equipment-log-table');
const tableBody = equipmentLogTable ? equipmentLogTable.getElementsByTagName('tbody')[0] : null;
const searchInput = document.getElementById('search-input');
const entriesPerPageSelect = document.getElementById('entries-per-page');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const paginationInfo = document.getElementById('pagination-info');

let currentPage = 1;
let entriesPerPage = entriesPerPageSelect ? parseInt(entriesPerPageSelect.value, 10) : 10;
let currentDescriptionLimit = getServiceDescriptionLimit();

if (entriesPerPageSelect) {
   entriesPerPageSelect.addEventListener('change', function() {
      entriesPerPage = parseInt(this.value, 10) || 10;
      currentPage = 1;
      renderPaginatedRows();
   });
}

if (prevPageBtn) {
   prevPageBtn.addEventListener('click', function() {
      if (currentPage > 1) {
         currentPage--;
         renderPaginatedRows();
      }
   });
}

if (nextPageBtn) {
   nextPageBtn.addEventListener('click', function() {
      currentPage++;
      renderPaginatedRows();
   });
}

function getServiceDescriptionLimit() {
   return window.innerWidth <= 750 ? 50 : 100;
}

function handleDescriptionLimitChange() {
   const newLimit = getServiceDescriptionLimit();
   if (newLimit !== currentDescriptionLimit) {
      currentDescriptionLimit = newLimit;
      refreshAllServiceDescriptionWrappers();
   }
}

window.addEventListener('resize', handleDescriptionLimitChange);

function refreshAllServiceDescriptionWrappers() {
   if (!tableBody) {
      return;
   }
   const wrappers = tableBody.getElementsByClassName('service-description-wrapper');
   Array.from(wrappers).forEach(wrapper => updateWrapperTruncation(wrapper));
}

renderPaginatedRows();

// Open close Log New Maintenance Form function ===================
function formOpenClose() {
   const formContainer = document.getElementById('entry-form-container');
   const entryForm = document.getElementById('entry-form');
   const formModal = document.querySelector('.entry-form-modal');
   if (!formContainer || !entryForm) {
      return;
   }
   const isOpen = formContainer.classList.contains('open-form-container');
   if (isOpen) {
      resetFormTitle();
      entryForm.reset();
      formContainer.classList.remove('open-form-container');
      document.body.classList.remove('modal-open');
      formModal.classList.remove('hide-scrollbar');
   } else {
      formContainer.classList.add('open-form-container');
      document.body.classList.add('modal-open');
      formModal.classList.add('hide-scrollbar');
   }
}

// Table header sort function ============================
function sortTable(n) {
   if (!equipmentLogTable) {
      return;
   }
   var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
   table = equipmentLogTable;
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

   currentPage = 1;
   renderPaginatedRows();
}

// Search Filter Function ===============================
function searchFilter() {
   const filter = searchInput ? searchInput.value.toUpperCase() : "";
   applySearchFilter(filter);
   currentPage = 1;
   renderPaginatedRows();
}

function applySearchFilter(filter) {
   if (!tableBody) {
      return;
   }
   const rows = tableBody.getElementsByTagName("tr");
   for (let i = 0; i < rows.length; i++) {
      rows[i].dataset.searchHide = rowMatchesFilter(rows[i], filter) ? 'false' : 'true';
   }
}

function rowMatchesFilter(row, filter) {
   if (!filter) {
      return true;
   }
   const cells = row.getElementsByTagName("td");
   let txtValue = "";
   for (let j = 1; j < cells.length; j++) {
      txtValue += cells[j].textContent || cells[j].innerText;
   }
   return txtValue.toUpperCase().indexOf(filter) > -1;
}

function renderPaginatedRows() {
   if (!tableBody) {
      return;
   }
   if (!entriesPerPage || entriesPerPage < 1) {
      entriesPerPage = 10;
   }
   const rows = Array.from(tableBody.getElementsByTagName('tr'));
   const visibleRows = rows.filter(row => row.dataset.searchHide !== 'true');
   const totalEntries = visibleRows.length;
   const totalPages = totalEntries > 0 ? Math.ceil(totalEntries / entriesPerPage) : 1;
   if (currentPage > totalPages) {
      currentPage = totalPages;
   }
   const startIndex = totalEntries > 0 ? (currentPage - 1) * entriesPerPage : 0;
   const endIndex = totalEntries > 0 ? Math.min(startIndex + entriesPerPage, totalEntries) : 0;

   rows.forEach(row => {
      if (row.dataset.searchHide === 'true') {
         row.style.display = 'none';
      }
   });

   visibleRows.forEach((row, index) => {
      if (totalEntries === 0) {
         row.style.display = 'none';
      } else if (index >= startIndex && index < startIndex + entriesPerPage) {
         row.style.display = '';
      } else {
         row.style.display = 'none';
      }
   });

   updatePaginationControls(totalEntries, startIndex, endIndex, totalPages);
}

function updatePaginationControls(totalEntries, startIndex, endIndex, totalPages) {
   if (!paginationInfo || !prevPageBtn || !nextPageBtn) {
      return;
   }

   if (totalEntries === 0) {
      paginationInfo.textContent = 'Showing 0 entries';
   } else {
      paginationInfo.textContent = `Showing ${startIndex + 1}-${endIndex} of ${totalEntries} entries`;
   }

   prevPageBtn.disabled = totalEntries === 0 || currentPage <= 1;
   nextPageBtn.disabled = totalEntries === 0 || currentPage >= totalPages;
}
// Capitialize input Text ===============================
// Function to capitalize each word
function capitalizeWords(str) {
   return str.replace(/\b\w/g, char => char.toUpperCase());
}
// Send form data to database functions and create new table row functions.
document.getElementById('entry-form').addEventListener('submit', function(event) {
   event.preventDefault();
   const formData = {
       rentalId: document.getElementById('rental-id-number').value,
       equipmentDescription: capitalizeWords(document.getElementById('equipment-description-input').value.trim()),
       serviceType: document.getElementById('service-type').value,
       serviceDescription: document.getElementById('service-description').value.trim(),
       hourMeter: document.getElementById('hour-meter').value.trim(),
       serviceDate: document.getElementById('service-date').value,
       techName: capitalizeWords(document.getElementById('name-input').value.trim())
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
           successAddMessage(data);
       }
   })
   .catch(error => {
       console.error("Error: ", error);
   });
}

function normalizeEntry(entry) {
   return {
      entryLogNum: entry.entryLogNum ?? entry.id ?? '',
      rentalId: entry.rentalId ?? entry.rental_id ?? '',
      equipmentDescription: entry.equipmentDescription ?? entry.equipment_description ?? '',
      serviceType: entry.serviceType ?? entry.service_type ?? '',
      serviceDescription: entry.serviceDescription ?? entry.service_description ?? '',
      hourMeter: entry.hourMeter ?? entry.hour_meter ?? '',
      serviceDate: entry.serviceDate ?? entry.service_date ?? '',
      techName: entry.techName ?? entry.tech_name ?? ''
   };
}

function buildTableRow(entryData) {
   const newRow = document.createElement('tr');
   newRow.dataset.searchHide = 'false';
   newRow.dataset.entryId = entryData.entryLogNum ?? '';

   const entryLogNumCell = document.createElement('td');
   entryLogNumCell.classList.add('entry-log-num-col');
   entryLogNumCell.textContent = entryData.entryLogNum;

   const rentalIdCell = document.createElement('td');
   rentalIdCell.classList.add('rental-id-col');
   rentalIdCell.textContent = entryData.rentalId;

   const equipmentDescriptionCell = document.createElement('td');
   equipmentDescriptionCell.classList.add('equipment-description-col');
   equipmentDescriptionCell.textContent = entryData.equipmentDescription;

   const serviceTypeCell = document.createElement('td');
   serviceTypeCell.classList.add('service-type-col');
   serviceTypeCell.textContent = entryData.serviceType;

   const serviceDescriptionCell = document.createElement('td');
   serviceDescriptionCell.classList.add('service-description-col');
   setServiceDescriptionCellContent(serviceDescriptionCell, entryData.serviceDescription);

   const hourMeterCell = document.createElement('td');
   hourMeterCell.classList.add('hour-meter-col');
   hourMeterCell.textContent = entryData.hourMeter ?? '';

   const dateCell = document.createElement('td');
   dateCell.classList.add('date-col');
   dateCell.textContent = entryData.serviceDate ? formatDate(entryData.serviceDate) : '';

   const techNameCell = document.createElement('td');
   techNameCell.classList.add('tech-name-col');
   techNameCell.textContent = entryData.techName;

   const editColCell = document.createElement('td');
   editColCell.classList.add('edit-col');
   editColCell.innerHTML = '<div class="edit-col-wrapper"><button class="edit-log-btn" onclick="editLogBtnClick(this);"><i class="fa-solid fa-pen-to-square"></i></button> <button class="delete-log-btn" onclick="deleteBtnClick(this);"><i class="fa-solid fa-trash-can"></i></button></div>';

   newRow.appendChild(entryLogNumCell);
   newRow.appendChild(rentalIdCell);
   newRow.appendChild(equipmentDescriptionCell);
   newRow.appendChild(serviceTypeCell);
   newRow.appendChild(serviceDescriptionCell);
   newRow.appendChild(hourMeterCell);
   newRow.appendChild(dateCell);
   newRow.appendChild(techNameCell);
   newRow.appendChild(editColCell);

   return newRow;
}

function setServiceDescriptionCellContent(cell, descriptionText) {
   const safeText = descriptionText || '';
   cell.innerHTML = '';

   const wrapper = document.createElement('div');
   wrapper.classList.add('service-description-wrapper');
   wrapper.dataset.hasToggle = 'false';
   wrapper.dataset.expanded = 'false';
   const truncatedSpan = document.createElement('span');
   truncatedSpan.classList.add('service-description-text', 'truncated');
   wrapper.appendChild(truncatedSpan);

   const fullSpan = document.createElement('span');
   fullSpan.classList.add('service-description-text', 'full');
   fullSpan.textContent = safeText;
   wrapper.appendChild(fullSpan);

   const toggleBtn = document.createElement('button');
   toggleBtn.type = 'button';
   toggleBtn.classList.add('toggle-description-btn');
   toggleBtn.textContent = 'View more';
   wrapper.appendChild(toggleBtn);

   cell.appendChild(wrapper);
   updateWrapperTruncation(wrapper);
}

function getFullDescriptionFromCell(cell) {
   if (!cell) {
      return '';
   }
   const fullSpan = cell.querySelector('.service-description-text.full');
   return (fullSpan ? fullSpan.textContent : cell.textContent).trim();
}

function updateWrapperTruncation(wrapper, overrideText) {
   if (!wrapper) {
      return;
   }
   const truncatedSpan = wrapper.querySelector('.service-description-text.truncated');
   const fullSpan = wrapper.querySelector('.service-description-text.full');
   const toggleBtn = wrapper.querySelector('.toggle-description-btn');
   if (!truncatedSpan || !fullSpan || !toggleBtn) {
      return;
   }

   if (overrideText !== undefined) {
      fullSpan.textContent = overrideText;
   }

   const fullText = fullSpan.textContent || '';
   const needsToggle = fullText.length > currentDescriptionLimit;
   const previouslyHadToggle = wrapper.dataset.hasToggle === 'true';
   let isExpanded = wrapper.dataset.expanded === 'true';

   truncatedSpan.textContent = needsToggle ? getTruncatedDescription(fullText, currentDescriptionLimit) : fullText;

   if (!needsToggle) {
      wrapper.dataset.hasToggle = 'false';
      wrapper.dataset.expanded = 'true';
      toggleBtn.style.display = 'none';
      return;
   }

   wrapper.dataset.hasToggle = 'true';
   toggleBtn.style.display = '';
   if (!previouslyHadToggle) {
      wrapper.dataset.expanded = 'false';
      isExpanded = false;
   } else if (wrapper.dataset.expanded !== 'true' && wrapper.dataset.expanded !== 'false') {
      wrapper.dataset.expanded = 'false';
      isExpanded = false;
   } else {
      isExpanded = wrapper.dataset.expanded === 'true';
   }
   toggleBtn.textContent = isExpanded ? 'View less' : 'View more';
}

function getTruncatedDescription(text, limit = currentDescriptionLimit) {
   if (text.length <= limit) {
      return text;
   }
   return `${text.slice(0, limit).trimEnd()}…`;
}

function parseEntryId(value) {
   const parsed = parseInt(value, 10);
   return isNaN(parsed) ? 0 : parsed;
}

function insertRowSorted(newRow) {
   if (!tableBody) {
      return;
   }
   const newEntryId = parseEntryId(newRow.dataset.entryId);
   const rows = Array.from(tableBody.getElementsByTagName('tr'));
   let inserted = false;

   for (const row of rows) {
      const rowEntryId = parseEntryId(row.dataset.entryId);
      if (newEntryId >= rowEntryId) {
         tableBody.insertBefore(newRow, row);
         inserted = true;
         break;
      }
   }

   if (!inserted) {
      tableBody.appendChild(newRow);
   }
}

// function closePopup() {
//    body.removeChild(document.getElementsByClassName('alert-success-container')[0]);
// }

function successAddMessage(data) {
   const body = document.getElementsByTagName('body')[0];
   const successMessageContainer = `
   <div class="alert-success-container">
      <p class="alert-success-title">Success!</p>
      <p class="alert-success-message">
      Rental Id: ${data.rentalId} <br> 
      ${data.equipmentDescription} <br>
      was successfully added to the log.</p>
      <!-- <input type="button" class="close-popup-btn" onclick="closePopup()">Close</input> -->
   </div>`;
   body.insertAdjacentHTML('afterbegin', successMessageContainer);
   setTimeout(function() {
       body.removeChild(document.getElementsByClassName('alert-success-container')[0]);
    }, 3500);
}

function updatedEntryMessage(formData) {
   const body = document.getElementsByTagName('body')[0];
   const successMessageContainer = `
   <div class="alert-success-container">
      <p class="alert-success-title">Entry Updated!</p>
      <p class="alert-success-message">
         Rental ID: ${formData.rentalId} <br> 
         ${formData.equipmentDescription} <br>
         was successfully updated.
      </p>
      <!-- <input type="button" class="close-popup-btn" onclick="closePopup()">Close</input> -->
   </div>`;
   body.insertAdjacentHTML('afterbegin', successMessageContainer);
   setTimeout(function() {
       body.removeChild(document.getElementsByClassName('alert-success-container')[0]);
    }, 3500);
}

function deletedEntryMessage(rentalId, equipmentDescription) {
   console.log("Delete Entry Message function started.");
   const body = document.getElementsByTagName('body')[0];
   const successMessageContainer = `
   <div class="alert-success-container">
      <p class="alert-success-title">Entry Updated!</p>
      <p class="alert-success-message">
         Rental ID: ${rentalId} <br> 
         ${equipmentDescription} <br>
         was successfully deleted.
      </p>
      <!-- <input type="button" class="close-popup-btn" onclick="closePopup()">Close</input> -->
   </div>`;
   setTimeout(function() {
       body.removeChild(document.getElementsByClassName('alert-success-container')[0]);
    }, 3500);
}

function updateTable(data) {
   console.log("updateTable function started.");
   if (!tableBody) {
      return;
   }
   const normalizedEntry = normalizeEntry(data);
   const newRow = buildTableRow(normalizedEntry);
   insertRowSorted(newRow);
   applySearchFilter(searchInput ? searchInput.value.toUpperCase() : "");
   currentPage = 1;
   renderPaginatedRows();
}

// Get entries from database on load and populate
document.addEventListener('DOMContentLoaded', function() {
   fetchEntries();
   const formContainer = document.getElementById('entry-form-container');
   if (formContainer) {
      formContainer.addEventListener('click', function(event) {
         if (event.target === formContainer) {
            formOpenClose();
         }
      });
   }
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
   if (!tableBody) {
      return;
   }
   tableBody.innerHTML = '';

   const normalizedEntries = entries.map(normalizeEntry);
   normalizedEntries.sort((a, b) => parseEntryId(b.entryLogNum) - parseEntryId(a.entryLogNum));

   normalizedEntries.forEach(entry => {
      const newRow = buildTableRow(entry);
      tableBody.appendChild(newRow);
   });

   applySearchFilter(searchInput ? searchInput.value.toUpperCase() : "");
   currentPage = 1;
   renderPaginatedRows();
}

// UTC added so the day is not behind by 1 day
function formatDate(dateStr) {
   const date = new Date(dateStr);
   const day = String(date.getUTCDate()).padStart(2, '0');
   const month = String(date.getUTCMonth() + 1).padStart(2, '0');
   const year = date.getUTCFullYear();
   return `${month}/${day}/${year}`;
}

// Formates the date for the date input field which requires yyyy/mm/dd when entry needs to be edited others wise it will not disply in the form
function formatEditDateInput(dateStr) {
   const date = new Date(dateStr);
   const day = String(date.getDate()).padStart(2, '0');
   const month = String(date.getMonth() + 1).padStart(2, '0');
   const year = date.getFullYear();
   return `${year}-${month}-${day}`; //Needs to be "-" not "/" or will not disply in the form
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

document.addEventListener('click', function(event) {
   if (event.target.classList.contains('toggle-description-btn')) {
      event.preventDefault();
      const wrapper = event.target.closest('.service-description-wrapper');
      if (!wrapper) {
         return;
      }
      if (wrapper.dataset.hasToggle !== 'true') {
         return;
      }
      const isExpanded = wrapper.dataset.expanded === 'true';
      wrapper.dataset.expanded = isExpanded ? 'false' : 'true';
      event.target.textContent = isExpanded ? 'View more' : 'View less';
   }
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

   document.getElementById('rental-id-number').value = row.getElementsByClassName('rental-id-col')[0].textContent.trim();

   document.getElementById('equipment-description-input').value = row.getElementsByClassName('equipment-description-col')[0].textContent.trim();

   document.getElementById('service-type').value = row.getElementsByClassName('service-type-col')[0].textContent;

   const serviceDescriptionCell = row.getElementsByClassName('service-description-col')[0];
   document.getElementById('service-description').value = getFullDescriptionFromCell(serviceDescriptionCell);

   document.getElementById('hour-meter').value = row.getElementsByClassName('hour-meter-col')[0].textContent.trim();

   const serviceDate = formatEditDateInput(row.getElementsByClassName('date-col')[0].textContent);
   console.log("Date input requires this format: ", serviceDate);
   document.getElementById('service-date').value = serviceDate;  

   document.getElementById('name-input').value = row.getElementsByClassName('tech-name-col')[0].textContent.trim();
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
               updatedEntryMessage(formData);
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
   if (!tableBody) {
      return;
   }
   const rows = tableBody.getElementsByTagName('tr');

   for (let row of rows) {
       if (row.getElementsByClassName('entry-log-num-col')[0].textContent == entryLogNum) {
           row.getElementsByClassName('rental-id-col')[0].textContent = formData.rentalId;
           row.getElementsByClassName('equipment-description-col')[0].textContent = formData.equipmentDescription;
           row.getElementsByClassName('service-type-col')[0].textContent = formData.serviceType;
           setServiceDescriptionCellContent(
               row.getElementsByClassName('service-description-col')[0],
               formData.serviceDescription
           );
           row.getElementsByClassName('hour-meter-col')[0].textContent = formData.hourMeter;
           row.getElementsByClassName('date-col')[0].textContent = formatDate(formData.serviceDate);
           row.getElementsByClassName('tech-name-col')[0].textContent = formData.techName;
           row.dataset.entryId = entryLogNum;
           tableBody.removeChild(row);
           insertRowSorted(row);
           break;
       }
   }

   applySearchFilter(searchInput ? searchInput.value.toUpperCase() : "");
   renderPaginatedRows();
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
               renderPaginatedRows();
               // deletedEntryMessage(rentalId, equipmentDescription);
               alert(`Rental ID: ${rentalId}, ${equipmentDescription} has been deleted.`);
           }
       })
       .catch(error => {
           console.error("Error: ", error);
       });
   }
}
