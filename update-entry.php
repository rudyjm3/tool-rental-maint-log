<?php

header('Content-Type: application/json');
// Database connection details
include 'db-conn-info.php';

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
    die();
}

$input = json_decode(file_get_contents('php://input'), true);
$entryLogNum = $input['entryLogNum'];
$rentalId = $input['rentalId'];
$equipmentDescription = $input['equipmentDescription'];
$serviceType = $input['serviceType'];
$serviceDescription = $input['serviceDescription'];
$hourMeter = $input['hourMeter'];
$serviceDate = $input['serviceDate'];
$techName = $input['techName'];

$sql = "UPDATE maintenance_log SET rental_id = ?, equipment_description = ?, service_type = ?, service_description = ?, hour_meter = ?, service_date = ?, tech_name = ? WHERE entry_log_num = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssssssi", $rentalId, $equipmentDescription, $serviceType, $serviceDescription, $hourMeter, $serviceDate, $techName, $entryLogNum);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["error" => "Error: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
