const sprites = new Image()
sprites.src = './sprites.png'

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const background = {
    sX: 390,
    sY:0,
    width: 275,
    height: 204,
    x: 0,
    y: canvas.height - 204,
    draw() {
        ctx.fillStyle = '#70c5ce'
        ctx.fillRect(0,0, canvas.width, canvas.height)

        ctx.drawImage(
            sprites,
            background.sX, background.sY,
            background.width, background.height,
            background.x, background.y,
            background.width, background.height,
        )

        ctx.drawImage(
            sprites,
            background.sX, background.sY,
            background.width, background.height,
            (background.x + background.width), background.y,
            background.width, background.height,
        )
    }
}

const floor = {
    sX: 0,
    sY: 610,
    width: 224,
    height: 112,
    x: 0,
    y: canvas.height - 112,
    draw() {
        ctx.drawImage(
            sprites,
            floor.sX, floor.sY,
            floor.width, floor.height,
            floor.x, floor.y,
            floor.width, floor.height,
        )

        ctx.drawImage(
            sprites,
            floor.sX, floor.sY,
            floor.width, floor.height,
            (floor.x + floor.width), floor.y,
            floor.width, floor.height,
        )
    }
}

const bird = {
    sX: 0,
    sY: 0,
    width: 33,
    height: 24,
    x: 10,
    y: 50,
    gravity: 0.25,
    velocity: 0,

    refresh() {
        bird.velocity = bird.velocity + bird.gravity
        bird.y = bird.y + bird.velocity
    },
    draw() {
        ctx.drawImage(
            sprites,
            bird.sX, bird.sY,
            bird.width, bird.height,
            bird.x, bird.y,
            bird.width, bird.height,
        )    
    }
}

function loop() {
    bird.refresh()

    background.draw()
    floor.draw()
    bird.draw()
    
    

    requestAnimationFrame(loop)

}

loop()