// ====================== TOOLTIP ======================

const tooltipDictionary = { 
    Pericia: { 
        Lábia: { descricao: "Convence pessoas com palavras." },
        Aparência: { descricao: "Usa charme e beleza." },
        Intimidar: { descricao: "Assusta para impor respeito." },
        Poder: { descricao: "Força de influência." },
        Sorte: { descricao: "Boa fortuna em situações aleatórias." },
        Força: { descricao: "Capacidade de força física." },
        Corpo: { descricao: "Controle corporal geral." },
        Constituição: { descricao: "Resistência física e vitalidade." },
        Destreza: { descricao: "Agilidade e precisão motora." },
        Inteligência: { descricao: "Capacidade analítica e lógica." },
        Percepção: { descricao: "Atenção aos detalhes e sentidos." },
        Estabilidade: { descricao: "Controle emocional e mental." },
        ArmasBrancas: { descricao: "Uso de facas e espadas." },
        Pistolas: { descricao: "Armas de fogo de curto alcance." },
        Rifles: { descricao: "Armas de fogo de médio alcance." },
        LongoAlcance: { descricao: "Arcos, bestas e similares." },
        Arremeçar: { descricao: "Lançar objetos com precisão." },
        Movimento: { descricao: "Sua mobilidade em combate"},
        Furtividade: { descricao: "Sua habilidade de pasar despercebido"},
        Esquiva: { descricao: "Capacidade de se desviar de ataques"},
        Acrobacia: { descricao: "Capacidade de executar e performar manobras"},
        ContraAtaque:{ descricao: "Habilidade de revidar ataques"},
        Magia: { descricao: "Manipulação de energias mágicas." },
        Alquimia: { descricao: "Preparação de poções e elixires." },
        Ocultismo: { descricao: "Conhecimento do sobrenatural." },
        História: { descricao: "Conhecimento histórico." },
        Mecanica: { descricao: "Reparo e engenharia prática." },
        UsarComputadores: { descricao: "Uso de computadores." },
        Sobrevivência: { descricao: "Habilidades de campo e mato." },
        Música: { descricao: "Uso artístico de instrumentos e voz." },
        ConhecimentosGerais: { descricao: "Cultura ampla e variada." },
        Linguas: { descricao: "Comunicação em outros idiomas." },
        Medicina: { descricao: "Cuidado com ferimentos e doenças." },
        Ciência: { descricao: "Conhecimento científico." },
        Aprendizado: { descricao: "Facilidade em aprender"} 
    },
    Raça: {},
    Atributo: {
        Social: { descricao: "Relacionamento interpessoal.", pericias: ["Lábia", "Aparência", "Intimidar", "Poder", "Sorte"] },
        Fisico: { descricao: "Força, agilidade e vitalidade.", pericias: ["Força", "Corpo", "Constituição", "Destreza"] },
        Intelecto: { descricao: "Pensamento e raciocínio lógico.", pericias: ["Inteligência", "Percepção", "Estabilidade"] },
        Combate: { descricao: "Habilidades marciais.", pericias: ["ArmasBrancas", "Pistolas", "Rifles", "LongoAlcance", "Arremeçar"] },
        Habilidades: { descricao: "Capacidades físicas e de movimento.", pericias: ["Movimento", "Furtividade", "Esquiva", "Acrobacia", "ContraAtaque"] },
        Magia: { descricao: "Energia arcana e estudos ocultos.", pericias: ["Magia", "Alquimia", "Ocultismo"] },
        Conhecimento: { descricao: "Estudos e erudição.", pericias: ["História", "Mecanica", "Sobrevivência", "Música", "ConhecimentosGerais", "Linguas", "Medicina", "Ciência", "Aprendizado", "UsarComputadores"] } },
Habilidades: {
    ConhecimentoAnatômico: {
        descricao: 'Gastando 5 de Medo e um turno, você é capaz de identificar o ponto fraco de um alvo. Todos que souberem dessa fraqueza causarão +50% de dano contra ele durante 1D3 turnos.'
    },
    UsoDeRemédios: {
        descricao: 'Você pode gastar um kit médico completo para curar um Ferimento Grave em meia hora.'
    },
    ProficiênciaEmHardware: {
        descricao: 'Você identifica falhas, vulnerabilidades e brechas em aparelhos eletrônicos com facilidade.'
    },
    ProficiênciaEmSoftware: {
        descricao: 'Com uma rodada de Usar Computadores, você pode invadir sistemas avançados e obter acesso privilegiado.'
    },
    Reconstruir: {
        descricao: 'Com uma rodada de Mecânica, você pode desmontar um objeto e criar outro semelhante a partir de suas peças.'
    },
    Enganar: {
        descricao: 'Gastando 5 de Medo, você pode substituir qualquer teste de Perícia por uma rolagem de Lábia ou Aparência.'
    },
    Blefe: {
        descricao: 'Gastando 10 de Medo, você passa automaticamente em um teste de Lábia, sem necessidade de rolagem.'
    },
    SacrifícioProtetor: {
        descricao: 'Ao realizar um teste de Destreza antes que um aliado receba dano, você pode intervir e receber o dano em seu lugar.'
    },
    TécnicaDeCombate: {
        descricao: 'Com uma rolagem de Força e gastando 10 de Medo, você causa o dobro de dano em um ataque físico.'
    },
    TiroCerto: {
        descricao: 'Ao atacar de forma furtiva, você pode causar o dobro de dano com um tiro preciso.'
    },
    AbrirFogo: {
        descricao: 'Você pode efetuar três disparos em um mesmo turno, sofrendo apenas duas desvantagens.'
    },
    Imobilizar: {
        descricao: 'Gastando 5 de Medo (uma vez a cada meia hora), você pode imobilizar um alvo por 1D4 turnos.'
    },
    Proteger: {
        descricao: 'Você concede +3 de armadura a um aliado atrás de você, além de deixá-lo em estado furtivo.'
    },
    EquipamentosDeLaboratório: {
        descricao: 'Você recebe vantagem ao analisar pequenos objetos utilizando ferramentas e equipamentos de laboratório.'
    },
    MétodosExperimentais: {
        descricao: 'Você domina procedimentos experimentais, podendo realizar testes e análises detalhadas, como remoção de tinta e rastreamento de resíduos.'
    },
    ReagentesMísticos: {
        descricao: 'Você é capaz de criar reações químicas ou místicas únicas utilizando reagentes especiais.'
    },
    ControleDeSubstânciasQuímicas: {
        descricao: 'Sua habilidade em misturar e manipular substâncias químicas previne acidentes e aumenta a eficácia dos resultados.'
    },
    LeituraCrítica: {
        descricao: 'Gastando 5 de Medo, você obtém vantagem em testes de Inteligência e Percepção ao analisar textos, documentos ou situações complexas.'
    },
    ConhecimentoEspecializado: {
        descricao: 'Você possui domínio teórico aprofundado, recebendo vantagem em testes de História e Aprendizado.'
    },
    ArteVisual: {
        descricao: 'Sua arte pode influenciar emoções, transmitir mensagens complexas ou criar disfarces convincentes.'
    },
    MúsicaOuPerformance: {
        descricao: 'Você é capaz de cativar, inspirar ou manipular o público através da música, atuação ou outras formas de performance.'
    },
    MovimentosLeves: {
        descricao: 'Você se move com leveza e precisão, recebendo vantagem em testes de Furtividade e Esquiva.'
    },
    ReconhecimentoRápidoDeTerreno: {
        descricao: 'Gastando 10 de Medo, você identifica brechas, caminhos ocultos e pontos estratégicos no ambiente ao seu redor.'
    },
    Ocultismo: {
        descricao: 'Seu conhecimento sobre o oculto permite reconhecer criaturas, rituais e artefatos sobrenaturais. Gastando 20 de Medo, você recebe duas vantagens em qualquer teste de Ocultismo.'
    },
    LeituraDeSímbolosAntigos: {
        descricao: 'Você é capaz de decifrar símbolos e rituais antigos que seriam incompreensíveis para a maioria das pessoas.'
    },
    Entrevistas: {
        descricao: 'Gastando 5 de Medo e realizando um teste de Lábia, você pode fazer uma pergunta certeira que revela uma informação valiosa ou secreta.'
    },
    RedeDeContatos: {
        descricao: 'Você conhece pessoas influentes e bem posicionadas, podendo recorrer a elas para obter informações, favores ou recursos.'
    },
    PreparoDeAbrigo: {
        descricao: 'Você domina técnicas de sobrevivência, sendo capaz de encontrar ou construir abrigos seguros em ambientes hostis ou urbanos.'
    },
    Manual: {
        descricao: 'Você executa tarefas práticas e manuais com precisão, sendo capaz de improvisar soluções com poucos recursos.'
    },
    Preparo: {
        descricao: 'Gastando 15 de Medo, você prepara um explosivo com perfeição, garantindo o dano máximo possível.'
    }
},

    
    Origem: {
        Medico: { descricao: "Você era um profissional da saúde como um enfermeiro, farmacêutico, médico, psicólogo ou socorrista, treinado no atendimento e cuidado de pessoas. " },
        TI: { descricao: "Programador, engenheiro de software ou simples-mente “o cara da T.I.”, você tem treinamento e ex-periência para lidar com sistemas informatizados." },
        Mecânico: { descricao: "Enquanto os acadêmicos estão preocupados com teorias, você colocar a mão na massa, seja como en- genheiro proﬁssional, seja como inventor de garagem." },
        Negociador: { descricao: "Você trabalhou em alguma posição de grande importância, a qual precissava negociar coisas importantes"},
        Combatente: { descricao: "Você sempre gostou de estar na frente das brigas e aprendeu a ser mais forte com elas"},
        Atirador: { descricao: "Você frequentava clubes de tiro e sabe manusear armas longas como parte do seu corpo."},
        Policial: { descricao: "Você fez parte de uma força de segurança pública, civil ou militar."},
        Cientista: { descricao: "Você estudou por anos sobre a vida e o funcionamento do mundo."},
        Alquimista: { descricao: "Você conheceu de perto a verdade sobre a magia e começou a estudar sobre a alquimia."},
        Acadêmico: { descricao: "Você era um pesquisador ou professor universitário."},
        Artista: { descricao: "Você era um ator, músico, escritor, dançarino, influenciador. "},
        Atleta: { descricao: "Você competia em um esporte individual ou por equipe, como natação ou futebol."},
        Ocultista: { descricao: "Você de algum modo entrou em um grupo ocultista, porém hoje busca entender como pará-los de alguma forma usando suas habilidades ocultas."},
        Jornalista: { descricao: "Você é um jornalista, tendo já escrito e participado de diversas matérias que te levaram a conhecer e vivenciar muitas das situações mais estranhas e inusitadas que alguém jamais imaginaria viver. Porém, nada disso te impediu se sempre ir atrás de mais uma aventura para consegui um furo de noticias."},
        Mochileiro: { descricao: "Você viajou por todo o mundo, tendo tido inúmeras vivências incríveis, conhecendo povos por todo o globo e participando das mais imagináveis celebrações. Graças a isso, está pronto para participar de qualquer aventura ou loucura que te chamarem, afinal um dia ruim acaba sempre virando uma boa história."},
        ExpecialistaEmExplosivos: { descricao: "Você viveu em meio a turbulencias e fez do fogo e do caus seu refugio."} },
        MagiaFicha: {
            ConhecimentoMagico: { descricao: "Seu conhecimento sobre a performace de magias", descricaoExtra: "Serve para"},
            Elementos : {descricao: "Os elementos são as forças matrizes do mundo, divididos em simples e avançados.", descricaoExtra: "Simples: Fogo, Água, Gelo, Terra, Eletricidade, Planta e Vento; Avançados: Escuridão, Luz e Hipnose,"}
        },
        Status: {
            Vida: { descricao: "Sua força de vigor e vitalidade"},
            PontosDeMagia: {descricao: "A energia vital usada para conjurar magias de todos os tipos"},
            Medo: { descricao: "Sua resistencia a pressão e medo"}
    }
};



// Tooltip principal
const tooltip = document.getElementById("tooltip");

// Tooltip lateral (lista de perícias)
const rightTooltip = document.createElement("div");
rightTooltip.id = "right-tooltip";
document.body.appendChild(rightTooltip);

// Tooltip flutuante de perícia individual
const periciaTooltip = document.createElement("div");
periciaTooltip.id = "pericia-tooltip";
document.body.appendChild(periciaTooltip);

let rightTooltipOpen = false;
let activeTooltipTrigger = null; // Guarda o elemento que acionou o tooltip
let hideTooltipTimer = null; // Guarda o timer para esconder o tooltip

function hideAllTooltips() {
  tooltip.style.display = "none";
  rightTooltip.style.display = "none";
  periciaTooltip.style.display = "none";
  rightTooltipOpen = false;
  activeTooltipTrigger = null;
}

// Lógica para esconder os tooltips quando o mouse sai deles
const allTooltips = [tooltip, rightTooltip, periciaTooltip];
allTooltips.forEach(tt => {
    tt.addEventListener("mouseleave", () => {
        hideTooltipTimer = setTimeout(() => {
            const isHoveringAny = allTooltips.some(t => t.matches(':hover')) || (activeTooltipTrigger && activeTooltipTrigger.matches(':hover'));
            if (!isHoveringAny) {
                hideAllTooltips();
            }
        }, 150);
    });
});


// Função para inicializar tooltips em qualquer "short"
function initTooltips(scope = document) {
    scope.querySelectorAll("short").forEach(el => {
        el.onmouseenter = null;
        el.onmouseleave = null;

        el.addEventListener("mouseenter", (ev) => {
            clearTimeout(hideTooltipTimer); // Cancela qualquer timer pendente para esconder
            activeTooltipTrigger = el; // Define o gatilho ativo
            const classes = Array.from(el.classList);
            const categoria = classes[0];
            const conteudo = classes[1];

            const data = tooltipDictionary[categoria]?.[conteudo] || {};
            const descricao = data.descricao || `Informações adicionais sobre ${conteudo}.`;

            console.log(data, tooltipDictionary[categoria][conteudo])
            if (categoria === 'Pericia' && scope === rightTooltip) {
                periciaTooltip.textContent = descricao;
                const rect = el.getBoundingClientRect();
                periciaTooltip.style.display = 'block';
                periciaTooltip.style.left = rect.right + 5 + 'px';
                periciaTooltip.style.top = rect.top + 'px';
                return; // Não mostra o tooltip principal para perícias na lista
            }

            tooltip.querySelector(".title").textContent = conteudo.replace(/([a-z])([A-Z])/g, '$1 $2');
            tooltip.querySelector(".title").className = "title " + categoria;
            tooltip.querySelector(".subtitle").textContent = categoria;
            tooltip.querySelector(".text").textContent = descricao;
            tooltip.querySelector(".text.sm").textContent = data.descricaoExtra? data.descricaoExtra: "";

            // Remove o botão de perícias se já existir
            const existingBtn = tooltip.querySelector('.pericias-btn');
            if (existingBtn) {
                existingBtn.remove();
            }

            if (categoria === 'Atributo' && data.pericias) {
                const periciasBtn = document.createElement('button');
                periciasBtn.className = 'btn pericias-btn';
                periciasBtn.textContent = 'Perícias';
                tooltip.querySelector('div:last-child').appendChild(periciasBtn);

                periciasBtn.addEventListener('click', () => {
                    if (rightTooltipOpen) {
                        rightTooltip.style.display = 'none';
                        rightTooltipOpen = false;
                        return;
                    }

                    rightTooltip.innerHTML = '';
                    const periciasList = document.createElement('div');
                    periciasList.className = 'pericias-list';
                    
                    data.pericias.forEach(p => {
                        const shortEl = document.createElement('short');
                        shortEl.className = `Pericia ${p}`;
                        shortEl.textContent = p.replace(/([a-z])([A-Z])/g, '$1 $2');
                        periciasList.appendChild(shortEl);
                    });

                    rightTooltip.appendChild(periciasList);
                    initTooltips(rightTooltip); // Re-inicializa os tooltips para as novas pericias

                    const tooltipRect = tooltip.getBoundingClientRect();
                    rightTooltip.style.display = 'block';
                    rightTooltip.style.left = tooltipRect.right + 5 + 'px';
                    rightTooltip.style.top = tooltipRect.top + 'px';
                    rightTooltipOpen = true;
                });
            }

            if (scope !== rightTooltip) {
                rightTooltip.style.display = "none";
                rightTooltip.innerHTML = "";
                rightTooltipOpen = false;
            }

            const rect = el.getBoundingClientRect();
            let left = rect.left;

            tooltip.style.display = "block";
            const ttRect = tooltip.getBoundingClientRect();

            const prefersTop = el.classList.contains('top');
            const fitsBottom = rect.bottom + ttRect.height < window.innerHeight;
            const fitsTop = rect.top - ttRect.height > 0;

            let top;

            if (prefersTop) {
                if (fitsTop) {
                    top = rect.top - ttRect.height - 10;
                } else if (fitsBottom) {
                    top = rect.bottom;
                } else {
                    top = 10; // Fallback
                }
            } else {
                if (fitsBottom) {
                    top = rect.bottom;
                } else if (fitsTop) {
                    top = rect.top - ttRect.height - 10;
                } else {
                    top = 10; // Fallback
                }
            }

            // Adjust horizontally
            if (left + ttRect.width > window.innerWidth) {
                left = window.innerWidth - ttRect.width - 10;
            }
            if (left < 0) {
                left = 10;
            }

            tooltip.style.left = left + window.scrollX + "px";
            tooltip.style.top = top + window.scrollY + "px";
        });

        el.addEventListener("mouseleave", () => {
            if (scope === rightTooltip) {
                periciaTooltip.style.display = 'none';
            }
            // A mesma lógica de timeout para esconder
            hideTooltipTimer = setTimeout(() => {
                const isHoveringAny = allTooltips.some(t => t.matches(':hover')) || (el && el.matches(':hover'));
                if (!isHoveringAny) {
                    hideAllTooltips();
                }
            }, 150);
        });
    });
}

// Inicializa tooltips para elementos já existentes
initTooltips(document);

// ====================== FICHA ======================

const nameInput = document.getElementById("name");
const dateInput = document.getElementById("date");
const ageInput = document.getElementById("age");
const heightInput = document.getElementById("height");
const weightInput = document.getElementById("weight");
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



// Função para abrir criador
function abrirCriadorDeFicha() {
    main.style.display = "none";
    cF.style.display = "flex";
    IB.style.display = "flex";
}

// Inputs
const proximoBtn1 = document.querySelector("#p1");
const inputs1 = [nameInput, dateInput, ageInput, heightInput, weightInput];
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

    ficha.raça = rs

    console.log(ficha.pontos)
    raças[rs].per.forEach(e => {
        ficha.pericias[e.per].value = e.quant
        ficha.pericias[e.per].min = e.quant
        
    });
}

// ====================== ORIGENS ======================

const OgContainer = document.getElementById('origens');

const origens = [
    { id: 1, nome: "Médico", descricao: "Você era um profissional da saúde como um enfermeiro, farmacêutico, médico, psicólogo ou socorrista, treinado no atendimento e cuidado de pessoas. ", bonus: "", pericias: ["Medicina", "Ciência"], habilidades: ["ConhecimentoAnatômico", "UsoDeRemédios"] },
    { id: 2, nome: "Técnico de Informática", descricao: "Programador, engenheiro de software ou simples-mente “o cara da T.I.”, você tem treinamento e ex-periência para lidar com sistemas informatizados.", bonus: "", pericias: ["UsarComputadores", "Inteligência"], habilidades: ["ProficiênciaEmHardware", "ProficiênciaEmSoftware"] },
    { id: 3, nome: "Mecânico", descricao: "Enquanto os acadêmicos estão preocupados com teorias, você colocar a mão na massa, seja como en- genheiro proﬁssional, seja como inventor de garagem.", bonus: "", pericias: ["Mecanica", "Aprendizado", "ConhecimentosGerais"], habilidades: ["Reconstruir", ] },
    { id: 4, nome: "Negociador", descricao: "Você trabalhou em alguma posição de grande importancia, a qual precissava negociar coisas importantes", bonus: "", pericias: ["Lábia", "Aparência"], habilidades: ["Enganar", "Blefe"] },
    { id: 5, nome: "Combatente", descricao: "Você sempre gostou de estar na frente das brigas e aprendeu a ser mais forte com elas", bonus: "", pericias: ["ArmasBrancas", "Constituição", "Força"], habilidades: ["SacrificioProtetor", "TecnicaDeCombate"] },
    { id: 6, nome: "Atirador", descricao: "Você frequentava clubes de tiro e sabe manusear armas longas como parte do seu corpo.", bonus: "", pericias: ["Rifles", "LongoAlcance", "Pistolas"], habilidades: ["TiroCerto", "AbrirFogo"] },
    { id: 7, nome: "Policial", descricao: "Você fez parte de uma força de segurança pública, civil ou militar.", bonus: "", pericias: ["Pistolas", "Estabilidade", "Sobrevivência"], habilidades: ["Imobilizar", "Proteger"] },
    { id: 8, nome: "Cientista", descricao: "Você estudou por anos sobre a vida e o funcionamento do mundo.", bonus: "", pericias: ["Ciência", "Magia"], habilidades: ["Equipamentos de Laboratório", "Métodos Experimentais"] },
    { id: 9, nome: "Alquimista", descricao: "Você conheceu de perto a verdade sobre a magia e começou a estudar sobre a alquimia.", bonus: "", pericias: ["Alquimia", "Magia"], habilidades: ["Reagentes Místicos", "ControleDeSubstânciasQuímicas"] },
    { id: 10, nome: "Acadêmico", descricao: "Você era um pesquisador ou professor universitário.", bonus: "", pericias: ["História", "Aprendizado"], habilidades: ["LeituraCrítica", "ConhecimentoEspecializado"] },
    { id: 11, nome: "Artista", descricao: "Você era um ator, músico, escritor, dançarino, influenciador. ", bonus: "", pericias: ["Música", "ConhecimentosGerais"], habilidades: ["ArteVisual", "MúsicaOuPerformance"] },
    { id: 12, nome: "Atleta", descricao: "Você competia em um esporte individual ou por equipe, como natação ou futebol.", bonus: "", pericias: ["Acrobacia", "Destreza"], habilidades: ["MovimentosLeves", "ReconhecimentoRápidoDeTerreno"] },
    { id: 13, nome: "Ocultista", descricao: "Você de algum modo entrou em um grupo ocultista, porem hoje busca entender como paralos de alguma forma ussando suas habilidades ocultas.", bonus: "", pericias: ["Ocultismo", "Poder"], habilidades: ["Ocultismo", "LeituraDeSímbolosAntigos"] },
    { id: 14, nome: "Jornalista", descricao: "Você é um jornalista, tendo já escrito e participado de diversas matérias que te levaram a conhecer e vivenciar muitas das situações mais estranhas e inusitadas que alguém jamais imaginaria viver. Porém, nada disso te impediu se sempre ir atrás de mais uma aventura para consegui um furo de noticias.", bonus: "", pericias: ["Lábia", "Aparência"], habilidades: ["Entrevistas", "RedeDeContatos"] },
    { id: 15, nome: "Mochileiro", descricao: "Você viajou por todo o mundo, tendo tido inúmeras vivências incríveis, conhecendo povos por todo o globo e participando das mais imagináveis celebrações. Graças a isso, está pronto para participar de qualquer aventura ou loucura que te chamarem, afinal um dia ruim acaba sempre virando uma boa história.", bonus: "", pericias: ["Sobrevivência", "Constituição", "Aprendizado"], habilidades: ["PreparoDeAbrigo", "Manual"] },
    { id: 16, nome: "Expecialista em Explosivos", descricao: "Você viveu em meio a turbulencias e fez do fogo e do caus seu refugio.", bonus: "", pericias: ["Arremeçar", "Destreza"], habilidades: ["Preparo"] },
    { id: 17, nome: "Investigador", descricao: "Você é que realiza pesquisas e investigações para apurar crimes ou outros factos. Suas funções principais incluem a coleta de evidências e provas em cenas de crime.", bonus: "", pericias: ["Percepção", "Inteligência"], habilidades: [] }
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
            bonus += `<short class="Pericia ${pericia}">${displayName}</short>`

        });

        o.habilidades.forEach(habilidade => {

            if (Habilidades != "") Habilidades += " , "
            const displayName = habilidade.replace(/([a-z])([A-Z])/g, '$1 $2');
            Habilidades += `<short class="Habilidades ${habilidade}">${displayName}</short>`

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
        Mg.style.display = "flex";

        ficha.origem.forEach(o => {
            origens[o].pericias.forEach(pericia => {
                    ficha.pericias[pericia].value += 5
                    ficha.pericias[pericia].min += 5
            });
            origens[o].habilidades.forEach(habilidade => {
                const habilidadeData = tooltipDictionary.Habilidades[habilidade];
                const nome = habilidade.replace(/([a-z])([A-Z])/g, '$1 $2');
                if (habilidadeData) {
                    addHabilidade(nome, habilidadeData.descricao, null);
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
        ficha.status.pontosDeMagiaMax += 3
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

function aa() {
    IB.style.display = "none";
    Rs.style.display = "block";
    console.log("aa")
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
        Pr.style.display = "flex";
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

    
    foco.style.display = "none";
    Mg.style.display = "none";
    Pr.style.display = "flex";
    console.log(ficha)
    perAtu()
}

//

const pId = document.getElementsByClassName("p-card")

const perIdList = {
    Lábia: pId[0],
    Aparência: pId[1],
    Intimidar: pId[2],
    Poder: pId[3],
    Sorte: pId[4],
    Força: pId[5],
    Corpo: pId[6],
    Constituição: pId[7],
    Destreza: pId[8],
    Inteligência: pId[9],
    Percepção: pId[10],
    Estabilidade: pId[11],
    ArmasBrancas: pId[12],
    Pistolas: pId[13],
    Rifles: pId[14],
    LongoAlcance: pId[15],
    Arremeçar: pId[16],
    Movimento: pId[17],
    Furtividade: pId[18],
    Esquiva: pId[19],
    Acrobacia: pId[20],
    ContraAtaque: pId[21],
    Magia: pId[22],
    Alquimia: pId[23],
    Ocultismo: pId[24],
    História: pId[25],
    Mecanica: pId[26],
    Sobrevivência: pId[27],
    Sobrevivência: pId[28],
    Música: pId[29],
    ConhecimentosGerais: pId[30],
    Línguas: pId[31],
    Medicina: pId[32],
    Ciência: pId[33],
    Aprendizado: pId[34]

}

function addPerPoint(btn, id) {

    rid = id - 1;
    const perV = getValueByIndex(ficha.pericias, rid);

    if (ficha.pontos <= 0) return;

    if (perV.value >= perV.max) return;
    
    if (!perV.editable) return;

    ficha.pontos -= 1;
    perV.value += 1;

    perAtu()
}

function removePerPoint(btn, id) {
    rid = id - 1;
    const perV = getValueByIndex(ficha.pericias, rid);

    if (perV.value <= perV.min) return;

    if (!perV.editable) return;

    ficha.pontos += 1;
    perV.value -= 1;

    perAtu()
}

const titleBox = document.getElementsByClassName("pr-title")
const prType = document.getElementsByClassName("pr-type")
const prNextBtn = document.getElementById("pr-next-btn")

function calcularPericiaCorpo() {
    // altura : 177; peso: 76// alt: 13; peso: 14 ; 27 ; 
    const pesoBase = 62;
    const alturaBase = 165;
    let corpoSkill = 1; // Base skill

    const pesoExtra = ficha.peso - pesoBase;
    const alturaExtra = ficha.altura - alturaBase;

    const corpoBase = pesoExtra + alturaExtra;

    ficha.pericias.Corpo.value = corpoBase / 3
}

function perAtu() {

    document.getElementById("ptsDisplay").innerHTML = ficha.pontos

    const perList = ficha.pericias;
    
    calcularPericiaCorpo();
    perList.Movimento.value = Math.floor((perList.Constituição.value + perList.Destreza.value + perList.Força.value) / 2 + 1);
    perList.ContraAtaque.value =  Math.floor((perList.Destreza.value + perList.Força.value + perList.Percepção.value) / 2 + 1);
    perList.Esquiva.value = Math.floor((perList.Percepção.value + perList.Destreza.value) /2 + 3);
    perList.Furtividade.value = Math.floor((perList.Constituição.value + perList.Destreza.value + perList.Estabilidade.value) /2 + 2);
    
    ficha.status.vidaMax = ficha.status.vidaMax + (ficha.pericias.Corpo.value + ficha.pericias.Constituição.value)*4
    ficha.status.vida = ficha.status.vidaMax;

    ficha.status.pontosDeMagiaMax = ficha.pericias.magia*3 + ficha.status.pontosDeMagiaMax + (ficha.status.Ocultismo/2);
    ficha.status.pontosDeMagia = ficha.status.pontosDeMagiaMax;

    ficha.status.medoMax = ficha.status.medoMax + (ficha.status.Estabilidade*2) + 10
    ficha.status.medo = ficha.status.medoMax;

    for (let i = 0; i < Object.keys(ficha.pericias).length; i++) {
        const pElement = pId[i];
        const p = getValueByIndex(ficha.pericias, i);
        
        pElement.getElementsByClassName("p-count")[0].innerHTML = p.value;
    }

    if (ficha.pontos <= 0) {
        prNextBtn.style.display = "block"
    }
}

function perShow(id, skillName) {
    // Find category
    let categoryName = "Perícia"; // Default
    for (const category in tooltipDictionary.Atributo) {
        if (tooltipDictionary.Atributo[category].pericias.includes(skillName)) {
            categoryName = category;
            break;
        }
    }

    // Find description
    const skillData = tooltipDictionary.Pericia[skillName] || {};
    const description = skillData.descricao || "";

    // Select elements to update
    const prTitleEl = document.querySelector("#Pr .pr-title");
    const prCategoryEl = document.querySelector(".pr-type");
    const prDescriptionEl = document.querySelector("#pr-description");

    // Update elements
    if(prTitleEl) prTitleEl.innerHTML = skillName.replace(/([a-z])([A-Z])/g, '$1 $2');
    if(prCategoryEl) prCategoryEl.innerHTML = categoryName;
    if(prDescriptionEl) prDescriptionEl.innerHTML = description;

    console.log(skillName, categoryName, description)
}

function getValueByIndex(obj, index) {
  const values = Object.values(obj);
  return values[index];
}

game = document.getElementById("game")

function FichaEnd() {
    Pr.style.display = "none";
    elementos.style.display = "none";
    cF.style.display = "none";
    game.style.display = "flex";

    
    displayPericias();
}

function displayPericias() {
    const periciasContainer = document.getElementById('pericias-display');
    if (!periciasContainer) return;
    periciasContainer.innerHTML = ''; 

    const categories = tooltipDictionary.Atributo;

    for (const categoryName in categories) {
        const categoryData = categories[categoryName];
        
        // Create category block
        const pBlock = document.createElement('div');
        pBlock.className = 'pBlock';

        // Create title
        const pbTitle = document.createElement('div');
        pbTitle.className = 'pb-title';
        const titleText = document.createElement('p');
        titleText.className = 'text';
        titleText.style.fontWeight = 'bold';
        titleText.style.fontSize = '1.2em';
        titleText.textContent = categoryName;
        pbTitle.appendChild(titleText);
        pBlock.appendChild(pbTitle);

        // Add skills for the category
        categoryData.pericias.forEach(periciaName => {
            if (ficha.pericias[periciaName]) {
                const pericia = ficha.pericias[periciaName];
                const periciaElement = document.createElement('div');
                periciaElement.className = 'p-card';

                const nameSpan = document.createElement('span');
                nameSpan.textContent = periciaName.replace(/([a-z])([A-Z])/g, '$1 $2');
                periciaElement.appendChild(nameSpan);

                const nbrDiv = document.createElement('div');
                nbrDiv.className = 'nbr';

                const valueSpan = document.createElement('span');
                valueSpan.className = 'p-count';
                valueSpan.textContent = pericia.value;
                nbrDiv.appendChild(valueSpan);

                const rollBtn = document.createElement('button');
                rollBtn.className = 'btn roll-pericia-btn';
                rollBtn.textContent = 'Rolar';
                rollBtn.onclick = () => {
                    diceInput.value = `1d20`;
                    rollDice(pericia.value);
                }
                nbrDiv.appendChild(rollBtn);
                
                periciaElement.appendChild(nbrDiv);
                pBlock.appendChild(periciaElement);
            }
        });

        periciasContainer.appendChild(pBlock);
    }
}

function irParaJogo() {
    const cF = document.getElementById("cF");
    const game = document.getElementById("game");
    const main = document.querySelector("main");

    main.style.display = "none";
    cF.style.display = "none";
    game.style.display = "flex";

    // Se a função displayPericias existir, chame-a
    if (typeof displayPericias === 'function') {
        displayPericias();
    }
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
    const biografiaFields = ['familia', 'gostos', 'desgostos', 'medos', 'contatosProximos', 'historia', 'comportamento'];
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

document.getElementById('editarPericiasBtn').addEventListener('click', () => {
    const editorBox = document.getElementById('periciasEditorBox');
    
    const editor = document.getElementById('periciasEditor');
    const statusEditor = document.getElementById('statusMaxEditor');
    
    if (editorBox.classList.contains('hidden')) {
        renderPericiasEditor();
        renderStatusMaxEditor();
        editorBox.classList.remove('hidden');
        statusEditor.classList.remove('hidden');
        editarPericiasBtn.textContent = "Salvar Edição";
    } else {
        salvarPericiasEditadas();
        salvarStatusMaxEditados();
        editorBox.classList.add('hidden');
        statusEditor.classList.add('hidden');
        editarPericiasBtn.textContent = "Editar Perícias";
    }
});

function renderPericiasEditor() {
    const editor = document.getElementById('periciasEditor');
    editor.innerHTML = '';

    for (const [nome, dados] of Object.entries(ficha.pericias)) {
        const linha = document.createElement('div');
        linha.className = 'pericia-edit';
        
        const label = document.createElement('label');
        label.textContent = nome;
        
        const input = document.createElement('input');
        input.type = 'number';
        input.min = dados.min;
        input.max = dados.max;
        input.value = dados.value;
        input.dataset.nome = nome;

        linha.appendChild(label);
        linha.appendChild(input);
        editor.appendChild(linha);
    }
}

function salvarPericiasEditadas() {
    const inputs = document.querySelectorAll('#periciasEditor input');
    inputs.forEach(input => {
        const nome = input.dataset.nome;
        const valor = parseInt(input.value) || 0;
        ficha.pericias[nome].value = valor;
    });
    document.getElementById('periciasEditorBox').classList.add('hidden');
    alert('Perícias atualizadas!');
}

// ===================== STATUS MÁXIMOS =====================

function renderStatusMaxEditor() {
    const statusEditor = document.getElementById('statusMaxEditor');
    statusEditor.innerHTML = '';

    const statusList = [
        { key: 'vidaMax', label: 'Vida Máx.' },
        { key: 'pontosDeMagiaMax', label: 'MP Máx.' },
        { key: 'medoMax', label: 'Medo Máx.' }
    ];

    statusList.forEach(({ key, label }) => {
        const linha = document.createElement('div');
        linha.className = 'status-edit';
        
        const lbl = document.createElement('label');
        lbl.textContent = label;
        
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

function enableTooltipsMobile() {
    const tooltipElems = document.querySelectorAll('short');

    tooltipElems.forEach(el => {
        el.addEventListener('click', (e) => {
            const tooltip = document.getElementById(el.dataset.tooltipId);
            if (tooltip.style.display === 'block') {
                tooltip.style.display = 'none';
            } else {
                tooltip.style.display = 'block';
                // opcional: posicionar perto do click
                const rect = el.getBoundingClientRect();
                tooltip.style.top = (rect.bottom + window.scrollY + 5) + 'px';
                tooltip.style.left = (rect.left + window.scrollX) + 'px';
            }
        });
    });

    // Fechar tooltip ao clicar fora
    document.addEventListener('click', (e) => {
        tooltipElems.forEach(el => {
            const tooltip = document.getElementById(el.dataset.tooltipId);
            if (!el.contains(e.target) && !tooltip.contains(e.target)) {
                tooltip.style.display = 'none';
            }
        });
    });
}

// Chame ao iniciar o site
enableTooltipsMobile();
