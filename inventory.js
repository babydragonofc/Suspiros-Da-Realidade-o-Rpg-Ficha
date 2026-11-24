
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

const createWeaponMMO = document.getElementById('createWeaponMMO')
// Informações de Munição
const mmoCreateWeapon = document.getElementById('mmoCreateWeapon')
const mmoCreateType = document.getElementById('mmoCreateType')

weaponCreateType.addEventListener('change', function(){
    if(weaponCreateType.value == 'branca') {
        createWeaponMMO.style.display = 'none'
    } else {
        createWeaponMMO.style.display = 'flex' 
    }
})

// Abas do painel de itens: "itemCreateTab" (Criar) e "itemLibTab" (Biblioteca)
function setPanelTab(tab) {
    inLib = tab.includes('Lib')

    document.getElementById('itemCreateTab').style.display = inLib ? 'none' : 'flex'
    document.getElementById('itemLibTab').style.display = inLib ? 'flex' : 'none'
    document.querySelectorAll('#createItemTabs button').forEach(b => b.classList.toggle('active', b.dataset.tab === tab))

    if (inLib) {
        biblioteca.aberto = null
        renderBiblioteca()
    }
}

// ================= BIBLIOTECA DE ITENS =================
// Mostra os itens prontos (preset, em listas.js) como cards. O jogador pode
// adicionar direto ao inventário ou clicar no card para ver mais e só então adicionar.
const BIBLIOTECA_CATEGORIAS = [
    ['todos', 'Todos'],
    ['armas', 'Armas'],
    ['municoes', 'Munições'],
    ['vestimentas', 'Vestimentas'],
    ['itens', 'Itens']
]
const biblioteca = { categoria: 'todos', busca: '', aberto: null, barra: null, area: null }

const ROTULOS_BIBLIOTECA = {
    branca: 'Arma branca', pistola: 'Pistola', rifle: 'Rifle', longo_alcance: 'Longo alcance',
    pequena: 'Pequena', media: 'Média', grande: 'Grande',
    corte: 'Corte', contusao: 'Contusão', perfuracao: 'Perfuração',
    bala: 'Bala solta', cartucho: 'Cartucho',
    arma: 'Arma', municao: 'Munição', vestimenta: 'Vestimenta', documento: 'Documento', item: 'Item', artefato: 'Artefato'
}
const rotuloBiblioteca = v => ROTULOS_BIBLIOTECA[v] || (String(v).charAt(0).toUpperCase() + String(v).slice(1).replaceAll('_', ' '))

function itensDaBiblioteca() {
    const lista = []
    for (const [cat] of BIBLIOTECA_CATEGORIAS) {
        if (cat == 'todos' || !preset[cat]) continue
        preset[cat].forEach(p => lista.push({ cat, p }))
    }
    return lista
}

// Copia o item do preset já no formato do inventário (evita editar o preset sem querer)
function itemDoPreset(p) {
    const copia = JSON.parse(JSON.stringify(p))
    if (copia.type == 'item') copia.data = { dice: '', type: 'objeto', ...copia.data }
    return copia
}

// Texto curto que aparece no card
function resumoBiblioteca(p) {
    const d = p.data || {}
    const partes = []
    if (p.type == 'arma') {
        partes.push(rotuloBiblioteca(d.type))
        if (d.damage) partes.push('Dano ' + d.damage)
    } else if (p.type == 'municao') {
        partes.push(rotuloBiblioteca(d.type) + ' · ' + rotuloBiblioteca(d.weapon))
    }
    partes.push('Peso ' + (p.weight || 0))
    return partes.join(' · ')
}

// Linhas "Rótulo: valor" do detalhe
function detalhesBiblioteca(p) {
    const d = p.data || {}
    const l = [['Tipo', rotuloBiblioteca(p.type)], ['Peso', p.weight || 0]]
    if (p.type == 'arma') {
        l.push(['Modelo', rotuloBiblioteca(d.type)])
        if (d.size) l.push(['Tamanho', rotuloBiblioteca(d.size)])
        if (d.category) l.push(['Categoria', rotuloBiblioteca(d.category)])
        if (d.damage) l.push(['Dano', d.damage])
        if (d.critical) l.push(['Dano crítico', d.critical])
        if (d.type != 'branca' && d.maxMmo) l.push(['Munição máxima', d.maxMmo])
    } else if (p.type == 'municao') {
        l.push(['Serve para', rotuloBiblioteca(d.weapon)], ['Modo', rotuloBiblioteca(d.type)])
    }
    return l
}

function adicionarDaBiblioteca(p, local = 'inventario', quantidade = 1) {
    const n = Math.max(1, Math.min(20, parseInt(quantidade) || 1))
    for (let i = 0; i < n; i++) createItem(itemDoPreset(p), local)
}

// Cria um elemento com classe e texto (sem innerHTML: os textos vêm de dados)
function elBiblioteca(tag, classe, texto) {
    const e = document.createElement(tag)
    if (classe) e.className = classe
    if (texto != null) e.textContent = texto
    return e
}

function botaoAdicionar(p, rotulo, obterQuantidade, obterLocal) {
    const b = elBiblioteca('button', 'btn', rotulo)
    b.onclick = e => {
        e.stopPropagation()
        adicionarDaBiblioteca(p, obterLocal ? obterLocal() : 'inventario', obterQuantidade ? obterQuantidade() : 1)
        b.textContent = '✓ Adicionado'
        b.disabled = true
        setTimeout(() => { b.textContent = rotulo; b.disabled = false }, 1200)
    }
    return b
}

function cardBiblioteca({ cat, p }) {
    const card = elBiblioteca('div', 'biblioteca-card')
    card.tabIndex = 0
    card.title = 'Clique para ver mais informações'
    card.append(
        elBiblioteca('span', 'biblioteca-etiqueta', rotuloBiblioteca(p.type)),
        elBiblioteca('h3', 'biblioteca-nome', p.name),
        elBiblioteca('p', 'biblioteca-resumo', resumoBiblioteca(p)),
        botaoAdicionar(p, '+ Adicionar')
    )
    const abrir = () => { biblioteca.aberto = { cat, p }; renderBiblioteca() }
    card.addEventListener('click', abrir)
    card.addEventListener('keydown', e => { if (e.key == 'Enter') abrir() })
    return card
}

function detalheBiblioteca({ p }) {
    const box = elBiblioteca('div', 'biblioteca-detalhe')
    const voltar = elBiblioteca('button', 'btn', '← Voltar à biblioteca')
    voltar.onclick = () => { biblioteca.aberto = null; renderBiblioteca() }

    const tabela = elBiblioteca('div', 'biblioteca-dados')
    detalhesBiblioteca(p).forEach(([r, v]) => {
        tabela.append(elBiblioteca('span', 'biblioteca-rotulo', r), elBiblioteca('span', '', String(v)))
    })

    const qtd = elBiblioteca('input', 'input')
    qtd.type = 'number'; qtd.min = 1; qtd.max = 20; qtd.value = 1
    const local = elBiblioteca('select', 'input')
    local.append(new Option('Inventário', 'inventario'), new Option('Guardados', 'guardados'))

    const acoes = elBiblioteca('div', 'biblioteca-acoes')
    const campoQtd = elBiblioteca('label', 'biblioteca-campo', 'Quantidade'); campoQtd.append(qtd)
    const campoLocal = elBiblioteca('label', 'biblioteca-campo', 'Colocar em'); campoLocal.append(local)
    acoes.append(campoQtd, campoLocal, botaoAdicionar(p, 'Adicionar', () => qtd.value, () => local.value))

    box.append(voltar, elBiblioteca('h2', 'biblioteca-titulo', p.name), tabela,
        elBiblioteca('p', 'biblioteca-descricao', p.description || 'Sem descrição.'), acoes)
    return box
}

function renderBiblioteca() {
    const raiz = document.querySelector('#itemLibTab .biblioteca-conteudo')
    if (!raiz) return

    // A barra (busca + categorias) é criada uma vez, para não perder o foco ao digitar
    if (!biblioteca.barra || !raiz.contains(biblioteca.barra)) {
        const barra = elBiblioteca('div', 'biblioteca-barra')
        const busca = elBiblioteca('input', 'input')
        busca.type = 'text'; busca.placeholder = 'Buscar item...'; busca.value = biblioteca.busca
        busca.addEventListener('input', () => { biblioteca.busca = busca.value; renderBiblioteca() })
        const cats = elBiblioteca('div', 'biblioteca-categorias')
        BIBLIOTECA_CATEGORIAS.forEach(([id, rotulo]) => {
            const b = elBiblioteca('button', 'btn', rotulo)
            b.dataset.cat = id
            b.onclick = () => { biblioteca.categoria = id; renderBiblioteca() }
            cats.append(b)
        })
        barra.append(busca, cats)
        biblioteca.barra = barra
        biblioteca.area = elBiblioteca('div', 'biblioteca-area')
        raiz.replaceChildren(barra, biblioteca.area)
    }

    biblioteca.barra.hidden = !!biblioteca.aberto
    biblioteca.barra.querySelectorAll('[data-cat]').forEach(b => b.classList.toggle('active', b.dataset.cat == biblioteca.categoria))

    if (biblioteca.aberto) {
        biblioteca.area.replaceChildren(detalheBiblioteca(biblioteca.aberto))
        return
    }

    const termo = biblioteca.busca.trim().toLowerCase()
    const lista = itensDaBiblioteca().filter(({ cat, p }) =>
        (biblioteca.categoria == 'todos' || cat == biblioteca.categoria) &&
        (!termo || (p.name + ' ' + (p.description || '')).toLowerCase().includes(termo)))

    const grade = elBiblioteca('div', 'biblioteca-grade')
    if (lista.length) lista.forEach(x => grade.append(cardBiblioteca(x)))
    else grade.append(elBiblioteca('p', 'biblioteca-vazio', 'Nenhum item encontrado.'))
    biblioteca.area.replaceChildren(grade)
}

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
        
        alert("Erro ao criar item. A página será reiniciada.")
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
    document.getElementById('useInput').value = ficha.inventario.usando

    inventoryContainer.innerHTML = '';
    // Sort inventory: favorites first
    const sortedInventory = [...ficha.inventario.content].sort((a, b) => {
        if (a.isFavorite && !b.isFavorite) return -1;
        if (!a.isFavorite && b.isFavorite) return 1;
        return 0;
    });

    sortedInventory.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.className = 'card-item';
        itemCard.dataset.itemId = item.id;
        if (item.isFavorite) {
            itemCard.classList.add('favoritado');
        }

        const itemHeader = document.createElement('div');
        itemHeader.className = 'cabecalho-item';
        let itemText = item.name;
        if (item.type == "weapon") {
            itemText += ` (${item.ammunition}/${item.maxAmmunition})`;
        }
        itemHeader.textContent = itemText;
        itemCard.appendChild(itemHeader);

        // Add favorite star icon
        const favoriteStar = document.createElement('span');
        favoriteStar.className = 'estrela-favorito';
        favoriteStar.innerHTML = '&#9733;'; // Unicode star character
        if (item.isFavorite) {
            favoriteStar.style.display = "block";
        } else {
            favoriteStar.style.display = "none";
        }
        itemHeader.appendChild(favoriteStar)
        itemHeader.appendChild(favoriteStar); // Append to header for better positioning

        const itemContent = document.createElement('div');
        itemContent.className = 'conteudo-item';

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
            itemCard.classList.add('equipado');
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
        itemCard.className = 'card-item';
        itemCard.dataset.itemId = item.id;
        if (item.isFavorite) {
            itemCard.classList.add('favoritado');
        }

        const itemHeader = document.createElement('div');
        itemHeader.className = 'cabecalho-item';
        itemHeader.textContent = item.name;
        itemCard.appendChild(itemHeader);

        // Add favorite star icon
        const favoriteStar = document.createElement('span');
        favoriteStar.className = 'estrela-favorito';
        favoriteStar.innerHTML = '&#9733;'; // Unicode star character
        if (item.isFavorite) {
            favoriteStar.style.display = "block";
        } else {
            favoriteStar.style.display = "none";
        }
        itemHeader.appendChild(favoriteStar); // Append to header for better positioning

        const itemContent = document.createElement('div');
        itemContent.className = 'conteudo-item';

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
    const weaponArea = document.querySelector('.area-arma');
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

    function separarDados(expressao) {
        const dados = [];

        // Encontra dados no formato NdM
        const regex = /(\d+)d(\d+)/gi;
        let match;

        while ((match = regex.exec(expressao)) !== null) {
            const quantidade = parseInt(match[1]);
            const lados = match[2];

            for (let i = 0; i < quantidade; i++) {
                dados.push(`1d${lados}`);
            }
        }

        return dados;
    }

    var damageDices = ""

    separarDados(damage).forEach(dice => {
        damageDices += (`<dice class='white' data-dice='${dice}'></dice>`)
    })

    const critical = weapon.data.critical || "-";

    var damageCritical = ""

    separarDados(critical).forEach(dice => {
        damageCritical += (`<dice class='white' data-dice='${dice}'></dice>`)
    })

    const ammo = weapon.data.mmo ?? 0;
    const maxAmmo = weapon.data.maxMmo ?? 0;

    weaponArea.innerHTML = `
        <p class="text">${weapon.name}</p>

        <p class="text">
            Dano: ${damageDices}
            |
            Crítico: ${damageCritical}
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

        <div class="container-botoes">
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

            <button class="btn botao-excluir" id="weaponRemoveBtn">
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
    const existingMenu = document.querySelector('.menu-acoes-item');
    if (existingMenu) {
        existingMenu.remove();
    }

    event.stopPropagation();

    const itemCard = event.target;
    const rect = itemCard.getBoundingClientRect();

    const menu = document.createElement('div');
    menu.className = 'menu-acoes-item';

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
    deleteBtn.className = 'btn botao-excluir';
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
    const existingMenu = document.querySelector('.menu-acoes-item');
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
        const existingMenu = document.querySelector('.menu-acoes-item');
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
        rollDice(item.data.dice, "damage");  
    }

    const existingMenu = document.querySelector('.menu-acoes-item');
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

    rollDice(weapon.data.damage, "damage");

    
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

    rollDice(weapon.data.critical, "damage");

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

document.getElementById('useInput').addEventListener('input', (e) => {
    ficha.inventario.usando = e.target.value;
});