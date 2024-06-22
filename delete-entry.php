<?php
header('Content-Type: application/json');

include 'db-conn-info.php';

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
    die();
}

$input = json_decode(file_get_contents('php://input'), true);
$entryLogNum = $input['id']; // id is the database column name

$sql = "DELETE FROM maintenance_log WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $entryLogNum);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["error" => "Error: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
