class Node{
    value = null;
    childNodes = [];
    bestNextNode = null;
    boardState = null;

    constructor (value, boardState){
        this.value = value;
        this.boardState = JSON.parse(JSON.stringify(boardState));
    }
}

function giveValueToLeaves(rootNode, evaluationFunction){
    if (rootNode.childNodes.length === 0){
        rootNode.value = evaluationFunction(rootNode.boardState);
    }else {
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
    var possibleStates = generatePossibleStates(node.boardState, isWhite);
    for (var i = 0; i < possibleStates.length; i++){
        node.childNodes.push(new Node(null, possibleStates[i]));
    }
}

function generatePossibleStates(boardState, isWhite){
    var possibleStates = [];
    console.log(possibleStates);
    for (var i = MIN_ROW_INDEX; i < MAX_ROW; i++){
        for (var j = MIN_COL_INDEX; j < MAX_COL; j++){
            if (isWhite && boardState[i][j] === playerEnum.WHITE){
                possibleStates = possibleStates.concat(getPossibleStates(boardState, isWhite, i, j));
                console.log(getPossibleStates(boardState, isWhite, i, j));
                console.log(possibleStates);
            }else if (!isWhite && boardState[i][j] === playerEnum.BLACK){
                possibleStates = possibleStates.concat(getPossibleStates(boardState, isWhite, i, j));
                console.log(getPossibleStates(boardState, isWhite, i, j));
                console.log(possibleStates);
            }
        }
    }

    return possibleStates;
}

function getPossibleStates(boardState, isWhite, row, col){
    var possibleStates = [];
    for (var i = -1; i <= 1; i++){
        for (var j = -1; j <= 1; j++){
            var possibleState = getPossibleStateFromDirection(boardState, isWhite, row, col, i, j);
            if (possibleState !== null){
                possibleStates.push(possibleState);
            }
        }
    }

    return possibleStates;
}

function getPossibleStateFromDirection(boardState, isWhite, row, col, dirRow, dirCol){

    if (dirRow === dirCol && dirRow == 0){
        return null;
    }

    var isFound = false;
    var newState = JSON.parse(JSON.stringify(boardState));
    var step = 1;
    for (step = 1; !isIndexOutOfBound(row + (step * dirRow), col + (step * dirCol)); step++){
        if (boardState[row + (step * dirRow)][col + (step * dirCol)] == playerEnum.EMPTY || boardState[row + (step * dirRow)][col + (step * dirCol)] == playerEnum.AVAILABLE){
            break;
        }
        if (isWhite){
            if (boardState[row + (step * dirRow)][col + (step * dirCol)] === playerEnum.WHITE){
                isFound = false;
                return null;
            }
            newState[row + (step * dirRow)][col + (step * dirCol)] = playerEnum.WHITE;
            isFound = true;
        }else {
            if (boardState[row + (step * dirRow)][col + (step * dirCol)] === playerEnum.BLACK){
                isFound = false;
                return null;
            }
            newState[row + (step * dirRow)][col + (step * dirCol)] = playerEnum.BLACK;
            isFound = true;
        }
    }

    if (isFound){
        if (isWhite){
            newState[row + (step * dirRow)][col + (step * dirCol)] = playerEnum.WHITE;
        }else {
            newState[row + (step * dirRow)][col + (step * dirCol)] = playerEnum.BLACK;
        }
        return newState;
    }else {
        return null;
    }
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