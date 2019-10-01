/* Definition of variables */
var MAX_ROW = 8;
var MAX_COL = 8;
var MIN_ROW_INDEX = 0;
var MIN_COL_INDEX = 0;
var DEPTH = 3;
var RANDOM = false;

var playerEnum = {
    BLACK: 1,
    WHITE: 2,
    AVAILABLE: 3,
    EMPTY: 0
};

var blackScore = 2;
var whiteScore = 2;
var playerStart = playerEnum.BLACK;
var playerRole = playerStart;
var othelloBoard = {};

/* Main program */
initializeGame();

/* Function goes here */
function initializeGame () {
    /* First turn: User as WHITE */
    initializeBoard();
    setAvailablePieces(playerRole);
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
    if (elementID >= MIN_ROW_INDEX  && elementID <= MAX_ROW * MAX_COL) {
        let row = convertIDToRow(elementID);
        let col = convertIDToCol(elementID);
        // Check if available(row, col) is clicked.
        if (RANDOM){
            while(!checkAvailableMove(row, col)){
                row = Math.floor((Math.random() * 8));
                col = Math.floor((Math.random() * 8));
            }    
        }
        if (checkAvailableMove(row, col)) {
            setAvailablePiecesToEmpty();

            flipPieces(playerRole, row, col);
            changePlayerRole();
            setAvailablePieces(playerRole);
            drawPieces();

            var rootNode = new Node(null, othelloBoard);
            generateTree(rootNode, DEPTH, playerStart !== playerEnum.WHITE);
            giveValueToLeaves(rootNode, evaluationFunction);
            miniMax(rootNode, DEPTH, true, -Infinity, Infinity);
            // AI chooses this move:
            for (let row = MIN_ROW_INDEX; row < MAX_ROW; row++ ) {
                for (let col = MIN_COL_INDEX; col < MAX_COL; col++) {
                    othelloBoard[row][col] = rootNode.childNodes[rootNode.bestNextNode].boardState[row][col];
                }
            }
            setAvailablePiecesToEmpty();
            changePlayerRole();
            // Render View
            setAvailablePieces(playerRole);
            drawPieces();
        }
    }
}

function initializeBoard () {
    for (let row = MIN_ROW_INDEX; row < MAX_ROW; row++ ) {
        othelloBoard[row] = {};
        for (let col = MIN_COL_INDEX; col < MAX_COL; col++ ) {
            setBoardPiece(row, col, playerEnum.EMPTY);
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

function evaluationFunction (othelloBoard) {
    var scoreTemp = 0;
    for (let row = MIN_ROW_INDEX; row < MAX_ROW; row++ ) {
        for (let col = MIN_COL_INDEX; col < MAX_COL; col++) {
            if (othelloBoard[row][col] === playerRole) {
                scoreTemp++;
            }
        }
    }
    return scoreTemp;
}

function checkAvailableMove (row, col) {
    return (getBoardPiece(row, col) === playerEnum.AVAILABLE);
}

// Getters
function getBoardPiece (row, col) {
    return othelloBoard[row][col];
}

// Setters
function setBoardPiece (row, col, piece) {
    othelloBoard[row][col] = piece;
}

function setAvailablePieces (playerRole) {
    var score = 0;
    var winCondition = 0;
    for (let row = MIN_ROW_INDEX; row < MAX_ROW; row++) {
        for (let col = MIN_COL_INDEX; col < MAX_COL; col++) {
            score = getNumberOfFlippedPieces(playerRole, row, col);
            winCondition += score;
            if (score > 0 && getBoardPiece(row, col) !== playerEnum.BLACK && getBoardPiece(row, col) !== playerEnum.WHITE) {
                setBoardPiece(row, col, playerEnum.AVAILABLE);
            }
        }
    }
    if (winCondition === 0){
        win ();
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
            flipPiecesByDirection(playerRole, row, col, dirRow, dirCol);
        }
    }
}

function flipPiecesByDirection (playerRole, row, col, dirRow, dirCol) {
    var limit = getNumberOfFlippedPiecesByDirection(playerRole, row, col, dirRow, dirCol);
    for (let distance = 0; distance<limit; distance++) {
        let posX = col + dirCol * (distance + 1);
        let posY = row + dirRow * (distance + 1);
        setBoardPiece(posY, posX, playerRole);
    }
    if (dirRow === 0 && dirCol === 0){
        let posX = col + dirCol;
        let posY = row + dirRow;
        setBoardPiece(posY, posX, playerRole);
    }
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
    if (dirRow === 0 && dirCol === 0){
        return 0;
    }
    for (let score = 0; ; score++) {
        let posX = col + dirCol * (score + 1);
        let posY = row + dirRow * (score + 1);
        if (isIndexOutOfBound(posX, posY) || getBoardPiece(posY, posX) === playerEnum.EMPTY || getBoardPiece(posY, posX) === playerEnum.AVAILABLE) {
            break;
        }
        if (getBoardPiece(posY, posX) === playerRole) {
            numberOfFlippedPieces = score;
            break;
        }
    }
    return numberOfFlippedPieces;
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
            } else {
                drawPieceByName(row, col, '')
            }
        }
    }
}

function drawPieceByName (row, col, className) {
    var id = convertToID(row, col);
    // Reset div element:
    document.getElementById(id).innerHTML = '';
    if (className !== '') {
        var div = document.createElement('div');
        div.className = className;
        // Then append new div element (WHITE, BLACK, AVAILABLE)
        document.getElementById(id).appendChild(div);
    }
}

// Utils for rendering to frontend.
function convertToID (row, col) {
    return (row - MIN_ROW_INDEX) * MAX_ROW + col;
}

function isIndexOutOfBound (posX, posY) {
    return (posX < MIN_COL_INDEX || posY < MIN_ROW_INDEX || posX >= MAX_COL || posY >= MAX_ROW);
}

function convertIDToRow (id) {
    return Math.floor(id/MAX_ROW);
}

function convertIDToCol (id) {
    return Math.floor(id - convertIDToRow(id)*MAX_ROW);
}

function getIDFromAvailableDiv (id) {
    return parseInt(id.replace('child' , ''));
}

function isDivAvailable (id) {
    return (id.substring(0, 5) === 'child');
}