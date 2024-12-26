let score = 0;
let redMoleClicks = 0; // Counter for red mole clicks
let lives = 3; // Initial lives
let mole = document.getElementById('mole');
let gameArea = document.getElementById('game-area');
let scoreDisplay = document.getElementById('score');
let livesDisplay = document.getElementById('lives'); // Display for lives
let startButton = document.getElementById('start-btn');
let gameInterval;
let moleInterval;

function startGame() {
    score = 0;
    redMoleClicks = 0; // Reset red mole clicks
    lives = 3; // Reset lives
    updateScore();
    updateLives();
    startButton.disabled = true; // Disable start button during game

    gameInterval = setInterval(moveMole, 1000); // Mole moves every 1 second
}

function updateScore() {
    scoreDisplay.textContent = 'Score: ' + score;
}

function updateLives() {
    livesDisplay.textContent = 'Lives: ' + lives;
}

function randomPosition() {
    // Get the width and height of the game area
    const gameAreaWidth = gameArea.clientWidth;
    const gameAreaHeight = gameArea.clientHeight;
    
    // Get the size of the mole
    const moleWidth = mole.offsetWidth;
    const moleHeight = mole.offsetHeight;
    
    // Calculate the maximum X and Y positions where the mole can appear
    const maxX = gameAreaWidth - moleWidth;
    const maxY = gameAreaHeight - moleHeight;
    
    // Randomly calculate position, ensuring the mole stays within the game area
    const randomX = Math.floor(Math.random() * (maxX + 1)); // Add +1 to include max value
    const randomY = Math.floor(Math.random() * (maxY + 1));

    return { x: randomX, y: randomY };
}

function moveMole() {
    const { x, y } = randomPosition();

    // Randomly decide whether to show a black mole or a red mole
    const isRedMole = Math.random() < 0.2; // 20% chance to be a red mole
    
    if (isRedMole) {
        mole.style.backgroundColor = 'red';
    } else {
        mole.style.backgroundColor = 'black';
    }

    // Position the mole inside the game area
    mole.style.left = `${x}px`;
    mole.style.top = `${y}px`;
    mole.style.display = 'block'; // Show the mole

    // Hide the mole after 500ms
    setTimeout(() => {
        mole.style.display = 'none';
    }, 500);
}

mole.addEventListener('click', function() {
    if (mole.style.backgroundColor === 'red') {
        redMoleClicks++;
        lives--; // Decrease life when red mole is clicked
        updateLives(); // Update lives display
        if (redMoleClicks >= 3) {
            alert('Game Over! You clicked the red mole 3 times.');
            clearInterval(gameInterval); // Stop the game
            mole.style.display = 'none'; // Hide the mole immediately
            startButton.disabled = false; // Enable the start button again
        } else if (lives <= 0) {
            alert('Game Over! You ran out of lives.');
            clearInterval(gameInterval); // Stop the game
            mole.style.display = 'none'; // Hide the mole immediately
            startButton.disabled = false; // Enable the start button again
        }
    } else {
        score += 10; // Increase score on black mole click
        updateScore();
    }
});

startButton.addEventListener('click', startGame);
