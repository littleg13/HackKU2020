<?php

if (isset($_GET['username']) && isset($_GET['avatar']) && isset($_GET['id'])) {
    $mysqlServerName = 'mysql';
    $mysqlUsername = 'root';
    $mysqlPassword = 'password';

    $username = $_GET['username'];
    $avatar = $_GET['avatar'];
    $id = $_GET['id'];

    $conn = new mysqli($mysqlServerName, $mysqlUsername, $mysqlPassword);

    if ($conn -> connect_error) {
        die("Connection to mysql failed.");
    }

    $query = "INSERT INTO users (discord_id) VALUES ($username)";

    if ($conn->query($sql) === TRUE) {
        echo "Added user to database.";
    }

} else {
    echo "Not enough params."
}

$conn->close();
header('');
?>