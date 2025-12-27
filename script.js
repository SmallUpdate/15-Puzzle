canvas.width =  400;
canvas.height = 400;

document.body.style.backgroundColor = "#121212"
document.body.style.margin = 0
canvas.style.position = "absolute"
canvas.style.left = "50%"
canvas.style.top = "50%"
canvas.style.transform = "translate(-50%, -50%)"

const ctx = canvas.getContext("2d");

ctx.font = "48px Consolas";
ctx.textBaseline = "middle";
ctx.textAlign = "center";

// const ds = [[-1, 0], [1, 0], [0, 1], [0, -1]];
const ds = [[1, 0], [0, 1], [-1, 0], [0, -1]]
let m = [
    [ 1,  2,  3,  4],
    [ 5,  6,  7,  8],
    [ 9, 10, 11, 12],
    [13, 14, 15,  0]
]
let p = [3, 3]

function randomMove() {
    pd = []
        for (let j = 0; j < 4; ++j) {
            const nx = p[0] + ds[j][0]
            const ny = p[1] + ds[j][1]
            if (0<=nx && nx<4 && 0<=ny && ny<4) {
                pd.push(ds[j])
            }
        }
        j = Math.floor(Math.random() * pd.length);
        const d = pd[j];
        const nx = p[0]+d[0];
        const ny = p[1]+d[1];
        m[p[1]][p[0]] = m[ny][nx];
        m[ny][nx] = 0;
        p = [nx, ny];
}

function checkCorrect(x, y, n) {
    return n-1 == x+4*y
}

function drawCell(x, y, n) {
    if (n) {
        const s = 94;
        const g =  8;
        const b = checkCorrect(x, y, n)
        ctx.fillStyle = b ? "#BC13FE" : "#242424";
        ctx.fillRect(x*(s+g), y*(s+g), s, s);
        ctx.fillStyle = b ?  "#FFFFFF": "#8A8A8A"
        ctx.fillText(n, x*(s+g)+s/2, y*(s+g)+s/2)
    }
}

function clear() {
    ctx.fillStyle = "#121212"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}

function drawField() {
    clear()
    for (let i = 0; i < 4; ++i) {
        for (let j = 0; j < 4; ++j) {
            drawCell(j, i, m[i][j]);
        }
    }
}

drawField();

function keydown(e) {
    // console.log(e)
    c = e.keyCode;
    //   D   S   A   W 
    i = [68, 83, 65, 87].indexOf(c)
    // i = [65, 87, 68, 83].indexOf(c)
    if (i >= 0) {
        const d = ds[i]
        const nx = p[0] + d[0]
        const ny = p[1] + d[1]
        if (0<=nx && nx<4 && 0<=ny && ny<4) {
            m[p[1]][p[0]] = m[ny][nx]
            m[ny][nx] = 0
            p = [nx, ny]
            drawField()
        }
    }
}

let moves = 0
const FPS = 60

function resolve() {
    randomMove()
    drawField()
    moves += 1
    if (moves < 100) {
        setTimeout(resolve, 1000/FPS)
    } else {
        window.addEventListener('keydown', keydown);
    }
}
resolve()
