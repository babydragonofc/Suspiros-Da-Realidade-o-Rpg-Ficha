if (localStorage.getItem('versãoNaUltimaVezQueViuOChangeLog') != siteVersion) {
    document.getElementById('changeLogBtn').classList.add('notion')
}

let fichaComPericiasAntigas = false;
const changeLog = [
    {
        title: "Pequenas correções",
        version: "1.1.3.2",
        release: "22/08/2026",
        content: "De volta às atualizações, mudanças nos mods e pequenas correções.",
        changes: {
            add: [
                "Sistema de Itens personalizados",
                "Créditos. Veja as pessoas incríveis que ajudaram nesse projeto.",
                "Mana substituida por Energia",
                '"pericias Paranormais" renomeadas para "pericias Mentais"'
            ],
            remove: [
                "Remoção da opção de perícias para dados",
            ],
            fixes: [
                "Nomes de opções de Dados corrigidos",
                "Leitura do valor do status de Medo melhorada",
                "Melhoria no codigo de criação de item",
                "Correção na edição de status"
            ]
        },
        notes: ""
    },
    {
        title: "Pequenas correções",
        version: "1.1.3.1",
        release: "06/07/2026",
        content: "Pequenas correções no codigo.",
        changes: {
            add: [

            ],
            remove: [

            ],
            fixes: [
                "Correção no bonus de pericias não treinadas",
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
                "Nova opção de login rapido"
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
    div.classList = "versionPanel"

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