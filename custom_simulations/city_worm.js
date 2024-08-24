OFFSETS_Direct = [[0, -1], [1, 0], [0, 1], [-1, 0]];
OFFSETS_Diag = [[1, -1], [1, 1], [-1, 1], [-1, -1]];
OFFSETS_All = [[0, -1], [1, 0], [0, 1], [-1, 0], [1, -1], [1, 1], [-1, 1], [-1, -1]];

SimulationData = class {
    // mandatory
    title = "City Worm";
    description = "6 City Spreads, while worms destroy them.";

    // mandatory (Cell Types)
    cellObjectTypes = [
        new CellObjectType("empty", "", "#ffffff"),
        new CellObjectType("stone", "❌", "#000000"),
        new CellObjectType("worm", "🚆", "#ffffff"),
        new CellObjectType("city-1", "", "#00FF00"),
        new CellObjectType("city-2", "", "#0000FF"),
        new CellObjectType("city-3", "", "#00FFFF"),
        new CellObjectType("city-4", "", "#FFFF00"),
        new CellObjectType("city-5", "", "#FF00FF"),
        new CellObjectType("city-6", "", "#888888"),
    ];

    // mandatory
    randomFillWeights = [10, 3, 1, 2, 2, 2, 2, 2, 2];

    // mandatory
    updateGrid(grid, rows, cols) {
        let prevGrid = grid.map(arr => [...arr]);

        // worm behaviour (move - diagonally)
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                let cell = prevGrid[y][x];
    
                if (cell != 2) continue;
    
                let neighborsCities = this.getNeighbors(x, y, 1, rows, cols)
                    .filter(n => grid[n.y][n.x] != 1 && grid[n.y][n.x] != 2); // Only empty cells and cities
    
                if (neighborsCities.length == 0) continue;
    
                let t = random(neighborsCities);
                grid[t.y][t.x] = 2; // Move the worm
                grid[y][x] = 0; // Clear the original position
            }
        }

        prevGrid = grid.map(arr => [...arr]);

        // spread behaviour of cities into empty cells
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                if (prevGrid[y][x] != 0) continue;

                let neighborsCities = this.getNeighbors(x, y, 0, rows, cols)
                    .filter(n => prevGrid[n.y][n.x] > 2); // only cities

                if(neighborsCities.length == 0) continue;

                let target = random(neighborsCities);
                grid[y][x] = grid[target.y][target.x];
            }
        }

        // worm behaviour (boom - destroy adjacent 8 cities)
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                if (grid[y][x] != 2) continue;
    
                let neighborsCities = this.getNeighbors(x, y, 2, rows, cols)
                    .filter(n => grid[n.y][n.x] > 2 && grid[n.y][n.x] != 0); // Only and cities
    
                if (neighborsCities.length == 0) continue;

                // Clear neighbors cells
                for (let i = 0; i < neighborsCities.length; i++) {
                    let t = neighborsCities[i];
                    grid[t.y][t.x] = 0; 
                }
            }
        }

    }

    getNeighbors(x, y, flag, rows, cols) {
        if (flag == 0)
            return OFFSETS_Direct.map(([dx, dy]) => ({ x: x + dx, y: y + dy })).filter(n => n.x >= 0 && n.x < cols && n.y >= 0 && n.y < rows);
        else if(flag == 1)
            return OFFSETS_Diag.map(([dx, dy]) => ({ x: x + dx, y: y + dy })).filter(n => n.x >= 0 && n.x < cols && n.y >= 0 && n.y < rows);
        else
            return OFFSETS_All.map(([dx, dy]) => ({ x: x + dx, y: y + dy })).filter(n => n.x >= 0 && n.x < cols && n.y >= 0 && n.y < rows);
    }
}
