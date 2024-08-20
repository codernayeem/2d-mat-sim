
let simulation = new Simulation(
    parseInt(document.getElementById('rows').value),
    parseInt(document.getElementById('cols').value)
);

// setting up buttons
document.getElementById('rows').addEventListener('input', () => simulation.initGrid());
document.getElementById('cols').addEventListener('input', () => simulation.initGrid());
document.getElementById('bgColor').addEventListener('input', () => simulation.updateBackground());
document.getElementById('startBtn').addEventListener('click', () => simulation.toggleSimulation(true));
document.getElementById('pauseBtn').addEventListener('click', () => simulation.toggleSimulation(false));
document.getElementById('resetBtn').addEventListener('click', () => simulation.reset());
document.getElementById('randomFillBtn').addEventListener('click', () => simulation.randomFill());
speed = parseInt(document.getElementById('speed').value);
document.getElementById('speed').addEventListener('input', (e) => { speed = parseInt(e.target.value); });

function setup() {
    let canvas = createCanvas(windowWidth - 340, windowHeight);
    canvas.parent('canvas-container');
    simulation.setup();
    noLoop();
}

function draw() {
    simulation.drawGrid();
    if (simulation.running) {
        simulation.updateGrid();
        frameRate(speed);
    }else{
        noLoop();
    }
}

function mousePressed() {
    simulation.mousePress();
}

function windowResized() {
    resizeCanvas(windowWidth - 340, windowHeight);
    let r = simulation.running;
    if(r) simulation.running = false;
    loop();
    simulation.running = r;
}