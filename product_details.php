<?php
session_start();

if (!isset($_SESSION['username'])) {
    header("Location: login.php");
    exit();
}

include 'db_connection.php';

if (isset($_GET['id'])) {
    $product_id = $_GET['id'];
    $sql = "SELECT * FROM products WHERE id = $product_id";
    $result = $conn->query($sql);
    $product = $result->fetch_assoc();
} else {
    header("Location: dashboard.php");
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Product Details</title>
</head>
<body>
    <h2><?php echo $product['name']; ?></h2>
    <p>Category: <?php echo $product['category']; ?></p>
    <p>Price: $<?php echo $product['price']; ?></p>
    <p>Description: <?php echo $product['description']; ?></p>

    <a href="cart.php?add_to_cart=<?php echo $product['id']; ?>">Add to Cart</a>
    <a href="dashboard.php">Back to Dashboard</a>
</body>
</html>

<?php
$conn->close();
?>
