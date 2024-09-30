<?php
session_start();

if (!isset($_SESSION['username'])) {
    header("Location: login.php");
    exit();
}

include 'db_connection.php';

// Check if product ID and category are provided
if (isset($_GET['delete']) && isset($_GET['category'])) {
    $product_id = $_GET['delete'];
    $category = $_GET['category'];

    switch ($category) {
        case 'hotels':
            $delete_sql = "DELETE FROM hotels WHERE id = ?";
            break;
        case 'meals':
            $delete_sql = "DELETE FROM meals WHERE id = ?";
            break;
        case 'ferries':
            $delete_sql = "DELETE FROM ferry_tickets WHERE id = ?";
            break;
        case 'tours':
            $delete_sql = "DELETE FROM tours WHERE id = ?";
            break;
        default:
            exit("Invalid category");
    }

    $stmt = $conn->prepare($delete_sql);
    $stmt->bind_param('i', $product_id);
    $stmt->execute();
    header("Location: admin_dashboard.php?section=$category");
    exit();
}

$conn->close();
?>
