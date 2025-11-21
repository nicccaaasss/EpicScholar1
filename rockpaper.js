const state = {
  playerScore: 0,
  computerScore: 0,
  targetPoints: 5,
  difficulty: 'easy',
  timerEnabled: true,
  timerDuration: 10,
  timeLeft: 10,
  isPlaying: false,
  musicEnabled: false,
  playerHistory: [],
  lastPlayerMove: null,
  timerInterval: null
};

const choices = ['rock', 'paper', 'scissors'];
const emojis = { rock: '✊', paper: '📄', scissors: '✂️' };

// Elements
const startBtn = document.getElementById('startGame');
const settingsPanel = document.getElementById('settings-panel');
const gameArea = document.getElementById('game-area');
const overlay = document.getElementById('overlay');
const playerHand = document.getElementById('playerHand');
const computerHand = document.getElementById('computerHand');
const roundStatus = document.getElementById('round-status');
const timerDisplay = document.getElementById('timer-display');
const timeLeftEl = document.getElementById('time-left');

// Sounds
const sounds = {
  win: document.getElementById('winSound'),
  lose: document.getElementById('loseSound'),
  click: document.getElementById('clickSound'),
  gameover: document.getElementById('gameOverSound'),
  timer: document.getElementById('timerSound'),
  bgm: document.getElementById('bgm')
};

/* --- Initialization --- */
document.addEventListener('DOMContentLoaded', () => {
  if(localStorage.getItem('rps-theme') === 'dark') {
    document.body.classList.add('dark-mode');
  }
  
  document.querySelectorAll('.choice-btn').forEach(btn => {
    btn.addEventListener('click', () => makeMove(btn.dataset.choice));
  });
  
  startBtn.addEventListener('click', startGame);
  
  if(sounds.bgm) sounds.bgm.volume = 0.3;
});

function toggleMode() {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('rps-theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
}

function toggleMusic() {
  state.musicEnabled = !state.musicEnabled;
  const btn = document.getElementById('music-btn');
  btn.innerHTML = `<span class="material-icons">${state.musicEnabled ? 'music_note' : 'music_off'}</span>`;
  
  if (state.musicEnabled) {
    sounds.bgm.play().catch(e => console.log("Audio blocked:", e));
  } else {
    sounds.bgm.pause();
  }
}

function setDifficulty(level) {
  state.difficulty = level;
  document.querySelectorAll('.diff-btn').forEach(btn => {
    btn.classList.toggle('selected', btn.innerText.toLowerCase() === level);
  });
  document.getElementById('bot-badge').innerText = level.charAt(0).toUpperCase() + level.slice(1);
}

/* --- Game Logic --- */

function startGame() {
  playSound('click');
  
  // STRICT LIMIT LOGIC:
  let inputVal = parseInt(document.getElementById('targetPoints').value);
  // Clamp value between 1 and 10
  if (inputVal > 10) inputVal = 10;
  if (inputVal < 1) inputVal = 1;
  
  // Update the input box to show the corrected value
  document.getElementById('targetPoints').value = inputVal;
  state.targetPoints = inputVal;

  state.timerEnabled = document.getElementById('timerToggle').checked;
  state.playerScore = 0;
  state.computerScore = 0;
  state.playerHistory = [];
  state.isPlaying = true;
  
  updateScoreboard();
  
  settingsPanel.classList.add('hidden');
  gameArea.classList.remove('hidden');
  overlay.classList.add('hidden');
  
  if(state.timerEnabled) {
    timerDisplay.classList.remove('hidden');
    startTimer();
  } else {
    timerDisplay.classList.add('hidden');
  }
}

function startTimer() {
  state.timeLeft = state.timerDuration;
  timeLeftEl.innerText = state.timeLeft;
  clearInterval(state.timerInterval);
  
  state.timerInterval = setInterval(() => {
    state.timeLeft--;
    timeLeftEl.innerText = state.timeLeft;
    
    if(state.timeLeft <= 3) {
      playSound('timer');
      timeLeftEl.style.color = '#ff416c';
    } else {
      timeLeftEl.style.color = 'inherit';
    }
    
    if(state.timeLeft <= 0) {
      clearInterval(state.timerInterval);
      handleTimeout();
    }
  }, 1000);
}

function handleTimeout() {
  roundStatus.innerText = "Time's up! Random move selected.";
  const randomMove = choices[Math.floor(Math.random() * choices.length)];
  makeMove(randomMove);
}

function makeMove(playerChoice) {
  if(!state.isPlaying) return;
  
  clearInterval(state.timerInterval);
  state.isPlaying = false; // Lock input during animation
  
  playSound('click');
  playerHand.innerText = '✊';
  computerHand.innerText = '✊';
  
  playerHand.classList.add('shake-player');
  computerHand.classList.add('shake-computer');
  
  setTimeout(() => {
    const computerChoice = getComputerMove(playerChoice);
    resolveRound(playerChoice, computerChoice);
    
    playerHand.classList.remove('shake-player');
    computerHand.classList.remove('shake-computer');
    
    state.playerHistory.push(playerChoice);
  }, 1500);
}

function getComputerMove(playerMove) {
  const r = Math.random();
  
  if (state.difficulty === 'easy') {
    return choices[Math.floor(Math.random() * choices.length)];
  } 
  else if (state.difficulty === 'medium') {
    if (state.lastPlayerMove && r > 0.6) {
      return getCounterMove(state.lastPlayerMove);
    }
    return choices[Math.floor(Math.random() * choices.length)];
  } 
  else { // Hard
    if (state.playerHistory.length > 0 && r > 0.3) {
      const mostFrequent = getMostFrequent(state.playerHistory);
      return getCounterMove(mostFrequent);
    }
    return choices[Math.floor(Math.random() * choices.length)];
  }
}

function getCounterMove(move) {
  if (move === 'rock') return 'paper';
  if (move === 'paper') return 'scissors';
  return 'rock';
}

function getMostFrequent(arr) {
  return arr.sort((a,b) =>
        arr.filter(v => v===a).length
      - arr.filter(v => v===b).length
  ).pop();
}

function resolveRound(pChoice, cChoice) {
  playerHand.innerText = emojis[pChoice];
  computerHand.innerText = emojis[cChoice];
  
  state.lastPlayerMove = pChoice;
  
  let result = '';
  
  if (pChoice === cChoice) {
    result = 'draw';
    roundStatus.innerText = "It's a Draw!";
    roundStatus.style.color = '#888';
  } else if (
    (pChoice === 'rock' && cChoice === 'scissors') ||
    (pChoice === 'paper' && cChoice === 'rock') ||
    (pChoice === 'scissors' && cChoice === 'paper')
  ) {
    result = 'win';
    state.playerScore++;
    roundStatus.innerText = "You Win this round!";
    roundStatus.style.color = '#0072ff';
    playSound('win');
  } else {
    result = 'lose';
    state.computerScore++;
    roundStatus.innerText = "Bot Wins this round!";
    roundStatus.style.color = '#ff416c';
    playSound('lose');
  }
  
  updateScoreboard();
  
  if (state.playerScore >= state.targetPoints || state.computerScore >= state.targetPoints) {
    endGame();
  } else {
    setTimeout(() => {
      state.isPlaying = true;
      playerHand.innerText = '✊';
      computerHand.innerText = '✊';
      roundStatus.innerText = "Choose your weapon!";
      roundStatus.style.color = 'inherit';
      if(state.timerEnabled) startTimer();
    }, 1500);
  }
}

function updateScoreboard() {
  document.getElementById('playerScore').innerText = state.playerScore;
  document.getElementById('computerScore').innerText = state.computerScore;
}

function endGame() {
  const won = state.playerScore > state.computerScore;
  playSound('gameover');
  
  document.getElementById('result-emoji').innerText = won ? '🏆' : '😢';
  document.getElementById('finalMessage').innerText = won ? 'VICTORY!' : 'GAME OVER';
  document.getElementById('final-score').innerText = `${state.playerScore} - ${state.computerScore}`;
  
  overlay.classList.remove('hidden');
  
  if (won) {
    startFireworks();
  }
}

function playSound(name) {
  const sound = sounds[name];
  if (sound) {
    sound.currentTime = 0;
    sound.play().catch(()=>{});
  }
}

/* --- Fireworks System --- */
const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');
let fireworks = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.velocity = {
      x: (Math.random() - 0.5) * 8,
      y: (Math.random() - 0.5) * 8
    };
    this.alpha = 1;
    this.friction = 0.95;
  }

  draw() {
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update() {
    this.velocity.x *= this.friction;
    this.velocity.y *= this.friction;
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.alpha -= 0.01;
  }
}

function startFireworks() {
  fireworks = [];
  
  const animate = () => {
    if(overlay.classList.contains('hidden')) return;
    
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (Math.random() < 0.05) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height / 2;
      const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
      
      for (let i = 0; i < 50; i++) {
        fireworks.push(new Particle(x, y, color));
      }
    }
    
    fireworks.forEach((p, index) => {
      if (p.alpha > 0) {
        p.update();
        p.draw();
      } else {
        fireworks.splice(index, 1);
      }
    });
  };
  
  animate();
}