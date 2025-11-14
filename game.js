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

function rollDice(per) {

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
        const type = verificarResultado(total, per).type
        nbmType.textContent = total != 1? type : "Dessastre";
        nbmType.style.color = type == "Extremo" ? "purple" : type == "Bom" ? "green" : type == "Normal" ? "white" : total == 1 ? "red" : "gray";
    } else {
        nbmType.textContent = "--";
    }

    nmb.textContent = total;
    diceDiv.style.opacity = "1"
    diceDiv.style.pointerEvents = "all"
    setTimeout(()=> {
        nmbW.style.opacity = "1"
    }, 3000)
}

function a() {
    nmbW.style.opacity = "0"
    diceDiv.style.opacity = "0"
    diceDiv.style.pointerEvents = "none"
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

    const contentIds = ['magias-content', 'habilidades-content', 'traumas-content', 'inventario-content', 'dados-content', 'personagem-content', 'diario-content'];
    const selectedContent = document.getElementById(contentIds[id]);
    if (selectedContent) {
        selectedContent.style.display = 'flex';
    }

    console.log(id, selectedContent)
    if (id === 5) { // Personagem tab
        renderPersonagem();
    }
}

const magiasContent = document.getElementsByClassName('magias-content')[0];

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

    const box = document.createElement('div');
    box.className = "magic-card"

    const magicNameValue = magicName.value;
    const magicDescriptionValue = magicDescription.value;
    const magicDiceValue = magicDice.value;

    const magicNameEl = document.createElement('h2');
    magicNameEl.className = "title"
    magicNameEl.style.color = "white"
    magicNameEl.textContent = magicNameValue
    box.appendChild(magicNameEl)

    const magicDescriptionEl = document.createElement('p');
    magicDescriptionEl.className = "text"
    magicDescriptionEl.style.color = "white"
    magicDescriptionEl.textContent = magicDescriptionValue
    magicDescriptionEl.style.display = "none"; // Hide description in the card
    box.appendChild(magicDescriptionEl)

    if (magicDiceValue) {
        const rollBtn = document.createElement('button');
        rollBtn.className = 'btn';
        rollBtn.textContent = 'Rolar';
        rollBtn.onclick = (e) => {
            e.stopPropagation();
            diceInput.value = magicDiceValue;
            rollDice(false);
        }
        box.appendChild(rollBtn)
    }

    box.addEventListener('click', () => {
        showMagicInfo(magicNameValue, magicDescriptionValue, magicDiceValue, box);
    });

    magiasContent.appendChild(box)

    const magicVar = {
        name: magicNameValue,
        description: magicDescriptionValue,
        dice: magicDiceValue
    }

    if (!ficha.magias.some(m => m.name === magicNameValue) && !load) {
        ficha.magias.push(magicVar)
    }

    if (!load) {
        panelClose()
    }
    
}

function showMagicInfo(name, description, dice, cardElement) {
    const content = `
        <p class="text">${description}</p>
    `;
    panelOpen(null, name, content);

    const magicInfo = document.querySelector("#main-panel .box #dynamic-content");
    if (!magicInfo) return;

    if (dice) {
        const rollBtn = document.createElement('button');
        rollBtn.className = 'btn';
        rollBtn.textContent = 'Rolar';
        rollBtn.onclick = (e) => {
            e.stopPropagation();
            diceInput.value = dice;
            rollDice(false);
        }
        magicInfo.appendChild(rollBtn)
    }

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn delete-btn';
    deleteBtn.textContent = 'Excluir';
    deleteBtn.onclick = () => {
        const magicIndex = ficha.magias.findIndex(m => m.name === name);
        if (magicIndex > -1) {
            ficha.magias.splice(magicIndex, 1);
        }
        cardElement.remove();
        panelClose();
    };
    magicInfo.appendChild(deleteBtn);
}

const habilidadesContent = document.getElementsByClassName('habilidades-content')[0];

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
        dice: dado
    };

    if (!ficha.habilidades.some(h => h.name === nome) && !load) {
        ficha.habilidades.push(abilityVar);
    }

    const box = document.createElement('div');
    box.className = "ability-card";

    const abilityNameEl = document.createElement('h2');
    abilityNameEl.className = "title";
    abilityNameEl.style.color = "white";
    abilityNameEl.textContent = nome;
    box.appendChild(abilityNameEl);

    const abilityDescriptionEl = document.createElement('p');
    abilityDescriptionEl.className = "text";
    abilityDescriptionEl.style.color = "white";
    abilityDescriptionEl.textContent = descricao;
    abilityDescriptionEl.style.display = "none";
    box.appendChild(abilityDescriptionEl);

    if (dado) {
        const rollBtn = document.createElement('button');
        rollBtn.className = 'btn';
        rollBtn.textContent = 'Rolar';
        rollBtn.onclick = (e) => {
            e.stopPropagation();
            diceInput.value = dado;
            rollDice(false);
        }
        box.appendChild(rollBtn);
    }

    box.addEventListener('click', () => {
        showAbilityInfo(nome, descricao, dado, box);
    });

    habilidadesContent.appendChild(box);
}

function createAbility() {
    if (!abilityName.value || !abilityDescription.value) return;

    addHabilidade(abilityName.value, abilityDescription.value, abilityDice.value);

    panelClose();
}

function showAbilityInfo(name, description, dice, cardElement) {
    const content = `
        <p class="text">${description}</p>
        <p class="text">${dice ? `Dado: ${dice}` : ""}</p>
    `;
    panelOpen(null, name, content);

    const abilityInfo = document.querySelector("#main-panel .box #dynamic-content");
    if (!abilityInfo) return;

    if (dice) {
        const rollBtn = document.createElement('button');
        rollBtn.className = 'btn';
        rollBtn.textContent = 'Rolar';
        rollBtn.onclick = (e) => {
            e.stopPropagation();
            diceInput.value = dice;
            rollDice(false);
        }
        abilityInfo.appendChild(rollBtn)
    }

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn delete-btn';
    deleteBtn.textContent = 'Excluir';
    deleteBtn.onclick = () => {
        const abilityIndex = ficha.habilidades.findIndex(a => a.name === name);
        if (abilityIndex > -1) {
            ficha.habilidades.splice(abilityIndex, 1);
        }
        cardElement.remove();
        panelClose();
    };
    abilityInfo.appendChild(deleteBtn);
}

// ====================== INVENTORY ======================

const inventoryContainer = document.getElementById('inventory');
const guardadosContainer = document.getElementById('guardados');
const itemNameInput = document.getElementById('itemName');
const itemDescriptionInput = document.getElementById('itemDescription');
const itemWeightInput = document.getElementById('itemWeight');
const itemDiceInput = document.getElementById('itemDice');
const itemLocalInput = document.getElementById('itemLocal');

function addItem() {
    panelOpen("ItemCreate");
    itemNameInput.value = '';
    itemDescriptionInput.value = '';
    itemWeightInput.value = '';
    itemDiceInput.value = '';
}

function createItem() {
    const name = itemNameInput.value;
    const description = itemDescriptionInput.value;
    const weight = itemWeightInput.value;
    const dice = itemDiceInput.value;
    const local = itemLocalInput.value;
    const category = document.getElementById('itemCategory').value;

    if (!name) {
        alert("O nome do item é obrigatório.");
        return;
    }

    const newItem = {
        id: Date.now(), // Unique ID for the item
        name: name,
        description: description,
        weight: parseFloat(weight) || 0,
        dice: dice
    };

    if (category === 'arma') {
        newItem.isWeapon = true;
        newItem.weaponType = document.getElementById('itemType').value;
        newItem.ammunition = parseInt(document.getElementById('itemAmmunition').value) || 0;
        newItem.maxAmmunition = parseInt(document.getElementById('itemAmmunition').value) || 0;
    } else if (category === 'municao') {
        newItem.isMunition = true;
        newItem.munitionType = document.getElementById('munitionType').value;
    }

    if (local === 'inventario') {
        ficha.inventario.content.push(newItem);
        renderInventory();
    } else {
        ficha.inventario.guardados.push(newItem);
        renderGuardados();
    }

    updateTotalWeight();
    panelClose();
}

function initializeItemCategoryDisplay() {
    const itemCategory = document.getElementById('itemCategory');
    const weaponOptions = document.getElementById('weapon-options');
    const munitionOptions = document.getElementById('munition-options');

    console.log('initializeItemCategoryDisplay called');
    console.log('itemCategory element:', itemCategory);
    console.log('weaponOptions element:', weaponOptions);
    console.log('munitionOptions element:', munitionOptions);

    if (!itemCategory || !weaponOptions || !munitionOptions) {
        console.error('One or more item category elements not found.');
        return;
    }

    const category = itemCategory.value;
    console.log('Selected item category:', category);

    // Ensure both are hidden first
    weaponOptions.classList.add('hidden');
    munitionOptions.classList.add('hidden');
    console.log('After hiding all: weaponOptions hidden:', weaponOptions.classList.contains('hidden'), 'munitionOptions hidden:', munitionOptions.classList.contains('hidden'));


    if (category === 'arma') {
        weaponOptions.classList.remove('hidden');
        console.log('Category is arma: weaponOptions hidden:', weaponOptions.classList.contains('hidden'));
    } else if (category === 'municao') {
        munitionOptions.classList.remove('hidden');
        console.log('Category is municao: munitionOptions hidden:', munitionOptions.classList.contains('hidden'));
    }
}

document.getElementById('itemCategory').addEventListener('change', initializeItemCategoryDisplay);

// Call the function once on page load to set the initial state


function renderInventory() {
    inventoryContainer.innerHTML = '';
    ficha.inventario.content.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.className = 'item-card';
        itemCard.dataset.itemId = item.id;

        const itemHeader = document.createElement('div');
        itemHeader.className = 'item-header';
        let itemText = item.name;
        if (item.isWeapon) {
            itemText += ` (${item.ammunition}/${item.maxAmmunition})`;
        }
        itemHeader.textContent = itemText;
        itemCard.appendChild(itemHeader);

        const itemContent = document.createElement('div');
        itemContent.className = 'item-content';
        itemContent.style.display = 'none';

        const infoButton = document.createElement('button');
        infoButton.textContent = 'Info';
        infoButton.onclick = () => showItemInfo(item.id, 'inventario');
        itemContent.appendChild(infoButton);

        const useButton = document.createElement('button');
        useButton.textContent = 'Usar';
        useButton.onclick = () => useItem(item.id);
        itemContent.appendChild(useButton);

        const guardarButton = document.createElement('button');
        guardarButton.textContent = 'Guardar';
        guardarButton.onclick = () => moveItem(item.id, 'inventario');
        itemContent.appendChild(guardarButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Excluir';
        deleteButton.onclick = () => deleteItem(item.id, 'inventario');
        itemContent.appendChild(deleteButton);

        itemCard.appendChild(itemContent);

        itemHeader.addEventListener('click', () => {
            const isVisible = itemContent.style.display === 'flex';
            itemContent.style.display = isVisible ? 'none' : 'flex';
        });

        if (ficha.inventario.weapon && ficha.inventario.weapon.id === item.id) {
            itemCard.classList.add('equipped');
        }

        inventoryContainer.appendChild(itemCard);
    });
}

function renderGuardados() {
    guardadosContainer.innerHTML = '';
    ficha.inventario.guardados.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.className = 'item-card';
        itemCard.dataset.itemId = item.id;

        const itemHeader = document.createElement('div');
        itemHeader.className = 'item-header';
        itemHeader.textContent = item.name;
        itemCard.appendChild(itemHeader);

        const itemContent = document.createElement('div');
        itemContent.className = 'item-content';
        itemContent.style.display = 'none';

        const infoButton = document.createElement('button');
        infoButton.textContent = 'Info';
        infoButton.onclick = () => showItemInfo(item.id, 'guardado');
        itemContent.appendChild(infoButton);

        const moveButton = document.createElement('button');
        moveButton.textContent = 'Mover para Inventário';
        moveButton.onclick = () => moveItem(item.id, 'guardado');
        itemContent.appendChild(moveButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Excluir';
        deleteButton.onclick = () => deleteItem(item.id, 'guardado');
        itemContent.appendChild(deleteButton);

        itemCard.appendChild(itemContent);

        itemHeader.addEventListener('click', () => {
            const isVisible = itemContent.style.display === 'flex';
            itemContent.style.display = isVisible ? 'none' : 'flex';
        });

        guardadosContainer.appendChild(itemCard);
    });
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

    if (item.isMunition) {
        reloadWeapon(item.id);
    } else if (item.dice) {
        ficha.inventario.weapon = item;
        updateWeaponArea();
        renderInventory();
    } else {
        console.log(`Usando ${item.name}`);
    }

    const existingMenu = document.querySelector('.item-action-menu');
    if (existingMenu) {
        existingMenu.remove();
    }
}

function showItemInfo(itemId, location) {
    let item;
    if (location === 'inventario') {
        item = ficha.inventario.content.find(i => i.id === itemId);
    } else {
        item = ficha.inventario.guardados.find(i => i.id === itemId);
    }

    if (!item) return;

    const content = `
        <p class="text">${item.description}</p>
        <p class="text">${item.dice ? `Dado: ${item.dice}` : ""}</p>
    `;
    panelOpen(null, item.name, content);
}

function updateWeaponArea() {
    const weaponArea = document.querySelector('.arma-area');
    const weapon = ficha.inventario.weapon;

    weaponArea.innerHTML = '';

    if (weapon && weapon.name) {
        const weaponName = document.createElement('p');
        weaponName.className = 'text';
        weaponName.textContent = weapon.name;

        const weaponDice = document.createElement('p');
        weaponDice.className = 'text sm'
        weaponDice.textContent = `Dano: ${weapon.dice}`;

        const weaponAmmo = document.createElement('p');
        weaponAmmo.className = 'text sm';
        if (weapon.isWeapon) {
            weaponAmmo.textContent = `Munição: ${weapon.ammunition}/${weapon.maxAmmunition}`;
        }
        
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'btn-container';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '10px';
        buttonContainer.style.marginTop = '10px';


        const rollBtn = document.createElement('button');
        rollBtn.className = 'btn';
        rollBtn.textContent = 'Rolar';
        rollBtn.onclick = () => {
            diceInput.value = weapon.dice;
            rollDice(false);
        };

        const useBtn = document.createElement('button');
        useBtn.className = 'btn';
        useBtn.textContent = 'Usar';
        useBtn.onclick = () => useWeapon();

        const reloadBtn = document.createElement('button');
        reloadBtn.className = 'btn';
        reloadBtn.textContent = 'Recarregar';
        reloadBtn.onclick = () => reloadWeapon();

        const removeBtn = document.createElement('button');
        removeBtn.className = 'btn delete-btn';
        removeBtn.textContent = 'Remover';
        removeBtn.onclick = () => unequipWeapon();

        buttonContainer.appendChild(rollBtn);
        if (weapon.isWeapon) {
            buttonContainer.appendChild(useBtn);
            buttonContainer.appendChild(reloadBtn);
        }
        buttonContainer.appendChild(removeBtn);

        weaponArea.appendChild(weaponName);
        weaponArea.appendChild(weaponDice);
        if (weapon.isWeapon) {
            weaponArea.appendChild(weaponAmmo);
        }
        weaponArea.appendChild(buttonContainer);
    } else {
        const placeholder1 = document.createElement('p');
        placeholder1.className = 'text pre';
        placeholder1.textContent = 'Adicione uma arma clicando no Inventario';

        const placeholder2 = document.createElement('p');
        placeholder2.className = 'text pre';
        placeholder2.textContent = '+';

        weaponArea.appendChild(placeholder1);
        weaponArea.appendChild(placeholder2);
    }
}

function useWeapon() {
    const weapon = ficha.inventario.weapon;
    if (weapon && weapon.isWeapon && weapon.ammunition > 0) {
        weapon.ammunition--;
        updateWeaponArea();
        renderInventory();
    }
}

function reloadWeapon(munitionId) {
    const weapon = ficha.inventario.weapon;
    if (!weapon || !weapon.isWeapon) {
        alert("Nenhuma arma equipada.");
        return;
    }

    if (weapon.ammunition === weapon.maxAmmunition) {
        alert("A munição já está cheia.");
        return;
    }

    let munition;
    let munitionIndex;

    if (munitionId) {
        munitionIndex = ficha.inventario.content.findIndex(item => item.id === munitionId && item.isMunition);
        if (munitionIndex !== -1) {
            munition = ficha.inventario.content[munitionIndex];
        }
    } else {
        // Find first available munition
        munitionIndex = ficha.inventario.content.findIndex(item => item.isMunition);
        if (munitionIndex !== -1) {
            munition = ficha.inventario.content[munitionIndex];
        }
    }

    if (!munition) {
        alert("Nenhuma munição encontrada no inventário.");
        return;
    }

    if (munition.munitionType === 'cartucho') {
        if (weapon.ammunition === 0) {
            weapon.ammunition = weapon.maxAmmunition;
            ficha.inventario.content.splice(munitionIndex, 1);
        } else {
            alert("Cartuchos só podem ser usados quando a munição da arma estiver zerada.");
            return;
        }
    } else if (munition.munitionType === 'bala') {
        weapon.ammunition++;
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


    if (!name) {
        alert("O nome do trauma é obrigatório.");
        return;
    }


    // Usa regex para separar número e tipo
    const match = time.match(/^(\d+)([a-zA-Z]+)$/);
    
    if (!match && time != "PER") {
        throw new Error("Formato inválido. Use algo como '1D', '2H', '30M'.");
        return;
    }

    const numero = parseInt(match[1], 10);
    const tipo = match[2].toUpperCase(); // Ex: 'D', 'H', 'M'

    const newTrauma = {
        name: name,
        description: description,
        dado: dice,
        time: { numero, tipo }
    };

    ficha.traumas.push(newTrauma);
    renderTraumas();
    panelClose();

}

function renderTraumas() {
    const traumaContainer = document.getElementsByClassName('traumas-content')[0];
    traumaContainer.innerHTML = '';

    ficha.traumas.forEach(trauma => {
        const traumaCard = document.createElement('div');
        traumaCard.className = 'trauma-card';
        traumaCard.textContent = trauma.name;
        traumaCard.dataset.traumaId = trauma.id;

        traumaCard.addEventListener('click', (event) => {
            showTraumaActions(trauma.id, event);
        });

        traumaContainer.appendChild(traumaCard);
    });
}

function showTraumaActions(traumaId, event) {
    const existingMenu = document.querySelector('.trauma-action-menu');
    if (existingMenu) {
        existingMenu.remove();
    }
    event.stopPropagation();

    const traumaCard = event.target;
    const rect = traumaCard.getBoundingClientRect();

    const menu = document.createElement('div');
    menu.className = 'trauma-action-menu';
    
}

function deleteTrauma(traumaId) {
    const traumaIndex = ficha.traumas.findIndex(trauma => trauma.id === traumaId);
    if (traumaIndex > -1) {
        ficha.traumas.splice(traumaIndex, 1);
    }
    renderTraumas();
}

var statusList = {
    "vida": {fill: document.getElementById('hpBarFill'), text: document.getElementById('hpValue')},
    "pontosDeMagia": {fill: document.getElementById('mpBarFill'), text: document.getElementById('mpValue')},
    "medo": {fill: document.getElementById('spBarFill'), text: document.getElementById('spValue')},
}

function changeStatusValue(type, status) {

    value = type == "+"? 1 : -1
        
    ficha.status[status] += value

    statusAtu()
}

function statusAtu() {
    console.log(ficha.status)
    const vidaPer = (ficha.status.vida / ficha.status.vidaMax) * 100;
    const mpPer = (ficha.status.pontosDeMagia / ficha.status.pontosDeMagiaMax) * 100;
    const spPer = (ficha.status.medo / ficha.status.medoMax) * 100
    
    statusList["vida"].fill.style.width = ficha.status.vida >= ficha.status.vidaMax? "100%" :vidaPer + "%"
    statusList["pontosDeMagia"].fill.style.width = ficha.status.pontosDeMagia >= ficha.status.pontosDeMagiaMax? "100%" :mpPer + "%"
    statusList["medo"].fill.style.width = ficha.status.medo >= ficha.status.medoMax? "100%" :spPer + "%"

    statusList["vida"].text.innerHTML = ficha.status.vida + "/" + ficha.status.vidaMax;
    statusList["pontosDeMagia"].text.innerHTML = ficha.status.pontosDeMagia + "/" + ficha.status.pontosDeMagiaMax;
    statusList["medo"].text.innerHTML = ficha.status.medo + "/" + ficha.status.medoMax;

    console.log(statusList["vida"].fill.style.width, vidaPer)
}

function formatDoc(command, value = null) {
    document.execCommand(command, false, value);
}

function save() {
    if (localStorage.getItem('hasFichaSave')) {

        var r=confirm("Ja Existe um save! nome : " + JSON.parse(localStorage.getItem('ficha')).name + " Save criado às " + new Date(JSON.parse(localStorage.getItem('hour'))).toLocaleTimeString() + " ; Deseja Sobrescrever?");

        if (r==true)
        {
            localStorage.setItem('ficha', JSON.stringify(ficha));
            const hour = new Date();
            localStorage.setItem('hour', JSON.stringify(hour));
            localStorage.setItem('hasFichaSave', true)
            alert("Ficha salva!")
            return;
        }
        else
        {
            alert('Ficha não salva!')
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

    const main = document.querySelector("main");
    const cF = document.getElementById("cF");
    const game = document.getElementById("game");

    if (main) main.style.display = "none";
    if (cF) cF.style.display = "none";
    if (game) game.style.display = "flex";


    displayPericias();
    renderTraumas()
    updateTotalWeight()
    updateWeaponArea()
    renderGuardados()
    renderInventory()

    habilidadesContent.innerHTML = '';
    magiasContent.innerHTML = '';

    if (ficha.habilidades && Array.isArray(ficha.habilidades)) {
        ficha.habilidades.forEach(h => {
            addHabilidade(h.name, h.description, h.dice, true)
        });
    }

    if (ficha.magias && Array.isArray(ficha.magias)) {
        ficha.magias.forEach(m => {
            magicName.value = m.name;
            magicDescription.value = m.description;
            magicDice.value = m.dice;
            createMagic(true)
        });
    }
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