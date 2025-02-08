// map.js - Handles territory generation

export function generateMap(territories, mapSize) {
    for (let i = 0; i < 50; i++) {
        territories.push({
            x: Math.random() * mapSize.width,
            y: Math.random() * mapSize.height,
            size: 40,
            owner: null,
            troops: Math.floor(Math.random() * 500)
        });
    }
}
