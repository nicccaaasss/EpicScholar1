let currentTheme = 'classic';

window.onload = () => {
    const savedTheme = localStorage.getItem('appTheme') || 'light';
    document.body.className = savedTheme;
};

function toggleTheme() {
    const isLight = document.body.classList.contains('light');
    const newTheme = isLight ? 'dark' : 'light';
    document.body.className = newTheme;
    localStorage.setItem('appTheme', newTheme);
}

function selectTheme(theme) {
    currentTheme = theme;
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.toggle('active', btn.innerText.toLowerCase() === theme);
    });
}

function setTimer(min) {
    document.getElementById('game-time').value = min;
    document.querySelectorAll('.timer-btn').forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.innerText) === min);
    });
}

function startGame() {
    // Save settings to LocalStorage to pass to board.html
    const settings = {
        difficulty: document.getElementById('ai-difficulty').value,
        theme: currentTheme,
        time: document.getElementById('game-time').value,
        appTheme: document.body.classList.contains('dark') ? 'dark' : 'light'
    };
    localStorage.setItem('chessSettings', JSON.stringify(settings));
    
    // Redirect to the board page
    window.location.href = 'board.html';
}