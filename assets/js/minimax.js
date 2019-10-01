class Node{
    value = null;
    childNodes = null;
    bestNextNode = null;

    constructor (value, childNodes){
        this.value = value;
        this.childNodes = childNodes;
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

test1 = new Node(3, []);
test2 = new Node(2, []);
test3 = new Node(6, []);
test4 = new Node(9, []);
test5 = new Node(1, []);
test6 = new Node(2, []);
test7 = new Node(0, []);
test8 = new Node(-1, []);

test9 = new Node(null, [test1, test2]);
test10 = new Node(null, [test3, test4]);
test11 = new Node(null, [test5, test6]);
test12 = new Node(null, [test7, test8]);

test13 = new Node(null, [test9, test10]);
test14 = new Node(null, [test11, test12]);

test15 = new Node(null, [test13, test14]);

a1 = new Node(3, []);
a2 = new Node(12, []);
a3 = new Node(8, []);
a4 = new Node(2, []);
a5 = new Node(4, []);
a6 = new Node(6, []);
a7 = new Node(14, []);
a8 = new Node(5, []);
a9 = new Node(2, []);

a10 = new Node(null, [a1, a2, a3]);
a11 = new Node(null, [a4, a5, a6]);
a12 = new Node(null, [a7, a8, a9]);

a13 = new Node(null, [a10, a11, a12]);