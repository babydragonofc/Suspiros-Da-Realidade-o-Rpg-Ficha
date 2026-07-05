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

function normalizeDictionaryKey(value) {
    return String(value)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "")
        .toLowerCase();
}

function findDictionaryEntry(category, key) {
    const categoryDictionary = tooltipDictionary[category] || {};

    if (categoryDictionary[key]) {
        return { key, data: categoryDictionary[key] };
    }

    const normalizedKey = normalizeDictionaryKey(key);
    const resolvedKey = Object.keys(categoryDictionary).find(
        dictionaryKey => normalizeDictionaryKey(dictionaryKey) === normalizedKey
    );

    return {
        key: resolvedKey || key,
        data: resolvedKey ? categoryDictionary[resolvedKey] : {}
    };
}

function getTooltipContentKey(element) {
    const classes = Array.from(element.classList);
    return element.dataset.key || classes.slice(1).join("");
}

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
            const conteudo = getTooltipContentKey(el);
            const tooltipEntry = findDictionaryEntry(categoria, conteudo);

            const data = tooltipEntry.data;
            const descricao = data.descricao || `Informações adicionais sobre ${conteudo}.`;

            if (categoria === 'Pericia' && scope === rightTooltip) {
                periciaTooltip.textContent = descricao;
                const rect = el.getBoundingClientRect();
                periciaTooltip.style.display = 'block';
                periciaTooltip.style.left = rect.right + 5 + 'px';
                periciaTooltip.style.top = rect.top + 'px';
                return; // Não mostra o tooltip principal para perícias na lista
            }

            tooltip.querySelector(".title").textContent = tooltipEntry.key.replace(/([a-z])([A-Z])/g, '$1 $2');
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
                        shortEl.className = 'Pericia';
                        shortEl.dataset.key = p;
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
            if (tooltip && !el.contains(e.target) && !tooltip.contains(e.target)) {
                tooltip.style.display = 'none';
            }
        });
    });
}

// Inicializa tooltips para elementos já existentes
initTooltips(document);
// Chame ao iniciar o site
enableTooltipsMobile();
