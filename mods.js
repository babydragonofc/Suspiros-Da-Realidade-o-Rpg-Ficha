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


    // PRIMEIRO abre o painel
    panelOpen(null,mod.name,html);

    // DEPOIS adiciona os listeners
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

        author: 'Babydragon',

        version: "1.0",

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