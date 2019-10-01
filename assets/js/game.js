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

/* Main program */
initializeGame();

/* Function goes here */

function initializeGame () {
    /* First turn: User as WHITE */
    initializeBoard();
    // setBoardEvaluationFunction(playerRole);
    // console.log(othelloBoard);
    console.log(getNumberOfFlippedPieces(playerRole, 3, 6));
    drawEmptyBoard();
    drawPieces();
}

// Get what element is clicked.
window.onclick = e => {
    console.log(e.target.id);
    handleEventOnClick(e.target.id);
}

/* When player click on row. */
function handleEventOnClick (elementID) {
    if (elementID >= MIN_ROW_INDEX + 1  && elementID <= MAX_ROW * MAX_COL) {
        let row = convertIDToRow(elementID);
        let col = convertIDToCol(elementID);
        // Check if available(row, col) is clicked.
        if (checkAvailableMove(row, col)) {
            setAvailablePiecesToEmpty();
            // Proceed to change WHITE to BLACK or vice versa.
            flipPieces(playerRole, row, col);
            updateScore();
            changePlayerRole();
            // Render View
            drawPieces();
            setBoardEvaluationFunction(playerRole);
        }
    }
}


function initializeBoard () {
    for (let row = MIN_ROW_INDEX; row < MAX_ROW; row++ ) {
        othelloBoard[row] = {};
        for (let col = MIN_COL_INDEX; col < MAX_COL; col++ ) {
            othelloBoard[row][col] = {};
            setBoardPiece(row, col, playerEnum.EMPTY);
            // Number of pieces flipped.
            setBoardScore(row, col, 0);
        }
    }
    // Initialize pieces in the center.
    setBoardPiece(3, 3, playerEnum.WHITE);
    setBoardPiece(3, 4, playerEnum.BLACK);
    setBoardPiece(4, 3, playerEnum.BLACK);
    setBoardPiece(4, 4, playerEnum.WHITE);
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

function setBoardEvaluationFunction (playerRole) {
    console.log('playerRole____: ', playerRole);
    for (let row = MIN_ROW_INDEX; row < MAX_ROW; row++) {
        for (let col = MIN_COL_INDEX; col < MAX_COL; col++) {
            var score = getNumberOfFlippedPieces(playerRole, row, col);
            // setBoardScore(row, col, score);
            if (score > 0) {
                setBoardPiece(row, col, playerEnum.AVAILABLE);
            }
        }
    }
}

function setAvailablePiecesToEmpty () {
    for (let row = MIN_ROW_INDEX; row < MAX_ROW; row++) {
        for (let col = MIN_COL_INDEX; col < MAX_COL; col++) {
            if (getBoardPiece(row, col) === playerEnum.AVAILABLE) {
                setBoardPiece(row, col, playerEnum.EMPTY);
            }
        }
    }
}

// Change WHITE pieces to BLACK pieces and vice versa. Assumption: row and col values are already checked.
function flipPieces (playerRole, row, col) {
    for (let dirRow = -1; dirRow <= 1; dirRow++ ) {
        for (let dirCol = -1; dirCol <= 1; dirCol++ ) {
            if (dirRow !== 0 || dirCol !== 0) {
                flipPiecesByDirection(playerRole, row, col, dirRow, dirCol);
            }
        }
    }
}

function flipPiecesByDirection (playerRole, row, col, dirRow, dirCol) {
    for (let distance = 0; ; distance++) {
        var posX = col + dirCol * (distance + 1);
        var posY = row + dirRow * (distance + 1);
        if (isIndexOutBound(posX, posY)) {
            break;
        }
        if (getBoardPiece(posY, posX) === playerEnum.EMPTY) {
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
            if (dirRow !== 0 || dirCol !== 0) {
                console.log('dirRow, dirCol ', dirRow, dirCol);
                count += getNumberOfFlippedPiecesByDirection(playerRole, row, col, dirRow, dirCol);
            }
        }
    }
    return count;
}

function getNumberOfFlippedPiecesByDirection (playerRole, row, col, dirRow, dirCol) {
    var numberOfFlippedPieces = 0;
    for (let score = 0; ; score++) {
        var posX = col + dirCol * (score + 1);
        var posY = row + dirRow * (score + 1);
        if (isIndexOutBound(posX, posY)) {
            break;
        } 
        if (getBoardPiece(posY, posX) === playerEnum.EMPTY) {
            break;
        }
        if (getBoardPiece(posY, posX) === playerRole) {
            numberOfFlippedPieces = score;
            break;
        }
        // console.log('score: ', score);
    }
    return numberOfFlippedPieces;
}

// Utils for rendering to frontend.
function convertToID (row, col) {
    return (row - MIN_ROW_INDEX) * MAX_ROW + col;
}

function isIndexOutBound (posX, posY) {
    if (posX < MIN_COL_INDEX || posY < MIN_ROW_INDEX || posX >= MAX_COL || posY >= MAX_ROW) {
        return true;
    } else {
        return false;
    }
}

function convertIDToRow (id) {
    return Math.ceil(id);
}

function convertIDToCol (id) {
    return (id - Math.floor(convertIDToRow(id) / MAX_ROW));
}

/* VIEWS */
// Drawing functions:

// This function draws initial state of the board:
function drawEmptyBoard () {
    var html = '<div class="container">';
    for ( let row = MIN_ROW_INDEX; row < MAX_ROW; row++ ) {
        html += '<div class="othello-row">';
        for (let col = MIN_COL_INDEX; col < MAX_COL; col++ ) {
            html += '<div id= ' + (row * MAX_ROW + col) + ' class="square">';
            html += '</div>';
        }
        html += '</div>';
    }
    html += '</div>';
    document.body.innerHTML = html;
    // console.log(html);
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
    // Reset div element:
    document.getElementById(id).innerHTML = '';
    // Then append new div element (WHITE, BLACK, AVAILABLE)
    document.getElementById(id).appendChild(div);
}