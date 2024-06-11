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

// Table header sort function
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
const sortDesending = document.getElementById("date-header");;
sortDesending.click();

// Search Filter Function 
function searchFilter() {
   // Declare variables
   var input, filter, table, tr, td, i, txtValue;
   input = document.getElementById("search-input");
   filter = input.value.toUpperCase();
   table = document.getElementById("equipment-log-table");
   tr = table.getElementsByTagName("tr");
 
   // Loop through all table rows, and hide those who don't match the search query
   for (i = 1; i < tr.length; i++) {
      console.log("This ran");
     td = tr[i].getElementsByTagName("td")[1];
     if (td) {
       txtValue = td.textContent || td.innerText;
       if (txtValue.toUpperCase().indexOf(filter) > -1) {
         tr[i].style.display = "";
       } else {
         tr[i].style.display = "none";
       }
     }
   }
 };

// Send form data to database function and create new table row
const submitButton = document.getElementById('submit-button');
submitButton.addEventListener('click', function(event) {
  event.preventDefault();

  const formData = {
   rentalId: document.getElementById('rentalId').value,
   equipmentDescription : document.getElementById('equipment-description-input').value,
   serviceType: document.getElementById('serviceType').value,
   serviceDescription: document.getElementById('serviceDescription').value,
   hourMeter: document.getElementById('hourMeter').value,
   serviceDate: document.getElementById('serviceDate').value,
   techName: document.getElementById('techName').value
};

  sendFormDataToServer(formData);
});

function sendFormDataToServer(formData) {
  fetch('process_maintenance_data.php', {
    method: 'POST',
    body: JSON.stringify(formData)
  })
  .then(response => response.text())
  .then(data => {
    // Update the table with the received data (new row)
    updateTable(data);
  })
  .catch(error => {
    console.error(error);
    // Handle any errors that might occur during the request
  });
}

function updateTable(data) {
   // Assuming you have a table with an ID like 'equipment-log-table'
   const tableBody = document.getElementById('equipment-log-table').getElementsByTagName('tbody')[0];
 
   // Parse the JSON data from the server response
   const newEntryData = JSON.parse(data);
 
   // Create new table row element for the new entry
   const newRow = document.createElement('tr');
 
   // Create table cells for each data point in the new entry
   const entryLogNumCell = document.createElement('td');
   entryLogNumCell.classList.add('entry-log-num-col');
   entryLogNumCell.textContent = newEntryData.entryLogNum; // Assuming 'entryLogNum' is a property in the data
 
   const rentalIdCell = document.createElement('td');
   rentalIdCell.classList.add('rental-id-col');
   rentalIdCell.textContent = newEntryData.rentalId; // Assuming 'unitId' is a property in the data

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
   dateCell.textContent = newEntryData.date;

   const techNameCell = document.createElement('td');
   techNameCell.classList.add('tech-name-col');
   techNameCell.textContent = newEntryData.techName;
 
   const editColCell = document.createElement('td');
   editColCell.classList.add('edit-col');
   editColCell.innerHTML = '<div class="col-wrapper"><span class="edit-log-btn"><i class="fa-solid fa-pen-to-square"></i></span> <span class="delete-log-btn"><i class="fa-solid fa-trash-can"></i></span></div>';
 
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





 // 2nd Search Filter function
//  const searchFilter2 = () => {
//    debugger;
//    const columns = [
//      { name: 'entry#', index: 0, isFilter: false },
//      { name: 'unit#', index: 1, isFilter: true },
//      { name: 'unit-description', index: 2, isFilter: true },
//      { name: 'service-type', index: 3, isFilter: true },
//      { name: 'date-of-service', index: 4, isFilter: true },
//      { name: 'tech-name', index: 5, isFilter: true },
//    ]
//    const filterColumns = columns.filter(c => c.isFilter).map(c => c.index)
//    const trs = document.querySelectorAll(`#equipment-log-table tr:not(.header)`)
//    const filter = document.querySelector('#search-input').value
//    const regex = new RegExp(escape(filter), 'i')
//    const isFoundInTds = td => regex.test(td.innerHTML)
//    const isFound = childrenArr => childrenArr.some(isFoundInTds)
//    const setTrStyleDisplay = ({ style, children }) => {
//      style.display = isFound([
//        ...filterColumns.map(c => children[c]) // <-- filter Columns
//      ]) ? '' : 'none'
//    }
   
//    trs.forEach(setTrStyleDisplay)
//  }