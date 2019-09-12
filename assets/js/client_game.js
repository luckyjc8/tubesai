var client_game = {

  _yourTurnText: null,
  _computersTurnText: null,
  _gameFinishedText:null,

  initializeClientGame: function(
    baseURL,
    startingTurn,
    yourTurnText,
    computersTurnText,
    gameFinishedText
  ) {
    this._yourTurnText = yourTurnText;
    this._computersTurnText = computersTurnText;
    this._gameFinishedText = gameFinishedText;
    game.initializeGame(
      baseURL,
      PlayerEnum.fromString(startingTurn), // role
      startingTurn, // turn
      [], // moves
      '', // winner
      true, // show possible moves
      false, // show last move number
      true, // show bigger board on wide screens
      false, // show coordinates on board
      this.onMovePlayed.bind(this)
    );
    this._refreshScreen();
  },

  onMovePlayed: function(move, num) {
    this._refreshScreen();
    var aiPlayer = PlayerEnum.getOtherPlayer(game._playerRole);
    if (game._turn == aiPlayer) {
      setTimeout(
        function() {
          this._makeAIMove();
        }.bind(this),
        500
      );
    }
  },

  _refreshScreen: function() {
    this._updateGameStatus();
    game._updateGameScore();
    game._drawBoard();
  },

  _updateGameStatus: function() {
    if (game._turn == game._playerRole) {
      $('#turn').html(this._yourTurnText);
    } else if (game._turn == PlayerEnum.getOtherPlayer(game._playerRole)) {
      $('#turn').html(this._computersTurnText);
    } else {
      $('#turn').html(this._gameFinishedText);
    }
  },

  _makeAIMove: function() {
    var aiPlayer = PlayerEnum.getOtherPlayer(game._playerRole);
    if (game._turn != aiPlayer) {
      return;
    }
    var possibleMoves = game.getMoves(aiPlayer);
    if (possibleMoves.length == 0) {
      return;
    }
    var moveIndex = Math.floor(Math.random() * possibleMoves.length);
    var chosenMove = possibleMoves[moveIndex];
    game._makeMove(chosenMove, aiPlayer);
    this._refreshScreen();
    if (game._turn == aiPlayer) {
      this.onMovePlayed(chosenMove, game._moves.length);
    }
  }
};