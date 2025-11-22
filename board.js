const boardElement = document.getElementById('chess-board');
const aiMessage = document.getElementById('thinking');
const guideModal = document.getElementById('guide-modal');

let game = new Chess();
let selectedSquare = null;
let settings = {};
let timer = { white: 600, black: 600, interval: null };
let isFlipped = false;

window.onload = () => {
    // Read settings from localStorage
    const savedSettings = localStorage.getItem('chessSettings');
    if(savedSettings) {
        settings = JSON.parse(savedSettings);
    } else {
        settings = { difficulty: 2, theme: 'classic', time: 10, appTheme: 'light' };
    }

    // Apply Theme
    document.body.className = settings.appTheme;
    document.getElementById('chess-board').className = `board-theme-${settings.theme} hover-pop`;

    // Setup Timer
    timer.white = settings.time * 60;
    timer.black = settings.time * 60;
    updateTimerUI();
    
    // Start Game
    renderBoard();
    startTimer();
};

function renderBoard() {
    boardElement.innerHTML = '';
    const boardState = game.board();

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const row = isFlipped ? 7 - r : r;
            const col = isFlipped ? 7 - c : c;
            
            const squareDiv = document.createElement('div');
            const isLight = (row + col) % 2 === 0;
            const squareName = String.fromCharCode(97 + col) + (8 - row);
            
            squareDiv.className = `square ${isLight ? 'light' : 'dark'}`;
            squareDiv.dataset.square = squareName;
            
            const piece = boardState[row][col];
            if (piece) {
                const pieceSpan = document.createElement('span');
                pieceSpan.className = `piece ${piece.color}`;
                pieceSpan.innerHTML = getPieceIcon(piece);
                pieceSpan.draggable = true;
                pieceSpan.addEventListener('dragstart', (e) => handleDragStart(e, squareName));
                squareDiv.appendChild(pieceSpan);
            }

            squareDiv.addEventListener('click', () => handleSquareClick(squareName));
            squareDiv.addEventListener('dragover', (e) => e.preventDefault());
            squareDiv.addEventListener('drop', (e) => handleDrop(e, squareName));

            boardElement.appendChild(squareDiv);
        }
    }
}

function getPieceIcon(piece) {
    const map = {
        'w': { 'p': '♙', 'r': '♖', 'n': '♘', 'b': '♗', 'q': '♕', 'k': '♔' },
        'b': { 'p': '♟', 'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚' }
    };
    return map[piece.color][piece.type];
}

function handleSquareClick(square) {
    if (game.game_over() || game.turn() === 'b') return;

    if (selectedSquare) {
        const move = game.move({ from: selectedSquare, to: square, promotion: 'q' });
        if (move) {
            selectedSquare = null;
            renderBoard();
            checkGameStatus();
            setTimeout(makeAiMove, 350);
        } else {
            const piece = game.get(square);
            if (piece && piece.color === 'w') {
                selectedSquare = square;
                highlightSquare(square);
            } else {
                selectedSquare = null;
                renderBoard();
            }
        }
    } else {
        const piece = game.get(square);
        if (piece && piece.color === 'w') {
            selectedSquare = square;
            highlightSquare(square);
        }
    }
}

let dragSource = null;
function handleDragStart(e, square) {
    if (game.game_over() || game.turn() === 'b') return;
    dragSource = square;
}

function handleDrop(e, target) {
    if (!dragSource) return;
    const move = game.move({ from: dragSource, to: target, promotion: 'q' });
    if (move) {
        renderBoard();
        checkGameStatus();
        setTimeout(makeAiMove, 350);
    }
    dragSource = null;
}

function highlightSquare(square) {
    renderBoard();
    const el = document.querySelector(`[data-square="${square}"]`);
    if (el) el.style.boxShadow = "inset 0 0 0 4px #0072ff";
}

function makeAiMove() {
    if (game.game_over()) return;
    aiMessage.style.display = 'flex';
    setTimeout(() => {
        const moves = game.moves();
        if (moves.length > 0) {
            const randomMove = moves[Math.floor(Math.random() * moves.length)];
            game.move(randomMove);
        }
        aiMessage.style.display = 'none';
        renderBoard();
        checkGameStatus();
    }, 500);
}

function startTimer() {
    timer.interval = setInterval(() => {
        if (game.game_over()) return clearInterval(timer.interval);
        if (game.turn() === 'w') timer.white--;
        else timer.black--;
        updateTimerUI();
        if (timer.white <= 0 || timer.black <= 0) {
            clearInterval(timer.interval);
            alert("Time's up!");
        }
    }, 1000);
}

function updateTimerUI() {
    const fmt = s => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;
    document.querySelector('.white-timer').innerText = fmt(timer.white);
    document.querySelector('.black-timer').innerText = fmt(timer.black);
}

function checkGameStatus() {
    if (game.in_checkmate()) {
        setTimeout(() => alert("Game Over: Checkmate!"), 200);
        clearInterval(timer.interval);
    } else if (game.in_draw()) {
        setTimeout(() => alert("Game Over: Draw!"), 200);
        clearInterval(timer.interval);
    }
}

function flipBoard() {
    isFlipped = !isFlipped;
    renderBoard();
}

function exitGame() {
    window.location.href = 'chess.html';
}

function toggleGuide() {
    guideModal.classList.toggle('visible');
}