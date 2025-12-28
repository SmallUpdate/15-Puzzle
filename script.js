const screenwh = Math.min(screen.width, screen.height) * 0.75;
console.log(screenwh) - 40;
canvas.width =  screenwh;
canvas.height = screenwh;

const CLR1 = "#121212";
const CLR2 = "#242424";
const CLR3 = "#8A8A8A";
const CLR4 = "#FFFFFF";
const CLR5 = "#BC13FE";

document.body.style.backgroundColor = CLR1;
document.body.style.margin = 0;
document.body.style.userSelect = "none"
canvas.style.position = "absolute";
canvas.style.left = "50%";
canvas.style.top = "50%";
canvas.style.transform = "translate(-50%, -50%)";

const ctx = canvas.getContext("2d");

ctx.font = "48px Consolas";
ctx.textBaseline = "middle";
ctx.textAlign = "center";

const size = 4;
let matrix = generateMatrix(size);
let player = {x: matrix.length-1, y: matrix[0].length-1};
const directions = [[0,-1], [-1,0], [0,1], [1,0]];
randomizeMatrix(matrix);
drawMatrix(matrix);

function generateMatrix(size) {
    let matrix = [];
    for (let i = 0; i < size; i++) {
        row = [];
        for (let j = 0; j < size; j++) {
            row.push(i == size-1 && j == size-1 ? 0 : i*size + j+1);
        }
        matrix.push(row);
    }
    return matrix;
}

function clear() {
    ctx.fillStyle = CLR1;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawMatrix(matrix) {
    clear()
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[0].length; j++) {
            drawElement(i, j, matrix[i][j], matrix.length);
        }
    }
}

function checkPos(i, j, value) {
    return i*size+j+1 == value
}

function checkMap() {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (i!=size-1 || j!=size-1) {
                if (!checkPos(i, j, matrix[i][j])) {
                    console.log(i, j, matrix[i][j])
                    return false;
                }
            }
        }
    }
    return true;
}

function drawElement(i, j, value, size) {
    if (value) {
        const cellSize = screenwh / size;
        const padding = 4;
        const [x, y] = [cellSize*j, cellSize*i];
        const b = checkPos(i, j, value)
        ctx.fillStyle = b ? CLR5 : CLR2;
        ctx.fillRect(x+padding, y+padding, cellSize-2*padding, cellSize-2*padding);
        ctx.fillStyle = b ? CLR4 : CLR3;
        ctx.fillText(value, x+cellSize/2, y+cellSize/2);
    }
}

let timerId;

function move(x, y) {
    if (!gameEnded) {
        if (!gameStarted) {
            gameStarted = true;
            timerId = setInterval(timer, 100);
            console.log('started')
        }
        matrix[player.y][player.x] = matrix[y][x];
        matrix[y][x] = 0;
        player = {x, y};
        drawMatrix(matrix);
        if (checkMap()) {
            gameEnded = true
            clearInterval(timerId)
        }
    }
}

function click(e) {
    if (e.target == canvas) {
    const x = Math.floor(e.layerX / canvas.width * size);
    const y = Math.floor(e.layerY / canvas.height * size);
        if (Math.abs(player.x-x) + Math.abs(player.y-y) == 1) {
            move(x, y);
        }
    }
}

function keydown(e) {
    const i = [87, 65, 83, 68].indexOf(e.keyCode);
    if (i >= 0) {
        const [dx, dy] = directions[i];
        const [nx, ny] = [player.x + dx, player.y + dy];
        if (0<=nx && nx<size && 0<=ny && ny<size) {
            move(nx, ny);
        }
    }
}

function randomizeMatrix(matrix) {
    for (let i = 0; i < 1000; i++) {
        let possibleMovements = [];
        for (const [dx, dy] of directions) {
            const [nx, ny] = [player.x + dx, player.y + dy];
            if (0<=nx && nx<size && 0<=ny && ny<size) {
                possibleMovements.push([nx, ny]);
            }
        }
        const [x, y] = possibleMovements[Math.floor(Math.random() * possibleMovements.length)];
        matrix[player.y][player.x] = matrix[y][x];
        matrix[y][x] = 0;
        player = {x, y};
    }
    drawMatrix(matrix);
}

let gameStarted = false
let gameEnded = false
let t = 0

window.addEventListener("click", click);
window.addEventListener("keydown", keydown);

function timer() {
    t += 1
    time.innerText = Math.floor(t/10) + '.' + t%10 + 's'
}
