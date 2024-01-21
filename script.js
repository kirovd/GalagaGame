const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const player = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    width: 50,
    height: 50,
    img: new Image(),
    speed: 15,
};

const bullets = [];
let score = 0;

const modal = document.getElementById("gameOverModal");
const scoreText = document.getElementById("scoreText");

const imageUrls = {
    bullets: 'https://i.postimg.cc/PNT2wznc/bullets.png',
    enemy1: 'https://i.postimg.cc/w32Fcy6B/enemy.png',
    bossEnemy: 'https://i.postimg.cc/GHSQVWTw/galaga-Boss.png',
    enemy2: 'https://i.postimg.cc/GHpKML2x/goei.png',
    enemy3: 'https://i.postimg.cc/mPzwsm7c/midori.png',
    enemy4: 'https://i.postimg.cc/Hrqtsbt6/sasori.png',
    player: 'https://i.postimg.cc/qt2xtgb4/ship.png',
    enemy5: 'https://i.postimg.cc/k69FW9z8/zako.png',
};

player.img.src = imageUrls.player;

let isGameOver = false;
let isGameStarted = false;

const enemies = [];

function showGameOverModal() {
    scoreText.textContent = "Your Score: " + score;
    modal.style.display = "block";
    isGameOver = true;
}

function retryGame() {
    modal.style.display = "none";
    resetGame();
    isGameOver = false;
    isGameStarted = false;
    const welcomeText = document.getElementById("welcomeText");
    if (welcomeText) {
        welcomeText.remove();
    }
    draw();
}

function drawPlayer() {
    ctx.drawImage(player.img, player.x, player.y, player.width, player.height);
}

function drawEnemy(enemy) {
    const enemyImg = new Image();
    const randomEnemyType = Math.floor(Math.random() * 5) + 1;
    enemyImg.src = imageUrls[`enemy${randomEnemyType}`];
    ctx.drawImage(enemyImg, enemy.x, enemy.y, enemy.width, enemy.height);
}

function drawBigEnemy(bigEnemy) {
    const bigEnemyImg = new Image();
    bigEnemyImg.src = imageUrls.bossEnemy;
    ctx.drawImage(bigEnemyImg, bigEnemy.x, bigEnemy.y, bigEnemy.width, bigEnemy.height);
}

function drawBullets() {
    for (let i = 0; i < bullets.length; i++) {
        const bulletImg = new Image();
        bulletImg.src = imageUrls.bullets;
        ctx.drawImage(bulletImg, bullets[i].x, bullets[i].y, 5, 10);

        bullets[i].y -= 5;

        for (let j = 0; j < enemies.length; j++) {
            if (
                bullets[i] &&
                bullets[i].x < enemies[j].x + enemies[j].width &&
                bullets[i].x + 5 > enemies[j].x &&
                bullets[i].y < enemies[j].y + enemies[j].height &&
                bullets[i].y + 10 > enemies[j].y
            ) {
                if (enemies[j].width > 20) {
                    enemies.push({
                        x: enemies[j].x,
                        y: enemies[j].y,
                        width: enemies[j].width / 2,
                        height: enemies[j].height,
                        speed: enemies[j].speed,
                    });
                    enemies.push({
                        x: enemies[j].x + enemies[j].width / 2,
                        y: enemies[j].y,
                        width: enemies[j].width / 2,
                        height: enemies[j].height,
                        speed: enemies[j].speed,
                    });
                }
                enemies.splice(j, 1);
                bullets.splice(i, 1);
                score += 100;
            }
        }

        for (let k = 0; k < bigEnemies.length; k++) {
            if (
                bullets[i] &&
                bullets[i].x < bigEnemies[k].x + bigEnemies[k].width &&
                bullets[i].x + 5 > bigEnemies[k].x &&
                bullets[i].y < bigEnemies[k].y + bigEnemies[k].height &&
                bullets[i].y + 10 > bigEnemies[k].y
            ) {
                bullets.splice(i, 1);
                bigEnemies[k].bulletHits++;

                if (bigEnemies[k].bulletHits >= 50) {
                    bigEnemies[k].color = "#888";
                }

                if (bigEnemies[k].bulletHits >= 150) {
                    bigEnemies.splice(k, 1);
                    score += 1000;
                }
            }
        }

        if (bullets[i] && bullets[i].y < 0) {
            bullets.splice(i, 1);
        }
    }
}

const bigEnemies = [];

function moveBigEnemies() {
    for (let i = 0; i < bigEnemies.length; i++) {
        if (bigEnemies[i].y > canvas.height) {
            bigEnemies[i].x = Math.random() * (canvas.width - 50);
            bigEnemies[i].y = Math.random() * (canvas.height / 5);
            bigEnemies[i].speed = 0;

            setTimeout(() => {
                bigEnemies[i].speed = Math.random() * 1 + 1;
                bigEnemies[i].x = Math.random() * (canvas.width - 50);
                bigEnemies[i].y = Math.random() * (canvas.height / 5);
            }, 20000);

            bigEnemies[i].bulletHits = 0;
            bigEnemies[i].color = "#F00";
        }

        if (bigEnemies[i].x < 0 || bigEnemies[i].x + bigEnemies[i].width > canvas.width) {
            bigEnemies[i].speed = -bigEnemies[i].speed;
        }

        bigEnemies[i].x += bigEnemies[i].speed;
    }
}

function moveEnemies() {
    for (let i = 0; i < enemies.length; i++) {
        if (enemies[i].y > canvas.height) {
            enemies[i].x = Math.random() * (canvas.width - 50);
            enemies[i].y = Math.random() * (canvas.height / 2);
            enemies[i].speed = 0;

            setTimeout(() => {
                enemies[i].speed = Math.random() * 1 + 1;
                enemies[i].x = Math.random() * (canvas.width - 50);
                enemies[i].y = 0;
            }, 20000);
        }

        enemies[i].y += enemies[i].speed;

        if (
            player.x < enemies[i].x + enemies[i].width &&
            player.x + player.width > enemies[i].x &&
            player.y < enemies[i].y + enemies[i].height &&
            player.y + player.height > enemies[i].y
        ) {
            showGameOverModal();
        }
    }
}

function drawScore() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "#FFF";   
    ctx.fillText("Score: " + score, canvas.width - 150, 30);

    if (score >= 1000000) {
        alert("Congratulations! You have the highest score!");
        resetGame();
    }
}

function resetGame() {
    score = 0;
    player.x = canvas.width / 2;
    player.y = canvas.height - 30;
    enemies.length = 0;
    bigEnemies.length = 0;
}

function draw() {
    if (isGameOver || !isGameStarted) {
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayer();
    drawBullets();
    drawScore();

    if (Math.random() < 0.02 && enemies.length < 5) {
        const randomEnemyType = Math.floor(Math.random() * 5) + 1;
        enemies.push({
            x: Math.random() * (canvas.width - 50),
            y: 0,
            width: 50,
            height: 50,
            speed: Math.random() * 1 + 1,
            type: randomEnemyType,
        });
    }

    if (score >= 2000 && score % 2000 === 0 && bigEnemies.length === 0) {
        bigEnemies.push({
            x: Math.random() * (canvas.width - 50),
            y: 0,
            width: 100,
            height: 100,
            speed: Math.random() * 1 + 1,
            bulletHits: 0,
            color: "#F00",
        });
    }

    for (let i = 0; i < enemies.length; i++) {
        drawEnemy(enemies[i]);
    }

    for (let i = 0; i < bigEnemies.length; i++) {
        drawBigEnemy(bigEnemies[i]);
    }

    moveEnemies();
    moveBigEnemies();

    requestAnimationFrame(draw);
}

function movePlayer(e) {
    if (isGameOver) {
        return;
    }

    if (e.keyCode == 37 && player.x > 0) {
        player.x -= player.speed;
    } else if (e.keyCode == 39 && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }

    if (e.keyCode == 32) {
        if (!isGameStarted) {
            isGameStarted = true;
            const welcomeText = document.getElementById("welcomeText");
            if (welcomeText) {
                welcomeText.remove();
            }
            draw();
        } else {
            bullets.push({ x: player.x + player.width / 2 - 2.5, y: player.y });
        }
    }
}

document.addEventListener("keydown", movePlayer);

draw();
