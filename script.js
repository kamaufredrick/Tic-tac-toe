const boardElement = document.getElementById('board');
const messageElement = document.getElementById('message');
const resetButton = document.getElementById('reset');

const humanPlayer = 'X';
const aiPlayer = 'O';

let board;

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function startGame() {
    board = Array.from(Array(9).keys());
    messageElement.textContent = '';
    renderBoard();
    boardElement.addEventListener('click', handleCellClick);
    resetButton.addEventListener('click', startGame);
}

function renderBoard() {
    boardElement.innerHTML = '';
    board.forEach((cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
        cellElement.setAttribute('data-index', index);
        cellElement.textContent = typeof cell === 'number' ? '' : cell;
        boardElement.appendChild(cellElement);
    });
}

function handleCellClick(event) {
    const cellIndex = event.target.getAttribute('data-index');
    if (typeof board[cellIndex] === 'number') {
        turn(cellIndex, humanPlayer);
        if (!checkWin(board, humanPlayer) && !checkTie()) {
            turn(bestSpot(), aiPlayer);
        }
    }
}

function turn(cellIndex, player) {
    board[cellIndex] = player;
    renderBoard();
    let gameWon = checkWin(board, player);
    if (gameWon) gameOver(gameWon);
}

function checkWin(board, player) {
    let plays = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    for (let [index, win] of winningCombinations.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = {index: index, player: player};
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon) {
    boardElement.removeEventListener('click', handleCellClick);
    messageElement.textContent = gameWon.player === humanPlayer ? "You win!" : "You lose.";
}

function emptySquares() {
    return board.filter(s => typeof s === 'number');
}

function bestSpot() {
    return minimax(board, aiPlayer).index;
}

function checkTie() {
    if (emptySquares().length === 0) {
        messageElement.textContent = "It's a tie!";
        boardElement.removeEventListener('click', handleCellClick);
        return true;
    }
    return false;
}

function minimax(newBoard, player) {
    let availSpots = emptySquares();

    if (checkWin(newBoard, humanPlayer)) {
        return {score: -10};
    } else if (checkWin(newBoard, aiPlayer)) {
        return {score: 10};
    } else if (availSpots.length === 0) {
        return {score: 0};
    }

    let moves = [];
    for (let i = 0; i < availSpots.length; i++) {
        let move = {};
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]] = player;

        if (player === aiPlayer) {
            let result = minimax(newBoard, humanPlayer);
            move.score = result.score;
        } else {
            let result = minimax(newBoard, aiPlayer);
            move.score = result.score;
        }

        newBoard[availSpots[i]] = move.index;
        moves.push(move);
    }

    let bestMove;
    if (player === aiPlayer) {
        let bestScore = -10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = 10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

startGame();
