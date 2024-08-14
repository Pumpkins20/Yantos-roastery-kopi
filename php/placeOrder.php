<?php
require_once dirname(__FILE__) . '/midtrans-php-master/Midtrans.php';

// Set your Merchant Server Key
\Midtrans\Config::$serverKey = 'SB-Mid-server-2b62HDVzSWTjKGiGAViry7hn';
// Set to Development/Sandbox Environment (default). Set to true for Production Environment (accept real transaction).
\Midtrans\Config::$isProduction = false;
// Set sanitization on (default)
\Midtrans\Config::$isSanitized = true;
// Set 3DS transaction for credit card to true
\Midtrans\Config::$is3ds = true;

try {
    // Validasi apakah POST data ada dan tidak kosong
    if (empty($_POST['total']) || empty($_POST['items']) || empty($_POST['name']) || empty($_POST['email']) || empty($_POST['phone'])) {
        throw new Exception('Data POST tidak lengkap');
    }

    $items = json_decode($_POST['items'], true);
    
    // Cek apakah decoding JSON berhasil
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Format JSON tidak valid pada items');
    }

    $params = array(
        'transaction_details' => array(
            'order_id' => rand(),
            'gross_amount' => $_POST['total'],
        ),
        'item_details' => $items,
        'customer_details' => array(
            'first_name' => $_POST['name'],
            'email' => $_POST['email'],
            'phone' => $_POST['phone'],
        ),
    );

    $snapToken = \Midtrans\Snap::getSnapToken($params);

    // Debugging: Cek hasil dari Snap Token
    error_log('Snap Token: ' . $snapToken);

    echo $snapToken;

} catch (Exception $e) {
    // Tangkap dan log error
    error_log('Error: ' . $e->getMessage());
    echo 'Error: ' . $e->getMessage();
}
?>
