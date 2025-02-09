// Basic setup for a single-player version of a Territorial.io-style game
// This script initializes a game map, player expansion, bot behaviors, and rendering

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Create UI elements
const ui = document.createElement("div");
ui.style.position = "absolute";
ui.style.top = "10px";
ui.style.left = "10px";
ui.style.background = "rgba(0, 0, 0, 0.5)";
ui.style.color = "white";
ui.style.padding = "10px";
ui.style.fontFamily = "Arial, sans-serif";
ui.style.transition = "opacity 0.3s ease-in-out";
document.body.appendChild(ui);

const gameOverScreen = document.createElement("div");
gameOverScreen.style.position = "absolute";
gameOverScreen.style.top = "50%";
gameOverScreen.style.left = "50%";
gameOverScreen.style.transform = "translate(-50%, -50%)";
gameOverScreen.style.background = "rgba(0, 0, 0, 0.8)";
gameOverScreen.style.color = "white";
gameOverScreen.style.padding = "20px";
gameOverScreen.style.fontSize = "24px";
gameOverScreen.style.display = "none";
gameOverScreen.style.transition = "opacity 0.5s ease-in-out";
document.body.appendChild(gameOverScreen);

// Create Mini-Map
const miniMap = document.createElement("canvas");
miniMap.width = 200;
miniMap.height = 200;
miniMap.style.position = "absolute";
miniMap.style.bottom = "10px";
miniMap.style.right = "10px";
miniMap.style.background = "black";
miniMap.style.border = "2px solid white";
document.body.appendChild(miniMap);
const miniCtx = miniMap.getContext("2d");

// Define game variables
const player = { x: 100, y: 100, size: 20, color: "blue", troops: 1000 };
const bots = [];
const territories = [];
const mapSize = { width: 2000, height: 2000 };

// Camera settings
let camera = { x: 0, y: 0, dragging: false, startX: 0, startY: 0 };

// Import external modules
import { generateMap } from "./map.js";
import { createBots, aiExpansion, setBotDifficulty, botAttack } from "./ai.js";

// Bot difficulty settings
const botDifficulties = {
    easy: { expansionRate: 0.5, attackFrequency: 0.3 },
    normal: { expansionRate: 1, attackFrequency: 1 },
    hard: { expansionRate: 1.5, attackFrequency: 1.5 }
};

function adjustBotDifficulty(level) {
    if (botDifficulties[level]) {
        setBotDifficulty(botDifficulties[level]);
    }
}

// Handle player movement and camera dragging
canvas.addEventListener("mousedown", function(event) {
    camera.dragging = true;
    camera.startX = event.clientX;
    camera.startY = event.clientY;
});

canvas.addEventListener("mousemove", function(event) {
    if (camera.dragging) {
        camera.x -= event.clientX - camera.startX;
        camera.y -= event.clientY - camera.startY;
        camera.startX = event.clientX;
        camera.startY = event.clientY;
    }
});

canvas.addEventListener("mouseup", function() {
    camera.dragging = false;
});

// Handle troop deployment using keyboard shortcuts
document.addEventListener("keydown", function(event) {
    if (event.key >= "1" && event.key <= "5") {
        let percentage = parseInt(event.key) * 20; // 1 = 20%, 5 = 100%
        player.troopsToSend = Math.floor(player.troops * (percentage / 100));
    }
});

// Handle player expansion
canvas.addEventListener("click", function(event) {
    const clickX = event.clientX + camera.x;
    const clickY = event.clientY + camera.y;
    
    territories.forEach(t => {
        if (
            clickX >= t.x && clickX <= t.x + t.size &&
            clickY >= t.y && clickY <= t.y + t.size
        ) {
            if (t.owner === null || t.owner !== player) {
                if (player.troops > t.troops) {
                    t.owner = player;
                    t.troops = Math.floor(player.troops * 0.5);
                    player.troops -= t.troops;
                }
            }
        }
    });
});

// Troop growth function
function growTroops() {
    territories.forEach(t => {
        if (t.owner) {
            t.troops += Math.floor(t.size * 0.01); // Growth rate based on territory size
        }
    });
}

// Draw Mini-Map
function drawMiniMap() {
    miniCtx.clearRect(0, 0, miniMap.width, miniMap.height);
    const scale = miniMap.width / mapSize.width;
    
    territories.forEach(t => {
        miniCtx.fillStyle = t.owner ? t.owner.color : "gray";
        miniCtx.fillRect(t.x * scale, t.y * scale, t.size * scale, t.size * scale);
    });
    
    miniCtx.fillStyle = player.color;
    miniCtx.fillRect(player.x * scale, player.y * scale, player.size * scale, player.size * scale);
}

// Check for game over conditions
function checkGameOver() {
    let playerTerritories = territories.filter(t => t.owner === player).length;
    let totalTerritories = territories.length;

    if (playerTerritories === 0) {
        gameOverScreen.innerHTML = "Game Over! You Lost!";
        gameOverScreen.style.opacity = "1";
        gameOverScreen.style.display = "block";
        cancelAnimationFrame(update);
    } else if (playerTerritories === totalTerritories) {
        gameOverScreen.innerHTML = "Congratulations! You Won!";
        gameOverScreen.style.opacity = "1";
        gameOverScreen.style.display = "block";
        cancelAnimationFrame(update);
    }
}

// Game loop
function update() {
    aiExpansion();
    botAttack();
    growTroops();
    updateUI();
    checkGameOver();
    draw();
    drawMiniMap();
    requestAnimationFrame(update);
}

// Initialize game
generateMap(territories, mapSize);
createBots(5, bots, mapSize);
adjustBotDifficulty("normal"); // Set default bot difficulty
update();
