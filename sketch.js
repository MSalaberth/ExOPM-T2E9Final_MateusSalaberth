////// AGUA
let spacing = 11
let previous = []
let current = []
let sw
let sh

///// COUNTERS
let counter = 0
let counterDisp = 0
let dispersar = false
let vaguear = false
let ultimoCounter = 0

////// CRIATURAS
let criaturaVisivel = false
let criaturaArray = []
let numCriaturaArray = 10
let distorcer = false

////// TARGETS
let targetMouse = true
let tX = []
let tY = []

////// IMAGENS
let img
let img2

let contadorDisp = 0;


////// PRELOAD IMAGENS
function preload() {
    img = loadImage("sapato.png")
    img2 = loadImage("criatura.png")
}


function setup() {
    //////// SETUP AGUA
    noCursor()
    createCanvas(windowWidth, windowHeight)
    pixelDensity(1)

    sw = Math.floor(windowWidth / spacing)
    sh = Math.floor(windowHeight / spacing)

    for (i = 0; i < sw; i++) {
        for (j = 0; j < sh; j++) {
            previous.push(0)
        }
    }

    current = previous.slice()
    noStroke()


    ///////// SETUP CRIATURA
    for (i = 0; i < numCriaturaArray; i++) {
        criaturaArray[i] = new Criatura(img2, random(0.05, 0.2), 0, 0, random(0, width), random(0, height), random(20, 45))
        console.log(criaturaArray[i].targetX)

    }
}

///// DRAW
function draw() {
    //// BG
    background(30, 40, 120)


    /////// AGUA
    let index = 0

    if (mouseIsPressed) {
        index = (Math.floor(mouseX / spacing) + sw * Math.floor(mouseY / spacing))
        previous[index] += 200
    }

    if (distorcer = false) {

    }
    for (let i = 1; i < sw - 1; i++) {
        for (let j = 1; j < sh - 1; j++) {
            index = (i + sw * j)
            current[index] = ((
                previous[index - 1 + sw] +
                previous[index - 1 - sw] +
                previous[index + 1 + sw] +
                previous[index + 1 - sw] +
                previous[index - 1] +
                previous[index + 1] +
                previous[index - sw] +
                previous[index + sw]
            ) >> 2) - current[index]

            current[index] *= 0.800
            fill(30, 40 - current[index], 100 - current[index] + random(10, 20))
            rect(i * spacing, j * spacing, spacing, spacing)
        }
    }

    let temp = previous.slice()
    previous = current.slice()
    current = temp.slice()


    //////// CRIATURA COUNTERS
    ///visibilidade
    if (millis() - ultimoCounter > 3000) {
        criaturaVisivel = true
    }

    ///mudança target
    if (criaturaVisivel && targetMouse) {
        for (i = 0; i < criaturaArray.length; i++) {
            criaturaArray[i].criarMoverCriatura(mouseX, mouseY)
        }
    } if (criaturaVisivel && targetMouse == false) {
        for (i = 0; i < criaturaArray.length; i++) {
            criaturaArray[i].criarMoverCriatura(tX[i], tY[i])
        }

    } if (millis() - counterDisp > 4000) {
        for (i = 0; i < criaturaArray.length; i++) {
            criaturaArray[i].criarMoverCriatura(mouseX, mouseY)
        }
    }

    ///dispersar
    if (dispersar == false && vaguear === false) {
        for (i = 0; i < criaturaArray.length; i++) {
            if (criaturaArray[i].avaliar() == true) {
                dispersar = true
                counterDisp = millis()
                break;
            }
        }
    } else if (dispersar) {
        if (millis() - counterDisp > 4000) {
            for (i = 0; i < criaturaArray.length; i++) {
                tX[i] = random(0, width)
                tY[i] = random(0, height)
            }

            targetMouse = false
            counterDisp = millis()
            contadorDisp++;

            if (contadorDisp > 3) {
                dispersar = false
                vaguear = true
                contadorDisp = 0;
            }
        }
    } else if (vaguear) {
        if (millis() - counterDisp > 4000) {
            targetMouse = true
        }
    } else {
        dispersar = true
    }



    ///////// SAPATO
    imageMode(CENTER)
    image(img, mouseX, mouseY, 80, 130)
}


/////// WINDOW RESIZE
function windowResized() {
    resizeCanvas(windowWidth, windowHeight)
}



////////////////// CLASS CRIATURAS
class Criatura {
    constructor(img2, easing, targetX, targetY, yCriatura, xCriatura, diametro) {
        this.img2 = img2
        this.easing = easing
        this.targetX = targetX
        this.targetY = targetY
        this.yCriatura = yCriatura
        this.xCriatura = xCriatura
        this.diametro = diametro
    }

    criarMoverCriatura(targetXadd, targetYadd) {
        this.targetX = targetXadd + random(0, 150)
        this.xCriatura = this.xCriatura + ((this.targetX - this.xCriatura) * this.easing)

        this.targetY = targetYadd + random(0, 150)
        this.yCriatura = this.yCriatura + ((this.targetY - this.yCriatura) * this.easing)


        image(this.img2, this.xCriatura, this.yCriatura, this.diametro, this.diametro)
    }

    avaliar() {
        this.d = dist(this.xCriatura, this.yCriatura, this.targetX, this.targetY)
        if (this.d < this.diametro) {
            return true
        } else {
            return false
        }
    }
}