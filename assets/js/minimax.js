class Node{
    value = null;
    childNodes = [];
    bestNextNode = null;
    boardState = null;

    constructor (value, boardState) {
        this.value = value;
        this.boardState = JSON.parse(JSON.stringify(boardState));
    }
}

function giveValueToLeaves(rootNode, evaluationFunction){
    if (rootNode.childNodes.length === 0){
        rootNode.value = evaluationFunction(rootNode.boardState);
    } else {
        for (var i = 0; i < rootNode.childNodes.length; i++){
            giveValueToLeaves(rootNode.childNodes[i], evaluationFunction);
        }
    }
}

function generateTree(rootNode, depth, isWhite){
    if (depth - 1 === 0){
        return;
    }
    generatePossibleChild(rootNode, isWhite);
    for (var i = 0; i < rootNode.childNodes.length; i++){
        generateTree(rootNode.childNodes[i], depth - 1, !isWhite);
    }
}

function generatePossibleChild(node, isWhite){
    if (isWhite){
        var possibleStates = generatePossibleStates(node.boardState, playerEnum.WHITE);
    }
    else{
        var possibleStates = generatePossibleStates(node.boardState, playerEnum.BLACK);
    }
    for (var i = 0; i < possibleStates.length; i++){
        node.childNodes.push(new Node(null, possibleStates[i]));
    }
}

function generatePossibleStates(boardState, playerRole){
    var possibleStates = [];
    for (var i = MIN_ROW_INDEX; i < MAX_ROW; i++){
        for (var j = MIN_COL_INDEX; j < MAX_COL; j++){
            var newState = JSON.parse(JSON.stringify(boardState));
            if(checkAvailableMoveMinMax(newState, i, j)){
                setAvailablePiecesToEmptyMinMax(newState);
                flipPiecesMinMax(newState, playerRole, i, j);
                setAvailablePiecesMinMax(newState, playerRole);
                possibleStates = possibleStates.concat(newState);
            }
        }
    }
    return possibleStates;
}

function changePlayerRoleMinMax (playerRole) {
    if (playerRole === playerEnum.WHITE) {
        return playerEnum.BLACK;
    } else {
        return playerEnum.WHITE;
    }
}

function checkAvailableMoveMinMax (board, row, col) {
    return (getBoardPieceMinMax(row, col, board) === playerEnum.AVAILABLE);
}

function miniMax(node, depth, isMaximizing, alpha, beta){
    if (depth - 1 === 0){
        return node.value;
    }

    if (isMaximizing){
        bestValue = -Infinity;
        var nextIdx = 0;
        var i = 0;
        for (; i < node.childNodes.length; i++){
            value = miniMax(node.childNodes[i], depth - 1, false, alpha, beta);
            bestValue = Math.max(bestValue, value);
            if (bestValue > alpha){
                nextIdx = i;
            }
            alpha = Math.max(alpha, bestValue);
            if (beta <= alpha){
                break;
            }
        }
        node.bestNextNode = nextIdx;
        return bestValue;
    }else {
        bestValue = Infinity;
        var nextIdx = 0;
        var i = 0;
        for (; i < node.childNodes.length; i++){
            value = miniMax(node.childNodes[i], depth - 1, true, alpha, beta);
            bestValue = Math.min(bestValue, value);
            if (bestValue < beta){
                nextIdx = i;
            }
            beta = Math.min(beta, bestValue);
            if (beta <= alpha){
                break;
            }
        }
        node.bestNextNode = nextIdx;
        return bestValue;
    }
}

function getBoardPieceMinMax (row, col, board) {

    return board[row][col];
}

function setBoardPieceMinMax (row, col, piece, board) {
    board[row][col] = piece;
}

function setAvailablePiecesMinMax (board, playerRole) {
    var score = 0;
    for (let row = MIN_ROW_INDEX; row < MAX_ROW; row++) {
        for (let col = MIN_COL_INDEX; col < MAX_COL; col++) {
            score = getNumberOfFlippedPieces(playerRole, row, col);
            if (score > 0 && getBoardPieceMinMax(row, col, board) !== playerEnum.BLACK && getBoardPieceMinMax(row, col, board) !== playerEnum.WHITE) {
                setBoardPieceMinMax(row, col, playerEnum.AVAILABLE, board);
            }
            else{
                gamewin();
            }
        }
    }
}

function setAvailablePiecesToEmptyMinMax (board) {
    for (let row = MIN_ROW_INDEX; row < MAX_ROW; row++) {
        for (let col = MIN_COL_INDEX; col < MAX_COL; col++) {
            if (getBoardPieceMinMax(row, col, board) === playerEnum.AVAILABLE) {
                setBoardPieceMinMax(row, col, playerEnum.EMPTY, board);
            }
        }
    }
}

function flipPiecesMinMax (board, playerRole, row, col) {
    for (let dirRow = -1; dirRow <= 1; dirRow++ ) {
        for (let dirCol = -1; dirCol <= 1; dirCol++ ) {
            flipPiecesByDirectionMinMax(board, playerRole, row, col, dirRow, dirCol);
        }
    }
}


function flipPiecesByDirectionMinMax (board, playerRole, row, col, dirRow, dirCol) {
    var limit = getNumberOfFlippedPiecesByDirectionMinMax(board, playerRole, row, col, dirRow, dirCol);
    for (let distance = 0; distance<limit; distance++) {
        let posX = col + dirCol * (distance + 1);
        let posY = row + dirRow * (distance + 1);
        setBoardPieceMinMax(posY, posX, playerRole, board);
    }
    if (dirRow === 0 && dirCol === 0){
        let posX = col + dirCol;
        let posY = row + dirRow;
        setBoardPieceMinMax(posY, posX, playerRole, board);
    }
}

// playerRole = WHITE, BLACK
function getNumberOfFlippedPiecesMinMax (board, playerRole, row, col) {
    var count = 0;
    for (let dirRow = -1; dirRow <= 1; dirRow++ ) {
        for (let dirCol = -1; dirCol <= 1; dirCol++ ) {
            count += getNumberOfFlippedPiecesByDirectionMinMax(board, playerRole, row, col, dirRow, dirCol);
        }
    }
    return count;
}

function getNumberOfFlippedPiecesByDirectionMinMax (board, playerRole, row, col, dirRow, dirCol) {
    var numberOfFlippedPieces = 0;
    if (dirRow === 0 && dirCol === 0){
        return 0;
    }
    for (let score = 0; ; score++) {
        let posX = col + dirCol * (score + 1);
        let posY = row + dirRow * (score + 1);
        if (isIndexOutOfBound(posX, posY) || getBoardPieceMinMax(posY, posX, board) === playerEnum.EMPTY || getBoardPieceMinMax(posY, posX, board) === playerEnum.AVAILABLE) {
            break;
        }
        if (getBoardPieceMinMax(posY, posX, board) === playerRole) {
            numberOfFlippedPieces = score;
            break;
        }
    }
    return numberOfFlippedPieces;
}