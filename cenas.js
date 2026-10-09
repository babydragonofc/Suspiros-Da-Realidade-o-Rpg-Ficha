const cenaConfigSucessos = document.getElementById('cenaConfigSucessos')
const cenaConfigFalhas = document.getElementById('cenaConfigFalhas')
const fugaDiv = document.getElementById('fuga-div')
const fugaSucessosDiv = document.getElementById('fuga-sucessos-div')
const fugaFalhasDiv = document.getElementById('fuga-falhas-div')

var sucessosListBtn = []
var falhasListBtn = []

function openCenaConfig() {
    panelOpen("CenaConfig")
    cenaConfigSucessos.value = ''
    cenaConfigFalhas.value = ''
}

function iniciarFuga() {
    if (cenaConfigSucessos.value == '' || cenaConfigFalhas.value == '' || cenaConfigSucessos.value <= 1 || cenaConfigFalhas.value <= 1) return;

    panelClose()
    fugaDiv.style.display = "flex"
    
    // SUCESSOS
    sucessosListBtn = []
    fugaSucessosDiv.innerHTML = ''

    const quantidadeSucessos = Number(cenaConfigSucessos.value)

    for (let i = 0; i < quantidadeSucessos; i++) {
        const btn = document.createElement('button')

        btn.classList.add(
            "contador",
            i === 0
                ? "contadorInicio"
                : i === quantidadeSucessos - 1
                    ? "contadorFim"
                    : "contadorMeio"
        )

        sucessosListBtn.push(btn)

        btn.addEventListener('click', function() {
            if (btn.classList.contains('sucesso')) {
                for (let j = i; j < sucessosListBtn.length; j++) {
                    sucessosListBtn[j].classList.remove('sucesso')
                }
            } else {
                for (let j = 0; j <= i; j++) {
                    sucessosListBtn[j].classList.add('sucesso')
                }
            }
        })

        fugaSucessosDiv.appendChild(btn)
    }


    // FALHAS
    falhasListBtn = []
    fugaFalhasDiv.innerHTML = ''

    const quantidadeFalhas = Number(cenaConfigFalhas.value)

    for (let i = 0; i < quantidadeFalhas; i++) {
        const btn = document.createElement('button')

        btn.classList.add(
            "contador",
            i === 0
                ? "contadorInicio"
                : i === quantidadeFalhas - 1
                    ? "contadorFim"
                    : "contadorMeio"
        )

        falhasListBtn.push(btn)

        btn.addEventListener('click', function() {
            if (btn.classList.contains('falha')) {
                for (let j = i; j < falhasListBtn.length; j++) {
                    falhasListBtn[j].classList.remove('falha')
                }
            } else {
                for (let j = 0; j <= i; j++) {
                    falhasListBtn[j].classList.add('falha')
                }
            }
        })

        fugaFalhasDiv.appendChild(btn)
    }
}