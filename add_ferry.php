<?php

include 'db_connection.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve form inputs
    $name = $_POST['name'];
    $description = $_POST['description'];
    $route = $_POST['route'];
    $vessel = $_POST['vessel'];
    $schedules = implode(', ', $_POST['schedules']); 
    $travel_time = $_POST['travel_time'];
    // Handle Image Upload
if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
    $image = $_FILES['image'];
    $imageName = time() . '_' . $image['name']; 
    $imagePath = 'images/' . $imageName; 

    
    move_uploaded_file($image['tmp_name'], $_SERVER['DOCUMENT_ROOT'] . '/matttnt/images/' . $imageName);
} else {
    $imagePath = null; 
}

    // Prices for Fast Craft
    $tourist_adult_price = isset($_POST['tourist_adult_price']) ? $_POST['tourist_adult_price'] : null;
    $tourist_senior_price = isset($_POST['tourist_senior_price']) ? $_POST['tourist_senior_price'] : null;
    $tourist_kid_price = isset($_POST['tourist_kid_price']) ? $_POST['tourist_kid_price'] : null;
    $tourist_toddler_price = isset($_POST['tourist_toddler_price']) ? $_POST['tourist_toddler_price'] : null;
    $business_adult_price = isset($_POST['business_adult_price']) ? $_POST['business_adult_price'] : null;
    $business_senior_price = isset($_POST['business_senior_price']) ? $_POST['business_senior_price'] : null;
    $business_kid_price = isset($_POST['business_kid_price']) ? $_POST['business_kid_price'] : null;
    $business_toddler_price = isset($_POST['business_toddler_price']) ? $_POST['business_toddler_price'] : null;

    // Prices for RORO
    $economy_adult_price = isset($_POST['economy_adult_price']) ? $_POST['economy_adult_price'] : null;
    $economy_senior_price = isset($_POST['economy_senior_price']) ? $_POST['economy_senior_price'] : null;
    $economy_kid_price = isset($_POST['economy_kid_price']) ? $_POST['economy_kid_price'] : null;
    $economy_toddler_price = isset($_POST['economy_toddler_price']) ? $_POST['economy_toddler_price'] : null;
    $vip_adult_price = isset($_POST['vip_adult_price']) ? $_POST['vip_adult_price'] : null;
    $vip_senior_price = isset($_POST['vip_senior_price']) ? $_POST['vip_senior_price'] : null;
    $vip_kid_price = isset($_POST['vip_kid_price']) ? $_POST['vip_kid_price'] : null;
    $vip_toddler_price = isset($_POST['vip_toddler_price']) ? $_POST['vip_toddler_price'] : null;

    // Insert data into the ferry_tickets table
    $sql = "INSERT INTO ferry_tickets (name, description, route, schedule, vessel, travel_time, image_url,
            tourist_adult_price, tourist_senior_price, tourist_kid_price, tourist_toddler_price, 
            business_adult_price, business_senior_price, business_kid_price, business_toddler_price, 
            economy_adult_price, economy_senior_price, economy_kid_price, economy_toddler_price, 
            vip_adult_price, vip_senior_price, vip_kid_price, vip_toddler_price) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)";

    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssssssdddddddddddddddd", $name, $description, $route, $schedules, $vessel, $travel_time, $imagePath,
                      $tourist_adult_price, $tourist_senior_price, $tourist_kid_price, $tourist_toddler_price, 
                      $business_adult_price, $business_senior_price, $business_kid_price, $business_toddler_price, 
                      $economy_adult_price, $economy_senior_price, $economy_kid_price, $economy_toddler_price, 
                      $vip_adult_price, $vip_senior_price, $vip_kid_price, $vip_toddler_price);

    
    if ($stmt->execute()) {
        echo "New ferry ticket added successfully!";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }

    
    $stmt->close();
    $conn->close();
}
?>
