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