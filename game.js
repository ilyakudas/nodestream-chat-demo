// Game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

// Set canvas size
canvas.width = 600;
canvas.height = 400;

// Player properties
const player = {
    x: canvas.width / 2 - 15,
    y: canvas.height - 50,
    width: 30,
    height: 30,
    speed: 5,
    dx: 0,
    dy: 0
};

// Collectible properties
const collectible = {
    x: Math.random() * (canvas.width - 20),
    y: 0,
    width: 20,
    height: 20,
    speed: 2,
    active: true
};

// Obstacle properties
const obstacles = [];
const obstacleSpeed = 3;
const obstacleFrequency = 120; // frames
let obstacleCount = 0;

// Game state
let score = 0;
let gameOver = false;

// Event listeners
window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

// Key event handlers
function keyDown(e) {
    if (gameOver) return;
    
    if (e.key === 'ArrowRight' || e.key === 'd') {
        player.dx = player.speed;
    } else if (e.key === 'ArrowLeft' || e.key === 'a') {
        player.dx = -player.speed;
    } else if (e.key === 'ArrowUp' || e.key === 'w') {
        player.dy = -player.speed;
    } else if (e.key === 'ArrowDown' || e.key === 's') {
        player.dy = player.speed;
    }
}

function keyUp(e) {
    if (
        e.key === 'ArrowRight' || 
        e.key === 'd' || 
        e.key === 'ArrowLeft' || 
        e.key === 'a'
    ) {
        player.dx = 0;
    }
    
    if (
        e.key === 'ArrowUp' || 
        e.key === 'w' || 
        e.key === 'ArrowDown' || 
        e.key === 's'
    ) {
        player.dy = 0;
    }
}

// Collision detection
function isCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Create new obstacle
function createObstacle() {
    const width = Math.random() * 100 + 50; // Random width between 50 and 150
    const x = Math.random() * (canvas.width - width);
    
    obstacles.push({
        x: x,
        y: -30,
        width: width,
        height: 20,
        speed: obstacleSpeed
    });
}

// Update game state
function update() {
    if (gameOver) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update player position
    player.x += player.dx;
    player.y += player.dy;

    // Keep player in bounds
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;

    // Update collectible
    if (collectible.active) {
        collectible.y += collectible.speed;
        
        // Check if player collected the collectible
        if (isCollision(player, collectible)) {
            score += 10;
            scoreElement.textContent = `Score: ${score}`;
            collectible.x = Math.random() * (canvas.width - 20);
            collectible.y = 0;
        }
        
        // Reset collectible if it goes off screen
        if (collectible.y > canvas.height) {
            collectible.x = Math.random() * (canvas.width - 20);
            collectible.y = 0;
        }
    }

    // Create new obstacles
    obstacleCount++;
    if (obstacleCount > obstacleFrequency) {
        createObstacle();
        obstacleCount = 0;
    }

    // Update and draw obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obstacle = obstacles[i];
        obstacle.y += obstacle.speed;

        // Check collision with player
        if (isCollision(player, obstacle)) {
            gameOver = true;
            alert(`Game Over! Your score: ${score}`);
            document.location.reload();
            break;
        }

        // Remove obstacles that are off screen
        if (obstacle.y > canvas.height) {
            obstacles.splice(i, 1);
        }
    }

    // Draw everything
    draw();
    
    // Continue the game loop
    requestAnimationFrame(update);
}

// Draw game objects
function draw() {
    // Draw player
    ctx.fillStyle = '#3498db';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw collectible
    if (collectible.active) {
        ctx.fillStyle = '#2ecc71';
        ctx.fillRect(collectible.x, collectible.y, collectible.width, collectible.height);
    }

    // Draw obstacles
    ctx.fillStyle = '#e74c3c';
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

// Start the game
update();

// Instructions
console.log('Use arrow keys or WASD to move the blue square.');
console.log('Collect the green squares to score points.');
console.log('Avoid the red obstacles!');
