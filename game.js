let frames = 0
const hitSound = new Audio()
hitSound.src = './effects/hit.wav'

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

function createFloor() {
    const floor = {
        sX: 0,
        sY: 610,
        width: 224,
        height: 112,
        x: 0,
        y: canvas.height - 112,
        refresh() {
            const floorMovement = 1
            const repeat = floor.width / 2

            movement = floor.x - floorMovement

            floor.x = movement % repeat
        },
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
    return floor
}


function collision(bird,floor) {
    const birdY = bird.y + bird.height
    const floorY = floor.y

    if(birdY >= floorY){
        return true
    } 

    return false
}

function createBird() {
    const bird = {
        sX: 0,
        sY: 0,
        width: 33,
        height: 24,
        x: 10,
        y: 50,
        jumpSize: 4.6,
        jump() {
            bird.velocity = - bird.jumpSize
        },
        gravity: 0.25,
        velocity: 0,
    
        refresh() {
            if(collision(bird, global.floor)){
                console.log('Fez colisão')
                hitSound.play()

                setTimeout(() => {
                    changeScreen(screens.start)
                }, 500)

                return 
            }
            bird.velocity = bird.velocity + bird.gravity
            bird.y = bird.y + bird.velocity
        },
        movements: [
            {sX: 0, sY: 0, },
            {sX: 0, sY: 26, },
            {sX: 0, sY: 52, },

        ],
        currentFrame: 0,
        refreshCurrentFrame() {
            const frameInterval = 10
            const exceededInterval = frames % frameInterval === 1

            if(exceededInterval) {
                const incrementBase = 1;
                const increment = incrementBase + bird.currentFrame
                const repetitionBase = bird.movements.length
                bird.currentFrame = increment % repetitionBase
            }
        },
        draw() {
            bird.refreshCurrentFrame()
            const { sX, sY } = bird.movements[bird.currentFrame]
            ctx.drawImage(
                sprites,
                sX, sY,
                bird.width, bird.height,
                bird.x, bird.y,
                bird.width, bird.height,
            )    
        }
    }
    return bird
}

function createPipes() {
    const pipes = {
        width: 52,
        height: 400,
        floor: {
            sX: 0,
            sY: 169
        },
        sky: {
            sX: 52,
            sY: 169,
        },
        space: 80,
        draw() {
            pipes.pairs.forEach(pair => {
                const yRandom = pair.y
                const pipeSpacing = 90

                const pipeSkyX = pair.x
                const pipeSkyY = yRandom

                ctx.drawImage(
                    sprites,
                    pipes.sky.sX, pipes.sky.sY,
                    pipes.width, pipes.height,
                    pipeSkyX, pipeSkyY,
                    pipes.width, pipes.height,
                )
    
                const pipeFloorX = pair.x
                const pipeFloorY = pipes.height + pipeSpacing + yRandom
                ctx.drawImage(
                    sprites,
                    pipes.floor.sX, pipes.floor.sY,
                    pipes.width, pipes.height,
                    pipeFloorX, pipeFloorY,
                    pipes.width, pipes.height,
                )

                pair.pipeSky = {
                    x: pipeFloorX,
                    y: pipes.height + pipeSkyY
                }
                pair.pipeFloor = {
                    x: pipeFloorX,
                    y: pipeFloorY,
                }
            })
        },

        collisionWithBird(pair) {
            const headBird = global.bird.y
            const footBird = global.bird.y + global.bird.height

            if(global.bird.x >= pair.x) {
                console.log('canos')
                
                if(headBird <= pair.pipeSky.y) {
                    return true
                }

                if(footBird >= pair.pipeFloor.y) {
                    return true
                }
            }

            return false
        },

        pairs: [],
        refresh() {
            const exceeded100Frames = frames % 100 === 0
            if(exceeded100Frames) {
                pipes.pairs.push({
                        x: canvas.width,
                        y: -150 * (Math.random() + 1),
                    })
            }

            pipes.pairs.forEach(pair => {
                pair.x = pair.x -2

                if(pipes.collisionWithBird(pair)) {
                    changeScreen(screens.start)
                }

                if(pair.x + pipes.width <= 0) {
                    pipes.pairs.shift()
                }
            })

        }
    }

    return pipes
}

const msgGetReady = {
    sX: 134,
    sY: 0,
    width: 174,
    height: 152,
    x: (canvas.width / 2) - 174 / 2,
    y: 50,
    draw() {
        ctx.drawImage(
            sprites,
            msgGetReady.sX, msgGetReady.sY,
            msgGetReady.width, msgGetReady.height,
            msgGetReady.x, msgGetReady.y,
            msgGetReady.width, msgGetReady.height,
        )
    }
}

const global = {}
let activeScreen = {}
function changeScreen(newScreen) {
    activeScreen = newScreen

    if(activeScreen.initialize){
         activeScreen.initialize()
    }
}

const screens = {

    start: {
        initialize() {
            global.bird = createBird()
            global.floor = createFloor()
            global.pipes = createPipes()
        },
        draw() {
            background.draw()
            global.bird.draw()
            global.floor.draw()
            msgGetReady.draw()
        },
        click(){
            changeScreen(screens.game)
        },
        refresh() {
            global.floor.refresh()
        }
    }
}

screens.game = {
    draw() {
        background.draw()
        global.pipes.draw()
        global.floor.draw()
        global.bird.draw()
        
    },
    click() {
        global.bird.jump()
    },
    refresh() {
        global.pipes.refresh()
        global.floor.refresh()
        global.bird.refresh()
    },
}

function loop() {

    activeScreen.draw()
    activeScreen.refresh()

    frames++
    requestAnimationFrame(loop)

}

window.addEventListener('click', function(){
    if(activeScreen.click){
        activeScreen.click()
    }
})

changeScreen(screens.start)
loop()