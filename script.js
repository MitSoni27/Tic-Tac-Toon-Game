// ========== GAME LOGIC ==========
let boardState = ['', '', '', '', '', '', '', '', ''];
let currentPlayerSym = 'X';
let gameActive = true;
let players = {
  p1: { name: 'Player 1', symbol: 'X', emoji: '🎭' },
  p2: { name: 'Player 2', symbol: 'O', emoji: '🎪' }
};

// DOM Elements
const selectionDiv = document.getElementById('selectionScreen');
const gameDiv = document.getElementById('gameScreen');
const boardEl = document.getElementById('board');
const turnText = document.getElementById('turnText');
const leftName = document.getElementById('leftName');
const rightName = document.getElementById('rightName');
const leftSymbolBadge = document.getElementById('leftSymbolBadge');
const rightSymbolBadge = document.getElementById('rightSymbolBadge');
const leftEmoji = document.getElementById('leftEmoji');
const rightEmoji = document.getElementById('rightEmoji');
const celebModal = document.getElementById('celebModal');
const winnerTitle = document.getElementById('winnerTitle');
const winnerNameDisplay = document.getElementById('winnerNameDisplay');
const closeCelebBtn = document.getElementById('closeCeleb');

// Render Board
function renderBoard() {
  boardEl.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.textContent = boardState[i];
    if (boardState[i] === 'X') cell.style.color = 'var(--accent-x)';
    if (boardState[i] === 'O') cell.style.color = 'var(--accent-o)';
    cell.addEventListener('click', () => handleMove(i));
    boardEl.appendChild(cell);
  }
}

// Update UI with names & symbols
function updateGameUI() {
  leftName.textContent = players.p1.name || 'Player 1';
  rightName.textContent = players.p2.name || 'Player 2';
  leftSymbolBadge.textContent = players.p1.symbol;
  rightSymbolBadge.textContent = players.p2.symbol;
  leftEmoji.textContent = players.p1.emoji || '🎭';
  rightEmoji.textContent = players.p2.emoji || '🎪';
  const currentPlayerObj = currentPlayerSym === players.p1.symbol ? players.p1 : players.p2;
  turnText.textContent = `🎯 Turn: ${currentPlayerObj.name} (${currentPlayerSym})`;
}

// Check Winner
function checkWinner() {
  const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];
  for (let pattern of winPatterns) {
    const [a,b,c] = pattern;
    if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
      return boardState[a];
    }
  }
  return null;
}

// Show Celebration with Confetti - Premium Version
function showCelebration(winnerSymbol) {
  const winner = winnerSymbol === players.p1.symbol ? players.p1 : players.p2;
  winnerTitle.innerHTML = `🏆 CONGRATULATIONS! 🏆`;
  winnerNameDisplay.textContent = `${winner.name} WINS THE DUEL! 👑`;
  celebModal.classList.add('active');
  
  // Premium Confetti Effect
  const confettiArea = document.getElementById('confettiArea');
  confettiArea.innerHTML = '';
  
  // Multiple confetti types
  const colors = ['#ff6b6b', '#fbbf24', '#34d399', '#60a5fa', '#f472b6', '#a855f7', '#f97316'];
  
  for (let i = 0; i < 180; i++) {
    const conf = document.createElement('div');
    conf.style.position = 'absolute';
    conf.style.width = Math.random() * 12 + 4 + 'px';
    conf.style.height = Math.random() * 14 + 6 + 'px';
    conf.style.background = colors[Math.floor(Math.random() * colors.length)];
    conf.style.left = Math.random() * 100 + '%';
    conf.style.top = '-20px';
    conf.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    conf.style.opacity = Math.random() * 0.8 + 0.5;
    conf.style.animation = `fallConfetti ${Math.random() * 2.5 + 1.5}s linear forwards`;
    conf.style.transform = `rotate(${Math.random() * 360}deg)`;
    confettiArea.appendChild(conf);
  }
  
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fallConfetti {
      0% { transform: translateY(0) rotate(0deg); opacity: 1; }
      100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
  gameActive = false;
}

function showDraw() {
  winnerTitle.innerHTML = `🤝 EPIC DRAW! 🤝`;
  winnerNameDisplay.textContent = `Both warriors fought valiantly! 🎭`;
  celebModal.classList.add('active');
  gameActive = false;
  
  // Confetti for draw
  const confettiArea = document.getElementById('confettiArea');
  confettiArea.innerHTML = '';
  const colors = ['#fbbf24', '#60a5fa', '#f472b6'];
  
  for (let i = 0; i < 100; i++) {
    const conf = document.createElement('div');
    conf.style.position = 'absolute';
    conf.style.width = Math.random() * 10 + 4 + 'px';
    conf.style.height = Math.random() * 12 + 5 + 'px';
    conf.style.background = colors[Math.floor(Math.random() * colors.length)];
    conf.style.left = Math.random() * 100 + '%';
    conf.style.top = '-20px';
    conf.style.borderRadius = '2px';
    conf.style.animation = `fallConfetti ${Math.random() * 2 + 1.5}s linear forwards`;
    confettiArea.appendChild(conf);
  }
}

function handleMove(index) {
  if (!gameActive) return;
  if (boardState[index] !== '') return;
  
  boardState[index] = currentPlayerSym;
  renderBoard();
  
  const winner = checkWinner();
  if (winner) {
    showCelebration(winner);
    return;
  }
  
  const isDraw = boardState.every(cell => cell !== '');
  if (isDraw) {
    showDraw();
    return;
  }
  
  // Switch turn
  currentPlayerSym = currentPlayerSym === players.p1.symbol ? players.p2.symbol : players.p1.symbol;
  const currentPlayerObj = currentPlayerSym === players.p1.symbol ? players.p1 : players.p2;
  turnText.textContent = `🎯 Turn: ${currentPlayerObj.name} (${currentPlayerSym})`;
}

function resetGame() {
  boardState = ['', '', '', '', '', '', '', '', ''];
  currentPlayerSym = players.p1.symbol;
  gameActive = true;
  renderBoard();
  const currentPlayerObj = currentPlayerSym === players.p1.symbol ? players.p1 : players.p2;
  turnText.textContent = `🎯 Turn: ${currentPlayerObj.name} (${currentPlayerSym})`;
  celebModal.classList.remove('active');
}

function startGame() {
  // Get values from selection - no default names
  let p1NameVal = document.getElementById('p1Name').value.trim();
  let p2NameVal = document.getElementById('p2Name').value.trim();
  
  if (p1NameVal === '') p1NameVal = 'Player 1';
  if (p2NameVal === '') p2NameVal = 'Player 2';
  
  let p1Sym = 'X', p2Sym = 'O';
  const p1Active = document.querySelector('.symbol-group[data-player="1"] .symbol-opt.active');
  const p2Active = document.querySelector('.symbol-group[data-player="2"] .symbol-opt.active');
  if (p1Active) p1Sym = p1Active.getAttribute('data-sym');
  if (p2Active) p2Sym = p2Active.getAttribute('data-sym');
  
  if (p1Sym === p2Sym) {
    alert("⚔️ Heroes must choose different symbols! One X, One O ⚔️");
    return;
  }
  
  players = {
    p1: { name: p1NameVal, symbol: p1Sym, emoji: '🎭' },
    p2: { name: p2NameVal, symbol: p2Sym, emoji: '🎪' }
  };
  
  currentPlayerSym = players.p1.symbol;
  gameActive = true;
  boardState = ['', '', '', '', '', '', '', '', ''];
  
  updateGameUI();
  renderBoard();
  
  selectionDiv.classList.add('hidden');
  gameDiv.classList.remove('hidden');
}

// Symbol selector logic
document.querySelectorAll('.symbol-group').forEach(group => {
  const opts = group.querySelectorAll('.symbol-opt');
  if (group.getAttribute('data-player') === '1') {
    opts[0].classList.add('active');
  } else {
    opts[1].classList.add('active');
  }
  opts.forEach(opt => {
    opt.addEventListener('click', () => {
      group.querySelectorAll('.symbol-opt').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
    });
  });
});

// Theme Toggle (Dark/Light)
const themeToggle = document.getElementById('themeToggleBtn');
const themeIcons = document.querySelectorAll('.theme-icon');

function setTheme(theme) {
  if (theme === 'light') {
    document.body.classList.add('light');
  } else {
    document.body.classList.remove('light');
  }
  themeIcons.forEach(icon => {
    if (icon.getAttribute('data-theme') === theme) {
      icon.classList.add('active');
    } else {
      icon.classList.remove('active');
    }
  });
}

themeToggle.addEventListener('click', () => {
  const isLight = document.body.classList.contains('light');
  if (isLight) {
    setTheme('dark');
  } else {
    setTheme('light');
  }
});

// Initialize theme
setTheme('dark');

// Buttons
document.getElementById('startGameBtn').addEventListener('click', startGame);
document.getElementById('resetGame').addEventListener('click', resetGame);
document.getElementById('backToSelect').addEventListener('click', () => {
  selectionDiv.classList.remove('hidden');
  gameDiv.classList.add('hidden');
  celebModal.classList.remove('active');
  resetGame();
});
closeCelebBtn.addEventListener('click', () => {
  celebModal.classList.remove('active');
  resetGame();
});

// Initial render
renderBoard();
updateGameUI();
