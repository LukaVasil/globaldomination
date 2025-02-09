// AI Logic for bot behavior in the game

const bots = [];
let botDifficulty = { expansionRate: 1, attackFrequency: 1 };

export function createBots(count, botList, mapSize) {
    for (let i = 0; i < count; i++) {
        botList.push({
            x: Math.random() * mapSize.width,
            y: Math.random() * mapSize.height,
            size: 20,
            color: getRandomColor(),
            troops: 500,
            target: null
        });
    }
}

export function setBotDifficulty(difficulty) {
    botDifficulty = difficulty;
}

export function aiExpansion() {
    bots.forEach(bot => {
        bot.troops += Math.floor(bot.size * 0.01 * botDifficulty.expansionRate);
        let target = findBestExpansion(bot);
        if (target) {
            bot.troops -= Math.floor(bot.troops * 0.3);
            target.owner = bot;
            target.troops = Math.floor(bot.troops * 0.3);
        }
    });
}

export function botAttack() {
    bots.forEach(bot => {
        if (Math.random() < 0.1 * botDifficulty.attackFrequency) {
            let target = findWeakestEnemy(bot);
            if (target && bot.troops > target.troops * 1.2) {
                target.owner = bot;
                target.troops = Math.floor(bot.troops * 0.5);
                bot.troops -= target.troops;
            }
        }
    });
}

function findBestExpansion(bot) {
    return bots.find(other => other.owner === null && Math.hypot(bot.x - other.x, bot.y - other.y) < 150);
}

function findWeakestEnemy(bot) {
    return bots
        .filter(other => other !== bot && other.owner !== bot && other.troops < bot.troops)
        .sort((a, b) => a.troops - b.troops)[0];
}

function getRandomColor() {
    return `hsl(${Math.random() * 360}, 100%, 50%)`;
}
