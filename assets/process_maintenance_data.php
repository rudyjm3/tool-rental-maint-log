<?php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $name = $_POST['name'];
  $email = $_POST['email'];
  $phone = $_POST['phone'];
  $city = $_POST['city'];
  $country = $_POST['country'];

  // Database connection details (replace with your own)
  $hostname = 'localhost';
  $username = 'u207292155_rudyjm3';
  $password = 'Matrix_1645';
  $dbname = 'u207292155_toollog';

  // Create connection
  $conn = new mysqli($hostname, $username, $password, $dbname);

  // Check connection
  if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
  }

  // Prepared statement to prevent SQL injection
  $sql = "INSERT INTO your_table_name (name, email, phone, city, country) VALUES (?, ?, ?, ?, ?)";
  $stmt = $conn->prepare($sql);
  $stmt->bind_param("sssss", $name, $email, $phone, $city, $country);

  if ($stmt->execute()) {
    $newRow = "<tr><td>$name</td><td>$email</td><td>$phone</td><td>$city</td><td>$country</td></tr>";
    echo $newRow;
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }

  $stmt->close();
  $conn->close();
}