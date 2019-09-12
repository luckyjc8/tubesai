function OthelloGame() {
  BaseGame.call(this);
}
OthelloGame.prototype = Object.create(BaseGame.prototype);
OthelloGame.prototype.constructor = OthelloGame;

OthelloGame.prototype.getMovesString = function() {
  var movesString = '';
  for (var i = 0; i < game._moves.length; i += 1) {
    movesString += (i + 1) + '. ' + game._moves[i] + ' ';
  }
  return movesString;
};

OthelloGame.prototype._initializeBoard = function() {
  this._board = [];
  for (var x = 0; x < 8; x++) {
    this._board[x] = [];
  }

  for (var y = 0; y < 8; y++) {
    for (x = 0; x < 8; x++) {
      this._board[x][y] = null;
    }
  }

  this._board[3][3] = PlayerEnum.WHITE;
  this._board[3][4] = PlayerEnum.BLACK;
  this._board[4][4] = PlayerEnum.WHITE;
  this._board[4][3] = PlayerEnum.BLACK;
};

OthelloGame.prototype._getNumberOfDiscsMoveWouldFlip = function(x, y, player) {
  var count = 0;

  for (var deltaY = -1; deltaY <= 1; deltaY++) {
    for (var deltaX = -1; deltaX <= 1; deltaX++) {
      for (var distance = 1;; distance++) {
        var posX = x + (distance * deltaX);
        var posY = y + (distance * deltaY);

        if (posX < 0 || posX >= 8 || posY < 0 || posY >= 8) {
          break;
        }
        if (this._board[posX][posY] === null) {
          break;
        }

        if (this._board[posX][posY] === player) {
          count += distance - 1;
          break;
        }
      }
    }
  }

  return count;
};

OthelloGame.prototype._playMove = function(x, y, player) {
  this._board[x][y] = player;

  for (var deltaY = -1; deltaY <= 1; deltaY++) {
    for (var deltaX = -1; deltaX <= 1; deltaX++) {
      for (var distance = 1;; distance++) {
        var posX = x + (distance * deltaX);
        var posY = y + (distance * deltaY);

        if (posX < 0 || posX >= 8 || posY < 0 || posY >= 8) {
          break;
        }

        if (this._board[posX][posY] === null) {
          break;
        }

        if (this._board[posX][posY] === player) {
          for (distance -= 1; distance > 0; distance--) {
            posX = x + (distance * deltaX);
            posY = y + (distance * deltaY);
            this._board[posX][posY] = player;
          }
          break;
        }
      }
    }
  }
};

OthelloGame.prototype._hasMoves = function(player) {
  for (var y = 0; y < 8; y++) {
    for (var x = 0; x < 8; x++) {
      if (this._board[x][y] !== null) {
        continue;
      }
      if (this._getNumberOfDiscsMoveWouldFlip(x, y, player) > 0) {
        return true;
      }
    }
  }
  return false;
};

OthelloGame.prototype.getMoves = function(player) {
  var moves = [];
  for (var y = 0; y < 8; y++) {
    for (var x = 0; x < 8; x++) {
      if (this._board[x][y] !== null) {
        continue;
      }
      if (this._getNumberOfDiscsMoveWouldFlip(x, y, player) > 0) {
        moves.push([x, y]);
      }
    }
  }
  return moves;
};

OthelloGame.prototype._canPlayMove = function(x, y) {
  if (this._board[x][y] !== null) {
    return false;
  }
  return this._getNumberOfDiscsMoveWouldFlip(x, y, this._playerRole) > 0;
};

OthelloGame.prototype._getPlayerDiscs = function(player) {
  var score = 0;
  for (var x = 0; x < 8; x++) {
    for (var y = 0; y < 8; y++) {
      if (this._board[x][y] === player) {
        score++;
      }
    }
  }
  return score;
};

OthelloGame.prototype._updateGameScore = function() {
  $('#first-player-result').html(this._getPlayerDiscs(PlayerEnum.BLACK));
  $('#second-player-result').html(this._getPlayerDiscs(PlayerEnum.WHITE));
  this._drawDisc(
    'first_player_canvas',
    this._cellSize / 2,
    this._cellSize / 2,
    PlayerEnum.BLACK,
    this._cellSize * 15 / 40
  );
  this._drawDisc(
    'second_player_canvas',
    this._cellSize / 2,
    this._cellSize / 2,
    PlayerEnum.WHITE,
    this._cellSize * 15 / 40
  );
};

OthelloGame.prototype._convertMoveArrayToString = function(moveArray) {
  var r, c;
  r = String.fromCharCode(97 + moveArray[0]);
  c = moveArray[1] + 1;
  return '' + r + c;
};

OthelloGame.prototype._handleClickOnCell = function(x, y) {
  if (this._moveIndex !== this._moves.length) {
    return;
  }
  if (!this._isPlayerTurn()) {
    return;
  }
  if (!this._canPlayMove(x, y)) {
    return;
  }
  this._makeMove([x, y], this._playerRole);
  var moveStr = this._convertMoveArrayToString([x, y]);
  this._onMovePlayedCallback(moveStr, game._moves.length);
};

OthelloGame.prototype._makeMove = function(moveArray, player) {
  var x = moveArray[0], y = moveArray[1];
  this._playMove(x, y, player);

  if (this._hasMoves(PlayerEnum.getOtherPlayer(player))) {
    this._turn = PlayerEnum.getOtherPlayer(player);
  } else if (!this._hasMoves(player)) {
    this._turn = null;
  }

  this._addMoveToMoveSequence([x, y]);
};

OthelloGame.prototype._drawAccessibleBoard = function() {
  var html = '';
  for (var x = 0; x < 8; x++) {
    for (var y = 0; y < 8; y++) {
      var player = this._board[x][y];
      var discType = 'empty';
      if (player === PlayerEnum.BLACK) {
        discType = 'black';
      } else if (player === PlayerEnum.WHITE) {
        discType = 'white';
      }
      var buttonText = String.fromCharCode('a'.charCodeAt(0) + x) + (y + 1);
      var js = 'game._handleClickOnCell(' + x + ', ' + y + ')';
      buttonText += ' ' + discType;
      html += '<a onclick="' + js + '" href="#">';
      html += buttonText;
      html += '</a>';
    }
  }
  $('#canvas').html(html);
};

OthelloGame.prototype._drawBoard = function() {
  this._drawAccessibleBoard();
  var canvas = $('#canvas').get(0);
  var context = canvas.getContext('2d');

  var boardWidth = this._cellSize * 8;
  var boardHeight = this._cellSize * 8;
  var x, y;

  context.fillStyle = '#009067';
  context.fillRect(0, 0, boardWidth, boardHeight);

  context.fillStyle = 'black';
  context.lineWidth = 1;
  context.strokeStyle = 'black';
  for (x = 0; x <= 8; x++) {
    context.beginPath();
    context.moveTo(0, this._cellSize * x);
    context.lineTo(boardWidth, this._cellSize * x);
    context.stroke();

    context.beginPath();
    context.moveTo(this._cellSize * x, 0);
    context.lineTo(this._cellSize * x, boardHeight);
    context.stroke();
  }

  for (x = 0; x < 2; x++) {
    for (y = 0; y < 2; y++) {
      context.beginPath();
      context.arc(
        this._cellSize * 2 + x * (this._cellSize * 4),
        this._cellSize * 2 + y * (this._cellSize * 4),
        this._cellSize / 20,
        0,
        2 * Math.PI,
        false
      );
      context.fill();
      context.stroke();
    }
  }

  for (x = 0; x < 8; x++) {
    for (y = 0; y < 8; y++) {
      var player = this._board[x][y];
      if (player === null) {
        continue;
      }
      this._drawDisc(
        'canvas',
        x * this._cellSize + this._cellSize / 2,
        y * this._cellSize + this._cellSize / 2,
        player,
        this._cellSize * 17 / 40
      );
    }
  }

  if (
    this._showPossibleMoves &&
    this._isPlayerTurn() &&
    this._moveIndex === this._moves.length
  ) {
    for (x = 0; x < 8; x++) {
      for (y = 0; y < 8; y++) {
        if (this._canPlayMove(x, y)) {
          context.beginPath();
          context.arc(
            x * this._cellSize + this._cellSize / 2,
            y * this._cellSize + this._cellSize / 2,
            this._cellSize * 17 / 40,
            0,
            2 * Math.PI,
            false
          );
          context.strokeStyle = '#555555';
          context.stroke();
        }
      }
    }
  }

  // Draw mark on last placed disc
  if (this._moveIndex > 0) {
    var lastMove = this._moveIndex - 1;
    var lastMoveX = this._moves[lastMove].charCodeAt(0) - 97;
    var lastMoveY = this._moves[lastMove].charCodeAt(1) - 49;

    if (this._showLastMoveNumber) {
      context.fillStyle = '#ff0000';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.font = 'bold ' + this._cellSize / 4 + 'pt Arial';
      context.fillText(
        lastMove + 1,
        lastMoveX * this._cellSize + this._cellSize / 2,
        lastMoveY * this._cellSize + this._cellSize / 2
      );
    } else {
      context.beginPath();
      context.arc(
        lastMoveX * this._cellSize + this._cellSize / 2,
        lastMoveY * this._cellSize + this._cellSize / 2,
        this._cellSize / 20,
        0,
        2 * Math.PI,
        false
      );
      context.fillStyle = '#ff0000';
      context.fill();
      context.strokeStyle = '#ff0000';
      context.stroke();
    }
  }

  if (this._showCoordinatesOnBoard) {
    for (y = 0; y < 8; y++) {
      context.fillStyle = '#003d2b';
      context.textAlign = 'left';
      context.textBaseline = 'top';
      context.font = 'bold ' + this._cellSize / 5 + 'pt Arial';
      context.fillText(
        String.fromCharCode(97 + y),
        y * this._cellSize + 1,
        0
      );
      context.textBaseline = 'bottom';
      context.fillText(
        y + 1,
        1,
        (y + 1) * this._cellSize
      );
    }
  }
};

OthelloGame.prototype._drawDisc = function(canvas_id, x, y, player, radius) {
  var canvas = $('#' + canvas_id).get(0);
  var context = canvas.getContext('2d');

  context.beginPath();
  context.arc(
    x,
    y,
    radius,
    0,
    2 * Math.PI,
    false
  );
  context.fillStyle = player === PlayerEnum.WHITE ? '#f4fdfa' : '#131a18';
  context.fill();
  context.strokeStyle = '#333333';
  context.stroke();
};

OthelloGame.prototype._runGame = function() {
  this._initializeBoard();
  var player = PlayerEnum.BLACK;

  for (var i = 0; i < this._moveIndex; i += 1) {
    var moveX = this._moves[i].charCodeAt(0) - 97;
    var moveY = this._moves[i].charCodeAt(1) - 49;

    this._playMove(moveX, moveY, player);

    if (this._hasMoves(PlayerEnum.getOtherPlayer(player))) {
      player = PlayerEnum.getOtherPlayer(player);
    }
  }

  this._drawBoard();
};

var game = new OthelloGame();