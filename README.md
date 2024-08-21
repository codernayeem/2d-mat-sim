# 2d-mat-sim
A web based 2d Matrix Simulator.

### ➤ Try the simulation **[here]( https://codernayeem.github.io/2d-mat-sim/)**

## Library used
- `Tailwind CSS` - For **good** looking web
- `p5.js` - For rendering the **Matrix**


## Usage
- Clone the repo `git clone https://github.com/codernayeem/2d-mat-sim.git`
- Open the `index.html` file in a web browser.
- Setup as your need & enjoy.

## Current Setup & Behaviour
- There are 8 type of cells. Each cell have name, symbol, color.
    - `0` > empty
    - `1` > stone
    - `2` > worm
    - `3` - `8` > city (1 - 6)
- 3 Behaviour at each frame.
    - **Move**: Move each `worm` to a random diagonal position.
    - **Spread**: Each `empty` cell will be filled with a random neighbhor's (up-down-right-left) `city`.
    - **Destroy**: Each `worm` will destroy it's 8 neighbhor cells by turning them to `empty`.

## Modification
- Change cell types & rendering in `js/cellObjects.js`.
- Change behaviours in `updateGrid()` function in `js/simulation.js`.

## Credit
- @codernayeem