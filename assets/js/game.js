/* Definition of variables */
var MAX_ROW = 8;
var MAX_COL = 8;
var MIN_ROW_INDEX = 0;
var MIN_COL_INDEX = 0;

var playerEnum = {
    BLACK: 1,
    WHITE: 2,
    AVAILABLE: 3,
    EMPTY: 0
};

var blackScore = 2;
var whiteScore = 2;
var playerRole = playerEnum.WHITE;
var othelloBoard = {};

/* Function goes here */

function initializeGame () {
    /* First turn: User as WHITE */
    initializeBoard();
    setAllAvailableMoves(playerRole);
    drawEmptyBoard();
    drawPieces();
}

// Get what element is clicked.
window.onclick = e => {
    console.log(e.target.id);
    handleEventOnClick(e.target.id);
}

/* When player click on row. */
function handleEventOnClick (id) {
    if (id >= MIN_ROW_INDEX + 1  && id <= MAX_ROW * MAX_COL) {
        let row = convertIDToRow(row);
        let col = convertIDToCol(col);
        if (checkAvailableMove(row, col)) {
            flipPieces(playerRole, row, col);
            drawPieces();
            updateScore();
            changePlayerRole();
            setAllAvailableMoves(playerRole);
        }
    }
}


function initializeBoard () {
    for (let row = MIN_ROW_INDEX; row < MAX_ROW; row++ ) {
        othelloBoard[row] = {};
        for (let col = MIN_COL_INDEX; col < MAX_COL; col++ ) {
            othelloBoard[row][col] = {};
            othelloBoard[row][col]['piece'] = playerEnum.EMPTY;
            // Number of pieces flipped.
            othelloBoard[row][col]['score'] = 0;
        }
    }
    // Initialize pieces in the center.
    othelloBoard[3][3]['piece'] = playerEnum.WHITE;
    othelloBoard[3][4]['piece'] = playerEnum.BLACK;
    othelloBoard[4][3]['piece'] = playerEnum.BLACK;
    othelloBoard[4][4]['piece'] = playerEnum.WHITE;
}

function changePlayerRole () {
    if (playerRole === playerEnum.WHITE) {
        playerRole = playerEnum.BLACK;
    } else {
        playerRole = playerEnum.WHITE;
    }
}

function updateScore () {
    var blackScoreTemp = 0;
    var whiteScoreTemp = 0;
    for (let row = MIN_ROW_INDEX; row < MAX_ROW; row++ ) {
        for (let col = MIN_COL_INDEX; col < MAX_COL; col++) {
            if (getBoardPiece(row, col) === playerEnum.WHITE) {
                whiteScoreTemp++;
            } else if (getBoardPiece(row, col) === playerEnum.BLACK) {
                blackScoreTemp++;
            }
        }
    }
    /* set global variable */
    whiteScore = whiteScoreTemp;
    blackScore = blackScoreTemp;
}

function checkAvailableMove (row, col) {
    return (getBoardPiece(row, col) === playerEnum.AVAILABLE);
}

// Setters
function setBoardPiece (row, col, piece) {
    othelloBoard[row][col]['piece'] = piece;
}

function setBoardScore (row, col, score) {
    othelloBoard[row][col]['score'] = score;
}

function setAllAvailableMoves (playerRole) {
    for (let row = MIN_ROW_INDEX; row < MAX_ROW; row++) {
        for (let col = MIN_COL_INDEX; col < MAX_COL; col++) {
            score = getNumberOfFlippedPieces(playerRole, row, col);
            setBoardScore(row, col, score);
            if (score > 0) {
                setBoardPiece(row, col, playerEnum.AVAILABLE);
            }
        }
    }
}

// Change WHITE pieces to BLACK pieces and vice versa. Assumption: row and col values are already checked.
function flipPieces (playerRole, row, col) {
    for (let dirRow = -1; dirRow <= 1; dirRow++ ) {
        for (let dirCol = -1; dirCol <= 1; dirCol++ ) {
            flipPiecesByDirection(playerRole, row, col, dirRow, dirCol);
        }
    }
}

function flipPiecesByDirection (playerRole, row, col, dirRow, dirCol) {
    for (let distance = 0; ; distance++) {
        var posX = col + dirCol * (distance + 1);
        var posY = row + dirRow * (distance + 1);
        if (getBoardPiece(posY, posX) === playerEnum.EMPTY) {
            break;
        }
        if (posX < MIN_COL_INDEX || posY < MIN_ROW_INDEX) {
            break;
        }
        if (posX > MAX_COL || posY > MAX_ROW) {
            break;
        }
        if (getBoardPiece(posY, posX) === playerRole) {
            numberOfFlippedPieces = distance;
            break;
        }
        setBoardPiece(posY, posX, playerRole);
    }
}

// Getters
function getBoardPiece (row, col) {
    return othelloBoard[row][col]['piece'];
}

function getBoardScore (row, col) {
    return othelloBoard[row][col]['score'];
}

// playerRole = WHITE, BLACK
function getNumberOfFlippedPieces (playerRole, row, col) {
    var count = 0;
    for (let dirRow = -1; dirRow <= 1; dirRow++ ) {
        for (let dirCol = -1; dirCol <= 1; dirCol++ ) {
            count += getNumberOfFlippedPiecesByDirection(playerRole, row, col, dirRow, dirCol);
        }
    }
    return count;
}

function getNumberOfFlippedPiecesByDirection (playerRole, row, col, dirRow, dirCol) {
    var numberOfFlippedPieces = 0;
    for (let distance = 0; ; distance++) {
        var posX = col + dirCol * (distance + 1);
        var posY = row + dirRow * (distance + 1);
        if (getBoardPiece(posY, posX) === playerEnum.EMPTY) {
            break;
        }
        if (posX < MIN_COL_INDEX || posY < MIN_ROW_INDEX) {
            break;
        }
        if (posX > MAX_COL || posY > MAX_ROW) {
            break;
        }
        if (getBoardPiece(posY, posX) === playerRole) {
            numberOfFlippedPieces = distance;
            break;
        }
    }
    return numberOfFlippedPieces;
}

// Utils for rendering to frontend.
function convertToID (row, col) {
    return (row - MIN_ROW_INDEX) * MAX_ROW + col;
}

function convertIDToRow (id) {
    return Math.ceil(id);
}

function convertToCol (id) {
    return (id - Math.floor(convertIDToRow(id) / MAX_ROW));
}

/* VIEWS */

// Drawing function
function drawEmptyBoard () {
    var html = '<div class="container">';
    for ( let row = MIN_ROW_INDEX; row < MAX_ROW; row++ ) {
        html += '<div class="othello-row">';
        for (let col = MIN_COL_INDEX; col < MAX_COL; col++ ) {
            html += '<div id= ' + (row * MAX_ROW + col + 1) + ' class="square">';
            html += '</div>';
        }
        html += '</div>';
    }
    html += '</div>';
    document.body.innerHTML = html;
    console.log(html);
}

function drawPieces () {
    for (let row = MIN_ROW_INDEX; row < MAX_ROW; row++ ) {
        for (let col = MIN_COL_INDEX; col < MAX_COL; col++ ) {
            if (getBoardPiece(row, col) === playerEnum.WHITE) {
                drawPieceByName(row, col, 'white-piece');
            } else if (getBoardPiece(row, col) === playerEnum.BLACK) {
                drawPieceByName(row, col, 'black-piece');
            } else if (getBoardPiece(row, col) === playerEnum.AVAILABLE) {
                drawPieceByName(row, col, 'available-piece');
            }
        }
    }
}

function drawPieceByName (row, col, className) {
    var div = document.createElement('div');
    div.className = className;
    var id = convertToID(row, col);
    document.getElementById(id).appendChild(div);
}