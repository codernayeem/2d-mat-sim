SimulationData = class {
    // mandatory
    title = "Game of Life";
    description = "A classic Game of Life Simulation";

    // mandatory (Cell Types)
    cellObjectTypes = [
        new CellObjectType("dead", "", "#ffffff"), // 0
        new CellObjectType("alive", "", "#000000"), // 1
    ];

    // mandatory - probability for each type of cell
    randomFillWeights = [3, 1]; // (75%, 25%)

    // mandatory
    updateGrid(grid, rows, cols) {
        const prevGrid = grid.map(arr => [...arr]);

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                let aliveNeighbors = this.countAliveNeighbors(prevGrid, x, y, rows, cols);

                if (prevGrid[y][x] == 1) {
                    if (aliveNeighbors < 2 || aliveNeighbors > 3)
                        grid[y][x] = 0;
                    else
                        grid[y][x] = 1;
                } else {
                    if (aliveNeighbors === 3)
                        grid[y][x] = 1;
                    else 
                        grid[y][x] = 0;
                }
            }
        }
    }

    dx = [-1, -1, -1, 0, 0, 1, 1, 1];
    dy = [-1, 0, 1, 1, -1, -1, 0, 1];

    countAliveNeighbors(grid, x, y, rows, cols) {
        let count = 0;
        for (let j = 0; j < 8; j++) {
            let nx = x + this.dx[j];
            let ny = y + this.dy[j];
            if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
                count += grid[ny][nx];
            }
        }
        return count;
    }
}
