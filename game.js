window.addEventListener("message", (event) => {
    if (event.data === "GET_DATA") {
        event.source.postMessage( localStorage.getItem(ficha), event.origin);
    }
});

const fastLoginIsValid = 
localStorage.getItem('fastLogin') &&
localStorage.getItem('hasFichaSave')

fastLoginIsValid && load()

const periciasDisplayer = document.getElementById('periciasDisplayer')

const mainPanelDissolve = new PerlinDissolve( document.querySelector("#main-panel"), 1024)

function panelOpen(id, title, content, sm = false) {

    if( id == "changeLog") {
        localStorage.setItem('versãoNaUltimaVezQueViuOChangeLog', siteVersion)
        document.getElementById('changeLogBtn').classList.remove('notion')
    }
    const mainPanel = document.getElementById("main-panel");
    mainPanelDissolve.show()
    const box = mainPanel.querySelector(".box");

    // Clear previous content
    const dynamicContent = box.querySelector("#dynamic-content");
    if (dynamicContent) {
        dynamicContent.remove();
    }

    const divs = box.querySelectorAll("div[id]");
    divs.forEach(div => {
        div.style.display = "none";
    });

    if (sm) {
        box.style.width = "435px"
    }else {
        box.style.width = "100%"
    }
    if (id == "changeLog") {
        box.classList.add('changeLogBox')
    }else {
        if(box.classList.contains('changeLogBox')) box.classList.remove('changeLogBox')
    }
    const targetDiv = box.querySelector("#" + id);
    if (targetDiv) {
        targetDiv.style.display = "flex";
    } else if (title && content) {
        const newContentDiv = document.createElement("div");
        newContentDiv.id = "dynamic-content";
        newContentDiv.style.display = "flex";
        newContentDiv.innerHTML = `
            <div>
                <h2 class="title" style="font-size: 50px; color: white;">${title}</h2>
                <p class="text">${content}</p>
            </div>
        `;
        box.appendChild(newContentDiv);
    }
}

function panelClose() {
    mainPanelDissolve.hide(1400)
    const box = document.querySelector("#main-panel .box");
    const divs = box.querySelectorAll("div[id]");
    setTimeout(() => {
        divs.forEach(div => {
            div.style.display = "none";
        });
    }, 1400);

    const dynamicContent = box.querySelector("#dynamic-content");
    if (dynamicContent) {
        dynamicContent.remove();
    }
}

// Habas
function gameHabaSel(id, btn) {
    document.querySelector(".mTBtn.active").classList.remove("active")
    btn.classList.add("active")

    const contents = document.querySelectorAll('.mt-content');
    contents.forEach(content => {
        content.style.display = 'none';
    });

    const contentIds = ['magias-content', 'habilidades-content', 'inventario-content', 'dados-content', 'personagem-content', 'diario-content', 'options-content'];
    const selectedContent = document.getElementById(contentIds[id]);
    if (selectedContent) {
        selectedContent.style.display = 'flex';
    }
    
    if (contentIds[id] === 'personagem-content') {
        renderPersonagem();
    }

    document.getElementById('MobileMTBtn').innerHTML = btn.innerHTML + '<img src="img/menu.svg" alt="" class="mMTImage">';
}

// Status 
var statusModifierValue = 1;

var statusList = {
    "vida": {fill: document.getElementById('hpBarFill'), text: document.getElementById('hpValue')},
    "magia": {fill: document.getElementById('mpBarFill'), text: document.getElementById('mpValue')},
    "medo": {fill: document.getElementById('spBarFill'), text: document.getElementById('spValue')},
}

function changeStatusValue(type, status, custom = false) {

    const value = type == "+" ? statusModifierValue : -statusModifierValue;

    // =========================
    // STATUS CUSTOMIZADO
    // =========================

    if (custom) {

        const customStatus = ficha.customStatus.find(s => s.name == status);

        if (!customStatus) return;

        const statusId = customStatus.id;

        // Atualiza o valor REAL salvo
        ficha.status[statusId] += value;

        // Atualiza o valor visual
        customStatus.value = ficha.status[statusId];
        customStatus.max =
            ficha.status[statusId + "Max"];

        statusAtu();

        return;
    }

    // =========================
    // STATUS NORMAL
    // =========================

    ficha.status[status] += value;

    statusAtu();

}

function statusDef() {

    ficha.status.vidaMax = 15 + perLvl('constituição')*5
    ficha.status.magiaMax = 5 + perLvl('magia')*10
    ficha.status.medoMax = 20 + (perLvl('vontade')*10) + (perLvl('psicologia')*3)

    ficha.status.vida = ficha.status.vidaMax
    ficha.status.magia = ficha.status.magiaMax
    ficha.status.medo = ficha.status.medoMax
    
}

function statusDefPreview(cons, mag, vont, psc) {

    let preview = {}

    preview.vida = 15 + cons*5
    preview.magia = 5 + mag*10
    preview.medo = 20 + vont*10 + psc*3

    return preview;

}

function statusAtu() {
    const vidaPer = (ficha.status.vida / ficha.status.vidaMax) * 100;
    const mpPer = (ficha.status.magia / ficha.status.magiaMax) * 100;
    const spPer = (ficha.status.medo / ficha.status.medoMax) * 100
    
    statusList["vida"].fill.style.width = ficha.status.vida >= ficha.status.vidaMax? "100%" :vidaPer + "%"
    statusList["magia"].fill.style.width = ficha.status.magia >= ficha.status.magiaMax? "100%" :mpPer + "%"
    statusList["medo"].fill.style.width = ficha.status.medo >= ficha.status.medoMax? "100%" :spPer + "%"

    statusList["vida"].text.innerHTML = ficha.status.vida + "/" + ficha.status.vidaMax;
    statusList["magia"].text.innerHTML = ficha.status.magia + "/" + ficha.status.magiaMax;
    statusList["medo"].text.innerHTML = ficha.status.medo + "/" + ficha.status.medoMax;

if (ficha.customStatus.length != 0) {

    ficha.customStatus.forEach(Cstatus => {

        // Sincroniza com save
        Cstatus.value = ficha.status[Cstatus.id];

        Cstatus.max = ficha.status[Cstatus.id + "Max"];

        const percent =(Cstatus.value / Cstatus.max) * 100;

        Cstatus.fill.style.width = percent >= 100 ? "100%" : percent + "%";

        Cstatus.text.innerHTML = Cstatus.value + "/" + Cstatus.max;

    });

}
    verifyAutoSave()
}

// Mobile
function closePer() {
    periciasDisplayer.style.display = 'none';

}

function enterPer() {
    periciasDisplayer.style.display = "block"
}

const bioState = document.getElementById("bioStateBtn")
const bioContent = document.getElementById("bio-content")

var bioIsOpen = false

function ChangeBiogrMode(){
    bioIsOpen = !bioIsOpen
    bioState.innerHTML = bioIsOpen? "Abrir" : "Fechar";
    bioContent.style.display = bioIsOpen? "none": "flex";
}

const otherState = document.getElementById("otherStateBtn")
const otherContent = document.getElementById("other-content")

var otherIsOpen = false
function ChangeOtherMode(){
    otherIsOpen = !otherIsOpen
    otherState.innerHTML = otherIsOpen? "Abrir" : "Fechar";
    otherContent.style.display = otherIsOpen? "none": "flex";

    
}
const personagemContatos = document.getElementById('personagem-contatos')

//Diario
function formatDoc(command, value = null) {
    document.execCommand(command, false, value);
}

// Edição de pericias
const periciasEditorDissove = new PerlinDissolve( document.querySelector("#periciasEditorBox"), 1024);

document.getElementById('editarPericiasBtn').addEventListener('click', () => {
    renderPericiasEditor();
    renderStatusMaxEditor();
    periciasEditorDissove.show();
});

function renderPericiasEditor() {
    const editor = document.getElementById('periciasEditor');
    editor.innerHTML = '';

    normalizarPericias();
    editor.dataset.level = inferirNivelPericiasEditor();

    const wrapper = document.createElement('div');
    wrapper.className = 'pericias-pyramid-editor';

    const toolbar = document.createElement('div');
    toolbar.className = 'pericias-editor-toolbar';

    const title = document.createElement('h3');
    title.className = 'title';
    title.textContent = 'Nivel';

    const levelControls = document.createElement('div');
    levelControls.className = 'pericias-editor-level';

    const minusBtn = document.createElement('button');
    minusBtn.className = 'btn';
    minusBtn.textContent = '-';

    const levelValue = document.createElement('span');
    levelValue.id = 'periciasEditorLevelValue';
    levelValue.textContent = editor.dataset.level;

    const plusBtn = document.createElement('button');
    plusBtn.className = 'btn';
    plusBtn.textContent = '+';

    minusBtn.addEventListener('click', () => changePericiasEditorLevel(-1));
    plusBtn.addEventListener('click', () => changePericiasEditorLevel(1));

    levelControls.appendChild(minusBtn);
    levelControls.appendChild(levelValue);
    levelControls.appendChild(plusBtn);
    toolbar.appendChild(title);
    toolbar.appendChild(levelControls);
    wrapper.appendChild(toolbar);

    const content = document.createElement('div');
    content.className = 'pericias-editor-content';
    content.appendChild(criarEditorPiramide());
    content.appendChild(criarEditorListas());
    wrapper.appendChild(content);

    const feedback = document.createElement('p');
    feedback.id = 'periciasEditorFeedback';
    feedback.className = 'text sm';
    wrapper.appendChild(feedback);

    editor.appendChild(wrapper);
    preencherEditorPiramide();
    renderPericiasEditorPlaces();
}

function salvarPericiasEditadas() {
    if (!periciasEditorEstaValido()) {
        alert('A piramide de pericias ainda nao esta valida para o nivel selecionado.');
        return;
    }

    const periciasEditadas = Array.from({ length: 6 }, () => []);

    getTodasPericias().forEach(pericia => {
        periciasEditadas[0].push(pericia);
    });

    document.querySelectorAll('#periciasEditor .pericias-editor-place').forEach(place => {
        const item = place.querySelector('.item');
        if (!item) return;

        const nome = item.getAttribute('aria-value');
        const nivel = parseInt(place.dataset.nivel) || 0;
        const index = periciasEditadas[0].indexOf(nome);

        if (index !== -1) {
            periciasEditadas[0].splice(index, 1);
        }

        if (!periciasEditadas[nivel].includes(nome)) {
            periciasEditadas[nivel].push(nome);
        }
    });

    ficha.pericias = periciasEditadas;
    displayPericias();
    if (typeof save === 'function' && ficha.options?.autoSave) save(false);

    alert('Pericias atualizadas!');
    periciasEditorDissove.hide(2000);
}

function getTodasPericias() {
    const pericias = Array.isArray(ficha.pericias) ? ficha.pericias.flat().filter(Boolean) : [];

    getCategoriasPericiasBase().forEach(categoria => {
        categoria.pericias.forEach(pericia => {
            if (pericia && !pericias.includes(pericia)) {
                pericias.push(pericia);
            }
        });
    });

    return pericias;
}

function criarEditorPiramide() {
    const perPlaces = document.createElement('div');
    perPlaces.id = 'periciasEditorPlaces';

    const perGrid = document.createElement('div');
    perGrid.id = 'periciasEditorGrid';

    for (let nivel = 5; nivel >= 1; nivel--) {
        const line = document.createElement('div');
        line.className = 'perLine';

        const lineTitle = document.createElement('div');
        lineTitle.className = 'perLineTitle' + (nivel % 2 === 0 ? ' white' : '');
        lineTitle.textContent = nivel;
        line.appendChild(lineTitle);

        for (let coluna = 0; coluna < 5; coluna++) {
            const place = document.createElement('div');
            place.className = 'place pericias-editor-place';
            place.dataset.nivel = nivel;
            place.dataset.row = 5 - nivel;
            place.dataset.col = coluna;
            line.appendChild(place);
        }

        perGrid.appendChild(line);
    }

    perPlaces.appendChild(perGrid);
    return perPlaces;
}

function criarEditorListas() {
    const lists = document.createElement('div');
    lists.id = 'periciasEditorLists';
    lists.className = 'perList';
    lists.dataset.selectedCategory = selectedPericiasEditorCategory;

    const categorias = getCategoriasPericias();
    if (selectedPericiasEditorCategory >= categorias.length) selectedPericiasEditorCategory = 0;

    const header = document.createElement('header');
    const titleBox = document.createElement('section');
    titleBox.style.position = 'relative';

    const eyebrow = document.createElement('p');
    eyebrow.className = 'text';
    eyebrow.style.position = 'absolute';
    eyebrow.style.top = '-4px';
    eyebrow.textContent = 'Pericias';

    const title = document.createElement('h2');
    title.className = 'title';
    title.id = 'periciasEditorCategoryTitle';
    title.textContent = categorias[selectedPericiasEditorCategory]?.name || 'Pericias';

    titleBox.appendChild(eyebrow);
    titleBox.appendChild(title);
    header.appendChild(titleBox);

    const nav = document.createElement('div');
    const prevBtn = document.createElement('button');
    prevBtn.textContent = '<';
    prevBtn.addEventListener('click', () => selectPericiasEditorCategoria(false));

    const nextBtn = document.createElement('button');
    nextBtn.textContent = '>';
    nextBtn.addEventListener('click', () => selectPericiasEditorCategoria(true));

    nav.appendChild(prevBtn);
    nav.appendChild(nextBtn);
    header.appendChild(nav);
    lists.appendChild(header);

    categorias.forEach((categoria, index) => {
        const group = document.createElement('section');
        group.className = 'pericias-editor-group';
        group.dataset.category = categoria.id;
        group.style.display = index === selectedPericiasEditorCategory ? 'flex' : 'none';

        const itemPlace = document.createElement('div');
        itemPlace.className = 'itemPlace pericias-editor-list';
        itemPlace.dataset.category = categoria.id;
        group.appendChild(itemPlace);

        lists.appendChild(group);
    });

    return lists;
}

function preencherEditorPiramide() {
    const placesByLevel = {};
    document.querySelectorAll('#periciasEditor .pericias-editor-place').forEach(place => {
        const nivel = place.dataset.nivel;
        if (!placesByLevel[nivel]) placesByLevel[nivel] = [];
        placesByLevel[nivel].push(place);
    });

    for (let nivel = 1; nivel <= 5; nivel++) {
        const pericias = ficha.pericias[nivel] || [];
        pericias.forEach((pericia, index) => {
            const place = placesByLevel[nivel]?.[index];
            const itemPer = criarEditorItem(pericia, getCategoriaOriginalPericia(pericia))
            if (place && itemPer) place.appendChild(itemPer);
        });
    }

    const usadas = new Set(ficha.pericias.slice(1).flat());
    getCategoriasPericias().forEach(categoria => {
        const list = document.querySelector(`#periciasEditor .pericias-editor-list[data-category="${categoria.id}"]`);
        categoria.pericias.forEach(pericia => {
            if (!usadas.has(pericia)) {
                const itemPer = criarEditorItem(pericia, categoria.id)
                if (list && itemPer) list.appendChild(itemPer);
            }
        });
    });
}

function criarEditorItem(pericia, originalCategory) {
    if (!pericia) return;
    const item = document.createElement('div');
    item.className = 'item';
    item.setAttribute('aria-value', pericia);
    item.dataset.originalCategory = originalCategory || getCategoriaOriginalPericia(pericia);
    item.style.touchAction = 'none';

    const title = document.createElement('h2');
    title.textContent = formatPericiaName(pericia);
    item.appendChild(title);

    if (title.textContent.length > 11) {
        item.classList.add('small-text');
    }

    item.addEventListener('pointerdown', startPericiasEditorDrag);
    return item;
}

let periciasEditorDragItem = null;
let periciasEditorOrigin = null;
let periciasEditorPlaceholder = null;
let periciasEditorOffsetX = 0;
let periciasEditorOffsetY = 0;
let selectedPericiasEditorCategory = 0;

function startPericiasEditorDrag(event) {
    const item = event.currentTarget;
    const rect = item.getBoundingClientRect();

    periciasEditorDragItem = item;
    periciasEditorOrigin = item.parentElement;
    periciasEditorOffsetX = event.clientX - rect.left;
    periciasEditorOffsetY = event.clientY - rect.top;

    if (periciasEditorOrigin.classList.contains('pericias-editor-list')) {
        periciasEditorPlaceholder = document.createElement('div');
        periciasEditorPlaceholder.className = 'drag-placeholder';
        periciasEditorPlaceholder.style.width = `${rect.width}px`;
        periciasEditorPlaceholder.style.height = `${rect.height}px`;
        periciasEditorOrigin.insertBefore(periciasEditorPlaceholder, item);
    }

    item.style.width = `${rect.width}px`;
    item.style.height = `${rect.height}px`;
    item.style.position = 'absolute';
    item.style.left = `${rect.left}px`;
    item.style.top = `${rect.top}px`;
    item.style.zIndex = '9999';
    document.body.appendChild(item);
    item.setPointerCapture(event.pointerId);
}

document.addEventListener('pointermove', event => {
    if (!periciasEditorDragItem) return;

    periciasEditorDragItem.style.left = `${event.clientX - periciasEditorOffsetX}px`;
    periciasEditorDragItem.style.top = `${event.clientY - periciasEditorOffsetY}px`;
});

document.addEventListener('pointerup', event => {
    if (!periciasEditorDragItem) return;

    periciasEditorDragItem.style.pointerEvents = 'none';
    const target = document.elementFromPoint(event.clientX, event.clientY);
    periciasEditorDragItem.style.pointerEvents = '';

    const targetPlace = target?.closest('#periciasEditor .pericias-editor-place');
    const targetList = target?.closest('#periciasEditor .pericias-editor-list');
    const originalList = getListaOriginalPericia(periciasEditorDragItem);
    const canDropOnTargetList = targetList && targetList.dataset.category === periciasEditorDragItem.dataset.originalCategory;
    const targetContainer = targetPlace || (canDropOnTargetList ? targetList : originalList);

    if (targetPlace) {
        const occupiedItem = targetPlace.querySelector('.item');
        if (occupiedItem && occupiedItem !== periciasEditorDragItem) {
            if (periciasEditorOrigin.classList.contains('pericias-editor-place')) {
                periciasEditorOrigin.appendChild(occupiedItem);
            } else {
                moverItemParaListaOriginal(occupiedItem);
            }
            resetItemStyles(occupiedItem);
        }
    }

    targetContainer.appendChild(periciasEditorDragItem);
    resetItemStyles(periciasEditorDragItem);

    if (periciasEditorPlaceholder) {
        periciasEditorPlaceholder.remove();
        periciasEditorPlaceholder = null;
    }

    periciasEditorDragItem = null;
    periciasEditorOrigin = null;
    renderPericiasEditorPlaces();
});

function selectPericiasEditorCategoria(next) {
    const categorias = getCategoriasPericias();
    if (!categorias.length) return;

    selectedPericiasEditorCategory += next ? 1 : -1;
    if (selectedPericiasEditorCategory === categorias.length) selectedPericiasEditorCategory = 0;
    if (selectedPericiasEditorCategory === -1) selectedPericiasEditorCategory = categorias.length - 1;

    const title = document.getElementById('periciasEditorCategoryTitle');
    if (title) title.textContent = categorias[selectedPericiasEditorCategory].name;

    document.querySelectorAll('#periciasEditor .pericias-editor-group').forEach(group => {
        group.style.display = group.dataset.category === categorias[selectedPericiasEditorCategory].id ? 'flex' : 'none';
    });
}

function moverItemParaListaOriginal(item) {
    const originalList = getListaOriginalPericia(item);
    originalList.appendChild(item);
}

function getListaOriginalPericia(item) {
    const category = item.dataset.originalCategory || getCategoriaOriginalPericia(item.getAttribute('aria-value'));
    return document.querySelector(`#periciasEditor .pericias-editor-list[data-category="${category}"]`)
        || document.querySelector('#periciasEditor .pericias-editor-list');
}

function changePericiasEditorLevel(change) {
    const editor = document.getElementById('periciasEditor');
    const currentLevel = parseInt(editor.dataset.level) || 0;
    const nextLevel = Math.max(0, Math.min(levelsRules.length - 1, currentLevel + change));

    editor.dataset.level = nextLevel;
    document.getElementById('periciasEditorLevelValue').textContent = nextLevel;
    renderPericiasEditorPlaces();
}

function inferirNivelPericiasEditor() {
    const trainedCount = Array.isArray(ficha.pericias)
        ? ficha.pericias.slice(1).flat().filter(Boolean).length
        : 0;

    const inferredLevel = levelsRules.findIndex(rule => {
        const countIsValid = trainedCount >= rule.min && trainedCount <= rule.max;
        return countIsValid;
    });

    if (inferredLevel !== -1) return inferredLevel;

    return Math.max(0, Math.min(levelsRules.length - 1, level));
}

function renderPericiasEditorPlaces() {
    const editor = document.getElementById('periciasEditor');
    const editorLevel = parseInt(editor.dataset.level) || 0;
    const rule = levelsRules[editorLevel].map;
    const max = levelsRules[editorLevel].max;
    const min = levelsRules[editorLevel].min;
    let itensCount = 0;
    let validPyramid = true;

    document.querySelectorAll('#periciasEditor .pericias-editor-place').forEach(place => {
        place.classList.remove('perUsefullPlace', 'perUselessPlace');

        const row = parseInt(place.dataset.row);
        const col = parseInt(place.dataset.col);
        const isUseful = rule[row][col];
        const hasItem = Boolean(place.querySelector('.item'));

        if (isUseful) place.classList.add('perUsefullPlace');
        if (!isUseful && hasItem) {
            place.classList.add('perUselessPlace');
            validPyramid = false;
        }
        if (hasItem) itensCount++;
    });

    // Descobre o nível atual de cada perícia na pirâmide
    const periciasNivel = {};

    document.querySelectorAll('#periciasEditor .pericias-editor-place').forEach(place => {
        const item = place.querySelector('.item');
        if (!item) return;

        const nome = item.getAttribute('aria-value');
        const nivel = Number(place.dataset.nivel);

        periciasNivel[nome] = nivel;
    });

    // Gera a prévia dos status
    const preview = statusDefPreview(
        periciasNivel["constituição"] || 0,
        periciasNivel["magia"] || 0,
        periciasNivel["vontade"] || 0,
        periciasNivel["psicologia"] || 0
    );
    
    const feedback = document.getElementById('periciasEditorFeedback');
    if (!feedback) return;

    if (itensCount < min || itensCount > max || !validPyramid) {
        feedback.innerHTML = `Piramide fora da regra do nivel ${editorLevel}: use entre ${min} e ${max} pericias nas casas marcadas.<br>
        Vida: ${preview.vida}<br>
        Magia: ${preview.magia}<br>
        Medo: ${preview.medo}
        `;
        feedback.style.color = '#ff7373';
    } else {
        feedback.innerHTML = feedback.innerHTML = `
        Piramide valida para o nivel ${editorLevel}.<br>
        Vida: ${preview.vida}<br>
        Magia: ${preview.magia}<br>
        Medo: ${preview.medo}
        `;
        feedback.style.color = '#9cff9c';
    }

    
}

function periciasEditorEstaValido() {
    const editor = document.getElementById('periciasEditor');
    const editorLevel = parseInt(editor.dataset.level) || 0;
    const rule = levelsRules[editorLevel].map;
    const max = levelsRules[editorLevel].max;
    const min = levelsRules[editorLevel].min;
    let itensCount = 0;

    const invalidPlace = Array.from(document.querySelectorAll('#periciasEditor .pericias-editor-place')).some(place => {
        const row = parseInt(place.dataset.row);
        const col = parseInt(place.dataset.col);
        const hasItem = Boolean(place.querySelector('.item'));

        if (hasItem) itensCount++;
        return hasItem && !rule[row][col];
    });

    return !invalidPlace && itensCount >= min && itensCount <= max;
}

function getCategoriasPericias() {
    const categorias = getCategoriasPericiasBase().map(categoria => ({
        id: categoria.id,
        name: categoria.name,
        pericias: [...categoria.pericias]
    }));

    const periciasConhecidas = new Set(categorias.flatMap(categoria => categoria.pericias));
    const periciasExtras = Array.isArray(ficha.pericias)
        ? ficha.pericias.flat().filter(pericia => pericia && !periciasConhecidas.has(pericia))
        : [];

    if (periciasExtras.length) {
        categorias.push({
            id: 'perListExtras',
            name: 'Extras',
            pericias: [...new Set(periciasExtras)]
        });
    }

    return categorias;
}

function getCategoriasPericiasBase() {
    return [
        { name: 'Fisicas', id: 'perListFisicas', pericias: ['destreza', 'força', 'constituição', 'luta', 'pontaria'] },
        { name: 'De Armas', id: 'perListArmas', pericias: ['armas_brancas', 'pistolas', 'rifle', 'longo_alcance'] },
        { name: 'De Mobilidade', id: 'perListFisicas2', pericias: ['atletismo', 'acrobacia', 'furtividade', 'pilotagem'] },
        { name: 'Sociais', id: 'perListSociais', pericias: ['labia', 'intimidação', 'psicologia'] },
        { name: 'Investigativas', id: 'perListInvestigacao', pericias: ['percepção', 'crime', 'medicina', 'tecnologia', 'mecanica'] },
        { name: 'De Conhecimento', id: 'perListConhecimento', pericias: ['inteligencia', 'atualidades', 'ciencias', 'historia', 'profissão'] },
        { name: 'Paranormais', id: 'perListParanormal', pericias: ['vontade', 'ocultismo', 'magia', 'sobrevivencia'] }
    ];
}

function getCategoriaOriginalPericia(pericia) {
    const categoria = getCategoriasPericias().find(categoria => categoria.pericias.includes(pericia));
    return categoria ? categoria.id : 'perListExtras';
}

function normalizarPericias() {
    if (Array.isArray(ficha.pericias)) return;

    ficha.pericias = [
        getCategoriasPericiasBase().flatMap(categoria => categoria.pericias),
        [],
        [],
        [],
        [],
        []
    ];
}

function formatPericiaName(pericia) {
    return pericia
        .replace(/_/g, ' ')
        .replace(/\b\w/g, letra => letra.toUpperCase());
}

//Controles 

function registerScrollShadows() {
    document.querySelectorAll(".scroll-container").forEach(container => {    
        function updateShadows() {
            const scrollTop = container.scrollTop;
            const maxScroll = container.scrollHeight - container.clientHeight;
    
            container.classList.toggle(
                "has-top-shadow",
                scrollTop > 0
            );
    
            container.classList.toggle(
                "has-bottom-shadow",
                scrollTop < maxScroll - 1
            );
        }
    
        container.addEventListener("scroll", updateShadows);
    
        new ResizeObserver(updateShadows).observe(container);
    
        updateShadows();
    });
}

function isMobileDevice() {
  return window.matchMedia("(any-hover:none)").matches; 
}
