<?php
session_start();

if (isset($_SESSION['cart']) && !empty($_SESSION['cart'])) {
    echo json_encode(['success' => true, 'items' => $_SESSION['cart']]);
} else {
    echo json_encode(['success' => false, 'error' => 'Cart is empty.']);
}
?>