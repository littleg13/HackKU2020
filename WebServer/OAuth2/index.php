<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if (isset($_GET['username']) && isset($_GET['avatar']) && isset($_GET['id'])) {
    // $mysqlServerName = 'localhost';
    // $mysqlUsername = 'root';
    // $mysqlPassword = '';
    // $mysqlDB = 'mooxter';

    // ---------- PROD ----------
    $mysqlServerName = 'mysql';
    $mysqlUsername = 'root';
    $mysqlPassword = 'password';
    $mysqlDB = 'mooxter';
    session_start();
    $username = $_GET['username'];
    $avatar = $_GET['avatar'];
    $id = $_GET['id'];

    $conn = new mysqli($mysqlServerName, $mysqlUsername, $mysqlPassword, $mysqlDB);

    if ($conn -> connect_error) {
        die("Connection to mysql failed.");
    }

    $uid = uniqid();
    $_SESSION['UID'] = $uid;
    $sql = "SELECT discord_uid FROM users WHERE discord_uid = '$id'";
    $result = $conn->query($sql);

    if($result->num_rows < 1) {
        $query = "INSERT INTO users (discord_uid, uid, username, avatar) VALUES ('$id', '$uid', '$username', '$avatar')";
        mysqli_query($conn, $query) or die(mysqli_error($conn));
        $balanceURL = "http://xpringapi/api/v1/newWallet/$UID";
        $ch = curl_init();
        // set url 
        curl_setopt($ch, CURLOPT_URL, $balanceURL);
        // $output contains the output json
        $output = curl_exec($ch);
        // close curl resource to free up system resources 
        curl_close($ch);
    }

    // if ($conn->query($query) === TRUE) {
    //     echo "Added user to database.";
    // }
    if ($conn->connect_errno) {
        printf("Connect failed: %s\n", $conn->error);
        exit();
    }

} else {
    echo "Not enough params.";
}

$conn->close();
header('Location: /OAuth2/indexReturn.php');
?>