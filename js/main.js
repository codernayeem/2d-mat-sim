
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
const simScriptName = document.getElementById('sim_script_name');
const infoButton = document.getElementById('infoButton');
const infoDialog = document.getElementById('infoDialog');
const infoDialogCloseBt = document.getElementById('infoDialog_closeBt');
const canvasParent = 'canvas-container';

const btScriptLoad = document.getElementById('bt_script_load');
const btScriptReload = document.getElementById('bt_script_reload');

const loadScriptDialog = document.getElementById('loadScriptDialog');
const loadScriptDialog_btClose = document.getElementById('loadScriptDialog_btClose');
const loadScriptList = document.getElementById('loadScriptList');



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

let LOADED_SCRIPT = null;

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

btScriptLoad.addEventListener('click', () => {
    fetch('custom_simulations.json')
        .then(response => response.json())
        .then(names => {
            loadScriptList.innerHTML = ''; // Clear any existing list items

            names.forEach((name) => {
                const listItem = document.createElement('li');
                listItem.classList.add('flex', 'justify-between', 'items-center', 'bg-gray-200', 'p-3', 'rounded-md');

                const nameText = document.createElement('span');
                nameText.textContent = name;

                const setButton = document.createElement('button');
                setButton.textContent = 'Load';
                setButton.classList.add('bg-blue-500', 'text-white', 'px-4', 'py-2', 'rounded-md');

                setButton.addEventListener('click', () => {
                    loadScript(name + '.js');
                    loadScriptDialog.classList.add('hidden');
                    simulation.mouseClickable = true;
                });

                listItem.appendChild(nameText);
                listItem.appendChild(setButton);
                loadScriptList.appendChild(listItem);
            });

            loadScriptDialog.classList.remove('hidden');
            simulation.mouseClickable = false;
        })
        .catch(error => console.error('Error fetching the JSON file:', error));
});

loadScriptDialog_btClose.addEventListener('click', () => {
    loadScriptDialog.classList.add('hidden');
    simulation.mouseClickable = true;
});

btScriptReload.addEventListener('click', () => {
    if(LOADED_SCRIPT)
        loadScript(LOADED_SCRIPT);
});

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
        simScriptName.innerText = simulation.simData.title;
        console.log("Loaded : "+simulation.simData.title);
    };

    document.body.appendChild(script);
    LOADED_SCRIPT = filename;
}


// Start by showing load script dialog.
btScriptLoad.click();


// Basic Functions for p5.js

function setup() {
    const canvas = createCanvas(windowWidth - 340, windowHeight);
    canvas.parent(canvasParent);
    simulation.setup();
    noLoop();
}

function draw() {
    if(simulation.simData == null){
        noLoop();
        return;
    }

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