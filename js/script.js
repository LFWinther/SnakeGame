const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")
const score = document.querySelector(".score--value")
const finalScore = document.querySelector(".final-score > span")
const menu = document.querySelector(".menu-screen")
const buttonChange = document.querySelector(".dark-mode")
const buttonPlay = document.querySelector(".btn-play")
const iconChange = document.querySelector(".material-symbols-outlined")
const body = document.querySelector("body")

const audio = new Audio('../assets/assets_audio.mp3')
const size = 30
const initialPosition = { x: 270, y: 240 }
const color1 = "#c1c1c1"
const color2 = "#d8b8b8"

let snake = [initialPosition]
let direction, loopId
let colorGrid = "#191919"
let speed = 300

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

    if (!direction) return

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

    if(wallCollision || selfCollision){
        gameOver()
    }
}

const gameOver = () => {
    direction = undefined 

    menu.style.display = "flex"
    finalScore.innerText = score.innerText
    canvas.style.filter = "blur(4px)"
}

const difficult = () => {
    if(score.innerText >= 50){
        speed = 250
    }
    if(score.innerText >= 100){
        speed = 200
    }
    if(score.innerText >= 150){
        speed = 100
    }
    if(score.innerText >= 250){
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
        
        while(snake.find((position) => position.x == x && position.y == y)){
            x = randomPosition()
            y = randomPosition()
        }

        food.x = x
        food.y = y
        food.color = randomColor()
    }
}

gameLoop()

document.addEventListener("keydown", ({ key }) => {

    if (key == 'ArrowRight' && direction != 'left') {
        direction = 'right'
    }
    if (key == 'ArrowLeft' && direction != 'right') {
        direction = 'left'
    }
    if (key == 'ArrowDown' && direction != 'up') {
        direction = 'down'
    }
    if (key == 'ArrowUp' && direction != 'down') {
        direction = 'up'
    }
    if (key == 'd' && direction != 'left') {
        direction = 'right'
    }
    if (key == 'a' && direction != 'right') {
        direction = 'left'
    }
    if (key == 's' && direction != 'up') {
        direction = 'down'
    }
    if (key == 'w' && direction != 'down') {
        direction = 'up'
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
})

buttonChange.addEventListener("click", () => {
    let status = iconChange.innerText
    if(status == "nightlight"){
        iconChange.innerText = "wb_sunny"

        body.style.backgroundColor = "#191919"
        body.style.color = "#c1c1c1"
        buttonChange.style.color = "#c1c1c1"
        canvas.style.backgroundColor = "#111"
        colorGrid = "#191919"
        
    } else{
        iconChange.innerText = "nightlight"
        status = iconChange.innerText
        
        body.style.backgroundColor = "#c1c1c1"
        body.style.color = "#191919"
        buttonChange.style.color = "#191919"
        canvas.style.backgroundColor = "#8d8b8b"
        colorGrid = "#949494"
    }
})
