class CellObjectType {
    constructor(name, symbol, color) {
        this.name = name;
        this.symbol = symbol;
        this.color = color;
    }

    draw(x, y, cellSize) {
        if(this.color)
            fill(this.color);

        rect(x * cellSize, y * cellSize, cellSize, cellSize);
        
        if(this.symbol){
            textSize(cellSize * 0.8);
            textAlign(CENTER, CENTER);
            text(this.symbol, x * cellSize + cellSize / 2, y * cellSize + cellSize / 2);
        }
    }
}
