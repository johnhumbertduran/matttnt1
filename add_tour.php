<?php
session_start();

if (!isset($_SESSION['username'])) {
    header("Location: login.php");
    exit();
}

include 'db_connection.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    $tour_type = $_POST['tour_type'];
    $inclusion = $_POST['inclusion'];
    $exclusion = $_POST['exclusion'];
    $duration = $_POST['duration'];
    $itinerary = $_POST['itinerary'];
    $description = $_POST['description'];
    $price_adult = $_POST['price_adult'];
    $price_kid = $_POST['price_kid'];

   
    if (isset($_FILES['thumbnail_image']) && $_FILES['thumbnail_image']['error'] === 0) {
        $thumbnail = $_FILES['thumbnail_image'];
        $thumbnailName = time() . '_thumbnail_' . $thumbnail['name'];
        move_uploaded_file($thumbnail['tmp_name'], $_SERVER['DOCUMENT_ROOT'] . '/matttnt/images/' . $thumbnailName);
        $thumbnailPath = 'images/' . $thumbnailName;
    } else {
        $thumbnailPath = null; 
    }

  
$galleryPaths = [];


if (isset($_FILES['gallery_images'])) {
    foreach ($_FILES['gallery_images']['tmp_name'] as $key => $tmpName) {
        
        if ($_FILES['gallery_images']['error'][$key] === 0) {
            $galleryName = time() . '_' . $key . '_' . $_FILES['gallery_images']['name'][$key]; 
            $targetPath = $_SERVER['DOCUMENT_ROOT'] . '/matttnt/images/' . $galleryName;
            
            
            if (move_uploaded_file($tmpName, $targetPath)) {
                $galleryPaths[] = 'images/' . $galleryName; 
            } else {
                echo "Failed to upload image: " . $_FILES['gallery_images']['name'][$key]; 
            }
        } else {
            echo "Error with file: " . $_FILES['gallery_images']['name'][$key]; 
        }
    }
}


$galleryImagesString = implode(',', $galleryPaths);


$sql = "INSERT INTO tours (tour_type, inclusion, exclusion, duration, itinerary, description, price_adult, price_kid, thumbnail_image, gallery_images) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param('ssssssssss', $tour_type, $inclusion, $exclusion, $duration, $itinerary, $description, $price_adult, $price_kid, $thumbnailPath, $galleryImagesString);


    
    if ($stmt->execute()) {
        header("Location: admin_dashboard.php?section=tours");
        exit();
    } else {
        echo "Error: " . $stmt->error;
    }
}
?>
