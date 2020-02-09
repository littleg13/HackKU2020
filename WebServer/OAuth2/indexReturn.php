<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <meta name="description" content="Mooxter">
    <meta name="author" content="Nick, Grady, Cameron, Eric">

    <link href="style.css" rel="stylesheet">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
</head>

<body>
  <nav class="navbar navbar-expand-lg navbar-light bg-light shadow fixed-top">
    <div class="container">
      <h4 class="navbar-brand" id="username_id">Welcome Back</h4>
      <img class="test rounded-circle" id="user_avatar" src="download.jpeg">
    </div>
  </nav>

  <header class="masthead">
    <div class="container h-100">
      <div class="row h-75 align-items-center">
        <div class="col-12 text-center">
          <h2 class="font-weight-light">Here's your XRP balance:</h2>
          <p class="lead" id="balance">
            <?php
              ini_set('display_errors', 1);
              ini_set('display_startup_errors', 1);
              error_reporting(E_ALL);
              session_start();
              $UID = $_SESSION['UID'];
              $balanceURL = 'http://xpringapi/api/v1/getBalance?id=$UID';
              $ch = curl_init();
              // set url 
              curl_setopt($ch, CURLOPT_URL, $balanceURL);
              // $output contains the output json
              $output = curl_exec($ch);
              // close curl resource to free up system resources 
              curl_close($ch);
              // {"name":"Baron","gender":"male","probability":0.88,"count":26}
              echo json_decode($output, true)['balance'];
            ?>
          </p>
        </div>
      </div>
    </div>
  </header>

  <div class="container h-100">
    <div class="row h-75 align-items-center">
      <div class="col-12 text-center">
        <h2 class="font-weight-light">Transaction History</h2>
        <p class="lead" id="balance">$$$</p>
      </div>
    </div>
  </div>

  <div class="mastfoot">
    <div class="inner">
      <p>Return to <a href="../index.html">Home</a>.</p>
    </div>
  </div>








    <script src="https://code.jquery.com/jquery-1.12.4.min.js" integrity="sha384-nvAa0+6Qg9clwYCGGPpDQLVpLNn0fRaROjHqs13t4Ggj3Ez50XnGQqc/r8MhnRDZ" crossorigin="anonymous"></script>
    <script>window.jQuery || document.write('<script src="../../assets/js/vendor/jquery.min.js"><\/script>')</script>
</body>
</html>