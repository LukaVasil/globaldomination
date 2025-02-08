// ai.js - Handles AI behavior

export function createBots(num, bots, mapSize) {
    for (let i = 0; i < num; i++) {
        bots.push({
            x: Math.random() * mapSize.width,
            y: Math.random() * mapSize.height,
            size: 20,
            color: "red",
            troops: 1000
        });
    }
}

export function aiExpansion(bots, territories) {
    bots.forEach(bot => {
        let target = territories
            .filter(t => t.owner !== bot) // Only consider unowned or enemy territories
            .sort((a, b) => a.troops - b.troops)[0]; // Prioritize weakest territory
        
        if (target && bot.troops > target.troops) {
            target.owner = bot;
            target.troops = Math.floor(bot.troops * 0.5);
            bot.troops -= target.troops;
        }
    });
}
