
// HTML elements from the document
const ctrlRows = document.getElementById('ctrl_rows');
const ctrlCols = document.getElementById('ctrl_cols');
const ctrlSpeed = document.getElementById('ctrl_speed');
const ctrlSpeedValue = document.getElementById('ctrl_speedValue');
const ctrlBorderWidth = document.getElementById('ctrl_borderWidth');
const ctrlBorderWidthValue = document.getElementById('ctrl_borderWidthValue');
const ctrlBorderOpacity = document.getElementById('ctrl_borderOpacity');
const ctrlBorderOpacityValue = document.getElementById('ctrl_borderOpacityValue');
const ctrlBgColor = document.getElementById('ctrl_bgColor');
const ctrlBorderColor = document.getElementById('ctrl_borderColor');
const btStart = document.getElementById('bt_start');
const btPause = document.getElementById('bt_pause');
const btReset = document.getElementById('bt_reset');
const btRandomFill = document.getElementById('bt_randomFill');
const infoButton = document.getElementById('infoButton');
const infoDialog = document.getElementById('infoDialog');
const infoDialogCloseBt = document.getElementById('infoDialog_closeBt');
const dynamicScript = document.getElementById('dynamicScript');
const canvasParent = 'canvas-container';

// The main simulation class
const simulation = new Simulation(
    parseInt(ctrlRows.value),
    parseInt(ctrlCols.value),
    parseInt(ctrlSpeed.value),
    parseInt(ctrlBorderWidth.value),
    parseFloat(ctrlBorderOpacity.value),
    ctrlBgColor.value,
    ctrlBorderColor.value,
);

// handle controls
ctrlRows.addEventListener('input', function() {
    let r = ctrlRows.value;
    if(r == "") return;
    r = parseInt(r);
    if(r < 1 || r == simulation.rows) return;

    simulation.rows = r;
    simulation.toggleSimulation(false);
    simulation.initGrid();
});

ctrlCols.addEventListener('input', function() {
    let c = ctrlCols.value;
    if(c == "") return;
    c = parseInt(c);
    if(c < 1 || c == simulation.cols) return;

    simulation.cols = c;
    simulation.toggleSimulation(false);
    simulation.initGrid();
});

ctrlSpeed.addEventListener('input', function() {
    simulation.speed = parseInt(this.value);
    ctrlSpeedValue.innerText = this.value;
});

ctrlBorderWidth.addEventListener('input', function() {
    simulation.gridBroderWidth = parseInt(this.value);
    ctrlBorderWidthValue.innerText = this.value;
    simulation.preview();
});

ctrlBorderOpacity.addEventListener('input', function() {
    simulation.gridBroderOpacity = parseFloat(this.value);
    ctrlBorderOpacityValue.innerText = this.value;
    simulation.preview();
});

ctrlBgColor.addEventListener('input', function() {
    simulation.BgColor = ctrlBgColor.value;
    simulation.preview();
});

ctrlBorderColor.addEventListener('input', function() {
    simulation.BorderColor = ctrlBorderColor.value;
    simulation.preview();
});

// control buttons
btStart.addEventListener('click', () => simulation.toggleSimulation(true));
btPause.addEventListener('click', () => simulation.toggleSimulation(false));
btReset.addEventListener('click', () => simulation.reset());
btRandomFill.addEventListener('click', () => simulation.randomFill());


// the Info dialog
infoButton.addEventListener('click', () => {
    infoDialog.classList.remove('hidden');
    simulation.mouseClickable = false;
});

infoDialogCloseBt.addEventListener('click', () => {
    simulation.mouseClickable = true;
    infoDialog.classList.add('hidden');
});

infoDialog.addEventListener('click', (e) => {
    if (e.target === infoDialog) {
        simulation.mouseClickable = true;
        infoDialog.classList.add('hidden');
    }
});

function loadScript(filename){
    simulation.toggleSimulation(false);
    const oldScript = document.getElementById('dynamicScript');
    if (oldScript) {
        oldScript.remove();
    }

    const script = document.createElement('script');
    script.src = `custom_simulations/${filename}`;
    script.id = 'dynamicScript';
    script.onload = () => {
        simulation.simData = new SimulationData();
        simulation.reset();
        console.log("Loaded : "+simulation.simData.title);
    };

    document.body.appendChild(script);

}



// Basic Functions for p5.js

function setup() {
    const canvas = createCanvas(windowWidth - 340, windowHeight);
    canvas.parent(canvasParent);
    simulation.setup();
    noLoop();
}

function draw() {
    simulation.drawGrid();
    if (simulation.running) {
        simulation.updateGrid();
        frameRate(simulation.speed);
    }else{
        noLoop();
    }
}

function mousePressed() {
    simulation.mousePress();
}

function windowResized() {
    resizeCanvas(windowWidth - 340, windowHeight);
    simulation.preview();
}