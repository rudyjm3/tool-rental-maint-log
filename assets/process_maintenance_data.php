<?php

// Database connection details (replace with your actual credentials)
$servername = "localhost";
$username = "u207292155_rudyjm3";
$password = "Matrix_1645";
$dbname = "u207292155_toollog";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

// Get form data from POST request (assuming data is sent as JSON)
$data = json_decode(file_get_contents('php://input'), true);

// Prepare SQL insert statement
$sql = "INSERT INTO maintenance_log (rental_id, equipment_description, service_type, service_description, hour_meter, service_date, tech_name)
VALUES (?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("sssssss", $data["rentalId"], $data["equipmentDescription"], $data["serviceType"], $data["serviceDescription"], 
    $data["hourMeter"], $data["serviceDate"], $data["techName"]);

if ($stmt->execute()) {
  $newEntryId = $conn->insert_id;

  // Assuming you have a table with columns matching the database table
  $newEntryData = array(
    "entryLogNum" => $newEntryId, // Assuming 'entryLogNum' is an auto-incrementing ID
    "unitId" => $data["rentalId"], // Assuming 'unitId' maps to 'rental_id' in the database
    "equipmentDescription" => $data["equipmentDescription"],
    "serviceType" => $data["serviceType"],
    "serviceDescription" => $data["serviceDescription"],
    "hourMeter" => $data["hourMeter"],
    "date" => $data["serviceDate"],
    "techName" => $data["techName"]
  );

  // Encode the new entry data as JSON for sending back to the client-side JavaScript
  echo json_encode($newEntryData);
} else {
  echo "Error: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
