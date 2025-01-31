// Game Initialization
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = {
    x: canvas.width / 2,
    y: canvas.height - 100,
    width: 50,
    height: 50,
    speed: 5,
    color: 'blue',
    health: 100,
    money: 0
};

let enemies = [];
let bullets = [];
let level = 1;
let money = 0;

// Player Controls
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && player.x > 0) {
        player.x -= player.speed;
    } else if (e.key === 'ArrowRight' && player.x < canvas.width - player.width) {
        player.x += player.speed;
    } else if (e.key === ' ' && player.health > 0) {
        shootBullet();
    }
});

// Bullet mechanics
function shootBullet() {
    bullets.push({
        x: player.x + player.width / 2,
        y: player.y,
        width: 5,
        height: 10,
        speed: 7,
        color: 'red'
    });
}

// Draw game objects
function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawEnemies() {
    enemies.forEach((enemy, index) => {
        ctx.fillStyle = 'green';
        ctx.fillRect(enemy.x, enemy.y, 50, 50);
        enemy.y += 2;
        if (enemy.y > canvas.height) {
            enemies.splice(index, 1);
            player.health -= 10; // Lose health when enemy reaches the bottom
        }
    });
}

function drawBullets() {
    bullets.forEach((bullet, index) => {
        ctx.fillStyle = bullet.color;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        bullet.y -= bullet.speed;
        if (bullet.y < 0) {
            bullets.splice(index, 1);
        }
    });
}

// Spawn enemies
function spawnEnemies() {
    if (Math.random() < 0.02 * level) {
        enemies.push({
            x: Math.random() * canvas.width,
            y: 0
        });
    }
}

// Check for collisions
function checkCollisions() {
    bullets.forEach((bullet, bIndex) => {
        enemies.forEach((enemy, eIndex) => {
            if (bullet.x < enemy.x + 50 && bullet.x + bullet.width > enemy.x && bullet.y < enemy.y + 50 && bullet.y + bullet.height > enemy.y) {
                bullets.splice(bIndex, 1);
                enemies.splice(eIndex, 1);
                money += 10;
            }
        });
    });
}

// Draw HUD
function drawHUD() {
    document.getElementById('money').textContent = money;
    document.getElementById('level').textContent = level;
    document.getElementById('health').textContent = player.health;
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawEnemies();
    drawBullets();
    spawnEnemies();
    checkCollisions();
    drawHUD();

    if (player.health <= 0) {
        alert('Game Over!');
        resetGame();
    }

    requestAnimationFrame(gameLoop);
}

function resetGame() {
    player.x = canvas.width / 2;
    player.y = canvas.height - 100;
    player.health = 100;
    enemies = [];
    bullets = [];
    level = 1;
    money = 0;
}

// Start the game
gameLoop();
