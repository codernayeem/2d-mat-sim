class Simulation {
    constructor(r, c, speed, gbw, gbo, bgc, bc) {
        this.rows = r;
        this.cols = c;
        this.cellSize = 0;
        this.grid = [];
        this.running = false;
        this.mouseClickable = true;
        this.speed = speed;

        this.gridBroderWidth = gbw;
        this.gridBroderOpacity = gbo;
        this.BgColor = bgc;
        this.BorderColor = bc;

        this.offsetsDirect = [[0, -1], [1, 0], [0, 1], [-1, 0]];
        this.offsetsDiag = [[1, -1], [1, 1], [-1, 1], [-1, -1]];
        this.offsetsAll = [[0, -1], [1, 0], [0, 1], [-1, 0], [1, -1], [1, 1], [-1, 1], [-1, -1]];
    }

    setup() {
        this.initGrid();
    }

    initGrid() {
        this.grid = Array.from({ length: this.rows }, () => Array(this.cols).fill(0)); // Default to empty (0)
        loop();
    }

    drawGrid() {
        background(this.BgColor);
        this.cellSize = min((width - 20) / this.cols, (height - 20) / this.rows);
        translate((width - this.cols * this.cellSize) / 2, (height - this.rows * this.cellSize) / 2);

        strokeWeight(this.gridBroderWidth);
        stroke(color(this.BorderColor + hex(floor(255 * this.gridBroderOpacity), 2)));

        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                let cell = this.grid[y][x];
                let cellType = cellObjectTypes[cell];
                fill(cellType.color);
                rect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);

                if (cell != 0) { // not empty
                    cellType.draw(x, y, this.cellSize);
                }
            }
        }
    }

    toggleSimulation(run) {
        this.running = run;
        btStart.style.display = this.running ? 'none' : 'block';
        btPause.style.display = this.running ? 'block' : 'none';
        if (this.running) {
            loop();
        } else {
            noLoop();
        }
    }

    randomFill() {
        this.grid = Array.from({ length: this.rows }, () =>
            Array.from({ length: this.cols }, () => getRandomWeightedIndex())
        );
        loop();
    }

    preview(){
        // show result of changing controls
        // despite of simulation running status

        const r = this.running;
        if(r) this.running = false;
        loop();
        this.running = r;
    }

    reset(){
        if(this.running) this.toggleSimulation(false);
        this.initGrid();
    }

    mousePress(){
        // TODO: Need to fix click pos
        if (!this.running && this.mouseClickable) {
            // console.log(mouseX, mouseY, width, height);
            if(width < height){ // works if the matrix is square
                mouseY -= (height - width) / 2;
            }else{
                mouseX -= (width - height) / 2;
            }
            let x = floor(mouseX / this.cellSize);
            let y = floor(mouseY / this.cellSize);
            let s = "Enter id for ("+x+", "+y+"): ";
            for(let i = 0; i<cellObjectTypes.length; i++){
                s += cellObjectTypes[i].name + "(" + i + ")  ";
            }
            if (x >= 0 && x < this.cols && y >= 0 && y < this.rows) {
                let type = parseInt(prompt(s));
                if (type >= 0 && type < cellObjectTypes.length) {
                    this.grid[y][x] = type;
                    loop();
                }
            }
        }
    }

    printGrid(){
        let s = "";
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                s += this.grid[y][x] +" ";
            }
            s += "\n";
        }
        console.log(s);
    }

    // customize as your need
    updateGrid(){
        // this.printGrid();

        let newGrid = this.grid.map(arr => [...arr]);

        // worm behaviour (move - diagonally)
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                let cell = this.grid[y][x];
    
                if (cell != 2) continue;
    
                let neighborsCities = this.getNeighbors(x, y, 1)
                    .filter(n => newGrid[n.y][n.x] != 1 && newGrid[n.y][n.x] != 2); // Only empty cells and cities
    
                if (neighborsCities.length == 0) continue;
    
                let t = random(neighborsCities);
                newGrid[t.y][t.x] = 2; // Move the worm
                newGrid[y][x] = 0; // Clear the original position
            }
        }

        this.grid = newGrid.map(arr => [...arr]);

        // spread behaviour of cities into empty cells
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                let cell = this.grid[y][x];

                if (cell != 0) continue;

                let neighborsCities = this.getNeighbors(x, y, 0)
                    .filter(n => this.grid[n.y][n.x] > 2); // only cities

                if(neighborsCities.length == 0) continue;

                let target = random(neighborsCities);
                newGrid[y][x] = this.grid[target.y][target.x];
            }
        }

        this.grid = newGrid.map(arr => [...arr]);

        // worm behaviour (boom - destroy adjacent 8 cities)
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                let cell = this.grid[y][x];
    
                if (cell != 2) continue;
    
                let neighborsCities = this.getNeighbors(x, y, 2)
                    .filter(n => this.grid[n.y][n.x] > 2); // Only empty cells and cities
    
                if (neighborsCities.length == 0) continue;

                // Clear neighbors cells
                for (let i = 0; i < neighborsCities.length; i++) {
                    let t = neighborsCities[i];
                    this.grid[t.y][t.x] = 0; 
                }
            }
        }
    }

    getNeighbors(x, y, flag) {
        if (flag == 0)
            return this.offsetsDirect.map(([dx, dy]) => ({ x: x + dx, y: y + dy })).filter(n => n.x >= 0 && n.x < this.cols && n.y >= 0 && n.y < this.rows);
        else if(flag == 1)
            return this.offsetsDiag.map(([dx, dy]) => ({ x: x + dx, y: y + dy })).filter(n => n.x >= 0 && n.x < this.cols && n.y >= 0 && n.y < this.rows);
        else
            return this.offsetsAll.map(([dx, dy]) => ({ x: x + dx, y: y + dy })).filter(n => n.x >= 0 && n.x < this.cols && n.y >= 0 && n.y < this.rows);
    }
}