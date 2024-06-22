<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');

// Database connection details
include 'db-conn-info.php';

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    error_log("Connection failed: " . $conn->connect_error);
    echo json_encode(["error" => "An error occurred while connecting to the database. Please try again later."]);
    die();
}

// Get form data from POST request
$inputData = json_decode(file_get_contents('php://input'), true);
$rentalId = $inputData["rentalId"];
$equipmentDescription = $inputData["equipmentDescription"];
$serviceType = $inputData["serviceType"];
$serviceDescription = $inputData["serviceDescription"];
$hourMeter = $inputData["hourMeter"];
$serviceDate = $inputData["serviceDate"];
$techName = $inputData["techName"];

// Prepare SQL insert statement
$sql = "INSERT INTO maintenance_log (rental_id, equipment_description, service_type, service_description, hour_meter, service_date, tech_name) VALUES (?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("sssssss", $rentalId, $equipmentDescription, $serviceType, $serviceDescription, $hourMeter, $serviceDate, $techName);

if ($stmt->execute()) {
    $newEntryId = $conn->insert_id;
    $newEntryData = array(
        "entryLogNum" => $newEntryId,
        "rentalId" => $rentalId,
        "equipmentDescription" => $equipmentDescription,
        "serviceType" => $serviceType,
        "serviceDescription" => $serviceDescription,
        "hourMeter" => $hourMeter,
        "serviceDate" => $serviceDate,
        "techName" => $techName
    );
    echo json_encode($newEntryData);
} else {
    error_log("SQL Error: " . $stmt->error);
    echo json_encode(["error" => "Error: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>

