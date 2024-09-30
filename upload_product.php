<?php
session_start();

if (!isset($_SESSION['username'])) {
    header("Location: admin_login.php");
    exit();
}

include 'db_connection.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Common form data
    $name = $_POST['product_name'];
    $category = $_POST['category'];
    $description = $_POST['description'];

    // Category-specific fields
    $price = isset($_POST['price']) ? $_POST['price'] : 0;
    $adult_price = isset($_POST['adult_price']) ? $_POST['adult_price'] : 0;
    $kid_price = isset($_POST['kid_price']) ? $_POST['kid_price'] : 0;
    $hotel = isset($_POST['hotel']) ? $_POST['hotel'] : NULL;
    $checkin_time = isset($_POST['checkin_time']) ? $_POST['checkin_time'] : NULL;
    $checkout_time = isset($_POST['checkout_time']) ? $_POST['checkout_time'] : NULL;
    $features = isset($_POST['features']) ? implode(", ", $_POST['features']) : NULL;
    $capacity = isset($_POST['capacity']) ? $_POST['capacity'] : NULL;
    $route = isset($_POST['route']) ? $_POST['route'] : NULL;
    $schedule = isset($_POST['schedule']) ? $_POST['schedule'] : NULL;
    $vessel = isset($_POST['vessel']) ? $_POST['vessel'] : NULL;
    $class = isset($_POST['class']) ? $_POST['class'] : NULL;
    $ferry_adult_price = isset($_POST['ferry_adult_price']) ? $_POST['ferry_adult_price'] : 0;
    $senior_price = isset($_POST['senior_price']) ? $_POST['senior_price'] : 0;
    $ferry_kid_price = isset($_POST['ferry_kid_price']) ? $_POST['ferry_kid_price'] : 0;

    // Handle image upload
    $image = $_FILES['image'];
    $image_name = basename($image['name']);
    $image_tmp = $image['tmp_name'];
    $image_size = $image['size'];
    $image_error = $image['error'];
    $upload_dir = 'uploads/';
    $allowed_types = ['jpg', 'jpeg', 'png', 'gif'];

    // Check if the uploads directory exists, create if not
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0755, true);
    }

    // Validate image
    $image_ext = strtolower(pathinfo($image_name, PATHINFO_EXTENSION));
    if (in_array($image_ext, $allowed_types)) {
        if ($image_error === 0) {
            if ($image_size < 5000000) { // 5MB limit
                $image_new_name = uniqid('', true) . '.' . $image_ext;
                $image_path = $upload_dir . $image_new_name;

                // Move the uploaded file
                if (move_uploaded_file($image_tmp, $image_path)) {
                    // Insert product into the database, including category-specific fields
                    if ($category == 'Hotel') {
                        $sql = "INSERT INTO hotels (name, description, image_url, check_in, check_out, features, capacity, price_adult, price_kid) 
                                VALUES ('$name', '$description', '$image_path', '$checkin_time', '$checkout_time', '$features', '$capacity', '$adult_price', '$kid_price')";
                    } elseif ($category == 'Meals') {
                        $sql = "INSERT INTO meals (name, description, image_url, price) 
                                VALUES ('$name', '$description', '$image_path', '$price')";
                    } elseif ($category == 'Ferry Ticket') {
                        $sql = "INSERT INTO ferry_tickets (name, route, schedule, vessel, class, price_adult, price_senior_pwd_student, price_kid, description, image_url) 
                                VALUES ('$name', '$route', '$schedule', '$vessel', '$class', '$ferry_adult_price', '$senior_price', '$ferry_kid_price', '$description', '$image_path')";
                    }

                    if ($conn->query($sql) === TRUE) {
                        echo "Product added successfully!";
                        header("Location: admin_dashboard.php");
                    } else {
                        echo "Error: " . $sql . "<br>" . $conn->error;
                    }
                } else {
                    echo "Failed to upload the image.";
                }
            } else {
                echo "The image is too large. Maximum file size is 5MB.";
            }
        } else {
            echo "There was an error uploading the file.";
        }
    } else {
        echo "Invalid file type. Only JPG, JPEG, PNG, and GIF are allowed.";
    }

    $conn->close();
}
?>
