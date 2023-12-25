const tela = document.querySelector("canvas#tela")
const ctx = tela.getContext("2d")

let telaLargura = 300
let telaAltura = 300

let telaMaior = 0

let estadoDeJogo = "menu"
let velocidadeDeJogo = 1
let tempoDeTransição = 30

// sons
let pulo = new Audio()
pulo.src = "sons/pulo.wav"
let pancada = new Audio()
pancada.src = "sons/pancada.wav"

// cenário
let cenário = {
    largura: 276,
    altura: 204,
    quantidade: 20,
    lista: [],
    x: 0,
    y: 0,

    insere: function () {
        this.lista.push({
            largura: this.largura,
            altura: this.altura,
            x: this.x,
            y: this.y
        })
        this.x += this.largura
    },

    redimensiona: function () {
        for (let i = 0; i < this.lista.length; i ++) {
            let lista = this.lista[i]

            lista.y = telaAltura-112-204
        }
    },

    renderiza: function () {
        this.redimensiona()

        for (let i = 0; i < this.quantidade; i ++) {
            this.insere()
            this.quantidade--
        }

        let img = new Image()
        img.src = "imagens/cenario.png"

        for (let i = 0; i < this.lista.length; i ++) {
            let lista = this.lista[i]

            // renderiza só se estiver na tela
            if (lista.x + lista.largura >= 0 && lista.x <= telaLargura) {
                ctx.drawImage(img, lista.x, lista.y)
            }
        }
    }
}

// chão
let chão = {
    quantidade: 20,
    x: 0,
    lista: [],
    animações: false,

    redimensiona: function () {
        for (let i = 0; i < this.lista.length; i++) {
            this.lista[i].y = telaAltura-112
        }
    },

    insere: function () {
        this.lista.push({
            x: this.x,
            y: telaAltura-112,
            largura: 224,
            altura: 112
        })

        this.x += 224
    },

    renderiza: function () {
        for (let i = 0; i < this.quantidade; i++) {
            this.insere()
            this.quantidade--
        }

        let img = new Image()
        img.src = "imagens/chao.png"

        // renderiza as imagens
        for (let i = 0; i < this.lista.length; i++) {
            let lista = this.lista[i]
            
            // renderiza só se estiver na tela
            if (lista.x <= telaLargura && lista.x + lista.largura >= 0) {
                ctx.drawImage(img, parseInt(lista.x), lista.y)
            }
        }

        // animações
        if (this.animações) {
            for (let i in this.lista) {
                let lista = this.lista[i]

                lista.x -= velocidadeDeJogo

                if (lista.x + lista.largura <= 0) {
                    lista.x = telaLargura
                }
            }
        }
    }
}

// canos
let canos = {
    largura: 52,
    altura: 400,
    lista: [],
    animações: false,
    tempo: 0,
    espaço: 200,
    x: screen.width,
    y: telaAltura,
    srcX: 0,
    srcY: 0,

    redimensiona: function () {
        for (let i in this.lista) {
            let lista = this.lista[i]

            this.x = telaLargura
            lista.y = telaAltura -112 -lista.altura
        }
    },

    reseta: function () {
        this.tempo = 200
        this.lista.splice(0, this.lista.length)
    },

    insere: function () {
        this.lista.push({
            largura: this.largura,
            altura: 100 + Math.floor(300 * Math.random()),
            x: this.x,
            y: this.y
        })
    },

    renderiza: function () {
        if (this.tempo == 0) {
            this.tempo = 100 + Math.floor(200 * Math.random())
            this.x = screen.width
            this.insere()
        }

        // animações
        if (this.animações) {
            this.tempo -= velocidadeDeJogo

            // redimensiona
            if (this.lista.length > 0) {
                this.redimensiona()
            }

            for (let i in this.lista) {
                let lista = this.lista[i]

                lista.x -= velocidadeDeJogo

                // quando sai da tela
                if (lista.x + lista.largura <= 0) {
                    this.lista.splice(i, 1)
                }
            }
        }

        // renderiza os objetos
        for (let i in this.lista) {
            let lista = this.lista[i]

            let img = new Image()
            img.src = "imagens/canos.png"

            // parte de cima dos canos
            ctx.drawImage(img, this.srcX+this.largura, this.srcY,this.largura, 400, lista.x, lista.y-this.espaço-400, lista.largura, 400)

            // parte de baixo dos canos
            ctx.drawImage(img, this.srcX, this.srcY, lista.largura, lista.altura, lista.x, lista.y, lista.largura, lista.altura)
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
    rotação: 0,
    tempoDeRotação: 10,

    redimensiona: function () {
        this.x = parseInt(0.1 * telaLargura)  
    },

    reseta: function () {
        this.y = parseInt((telaAltura - pássaro.altura)/2)
        this.rotação = 0
        this.tempoDeRotação = 20
    },

    renderiza: function () {
        let img = new Image()
        img.src = "imagens/passaros.png"

        // tempo que dura a rotação
        if (this.rotação != 0) {
            this.tempoDeRotação--
            this.largura = 31
            this.altura = 28
        }

        // quando acabar o tempo de rotação ele volta ao normal
        if (this.tempoDeRotação == 0) {
            this.rotação = 0
            this.largura = 34
            this.altura = 24
        }

        // cálculos que geram a imagem do pássaro e sua rotação
        ctx.save()

        ctx.translate(this.x + this.largura / 2,this.y + this.altura / 2)
        ctx.rotate(this.rotação) 

        ctx.drawImage(img, this.srcX, this.srcY, 34, 24, -this.largura/2, -this.altura/2, 34, 24)
        
        ctx.restore()

        // animações do pássaro
        if (this.animações) {
            this.quadros += velocidadeDeJogo

            if (this.quadros <= 10) {
                this.srcY = 0
            }

            else if (this.quadros > 10 && this.quadros <= 20) {
                this.srcY = 24
            }

            else if (this.quadros > 20 && this.quadros <= 30) {
                this.srcY = 24*2
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

        // pássaro cai no chão
        if (this.y + this.altura >= chão.lista[0].y) {
            this.y = chão.lista[0].y - this.altura
            this.velocidade = 0
            if (estadoDeJogo == "jogando") {
                pancada.play()
            }
            estadoDeJogo = "perdeu"
        }
    },

    pula: function () {
        this.rotação = -45 * Math.PI / 180
        this.tempoDeRotação = 20

        this.velocidade = 0
        this.velocidade -= this.força_do_pulo
        pulo.play()
    }
}

function redimensiona () {
    telaLargura = parseInt(window.innerWidth-1)
    telaAltura = parseInt(window.innerHeight-4)

    tela.width = telaLargura
    tela.height = telaAltura

    chão.redimensiona()
    pássaro.redimensiona()
}

function renderiza () {
    // limpa a tela
    ctx.clearRect(0, 0, telaLargura, telaAltura)

    // colore a tela
    ctx.fillStyle = "#50beff"
    ctx.fillRect(0, 0, telaLargura, telaAltura)

    // renderiza independente do estado de jogo
    cenário.renderiza()
    chão.renderiza()
    canos.renderiza()
    pássaro.renderiza()

    if (estadoDeJogo == "menu") {
        chão.animações = true
        canos.animações = true
        pássaro.animações = true
        pássaro.físicas = false

        let quadro = new Image()
        quadro.src = "imagens/se-prepare.png"

        ctx.drawImage(quadro, parseInt((telaLargura - quadro.width)/2), parseInt((telaAltura - quadro.height)/2))
    }

    else if (estadoDeJogo == "jogando") {
        chão.animações = true
        canos.animações = true
        pássaro.animações = true
        pássaro.físicas = true
    }

    else {
        pássaro.rotação = 0
        if (tempoDeTransição > 0) {
            tempoDeTransição--
        }

        chão.animações = false
        canos.animações = false
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
        if (tempoDeTransição == 0) {
            pássaro.reseta()
            canos.reseta()
            tempoDeTransição = 30
            estadoDeJogo = "menu"
        }
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
    pássaro.reseta()

    roda()
}

principal()