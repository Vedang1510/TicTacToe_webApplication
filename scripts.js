const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('reset');
let currentPlayer = 'X'; // Human player is 'X'
let computerPlayer = 'O'; // Computer player is 'O'
let board = ['', '', '', '', '', '', '', '', ''];
let isComputerTurn = false; // Start with human player

const checkWin = () => {
    const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }

    return board.includes('') ? null : 'Tie';
};

const minimax = (depth, isMaximizing) => {
    const winner = checkWin();
    if (winner === computerPlayer) return 10 - depth;
    if (winner === currentPlayer) return depth - 10;
    if (winner === 'Tie') return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = computerPlayer;
                let score = minimax(depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = currentPlayer;
                let score = minimax(depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
};

const getBestMove = () => {
    let bestScore = -Infinity;
    let bestMove = -1;
    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = computerPlayer;
            let score = minimax(0, false);
            board[i] = '';
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    return bestMove;
};

const handleClick = (e) => {
    const index = e.target.getAttribute('data-cell');

    if (board[index] || checkWin() || isComputerTurn) return;

    board[index] = currentPlayer;
    e.target.textContent = currentPlayer;

    const winner = checkWin();
    if (winner) {
        setTimeout(() => {
            alert(winner === 'Tie' ? "It's a Tie!" : `${winner} Wins!`);
            resetGame();
        }, 100);
        return;
    }

    isComputerTurn = true;
    const bestMove = getBestMove();
    board[bestMove] = computerPlayer;
    cells[bestMove].textContent = computerPlayer;

    isComputerTurn = false;
    const newWinner = checkWin();
    if (newWinner) {
        setTimeout(() => {
            alert(newWinner === 'Tie' ? "It's a Tie!" : `${newWinner} Wins!`);
            resetGame();
        }, 100);
    }
};

const resetGame = () => {
    board = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => cell.textContent = '');
    currentPlayer = 'X'; // Reset to human player
    isComputerTurn = false; // Start with human player
};

cells.forEach(cell => cell.addEventListener('click', handleClick));
resetButton.addEventListener('click', resetGame);
