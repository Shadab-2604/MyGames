const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const singlePlayerBtn = document.getElementById('single-player');
const twoPlayerBtn = document.getElementById('two-player');
const gameMenu = document.getElementById('game-menu');
const gameContainer = document.getElementById('game-container');
const controlsDiv = document.getElementById('controls');
const player2Controls = document.getElementById('player2-controls');
const restartBtn = document.getElementById('restart');
const backBtn = document.getElementById('back');  // Back button
const player1ScoreElement = document.getElementById('player1-score');
const player2ScoreElement = document.getElementById('player2-score');

let gameMode = '';
let paddle1, paddle2, puck;
let player1Score = 0, player2Score = 0;

const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 80;
const PUCK_RADIUS = 15;
const PADDLE_SPEED = 6;
const BOT_SPEED = 5;
const INITIAL_BALL_SPEED = 5; // Set the initial ball speed

canvas.width = 800;
canvas.height = 400;

class Paddle {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.speed = 0;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    move() {
        this.y += this.speed;
        if (this.y < 0) this.y = 0;
        if (this.y + this.height > canvas.height) this.y = canvas.height - this.height;
    }
}

class Puck {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.dx = INITIAL_BALL_SPEED; // Start with a constant ball speed
        this.dy = INITIAL_BALL_SPEED;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    move() {
        this.x += this.dx;
        this.y += this.dy;

        if (this.y - this.radius < 0 || this.y + this.radius > canvas.height) {
            this.dy = -this.dy;
            playSound('wall');
        }

        if (this.collidesWith(paddle1) || this.collidesWith(paddle2)) {
            this.dx = -this.dx;
            playSound('paddle');
        }

        if (this.x - this.radius < 0) {
            player2Score++;
            updateScore();
            resetPuck('player2');
            playSound('score');
        }

        if (this.x + this.radius > canvas.width) {
            player1Score++;
            updateScore();
            resetPuck('player1');
            playSound('score');
        }
    }

    collidesWith(paddle) {
        return (
            this.x - this.radius < paddle.x + paddle.width &&
            this.x + this.radius > paddle.x &&
            this.y > paddle.y &&
            this.y < paddle.y + paddle.height
        );
    }
}

function initGame() {
    paddle1 = new Paddle(10, canvas.height / 2 - PADDLE_HEIGHT / 2, PADDLE_WIDTH, PADDLE_HEIGHT, '#00F');
    paddle2 = new Paddle(canvas.width - PADDLE_WIDTH - 10, canvas.height / 2 - PADDLE_HEIGHT / 2, PADDLE_WIDTH, PADDLE_HEIGHT, '#F00');
    resetPuck();
    player1Score = 0;
    player2Score = 0;
    updateScore();
}

function resetPuck(scorer) {
    puck = new Puck(canvas.width / 2, canvas.height / 2, PUCK_RADIUS, '#0F0');
    puck.dx = scorer === 'player1' ? INITIAL_BALL_SPEED : -INITIAL_BALL_SPEED;  // Reset to initial speed
    puck.dy = Math.random() > 0.5 ? INITIAL_BALL_SPEED : -INITIAL_BALL_SPEED;
}

function updateScore() {
    player1ScoreElement.textContent = player1Score;
    player2ScoreElement.textContent = player2Score;
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw center line
    ctx.setLineDash([5, 15]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.strokeStyle = 'white';
    ctx.stroke();
    
    paddle1.draw();
    paddle2.draw();
    puck.draw();
}

function botMove() {
    const paddleCenter = paddle2.y + paddle2.height / 2;
    if (paddleCenter < puck.y - 10) {
        paddle2.speed = BOT_SPEED;
    } else if (paddleCenter > puck.y + 10) {
        paddle2.speed = -BOT_SPEED;
    } else {
        paddle2.speed = 0;
    }
}

function gameLoop() {
    if (gameMode === 'single-player') {
        botMove();
    }

    paddle1.move();
    paddle2.move();
    puck.move();
    drawGame();
    requestAnimationFrame(gameLoop);
}

function startGame(mode) {
    gameMode = mode;
    gameMenu.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    gameContainer.classList.add('fade-in');
    controlsDiv.classList.remove('hidden');
    controlsDiv.classList.add('fade-in');
    restartBtn.classList.remove('hidden');
    restartBtn.classList.add('fade-in');

    if (mode === 'single-player') {
        player2Controls.classList.add('hidden');
    } else {
        player2Controls.classList.remove('hidden');
    }

    initGame();
    gameLoop();
}

function goBackToMenu() {
    gameMenu.classList.remove('hidden');
    gameContainer.classList.add('hidden');
    controlsDiv.classList.add('hidden');
    restartBtn.classList.add('hidden');
    player2Controls.classList.add('hidden'); // Hide the player 2 controls
}

singlePlayerBtn.addEventListener('click', () => startGame('single-player'));
twoPlayerBtn.addEventListener('click', () => startGame('two-player'));
restartBtn.addEventListener('click', initGame);
backBtn.addEventListener('click', goBackToMenu);  // Event listener for the back button

document.addEventListener('keydown', (e) => {
    if (e.key === 'w' || e.key === 'W') {
        paddle1.speed = -PADDLE_SPEED;
    } else if (e.key === 's' || e.key === 'S') {
        paddle1.speed = PADDLE_SPEED;
    }

    if (gameMode === 'two-player') {
        if (e.key === 'ArrowUp') {
            paddle2.speed = -PADDLE_SPEED;
        } else if (e.key === 'ArrowDown') {
            paddle2.speed = PADDLE_SPEED;
        }
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'w' || e.key === 'W' || e.key === 's' || e.key === 'S') {
        paddle1.speed = 0;
    }

    if (gameMode === 'two-player') {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            paddle2.speed = 0;
        }
    }
});

canvas.addEventListener('touchstart', handleTouch);
canvas.addEventListener('touchmove', handleTouch);

function handleTouch(e) {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const root = document.documentElement;
    const touch = e.touches[0];
    const touchY = touch.clientY - rect.top - root.scrollTop;

    if (touchY < canvas.height / 2) {
        paddle1.y = touchY - paddle1.height / 2;
    } else if (gameMode === 'two-player') {
        paddle2.y = touchY - paddle2.height / 2;
    }
}

function resizeCanvas() {
    const container = document.querySelector('.container');
    const containerWidth = container.clientWidth;
    const aspectRatio = canvas.height / canvas.width;
    const newWidth = Math.min(containerWidth - 40, 800);
    const newHeight = newWidth * aspectRatio;

    canvas.style.width = `${newWidth}px`;
    canvas.style.height = `${newHeight}px`;
}

function playSound(sound) {
    const audio = new Audio(`sounds/${sound}.mp3`);
    audio.play();
}
function goBackToMenu() {
    gameMenu.classList.remove('hidden');
    gameContainer.classList.add('hidden');
    controlsDiv.classList.add('hidden');
    restartBtn.classList.add('hidden');
    backBtn.classList.add('hidden'); // Hide the back button when going back to the menu
    player2Controls.classList.add('hidden'); // Hide the player 2 controls
}


function startGame(mode) {
    gameMode = mode;
    gameMenu.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    gameContainer.classList.add('fade-in');
    controlsDiv.classList.remove('hidden');
    controlsDiv.classList.add('fade-in');
    restartBtn.classList.remove('hidden');
    restartBtn.classList.add('fade-in');
    backBtn.classList.remove('hidden');  // Show the back button when game starts

    if (mode === 'single-player') {
        player2Controls.classList.add('hidden');
    } else {
        player2Controls.classList.remove('hidden');
    }

    initGame();
    gameLoop();
}


// Disable pull-to-refresh
document.addEventListener('touchmove', (e) => {
    if (e.touches[0].pageY > 0 && window.scrollY === 0) {
      e.preventDefault();
    }
  }, { passive: false });
  


window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // Initialize canvas resizing
