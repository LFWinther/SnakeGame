const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

const score = document.querySelector(".score--value")
const finalScore = document.querySelector(".final-score > span")
const bestScore = document.querySelector(".best-score-value")
const bestScore2 = document.querySelector(".best-score-value2")

const menu = document.querySelector(".menu-screen")
const pause = document.querySelector(".pause-screen")
const start = document.querySelector(".start-screen")

const buttonChange = document.querySelector(".dark-mode")
const buttonPause = document.querySelector(".btn-pause")
const buttonContinue = document.querySelector(".btn-continue")
const buttonPlay = document.querySelector(".btn-play")
const buttonStart = document.querySelector(".btn-start")

const iconSpan = document.querySelector(".btn-pause > span");
const iconChange = document.querySelector(".material-symbols-outlined")

const body = document.querySelector("body")
const title = document.querySelector(".title")
const audio = new Audio('../assets/assets_audio.mp3')

const size = 30
const initialPosition = { x: 270, y: 480 }
const color1 = "#c1c1c1"
const color2 = "#d8b8b8"

let snake = [initialPosition]
let direction = "up"
let loopId, lastDirection
let colorGrid = "#191919"
let speed = 300
let isPaused = true;

const updateBestScore = (score) => {
    const currentBestScore = localStorage.getItem("bestScore")

    if (currentBestScore === null || score > parseInt(currentBestScore)) {
        localStorage.setItem("bestScore", score)
        bestScore.innerText = score
        bestScore2.innerText = score
    }
}

const incrementScore = () => {
    score.innerText = +score.innerText + 10
}

const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min)
}

const randomPosition = () => {
    const number = randomNumber(0, canvas.width - size)
    return Math.round(number / 30) * 30
}

const randomColor = () => {
    const red = randomNumber(0, 255)
    const green = randomNumber(0, 255)
    const blue = randomNumber(0, 255)

    return `rgb(${red}, ${green}, ${blue})`
}

const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: randomColor()
}

const drawFood = () => {
    const { x, y, color } = food

    ctx.shadowColor = color
    ctx.shadowBlur = 6
    ctx.fillStyle = color
    ctx.fillRect(x, y, size, size)
    ctx.shadowBlur = 0
}

const drawSnake = () => {
    ctx.fillStyle = "#fff"
    snake.forEach((position, i) => {

        if (i == snake.length - 1) {
            ctx.fillStyle = "#c1c1c1"
        }

        ctx.fillRect(position.x, position.y, size, size)
    })
}

const moveSnake = () => {

    if (!direction || isPaused) return

    const head = snake[snake.length - 1]

    if (direction == "right") {
        snake.push({ x: head.x + size, y: head.y })
    }
    if (direction == "left") {
        snake.push({ x: head.x - size, y: head.y })
    }
    if (direction == "down") {
        snake.push({ x: head.x, y: head.y + size })
    }
    if (direction == "up") {
        snake.push({ x: head.x, y: head.y - size })
    }
    snake.shift()

}

const drawGrid = () => {
    ctx.lineWidth = 1
    ctx.strokeStyle = colorGrid //#949494

    for (let i = 30; i < canvas.width; i += size) {
        ctx.beginPath()
        ctx.lineTo(i, 0)
        ctx.lineTo(i, 600)
        ctx.stroke()

        ctx.beginPath()
        ctx.lineTo(0, i)
        ctx.lineTo(600, i)
        ctx.stroke()
    }
}

const checkCollision = () => {
    const head = snake[snake.length - 1]
    const canvasLimit = canvas.width - size
    const neckIndex = snake.length - 2

    const wallCollision = head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit

    const selfCollision = snake.find((position, index) => {
        return index < neckIndex && position.x == head.x && position.y == head.y
    })

    if (wallCollision || selfCollision) {
        gameOver()
    }
}

const gameOver = () => {
    direction = undefined
    lastDirection = undefined
    updateBestScore(parseInt(score.innerText))
    menu.style.display = "flex"
    finalScore.innerText = score.innerText
    canvas.style.filter = "blur(4px)"
    isPaused = true
}

const difficult = () => {
    if (score.innerText < 50) {
        speed = 300
    }
    if (score.innerText >= 50) {
        speed = 250
    }
    if (score.innerText >= 100) {
        speed = 225
    }
    if (score.innerText >= 150) {
        speed = 200
    }
    if (score.innerText >= 250) {
        speed = 175
    }
    if (score.innerText >= 300) {
        speed = 150
    }
    if (score.innerText >= 450) {
        speed = 100
    }
    if (score.innerText >= 500) {
        speed = 50
    }
}

const gameLoop = () => {

    clearInterval(loopId)

    ctx.clearRect(0, 0, 600, 600)
    drawGrid()
    drawFood()
    moveSnake()
    drawSnake()
    checkEat()
    difficult()
    checkCollision()

    loopId = setTimeout(() => {
        gameLoop()
    }, speed)
}

const checkEat = () => {
    const head = snake[snake.length - 1]

    if (head.x == food.x && head.y == food.y) {
        incrementScore()
        snake.push(head)
        audio.play()

        let x = randomPosition()
        let y = randomPosition()

        while (snake.find((position) => position.x == x && position.y == y)) {
            x = randomPosition()
            y = randomPosition()
        }

        food.x = x
        food.y = y
        food.color = randomColor()
    }
}

document.addEventListener("keydown", ({ key }) => {
    if ((key == 'ArrowRight' || (key == "d" || key == 'D')) && direction != 'left') {
        direction = 'right'
    }
    if ((key == 'ArrowLeft' || (key == 'a' || key == 'A')) && direction != 'right') {
        direction = 'left'
    }
    if ((key == 'ArrowDown' || (key == 's' || key == 'S')) && direction != 'up') {
        direction = 'down'
    }
    if ((key == 'ArrowUp' || (key == 'w' || key == 'W')) && direction != 'down') {
        direction = 'up'
    }

    if (pause.style.display == "flex" && key == "p") {
        direction = lastDirection;
        pause.style.display = "none";
        iconSpan.innerText = "pause_circle";
    }

    if (key == 'p' || key == 'P') {
        if (isPaused) {
            direction = lastDirection;
            isPaused = false;
            pause.style.display = "none";
        } else {
            lastDirection = direction;
            direction = undefined;
            isPaused = true;
            pause.style.display = "flex";
            iconSpan.innerText = "play_circle";
        }
    }
})

buttonPlay.addEventListener("click", () => {
    score.innerText = "00"
    menu.style.display = "none"
    canvas.style.filter = "none"

    snake = [initialPosition]
    food.x = randomPosition()
    food.y = randomPosition()
    food.color = randomColor()
    isPaused = false
    direction = "up"
})

buttonContinue.addEventListener("click", () => {
    direction = lastDirection
    pause.style.display = "none"
    isPaused = false
})

buttonChange.addEventListener("click", () => {
    let status = iconChange.innerText
    if (status == "nightlight") {
        iconChange.innerText = "wb_sunny"

        body.style.backgroundColor = "#191919"
        body.style.color = "#c1c1c1"
        buttonChange.style.color = "#c1c1c1"
        canvas.style.backgroundColor = "#111"
        colorGrid = "#191919"
        buttonPause.style.color = "#c1c1c1"
        pause.style.backgroundColor = "#111"
        start.style.backgroundColor = "#111"
        menu.style.backgroundColor = "#111"
        pause.style.border = "#c1c1c1 2px solid"
        start.style.border = "#c1c1c1 2px solid"
        menu.style.border = "#c1c1c1 2px solid"
        buttonContinue.style.backgroundColor = "#c1c1c1"
        buttonPlay.style.backgroundColor = "#c1c1c1"
        buttonStart.style.backgroundColor = "#c1c1c1"
        buttonContinue.style.color = "#191919"
        buttonPlay.style.color = "#191919"
        buttonStart.style.color = "#191919"

    } else {
        iconChange.innerText = "nightlight"
        status = iconChange.innerText

        body.style.backgroundColor = "#c1c1c1"
        body.style.color = "#191919"
        buttonChange.style.color = "#191919"
        canvas.style.backgroundColor = "#8d8b8b"
        colorGrid = "#949494"
        buttonPause.style.color = "#111"
        pause.style.backgroundColor = "#c1c1c1"
        start.style.backgroundColor = "#c1c1c1"
        menu.style.backgroundColor = "#c1c1c1"
        pause.style.border = "#191919 2px solid"
        start.style.border = "#191919 2px solid"
        menu.style.border = "#191919 2px solid"
        buttonContinue.style.backgroundColor = "#191919"
        buttonPlay.style.backgroundColor = "#191919"
        buttonStart.style.backgroundColor = "#191919"
        buttonContinue.style.color = "#c1c1c1"
        buttonPlay.style.color = "#c1c1c1"
        buttonStart.style.color = "#c1c1c1"
    }
})

buttonPause.addEventListener("click", () => {
    if (isPaused) {
        direction = lastDirection;
        isPaused = false;
        pause.style.display = "none";
        iconSpan.innerText = "pause_circle";
    } else {
        lastDirection = direction;
        direction = undefined;
        isPaused = true;
        pause.style.display = "flex";
        iconSpan.innerText = "play_circle";
    }
});

buttonStart.addEventListener("click", () => {
    start.style.display = "none"
    isPaused = false
})

window.addEventListener("load", () => {
    const currentBestScore = localStorage.getItem("bestScore");

    if (currentBestScore !== null) {
        bestScore.innerText = currentBestScore;
        bestScore2.innerText = currentBestScore;
    }
});
gameLoop()