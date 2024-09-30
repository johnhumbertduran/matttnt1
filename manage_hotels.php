<?php
session_start();

if (!isset($_SESSION['username'])) {
    header("Location: admin_login.php");
    exit();
}

include 'db_connection.php';

$sql = "SELECT id, name, price_adult, price_kid, capacity, check_in, check_out, inclusions, exclusions, policy, description, image_url FROM hotels";
$result = $conn->query($sql);

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Hotels - Matt Travel and Tours</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        .hotel-image {
            width: 100px;
            height: auto;
        }
        .table-responsive {
            overflow-x: auto;
        }
        .table td {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    </style>
</head>
<body>
    <div class="container mt-4">
        <h2>Manage Hotels</h2>
        <a href="add_hotel.php" class="btn btn-primary mb-3">Add New Hotel</a>
        <div class="table-responsive">
            <table class="table table-bordered table-hover">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Image</th>
                        <th>Hotel Name</th>
                        <th>Adult Price</th>
                        <th>Kid Price</th>
                        <th>Capacity</th>
                        <th>Check-In</th>
                        <th>Check-Out</th>
                        <th>Inclusions</th>
                        <th>Exclusions</th>
                        <th>Policy</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    if ($result->num_rows > 0) {
                        while ($hotel = $result->fetch_assoc()) {
                            echo "<tr>";
                            echo "<td>" . htmlspecialchars($hotel['id']) . "</td>";
                            echo "<td><img src='images/" . htmlspecialchars($hotel['image_url']) . "' class='hotel-image' alt='Hotel Image'></td>";
                            echo "<td>" . htmlspecialchars($hotel['name']) . "</td>";
                            echo "<td>" . htmlspecialchars($hotel['price_adult']) . "</td>";
                            echo "<td>" . htmlspecialchars($hotel['price_kid']) . "</td>";
                            echo "<td>" . htmlspecialchars($hotel['capacity']) . "</td>";
                            echo "<td>" . htmlspecialchars($hotel['check_in']) . "</td>";
                            echo "<td>" . htmlspecialchars($hotel['check_out']) . "</td>";
                            echo "<td>" . htmlspecialchars(substr($hotel['inclusions'], 0, 50)) . "...</td>";
                            echo "<td>" . htmlspecialchars(substr($hotel['exclusions'], 0, 50)) . "...</td>";
                            echo "<td>" . htmlspecialchars(substr($hotel['policy'], 0, 50)) . "...</td>";
                            echo "<td>" . htmlspecialchars(substr($hotel['description'], 0, 50)) . "...</td>";
                            echo "<td>
                                    <a href='edit_hotel.php?id=" . htmlspecialchars($hotel['id']) . "' class='btn btn-warning btn-sm'>Edit</a> 
                                    <a href='delete_hotel.php?id=" . htmlspecialchars($hotel['id']) . "' class='btn btn-danger btn-sm'>Delete</a>
                                  </td>";
                            echo "</tr>";
                        }
                    } else {
                        echo "<tr><td colspan='13' class='text-center'>No hotels found.</td></tr>";
                    }
                    ?>
                </tbody>
            </table>
        </div>
    </div>
</body>
</html>

<?php
$conn->close();
?>
