document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const status = document.getElementById('status');
    const startGameButton = document.getElementById('startGame');

    let gameBoard = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];
    let currentPlayer = 'X'; // 'X' for human, 'O' for computer
    let gameOver = false;

    function createBoard() {
        board.innerHTML = '';
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const button = document.createElement('button');
                button.className = 'btn btn-light';
                button.addEventListener('click', () => handleButtonClick(row, col));
                board.appendChild(button);
            }
        }
    }

    function handleButtonClick(row, col) {
        if (gameBoard[row][col] === '' && !gameOver && currentPlayer === 'X') {
            gameBoard[row][col] = 'X';
            updateBoard();
            if (checkWinner()) {
                status.textContent = 'Player X wins!';
                gameOver = true;
            } else if (isBoardFull()) {
                status.textContent = 'It\'s a draw!';
                gameOver = true;
            } else {
                currentPlayer = 'O';
                status.textContent = 'Player O\'s turn';
                setTimeout(computerMove, 500); // Delay computer move
            }
        }
    }

    function computerMove() {
        const bestMove = findBestMove();
        gameBoard[bestMove.row][bestMove.col] = 'O';
        updateBoard();
        if (checkWinner()) {
            status.textContent = 'Player O wins!';
            gameOver = true;
        } else if (isBoardFull()) {
            status.textContent = 'It\'s a draw!';
            gameOver = true;
        } else {
            currentPlayer = 'X';
            status.textContent = 'Player X\'s turn';
        }
    }

    function updateBoard() {
        const buttons = board.querySelectorAll('button');
        let index = 0;
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                buttons[index].textContent = gameBoard[row][col];
                index++;
            }
        }
    }

    function checkWinner() {
        // Check rows, columns, and diagonals
        for (let i = 0; i < 3; i++) {
            if (gameBoard[i][0] === currentPlayer && gameBoard[i][1] === currentPlayer && gameBoard[i][2] === currentPlayer) {
                return true;
            }
            if (gameBoard[0][i] === currentPlayer && gameBoard[1][i] === currentPlayer && gameBoard[2][i] === currentPlayer) {
                return true;
            }
        }
        if (gameBoard[0][0] === currentPlayer && gameBoard[1][1] === currentPlayer && gameBoard[2][2] === currentPlayer) {
            return true;
        }
        if (gameBoard[0][2] === currentPlayer && gameBoard[1][1] === currentPlayer && gameBoard[2][0] === currentPlayer) {
            return true;
        }
        return false;
    }

    function isBoardFull() {
        return gameBoard.flat().every(cell => cell !== '');
    }

    function findBestMove() {
        let bestMove = { row: -1, col: -1 };
        let bestValue = -Infinity;

        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (gameBoard[row][col] === '') {
                    gameBoard[row][col] = 'O';
                    const moveValue = minimax(0, false);
                    gameBoard[row][col] = '';
                    if (moveValue > bestValue) {
                        bestMove = { row, col };
                        bestValue = moveValue;
                    }
                }
            }
        }
        return bestMove;
    }

    function minimax(depth, isMaximizing) {
        const winner = checkWinner();
        if (winner === 'O') return 10 - depth;
        if (winner === 'X') return depth - 10;
        if (isBoardFull()) return 0;

        if (isMaximizing) {
            let best = -Infinity;
            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 3; col++) {
                    if (gameBoard[row][col] === '') {
                        gameBoard[row][col] = 'O';
                        best = Math.max(best, minimax(depth + 1, false));
                        gameBoard[row][col] = '';
                    }
                }
            }
            return best;
        } else {
            let best = Infinity;
            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 3; col++) {
                    if (gameBoard[row][col] === '') {
                        gameBoard[row][col] = 'X';
                        best = Math.min(best, minimax(depth + 1, true));
                        gameBoard[row][col] = '';
                    }
                }
            }
            return best;
        }
    }

    function startNewGame() {
        gameBoard = [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ];
        currentPlayer = 'X';
        gameOver = false;
        status.textContent = 'Player X\'s turn';
        updateBoard();
    }

    startGameButton.addEventListener('click', startNewGame);
    createBoard();
    startNewGame();
});
