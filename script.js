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
const criaçãoDeFicha = document.getElementById("criaçãoDeFicha");
const informaçõesBasicas = document.getElementById("informaçõesBasicas");
const escolhaDeRaças = document.getElementById("escolhaDeRaças");
const escolhaDeOcupação = document.getElementById("escolhaDeOcupação");
const escolhaDeOrigem = document.getElementById("escolhaDeOrigem");
const escolhaDePericia = document.getElementById("escolhaDePericia");
const escolhasDeMagia = document.getElementById("escolhasDeMagia");
const escolhaDeTipoMagico = document.getElementById("escolhaDeTipoMagico");
const escolhaDeFocoMagico = document.getElementById("escolhaDeFocoMagico");
const elementos = document.getElementById("elementos");

const RsBox = document.getElementById("race-box");

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
    criaçãoDeFicha.style.display = "flex";
    informaçõesBasicas.style.display = "flex";
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
    informaçõesBasicas.style.display = "none";
    escolhaDeRaças.style.display = "flex";
    RsBox.style.display = "grid";

    ficha.sexo = selectedSex;
    ficha.dataNascimento = dateInput.value;
}

// ====================== RAÇAS ======================

const raças = [
    {nome: "Humano", status: {Pv: 15, Pe: 5, Md: 20 }},
    {nome: "Zumano", status: {Pv: 20, Pe: 15, Md: 10 }},
    {nome: "Vampiro", status: {Pv: 10, Pe: 10, Md: 22 }},
    {nome: "Demonio", status: {Pv: 20, Pe: 15, Md: 20 }}
]

const raceContainer = document.getElementById('race-box');
const raceCards = document.querySelectorAll('.race-card');

raceCards.forEach(card => {
    card.querySelector('.raceBtn').addEventListener('click', (event) => {
        event.stopPropagation();
        if (card.classList.contains('active')) {
            card.classList.remove('active');
            raceContainer.classList.remove('race-selected');
            return;
        }
        raceCards.forEach(otherCard => otherCard.classList.remove('active'));
        card.classList.add('active');
        raceContainer.classList.add('race-selected');
        
    });
});

document.addEventListener('click', (event) => {
    const activeRaceCard = document.querySelector('.race-card.active');
    if (activeRaceCard && !event.target.closest('.race-card.active')) {
        activeRaceCard.classList.remove('active');
        raceContainer.classList.remove('race-selected');
    }

    const activeOcupationCard = document.querySelector('.ocupation-card.active');
    if (activeOcupationCard && !event.target.closest('.ocupation-card.active')) {
        activeOcupationCard.classList.remove('active');
        ocupaçõesContainer.classList.remove('origin-selected');
    }

    const activeOriginCard = document.querySelector('.origin-card.active');
    if (activeOriginCard && !event.target.closest('.origin-card.active')) {
        activeOriginCard.classList.remove('active');
        ocupaçõesContainer.classList.remove('origin-selected');
    }
});

function raceChose(rs) {
    if (raceContainer.classList.contains('race-selected')) {
        escolhaDeRaças.style.display = "none";
        escolhaDeOcupação.style.display = "flex";
    }

    ficha.ConhecimentoMagico = 6
    ficha.raça = raças[rs]

    console.log("incompleto")
}

// ====================== Ocupações ======================

const ocupaçõesContainer = document.getElementById('ocupaçõesContainer');

const ocupações = [

    {
        id: 1,
        nome: "Médico",
        descricao: "Você dedicou sua vida a cuidar de outras pessoas. Seja em hospitais, clínicas ou situações de emergência, aprendeu a compreender o corpo humano, tratar ferimentos e agir quando a vida de alguém está em risco.",
        bonus: "",
        pericias: ["medicina", "ciencia"],
        habilidades: ["ConhecimentoAnatômico", "UsoDeRemédios"]
    },

    {
        id: 2,
        nome: "Técnico de Informática",
        descricao: "Computadores, programas e sistemas são parte da sua rotina. Você possui experiência para lidar com tecnologia, resolver problemas e compreender o funcionamento de equipamentos digitais.",
        bonus: "",
        pericias: ["tecnologia", "atualidades"],
        habilidades: ["ProficiênciaEmHardware", "ProficiênciaEmSoftware"]
    },

    {
        id: 3,
        nome: "Mecânico",
        descricao: "Você entende que quase tudo pode ser consertado com as ferramentas certas — e um pouco de criatividade. Máquinas, mecanismos e equipamentos fazem parte da sua experiência.",
        bonus: "",
        pericias: ["mecanica", "atualidades"],
        habilidades: ["Reconstruir"]
    },

    {
        id: 4,
        nome: "Negociador",
        descricao: "Você sabe que palavras podem ser tão poderosas quanto ações. Sua experiência em negociações ensinou a persuadir, interpretar pessoas e conseguir aquilo que deseja por meio de uma boa conversa.",
        bonus: "",
        pericias: ["conversação", "psicologia"],
        habilidades: ["Enganar", "Blefe"]
    },

    {
        id: 5,
        nome: "Combatente",
        descricao: "Você aprendeu a enfrentar conflitos de frente. Seja por treinamento, profissão ou experiência, sabe como lutar e agir sob pressão quando a situação exige força.",
        bonus: "",
        pericias: ["armas_brancas", "constituição"],
        habilidades: ["SacrifícioProtetor", "TécnicaDeCombate"]
    },

    {
        id: 6,
        nome: "Atirador",
        descricao: "Armas de fogo não são estranhas para você. Treinamento e experiência desenvolveram sua precisão e familiaridade com diferentes tipos de armamento.",
        bonus: "",
        pericias: [["rifle", "longo_alcance", "pistolas"]],
        quantidadePericias: 2,
        habilidades: ["TiroCerto", "AbrirFogo"]
    },

    {
        id: 7,
        nome: "Policial",
        descricao: "Você possui experiência em lidar com situações perigosas e manter o controle sob pressão. Seu treinamento ensinou a proteger pessoas, enfrentar ameaças e agir quando as coisas saem do controle.",
        bonus: "",
        pericias: [["pistolas", "vontade", "sobrevivencia"]],
        habilidades: ["Imobilizar", "Proteger"]
    },

    {
        id: 8,
        nome: "Cientista",
        descricao: "Você dedicou sua vida a compreender o mundo. Por meio de observação, pesquisa e experimentação, aprendeu a encontrar respostas para perguntas que ainda não foram respondidas.",
        bonus: "",
        pericias: ["ciencia", "magia"],
        habilidades: ["EquipamentosDeLaboratório", "MétodosExperimentais"]
    },

    {
        id: 9,
        nome: "Alquimista",
        descricao: "Você descobriu que a magia é mais bela e estranha do que parece. Ao combinar conhecimentos científicos e mágicos, aprendeu a manipular a vontade a fim de controlar completamente a magia.",
        bonus: "",
        pericias: ["alquimia", "magia"],
        habilidades: ["CriaçãoDeSímbolos", "CompreensãoMágica"]
    },

    {
        id: 10,
        nome: "Acadêmico",
        descricao: "O conhecimento sempre foi sua principal ferramenta. Como pesquisador, professor ou estudante, você se especializou em estudar, analisar e compreender assuntos complexos.",
        bonus: "",
        pericias: ["PericiasDeConhecimento"],
        habilidades: ["LeituraCrítica", "Especialista"]
    },

    {
        id: 11,
        nome: "Artista",
        descricao: "A arte sempre foi sua forma de expressão. Música, escrita, atuação, dança ou qualquer outra manifestação artística fizeram parte da sua vida e moldaram sua maneira de enxergar o mundo.",
        bonus: "",
        pericias: ["artes", "atualidades"],
        habilidades: ["PercepçãoDePadrões", "Performance"]
    },

    {
        id: 12,
        nome: "Atleta",
        descricao: "Treinamento, disciplina e competição fazem parte de quem você é. Sua experiência desenvolveu suas capacidades físicas e ensinou a manter o foco mesmo sob pressão.",
        bonus: "",
        pericias: ["acrobacia", "destreza"],
        habilidades: ["MovimentosLeves", "ReconhecimentoRápidoDeTerreno"]
    },

    {
        id: 13,
        nome: "Ocultista",
        descricao: "Você entrou em contato com conhecimentos que deveriam permanecer escondidos. Rituais, símbolos e fenômenos inexplicáveis deixaram de ser apenas histórias e se tornaram parte da sua realidade.",
        bonus: "",
        pericias: ["ocultismo", "vontade"],
        habilidades: ["Ocultismo", "LeituraDeSímbolosAntigos"]
    },

    {
        id: 14,
        nome: "Jornalista",
        descricao: "Você aprendeu que toda história possui algo escondido. Entrevistar pessoas, buscar informações e investigar acontecimentos fazem parte da sua experiência.",
        bonus: "",
        pericias: ["conversação", "psicologia"],
        habilidades: ["Entrevista", "RedeDeContatos"]
    },

    {
        id: 15,
        nome: "Mochileiro",
        descricao: "Você aprendeu a se adaptar ao desconhecido. Suas viagens ensinaram a lidar com ambientes diferentes, recursos limitados e situações imprevisíveis.",
        bonus: "",
        pericias: ["sobrevivencia",[ "constituição", "ciencia"]],
        habilidades: ["PreparoDeAbrigo", "ManualDeBolso"]
    },

    {
        id: 16,
        nome: "Especialista em Explosivos",
        descricao: "Você possui conhecimentos sobre substâncias, mecanismos e materiais capazes de causar grandes destruições. Em sua área, precisão e cuidado são essenciais.",
        bonus: "",
        pericias: ["pontaria", "destreza"],
        habilidades: ["Preparo"]
    },

    {
        id: 17,
        nome: "Investigador",
        descricao: "Você é treinado para encontrar respostas. Observar detalhes, reunir informações e conectar pistas são ferramentas tão importantes quanto qualquer arma.",
        bonus: "",
        pericias: ["percepção", "PericiasDeConhecimento"],
        habilidades: []
    }

];

function renderizarOcupações() {

    ocupaçõesContainer.innerHTML = "";
    ocupações.forEach(o => {
        const card = document.createElement("div");
        card.className = "ocupation-card";

        let bonus = ""
        let Habilidades = ""

        o.pericias.forEach(pericia => {

            if (bonus != "") bonus += " , "

            let displayName

            if (pericia == "PericiasDeConhecimento") {
                const quantidadeDeOpções = o.pericias.findIndex(el => el == pericia)==0? 2: 1;
                displayName = `${quantidadeDeOpções == 1? "( Uma": "( Duas"} das pericias de Conhecimento )`

            }else if (Array.isArray(pericia)) {

                const quantidadeDeOpções = o.pericias.findIndex(el => el == pericia)==0? 2: 1;
                displayName = `${quantidadeDeOpções == 1? "( Uma": "( Duas"} das seguintes pericias : ` //inicio do texto

                let text = ""

                pericia.forEach(el => { //geração do texto
                    if(text != "") text+= " , "
                    text += el.replace(/^./, letra => letra.toUpperCase())
                })

                displayName += text + " )" //Fim do texto

            }else {
                displayName = pericia.replace(/^./, letra => letra.toUpperCase())
            }
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
            <div class="ocupation-details">
                <p class="text">${o.descricao}</p>
                <hr>
                <p class="text sm">Pericias: ${bonus} ; Habilidade: ${Habilidades}</p>
                <button class="btn">Escolher</button>
            </div>
        `;

        const button = card.querySelector('.btn');
        button.addEventListener('click', (event) => {
            event.stopPropagation();
            selectOcupation(o.id);
        });

        card.addEventListener('click', () => {
            const currentlyActive = document.querySelector('.ocupation-card.active');
            if (currentlyActive && currentlyActive !== card) {
                currentlyActive.classList.remove('active');
            }
            card.classList.toggle('active');
        });

        ocupaçõesContainer.appendChild(card);
    });
    initTooltips(ocupaçõesContainer);
}

renderizarOcupações();

async function selectOcupation(id) {
    
    let choicePos = -1;
    let choices = []
    for (let i = 0; i < ocupações[id-1].pericias.length; i++) {
        if (ocupações[id-1].pericias[i] == "PericiasDeConhecimento") {
            choicePos = i
            choices = getCategoriasPericiasBase()[5].pericias;

        } else if (Array.isArray(ocupações[id-1].pericias[i])) {
            choicePos = i
            choices = ocupações[id-1].pericias[i]

        }
    }

    if (choicePos == -1) {
        ficha.ocupação = ocupações[id-1]
        finalizarSeleçãoDeOcupação()
        return;
    }

    try {
        const pericias = await seleçãoConhecimento(choices, choicePos == 0? 2: 1);
        console.log(choicePos)
        ficha.ocupação = ocupações[id-1]
        ficha.ocupação.pericias.splice(choicePos, 1)

        pericias.forEach(per => {
            ficha.ocupação.pericias.push(per)
        })
        
        finalizarSeleçãoDeOcupação()
    } catch (erro) {
        console.log("Seleção cancelada:", erro.message);
    }    
}

function finalizarSeleçãoDeOcupação() {

        ficha.ocupação.pericias.forEach(pericia => {
            const bonusPerEl = document.querySelector('[aria-value="'+pericia+'"]');
            console.log(pericia, bonusPerEl)
            bonusPerEl.style.color = "yellow"
            bonusPerEl.style.boxShadow = '0 0 10px inset #ffff0042;'
        });

        ficha.ocupação.habilidades.forEach(habilidade => {
            const habilidadeData = tooltipDictionary.Habilidades[habilidade];
            const nome = habilidade.replace(/([a-z])([A-Z])/g, '$1 $2');
            if (habilidadeData) {
                createAbility(nome, habilidadeData.descricao, null);
            }
        });   

        escolhaDeOcupação.style.display = "none";
        escolhaDeOrigem.style.display = "flex";
        
}

let cancelarSeleçãoConhecimento = null;

async function seleçãoConhecimento(pericias ,quant) {

    panelOpen('knowledgeSelector');

    return new Promise((resolve, reject) => {

        const periciasSelecionados = [];

        const text = document.querySelector("#knowledgeSelector span");
        const nextBtn = document.querySelector("#knowledgeSelector .next");

        const seletorDePericias1 = document.querySelector("#knowledgeSelector .i");
        const seletorDePericias2 = document.querySelector("#knowledgeSelector .ii");
        const seletorDePericias3 = document.querySelector("#knowledgeSelector .iii");
        const seletorDePericias4 = document.querySelector("#knowledgeSelector .iiii");
        const seletorDePericias5 = document.querySelector("#knowledgeSelector .iiiii");
        const seletorDePericias6 = document.querySelector("#knowledgeSelector .iiiiii");

        const seletoresDePericia = [
            seletorDePericias1,
            seletorDePericias2,
            seletorDePericias3,
            seletorDePericias4,
            seletorDePericias5,
            seletorDePericias6,
        ]

        seletoresDePericia.forEach(sP => {
            sP.style.display = "none"
        })

        console.log(pericias)
        for (let i = 0; i < pericias.length; i++) {
            const obj = seletoresDePericia[i]

            obj.style.display = "block"
            obj.textContent = pericias[i].replace(/^./, letra => letra.toUpperCase())
        }
        // Cancela a seleção atual
        cancelarSeleçãoConhecimento = () => {
            reject(new Error("Seleção de conhecimento cancelada"));
            document.querySelectorAll('#knowledgeSelector button:not(.next)').forEach(el => {
                el.classList.remove('active')
            })
        };

        function atualizarTexto() {

            text.textContent =
                `${periciasSelecionados.length} / ${quant} perícias selecionadas`;

            nextBtn.classList.toggle(
                "hide",
                periciasSelecionados.length !== quant
            );
        }

        function selecionarPericia(pericia, el) {

            const index = periciasSelecionados.indexOf(pericia);

            if (index !== -1) {

                periciasSelecionados.splice(index, 1);
                el.classList.remove('active');

            } else if (periciasSelecionados.length < quant) {

                periciasSelecionados.push(pericia);
                el.classList.add('active');
            }

            atualizarTexto();
        }


        seletorDePericias1.addEventListener('click', () => {
            selecionarPericia(pericias[0], seletorDePericias1);
        });

        seletorDePericias2.addEventListener('click', () => {
            selecionarPericia(pericias[1], seletorDePericias2);
        });

        seletorDePericias3.addEventListener('click', () => {
            selecionarPericia(pericias[2], seletorDePericias3);
        });

        seletorDePericias4.addEventListener('click', () => {
            selecionarPericia(pericias[3], seletorDePericias4);
        });

        seletorDePericias5.addEventListener('click', () => {
            selecionarPericia(pericias[4], seletorDePericias5);
        });

        seletorDePericias6.addEventListener('click', () => {
            selecionarPericia(pericias[5], seletorDePericias6);
        });

        nextBtn.addEventListener('click', () => {

            if (periciasSelecionados.length === quant) {

                cancelarSeleçãoConhecimento = null;

                resolve(periciasSelecionados);
                panelClose();
            }

        }, { once: true });

        atualizarTexto();
    });
}

// Função externa para cancelar
function cancelarSeleçãoConhecimentoAtual() {

    if (cancelarSeleçãoConhecimento) {

        cancelarSeleçãoConhecimento();
        cancelarSeleçãoConhecimento = null;

        panelClose();
    }
}

// ====================== ORIGENS ======================

const origensContainer = document.getElementById('origensContainer');

const origens = [

    // Origens ligadas à vida

    {
        id: 1,
        nome: "Estudante",
        descricao: "Passou boa parte da vida em ambiente acadêmico, desenvolvendo conhecimento e relações. Possui facilidade para acessar instituições acadêmicas, bibliotecas e pessoas ligadas ao meio acadêmico.",
    },

    {
        id: 2,
        nome: "Morador de Rua",
        descricao: "Aprendeu a sobreviver com poucos recursos e a conhecer os perigos das ruas. Possui contatos entre pessoas que vivem nas ruas e conhece lugares onde pode conseguir abrigo, informações ou ajuda.",
    },

    {
        id: 3,
        nome: "Criado no Interior",
        descricao: "Cresceu em uma comunidade pequena, desenvolvendo familiaridade com ambientes rurais e uma vida mais isolada. Possui facilidade para encontrar ajuda e estabelecer relações em comunidades pequenas e ambientes rurais.",
    },

    {
        id: 4,
        nome: "Criado na Cidade",
        descricao: "Cresceu em grandes centros urbanos, acostumado ao movimento, à tecnologia e à diversidade. Conhece a dinâmica das cidades e possui familiaridade com estabelecimentos, serviços e diferentes grupos urbanos.",
    },

    {
        id: 5,
        nome: "Nômade",
        descricao: "Nunca permaneceu muito tempo em um único lugar, aprendendo a se adaptar rapidamente a novos ambientes. Possui contatos e conhecimentos espalhados pelos lugares onde já viveu ou passou.",
    },

    {
        id: 6,
        nome: "Isolado",
        descricao: "Passou grande parte da vida afastado da sociedade, tendo pouco contato com outras pessoas. Possui dificuldade para lidar com estruturas sociais e costumes comuns, mas seu passado pode ser desconhecido pela maioria das pessoas.",
    },

    {
        id: 7,
        nome: "Privilegiado",
        descricao: "Cresceu cercado de recursos e oportunidades, tendo acesso a educação, dinheiro ou influência. Possui acesso a ambientes, serviços e pessoas que normalmente seriam inacessíveis para outras pessoas.",
    },

    {
        id: 8,
        nome: "Abandonado",
        descricao: "Cresceu sem uma estrutura familiar estável e aprendeu desde cedo a depender de si mesmo. Possui contatos entre pessoas que vivem à margem da sociedade e experiência em encontrar recursos sem depender de outras pessoas.",
    },

    {
        id: 9,
        nome: "Órfão",
        descricao: "Perdeu seus responsáveis cedo, sendo obrigado a amadurecer antes do tempo. Pode possuir contatos ou conhecimentos relacionados às instituições, pessoas e lugares ligados à sua antiga vida.",
    },

    {
        id: 10,
        nome: "Criado em Comunidade",
        descricao: "Cresceu cercado por uma comunidade muito unida, aprendendo a depender e cuidar dos outros. Pode recorrer à sua comunidade para conseguir abrigo, ajuda, informações ou outros tipos de apoio.",
    },


    // Origens ligadas a acontecimentos

    {
        id: 11,
        nome: "Sobrevivente",
        descricao: "Passou por um acontecimento grave que mudou completamente sua maneira de enxergar o mundo. Possui experiência prática e conhecimentos relacionados ao acontecimento que sobreviveu.",
    },

    {
        id: 12,
        nome: "Exilado",
        descricao: "Foi obrigado a abandonar seu antigo lar ou grupo. Mantém conhecimentos e contatos de seu antigo lar, embora possa não ser bem-vindo ao retornar.",
    },

    {
        id: 13,
        nome: "Fugitivo",
        descricao: "Precisou fugir de alguém ou de alguma coisa e aprendeu a viver evitando ser encontrado. Possui conhecimentos sobre como evitar rastreamento e pode conhecer pessoas dispostas a ajudá-lo a desaparecer.",
    },

    {
        id: 14,
        nome: "Amnésico",
        descricao: "Perdeu parte das próprias memórias, deixando lacunas sobre seu passado. Pode possuir conhecimentos, contatos ou relações que não consegue explicar, mas que podem estar ligados à sua vida antes da perda de memória.",
    },


    // Origens sociais

    {
        id: 15,
        nome: "Órfão de Guerra",
        descricao: "Cresceu em meio a conflitos e aprendeu a lidar com violência e escassez. Possui contatos entre sobreviventes, veteranos e pessoas afetadas por conflitos.",
    },

    {
        id: 16,
        nome: "Alta Sociedade",
        descricao: "Cresceu entre pessoas influentes e aprendeu a navegar por ambientes sociais privilegiados. Possui acesso a eventos, círculos sociais e pessoas influentes.",
    },

    {
        id: 17,
        nome: "Submundo",
        descricao: "Cresceu próximo ao crime, contrabando ou outras atividades ilegais. Possui contatos no submundo e conhece pessoas capazes de conseguir informações ou recursos ilegais.",
    },

    {
        id: 18,
        nome: "Comunidade Religiosa",
        descricao: "Foi criado em um ambiente fortemente ligado a uma comunidade ou instituição religiosa. Possui contatos dentro de sua comunidade religiosa e pode encontrar abrigo, informações ou auxílio através dela.",
    },

    {
        id: 19,
        nome: "Família Militar",
        descricao: "Cresceu cercado por disciplina, treinamento e pessoas ligadas às forças armadas. Possui contatos entre militares e familiaridade com ambientes e instituições militares.",
    },

    {
        id: 20,
        nome: "Família Rica",
        descricao: "Teve acesso a recursos que a maioria das pessoas não teria. Pode recorrer aos contatos e propriedades de sua família para conseguir acesso a recursos, locais ou informações.",
    },

    {
        id: 21,
        nome: "Família Criminosa",
        descricao: "Cresceu cercado por atividades criminosas e aprendeu seus códigos. Possui contatos ligados ao crime e conhece os costumes, códigos e métodos utilizados por organizações criminosas.",
    },

    {
        id: 22,
        nome: "Família de Investigadores",
        descricao: "Cresceu ouvindo histórias e aprendendo métodos de investigação. Possui acesso a antigos contatos, arquivos ou conhecimentos acumulados por sua família.",
    },


    // Origens ocultas

    {
        id: 23,
        nome: "Sobrevivente do Oculto",
        descricao: "Teve contato direto com o outro lado e seus efeitos, vivendo em busca de esquecer, entender ou destruir aquilo que encontrou. Possui conhecimentos e contatos relacionados ao oculto adquiridos durante sua experiência.",
    },

    {
        id: 24,
        nome: "Experimento",
        descricao: "Seu corpo ou mente foi alterado por experimentos, deixando fortes sequelas. Pode reconhecer procedimentos, instituições ou pessoas relacionadas aos experimentos que sofreu.",
    },

    {
        id: 25,
        nome: "Misto",
        descricao: "Possui características provenientes de diferentes origens ou espécies. Possui conhecimentos, costumes ou contatos provenientes das diferentes origens que compõem sua história.",
    },

    {
        id: 26,
        nome: "Ocultista Arrependido",
        descricao: "Já fez parte de um grupo ocultista ou seita no passado e hoje tenta abandonar ou usar o que sabe contra o outro lado. Possui conhecimento sobre os métodos, símbolos e pessoas relacionados ao grupo do qual fez parte.",
    },

    {
        id: 27,
        nome: "Herdeiro do Oculto",
        descricao: "Nasceu ou cresceu em uma família que conhecia o sobrenatural e suas implicações, tendo sido criado com um propósito. Possui acesso aos conhecimentos, objetos, contatos ou registros deixados por sua família.",
    },

    {
        id: 28,
        nome: "Reencarnado",
        descricao: "Possui memórias, características ou conhecimentos que não pertencem à sua vida atual. Pode reconhecer pessoas, lugares ou acontecimentos que não deveria conhecer, mesmo sem saber explicar a origem desse conhecimento.",
    },

    {
        id: 29,
        nome: "Abduzido",
        descricao: "Desapareceu por um período após ser levado por uma entidade, organização ou fenômeno desconhecido. Possui conhecimentos ou características adquiridos durante seu desaparecimento, mas pode também ser reconhecido por pessoas ou entidades relacionadas ao que aconteceu.",
    },

    {
        id: 30,
        nome: "Monstruoso",
        descricao: "O limiar entre a humanidade e a loucura, a quebra do templo sagrado. Seu corpo foi completamente modificado pelo outro lado, por vontade própria ou não. Embora tentativas anteriores alertem do perigo, algumas pessoas se submetem a isso para o bem, por ingenuidade, confiança ou loucura. Sempre estão errados. Geralmente são caçados pela Ordo, mas aqueles que os ajudam tornam-se responsáveis por cada ato. Cada elemento tem sua própria vontade.",
    },

];
    
renderizarOrigens()

function renderizarOrigens() {

    origensContainer.innerHTML = "";
    origens.forEach(origem => {
        const card = document.createElement("div");
        card.className = "origin-card";

        card.innerHTML = `
            <div class="corner-images">
                <img src="img/corner2.svg" class="corner-image top-left" alt="">
                <img src="img/corner2.svg" class="corner-image top-right" alt="">
                <img src="img/corner2.svg" class="corner-image bottom-left" alt="">
                <img src="img/corner2.svg" class="corner-image bottom-right" alt="">
            </div>
            <h2 class="title">${origem.nome}</h2>
            <div class="origin-details">
                <p class="text">${origem.descricao}</p>
                <hr>
                <button class="btn">Escolher</button>
            </div>
        `;

        const button = card.querySelector('.btn');
        button.addEventListener('click', (event) => {
            event.stopPropagation();
            selectOrigin(origem.id);
        });

        card.addEventListener('click', () => {
            const currentlyActive = document.querySelector('.origin-card.active');
            if (currentlyActive && currentlyActive !== card) {
                currentlyActive.classList.remove('active');
            }
            card.classList.toggle('active');
        });

        origensContainer.appendChild(card);
    });
    //initTooltips(origensContainer);
}

function selectOrigin(id) {

    ficha.original = ocupações[id-1]
    escolhaDeOrigem.style.display = "none"
    escolhaDePericia.style.display = "flex";
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

var tipoSelecionado = null;

function typeChose(id) {
    tipoSelecionado = id
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

    if (tipoSelecionado == null) return
    escolhaDeTipoMagico.style.display = "none";
    escolhaDeFocoMagico.style.display = "flex";
    ficha.tipo = tipoSelecionado;

    if (ficha.ocupação.id == 9) {
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
        ficha.foco[focoS]++
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
        ficha.foco[focoS]--
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

    escolhaDeFocoMagico.style.display = "none";
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
        prDiv = escolhaDePericia
        criaçãoDeFicha.remove()
        game.style.display = "flex";
    }, 3000);
    
}

function irParaJogo() {

    const criaçãoDeFicha = document.getElementById("criaçãoDeFicha");
    const game = document.getElementById("game");
    const main = document.querySelector("main");

    main.style.display = "none";
    criaçãoDeFicha.style.display = "flex";
    game.style.display = "flex";

    displayPericias();

    //Atualização autmomatica de ficha 
    if(configuraçõesDeAtualizações.fichaComEnergia) {
        statusDef()
    }
}

function renderPersonagem() {
    // Basic Info
    document.getElementById('personagem-nome').textContent = ficha.nome || 'Err';
    document.getElementById('personagem-idade').textContent = ficha.idade || 'Err';
    document.getElementById('personagem-raca').textContent = ficha.raça.nome !== "" ? ficha.raça.nome : 'Err';
    
    if(ficha.options.haveMagiaPer) {
        document.getElementById('personagem-tipo').textContent = ficha.tipo !== -1 ? types[ficha.tipo].nome : 'Err';
        
        let focosText = [];
        for (let i = 0; i < focos.length; i++) {
            if (focos[i].value > 0) {
                focosText.push(focos[i].name + " (" + focos[i].value + ")");
            }
        }
        document.getElementById('personagem-foco').textContent = focosText.join(', ');
    }

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

    stopOvershadow(element);

    element._glitchInterval = setInterval(() => {
        startOvershadow(element, amount);
    }, speed);
}

function stopOvershadow(element) {

    clearInterval(element._glitchInterval);

    if (element.dataset.originalText) {
        element.textContent = element.dataset.originalText;
    }
}
function test() {
  document.querySelectorAll('span, p, button, .title').forEach(el => {
    overshadowText(el, 1, 5000, 2);
  });
}
