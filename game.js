// Basic setup for a single-player version of a Territorial.io-style game
// This script initializes a game map, player expansion, and rendering

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
document.body.appendChild(ui);

// Define game variables
const player = { x: 100, y: 100, size: 20, color: "blue", troops: 1000 };
const bots = [];
const territories = [];
const mapSize = { width: 2000, height: 2000 };

// Camera settings
let camera = { x: 0, y: 0, dragging: false, startX: 0, startY: 0 };

// Import external modules
import { generateMap } from "./map.js";
import { createBots, aiExpansion } from "./ai.js";

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

// Camera movement (dragging)
canvas.addEventListener("mousedown", (e) => {
    camera.dragging = true;
    camera.startX = e.clientX;
    camera.startY = e.clientY;
});

canvas.addEventListener("mousemove", (e) => {
    if (camera.dragging) {
        camera.x -= e.clientX - camera.startX;
        camera.y -= e.clientY - camera.startY;
        camera.startX = e.clientX;
        camera.startY = e.clientY;
    }
});

canvas.addEventListener("mouseup", () => {
    camera.dragging = false;
});

// Troop growth function
function growTroops() {
    let playerTerritories = territories.filter(t => t.owner === player).length;
    player.troops += Math.max(1, Math.floor(playerTerritories * 0.1));
    
    bots.forEach(bot => {
        let botTerritories = territories.filter(t => t.owner === bot).length;
        bot.troops += Math.max(1, Math.floor(botTerritories * 0.1));
    });
}

// Update UI
function updateUI() {
    let playerTerritories = territories.filter(t => t.owner === player).length;
    ui.innerHTML = `Troops: ${player.troops} | Territories: ${playerTerritories}`;
}

// Draw the game elements
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw territories
    territories.forEach(t => {
        ctx.fillStyle = t.owner ? t.owner.color : "gray";
        ctx.fillRect(t.x - camera.x, t.y - camera.y, t.size, t.size);
    });
    
    // Draw player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x - camera.x, player.y - camera.y, player.size, player.size);
    
    // Draw bots
    bots.forEach(bot => {
        ctx.fillStyle = bot.color;
        ctx.fillRect(bot.x - camera.x, bot.y - camera.y, bot.size, bot.size);
    });
}

// Game loop
function update() {
    aiExpansion();
    growTroops();
    updateUI();
    draw();
    requestAnimationFrame(update);
}

// Initialize game
generateMap(territories, mapSize);
createBots(5, bots, mapSize);
update();
