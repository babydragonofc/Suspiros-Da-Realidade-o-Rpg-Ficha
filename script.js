function pS() {
    console.log("opening prefabSave");
    document.getElementById('arquivoJSON').value = 'ficha_save (1).json';}

// ====================== FICHA ======================

const nameInput = document.getElementById("name");
const dateInput = document.getElementById("date");
const ageInput = document.getElementById("age");
const sexButtons = document.querySelectorAll('.sex-btn');
let selectedSex = null;

const main = document.querySelector("main");
const cF = document.getElementById("cF");
const IB = document.getElementById("IB");
const Rs = document.getElementById("Rs");
const Og = document.getElementById("Og");
const Mg = document.getElementById("Mg");
const tipo = document.getElementById("tipo");
const foco = document.getElementById("foco");
const elementos = document.getElementById("elementos");
const Pr = document.getElementById("Pr");

const RsBox = document.getElementById("Rs-box");

//Documento Ordo
const docOrdoName = document.querySelector("#ordoDoc .name");
const docOrdoBirth = document.querySelector("#ordoDoc .birth")

nameInput.addEventListener("change", async () => {

    await eraseText(docOrdoName, 100);

    await delay(300);

    await writeText(docOrdoName, nameInput.value, 100);

    await delay(500);

    await overshadowText(docOrdoName, 0.2, 200, 100);

});

dateInput.addEventListener("change", async () => {

    await eraseText(docOrdoBirth, 100);

    await delay(300);

    const partes = dateInput.value.split("-"); // ["2026", "06", "28"]

    const ano = partes[0]; // 2026
    const mes = partes[1]; // 06
    const dia = partes[2]; // 28

    await writeText(docOrdoBirth, partes[2]+"/"+partes[1]+"/"+partes[0], 100);

    await delay(500);

    await overshadowText(docOrdoBirth, 0.2, 100, 100);

});
// Função para abrir criador
function abrirCriadorDeFicha() {
    main.style.display = "none";
    cF.style.display = "flex";
    IB.style.display = "flex";
}

// Inputs
const proximoBtn1 = document.querySelector("#p1");
const inputs1 = [nameInput, dateInput, ageInput];
let a1 = false;

sexButtons.forEach(button => {
    button.addEventListener('click', () => {
        sexButtons.forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
        selectedSex = button.dataset.sex;
        if (checkAllInputs1()) allInputsCompleted1();
        else { proximoBtn1.classList.remove('active'); a1 = false; }
    });
});

inputs1.forEach(input => {
    input.addEventListener('input', () => {
        if (checkAllInputs1()) allInputsCompleted1();
        else { proximoBtn1.classList.remove('active'); a1 = false; }
    });
});

function checkAllInputs1() {
    return inputs1.every(input => input.value.trim() !== '') && selectedSex;
}

function allInputsCompleted1() {
    proximoBtn1.classList.add('active');
    a1 = true;
}

proximoBtn1.addEventListener("click", () => {
    if (a1) {
        ficha.nome = nameInput.value;
        ficha.idade = ageInput.value;
        abrirPagina2();
    }
});

function abrirPagina2() {
    IB.style.display = "none";
    Rs.style.display = "flex";
    RsBox.style.display = "grid";

    ficha.sexo = selectedSex;
    ficha.dataNascimento = dateInput.value;
}

// ====================== RAÇAS ======================

const raças = [
    {nome: "Humano",pts: 65, per:[{per: "Força", quant: 2}, {per: "Constituição", quant: 1}, {per: "Aparência", quant: 2}]},
    {nome: "Zumano",pts: 65, per:[{per: "Inteligência", quant: 2}, {per: "Aparência", quant: 1}], hab: {name: "Adaptatividade", desc: "Quando estiver em seu habiat nativo, tem vantagem em ações de ataque, movimentação e percepção, alemde que em momento de paz, recupera 1d3 de medo a cada hora de forma pasiva."}},
    {nome: "Vampiro",pts: 70, per:[{per: "Constituição", quant: 2}, {per: "Destreza", quant: 1}, {per: "Ocultismo", quant: 1}], hab: {name:"Abrir Voo", desc: "Pode abrir voo em qualquer momento, um voo so dura por 2 minutos e so pode se mover seu movimento em metros, dura 1d3 turnos em combates, ganha uma desvantagem em ataques e reações"}},
    {nome: "Demonio",pts: 75, per:[{per: "Força", quant: 3}, {per: "Intimidar", quant: 1}, {per: "Aparência", quant: -5}], hab: {name: "Sangue impuro", desc: "Se corta em algum ponto do corpo, levando 10 de dano, seu sangue queima em chamas durante 1d3 turnos, pode ser ussado uma vez a cada 3 horas"}}
]

const RsContainer = document.getElementById('Rs-box');
const raceCards = document.querySelectorAll('.race-card');

raceCards.forEach(card => {
    card.querySelector('.rsBtn').addEventListener('click', (event) => {
        event.stopPropagation();
        if (card.classList.contains('active')) {
            card.classList.remove('active');
            RsContainer.classList.remove('race-selected');
            return;
        }
        raceCards.forEach(otherCard => otherCard.classList.remove('active'));
        card.classList.add('active');
        RsContainer.classList.add('race-selected');
        
    });
});

document.addEventListener('click', (event) => {
    const activeRaceCard = document.querySelector('.race-card.active');
    if (activeRaceCard && !event.target.closest('.race-card.active')) {
        activeRaceCard.classList.remove('active');
        RsContainer.classList.remove('race-selected');
    }

    const activeOriginCard = document.querySelector('.origin-card.active');
    if (activeOriginCard && !event.target.closest('.origin-card.active')) {
        activeOriginCard.classList.remove('active');
        OgContainer.classList.remove('origin-selected');
    }
});

function raceChose(rs) {
    if (RsContainer.classList.contains('race-selected')) {
        Rs.style.display = "none";
        Og.style.display = "flex";
    }

    ficha.ConhecimentoMagico = 6

    ficha.pontos = raças[rs].pts

    console.log('Possivel Erro?')
    //Verificar existencia de rs talvez resolva
    ficha.raça = rs

    (ficha.pontos)
    raças[rs].per.forEach(e => {
        ficha.pericias[e.per].value = e.quant
        ficha.pericias[e.per].min = e.quant
        ficha.pericias[e.per].max = 20
        
    });
}

// ====================== ORIGENS ======================

const OgContainer = document.getElementById('origens');

const origens = [
    {
        id: 1,
        nome: "Médico",
        descricao: "Você era um profissional da saúde como um enfermeiro, farmacêutico, médico, psicólogo ou socorrista, treinado no atendimento e cuidado de pessoas.",
        bonus: "",
        pericias: ["medicina", "ciencias"],
        habilidades: ["ConhecimentoAnatômico", "UsoDeRemédios"]
    },
    {
        id: 2,
        nome: "Técnico de Informática",
        descricao: "Programador, engenheiro de software ou simplesmente 'o cara da T.I.', você tem treinamento e experiência para lidar com sistemas informatizados.",
        bonus: "",
        pericias: ["tecnologia", "inteligencia"],
        habilidades: ["ProficiênciaEmHardware", "ProficiênciaEmSoftware"]
    },
    {
        id: 3,
        nome: "Mecânico",
        descricao: "Enquanto os acadêmicos estão preocupados com teorias, você coloca a mão na massa, seja como engenheiro profissional, seja como inventor de garagem.",
        bonus: "",
        pericias: ["mecanica", "inteligencia", "atualidades"],
        habilidades: ["Reconstruir"]
    },
    {
        id: 4,
        nome: "Negociador",
        descricao: "Você trabalhou em alguma posição de grande importância, a qual precisava negociar coisas importantes.",
        bonus: "",
        pericias: ["labia", "psicologia"],
        habilidades: ["Enganar", "Blefe"]
    },
    {
        id: 5,
        nome: "Combatente",
        descricao: "Você sempre gostou de estar na frente das brigas e aprendeu a ser mais forte com elas.",
        bonus: "",
        pericias: ["armas_brancas", "constituição", "força"],
        habilidades: ["SacrificioProtetor", "TecnicaDeCombate"]
    },
    {
        id: 6,
        nome: "Atirador",
        descricao: "Você frequentava clubes de tiro e sabe manusear armas longas como parte do seu corpo.",
        bonus: "",
        pericias: ["rifle", "longo_alcance", "pistolas"],
        habilidades: ["TiroCerto", "AbrirFogo"]
    },
    {
        id: 7,
        nome: "Policial",
        descricao: "Você fez parte de uma força de segurança pública, civil ou militar.",
        bonus: "",
        pericias: ["pistolas", "vontade", "sobrevivencia"],
        habilidades: ["Imobilizar", "Proteger"]
    },
    {
        id: 8,
        nome: "Cientista",
        descricao: "Você estudou por anos sobre a vida e o funcionamento do mundo.",
        bonus: "",
        pericias: ["ciencias", "magia"],
        habilidades: ["Equipamentos de Laboratório", "Métodos Experimentais"]
    },
    {
        id: 9,
        nome: "Alquimista",
        descricao: "Você conheceu de perto a verdade sobre a magia e começou a estudar sobre a alquimia.",
        bonus: "",
        pericias: ["ciencias", "magia"],
        habilidades: ["Reagentes Místicos", "ControleDeSubstânciasQuímicas"]
    },
    {
        id: 10,
        nome: "Acadêmico",
        descricao: "Você era um pesquisador ou professor universitário.",
        bonus: "",
        pericias: ["historia", "inteligencia"],
        habilidades: ["LeituraCrítica", "ConhecimentoEspecializado"]
    },
    {
        id: 11,
        nome: "Artista",
        descricao: "Você era um ator, músico, escritor, dançarino ou influenciador.",
        bonus: "",
        pericias: ["profissão", "atualidades"],
        habilidades: ["ArteVisual", "MúsicaOuPerformance"]
    },
    {
        id: 12,
        nome: "Atleta",
        descricao: "Você competia em um esporte individual ou por equipe, como natação ou futebol.",
        bonus: "",
        pericias: ["acrobacia", "destreza"],
        habilidades: ["MovimentosLeves", "ReconhecimentoRápidoDeTerreno"]
    },
    {
        id: 13,
        nome: "Ocultista",
        descricao: "Você de algum modo entrou em um grupo ocultista, porém hoje busca entender como pará-los de alguma forma usando suas habilidades ocultas.",
        bonus: "",
        pericias: ["ocultismo", "magia"],
        habilidades: ["Ocultismo", "LeituraDeSímbolosAntigos"]
    },
    {
        id: 14,
        nome: "Jornalista",
        descricao: "Você é um jornalista, tendo já escrito e participado de diversas matérias que te levaram a conhecer e vivenciar muitas das situações mais estranhas e inusitadas que alguém jamais imaginaria viver.",
        bonus: "",
        pericias: ["labia", "psicologia"],
        habilidades: ["Entrevistas", "RedeDeContatos"]
    },
    {
        id: 15,
        nome: "Mochileiro",
        descricao: "Você viajou por todo o mundo, tendo tido inúmeras vivências incríveis.",
        bonus: "",
        pericias: ["sobrevivencia", "constituição", "inteligencia"],
        habilidades: ["PreparoDeAbrigo", "Manual"]
    },
    {
        id: 16,
        nome: "Especialista em Explosivos",
        descricao: "Você viveu em meio a turbulências e fez do fogo e do caos seu refúgio.",
        bonus: "",
        pericias: ["pontaria", "destreza"],
        habilidades: ["Preparo"]
    },
    {
        id: 17,
        nome: "Investigador",
        descricao: "Você realiza pesquisas e investigações para apurar crimes ou outros fatos.",
        bonus: "",
        pericias: ["percepção", "inteligencia"],
        habilidades: []
    }
];

function renderOrigens() {
    OgContainer.innerHTML = "";
    origens.forEach(o => {
        const card = document.createElement("div");
        card.className = "origin-card";

        let bonus = ""
        let Habilidades = ""

        o.pericias.forEach(pericia => {

            if (bonus != "") bonus += " , "

            const displayName = pericia.replace(/([a-z])([A-Z])/g, '$1 $2');
            bonus += `<short class="Pericia" data-key="${pericia}">${displayName}</short>`

        });

        o.habilidades.forEach(habilidade => {

            if (Habilidades != "") Habilidades += " , "
            const displayName = habilidade.replace(/([a-z])([A-Z])/g, '$1 $2');
            Habilidades += `<short class="Habilidades" data-key="${habilidade}">${displayName}</short>`

        });


        card.innerHTML = `
            <div class="corner-images">
                <img src="img/corner2.svg" class="corner-image top-left" alt="">
                <img src="img/corner2.svg" class="corner-image top-right" alt="">
                <img src="img/corner2.svg" class="corner-image bottom-left" alt="">
                <img src="img/corner2.svg" class="corner-image bottom-right" alt="">
            </div>
            <h2 class="title">${o.nome}</h2>
            <div class="origin-details">
                <p class="text">${o.descricao}</p>
                <hr>
                <p class="text sm">Pericias: ${bonus} ; Habilidade: ${Habilidades}</p>
                <button class="btn">Escolher</button>
            </div>
        `;

        const button = card.querySelector('.btn');
        button.addEventListener('click', (event) => {
            event.stopPropagation();
            selectOrigin(button, o.id);
        });

        card.addEventListener('click', () => {
            const currentlyActive = document.querySelector('.origin-card.originSelected');
            if (currentlyActive && currentlyActive !== card) {
                currentlyActive.classList.remove('originSelected');
            }
            card.classList.toggle('originSelected');
        });

        OgContainer.appendChild(card);
    });
    initTooltips(OgContainer);
}

renderOrigens();

function selectOrigin(button, id) {
    const card = button.closest('.origin-card');
    const index = ficha.origem.indexOf(id - 1);

    if (index > -1) {
        // Deselect origin
        ficha.origem.splice(index, 1);
        card.classList.remove('selected');
        card.classList.remove('originSelected');
        button.innerHTML = "Escolher";
    } else if (ficha.origem.length < 2) {
        // Select origin
        ficha.origem.push(id - 1);
        card.classList.add('selected');
        card.classList.add('originSelected');
        button.innerHTML = "Desmarcar";
    }

    // Show/hide next button
    const nextButton = document.getElementById('origin-next-btn');
    if (ficha.origem.length === 2) {
        nextButton.style.display = 'block';
    } else {
        nextButton.style.display = 'none';
    }
}

function originNext() {
    if (ficha.origem.length === 2) {
        Og.style.display = "none";
        Pr.style.display = "flex";

        ficha.origem.forEach(o => {
            origens[o].pericias.forEach(pericia => {
                ficha.bonus.push(pericia)
                const bonusPerEl = document.querySelector('[aria-value="'+pericia+'"]');
                bonusPerEl.style.color = "yellow"
                bonusPerEl.style.boxShadow = '0 0 10px inset #ffff0042;'
            });
            origens[o].habilidades.forEach(habilidade => {
                const habilidadeData = tooltipDictionary.Habilidades[habilidade];
                const nome = habilidade.replace(/([a-z])([A-Z])/g, '$1 $2');
                if (habilidadeData) {
                    createAbility(nome, habilidadeData.descricao, null);
                }
            });
        });
    }
}

// ====================== TIPOS ======================

const typeInfo = document.getElementsByClassName("type-info")[0];
const typeName = document.getElementById("typeName");
const typeDescription = document.getElementById("typeDescription");
const typeBonus = document.getElementById("typeBonus");
const typeConfirm = document.getElementById("typeConfirm");

const types = [
    {nome:"Alma",descricao:"O conhecimento está em suas mãos.",info:"A alma representa sua capacidade de se conectar com o ser interior, +2 <short class='Pericia Aprendizado'>Aprendizado</short>, +2 <short class='MagiaFicha ConhecimentoMagico'>Pontos de Conhecimento</short>"},
    {nome:"Energia",descricao:"A fonte da energia e habilidade.",info:"A energia é o nucleo da magia, necessario para conjurar e executar, representa a concentração e melhoria de suas capacidades de uso da magia, +3 <short class='Status PontosDeMagia'>Pontos de Magia</short>, +2 <short class='Pericia Magia'>Magia</short>"},
    {nome:"Corpo",descricao:"A matéria física em seu pleno alcance",info:"O controle sob seu corpo e o ambiente a sua volta, o corpo representa a realidade material e fisica, +5 <short class='Status Vida'>Vida</short>, +2 <short class='Pericia Constituição'>Constituição</short>"}
];

var TS = null;

function typeChose(id) {
    TS = id
    const t = types[id];
    typeInfo.style.display = "block";
    typeName.innerHTML = t.nome;
    typeDescription.innerHTML = t.descricao;
    typeBonus.innerHTML = t.info;
    typeConfirm.style.display = "block"
    // Inicializa tooltips nos "short" do typeBonus
    initTooltips(typeBonus);
}

function typeConfirmF() {

    if (TS == null) return
    tipo.style.display = "none";
    foco.style.display = "flex";
    ficha.tipo = TS;

    if (ficha.origem.includes(9) || ficha.origem.includes(13)) {
        ficha.ConhecimentoMagico += 1
    }
    
    if (ficha.tipo == 0) {
        ficha.ConhecimentoMagico += 2
        ficha.pericias.Aprendizado.value += 5
        ficha.pericias.Aprendizado.min += 5
    }
    if (ficha.tipo == 1) {
        ficha.status.energiaMax += 3
        ficha.pericias.Magia.value += 2
        ficha.pericias.Magia.min += 2
    }
    if (ficha.tipo == 2) {
        ficha.status.vida += 5
        ficha.pericias.Constituição.value += 2
        ficha.pericias.Constituição.min += 2
    }

    document.getElementById("pts").innerHTML = ficha.ConhecimentoMagico
}

// ====================== FOCOS ======================  
const focoInfo = document.getElementsByClassName("foco-info")[0];
const focoName = document.getElementById("focoName");
const focoDescription = document.getElementById("focoDescription");
const focoEx = document.getElementById("focoEx");

const focoCloseBtn = document.getElementsByClassName("focoClose")[0];

const typeElements = document.getElementsByClassName("typeElements")[0];

const Soporte = document.getElementById("Suporte");
const Controle = document.getElementById("Controle");
const Elemental = document.getElementById("Elemental");
const Dinamico = document.getElementById("Dinamico");

var focos = [
    {name: "Suporte", descricao: "Magias que melhoram status de seus aliados e/ou prejudica os inimigos.", info: "Ex: Cura, Força, Veneno, etc.", value: 0},
    {name: "Controle", descricao: "Magias que controlam o ambiente ao redor<br>", info: "Ex: Espinhos em área, acorrentar, visão, atribuir etc.", value: 0},
    {name: "Elemental", descricao: "Magias que utilizam <short class='MagiaFicha Elementos'>Elementos</short> da natureza.", info: "Ex: Fogo, Gelo, Água, Escuridão etc.", value: 0},
    {name: "Dinâmicos", descricao: "Magias gerais", info: "Ex: Levitação, Leitura, etc.", value: 1},
]
var focoS = null;

function focoChose(id){
    focoInfo.style.display = "block";
    focoName.innerHTML = focos[id].name;
    focoDescription.innerHTML = focos[id].descricao;
    initTooltips(focoDescription);
    focoEx.innerHTML = focos[id].info;
    document.getElementsByClassName("foco-btns")[0].style.display = "block"
    document.getElementById("fH").style.display = "block"
    focoS = id;

    if(id == 2) typeElements.style.display = "flex"
    else typeElements.style.display = "none"
}

function putMagicPt(){
    if (ficha.ConhecimentoMagico > 0) {
        focos[focoS].value ++
        ficha.ConhecimentoMagico --
    }
    focosAtu()

    if (focoS == 2) {
        updateElementSelectability();
    }

    if (ficha.ConhecimentoMagico == 0 ) {
        focoCloseBtn.style.opacity = "1"
        focoCloseBtn.style.pointerEvents = "auto"
    }
    
}

function removeMagicPt(){

    if (focoS == 3 && focos[focoS].value == 1) return;

    if (focos[focoS].value > 0) {
        focos[focoS].value --
        ficha.ConhecimentoMagico ++
    }
    focosAtu()

    if (focoS == 2) {
        updateElementSelectability();
    }

    if (ficha.ConhecimentoMagico != 0 ) {
        focoCloseBtn.style.opacity = "0"
        focoCloseBtn.style.pointerEvents = "none"
    }
}


function focosAtu() {
    Soporte.innerHTML = focos[0].value
    Controle.innerHTML = focos[1].value
    Elemental.innerHTML = focos[2].value
    Dinamico.innerHTML = focos[3].value

    document.getElementById("pts").innerHTML = ficha.ConhecimentoMagico

}

function focoClose(){

    foco.style.display = "none";
    if (focos[2].value > 0) {
        elementos.style.display = "flex";
        elementPoints.innerHTML = focos[2].value
        updateElementSelectability();
    }else {
        FichaEnd()
    }
    
}

// ====================== ELEMENTOS ======================

const elementosInfo = document.getElementsByClassName("elementos-info")[0];
const elementosName = document.getElementById("element-title");

const cards = document.getElementsByClassName("element-card");
const elementPoints = document.getElementById("element-points");
const elementTooltip = document.getElementById("element-tooltip");
const elementosNextBtn = document.getElementById("elementos-next-btn");


const elementosL = [
    {name: "Fogo"},
    {name: "Água"},
    {name: "Gelo"},
    {name: "Terra"},
    {name: "Eletricidade"},
    {name: "Planta"},
    {name: "Vento"},
    {name: "Escuridão"},
    {name: "Luz"},
    {name: "Hipnose"},
]

function updateElementSelectability() {
    const focoValue = focos[2].value;
    const simplesCards = document.querySelectorAll('.elementos-simples .element-card');
    const avancadosCards = document.querySelectorAll('.elementos-avancados .element-card');

    // Reset all to enabled
    simplesCards.forEach(card => card.classList.remove('disabled'));
    avancadosCards.forEach(card => card.classList.remove('disabled'));

    if (focoValue == 1) {
        avancadosCards.forEach(card => card.classList.add('disabled'));
    } else if (focoValue == 2) {
        simplesCards.forEach(card => card.classList.add('disabled'));
    } else if (focoValue == 4 || focoValue == 5) {
        avancadosCards.forEach(card => card.classList.add('disabled'));
    } else if (focoValue >= 6) {
        simplesCards.forEach(card => card.classList.add('disabled'));
    }
}

for (let i = 0; i < cards.length; i++) {
    cards[i].addEventListener('mouseenter', (e) => {
        if (cards[i].classList.contains('disabled')) {
            elementTooltip.classList.add('disabled');
        } else {
            elementTooltip.classList.remove('disabled');
        }

        elementTooltip.innerHTML = elementosL[i].name;
        elementTooltip.style.display = 'block';
        elementTooltip.style.left = e.pageX + 10 + 'px';
        elementTooltip.style.top = e.pageY + 10 + 'px';
    });

    cards[i].addEventListener('mouseleave', () => {
        elementTooltip.style.display = 'none';
    });

    cards[i].addEventListener('mousemove', (e) => {
        elementTooltip.style.left = e.pageX + 10 + 'px';
        elementTooltip.style.top = e.pageY + 10 + 'px';
    });
}

function checkElementSelection() {
    const focoValue = focos[2].value;
    const selectedSimples = document.querySelectorAll('.elementos-simples .element-card.selected').length;
    const selectedAvancados = document.querySelectorAll('.elementos-avancados .element-card.selected').length;

    let isComplete = false;

    if (focoValue == 1 && selectedSimples === 1) {
        isComplete = true;
    } else if (focoValue == 2 && selectedAvancados === 1) {
        isComplete = true;
    } else if (focoValue == 3 && selectedSimples === 1 && selectedAvancados === 1) {
        isComplete = true;
    } else if ((focoValue == 4 || focoValue == 5) && selectedSimples === 2) {
        isComplete = true;
    } else if (focoValue >= 6 && selectedAvancados === 2) {
        isComplete = true;
    }

    if (isComplete) {
        elementosNextBtn.classList.add('active');
    } else {
        elementosNextBtn.classList.remove('active');
    }
}

const elementosList = [
    {name: "Fogo"},
    {name: "Água"},
    {name: "Gelo"},
    {name: "Terra"},
    {name: "Eletricidade"},
    {name: "Planta"},
    {name: "Vento"},
    {name: "Escuridão"},
    {name: "Luz"},
    {name: "Hipnose"}
]

function elementChose(id) {
    const clickedCard = cards[id];
    if (clickedCard.classList.contains('disabled')) {
        return;
    }

    const isSimples = id <= 6;
    const focoValue = focos[2].value;

    // Handle selection/deselection
    if (clickedCard.classList.contains('selected')) {
        clickedCard.classList.remove('selected');
    } else {
        if (focoValue == 1) {
            if (!isSimples) return;
            const selected = document.querySelector('.element-card.selected');
            if (selected) selected.classList.remove('selected');
        } else if (focoValue == 2) {
            if (isSimples) return;
            const selected = document.querySelector('.element-card.selected');
            if (selected) selected.classList.remove('selected');
        } else if (focoValue == 3) {
            const simplesSelected = document.querySelector('.elementos-simples .element-card.selected');
            const avancadoSelected = document.querySelector('.elementos-avancados .element-card.selected');
            if (isSimples) {
                if (simplesSelected) simplesSelected.classList.remove('selected');
            } else {
                if (avancadoSelected) avancadoSelected.classList.remove('selected');
            }
        } else if (focoValue == 4 || focoValue == 5) {
            if (!isSimples) return;
            const simplesSelected = document.querySelectorAll('.elementos-simples .element-card.selected');
            if (simplesSelected.length >= 2) {
                simplesSelected[0].classList.remove('selected');
            }
        } else if (focoValue >= 6) {
            if (isSimples) return;
            const avancadosSelected = document.querySelectorAll('.elementos-avancados .element-card.selected');
            if (avancadosSelected.length >= 2) {
                avancadosSelected[0].classList.remove('selected');
            }
        }
        clickedCard.classList.add('selected');
    }

    // Update title and ficha.elementos
    const selectedCards = document.querySelectorAll('.element-card.selected');
    let title = "";
    ficha.elementos = []; // Limpa o array antes de adicionar os novos elementos
    selectedCards.forEach((card, index) => {
        const cardId = Array.from(cards).indexOf(card);
        title += elementosL[cardId].name;
        ficha.elementos.push(elementosL[cardId].name);
        if (index < selectedCards.length - 1) {
            title += " & ";
        }
    });

    if (selectedCards.length > 0) {
        elementosInfo.style.display = "flex";
        elementosName.innerHTML = title;
    } else {
        elementosInfo.style.display = "none";
    }

    checkElementSelection();
}


function elementNext() {
    const selectedCards = document.querySelectorAll('.element-card.selected');
    ficha.elementos = []; // Limpa o array antes de adicionar os novos elementos
    selectedCards.forEach(card => {
        const cardId = Array.from(cards).indexOf(card);
        ficha.elementos.push(elementosL[cardId].name);
    });

    if (ficha.elementos.length = 0) return;
    
    FichaEnd()

}

function getValueByIndex(obj, index) {
  const values = Object.values(obj);
  return values[index];
}

const game = document.getElementById("game")

function FichaEnd() {
    statusAtu()
    displayPericias()
    loadScream(3, 3)

    setTimeout(() => {
        prDiv = Pr
        cF.remove()
        game.style.display = "flex";
    }, 3000);
    
}

function irParaJogo() {

    const cF = document.getElementById("cF");
    const game = document.getElementById("game");
    const main = document.querySelector("main");

    main.style.display = "none";
    cF.style.display = "flex";
    game.style.display = "flex";

    
    displayPericias();
}

function renderPersonagem() {
    // Basic Info
    document.getElementById('personagem-nome').textContent = ficha.nome || '';
    document.getElementById('personagem-idade').textContent = ficha.idade || '';
    document.getElementById('personagem-raca').textContent = ficha.raça !== undefined ? raças[ficha.raça].nome : '';
    document.getElementById('personagem-tipo').textContent = ficha.tipo !== undefined ? types[ficha.tipo].nome : '';
    
    let focosText = [];
    for (let i = 0; i < focos.length; i++) {
        if (focos[i].value > 0) {
            focosText.push(focos[i].name + " (" + focos[i].value + ")");
        }
    }
    document.getElementById('personagem-foco').textContent = focosText.join(', ');

    // Biography
    const biografiaFields = ['familia', 'gostos', 'desgostos', 'medos', 'contatosProximos', 'historia', 'comportamento', 'dinheiro'];
    biografiaFields.forEach(field => {
        const element = document.getElementById(`personagem-${field.toLowerCase()}`);
        if (element) {
            element.value = ficha.biografia[field] || '';
            element.addEventListener('input', (e) => {
                ficha.biografia[field] = e.target.value;
            });
        }
    });
}

// ===================== STATUS MÁXIMOS =====================

function renderStatusMaxEditor() {
    const statusEditor = document.getElementById('statusMaxEditor');
    statusEditor.innerHTML = '';

    const statusList = [
        { key: 'vidaMax', label: 'Vida Máx.' },
        { key: 'energiaMax', label: 'Energia Máx.' },
        { key: 'medoMax', label: 'Medo Máx.' }
    ];

    statusList.forEach(({ key, label }) => {
        const linha = document.createElement('div');
        linha.className = 'status-edit';
        
        const lbl = document.createElement('p');
        lbl.textContent = label;
        lbl.classList = "title"
        
        const input = document.createElement('input');
        input.type = 'number';
        input.value = ficha.status[key];
        input.dataset.key = key;

        linha.appendChild(lbl);
        linha.appendChild(input);
        statusEditor.appendChild(linha);
    });
}

function salvarStatusMaxEditados() {
    const inputs = document.querySelectorAll('#statusMaxEditor input');
    inputs.forEach(input => {
        const key = input.dataset.key;
        ficha.status[key] = parseInt(input.value) || 0;
    });
}


const mobileMTBtn = document.getElementById('MobileMTBtn');
const mtMenu = document.getElementById('mt-menu');
const mMTImage = document.getElementsByClassName('mMTImage')[0];

if (mobileMTBtn) {
    mobileMTBtn.addEventListener('click', () => {
        mobileMTBtn.classList.toggle('active');
        if (mobileMTBtn.classList.contains('active')) {
            mtMenu.style.display = 'flex';
            mMTImage.style.rotate = '180deg';
        } else {
            mtMenu.style.display = 'none';
            mMTImage.style.rotate = '0deg';
        }
    });
}

// Close the menu if clicking outside of it on mobile
window.addEventListener('click', function(e) {
    if (window.innerWidth <= 768) {
        const mtMenu = document.getElementById('mt-menu');
        const mobileMTBtn = document.getElementById('MobileMTBtn');
        if (mtMenu && mobileMTBtn && !mobileMTBtn.contains(e.target) && !mtMenu.contains(e.target)) {
            mobileMTBtn.classList.remove('active');
            mtMenu.style.display = 'none';
        }
    }
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        if (mtMenu) {
            mtMenu.removeAttribute('style');
        }
        if (mobileMTBtn) {
            mobileMTBtn.classList.remove('active');
        }

        perPlaces.appendChild(prNextBtn)
        perListsPlacesGen(false)
    } else {
        perListsPlacesGen(false)
        prContent.appendChild(prNextBtn)
    }

    if(window.innerWidth > 400) {
        periciasDisplayer.style.display = "block"
    }

    if(window.innerWidth > 500) {
        periciasDisplayer.style.backgroundImage = ""
    }

    if(window.innerWidth < 500 && ficha.options.translucidPer) {
        periciasDisplayer.style.backgroundImage = document.querySelector("body").style.backgroundImage
    }

});

class PerlinDissolve {

    constructor(element, resolution = 512) {

        this.element = element;
        this.size = resolution;

        this.canvas = document.createElement("canvas");
        this.canvas.width = resolution;
        this.canvas.height = resolution;

        this.ctx = this.canvas.getContext("2d", {
            willReadFrequently: true
        });

        this.currentProgress = 0;

        this.element.style.display = "none";
        this.element.style.pointerEvents = "none";
        this.element.setAttribute("aria-hidden", "true");

        this.noise = this.generateNoise();

        this.setProgress(0, true);
    }

    generateNoise() {

        const values = new Float32Array(
            this.size * this.size
        );

        const octaves = [
            { size: 4, weight: 1.0 },
            { size: 8, weight: 0.5 },
            { size: 16, weight: 0.25 },
            { size: 32, weight: 0.125 }
        ];

        const lerp = (a, b, t) =>
            a + (b - a) * t;

        const smoothstep = t =>
            t * t * (3 - 2 * t);

        for (const octave of octaves) {

            const grid = [];

            for (let y = 0; y <= octave.size; y++) {

                grid[y] = [];

                for (let x = 0; x <= octave.size; x++) {

                    grid[y][x] = Math.random();

                }
            }

            for (let y = 0; y < this.size; y++) {

                for (let x = 0; x < this.size; x++) {

                    const fx =
                        (x / this.size) *
                        octave.size;

                    const fy =
                        (y / this.size) *
                        octave.size;

                    const x0 = Math.floor(fx);
                    const y0 = Math.floor(fy);

                    const x1 = x0 + 1;
                    const y1 = y0 + 1;

                    const tx =
                        smoothstep(fx - x0);

                    const ty =
                        smoothstep(fy - y0);

                    const n00 = grid[y0][x0];
                    const n10 = grid[y0][x1];
                    const n01 = grid[y1][x0];
                    const n11 = grid[y1][x1];

                    const nx0 =
                        lerp(n00, n10, tx);

                    const nx1 =
                        lerp(n01, n11, tx);

                    const value =
                        lerp(nx0, nx1, ty);

                    values[
                        y * this.size + x
                    ] +=
                        value *
                        octave.weight;
                }
            }
        }

        let min = Infinity;
        let max = -Infinity;

        for (const v of values) {

            if (v < min) min = v;
            if (v > max) max = v;

        }

        const range = max - min;

        for (let i = 0; i < values.length; i++) {

            values[i] =
                (values[i] - min) /
                range;

        }

        return values;
    }

    setProgress(progress, isHide = false) {

        progress = Math.max(
            0,
            Math.min(1, progress)
        );

        this.currentProgress = progress;

        if (progress <= 0.001) {

            this.element.style.pointerEvents =
                "none";

            this.element.setAttribute(
                "aria-hidden",
                "true"
            );

        } else {

            this.element.style.pointerEvents =
                "auto";

            this.element.setAttribute(
                "aria-hidden",
                "false"
            );

        }

        if (progress >= 0.999 && !isHide) {

            this.element.style.transition = "opacity 0.2s"
            this.element.style.opacity = 1

            setTimeout(() => {
                this.element.style.maskImage = "none";
                this.element.style.webkitMaskImage = "none";
            }, 200);

            return;
        }

        const imageData =
            this.ctx.createImageData(
                this.size,
                this.size
            );

        const edge = 0.18;

        for (
            let i = 0;
            i < this.noise.length;
            i++
        ) {

            const noise =
                this.noise[i];


            let alpha =
                (progress - noise + edge) /
                (edge * 2);

            alpha = Math.max(0, Math.min(1, alpha));

            // Smoothstep
            alpha = alpha * alpha * (3 - 2 * alpha);
            const p = i * 4;

            imageData.data[p] = 255;
            imageData.data[p + 1] = 255;
            imageData.data[p + 2] = 255;
            imageData.data[p + 3] =
                Math.floor(alpha * 255);
        }

        this.ctx.putImageData(
            imageData,
            0,
            0
        );

        const url =
            this.canvas.toDataURL(
                "image/png"
            );

        this.element.style.maskImage =
            `url(${url})`;

        this.element.style.webkitMaskImage =
            `url(${url})`;

        this.element.style.maskSize =
            "100% 100%";

        this.element.style.webkitMaskSize =
            "100% 100%";

        this.element.style.maskRepeat =
            "no-repeat";

        this.element.style.webkitMaskRepeat =
            "no-repeat";
    }

    animateTo(
        target,
        duration = 1500,
        isHide = false
    ) {

        target = Math.max(
            0,
            Math.min(1, target)
        );

        const start =
            this.currentProgress;

        const startTime =
            performance.now();

        const easeOutCubic = t =>
            1 - Math.pow(
                1 - t,
                3
            );

        const animate = now => {

            const t = Math.min(
                (now - startTime) /
                duration,
                1
            );

            const eased =
                easeOutCubic(t);

            const value =
                start +
                (target - start) *
                eased;

            this.setProgress(
                value,
                isHide
            );

            if (t < 1) {

                requestAnimationFrame(
                    animate
                );

            } else {

                if (target === 0) {

                    this.element.style.display =
                        "none";

                    this.element.style.pointerEvents =
                        "none";

                    this.element.setAttribute(
                        "aria-hidden",
                        "true"
                    );
                }
            }
        };

        requestAnimationFrame(
            animate
        );
    }

    show(duration = 1500) {

        this.element.style.display = "";

        this.element.style.pointerEvents =
            "auto";

        this.element.setAttribute(
            "aria-hidden",
            "false"
        );

        this.animateTo(
            1,
            duration,
            false
        );
    }

    hide(duration = 1500) {

        this.animateTo(
            0,
            duration,
            true
        );
    }
}

const loadScreamDissolve = new PerlinDissolve( document.querySelector("#loadingScream"), 1024);

function loadScream(seconds, animationTime=2) {
    
    loadScreamDissolve.show(animationTime*1000)

    setTimeout(() => {
        loadScreamDissolve.hide(animationTime*1000)
    }, seconds * 1000 + animationTime * 1000)
    
} 

//Ofuscamento 

const GLITCH_CHARS =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&!?<>[]{}+-=*/\\|";

const GLITCH_FONTS = [
    "monospace",
    "serif",
    "sans-serif",
    "cursive",
    "fantasy"
];

function eraseText(element, speed = 40, glitchLength = 6) {

    const original = element.textContent;
    let remaining = original.length;

    const escapeHTML = str =>
        str.replaceAll("&", "&amp;")
           .replaceAll("<", "&lt;")
           .replaceAll(">", "&gt;");

    return new Promise(resolve => {

        const interval = setInterval(() => {

            if (remaining <= 0) {
                clearInterval(interval);
                element.textContent = "";
                resolve();
                return;
            }

            remaining--;

            const safe = original.slice(0, remaining);

            let html = escapeHTML(safe);

            const end = Math.min(glitchLength, original.length - remaining);

            for (let i = 0; i < end; i++) {

                const char =
                    GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];

                const font =
                    GLITCH_FONTS[Math.floor(Math.random() * GLITCH_FONTS.length)];

                html += `<span style="font-family:${font};">${char}</span>`;
            }

            element.innerHTML = html;

        }, speed);

    });

}

function writeText(element, text, speed = 40, glitchLength = 6) {

    let written = 0;

    const escapeHTML = str =>
        str.replaceAll("&", "&amp;")
           .replaceAll("<", "&lt;")
           .replaceAll(">", "&gt;");

    return new Promise(resolve => {

        const interval = setInterval(() => {

            if (written > text.length) {
                clearInterval(interval);
                element.textContent = text;
                resolve();
                return;
            }

            let html = escapeHTML(text.slice(0, written));

            const remaining = text.length - written;
            const glitchCount = Math.min(glitchLength, remaining);

            for (let i = 0; i < glitchCount; i++) {

                const char =
                    GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];

                const font =
                    GLITCH_FONTS[Math.floor(Math.random() * GLITCH_FONTS.length)];

                html += `<span style="font-family:${font};">${char}</span>`;
            }

            element.innerHTML = html;

            written++;

        }, speed);

    });

}



function overshadowText(
    element,
    intensity = 0.3,
    duration = 1000,
    speed = 40
) {

    return new Promise(resolve => {

        const original = element.textContent;

        const escapeHTML = str =>
            str.replaceAll("&", "&amp;")
               .replaceAll("<", "&lt;")
               .replaceAll(">", "&gt;");

        clearInterval(element._overshadowInterval);

        element._overshadowInterval = setInterval(() => {

            let html = "";

            for (const char of original) {

                // Mantém espaços
                if (char === " ") {
                    html += " ";
                    continue;
                }

                if (Math.random() < intensity) {

                    const randomChar =
                        GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];

                    const randomFont =
                        GLITCH_FONTS[Math.floor(Math.random() * GLITCH_FONTS.length)];

                    html += `
                        <span style="
                            font-family:${randomFont};
                            display:inline-block;
                        ">
                            ${randomChar}
                        </span>
                    `;

                } else {

                    html += escapeHTML(char);

                }

            }

            element.innerHTML = html;

        }, speed);

        setTimeout(() => {

            clearInterval(element._overshadowInterval);
            element.textContent = original;
            resolve();

        }, duration);

    });

}

function startOvershadow(element, amount = 6, speed = 40) {

    stopGlitch(element);

    element._glitchInterval = setInterval(() => {
        glitchText(element, amount);
    }, speed);
}

function stopOvershadow(element) {

    clearInterval(element._glitchInterval);

    if (element.dataset.originalText) {
        element.textContent = element.dataset.originalText;
    }
}