<!-- cart.php -->
<?php
session_start();
include 'db_connection.php';  

function getProductById($conn, $productId, $type) {
    if ($type === 'meal') {
        $stmt = $conn->prepare("SELECT * FROM meals WHERE id = ?");
    } elseif ($type === 'ferry') {
        $stmt = $conn->prepare("SELECT * FROM ferry_tickets WHERE id = ?");
    } elseif ($type === 'meals') {
        $stmt = $conn->prepare("SELECT * FROM meals WHERE id = ?");
    } elseif ($type === 'tour') {
        $stmt = $conn->prepare("SELECT * FROM tours WHERE id = ?");
    } else {
        return false;
    }

    $stmt->bind_param("i", $productId);
    $stmt->execute();
    return $stmt->get_result()->fetch_assoc();
}


function calculateNights($checkInDate, $checkOutDate) {
    $checkIn = new DateTime($checkInDate);
    $checkOut = new DateTime($checkOutDate);
    return $checkIn->diff($checkOut)->days;
}



if (isset($_GET['add_to_cart']) && isset($_GET['product_type'])) {
    $productId = $_GET['add_to_cart'];
    $productType = $_GET['product_type'];  // 'hotel', 'meal', 'ferry', 'tour'

  
    $product = getProductById($conn, $productId, $productType);

    if ($product) {
        
        if (!isset($_SESSION['cart'])) {
            $_SESSION['cart'] = [];
        }

        $item = [
            'product_id' => $productId,
            'product_type' => $productType,
            'product_name' => $product['name'],
            'product_image' => $product['image_url'],
            'quantity' => $_GET['quantity'] ?? 1,
        ];

        
        if ($productType === 'hotel') {
            $item['check_in_date'] = $_GET['check_in_date'] ?? null;
            $item['check_out_date'] = $_GET['check_out_date'] ?? null;
            $item['nights'] = calculateNights($item['check_in_date'], $item['check_out_date']);
        } elseif ($productType === 'ferry') {
            $item['schedule'] = $_GET['schedule'] ?? null;
            $item['class'] = $_GET['class'] ?? null;
        }

       
        $_SESSION['cart'][] = $item;

      
        echo json_encode(['success' => true, 'message' => 'Item added to cart']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Product not found']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Missing parameters']);
}

$conn->close();
?>