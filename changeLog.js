if (localStorage.getItem('versãoNaUltimaVezQueViuOChangeLog') != siteVersion) {
    document.getElementById('changeLogBtn').classList.add('aviso-novidade')
}

let fichaComPericiasAntigas = false;

//LEMBRAR DE TROCAR A VERSÃO EM rules.js! Tapada
const changeLog = [
    {
        title: "Condições na ficha e criador de fundos",
        version: "1.1.5.2",
        release: "28/11/2026",
        content: "As condições agora ficam na ficha, com ou sem sala, e ficou fácil criar novos fundos com as suas cores.",
        changes: {
            add: [
                "Botão Condições perto dos status: ver, adicionar e remover condições do personagem, com descrição e turnos, mesmo sem estar em uma sala",
                "As condições aparecem como etiquetas embaixo dos status, com a descrição ao passar o mouse",
                "Em uma sala, o mestre vê e edita as condições pela ficha do jogador, e o jogador vê as mudanças na hora",
                "Criador de fundos (Opções → Papel de Parede → + Criar fundo): escolha a imagem (endereço ou arquivo), ajuste as cores com seletores e veja a prévia ao vivo",
                "Sugerir cores pela imagem: o site propõe cor principal, de detalhes e de destaque a partir do fundo",
                "As cores dos botões são calculadas sozinhas a partir da cor principal, com opção de ajuste manual",
                "Fundos criados ficam salvos na ficha, podem ser editados e excluídos, e têm código para copiar e importar",
                "Os botões de fundo de Opções são gerados pela lista `fundos` em options.js: para um fundo fixo novo, basta acrescentar um item lá"
            ],
            remove: [
                "A aba Minhas condições da Sala, trocada pelo botão Condições perto dos status"
            ],
            fixes: [
                "As condições de salas antigas são movidas automaticamente para a ficha do jogador quando o mestre abre a sala",
                "Mensagens mais claras quando o navegador não é mais reconhecido como mestre de uma sala antiga",
                "Mod com fundo personalizado não gera mais erro no celular com perícias translúcidas"
            ]
        },
        notes: "Salas criadas antes do código de mestre: se o navegador perder o acesso, crie o campo \"segredo\" (8 a 16 letras e números) em rooms/CÓDIGO no Firebase e use-o em \"Entrar com código de mestre\"."
    },
    {
        title: "Sincronização, avisos e condições",
        version: "1.1.5.1",
        release: "28/11/2026",
        content: "PV e PE param de voltar sozinhos, os avisos ficaram iguais em todo o site e o jogador pode cuidar das próprias condições.",
        changes: {
            add: [
                "Aba \"Minhas condições\" na Sala: o jogador vê, adiciona e remove as próprias condições, com descrição e contagem de turnos",
                "Itens do inventário abrem em um painel destacado por cima dos outros, sem mexer na grade",
                "Peso, tipo, dano e descrição aparecem direto no item aberto",
                "Sistema único de notificações, com cores por tipo (sucesso, aviso, erro e informação), botão de fechar e empilhamento"
            ],
            remove: [
                "Caixas de alerta do navegador (alert) e o aviso antigo de atualização do save, substituídos pelas novas notificações"
            ],
            fixes: [
                "PV, PE e outros campos não voltam mais ao valor antigo quando o mestre e o jogador mexem na ficha ao mesmo tempo",
                "Ajustes de PV, PE e MD feitos pelo mestre agora são aplicados sobre a ficha mais recente do jogador",
                "Ao reabrir o site, a ficha da sala vence a cópia velha salva no navegador, e a cópia local é atualizada quando o mestre edita",
                "Inventário e Guardados respeitam a altura da área principal e rolam por dentro, sem crescer sem limite",
                "Avisos repetidos deixam de se acumular na tela"
            ]
        },
        notes: "Para as condições do jogador funcionarem, publique o database.rules.json atualizado no Firebase (Realtime Database → Regras)."
    },
    {
        title: "Salas e Biblioteca de Itens",
        version: "1.1.5.0",
        release: "23/11/2026",
        content: "Chegaram as Salas online, a Biblioteca de Itens e muitas melhorias para o mestre.",
        changes: {
            add: [
                "Salas online: o mestre cria uma sala e os jogadores entram com um código",
                "Cards rápidos dos jogadores com Nome, PV, PE e MD, com destaque para vida baixa e medo alto",
                "O mestre pode abrir e editar toda a ficha do jogador (inventário, magias, habilidades, traumas e mais)",
                "Histórico de rolagens da sala, rolagem secreta do mestre e rolagem anônima do jogador",
                "Mesa de itens: o mestre coloca itens na mesa e os jogadores podem pegar e devolver",
                "Entrega de itens direto de um jogador para outro",
                "Iniciativa da sala, com turnos e rodadas",
                "Condições (Queimando, Sangrando, Caído, Delirando e outras) com descrição e contagem de turnos",
                "NPCs com PV, PE, MD e condições, que podem entrar na iniciativa",
                "Presets de itens, rituais, habilidades e NPCs para o mestre",
                "Código de mestre para mestrar a mesma sala em mais de um aparelho",
                "Biblioteca de Itens: cards com todos os itens prontos, para adicionar direto ou ver mais informações antes",
                "Presets de munição: bala e cartucho para pistola, rifle e longo alcance",
                "Aba Criar e Biblioteca na criação de itens"
            ],
            remove: [
                "Mensagem de aniversário removida"
            ],
            fixes: [
                "Correção dos erros de ortografia e acentuação em vários textos do site",
                "Correção do tipo das armas de longo alcance, que não aceitavam munição",
                "Correção do painel de itens, que abria no lugar de outros painéis",
                "Correção da lista de perícias Sociais no editor de perícias (Conversação)",
                "Itens comuns da biblioteca não rolam mais um dado vazio ao serem usados"
            ]
        },
        notes: "A sala depende do Firebase configurado; fichas e salas antigas continuam funcionando."
    },
    {
        title: "PLAY TEST",
        version: "1.1.4.3",
        release: "27/09/2026",
        content: "Correções para o play test.",
        changes: {
            add: [
                "Regras do Play test já disponíveis!",
            ],
            remove: [
                ""
            ],
            fixes: [
                "Correção na descrição da Origem Abandonado",
                "Correção na escolha de Origem.",
                "Correção na aba Personagens"
            ]
        },
        notes: ""
    },
    {
        title: "Pequenas correções",
        version: "1.1.4.2",
        release: "16/09/2026",
        content: "Pequenas correções e melhorias.",
        changes: {
            add: [
                "Nova aba de Vantagens",
                "Perícias com um novo visual"
            ],
            remove: [
                "Diário removido novamente"
            ],
            fixes: [
                "Agora as perícias mostram os dados do nível",
                "Outras pequenas correções do código."
            ]
        },
        notes: "atualização de descrições e imagens em desenvolvimento"
    },
    {
        title: "Pequenas correções",
        version: "1.1.4.1",
        release: "14/09/2026",
        content: "Grande atualização do sistema. Raças e muito mais.",
        changes: {
            add: [
                "Adição da perícia Sorte"
            ],
            remove: [

            ],
            fixes: [
                "Correção da troca de Lábia para Conversação",                
            ]
        },
        notes: "atualização de descrições e imagens em desenvolvimento"
    },
    {
        title: "Pequenas correções",
        version: "1.1.4.0",
        release: "09/09/2026",
        content: "Grande atualização do sistema. Raças e muito mais.",
        changes: {
            add: [
                "Raças adicionadas!",
                "Origens trocadas por Ocupações",
                "Novo sistema de Origens",
                "Novo sistema de rolagens",
                "Adicionados Valores: Defesa ativa, Reflexos e Deslocamento"
            ],
            remove: [
                "Troca de perícias, Profissão -> Burocracia, Lábia -> Conversação, inteligência -> Pesquisar",
                "Fim do multi-classe", 
                "Adicionada escolha de perícia bônus em algumas Ocupações"
            ],
            fixes: [
                "Prévia de Energia adicionada na edição de perícias",
                "Correção na cor do status Energia",
                "Volta das raças funcionais",
                "Correção de formatação nos textos de perícias de Ocupações",
                "Novas descrições às Ocupações",
                
            ]
        },
        notes: "atualização de descrições e imagens em desenvolvimento"
    },
    {
        title: "Pequenas correções",
        version: "1.1.3.2",
        release: "03/09/2026",
        content: "De volta às atualizações, mudanças nos mods e pequenas correções.",
        changes: {
            add: [
                "Sistema de Itens personalizados",
                "Créditos. Veja as pessoas incríveis que ajudaram nesse projeto.",
                "Mana substituída por Energia",
                '"perícias Paranormais" renomeadas para "perícias Mentais"'
            ],
            remove: [
                "Remoção da opção de perícias para dados",
            ],
            fixes: [
                "Nomes de opções de Dados corrigidos",
                "Leitura do valor do status de Medo melhorada",
                "Melhoria no código de criação de item",
                "Correção na edição de status"
            ]
        },
        notes: ""
    },
    {
        title: "Pequenas correções",
        version: "1.1.3.1",
        release: "06/07/2026",
        content: "Pequenas correções no código.",
        changes: {
            add: [

            ],
            remove: [

            ],
            fixes: [
                "Correção no bônus de perícias não treinadas",
                "Correção na bonificação de fichas antigas"
            ]
        },
        notes: ""
    }
    ,{
        title: "Primeira Grande Atualização",
        version: "1.1.3",
        release: "04/07/2026",
        content: "A primeira grande atualização da interface, das perícias e dos sistemas gerais.",
        changes: {
            add: [
                "Novo sistema de perícias em pirâmide",
                "Novas perícias",
                "Aba de atualizações na tela inicial",
                "Aba de créditos na tela inicial",
                "Novos estilos na criação de fichas",
                "Novos estilos de texto",
                "Novas animações nos itens",
                "Novas animações nas abas",
                "Nova opção de login rápido"
            ],
            remove: [
                "Remoção do antigo sistema de perícias",
                "Remoção de algumas perícias",
                "Remoção da opção de perícias para dados"
            ],
            fixes: [
                "Correção do fluxo de criação de fichas",
                "Correção do versionamento",
                "Correção do tamanho das listas de habilidades e rituais"
            ]
        },
        notes: "Atualizações planejadas: vínculo, criação rápida de itens, maior suporte para mods, mais opções de criação de fichas, melhorias na criação de habilidades e rituais, fotos dinâmicas e muito mais."
    }
];

document.querySelector('#changeLog header .ver').textContent = "Versão : " + siteVersion

const changeLogDiv = document.getElementById('changeLog')

changeLog.forEach(ver => {

    //AAAAAAAAAAAAAAAAAAAA ESSA MERDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
    const div = document.createElement('section')
    div.classList = "painel-versao"

    // header
    const header = document.createElement('header')

        const title = document.createElement('h2')
        title.classList = "small-title"
        title.textContent = ver.title

        const verDisplay = document.createElement('section')
        verDisplay.classList = "verDisplay"

            const verDisplayVersion = document.createElement('span')
            verDisplayVersion.classList = "verDisplayVersion text"
            verDisplayVersion.textContent = ver.version

            const verDisplayDate = document.createElement('span')
            verDisplayDate.classList = "verDisplayDate text"
            verDisplayDate.textContent = ver.release

        verDisplay.appendChild(verDisplayVersion)
        verDisplay.appendChild(verDisplayDate)

    header.appendChild(title)
    header.appendChild(verDisplay)
    div.appendChild(header)

    const line = document.createElement('hr')
    div.appendChild(line)

    //content

    const content = document.createElement('span')
    content.classList = "contentText text"
    content.textContent = ver.content
    
    div.appendChild(content)

    //changes

    const changesContainer = document.createElement('section')
    changesContainer.classList = "changesContainer"
        ver.changes.add.forEach(add => {
            const span = document.createElement('span')
            span.classList = "addition"
            span.textContent = "+ " + add
            changesContainer.appendChild(span)
        });
        ver.changes.remove.forEach(rem => {
            const span = document.createElement('span')
            span.classList = "removal"
            span.textContent = "- " + rem
            changesContainer.appendChild(span)
        });
        ver.changes.fixes.forEach(fix => {
            const span = document.createElement('span')
            span.classList = "fixes"
            span.textContent = "# " + fix
            changesContainer.appendChild(span)
        });
    div.appendChild(changesContainer)

    changeLogDiv.appendChild(div)
    // note

    const note = document.createElement("span")
    note.classList = "sm text" 
    note.textContent = ver.notes
    div.appendChild(note)

});

//Protegam as crianças trans
//todas as crianças na vdd, né?

//         ^
//bizzarro |