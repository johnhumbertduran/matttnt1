<?php
include 'db_connection.php';

// Fetch available products
$sql = "SELECT * FROM products";
$result = $conn->query($sql);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Products</title>
</head>
<body>
    <h2>Available Products</h2>
    <?php
    if ($result->num_rows > 0) {
        while ($product = $result->fetch_assoc()) {
            echo "<p>" . $product['name'] . " - $" . $product['price'] . " <a href='cart.php?add_to_cart=" . $product['id'] . "'>Add to Cart</a></p>";
        }
    } else {
        echo "<p>No products found.</p>";
    }
    ?>

</body>
</html>

<?php
$conn->close();
?>
