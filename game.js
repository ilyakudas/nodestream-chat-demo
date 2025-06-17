const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const restartButton = document.getElementById('restart-button');

// Game state
let player, obstacles, score, gameState, animationFrameId;
const keys = {};

// Simple colored shapes instead of images
const playerSettings = {
    width: 50,
    height: 50,
    speed: 5,
    color: '#3498db'
};

const obstacleSettings = {
    width: 50,
    spawnRate: 0.02, // approx. 1 per second at 60fps
    color: '#e74c3c'
};

function isCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

function resetGame() {
    player = {
        x: 50,
        y: canvas.height / 2 - playerSettings.height / 2,
        width: playerSettings.width,
        height: playerSettings.height,
        speed: playerSettings.speed,
        color: playerSettings.color
    };
    obstacles = [];
    score = 0;
    gameState = 'waiting';
    restartButton.classList.add('hidden');
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    drawWaitingScreen();
}

function drawWaitingScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#333';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Click to Start', canvas.width / 2, canvas.height / 2);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw Player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw Obstacles
    obstacles.forEach(obstacle => {
        ctx.fillStyle = obstacle.color;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });

    // Draw Score
    ctx.fillStyle = '#333';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Score: ' + score, 10, 25);
}

function update() {
    // Move player
    if (keys['ArrowUp'] && player.y > 0) player.y -= player.speed;
    if (keys['ArrowDown'] && player.y < canvas.height - player.height) player.y += player.speed;

    // Create and move obstacles
    if (Math.random() < obstacleSettings.spawnRate) {
        const height = Math.random() * 100 + 50;
        const y = Math.random() * (canvas.height - height);
        obstacles.push({ 
            x: canvas.width, 
            y: y, 
            width: obstacleSettings.width, 
            height: height,
            color: obstacleSettings.color
        });
    }

    for (let i = obstacles.length - 1; i >= 0; i--) {
        let o = obstacles[i];
        o.x -= 3;
        if (o.x + o.width < 0) {
            obstacles.splice(i, 1);
            score++;
        }

        if (isCollision(player, o)) {
            gameState = 'gameOver';
            restartButton.classList.remove('hidden');
            return; // Stop the game loop
        }
    }
}

function gameLoop() {
    if (gameState === 'playing') {
        update();
        draw();
        animationFrameId = requestAnimationFrame(gameLoop);
    }
}

// Event Listeners
window.addEventListener('keydown', (e) => { keys[e.key] = true; });
window.addEventListener('keyup', (e) => { keys[e.key] = false; });

canvas.addEventListener('click', () => {
    if (gameState === 'waiting') {
        gameState = 'playing';
        gameLoop();
    }
});

restartButton.addEventListener('click', resetGame);

// Initial setup
resetGame();
