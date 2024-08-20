class CellObjectType {
    constructor(name, symbol, color) {
        this.name = name;
        this.symbol = symbol;
        this.color = color;
    }

    draw(x, y, cellSize) {
        if(this.color)
            fill(this.color);
        if(this.symbol){
            textSize(cellSize * 0.8);
            textAlign(CENTER, CENTER);
            text(this.symbol, x * cellSize + cellSize / 2, y * cellSize + cellSize / 2);
        }
    }
}

// customize as your needs
const cellObjectTypes = [
    new CellObjectType("empty", "", ""),
    new CellObjectType("stone", "❌", "#000000"),
    new CellObjectType("worm", "🚆", ""),
    new CellObjectType("city-1", "", "#00FF00"),
    new CellObjectType("city-2", "", "#0000FF"),
    new CellObjectType("city-3", "", "#00FFFF"),
    new CellObjectType("city-4", "", "#FFFF00"),
    new CellObjectType("city-5", "", "#FF00FF"),
    new CellObjectType("city-6", "", "#888888"),
];


// customize weights for random fill as your needs
let rand_weights = [...Array(cellObjectTypes.length).keys()].map(i => i + 1);
rand_weights[0] = 15; // empty
rand_weights[1] = 3; // stone
rand_weights[2] = 2; // worm

const cumulativeWeights = [];
let totalWeight = 0;
for (let i = 0; i < rand_weights.length; i++) {
    totalWeight += rand_weights[i];
    cumulativeWeights.push(totalWeight);
}

function getRandomWeightedIndex() {
    const randomNum = Math.random() * totalWeight;

    for (let i = 0; i < cumulativeWeights.length; i++) {
        if (randomNum < cumulativeWeights[i]) {
            return i;
        }
    }
}
