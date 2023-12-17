const tela = document.querySelector("canvas#tela")
const ctx = tela.getContext("2d")

let telaLargura = 300
let telaAltura = 300

let estadoDeJogo = "menu"
let velocidadeDeJogo = 1

// sons
let pulo = new Audio()
pulo.src = "sons/pulo.wav"

// chão
let chão = {
    lista: [],
    quantidade: 1,
    x: 0,
    animações: false,
    
    insere: function () {
        for (let i = 0; i < this.quantidade; i++) {
            this.lista.push({
                largura: 224,
                altura: 112,
                x: this.x,
                y: telaAltura - 112,
                velocidade: 0
            })
            this.x += 224
        }
    },

    renderiza: function () {
        this.insere()

        let img = new Image()
        img.src = "imagens/chao.png"

        for (let i = 0; i < this.lista.length; i++) {
            ctx.drawImage(img, this.lista[i].x, this.lista[i].y)

            // animações do chão
            if (this.animações) {
                this.lista[i].x -= velocidadeDeJogo

                if (this.lista[i].x + this.lista[i].largura <= 0) {
                    this.lista.splice(0, 1)
                    i--
                }
            }
        }
    }
}

// pássaro
let pássaro = {
    largura: 34,
    altura: 24,
    x: 0,
    y: 0,
    srcX: 0,
    srcY: 0,
    quadros: 0,
    animações: false,
    físicas: false,
    gravidade: 0.3,
    velocidade: 0,
    força_do_pulo: 8,

    renderiza: function () {
        let img = new Image()
        img.src = "imagens/passaros.png"

        ctx.drawImage(img, this.srcX, this.srcY, this.largura, this.altura, this.x, this.y, this.largura, this.altura)

        // animações do pássaro
        if (this.animações) {
            this.quadros += velocidadeDeJogo

            if (this.quadros <= 10) {
                this.srcY = 0
            }

            else if (this.quadros > 10 && this.quadros <= 20) {
                this.srcY = this.altura
            }

            else if (this.quadros > 20 && this.quadros <= 30) {
                this.srcY = this.altura*2
            }

            else {
                this.quadros = 0
            }
        }

        // físicas
        if (this.físicas) {
            this.velocidade += this.gravidade
            this.y += this.velocidade
        }

        // limita o pássaro na tela
        if (this.y + this.altura >= telaAltura) {
            this.y = telaAltura - this.altura
            this.velocidade = 0
        }

        else if (this.y <= 0) {
            this.y = 0
            this.velocidade = 0
        }
    },

    pula: function () {
        this.velocidade = 0
        this.velocidade -= this.força_do_pulo
        pulo.play()
    }
}

function redimensiona () {
    telaLargura = window.innerWidth -1
    telaAltura = window.innerHeight -4

    tela.width = telaLargura
    tela.height = telaAltura

    chão.quantidade = parseInt(telaLargura/224)

    pássaro.x = parseInt(0.1 * telaLargura)
    pássaro.y = parseInt((telaAltura - pássaro.altura)/2)
}

function renderiza () {
    // limpa a tela
    ctx.clearRect(0, 0, telaLargura, telaAltura)

    // colore a tela
    ctx.fillStyle = "#50beff"
    ctx.fillRect(0, 0, telaLargura, telaAltura)

    // renderiza independente do estado de jogo
    chão.renderiza()
    pássaro.renderiza()

    if (estadoDeJogo == "menu") {
        chão.animações = true

        pássaro.animações = true
        pássaro.físicas = false

        let quadro = new Image()
        quadro.src = "imagens/se-prepare.png"

        ctx.drawImage(quadro, parseInt((telaLargura - quadro.width)/2), parseInt((telaAltura - quadro.height)/2))
    }

    else if (estadoDeJogo == "jogando") {
        pássaro.animações = true
        pássaro.físicas = true
    }

    else {
        pássaro.animações = false
        pássaro.físicas = false

        let quadro = new Image()
        quadro.src = "imagens/fim-de-jogo.png"

        ctx.drawImage(quadro, parseInt((telaLargura - quadro.width)/2), parseInt((telaAltura - quadro.height)/2))
    }
}

function toque () {
    if (estadoDeJogo == "menu") {
        estadoDeJogo = "jogando"
    }

    else if (estadoDeJogo == "jogando") {
        pássaro.pula()
    }

    else {

    }
}

function roda () {
    renderiza()
    requestAnimationFrame(roda)
}

function principal () {
    // pré
    redimensiona()
    tela.width = telaLargura
    tela.height = telaAltura
    tela.addEventListener("click", toque)

    roda()
}

principal()