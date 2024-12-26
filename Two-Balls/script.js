const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');

let score = 0;
let lives = 3;
let gameRunning = false;
let balls = [];

canvas.width = 400;
canvas.height = 400;

class Ball {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.timeToLive = 2000; // 2 seconds
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    update(deltaTime) {
        this.timeToLive -= deltaTime;
    }
}

function createBall() {
    const radius = 20;
    const x = Math.random() * (canvas.width - radius * 2) + radius;
    const y = Math.random() * (canvas.height - radius * 2) + radius;
    const color = Math.random() < 0.8 ? 'black' : 'red';
    balls.push(new Ball(x, y, radius, color));
}

function gameLoop(timestamp) {
    if (!gameRunning) return;

    if (!lastTimestamp) {
        lastTimestamp = timestamp;
    }
    const deltaTime = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (Math.random() < 0.02) {
        createBall();
    }

    balls.forEach((ball, index) => {
        ball.draw();
        ball.update(deltaTime);
        if (ball.timeToLive <= 0) {
            balls.splice(index, 1);
        }
    });

    requestAnimationFrame(gameLoop);
}

function startGame() {
    gameRunning = true;
    score = 0;
    lives = 3;
    balls = [];
    updateScore();
    updateLives();
    lastTimestamp = undefined;
    startButton.disabled = true;
    requestAnimationFrame(gameLoop);
}

function endGame() {
    gameRunning = false;
    alert(`Game Over! Your score: ${score}`);
    startButton.disabled = false;
}

function updateScore() {
    scoreElement.textContent = score;
}

function updateLives() {
    livesElement.textContent = lives;
}

canvas.addEventListener('click', (event) => {
    if (!gameRunning) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    balls.forEach((ball, index) => {
        const distance = Math.sqrt((clickX - ball.x) ** 2 + (clickY - ball.y) ** 2);
        if (distance <= ball.radius) {
            if (ball.color === 'black') {
                score++;
                updateScore();
            } else {
                lives--;
                updateLives();
                if (lives <= 0) {
                    endGame();
                }
            }
            balls.splice(index, 1);
        }
    });
});

startButton.addEventListener('click', startGame);

// Make the game responsive
function resizeCanvas() {
    const container = document.querySelector('.container');
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const size = Math.min(containerWidth, containerHeight) - 40;
    
    canvas.width = size;
    canvas.height = size;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();