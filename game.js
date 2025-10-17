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


function panelOpen(id) {
    document.getElementsByClassName("panel")[0].style.display = "flex";
    const box = document.querySelector(".panel .box");
    const divs = box.querySelectorAll("div[id]");
    divs.forEach(div => {
        div.style.display = "none";
    });
    document.querySelector(".panel .box #" + id).style.display = "flex";
}

function panelClose() {
    document.getElementsByClassName("panel")[0].style.display = "none";
    const itemCreate = document.getElementById('ItemCreate');
    if(itemCreate) itemCreate.style.display = "none";
    
    const magicCreate = document.querySelector(".panel .box #MagicCreate");
    if(magicCreate) magicCreate.style.display = "none";

    const magicInfo = document.querySelector(".panel .box #MagicInfo");
    if(magicInfo) magicInfo.style.display = "none";
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

function createMagic() {
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

    ficha.magias.push(magicVar)

    panelClose()
    
}

function showMagicInfo(name, description, dice, cardElement) {
    document.getElementById('magicInfoName').textContent = name;
    document.getElementById('magicInfoDescription').textContent = description;

    const magicInfo = document.getElementById('MagicInfo');
    const existingBtns = magicInfo.querySelectorAll('.btn');
    existingBtns.forEach(btn => btn.remove());


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

    panelOpen('MagicInfo');
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

function createAbility() {
    if (!abilityName.value || !abilityDescription.value) return;

    const box = document.createElement('div');
    box.className = "ability-card";

    const abilityNameValue = abilityName.value;
    const abilityDescriptionValue = abilityDescription.value;
    const abilityDiceValue = abilityDice.value;

    const abilityNameEl = document.createElement('h2');
    abilityNameEl.className = "title";
    abilityNameEl.style.color = "white";
    abilityNameEl.textContent = abilityNameValue;
    box.appendChild(abilityNameEl);

    const abilityDescriptionEl = document.createElement('p');
    abilityDescriptionEl.className = "text";
    abilityDescriptionEl.style.color = "white";
    abilityDescriptionEl.textContent = abilityDescriptionValue;
    abilityDescriptionEl.style.display = "none"; // Hide description in the card
    box.appendChild(abilityDescriptionEl);

    if (abilityDiceValue) {
        const rollBtn = document.createElement('button');
        rollBtn.className = 'btn';
        rollBtn.textContent = 'Rolar';
        rollBtn.onclick = (e) => {
            e.stopPropagation();
            diceInput.value = abilityDiceValue;
            rollDice(false);
        }
        box.appendChild(rollBtn)
    }

    box.addEventListener('click', () => {
        showAbilityInfo(abilityNameValue, abilityDescriptionValue, abilityDiceValue, box);
    });

    habilidadesContent.appendChild(box);

    const abilityVar = {
        name: abilityNameValue,
        description: abilityDescriptionValue,
        dice: abilityDiceValue
    };

    ficha.habilidades.push(abilityVar);

    panelClose();
}

function showAbilityInfo(name, description, dice, cardElement) {
    document.getElementById('abilityInfoName').textContent = name;
    document.getElementById('abilityInfoDescription').textContent = description;
    document.getElementById('abilityInfoDice').textContent = dice ? `Dado: ${dice}` : "";

    const abilityInfo = document.getElementById('AbilityInfo');
    const existingBtns = abilityInfo.querySelectorAll('.btn');
    existingBtns.forEach(btn => btn.remove());

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

    panelOpen('AbilityInfo');
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

function renderInventory() {
    inventoryContainer.innerHTML = '';
    ficha.inventario.content.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.className = 'item-card';
        itemCard.textContent = item.name;
        itemCard.dataset.itemId = item.id;

        if (ficha.inventario.weapon && ficha.inventario.weapon.id === item.id) {
            itemCard.classList.add('equipped');
        }

        itemCard.addEventListener('click', (event) => {
            showItemActions(item.id, event, 'inventario');
        });

        inventoryContainer.appendChild(itemCard);
    });
}

function renderGuardados() {
    guardadosContainer.innerHTML = '';
    ficha.inventario.guardados.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.className = 'item-card';
        itemCard.textContent = item.name;
        itemCard.dataset.itemId = item.id;

        itemCard.addEventListener('click', (event) => {
            showItemActions(item.id, event, 'guardado');
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

    if (item.dice) {
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

    panelOpen('ItemInfo');
    document.getElementById('itemInfoName').textContent = item.name;
    document.getElementById('itemInfoDescription').textContent = item.description;
    document.getElementById('itemInfoDice').textContent = item.dice ? `Dado: ${item.dice}` : "";
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
        weaponDice.className = 'text sm';
        weaponDice.textContent = `Dano: ${weapon.dice}`;
        
        const buttonContainer = document.createElement('div');
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

        const removeBtn = document.createElement('button');
        removeBtn.className = 'btn delete-btn';
        removeBtn.textContent = 'Remover';
        removeBtn.onclick = () => unequipWeapon();

        buttonContainer.appendChild(rollBtn);
        buttonContainer.appendChild(removeBtn);

        weaponArea.appendChild(weaponName);
        weaponArea.appendChild(weaponDice);
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
    const traumaContainer = document.getElementById('traumas-content');
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
    
    statusList[status].text.innerHTML = ficha.status[status] + value + "/" + ficha.status[status + "Max"]
    
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

    console.log(statusList["vida"].fill.style.width, vidaPer)
}

function formatDoc(command, value = null) {
    document.execCommand(command, false, value);
}

statusAtu()

function save() {
    localStorage.setItem('ficha', JSON.stringify(ficha));
    alert("Ficha salva!")
}

function load() {

    ficha = JSON.parse(localStorage.getItem('ficha')) || ficha;
    irParaJogo()
}