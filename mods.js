const modsList = document.getElementById('mods-list');

function openModsMenu() {

    renderMods();

    panelOpen("ModsPanel");

}

function importMod() {

    const input = document.getElementById('modFileInput');

    const file = input.files[0];

    if (!file) {
        alert("Selecione um arquivo JSON.");
        return;
    }

    const reader = new FileReader();

    reader.onload = function(event) {

        try {

            const mod = JSON.parse(event.target.result);

            validateMod(mod);

            // Evita duplicação
            const alreadyExists = ficha.mods.some(
                m => m.id === mod.id
            );

            if (alreadyExists) {
                alert("Esse mod já está carregado.");
                return;
            }

            ficha.mods.push(mod);

            applyMod(mod);

            renderMods();

            verifyAutoSave();

            alert("Mod carregado com sucesso.");

        } catch(err) {

            console.error(err);

            alert("Erro ao carregar mod.");

        }

    };

    reader.readAsText(file);
    input.value = '';

}

function validateMod(mod) {

    if (!mod.id) {
        throw new Error("Mod sem ID.");
    }

    if (!mod.name) {
        throw new Error("Mod sem nome.");
    }

    if (!Array.isArray(mod.skills)) {
        mod.skills = [];
    }

    if (!Array.isArray(mod.statuses)) {
        mod.statuses = [];
    }

    if (!mod.options) {
        mod.options = {};
    }

}

function applyMod(mod) {

    mod.skills.forEach(skill => {

        ficha.habilidades.push({

            name: skill.name || "Skill",

            description: skill.description || "",

            dice: skill.dice || "",

            isFavorite: false,

            modded: true,

            modId: mod.id

        });

    });

    mod.statuses.forEach(status => {

        if (ficha.status[status.id] === undefined) {
            ficha.status[status.id] = status.value || 0;
        }

        if ( ficha.status[status.id + "Max"] === undefined ) {
            ficha.status[status.id + "Max"] = status.max || 100;
        }

    });

    renderHabilidades();
    renderCustomStatuses();

}

function renderMods() {

    if (!modsList) return;

    modsList.innerHTML = '';

    if (ficha.mods.length <= 0) {

        modsList.innerHTML = `
            <p class="text">
                Nenhum mod carregado.
            </p>
        `;

        return;
    }

    ficha.mods.forEach(mod => {

        const card = document.createElement('section');

        card.className = 'mod-card';

        card.innerHTML = `

            <h2 class="title">
                ${mod.name}
            </h2>

            <p class="text">
                ${mod.description || ""}
            </p>

            <p class="text sm">
                Versão:
                ${mod.version || "1.0"}
            </p>

            <p class="text sm">
                Autor:
                ${mod.author || "Desconhecido"}
            </p>

        `;


        // =====================
        // DETAILS BUTTON
        // =====================

        const detailsBtn =
            document.createElement('button');

        detailsBtn.className = 'btn';

        detailsBtn.textContent = 'Detalhes';

        detailsBtn.onclick = () => {

            openModDetails(mod);

        };

        card.appendChild(detailsBtn);


        // =====================
        // REMOVE BUTTON
        // =====================

        const removeBtn =
            document.createElement('button');

        removeBtn.className =
            'btn delete-btn';

        removeBtn.textContent = 'Remover';

        removeBtn.onclick = () => {

            removeMod(mod.id);

        };

        card.appendChild(removeBtn);

        modsList.appendChild(card);

    });

}

function openModDetails(mod) {

    subPanel = "ModsPanel"
    let html = `

        <div class="mod-details">

            <p class="text">
                ${mod.description || ""}
            </p>

            <br>

    `;

    // =====================
    // OPTIONS
    // =====================

    if (mod.options && Object.keys(mod.options).length > 0) {

        html += `
            <h2 class="title">
                Opções
            </h2>
        `;

        Object.keys(mod.options).forEach(key => {

            html += `

                <p class="text">
                    ${key}
                </p>

                <input
                    class="input"

                    value="${mod.options[key]}"

                    onchange="
                        updateModOption(
                            '${mod.id}',
                            '${key}',
                            this.value
                        )
                    "
                >

            `;

        });

    }

    ficha.customStatus.forEach(status => {

        if (status.modId == mod.id) {

            html += `
                <div>
                    <p class="text">${status.name}</p>

                    <input
                        class="input"
                        type="number"
                        id="${status.id}maxValue"
                        value="${status.max}"
                    >
                </div>
            `;

        }

    });

    if (mod.backgrounds && mod.backgrounds.length > 0) { 
        html += `<h2 class="title">Backgrounds</h2>`;
        Object.keys(mod.backgrounds).forEach(background => {
            console.log(background, )
            html += `<button class='btn' onclick='setCustomWallpaper(${JSON.stringify(mod.backgrounds[background])})'>${mod.backgrounds[background].name}</button>`
        }); 
    }

    if (mod.itens && mod.itens.length > 0) {
        
        let content = ""

        mod.itens.forEach(el => {
            content += `
            <div>
                <section>
                    <h4>${el.name}</h4>
                    <span class='text'>${el.desc}</span>
                </section>
                <button class='btn' onclick='createItem(${el})'>Adicionar</button>
            </div>`
        });

        html+= `
        <div id='customItemList'>
            ${content}
        </div>`
        console.log(mod)
    }

    panelOpen(null,mod.name,html);

    ficha.customStatus.forEach(status => {

        if (status.modId == mod.id) {

            const input = document.getElementById(status.id + "maxValue");

            if (input) {

                input.addEventListener("change", function () {

                    ficha.status[status.id + "Max"]  = input.value;
                    console.log(input.value)

                    verifyAutoSave();
                    statusAtu();

                });

            }

        }

    });

}

function updateModOption( modId, key, value) {

    const mod = ficha.mods.find(m => m.id === modId);

    if (!mod) return;

    mod.options[key] = value;

    verifyAutoSave();

}

function removeMod(modId) {

    const confirmDelete = confirm(
        "Deseja remover este mod?"
    );

    if (!confirmDelete) return;


    // =====================
    // REMOVE HABILIDADES
    // =====================

    ficha.habilidades =
        ficha.habilidades.filter(
            h => h.modId !== modId
        );


    // =====================
    // REMOVE MOD
    // =====================

    ficha.mods =
        ficha.mods.filter(
            mod => mod.id !== modId
        );


    renderMods();

    renderHabilidades();

    renderCustomStatuses();

    verifyAutoSave();

}

function renderCustomStatuses() {

    const container =
        document.getElementById(
            'custom-status-container'
        );

    if (!container) return;

    container.innerHTML = '';

    // LIMPA antes de recriar
    ficha.customStatus = [];

    ficha.mods.forEach(mod => {

        mod.statuses.forEach(status => {

            const id = status.id;

            const name = status.name;

            // Garante valores salvos
            console.log(ficha.status[id])
            if (ficha.status[id] === undefined) {
                ficha.status[id] = status.value;
            }

            if ( ficha.status[id + "Max"] === undefined ) {
                ficha.status[id + "Max"] = status.max;
            }

            const currentValue = ficha.status[id];

            const currentMax = ficha.status[id + "Max"];

            const box = document.createElement('div');

            box.className = 'custom-status-card';
            box.innerHTML = `      
            <div class="barBlock">
                <div id="${id}Bar" class="bar">
                    <div id="${id}AfterBar" class="customAfterBar"></div>
                    <div class="barDiv"> 
                        <p id="${id}Value"></p>
                    </div>
                    <div id="${id}BarFill" class="barFill"></div>
                </div>

                <div class='statusBtns'>
                    <button class="barBtn" onclick="changeStatusValue('-', '${name}', true)"> < </button>
                    <button class="barBtn" onclick="changeStatusValue('+', '${name}', true)"> > </button>
                </div>
            </div>
            `;

            container.appendChild(box);

            const barFill =
                document.getElementById( id + "BarFill");

            const afterBar =
                document.getElementById( id + "AfterBar" );

            afterBar.style.backgroundImage = `url(${status.background})`;

            barFill.style.backgroundColor = status.fillColor;

            ficha.customStatus.push({
                name: name,
                id: id,
                fill: barFill,
                text: document.getElementById( id + "Value" ),
                value: currentValue,
                max: currentMax,
                modId: mod.id
            });

        });

    });

    statusAtu();

}

function reloadMods() {

    if (
        !ficha.mods ||
        ficha.mods.length <= 0
    ) return;

    ficha.customStatus = []

    ficha.mods.forEach(mod => {
        console.log("carregando mod " + mod.name + " ...")
        applyMod(mod);
    });

}

function downloadExampleMod() {

    const exampleMod = {

        id: "midnight_trip",

        name: "E.M.T [MOD]",

        author: 'BabyDragon_studios',

        version: "2.0",

        itens: [
            {name:"Água", type: "item", type: "item", desc:'"Uma garrafa de água comum", Recupera 3 de energia', weight: "2", data: {dice: "", type: "item", }},
            {name:"Refrigerante (lata)", type: "item", type: "item", desc:'"Açúcar e cafeína, provavelmente não é bom para a saúde", Recupera 4 de Energia. Após uma hora: -1 de Energia', weight: "2", data: {dice: "", type: "item", }},
            {name:"Refrigerante (2L)", type: "item", type: "item", desc:'"Melhor em grupo", Recupera 10 de energia dividido entre cada pessoa.', weight: "4", data: {dice: "", type: "item", }},
            {name:"Cerveja", type: "item", type: "item", desc:'"Beba com moderação", Recupera 4 de calma e 2 de energia. Após 2 unidades recebe desvantagem em testes fisicos até ter um descanço longo', weight: "2", data: {dice: "", type: "item", }},
            {name:"Destilado barato", type: "item", type: "item", desc:'"Fede a álcool", Recupera 1d6+2 de energia e 3 de calma. Ápos uma cena perde 1d8 + 3 de energia e 5 de calma. ', weight: "2", data: {dice: "1d6+2", type: "item", }},
            {name:"Energético", type: "item", type: "item", desc:'"não da assas", Recupera 10 de energia e perde 5 de calma. Após uma cena perde -5 de energia', weight: "2", data: {dice: "", type: "item", }},
            {name:"Achocolatado", type: "item", type: "item", desc:'"Doce e reconfortante", Recupera 4 de energia e 10 de calma', weight: "3", data: {dice: "", type: "item", }},
            {name:"Suco (1L)", type: "item", type: "item", desc:'"9 a cada 10 medicos recomendam", Recupera 5 de energia', weight: "3", data: {dice: "", type: "item", }},
            // === ACAMPAMENTO ===

            {name:"Cobertor", type:"item", desc:'"Protege do frio", Durante descanso: +3 de Calma.', weight:"3", data:{dice:"", type:"item", }},
            {name:"Saco de dormir", type:"item", desc:'"Descanso confortável", Durante descanso: +5 de Energia e +5 de Calma.', weight:"4", data:{dice:"", type:"item", }},
            {name:"Barraca simples (2 pessoas)", type:"item", desc:'"Abrigo básico", Durante descanso: +3 de Energia e +3 de Calma.', weight:"8", data:{dice:"", type:"item", }},
            {name:"Barraca grande (5 pessoas)", type:"item", desc:'"Abrigo confortável", Durante descanso: +5 de Energia e +5 de Calma.', weight:"12", data:{dice:"", type:"item", }},
            {name:"Repelente", type:"item", desc:'"Protege contra insetos", 5 usos. Vantagem contra doenças e picadas.', weight:"1", data:{dice:"", type:"item", }},
            {name:"Protetor solar", type:"item", desc:'"Proteção contra exposição", 5 usos.', weight:"1", data:{dice:"", type:"item", }},
            {name:"Bússola", type:"item", desc:'"Indica o norte", Uso ilimitado.', weight:"1", data:{dice:"", type:"item", }},
            {name:"Mapa da região", type:"item", desc:'"Mostra estradas e trilhas", +2 em testes de navegação.', weight:"1", data:{dice:"", type:"item", }},

            // === COMIDAS ===

            {name:"Marshmallow", type:"item", desc:'"Doce clássico de acampamento", Uso: +2 de Energia e +1 de Calma.', weight:"1", data:{dice:"", type:"item", }},

            // === MEDICINA ===

            {name:"Curativos", type:"item", desc:'"Contém 5 unidades", Cada uso: +2 de Vida.', weight:"1", data:{dice:"", type:"item", }},
            {name:"Analgésico", type:"item", desc:'"Alivia dor", Uso: +2 de Vida e +2 de Calma.', weight:"1", data:{dice:"", type:"item", }},
            {name:"Antisséptico", type:"item", desc:'"Evita infecções", 5 usos. Necessário para tratar ferimentos graves.', weight:"1", data:{dice:"", type:"item", }},
            {name:"Kit de primeiros socorros", type:"item", desc:'"Conjunto para emergências médicas", 10 usos. Cada uso: +1d6 de Vida. Em um descanso: +2 em testes médicos.', weight:"3", data:{dice:"1d6", type:"item", }},

            // === FERRAMENTAS ===

            {name:"Fita adesiva", type:"item", desc:'"Reparo improvisado", 5 usos. Permite reparar objetos simples.', weight:"1", data:{dice:"", type:"item", }},
            {name:"Corda (10m)", type:"item", desc:'"Escalada, amarração e resgate", 10 usos pesados.', weight:"3", data:{dice:"", type:"item", }},
            {name:"Canivete simples", type:"item", desc:'"Ferramenta versátil", Durabilidade: 20 usos. Dano: 2d4.', weight:"1", data:{dice:"2d4", type:"item", }},
            {name:"Alicate", type:"item", desc:'"Corta fios e abre mecanismos", 15 usos.', weight:"2", data:{dice:"", type:"item", }},
            {name:"Chave de fenda", type:"item", desc:'"Manutenção simples", 15 usos.', weight:"1", data:{dice:"", type:"item", }},
            {name:"Martelo", type:"item", desc:'"Construção ou combate", Durabilidade: 30 usos. Dano: 1d8.', weight:"3", data:{dice:"1d8", type:"item", }},
            {name:"Kit de ferramentas", type:"item", desc:'"Conjunto completo", +2 em testes de reparo. 20 usos.', weight:"5", data:{dice:"", type:"item", }},

            // === FUMANTES ===

            {name:"Cigarro (12 unidades)", type:"item", desc:'"Cada cigarro possui 1 uso", Uso: +2 de Calma e -1 de Energia.', weight:"1", data:{dice:"", type:"item", }},
            {name:"Isqueiro", type:"item", desc:'"Acende fogo facilmente", 20 usos. Após acabar os usos: quebra.', weight:"1", data:{dice:"", type:"item", }},
            {name:"Caixa de fósforos", type:"item", desc:'"Contém 10 fósforos", 10 usos.', weight:"1", data:{dice:"", type:"item", }},

            // === VEÍCULO ===

            {name:"Combustível (5L)", type:"item", desc:'"Permite continuar a viagem"', weight:"5", data:{dice:"", type:"item", }},
            {name:"Galão vazio", type:"item", desc:'"Armazena até 5L de combustível"', weight:"2", data:{dice:"", type:"item", }},
            {name:"Cabo de bateria", type:"item", desc:'"Permite ligar veículos descarregados", 10 usos.', weight:"2", data:{dice:"", type:"item", }},
            {name:"Macaco hidráulico", type:"item", desc:'"Troca pneus e levanta veículos", 20 usos.', weight:"5", data:{dice:"", type:"item", }},
            {name:"Pneu usado", type:"item", desc:'"Substitui pneu danificado", 1 uso.', weight:"10", data:{dice:"", type:"item", }},
            {name:"Gerador portátil", type:"item", desc:'"Fornece energia elétrica", 8 horas de uso por carga.', weight:"8", data:{dice:"", type:"item", }},

            // === INGREDIENTES ===

            {name:"Carne (Ruim)", type:"item", desc:'"Usado na cozinha"', weight:"2", data:{dice:"", type:"item", }},
            {name:"Carne (Comum)", type:"item", desc:'"Usado na cozinha"', weight:"2", data:{dice:"", type:"item", }},
            {name:"Carne (Boa)", type:"item", desc:'"Usado na cozinha"', weight:"2", data:{dice:"", type:"item", }},

            {name:"Vegetais (Ruim)", type:"item", desc:'"Usado na cozinha"', weight:"1", data:{dice:"", type:"item", }},
            {name:"Vegetais (Comum)", type:"item", desc:'"Usado na cozinha"', weight:"1", data:{dice:"", type:"item", }},
            {name:"Vegetais (Boa)", type:"item", desc:'"Usado na cozinha"', weight:"1", data:{dice:"", type:"item", }},

            {name:"Massa (Ruim)", type:"item", desc:'"Usado na cozinha"', weight:"2", data:{dice:"", type:"item", }},
            {name:"Massa (Comum)", type:"item", desc:'"Usado na cozinha"', weight:"2", data:{dice:"", type:"item", }},
            {name:"Massa (Boa)", type:"item", desc:'"Usado na cozinha"', weight:"2", data:{dice:"", type:"item", }},

            {name:"Frutas (Ruim)", type:"item", desc:'"Usado na cozinha"', weight:"1", data:{dice:"", type:"item", }},
            {name:"Frutas (Comum)", type:"item", desc:'"Usado na cozinha"', weight:"1", data:{dice:"", type:"item", }},
            {name:"Frutas (Boa)", type:"item", desc:'"Usado na cozinha"', weight:"1", data:{dice:"", type:"item", }},

            {name:"Temperos (Ruim)", type:"item", desc:'"Usado na cozinha"', weight:"1", data:{dice:"", type:"item", }},
            {name:"Temperos (Comum)", type:"item", desc:'"Usado na cozinha"', weight:"1", data:{dice:"", type:"item", }},
            {name:"Temperos (Boa)", type:"item", desc:'"Usado na cozinha"', weight:"1", data:{dice:"", type:"item", }},

            // === ELETRÔNICOS ===

            {name:"Rádio", type:"item", desc:'"Recebe transmissões", Necessita pilhas. Pode captar sinais estranhos.', weight:"2", data:{dice:"", type:"item", }},
            {name:"Walkman", type:"item", desc:'"Toca fitas cassete", Necessita pilhas.', weight:"1", data:{dice:"", type:"item", }},
            {name:"Walkman (para o Roy)", type:"item", desc:'"Faz o Roy sofrer emocionalmente"', weight:"1", data:{dice:"", type:"item", }},
            {name:"Pilhas (x2)", type:"item", desc:'"Alimentam aparelhos", 5 horas de uso.', weight:"1", data:{dice:"", type:"item", }},
            {name:"Bateria grande", type:"item", desc:'"Fonte de energia robusta", 10 horas de uso.', weight:"4", data:{dice:"", type:"item", }},
            {name:"Power Bank", type:"item", desc:'"Carrega eletrônicos", 5 cargas.', weight:"2", data:{dice:"", type:"item", }},
            {name:"Lanterna (pilha)", type:"item", desc:'"Iluminação portátil", Necessita pilhas. 5 horas de uso.', weight:"2", data:{dice:"", type:"item", }},
            {name:"Lanterna (bateria)", type:"item", desc:'"Mais resistente", 10 horas de uso.', weight:"3", data:{dice:"", type:"item", }},
            {name:"Gravador de voz", type:"item", desc:'"Grava sons e conversas", 20 gravações.', weight:"2", data:{dice:"", type:"item", }},
        ],

        description:
            "MOD OFICIAL DA CAMPANHA Eternal Midnight Trip.",

        skills: [],

        statuses: [

            {
                id: "cm",
                name: "Calma",
                max: 60,
                value: 60,
                background:"https://i.imgur.com/KjoMoq3.png",
                fillColor: "#57e389ff"
            },
            {
                id: "en",
                name: "Energia",
                max: 15,
                value: 15,
                background:"https://i.imgur.com/ykWerrn.png",
                fillColor: "#c061cbff"
            }

        ],

        backgrounds: [{
            "name": "Teste",
            "bg": "img/backgrounds/wallpaperSangue.png",
            "main":"white",
            "sec": "black",
            "btnBg": "rgb(239, 239, 239)",
            "btnHvr": "rgb(205, 205, 205)",
            "btnTx": "black",
            "ter": "#c1c1c1",
            "uTb": "",
            "sc": "#CB0E09"
        }],

        options: {}

    };

    const blob = new Blob(
        [
            JSON.stringify(
                exampleMod,
                null,
                4
            )
        ],
        {
            type: "application/json"
        }
    );

    const a =
        document.createElement('a');

    a.href =
        URL.createObjectURL(blob);

    a.download =
        "example_mod.json";

    a.click();

}