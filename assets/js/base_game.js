function BaseGame() {
  this._cellSize = 40;
  this._showPossibleMoves = false;
  this._onMovePlayedCallback = null;
  this._baseURL = null;
}

BaseGame.prototype.initializeGame = function(
  baseURL,
  role,
  turn,
  moves,
  winner,
  showPossibleMoves,
  showLastMoveNumber,
  showBiggerBoardOnWideScreens,
  showCoordinatesOnBoard,
  onMovePlayedCallback
) {
  var window_width = $(window).width();
  if (window_width >= 800 && showBiggerBoardOnWideScreens) {
    this._cellSize = 70;
  }
  $('#game-header').css('maxWidth', this._ * 8);
  this._setupCanvas('#canvas', this._cellSize * 8, this._cellSize * 8);
  this._setupCanvas('#first_player_canvas', this._cellSize, this._cellSize);
  this._setupCanvas('#second_player_canvas', this._cellSize, this._cellSize);

  this._baseURL = baseURL;
  this._playerRole = role;
  this._turn = PlayerEnum.fromString(turn);
  this._moves = moves;
  this._moveIndex = this._moves.length;
  this._winner = winner;

  this._showPossibleMoves = showPossibleMoves;
  this._showLastMoveNumber = showLastMoveNumber;
  this._showCoordinatesOnBoard = showCoordinatesOnBoard;

  this._onMovePlayedCallback = onMovePlayedCallback;

  this._runGame();
  this._addCanvasEventListeners();
};

BaseGame.prototype._setupCanvas = function(canvas_id, width, height) {
  var canvas = $(canvas_id).get(0);
  var context = canvas.getContext('2d');
  var dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  context.scale(dpr, dpr);
};

BaseGame.prototype.goToLastMove = function() {
  this._moveIndex = this._moves.length;
  this._runGame();
};

BaseGame.prototype.goToFirstMove = function() {
  this._moveIndex = 0;
  this._runGame();
};

BaseGame.prototype.goToNextMove = function() {
  if (this._moveIndex < this._moves.length) {
    this._moveIndex += 1;
    this._runGame();
  }
};

BaseGame.prototype.goToPreviousMove = function() {
  if (this._moveIndex > 0) {
    this._moveIndex -= 1;
    this._runGame();
  }
};

BaseGame.prototype._isPlayerTurn = function() {
  return this._playerRole !== null &&
    this._playerRole === this._turn;
};

BaseGame.prototype._addMoveToMoveSequence = function(moveArray) {
  this._moves.push(this._convertMoveArrayToString(moveArray));
  this._moveIndex += 1;
};

BaseGame.prototype._addCanvasEventListeners = function() {
  var canvas = $('#canvas').get(0);
  canvas.addEventListener('click', (function(evt) {
    var rect = canvas.getBoundingClientRect();
    var cellX = Math.floor((evt.clientX - rect.left) / this._cellSize);
    var cellY = Math.floor((evt.clientY - rect.top) / this._cellSize);
    if (cellX >= 0 && cellX < 8 && cellY >= 0 && cellY < 8) {
      this._handleClickOnCell(cellX, cellY);
    }
  }).bind(this));
};