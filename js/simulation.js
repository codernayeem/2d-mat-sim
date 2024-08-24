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

        this.simData = new SimulationData();
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
                let cellType = this.simData.cellObjectTypes[cell];
                if(cellType.color != "")
                    fill(this.BgColor);
                cellType.draw(x, y, this.cellSize);
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
        let rand_weights = this.simData.randomFillWeights;

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
            for(let i = 0; i<this.simData.cellObjectTypes.length; i++){
                s += this.simData.cellObjectTypes[i].name + "(" + i + ")  ";
            }
            if (x >= 0 && x < this.cols && y >= 0 && y < this.rows) {
                let type = parseInt(prompt(s));
                if (type >= 0 && type < this.simData.cellObjectTypes.length) {
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

    updateGrid(){
        // update grid
        this.simData.updateGrid(this.grid, this.rows, this.cols);
    }
}
