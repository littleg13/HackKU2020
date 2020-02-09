<?php

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

    $username = $_GET['username'];
    $avatar = $_GET['avatar'];
    $id = $_GET['id'];

    $conn = new mysqli($mysqlServerName, $mysqlUsername, $mysqlPassword, $mysqlDB);

    if ($conn -> connect_error) {
        die("Connection to mysql failed.");
    }

    $uid = uniqid();
    $query = "INSERT INTO users (discord_uid, uid, username, avatar) VALUES ('$id', '$uid', '$username', '$avatar')";

    mysqli_query($conn, $query) or die(mysqli_error($conn));

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
header('Location: /indexReturn.html');
?>