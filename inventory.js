
// Criação de Itens
const inventoryContainer = document.getElementById('inventory');
const guardadosContainer = document.getElementById('guardados');

// Informações comuns
const itemName = document.getElementById('itemName');
const itemWeight = document.getElementById('itemWeight');
const itemLocal = document.getElementById('itemLocal');
const itemDescription = document.getElementById('itemDescription');

// Informações de Itens
const itemCreateDice = document.getElementById('itemCreateDice');
const itemCreateType = document.getElementById('itemCreateType');

// Informações de Armas
const weaponCreateType = document.getElementById('weaponCreateType')
const weaponCreateMMO = document.getElementById('weaponCreateMMO')
const weaponCreateDamage = document.getElementById('weaponCreateDamage')
const weaponCreateCritical = document.getElementById('weaponCreateCritical')

// Informações de Munição
const mmoCreateWeapon = document.getElementById('mmoCreateWeapon')
const mmoCreateType = document.getElementById('mmoCreateType')

function startItemCreation() {
    panelOpen("ItemCreate");

    // Reinicia a criação de itens
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
    addItemCategory('item')
}

function addItem() {

    if (itemName.value == "") {
        alert("O nome do item é obrigatório.");
        return;
    }
    if (itemCategorySelected == "item") {
        var data = {
            dice: itemCreateDice.value,
            type: itemCreateType.value
        }
    } else if (itemCategorySelected == "arma") {
        var data = {
            type: weaponCreateType.value,
            mmo: 0,
            maxMmo: parseInt(weaponCreateMMO.value),
            damage: weaponCreateDamage.value,
            critical: weaponCreateCritical.value
        }
    } else if (itemCategorySelected == "municao") {
        var data = {
            type: mmoCreateType.value,
            weapon: mmoCreateWeapon.value
        }
    } else {
        
        alert("Erro ao criar item. Pagina sera reiniciada")
        save()
        location.reload();
    }

    createItem({
        name: itemName.value,
        description: itemDescription.value,
        weight: itemWeight.value,
        type: itemCategorySelected,
        data: data,
    }, itemLocal.value)

    renderTotalWeight();
    panelClose();
}

/**
 * @param {Object} item
 * @param {string} item.name
 * @param {string} item.description
 * @param {number} item.weight
 * @param {string} item.type
 * @param {Object} item.data
 * 
 * ITEM
 * 
 * |data.dice
 * 
 * |data.type
 * 
 * |
 * 
 * ARMA
 *
 * | data.type
 *
 * | data.mmo
 *
 * |data.maxMmo
 *
 * |data.damage
 *
 * |data.critical
 * 
 * |
 * 
 * MUNIÇÃO
 *
 * |data.type
 * 
 * |data.weapon
 * 
 * |
 * 
 * @param {string} place | "gua"
 */

function createItem(item, place="inv") {

    const itemForAdd = {
        name: item.name,
        id: crypto.randomUUID(),
        description: item.description,
        weight: parseFloat(item.weight) || 0,
        isFavorite: false,
        type: item.type,
        data: item.data,
    }

    if (place == "inventario") {
        ficha.inventario.content.push(itemForAdd);
        renderInventory();
    } else {
        ficha.inventario.guardados.push(itemForAdd);
        renderGuardados();
    }

    renderTotalWeight();

}

// Botões de seleção de Categoria 
const btnCategoryItem = document.getElementById('btnCategoryItem');
const btnCategoryWeapon = document.getElementById('btnCategoryWeapon');
const btnCategoryMunition = document.getElementById('btnCategoryMunition');

// Menus das Categorias
const addItemMenu = document.getElementById('addItemMenu');
const createWeaponMenu = document.getElementById('createWeaponMenu');
const createMunitionMenu = document.getElementById('createMunitionMenu');

const CategoryList = {
    "item": {opt: addItemMenu, btn: btnCategoryItem },
    "arma": {opt: createWeaponMenu, btn: btnCategoryWeapon },
    "municao": {opt: createMunitionMenu, btn: btnCategoryMunition }
}

var itemCategorySelected = "item"
function addItemCategory(itemCategory) {

    if (itemCategory != itemCategorySelected) {
        const previusBtn = CategoryList[itemCategorySelected].btn
        previusBtn.classList.remove('active')
        itemCategorySelected = itemCategory
    }
    addItemMenu.style.display = "none";
    createWeaponMenu.style.display = "none";
    createMunitionMenu.style.display = "none";

    const newBtn = CategoryList[itemCategory].btn
    newBtn.classList.add('active')
    
    CategoryList[itemCategory].opt.style.display = 'flex'
}

// Renderização

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

            const isVisible = itemCard.classList.contains('active');

            // Fecha o item anterior
            if (openedInventoryItem && openedInventoryItem !== itemCard) {
                openedInventoryItem.style.height = "19px"
                openedInventoryItem.classList.toggle('active')
            }

            // Alterna o atual
            itemCard.classList.toggle('active');
            itemCard.style.height = isVisible? "19px" : "165px";

            // Atualiza referência
            openedInventoryItem = !isVisible ? itemCard : null;
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
            const isVisible = itemCard.classList.contains('active');

            // Fecha o item anterior
            if (openedInventoryItem && openedInventoryItem !== itemCard) {
                openedInventoryItem.style.height = "19px"
                openedInventoryItem.classList.toggle('active')
            }

            // Alterna o atual
            itemCard.classList.toggle('active');
            itemCard.style.height = isVisible? "19px" : "165px";

            // Atualiza referência
            openedInventoryItem = !isVisible ? itemCard : null;
        });

        guardadosContainer.appendChild(itemCard);
    });
    verifyAutoSave()
}

function renderWeaponArea() {
    const weaponArea = document.querySelector('.arma-area');
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
            <button class="btn" id="weaponCriticalAttackBtn">Critico</button>

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
    document.getElementById('weaponAttackBtn').onclick = attackWeapon;
    document.getElementById('weaponCriticalAttackBtn').onclick = attackWeaponCritical;

    if (isFireWeapon) {
        document
            .getElementById('weaponReloadBtn')
            .onclick = () => reloadWeapon();
    }

    document
        .getElementById('weaponRemoveBtn')
        .onclick = unequipWeapon;
}

function renderMaxWeight() {
    const input = document.getElementById('additionalWeightInput');
    ficha.inventario.additionalWeight = parseFloat(input.value) || 0;
    renderTotalWeight();
    const panel = document.getElementById('additional-weight-panel');
    panel.style.display = 'none';
}

function renderTotalWeight() {
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

// Eventos

function showItemActions(itemId, event, location) {
    const itemElement = document.getElementById(itemId)
    if (itemElement) itemElement.classList.toggle('active')
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

function showItemInfo(item, location) {
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
        deleteItem(item.id, location);
        panelClose();
    };
    itemInfo.appendChild(deleteBtn);
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
    renderTotalWeight();
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
        renderTotalWeight();
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
        renderWeaponArea();
        renderInventory();
    } else if (item.type == "item" && item.data.dice != "") {
        rollDice(false, item.data.dice);  
    }

    const existingMenu = document.querySelector('.item-action-menu');
    if (existingMenu) {
        existingMenu.remove();
    }
}

// Eventos da Arma
console.log('RESOLVER ESSE PROBLEMA')

function attackWeapon() {

    const weapon = ficha.inventario.weapon;

    if (!weapon) return;

    const isFireWeapon = weapon.data.type !== "branca";

    if (isFireWeapon && weapon.data.mmo <= 0) {
        alert("Sem munição.");
        return;
    }

    if (isFireWeapon) {
        weapon.data.mmo--;
    }

    rollDice(false, false, weapon.data.damage);

    console.log
    renderWeaponArea();
    renderInventory();
}

function attackWeaponCritical() {

    const weapon = ficha.inventario.weapon;

    if (!weapon) return;

    const isFireWeapon = weapon.data.type !== "branca";

    if (isFireWeapon && weapon.data.mmo <= 0) {
        alert("Sem munição.");
        return;
    }

    if (isFireWeapon) {
        weapon.data.mmo--;
    }

    rollDice(false, false, weapon.data.critical);

    renderWeaponArea();
    renderInventory();
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

    renderWeaponArea();
    renderInventory();
}

function unequipWeapon() {
    ficha.inventario.weapon = {};
    renderWeaponArea();
    renderInventory();
}
