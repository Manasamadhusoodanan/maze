const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');
const cellSize = 30; // Cell size for a larger maze

// Maze settings
const rows = canvas.height / cellSize;
const cols = canvas.width / cellSize;
let grid = [];
let playerX = 0;
let playerY = 0; // Initial player position

// Cell constructor
function Cell(x, y) {
    this.x = x;
    this.y = y;
    this.walls = { top: true, right: true, bottom: true, left: true };
    this.visited = false;

    // Draw the cell with walls
    this.draw = function() {
        const x = this.x * cellSize;
        const y = this.y * cellSize;

        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;

        if (this.walls.top) ctx.strokeRect(x, y, cellSize, 0);
        if (this.walls.right) ctx.strokeRect(x + cellSize, y, 0, cellSize);
        if (this.walls.bottom) ctx.strokeRect(x, y + cellSize, cellSize, 0);
        if (this.walls.left) ctx.strokeRect(x, y, 0, cellSize);
    };
}

// Initialize the grid with Cell objects
function setup() {
    grid = [];
    for (let row = 0; row < rows; row++) {
        let rowCells = [];
        for (let col = 0; col < cols; col++) {
            rowCells.push(new Cell(col, row));
        }
        grid.push(rowCells);
    }
    // Create dead ends manually
    createDeadEnds();
}

// Create dead ends in the maze
function createDeadEnds() {
    // Example dead ends at (1, 2) and (3, 4)
    grid[1][2].walls.bottom = false; // Dead end 1
    grid[2][2].walls.top = false;    // Dead end 1
    grid[3][4].walls.bottom = false; // Dead end 2
    grid[4][4].walls.top = false;    // Dead end 2
}

// Utility function to get neighboring cells
function getNeighbors(cell) {
    const { x, y } = cell;
    let neighbors = [];

    if (y > 0 && !grid[y - 1][x].visited) neighbors.push({ cell: grid[y - 1][x], direction: 'top' });
    if (x < cols - 1 && !grid[y][x + 1].visited) neighbors.push({ cell: grid[y][x + 1], direction: 'right' });
    if (y < rows - 1 && !grid[y + 1][x].visited) neighbors.push({ cell: grid[y + 1][x], direction: 'bottom' });
    if (x > 0 && !grid[y][x - 1].visited) neighbors.push({ cell: grid[y][x - 1], direction: 'left' });

    return neighbors;
}

// Remove walls between two cells
function removeWalls(current, next, direction) {
    if (direction === 'top') {
        current.walls.top = false;
        next.walls.bottom = false;
    } else if (direction === 'right') {
        current.walls.right = false;
        next.walls.left = false;
    } else if (direction === 'bottom') {
        current.walls.bottom = false;
        next.walls.top = false;
    } else if (direction === 'left') {
        current.walls.left = false;
        next.walls.right = false;
    }
}

// Depth-First Search (DFS) to create a perfect maze
function generateMaze() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let current = grid[0][0];
    current.visited = true;
    let stack = [current]; // Reset the stack on maze generation

    while (stack.length > 0) {
        current.draw();
        let neighbors = getNeighbors(current);

        if (neighbors.length > 0) {
            let { cell: next, direction } = neighbors[Math.floor(Math.random() * neighbors.length)];
            removeWalls(current, next, direction);

            next.visited = true;
            stack.push(next);
            current = next;
        } else {
            current = stack.pop();
        }
    }

    // Draw the completed maze
    for (let row of grid) {
        for (let cell of row) {
            cell.draw();
        }
    }

    // Draw the player at the initial position
    drawPlayer();
}

// Draw the player
function drawPlayer() {
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(playerX * cellSize + cellSize / 2, playerY * cellSize + cellSize / 2, cellSize / 4, 0, Math.PI * 2);
    ctx.fill();
}

// Start the game
function resetGame() {
    playerX = 0;
    playerY = 0;
    drawPlayer();
}

// Move player based on keyboard input
function movePlayer(direction) {
    let nextX = playerX;
    let nextY = playerY;

    if (direction === 'ArrowUp' && !grid[playerY][playerX].walls.top) nextY--;
    if (direction === 'ArrowRight' && !grid[playerY][playerX].walls.right) nextX++;
    if (direction === 'ArrowDown' && !grid[playerY][playerX].walls.bottom) nextY++;
    if (direction === 'ArrowLeft' && !grid[playerY][playerX].walls.left) nextX--;

    // Ensure the player stays within boundaries of the maze
    if (nextX >= 0 && nextX < cols && nextY >= 0 && nextY < rows) {
        playerX = nextX;
        playerY = nextY;
        drawMazeWithPlayer();

        // Check if player reaches the center of the maze (assuming center is at (cols/2, rows/2))
        if (playerX === Math.floor(cols / 2) && playerY === Math.floor(rows / 2)) {
            alert("You have won!");
        }
    }
}

// Draw maze with player
function drawMazeWithPlayer() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let row of grid) {
        for (let cell of row) {
            cell.draw();
        }
    }
    drawPlayer();
}

// Start the game when the button is clicked
document.getElementById('startButton').addEventListener('click', () => {
    setup();
    generateMaze();
    resetGame();
});

// Listen for keyboard input for player movement
window.addEventListener('keydown', (event) => {
    movePlayer(event.key);
});
