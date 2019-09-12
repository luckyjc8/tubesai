<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
    />
    <meta
      name="description"
      content="Tugas IF3170 - Inteligensi Buatan. Permainan Othello menggunakan AI sederhana."
    >
    <link href="assets/css/bootstrap.min.css" rel="stylesheet"type="text/css">
    <link href="assets/css/othello.css" rel="stylesheet" type="text/css"
    >
    <title>Tubes AI</title>
    <script src="assets/js/player_enum.js"></script>
    <script src="assets/js/client_game.js">\</script>
    <script src="assets/js/base_game.js"></script>
    <script src="assets/js/othello_game.js"></script>
    <script src="assets/js/jquery.min.js"></script>
</head>

<body>
    <div class="body-container">
    <center><h1>Tubes AI - Othello</h1></center>
    <center>
        <div id="game-header" class="panel panel-default margin-top-4px margin-bottom-8px">
            <div class="panel-body padding-4px">
                <div class="row">
                    <div class="col-xs-6">
                        <canvas
                            id="first_player_canvas"
                            width="40"
                            height="40"
                            class="vertical-align-middle"
                        >
                        </canvas>
                        <span id="first-player-result" height="40"></span>
                    </div>
                    <div class="col-xs-6">
                        <canvas
                            id="second_player_canvas"
                            width="40"
                            height="40"
                            class="vertical-align-middle"
                        >
                        </canvas>
                        <span id="second-player-result"></span>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-6"></div>
                    <div class="col-xs-6"></div>
                </div>
                <div class="row">
                    <div class="col-xs-12">
                        <span class="badge">
                            <div id="turn"></div>
                        </span>
                    </div>
                </div>
                <div class="row margin-bottom-4px"></div>
            </div>
        </div>
    </center>
    <center><canvas id="canvas"></canvas></center>
    <script>
      client_game.initializeClientGame(
        "Tubes AI - Othello",
        <?php echo('"'.(isset($_GET['black']) ? 'black' : 'white').'"');?>,
        "Giliran Anda",
        "Giliran AI",
        "Permainan Selesai",
      );
    </script>
</body>
</html>