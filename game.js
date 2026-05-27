var valueChanger = 1;
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Roll {
    D20() {
        return getRandomNumber(1, 20);
    }

    D6() {
        return getRandomNumber(1, 6);
    }

    D4() {
        return getRandomNumber(1, 4);
    }

    D8() {
        return getRandomNumber(1, 8);
    }

    D10() {
        return getRandomNumber(1, 10);
    }

    D12() {
        return getRandomNumber(1, 12);
    }

    D100() {
        return getRandomNumber(1, 100);
    }    
}

// Tabela de dificuldades
const tabelaPericia = {
    1:  { N: 20, B: null, E: null },
    2:  { N: 19, B: 20, E: null },
    3:  { N: 18, B: 20, E: null },
    4:  { N: 17, B: 19, E: null },
    5:  { N: 16, B: 19, E: 20 },
    6:  { N: 15, B: 18, E: 20 },
    7:  { N: 14, B: 18, E: 20 },
    8:  { N: 13, B: 17, E: 20 },
    9:  { N: 12, B: 17, E: 20 },
    10: { N: 11, B: 16, E: 19 },
    11: { N: 10, B: 16, E: 19 },
    12: { N: 9,  B: 15, E: 19 },
    13: { N: 8,  B: 15, E: 19 },
    14: { N: 7,  B: 14, E: 19 },
    15: { N: 6,  B: 14, E: 18 },
    16: { N: 5,  B: 13, E: 18 },
    17: { N: 4,  B: 13, E: 18 },
    18: { N: 3,  B: 12, E: 18 },
    19: { N: 2,  B: 12, E: 18 },
    20: { N: 1,  B: 11, E: 17 }
};

// Função para verificar resultado
function verificarResultado(valorRolagem, valorHabilidade) {
    const niveis = tabelaPericia[valorHabilidade];
    if (!niveis) return { type: "Inválido", value: valorRolagem };

    if (niveis.E && valorRolagem >= niveis.E) return { type: "Extremo", value: valorRolagem };
    if (niveis.B && valorRolagem >= niveis.B) return { type: "Bom", value: valorRolagem };
    if (niveis.N && valorRolagem >= niveis.N) return { type: "Normal", value: valorRolagem };

    return { type: "Falha", value: valorRolagem };
}


const nmb = document.getElementById("nmb");
const nmbW = document.getElementById('nmbW');
const nbmType = document.getElementById("nbmType")
const roll = new Roll(); // cria uma instância da classe
const diceInput = document.getElementById("diceInput");
const diceDiv = document.getElementById("dice-div")
const diceDivShow =document.querySelector("#dice-div div")


function rollDice(per, damage = false) {

    const diceString = diceInput.value;
    const multiplierRegex = /^(\d+)\*d(\d+)$/i;
    const multiplierMatch = diceString.match(multiplierRegex);

    if (multiplierMatch) {
        const maxDice = parseInt(multiplierMatch[1]);
        const sides = parseInt(multiplierMatch[2]);
        openDiceMultiplierPanel(maxDice, sides);
        return;
    }
    
    const diceRegex = /^((\d+d\d+)|(\d+))(\s*\+\s*((\d+d\d+)|(\d+)))*$/i;

    if (!diceRegex.test(diceString)) {
        nmb.textContent = "Formato de dado inválido. Use o formato [quantidade]d[dado], [numero], ou [numero]*d[dado]. Ex: 1d6, 1d20+5, 4*d20";
        return;
    }

    const parts = diceString.split('+');
    let total = 0;

    for (const part of parts) {
        const trimmedPart = part.trim();
        const diceMatch = trimmedPart.match(/(\d+)d(\d+)/i);

        if (diceMatch) {
            const quantity = parseInt(diceMatch[1]);
            const sides = parseInt(diceMatch[2]);
            for (let i = 0; i < quantity; i++) {
                total += getRandomNumber(1, sides);
            }
        } else {
            total += parseInt(trimmedPart);
        }
    }

    if (per) {
        var type = verificarResultado(total, per).type
        nbmType.textContent = total != 1? type : "Dessastre";
        nbmType.style.color = type == "Extremo" ? "purple" : type == "Bom" ? "green" : type == "Normal" ? "white" : total == 1 ? "red" : "gray";
    } else {
        nbmType.style.color = "white"
        nbmType.textContent = "--";
        if (damage) { 
            nbmType.textContent = "de Dano"; 
            diceDivShow.style.background = "linear-gradient(90deg, rgba(2, 0, 36, 0) 0%, rgb(128, 16, 16) 50%, rgba(0, 0, 0, 0) 100%)";
        }
    }

    nmb.textContent = total;
    diceDiv.style.opacity = "1"
    diceDiv.style.pointerEvents = "all"
    setTimeout(()=> {
        nmbW.style.opacity = "1"
    }, 3000)

    return {value: total, type: type};
}

var hideDiceResultBlocked = false

function hideDiceResult(priority = false) {
    if (hideDiceResultBlocked && !priority) return;
    nmbW.style.opacity = "0"
    diceDiv.style.opacity = "0"
    diceDiv.style.pointerEvents = "none"
    setTimeout(() => {
        diceDivShow.style.background = "linear-gradient(90deg, rgba(2, 0, 36, 0) 0%, rgb(0, 0, 0) 50%, rgba(0, 0, 0, 0) 100%)";
    }, 500);

}

function openDiceMultiplierPanel(maxDice, sides) {
    const panel = document.getElementById('dice-multiplier-panel');
    const optionsContainer = document.getElementById('dice-multiplier-options');
    optionsContainer.innerHTML = '';

    for (let i = 1; i <= maxDice; i++) {
        const button = document.createElement('button');
        button.className = 'btn';
        button.textContent = `${i} dado(s)`;
        button.onclick = () => {
            rollMultiplierDice(i, sides);
            closeDiceMultiplierPanel();
        };
        optionsContainer.appendChild(button);
    }

    panel.style.display = 'flex';
}

function rollMultiplierDice(quantity, sides) {
    let total = 0;
    for (let i = 0; i < quantity; i++) {
        total += getRandomNumber(1, sides);
    }
    nmb.textContent = total;
}

function closeDiceMultiplierPanel() {
    const panel = document.getElementById('dice-multiplier-panel');
    panel.style.display = 'none';
}


function panelOpen(id, title, content) {
    const mainPanel = document.getElementById("main-panel");
    mainPanel.style.display = "flex";
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
    document.getElementById("main-panel").style.display = "none";
    const box = document.querySelector("#main-panel .box");
    const divs = box.querySelectorAll("div[id]");
    divs.forEach(div => {
        div.style.display = "none";
    });

    const dynamicContent = box.querySelector("#dynamic-content");
    if (dynamicContent) {
        dynamicContent.remove();
    }
}

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

    (id, selectedContent)
    if (id === 5) { // Personagem tab
        renderPersonagem();
    }
}

const magiasContent = document.getElementsByClassName('magias-content')[0];

function renderMagias() {
    magiasContent.innerHTML = ''; // Clear existing cards

    // Sort magias: favorites first
    const sortedMagias = [...ficha.magias].sort((a, b) => {
        if (a.isFavorite && !b.isFavorite) return -1;
        if (!a.isFavorite && b.isFavorite) return 1;
        return 0;
    });

    sortedMagias.forEach(magic => {
        const box = document.createElement('div');
        box.className = "magic-card";
        if (magic.isFavorite) {
            box.classList.add('favorited'); // Add a class for styling favorited items
        }

        const magicNameEl = document.createElement('h2');
        magicNameEl.className = "title";
        magicNameEl.style.color = "white";
        magicNameEl.textContent = magic.name;
        box.appendChild(magicNameEl);

        // Add favorite star icon
        const favoriteStar = document.createElement('span');
        favoriteStar.className = 'favorite-star';
        favoriteStar.innerHTML = '&#9733;'; // Unicode star character
        if (magic.isFavorite) {
            favoriteStar.style.display = "block";
        } else {
            favoriteStar.style.display = "none";
        }
        box.appendChild(favoriteStar);

        if (magic.dice) {
            const rollBtn = document.createElement('button');
            rollBtn.className = 'btn';
            rollBtn.textContent = 'Rolar';
            rollBtn.onclick = (e) => {
                e.stopPropagation();
                diceInput.value = magic.dice;
                rollDice(false);
            }
            box.appendChild(rollBtn);
        }

        box.addEventListener('click', () => {
            showMagicInfo(magic); // Pass the entire magic object
        });

        magiasContent.appendChild(box);
    });
    verifyAutoSave()
}

const magicName = document.getElementById('magicName')
const magicDescription = document.getElementById('magicDescription')
const magicDice = document.getElementById('magicDice')

function addMagic() {
    panelOpen("MagicCreate")
    magicName.value = ""
    magicDescription.value = ""
    magicDice.value = ""
}

function createMagic(load = false) {
    const diceString = magicDice.value;
    const multiplierRegex = /^(\d+)\*d(\d+)$/i;
    const diceRegex = /^((\d+d\d+)|(\d+))(\s*\+\s*((\d+d\d+)|(\d+)))*$/i;

    if (diceString && !multiplierRegex.test(diceString) && !diceRegex.test(diceString)) {
        magicDice.style.border = "2px solid red";
        return;
    } else {
        magicDice.style.border = "";
    }

    if (!magicName.value || !magicDescription.value) return;

    const magicVar = {
        name: magicName.value,
        description: magicDescription.value,
        dice: magicDice.value,
        isFavorite: false
    };

    if (!ficha.magias.some(m => m.name === magicVar.name) && !load) {
        ficha.magias.push(magicVar);
    }

    renderMagias(); // Re-render all magic cards

    if (!load) {
        panelClose();
    }
}

function showMagicInfo(magic) { // Now accepts the magic object
    const content = `
        <p class="text">Nome:</p>
        <input type="text" id="editMagicName" class="input" value="${magic.name}">
        <p class="text">Descrição:</p>
        <textarea id="editMagicDescription" class="input" style="resize: none;">${magic.description}</textarea>
    `;
    panelOpen(null, "Editar Magia", content);

    const magicInfo = document.querySelector("#main-panel .box #dynamic-content");
    if (!magicInfo) return;

    const editMagicNameInput = document.getElementById('editMagicName');
    const editMagicDescriptionInput = document.getElementById('editMagicDescription');

    // Save Button
    const saveBtn = document.createElement('button');
    saveBtn.className = 'btn';
    saveBtn.textContent = 'Salvar';
    saveBtn.onclick = () => {
        magic.name = editMagicNameInput.value;
        magic.description = editMagicDescriptionInput.value;
        renderMagias();
        panelClose();
    };
    magicInfo.appendChild(saveBtn);

    if (magic.dice) {
        const rollBtn = document.createElement('button');
        rollBtn.className = 'btn';
        rollBtn.textContent = 'Rolar';
        rollBtn.onclick = (e) => {
            e.stopPropagation();
            diceInput.value = magic.dice;
            rollDice(false);
        }
        magicInfo.appendChild(rollBtn);
    }

    // Favorite Button
    const favoriteBtn = document.createElement('button');
    favoriteBtn.className = 'btn';
    favoriteBtn.textContent = magic.isFavorite ? 'Desfavoritar' : 'Favoritar';
    favoriteBtn.onclick = () => {
        magic.isFavorite = !magic.isFavorite;
        renderMagias(); // Re-render to update sorting and star
        panelClose(); // Close info panel after action
    };
    magicInfo.appendChild(favoriteBtn);

    // Duplicate Button
    const duplicateBtn = document.createElement('button');
    duplicateBtn.className = 'btn';
    duplicateBtn.textContent = 'Duplicar';
    duplicateBtn.onclick = () => {
        const duplicatedMagic = { ...magic, name: magic.name + " (Cópia)", isFavorite: false }; // Create a copy, change name, not favorited by default
        ficha.magias.push(duplicatedMagic);
        renderMagias(); // Re-render to show the new item
        panelClose(); // Close info panel after action
    };
    magicInfo.appendChild(duplicateBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn delete-btn';
    deleteBtn.textContent = 'Excluir';
    deleteBtn.onclick = () => {
        const magicIndex = ficha.magias.findIndex(m => m.name === magic.name); // Find by name, assuming names are unique enough for deletion
        if (magicIndex > -1) {
            ficha.magias.splice(magicIndex, 1);
        }
        renderMagias(); // Re-render after deletion
        panelClose();
    };
    magicInfo.appendChild(deleteBtn);
}

const habilidadesContent = document.getElementsByClassName('habilidades-content')[0];

function renderHabilidades() {
    habilidadesContent.innerHTML = ''; // Clear existing cards

    // Sort habilidades: favorites first
    const sortedHabilidades = [...ficha.habilidades].sort((a, b) => {
        if (a.isFavorite && !b.isFavorite) return -1;
        if (!a.isFavorite && b.isFavorite) return 1;
        return 0;
    });

    sortedHabilidades.forEach(ability => {
        const box = document.createElement('div');
        box.className = "ability-card";
        if (ability.isFavorite) {
            box.classList.add('favorited'); // Add a class for styling favorited items
        }

        const abilityNameEl = document.createElement('h2');
        abilityNameEl.className = "title";
        abilityNameEl.style.color = "white";
        abilityNameEl.textContent = ability.name;
        box.appendChild(abilityNameEl);

        // Add favorite star icon
        const favoriteStar = document.createElement('span');
        favoriteStar.className = 'favorite-star';
        favoriteStar.innerHTML = '&#9733;'; // Unicode star character
        if (ability.isFavorite) {
            favoriteStar.style.display = "block";
        } else {
            favoriteStar.style.display = "none";
        }
        box.appendChild(favoriteStar);

        if (ability.dice) {
            const rollBtn = document.createElement('button');
            rollBtn.className = 'btn';
            rollBtn.textContent = 'Rolar';
            rollBtn.onclick = (e) => {
                e.stopPropagation();
                diceInput.value = ability.dice;
                rollDice(false);
            }
            box.appendChild(rollBtn);
        }

        box.addEventListener('click', () => {
            showAbilityInfo(ability); // Pass the entire ability object
        });

        habilidadesContent.appendChild(box);
    });
    verifyAutoSave()
}

const abilityName = document.getElementById('abilityName');
const abilityDescription = document.getElementById('abilityDescription');
const abilityDice = document.getElementById('abilityDice');

function addAbility() {
    panelOpen("AbilityCreate");
    abilityName.value = "";
    abilityDescription.value = "";
    abilityDice.value = "";
}

function addHabilidade(nome, descricao, dado, load = false) {
    const abilityVar = {
        name: nome,
        description: descricao,
        dice: dado,
        isFavorite: false
    };

    if (!ficha.habilidades.some(h => h.name === nome) && !load) {
        ficha.habilidades.push(abilityVar);
    }
}

function createAbility() {
    if (!abilityName.value || !abilityDescription.value) return;

    addHabilidade(abilityName.value, abilityDescription.value, abilityDice.value);
    renderHabilidades(); // Re-render all ability cards

    panelClose();
}

function showAbilityInfo(ability) { // Now accepts the ability object
    const content = `
        <p class="text">Nome:</p>
        <input type="text" id="editAbilityName" class="input" value="${ability.name}">
        <p class="text">Descrição:</p>
        <textarea id="editAbilityDescription" class="input" style="resize: none;">${ability.description}</textarea>
        <p class="text">${ability.dice ? `Dado: ${ability.dice}` : ""}</p>
    `;
    panelOpen(null, "Editar Habilidade", content);

    const abilityInfo = document.querySelector("#main-panel .box #dynamic-content");
    if (!abilityInfo) return;

    const editAbilityNameInput = document.getElementById('editAbilityName');
    const editAbilityDescriptionInput = document.getElementById('editAbilityDescription');

    // Save Button
    const saveBtn = document.createElement('button');
    saveBtn.className = 'btn';
    saveBtn.textContent = 'Salvar';
    saveBtn.onclick = () => {
        ability.name = editAbilityNameInput.value;
        ability.description = editAbilityDescriptionInput.value;
        renderHabilidades();
        panelClose();
    };
    abilityInfo.appendChild(saveBtn);

    if (ability.dice) {
        const rollBtn = document.createElement('button');
        rollBtn.className = 'btn';
        rollBtn.textContent = 'Rolar';
        rollBtn.onclick = (e) => {
            e.stopPropagation();
            diceInput.value = ability.dice;
            rollDice(false);
        }
        abilityInfo.appendChild(rollBtn);
    }

    // Favorite Button
    const favoriteBtn = document.createElement('button');
    favoriteBtn.className = 'btn';
    favoriteBtn.textContent = ability.isFavorite ? 'Desfavoritar' : 'Favoritar';
    favoriteBtn.onclick = () => {
        ability.isFavorite = !ability.isFavorite;
        renderHabilidades(); // Re-render to update sorting and star
        panelClose(); // Close info panel after action
    };
    abilityInfo.appendChild(favoriteBtn);

    // Duplicate Button
    const duplicateBtn = document.createElement('button');
    duplicateBtn.className = 'btn';
    duplicateBtn.textContent = 'Duplicar';
    duplicateBtn.onclick = () => {
        const duplicatedAbility = { ...ability, name: ability.name + " (Cópia)", isFavorite: false }; // Create a copy, change name, not favorited by default
        ficha.habilidades.push(duplicatedAbility);
        renderHabilidades(); // Re-render to show the new item
        panelClose(); // Close info panel after action
    };
    abilityInfo.appendChild(duplicateBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn delete-btn';
    deleteBtn.textContent = 'Excluir';
    deleteBtn.onclick = () => {
        const abilityIndex = ficha.habilidades.findIndex(a => a.name === ability.name); // Find by name, assuming names are unique enough for deletion
        if (abilityIndex > -1) {
            ficha.habilidades.splice(abilityIndex, 1);
        }
        renderHabilidades(); // Re-render after deletion
        panelClose();
    };
    abilityInfo.appendChild(deleteBtn);
}

const inventoryContainer = document.getElementById('inventory');
const guardadosContainer = document.getElementById('guardados');
// ====================== INVENTORY ======================
/*
const itemNameInput = document.getElementById('itemName');
const itemDescriptionInput = document.getElementById('itemDescription');
const itemWeightInput = document.getElementById('itemWeight');
const itemDiceInput = document.getElementById('itemDice');
const itemLocalInput = document.getElementById('itemLocal');
*/

const itemName = document.getElementById('itemName');
const itemWeight = document.getElementById('itemWeight');
const itemLocal = document.getElementById('itemLocal');
const itemDescription = document.getElementById('itemDescription');

const itemCreateDice = document.getElementById('itemCreateDice');
const itemCreateType = document.getElementById('itemCreateType');

const weaponCreateType = document.getElementById('weaponCreateType')
const weaponCreateMMO = document.getElementById('weaponCreateMMO')
const weaponCreateDamage = document.getElementById('weaponCreateDamage')
const weaponCreateCritical = document.getElementById('weaponCreateCritical')

const mmoCreateWeapon = document.getElementById('mmoCreateWeapon')
const mmoCreateType = document.getElementById('mmoCreateType')

function addItem() {
    panelOpen("ItemCreate");
    const itemName = document.getElementById('itemName');
    itemWeight.value = ""
    itemLocal.value = "inventario"
    itemDescription.value = ""

    itemCreateDice.value = ""
    itemCreateType.value = "objeto"

    weaponCreateType.value = "branca"
    weaponCreateMMO.value = ""
    weaponCreateDamage.value = ""
    weaponCreateCritical.value = ""

    mmoCreateWeapon.value = "pistola"
    mmoCreateType.value = ""
}

function createItem() {

    if (itemName.value == "") {
        alert("O nome do item é obrigatório.");
        return;
    }
    if (createItemCategorySelected == "item") {
        var data = {
            dice: itemCreateDice.value,
            type: itemCreateType.value
        }
    } else if (createItemCategorySelected == "arma") {
        var data = {
            type: weaponCreateType.value,
            mmo: 0,
            maxMmo: parseInt(weaponCreateMMO.value),
            damage: weaponCreateDamage.value,
            critical: weaponCreateCritical.value
        }
    } else if (createItemCategorySelected == "municao") {
        var data = {
            type: mmoCreateType.value,
            weapon: mmoCreateWeapon.value
        }
    } else {
        
        alert("Erro ao criar item. Pagina sera reiniciada")
        save()
        location.reload();
    }

    const item = {
        name: itemName.value,
        id: Date.now(), // Unique ID for the item
        description: itemDescription.value,
        weight: parseFloat(itemWeight.value) || 0,
        storageLocate: itemLocal.value,
        isFavorite: false,
        type: createItemCategorySelected,
        data : data
    }

    if (item.storageLocate == 'inventario') {
        ficha.inventario.content.push(item);
        renderInventory();
    } else {
        ficha.inventario.guardados.push(item);
        renderGuardados();
    }

    updateTotalWeight();
    panelClose();
}

const categoriesGroupItem = document.getElementById('categoriesGroupItem');
const categoriesGroupWeapon = document.getElementById('categoriesGroupWeapon');
const categoriesGroupMunition = document.getElementById('categoriesGroupMunition');

const createItemA = document.getElementById('createItem');
const createWeapon = document.getElementById('createWeapon');
const createMunition = document.getElementById('createMunition');

const CategoryList = {
    "item": {opt: createItemA, btn: categoriesGroupItem },
    "arma": {opt: createWeapon, btn: categoriesGroupWeapon },
    "municao": {opt: createMunition, btn: categoriesGroupMunition }
}

var createItemCategorySelected = "item"

function createItemCategory(item) {

    if (item != createItemCategorySelected) {
        const previusBtn = CategoryList[createItemCategorySelected].btn
        previusBtn.classList.remove('active')
        createItemCategorySelected = item
    }
    createItemA.style.display = "none";
    createWeapon.style.display = "none";
    createMunition.style.display = "none";

    const newBtn = CategoryList[item].btn
    newBtn.classList.add('active')
    
    CategoryList[item].opt.style.display = 'flex'
}

function initializeItemCategoryDisplay() {
    const itemCategory = document.getElementById('itemCategory');
    const weaponOptions = document.getElementById('weapon-options');
    const munitionOptions = document.getElementById('munition-options');

    if (!itemCategory || !weaponOptions || !munitionOptions) {
        error('One or more item category elements not found.');
        return;
    }

    const category = itemCategory.value;

    // Ensure both are hidden first
    weaponOptions.classList.add('hidden');
    munitionOptions.classList.add('hidden');


    if (category === 'arma') {
        weaponOptions.classList.remove('hidden');
        ('Category is arma: weaponOptions hidden:', weaponOptions.classList.contains('hidden'));
    } else if (category === 'municao') {
        munitionOptions.classList.remove('hidden');
        ('Category is municao: munitionOptions hidden:', munitionOptions.classList.contains('hidden'));
    }
}

//document.getElementById('itemCategory').addEventListener('change', initializeItemCategoryDisplay);

// Call the function once on page load to set the initial state


let openedInventoryItem = null;
function renderInventory() {
    inventoryContainer.innerHTML = '';
    // Sort inventory: favorites first
    const sortedInventory = [...ficha.inventario.content].sort((a, b) => {
        if (a.isFavorite && !b.isFavorite) return -1;
        if (!a.isFavorite && b.isFavorite) return 1;
        return 0;
    });

    sortedInventory.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.className = 'item-card';
        itemCard.dataset.itemId = item.id;
        if (item.isFavorite) {
            itemCard.classList.add('favorited');
        }

        const itemHeader = document.createElement('div');
        itemHeader.className = 'item-header';
        let itemText = item.name;
        if (item.type == "weapon") {
            itemText += ` (${item.ammunition}/${item.maxAmmunition})`;
        }
        itemHeader.textContent = itemText;
        itemCard.appendChild(itemHeader);

        // Add favorite star icon
        const favoriteStar = document.createElement('span');
        favoriteStar.className = 'favorite-star';
        favoriteStar.innerHTML = '&#9733;'; // Unicode star character
        if (item.isFavorite) {
            favoriteStar.style.display = "block";
        } else {
            favoriteStar.style.display = "none";
        }
        itemHeader.appendChild(favoriteStar)
        itemHeader.appendChild(favoriteStar); // Append to header for better positioning

        const itemContent = document.createElement('div');
        itemContent.className = 'item-content';
        itemContent.style.display = 'none';

        const infoButton = document.createElement('button');
        infoButton.textContent = 'Info';
        infoButton.onclick = () => showItemInfo(item, 'inventario'); // Pass item object
        itemContent.appendChild(infoButton);

        const useButton = document.createElement('button');
        useButton.textContent = 'Usar';
        useButton.onclick = () => useItem(item.id);
        itemContent.appendChild(useButton);

        const guardarButton = document.createElement('button');
        guardarButton.textContent = 'Guardar';
        guardarButton.onclick = () => moveItem(item.id, 'inventario');
        itemContent.appendChild(guardarButton);

        // Favorite Button
        const favoriteBtn = document.createElement('button');
        favoriteBtn.textContent = item.isFavorite ? 'Desfavoritar' : 'Favoritar';
        favoriteBtn.onclick = () => {
            item.isFavorite = !item.isFavorite;
            renderInventory();
        };
        itemContent.appendChild(favoriteBtn);

        // Duplicate Button
        const duplicateBtn = document.createElement('button');
        duplicateBtn.textContent = 'Duplicar';
        duplicateBtn.onclick = () => {
            const duplicatedItem = { ...item, id: Date.now(), name: item.name + " (Cópia)", isFavorite: false };
            // Se o item duplicado for uma arma e tiver dados de munição, zere-a.
            if (duplicatedItem.type === "weapon" && duplicatedItem.data && typeof duplicatedItem.data.mmo !== 'undefined') {
                duplicatedItem.data.mmo = 0; // Reinicia a munição para armas
            }
            ficha.inventario.content.push(duplicatedItem);
            renderInventory();
        };
        itemContent.appendChild(duplicateBtn);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Excluir';
        deleteButton.onclick = () => deleteItem(item.id, 'inventario');
        itemContent.appendChild(deleteButton);

        itemCard.appendChild(itemContent);

        itemHeader.addEventListener('click', () => {

            const isVisible = itemContent.style.display === 'flex';

            // Fecha o item anterior
            if (openedInventoryItem && openedInventoryItem !== itemContent) {
                openedInventoryItem.style.display = 'none';
            }

            // Alterna o atual
            itemContent.style.display = isVisible ? 'none' : 'flex';

            // Atualiza referência
            openedInventoryItem = !isVisible ? itemContent : null;
        });

        if (ficha.inventario.weapon && ficha.inventario.weapon.id === item.id) {
            itemCard.classList.add('equipped');
        }

        inventoryContainer.appendChild(itemCard);
    });
    verifyAutoSave()
}

function renderGuardados() {
    guardadosContainer.innerHTML = '';
    // Sort guardados: favorites first
    const sortedGuardados = [...ficha.inventario.guardados].sort((a, b) => {
        if (a.isFavorite && !b.isFavorite) return -1;
        if (!a.isFavorite && b.isFavorite) return 1;
        return 0;
    });

    sortedGuardados.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.className = 'item-card';
        itemCard.dataset.itemId = item.id;
        if (item.isFavorite) {
            itemCard.classList.add('favorited');
        }

        const itemHeader = document.createElement('div');
        itemHeader.className = 'item-header';
        itemHeader.textContent = item.name;
        itemCard.appendChild(itemHeader);

        // Add favorite star icon
        const favoriteStar = document.createElement('span');
        favoriteStar.className = 'favorite-star';
        favoriteStar.innerHTML = '&#9733;'; // Unicode star character
        if (item.isFavorite) {
            favoriteStar.style.display = "block";
        } else {
            favoriteStar.style.display = "none";
        }
        itemHeader.appendChild(favoriteStar); // Append to header for better positioning

        const itemContent = document.createElement('div');
        itemContent.className = 'item-content';
        itemContent.style.display = 'none';

        const infoButton = document.createElement('button');
        infoButton.textContent = 'Info';
        infoButton.onclick = () => showItemInfo(item, 'guardado'); // Pass item object
        itemContent.appendChild(infoButton);

        const moveButton = document.createElement('button');
        moveButton.textContent = 'Mover para Inventário';
        moveButton.onclick = () => moveItem(item.id, 'guardado');
        itemContent.appendChild(moveButton);

        // Favorite Button
        const favoriteBtn = document.createElement('button');
        favoriteBtn.textContent = item.isFavorite ? 'Desfavoritar' : 'Favoritar';
        favoriteBtn.onclick = () => {
            item.isFavorite = !item.isFavorite;
            renderGuardados();
        };
        itemContent.appendChild(favoriteBtn);

        // Duplicate Button
        const duplicateBtn = document.createElement('button');
        duplicateBtn.textContent = 'Duplicar';
        duplicateBtn.onclick = () => {
            const duplicatedItem = { ...item, id: Date.now(), name: item.name + " (Cópia)", isFavorite: false };
            // Se o item duplicado for uma arma e tiver dados de munição, zere-a.
            if (duplicatedItem.type === "weapon" && duplicatedItem.data && typeof duplicatedItem.data.mmo !== 'undefined') {
                duplicatedItem.data.mmo = 0; // Reinicia a munição para armas
            }            ficha.inventario.guardados.push(duplicatedItem);
            renderGuardados();
        };
        itemContent.appendChild(duplicateBtn);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Excluir';
        deleteButton.onclick = () => deleteItem(item.id, 'guardado');
        itemContent.appendChild(deleteButton);

        itemCard.appendChild(itemContent);

        itemHeader.addEventListener('click', () => {

            const isVisible = itemContent.style.display === 'flex';

            // Fecha o item anterior
            if (openedInventoryItem && openedInventoryItem !== itemContent) {
                openedInventoryItem.style.display = 'none';
            }

            // Alterna o atual
            itemContent.style.display = isVisible ? 'none' : 'flex';

            // Atualiza referência
            openedInventoryItem = !isVisible ? itemContent : null;
        });

        guardadosContainer.appendChild(itemCard);
    });
    verifyAutoSave()
}

function showItemActions(itemId, event, location) {
    const existingMenu = document.querySelector('.item-action-menu');
    if (existingMenu) {
        existingMenu.remove();
    }

    event.stopPropagation();

    const itemCard = event.target;
    const rect = itemCard.getBoundingClientRect();

    const menu = document.createElement('div');
    menu.className = 'item-action-menu';

    const infoButton = document.createElement('button');
    infoButton.textContent = 'Info';
    infoButton.onclick = () => showItemInfo(itemId, location);

    const useButton = document.createElement('button');
    useButton.textContent = 'Usar';
    useButton.onclick = () => useItem(itemId);

    const guardarButton = document.createElement('button');
    guardarButton.textContent = location === 'inventario' ? 'Guardar' : 'Mover para Inventário';
    guardarButton.onclick = () => moveItem(itemId, location);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Excluir';
    deleteButton.onclick = () => deleteItem(itemId, location);

    menu.appendChild(infoButton);
    if (location === 'inventario') {
        menu.appendChild(useButton);
    }
    menu.appendChild(guardarButton);
    menu.appendChild(deleteButton);

    document.body.appendChild(menu);
    menu.style.display = 'flex';
    menu.style.top = `${rect.bottom}px`;
    menu.style.left = `${rect.left}px`;

    const closeMenuListener = (e) => {
        if (!menu.contains(e.target)) {
            menu.remove();
            document.removeEventListener('click', closeMenuListener);
        }
    };
    document.addEventListener('click', closeMenuListener);
}

function moveItem(itemId, from) {
    if (from === 'inventario') {
        const itemIndex = ficha.inventario.content.findIndex(item => item.id === itemId);
        if (itemIndex > -1) {
            const item = ficha.inventario.content.splice(itemIndex, 1)[0];
            ficha.inventario.guardados.push(item);
        }
    } else {
        const itemIndex = ficha.inventario.guardados.findIndex(item => item.id === itemId);
        if (itemIndex > -1) {
            const item = ficha.inventario.guardados.splice(itemIndex, 1)[0];
            ficha.inventario.content.push(item);
        }
    }
    renderInventory();
    renderGuardados();
    updateTotalWeight();
    const existingMenu = document.querySelector('.item-action-menu');
    if (existingMenu) {
        existingMenu.remove();
    }
}

function deleteItem(itemId, location) {
    if (location === 'inventario') {
        if (ficha.inventario.weapon && ficha.inventario.weapon.id === itemId) {
            unequipWeapon();
        }
        const itemIndex = ficha.inventario.content.findIndex(item => item.id === itemId);
        if (itemIndex > -1) {
            ficha.inventario.content.splice(itemIndex, 1);
        }
        renderInventory();
    } else {
        const itemIndex = ficha.inventario.guardados.findIndex(item => item.id === itemId);
        if (itemIndex > -1) {
            ficha.inventario.guardados.splice(itemIndex, 1);
        }
        renderGuardados();
    }
    updateTotalWeight();
    const existingMenu = document.querySelector('.item-action-menu');
    if (existingMenu) {
        existingMenu.remove();
    }
}

function useItem(itemId) {
    const item = ficha.inventario.content.find(item => item.id === itemId);
    if (!item) return;

    if (item.type == "municao") {
        reloadWeapon(item.id);
    } else if (item.type == "arma") {
        ficha.inventario.weapon = item;
        updateWeaponArea();
        renderInventory();
    } else {
        (`Usando ${item.name}`);
    }

    const existingMenu = document.querySelector('.item-action-menu');
    if (existingMenu) {
        existingMenu.remove();
    }
}

function showItemInfo(item, location) { // Now accepts the item object
    if (!item) return;

    const content = `
        <p class="text">Nome:</p>
        <input type="text" id="editItemName" class="input" value="${item.name}">
        <p class="text">Descrição:</p>
        <textarea id="editItemDescription" class="input" style="resize: none;">${item.description}</textarea>
        <p class="text">${item.dice ? `Dado: ${item.dice}` : ""}</p>
    `;
    panelOpen(null, "Editar Item", content);

    const itemInfo = document.querySelector("#main-panel .box #dynamic-content");
    if (!itemInfo) return;

    const editItemNameInput = document.getElementById('editItemName');
    const editItemDescriptionInput = document.getElementById('editItemDescription');

    // Save Button
    const saveBtn = document.createElement('button');
    saveBtn.className = 'btn';
    saveBtn.textContent = 'Salvar';
    saveBtn.onclick = () => {
        item.name = editItemNameInput.value;
        item.description = editItemDescriptionInput.value;
        if (location === 'inventario') {
            renderInventory();
        } else {
            renderGuardados();
        }
        panelClose();
    };
    itemInfo.appendChild(saveBtn);

    // Favorite Button
    const favoriteBtn = document.createElement('button');
    favoriteBtn.className = 'btn';
    favoriteBtn.textContent = item.isFavorite ? 'Desfavoritar' : 'Favoritar';
    favoriteBtn.onclick = () => {
        item.isFavorite = !item.isFavorite;
        if (location === 'inventario') {
            renderInventory();
        } else {
            renderGuardados();
        }
        panelClose();
    };
    itemInfo.appendChild(favoriteBtn);

    // Duplicate Button
    const duplicateBtn = document.createElement('button');
    duplicateBtn.className = 'btn';
    duplicateBtn.textContent = 'Duplicar';
    duplicateBtn.onclick = () => {
        const duplicatedItem = { ...item, id: Date.now(), name: item.name + " (Cópia)", isFavorite: false };
        if (location === 'inventario') {
            ficha.inventario.content.push(duplicatedItem);
            renderInventory();
        } else {
            ficha.inventario.guardados.push(duplicatedItem);
            renderGuardados();
        }
        panelClose();
    };
    itemInfo.appendChild(duplicateBtn);

    // Delete Button (already exists, but needs to be updated to use item.id)
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn delete-btn';
    deleteBtn.textContent = 'Excluir';
    deleteBtn.onclick = () => {
        deleteItem(item.id, location); // Use existing deleteItem function
        panelClose();
    };
    itemInfo.appendChild(deleteBtn);
}

const weaponArea = document.querySelector('.arma-area');

function updateWeaponArea() {
    const weapon = ficha.inventario.weapon;

    // Sem arma equipada
    if (!weapon || !weapon.name) {
        weaponArea.innerHTML = `
            <p class="text pre">
                Adicione uma arma clicando no Inventário
            </p>

            <p class="text pre">+</p>
        `;

        return;
    }

    // Define se usa munição
    const isFireWeapon = weapon.data.type !== "branca";

    // Dados seguros
    const damage = weapon.data.damage || "-";
    const critical = weapon.data.critical || "-";
    const ammo = weapon.data.mmo ?? 0;
    const maxAmmo = weapon.data.maxMmo ?? 0;

    weaponArea.innerHTML = `
        <p class="text">${weapon.name}</p>

        <p class="text">
            Dano: ${damage}
            |
            Crítico: ${critical}
        </p>

        ${
            isFireWeapon
                ? `
                    <p class="text sm">
                        Munição: ${ammo}/${maxAmmo}
                    </p>
                `
                : ""
        }

        <div class="btn-container">
            <button class="btn" id="weaponAttackBtn">
                ${isFireWeapon ? "Atirar" : "Atacar"}
            </button>

            ${
                isFireWeapon
                    ? `
                        <button class="btn" id="weaponReloadBtn">
                            Recarregar
                        </button>
                    `
                    : ""
            }

            <button class="btn delete-btn" id="weaponRemoveBtn">
                Remover
            </button>
        </div>
    `;

    // Eventos
    document
        .getElementById('weaponAttackBtn')
        .onclick = attackWeapon;

    if (isFireWeapon) {
        document
            .getElementById('weaponReloadBtn')
            .onclick = () => reloadWeapon();
    }

    document
        .getElementById('weaponRemoveBtn')
        .onclick = unequipWeapon;
}



function attackWeapon() {

    const weapon = ficha.inventario.weapon;

    const per = 
    weapon.data.type == "branca"? 'ArmasBrancas':
    weapon.data.type == "pistola"? 'Pistolas':
    weapon.data.type == "rifle"? 'Rifles':
    weapon.data.type == "longo_alcance"? 'LongoAlcance':
    null;

    if (ficha.pericias[per].value == 0) alert("Você não tem a pericia necessaria para usar essa arma.") 
    if (!weapon || ficha.pericias[per].value == 0) return;

    const isFireWeapon = weapon.data.type !== "branca";

    if (isFireWeapon && weapon.data.mmo <= 0) {
        alert("Sem munição.");
        return;
    }

    if (isFireWeapon) {
        weapon.data.mmo--;
    }

    diceInput.value = "1D20";
    const result = rollDice(ficha.pericias[per].value).type;
    hideDiceResultBlocked = true
    
    setTimeout(() => {
        hideDiceResult(true)
        setTimeout(() => {
            if (result == "Bom" || result == "Normal") {
                diceInput.value = weapon.data.damage
                rollDice(false, true);
            } else if (result == "Extremo") {
                diceInput.value = weapon.data.critical
                rollDice(false, true);
            }
            hideDiceResultBlocked = false
        }, 1000);
    }, 1000);

    updateWeaponArea();
    renderInventory();

    return result;
}

function reloadWeapon(munitionId) {
    const weapon = ficha.inventario.weapon;
    if (!weapon || weapon.data.type == "branca") {
        alert("Nenhuma arma equipada.");
        (weapon)
        return;
    }

    if (weapon.data.mmo === weapon.data.maxMmo) {
        alert("A munição já está cheia.");
        return;
    }

let munition = null;

let munitionIndex = -1;

if (munitionId) {

    munitionIndex = ficha.inventario.content.findIndex(item =>
        item.id === munitionId &&
        item.type === "municao"
    );

} else {

    munitionIndex = ficha.inventario.content.findIndex(item =>
        item.type === "municao" &&
        item.data.weapon === weapon.data.type
    );

}

if (munitionIndex !== -1) {
    munition = ficha.inventario.content[munitionIndex];
}

if (!munition) {
    alert("Nenhuma munição encontrada.");
    return;
}

    if (munition.data.type === 'cartucho') {
        if (weapon.data.mmo === 0) {
            weapon.data.mmo = weapon.data.maxMmo;
            ficha.inventario.content.splice(munitionIndex, 1);
        } else {
            alert("Cartuchos só podem ser usados quando a munição da arma estiver zerada.");
            return;
        }
    } else if (munition.data.type === 'bala') {
        weapon.data.mmo++;
        ficha.inventario.content.splice(munitionIndex, 1);
    }

    updateWeaponArea();
    renderInventory();
}

function unequipWeapon() {
    ficha.inventario.weapon = {};
    updateWeaponArea();
    renderInventory();
}

function editAdditionalWeight() {
    const panel = document.getElementById('additional-weight-panel');
    panel.style.display = 'flex';
    document.getElementById('additionalWeightInput').value = ficha.inventario.additionalWeight;
}

function closeAdditionalWeightPanel() {
    const panel = document.getElementById('additional-weight-panel');
    panel.style.display = 'none';
}

function updateAdditionalWeight() {
    const input = document.getElementById('additionalWeightInput');
    ficha.inventario.additionalWeight = parseFloat(input.value) || 0;
    updateTotalWeight();
    closeAdditionalWeightPanel();
}

function updateTotalWeight() {
    const pesoAddDisplay = document.getElementById('pesoAddDisplay');
    const pesoDisplay = document.getElementById('pesoDisplay');
    const currentWeight = ficha.inventario.content.reduce((total, item) => total + item.weight, 0);

    pesoAddDisplay.textContent = `/${ficha.inventario.additionalWeight}`;
    pesoDisplay.textContent = currentWeight;

    if (currentWeight > ficha.inventario.additionalWeight) {
        pesoDisplay.style.color = 'red';
    } else {
        pesoDisplay.style.color = 'white';
    }

    if (currentWeight > ficha.inventario.additionalWeight + (ficha.inventario.additionalWeight / 100)*10 ) {
        alert("MOBILIDADE INFERIDA GRAVEMENTE");
    }
    verifyAutoSave()
}

function addTrauma() {
    panelOpen("TraumaCreate");
    document.getElementById('traumaName').value = "";
    document.getElementById('traumaDescription').value = "";
    document.getElementById('traumaDice').value = "";
    document.getElementById('traumaTime').value = "";
}

function createTrauma() {
    const name = document.getElementById('traumaName').value;
    const description = document.getElementById('traumaDescription').value;
    const dice = document.getElementById('traumaDice').value;
    const time = document.getElementById('traumaTime').value;

    var tipoT

    if (!name) {
        alert("O nome do trauma é obrigatório.");
        return;
    }


    // Usa regex para separar número e tipo
    if (time.toUpperCase() === 'PER') {
        numero = 'PER';
        tipoT = 'PER';
    } else {
        const match = time.match(/^(\d+)([a-zA-Z]+)$/);
        if (!match) {
            alert("Formato de tempo inválido. Use algo como '1D', '2H', '12M' ou 'PER'.");
            return;
        }
        numero = parseInt(match[1], 10);
        tipoT = match[2].toUpperCase();
    }

    const newTrauma = {
        name: name,
        description: description,
        dado: dice,
        time: { numero, tipoT },
        isFavorite: false
    };

    ficha.traumas.push(newTrauma);
    renderTraumas();
    panelClose();

}

function renderTraumas() {

    const traumaContainer = document.getElementById('traumas-content')
    traumaContainer.innerHTML = '';

    // Sort traumas: favorites first
    const sortedTraumas = [...ficha.traumas].sort((a, b) => {
        if (a.isFavorite && !b.isFavorite) return -1;
        if (!a.isFavorite && b.isFavorite) return 1;
        return 0;
    });

    sortedTraumas.forEach(trauma => {
        const traumaCard = document.createElement('div');
        traumaCard.className = 'trauma-card';
        traumaCard.textContent = trauma.name;
        traumaCard.dataset.traumaId = trauma.id; // Assuming trauma objects have an 'id' property
        
        traumaCard.addEventListener('click', (event) => {
            showTraumaInfo(trauma); // Pass the trauma object
        });

        traumaContainer.appendChild(traumaCard);
    });
    verifyAutoSave()
}

function showTraumaInfo(trauma) { // Now accepts the trauma object
    const content = `
        <p class="text">Nome:</p>
        <input type="text" id="editTraumaName" class="input" value="${trauma.name}">
        <p class="text">Descrição:</p>
        <textarea id="editTraumaDescription" class="input" style="resize: none;">${trauma.description}</textarea>
        <p class="text">${trauma.dado ? `Dado: ${trauma.dado}` : ""}</p>
        <p class="text">Tempo: ${trauma.time.numero === 'PER' ? 'PER' : `${trauma.time.numero} ${trauma.time.tipo}`}</p>
    `;
    panelOpen(null, "Editar Trauma", content);

    const traumaInfo = document.querySelector("#main-panel .box #dynamic-content");
    if (!traumaInfo) return;

    const editTraumaNameInput = document.getElementById('editTraumaName');
    const editTraumaDescriptionInput = document.getElementById('editTraumaDescription');

    // Save Button
    const saveBtn = document.createElement('button');
    saveBtn.className = 'btn';
    saveBtn.textContent = 'Salvar';
    saveBtn.onclick = () => {
        trauma.name = editTraumaNameInput.value;
        trauma.description = editTraumaDescriptionInput.value;
        renderTraumas();
        panelClose();
    };
    traumaInfo.appendChild(saveBtn);

    // Duplicate Button
    const duplicateBtn = document.createElement('button');
    duplicateBtn.className = 'btn';
    duplicateBtn.textContent = 'Duplicar';
    duplicateBtn.onclick = () => {
        const duplicatedTrauma = { ...trauma, name: trauma.name + " (Cópia)", isFavorite: false }; // Create a copy, change name, not favorited by default
        ficha.traumas.push(duplicatedTrauma);
        renderTraumas(); // Re-render to show the new item
        panelClose(); // Close info panel after action
    };
    traumaInfo.appendChild(duplicateBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn delete-btn';
    deleteBtn.textContent = 'Excluir';
    deleteBtn.onclick = () => {
        const traumaIndex = ficha.traumas.findIndex(t => t.name === trauma.name); // Find by name, assuming names are unique enough for deletion
        if (traumaIndex > -1) {
            ficha.traumas.splice(traumaIndex, 1);
        }
        renderTraumas(); // Re-render after deletion
        panelClose();
    };
    traumaInfo.appendChild(deleteBtn);
}



function deleteTrauma(traumaId) {
    const traumaIndex = ficha.traumas.findIndex(trauma => trauma.id === traumaId);
    if (traumaIndex > -1) {
        ficha.traumas.splice(traumaIndex, 1);
    }
    renderTraumas(); // Re-render after deletion
}

var statusList = {
    "vida": {fill: document.getElementById('hpBarFill'), text: document.getElementById('hpValue')},
    "pontosDeMagia": {fill: document.getElementById('mpBarFill'), text: document.getElementById('mpValue')},
    "medo": {fill: document.getElementById('spBarFill'), text: document.getElementById('spValue')},
}

function changeStatusValue(type, status, custom = false) {

    if (custom) {

        value = type == "+"? valueChanger : -valueChanger

        ficha.customStatus.forEach(Cstatus => {
            if (Cstatus.name == status) {
                Cstatus.value += value
            }
        })
        
        statusAtu()
        return;
    }
    value = type == "+"? valueChanger : -valueChanger
        
    ficha.status[status] += value

    statusAtu()
    
}

function statusAtu() {
    (ficha.status)
    const vidaPer = (ficha.status.vida / ficha.status.vidaMax) * 100;
    const mpPer = (ficha.status.pontosDeMagia / ficha.status.pontosDeMagiaMax) * 100;
    const spPer = (ficha.status.medo / ficha.status.medoMax) * 100
    
    statusList["vida"].fill.style.width = ficha.status.vida >= ficha.status.vidaMax? "100%" :vidaPer + "%"
    statusList["pontosDeMagia"].fill.style.width = ficha.status.pontosDeMagia >= ficha.status.pontosDeMagiaMax? "100%" :mpPer + "%"
    statusList["medo"].fill.style.width = ficha.status.medo >= ficha.status.medoMax? "100%" :spPer + "%"

    statusList["vida"].text.innerHTML = ficha.status.vida + "/" + ficha.status.vidaMax;
    statusList["pontosDeMagia"].text.innerHTML = ficha.status.pontosDeMagia + "/" + ficha.status.pontosDeMagiaMax;
    statusList["medo"].text.innerHTML = ficha.status.medo + "/" + ficha.status.medoMax;

    if (ficha.customStatus.length != 0) {
        ficha.customStatus.forEach(Cstatus => {
            Cstatus.fill.style.width = Cstatus.value >= Cstatus.max? "100%" :(Cstatus.value / Cstatus.max) * 100 + "%"
            Cstatus.text.innerHTML = Cstatus.value + "/" + Cstatus.max;
        })
    }
    verifyAutoSave()
}

function formatDoc(command, value = null) {
    document.execCommand(command, false, value);
}

function save(ask = true) {

        ficha.biografia.contatos = personagemContatos.value
    if (localStorage.getItem('hasFichaSave')) {

        if (ask) {
            var r=confirm("Já Existe um save! nome : " + JSON.parse(localStorage.getItem('ficha')).nome + " Save criado às " + new Date(JSON.parse(localStorage.getItem('hour'))).toLocaleTimeString() + " ; Deseja Sobrescrever?");
        } else { 
            var r = true
        }

        if (r==true)
        {
            localStorage.setItem('ficha', JSON.stringify(ficha));
            const hour = new Date();
            localStorage.setItem('hour', JSON.stringify(hour));
            localStorage.setItem('hasFichaSave', true)
            if (ask) alert("Ficha salva!");
            ("save")
            return;
        }
        else
        {
            if (ask) alert('Ficha não salva!');
            return;
        }

    }

    
    localStorage.setItem('ficha', JSON.stringify(ficha));
    const hour = new Date();
    localStorage.setItem('hour', JSON.stringify(hour));
    localStorage.setItem('hasFichaSave', true)
    alert("Ficha salva!")
    return;
    
}

function load() {

    if (!localStorage.getItem('hasFichaSave')) {
        alert("Nenhum save encontrado!");
        return;
    }

    let loadedFicha;
    try {
        loadedFicha = JSON.parse(localStorage.getItem('ficha'));
    } catch (e) {
        alert("Erro ao carregar o save. O arquivo pode estar corrompido.");
        console.error("Erro ao parsear JSON do localStorage:", e);
        return;
    }

    if (!loadedFicha) {
        alert("Save corrompido ou vazio.");
        return;
    }

    ficha = mergeFicha(loadedFicha);

    if (saveUpdated) {
        const notification = document.getElementById('update-notification');
        if (notification) {
            notification.style.display = 'block';
        }
    }

    CarregarFicha()

}

/**
 * Carrega todas as informações
 */

function CarregarFicha() {
    imageField.value = ficha.imagem
    RenderPlayerImage()
    reloadMods()
    irParaJogo();
    displayPericias();
    renderTraumas()
    updateTotalWeight()
    updateWeaponArea()
    renderGuardados()
    renderInventory()
    setWallpaper(ficha.options.wallpaper)
    loadUserOptions()
    //ficha.biografia.comportamento = ficha.biografia.contatos

    habilidadesContent.innerHTML = '';
    magiasContent.innerHTML = '';

    if (ficha.habilidades && Array.isArray(ficha.habilidades)) {
        ficha.habilidades.forEach(h => {
            addHabilidade(h.name, h.description, h.dice, true)
        });
    }
    renderHabilidades(); // Call renderHabilidades after all ability items are processed

    if (ficha.magias && Array.isArray(ficha.magias)) {
        ficha.magias.forEach(m => {
            magicName.value = m.name;
            magicDescription.value = m.description;
            magicDice.value = m.dice;
            createMagic(true)
        });
    }
    
    if (ficha.options.autoSave) {
        changeAutoSaveBtn.innerHTML = "Ligado"
    } else {
        changeAutoSaveBtn.innerHTML = "Desligado"
    }

    renderMagias(); // Call renderMagias after all magic items are processed
    statusAtu()
}

function closePer() {
    const periciasContainer = document.getElementById('pericias-display-block');
    periciasContainer.style.display = 'none';

}

function enterPer() {
    const periciasContainer = document.getElementById("pericias-display-block")
    periciasContainer.style.display = "block"
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

const imageField = document.getElementById("image-field")
const playerImg = document.getElementById("playerImg")

imageField.addEventListener('change', function() {
    RenderPlayerImage()
});

function RenderPlayerImage() {
    ("aaa")
    ficha.imagem = imageField.value
    playerImg.style.backgroundImage = "url(" + imageField.value + ")";
    verifyAutoSave()
}

const backgrounds = [
    "wallpaperMedo.png",
    "wallpaperRealidade.png",
    "wallpaperEnergia.png",
    "wallpaperSangue.png",
]

const backgroundsRoots = [
    {
        "main":"white",
        "sec": "black",
        "btnBg": "rgb(239, 239, 239)",
        "btnHvr": "rgb(205, 205, 205)",
        "btnTx": "black",
        "ter": "#929292",
        "uTb": "",
        "sc": "#333333"
    },
    {
        "main":"black",
        "sec": "black",
        "btnBg": "rgb(17, 2, 2)",
        "btnHvr": "rgb(40, 3, 3)",
        "btnTx": "white",
        "ter": "#160f0f",
        "uTb": "#0000007a",
        "sc": "#333333"

    },
    {
        "main":"white",
        "sec": "black",
        "btnBg": "rgb(239, 239, 239)",
        "btnHvr": "rgb(205, 205, 205)",
        "btnTx": "black",
        "ter": "#555",
        "uTb": "",
        "sc": "#5E13CF"

    },
    {
        "main":"white",
        "sec": "black",
        "btnBg": "rgb(239, 239, 239)",
        "btnHvr": "rgb(205, 205, 205)",
        "btnTx": "black",
        "ter": "#c1c1c1",
        "uTb": "",
        "sc": "#CB0E09"
    },
]
setWallpaper(ficha.options.wallpaper)

function setWallpaper(value) {

    if (!(0 < value <= backgrounds.length)) return;

    ficha.options.wallpaper = value
    document.querySelector('body').style.backgroundImage = 'url(img/backgrounds/'+backgrounds[value]+')'
    const root = document.documentElement;
    const bgr =  backgroundsRoots[value]
    root.style.setProperty ('--main-clr', bgr.main);
    root.style.setProperty ('--sec-clr', bgr.sec);
    root.style.setProperty ('--btn-bg', bgr.btnBg);
    root.style.setProperty ('--btn-hvr', bgr.btnHvr);
    root.style.setProperty ('--btn-tx', bgr.btnTx);
    root.style.setProperty ('--ter-clr', bgr.ter);
    root.style.setProperty ('--un-tab-clr', bgr.uTb);
    root.style.setProperty ('--slider-clr', bgr.sc);

    
    (bgr)
    verifyAutoSave()
}

const chEdit = document.getElementById('chEdit')

function turnStatusMod() {
    if (chEdit.style.display  == "flex") {
        chEdit.style.display  = "none"
        ficha.options.chEdit = false
    } else {
        chEdit.style.display  = "flex"
        ficha.options.chEdit = true
    }
    (chEdit.style.display )
}

function valueCEdit(value) {
    valueChanger = value
    if(document.getElementsByClassName('on').length == 1) document.getElementsByClassName('on')[0].classList.remove('on');
    document.getElementById(value+"-ch").classList.add('on')
}

function loadUserOptions() {
    if (ficha.options.chEdit) {
        chEdit.style.display = 'flex'
    }else {
        chEdit.style.display = "none"
    }
}

const changeAutoSaveBtn = document.getElementById("changeAutoSaveBtn")

function changeAutoSave() {
    ficha.options.autoSave = !ficha.options.autoSave;
    (ficha.options.autoSave)
    verifyAutoSave()

    if (ficha.options.autoSave) {
        changeAutoSaveBtn.innerHTML = "Ligado"
    } else {
        changeAutoSaveBtn.innerHTML = "Desligado"
    }
}

function verifyAutoSave() {
    if (!ficha.options.autoSave) return;
    save(false)
}
const personagemContatos = document.getElementById('personagem-contatos')

// =========================
// MOD SYSTEM
// =========================

const modsList = document.getElementById('mods-list');


// =========================
// OPEN MOD MENU
// =========================


function openModsMenu() {

    renderMods();

    panelOpen("ModsPanel");

}

// =========================
// IMPORT MOD
// =========================

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


// =========================
// VALIDATE MOD
// =========================

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


// =========================
// APPLY MOD
// =========================

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

        if (
            ficha.status[status.id] === undefined
        ) {

            ficha.status[status.id] =
                status.default || 0;

        }

        if (
            ficha.status[status.id + "Max"]
            === undefined
        ) {

            ficha.status[status.id + "Max"] =
                status.max || 100;

        }

    });

    renderHabilidades();
    renderCustomStatuses();


}


// =========================
// RENDER MODS
// =========================

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


// =========================
// MOD DETAILS
// =========================

/*
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

    if (
        mod.options &&
        Object.keys(mod.options).length > 0
    ) {

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

        ficha.customStatus.forEach(status => {
            if(status.modID == mod.id) {
                html += `
                <div>
                    <p class="text">${status.name}</p>
                    <input class="input" type="number" id="${status.id}maxValue" value="${status.max}">
                </div>`
                document.getElementById(status.id + "maxValue").addEventListener("change", function(){
                    status.max = document.getElementById(status.id + "maxValue").value
                    verifyAutoSave()
                })
            }
        })


    }


    // =====================
    // SKILLS
    // =====================

    if (mod.skills.length > 0) {

        html += `
            <h2 class="title">
                Habilidades
            </h2>
        `;

        mod.skills.forEach(skill => {

            html += `

                <div class="mod-skill">

                    <p class="text">
                        ${skill.name}
                    </p>

                    <p class="text sm">
                        ${skill.description || ""}
                    </p>

                </div>

            `;

        });

    }


    // =====================
    // STATUS
    // =====================
/**
 * 
 
    if (mod.statuses.length > 0) {

        mod.statuses.forEach(status => {

                html += `
                <div>
                    <p class="text">${status.name}</p>
                    <input class="input" type="number" id="${status.id}maxValue" value="${status.max}">
                </div>`

                document.getElementById(status.id + "maxValue").addEventListener("change", function(){
                    status.max = document.getElementById(status.id + "maxValue").value
                    verifyAutoSave()
                })

        });

    }

    panelOpen(
        null,
        mod.name,
        html
    );

}
*/

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

    if (
        mod.options &&
        Object.keys(mod.options).length > 0
    ) {

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


    // PRIMEIRO abre o painel
    panelOpen(
        null,
        mod.name,
        html
    );

    // DEPOIS adiciona os listeners
    ficha.customStatus.forEach(status => {

        if (status.modId == mod.id) {

            const input = document.getElementById(status.id + "maxValue");

            if (input) {

                input.addEventListener("change", function () {

                    status.max = input.value;
                    console.log(input.value)

                    verifyAutoSave();
                    statusAtu();

                });

            }

        }

    });

}

// =========================
// UPDATE OPTION
// =========================

function updateModOption( modId, key, value) {

    const mod = ficha.mods.find(m => m.id === modId);

    if (!mod) return;

    mod.options[key] = value;

    verifyAutoSave();

}

// =========================
// REMOVE MOD
// =========================

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


// =========================
// CUSTOM STATUS
// =========================

function renderCustomStatuses() {

    const container = document.getElementById('custom-status-container');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    ficha.mods.forEach(mod => {
        
        mod.statuses.forEach(status => {
            
            const id = status.id
            const name = status.name
            const value = status.value
            const max = status.max
            const box = document.createElement('div');
            const fillColor = status.fillColor
            
            
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
                    <button class="barBtn" onclick="changeStatusValue('-', '${name}', true)"><</button>
                    <button class="barBtn" onclick="changeStatusValue('+', '${name}', true)">></button>
                </div>
            </div>
            `
            
            container.appendChild(box);
            const bar = document.getElementById(id + "Bar")
            const barFill = document.getElementById(id + "BarFill")
            const afterBar = document.getElementById(id + "AfterBar")

            afterBar.style.backgroundImage = `url(${status.background})`
            barFill.style.backgroundColor = fillColor;


            ficha.customStatus.push({
                name: name, 
                id: id, 
                fill: barFill, 
                text: document.getElementById(id + "Value"),
                value: value,
                max: max , 
                modId: mod.id
            });
        });
    });

    statusAtu()
    verifyAutoSave()
}


// =========================
// RELOAD MODS AFTER LOAD()
// =========================

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

/**
 *     const exampleMod = {

        id: "example_magic",

        name: "Example Magic Mod",

        author: 'Babydragon',

        version: "1.0",

        description:
            "MOD OFICIAL DA CAMPANHA Eternal Midnight Trip.",

        skills: [

            {

                name: "Shadow Bolt",

                description:
                    "MOD OFICIAL DA CAMPANHA Eternal Midnight Trip.",

                dice: "2d8+4"

            }

        ],

        statuses: [

            {
                id: "cm",
                name: "Calma",
                max: 100,
                value: 50,
                background:"https://i.imgur.com/KjoMoq3.png",
                fillColor: "#57e389ff"
            },
            {
                id: "en",
                name: "Energia",
                max: 100,
                value: 50,
                background:"https://i.imgur.com/ykWerrn.png",
                fillColor: "#c061cbff"
            }

        ],

        options: {

            enableCorruption: true,

            damageMultiplier: 2

        }

    };
 */

    console.log('atu')