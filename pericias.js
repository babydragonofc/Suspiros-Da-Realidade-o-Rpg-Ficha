const itens = document.querySelectorAll('.item');

let currentItem = null;
let placeholder = null;
let originPlace = null;

let offsetX = 0;
let offsetY = 0;

// usada na ficha
let prDiv = null

class Place {

    static instances = new WeakMap();

    constructor(element) {
        this.element = element;
        Place.instances.set(element, this);
    }

    static from(element) {
        return Place.instances.get(element);
    }

    get value() {
        return this.element.getAttribute('aria-value') || '';
    }

    set value(value) {

        if (!value) {
            this.element.removeAttribute('aria-value');
        } else {
            this.element.setAttribute('aria-value', value);
        }
    }
}

document.querySelectorAll('.place').forEach(el => {
    new Place(el);
});

document.querySelectorAll('.itemPlace').forEach(container => {
    container.querySelectorAll('.item').forEach(item => {
        item.homeContainer = container;
    });
});

function resetItemStyles(item) {

    item.style.position = 'static';
    item.style.left = '';
    item.style.top = '';
    item.style.width = '';
    item.style.height = '';
    item.style.zIndex = '';
}

function moveFreeToScreen(item, x, y) {

    document.body.appendChild(item);

    item.style.position = 'absolute';
    item.style.left = `${x}px`;
    item.style.top = `${y}px`;

    item.style.width = '';
    item.style.height = '';
    item.style.zIndex = '';
}

itens.forEach(item => {

    item.style.touchAction = 'none';

    item.addEventListener('pointerdown', event => {

        const rect = item.getBoundingClientRect();

        currentItem = item;

        item.lastParent = item.parentElement;
        originPlace = item.parentElement.closest('.place');

        if (!item.classList.contains('free')) {

            placeholder = document.createElement('div');

            placeholder.className = 'drag-placeholder';
            placeholder.style.width = `${rect.width}px`;
            placeholder.style.height = `${rect.height}px`;

            item.parentElement.insertBefore(
                placeholder,
                item
            );

        } else {

            placeholder = null;
        }

        offsetX = event.clientX - rect.left;
        offsetY = event.clientY - rect.top;

        item.style.width = `${rect.width}px`;
        item.style.height = `${rect.height}px`;

        item.style.position = 'absolute';
        item.style.left = `${rect.left}px`;
        item.style.top = `${rect.top}px`;
        item.style.zIndex = '9999';

        document.body.appendChild(item);

        item.setPointerCapture(event.pointerId);
        renderPerPlaces()
    });
});

document.addEventListener('pointermove', event => {

    if (!currentItem) return;

    currentItem.style.left =
        `${event.clientX - offsetX}px`;

    currentItem.style.top =
        `${event.clientY - offsetY}px`;
});

document.addEventListener('pointerup', event => {

    if (!currentItem) return;

    currentItem.style.pointerEvents = 'none';

    const target = document.elementFromPoint(
        event.clientX,
        event.clientY
    );

    currentItem.style.pointerEvents = '';

    const targetPlace =
        target?.closest('.place');

    /* ==========================
       SOLTO EM UM PLACE
    ========================== */

    if (targetPlace) {

        const occupiedItem =
            targetPlace.querySelector('.item');

        if (
            occupiedItem &&
            occupiedItem !== currentItem
        ) {

            /* TROCA ENTRE PLACES */

            if (originPlace) {

                originPlace.appendChild(
                    occupiedItem
                );

                resetItemStyles(
                    occupiedItem
                );

                const oldPlace =
                    Place.from(originPlace);

                if (oldPlace) {

                    oldPlace.value =
                        occupiedItem.getAttribute(
                            'aria-value'
                        );
                }
            }

            /* VEIO DA LISTA */

            else {

                if (
                    occupiedItem.classList.contains(
                        'free'
                    )
                ) {

                    const rect =
                        targetPlace.getBoundingClientRect();

                    moveFreeToScreen(
                        occupiedItem,
                        rect.left,
                        rect.top
                    );

                } else {

                    occupiedItem.homeContainer
                        .appendChild(
                            occupiedItem
                        );

                    resetItemStyles(
                        occupiedItem
                    );
                }
            }
        }

        targetPlace.appendChild(
            currentItem
        );

        resetItemStyles(
            currentItem
        );

        const place =
            Place.from(targetPlace);

        if (place) {

            place.value =
                currentItem.getAttribute(
                    'aria-value'
                );
        }

        if (
            originPlace &&
            originPlace !== targetPlace
        ) {

            const oldPlace =
                Place.from(originPlace);

            if (
                oldPlace &&
                !originPlace.querySelector('.item')
            ) {

                oldPlace.value = '';
            }
        }
    }

    /* ==========================
       SOLTO FORA DOS PLACES
    ========================== */

    else {

        if (
            currentItem.classList.contains(
                'free'
            )
        ) {

            currentItem.style.zIndex = '';
            currentItem.style.width = '';
            currentItem.style.height = '';

        } else {

            currentItem.homeContainer
                .appendChild(
                    currentItem
                );

            resetItemStyles(
                currentItem
            );
        }

        if (originPlace) {

            const oldPlace =
                Place.from(originPlace);

            if (
                oldPlace &&
                !originPlace.querySelector('.item')
            ) {

                oldPlace.value = '';
            }
        }
    }

    if (placeholder) {

        placeholder.remove();
        placeholder = null;
    }

    currentItem = null;
    originPlace = null;

    renderPerPlaces()
});

document.addEventListener('pointercancel',
    () => {

        if (placeholder) {
            placeholder.remove();
            placeholder = null;
        }

        currentItem = null;
        originPlace = null;
    }
);

function getValue(el) {
    return Place.from(el)?.value ?? null;
}

const lvSelectNumber = document.getElementById('lvSelectNumber')
let level = 1

function levelSelect(eq) {
    if(level == 0 && eq == "-") return;
    if(level == maxLevel && eq == "+") return;

    level = eq == "+"? level + 1: level - 1;
    lvSelectNumber.textContent = level;
    renderPerPlaces()
}

/**
 * GetPerPlace
 * 
 * @param {int} n -> id do place
 * @returns {HTMLElement}
 */
function gPP(n) {
    return document.getElementById('place' + n);
}

renderPerPlaces()
function renderPerPlaces() {
    document.querySelectorAll('.perUsefullPlace, .perUselessPlace').forEach(element => {
        element.classList.remove('perUsefullPlace', 'perUselessPlace');
    });

    const rule = levelsRules[level].map;
    const max = levelsRules[level].max;
    const min = levelsRules[level].min
    let itensCount = 0
    let piramidRule = true

    const map = [
        [gPP(1), gPP(2), gPP(3), gPP(4), gPP(5)],
        [gPP(6), gPP(7), gPP(8), gPP(9), gPP(10)],
        [gPP(11), gPP(12), gPP(13), gPP(14), gPP(15)],
        [gPP(16), gPP(17), gPP(18), gPP(19), gPP(20)],
        [gPP(21), gPP(22), gPP(23), gPP(24), gPP(25)]
    ]


    for (let linha = 0; linha < rule.length; linha++) {
        for(let coluna = 0; coluna < rule[linha].length; coluna++) {
            const place = map[linha][coluna];
            const placeRule = rule[linha][coluna];
            const placeId = (linha)*5 + coluna + 1
            const element = gPP(placeId)

            if (placeRule) element.classList.add('perUsefullPlace')
            const value = getValue(element);
            if (!placeRule && value?.trim()) {
                element.classList.add('perUselessPlace');
            }
            if( element.classList.contains('perUselessPlace')){
                piramidRule = false;
            }
            if(getValue(place) != '') {
                itensCount++
            }
        }
    }
    
    const prNextBtn = document.getElementById("pr-next-btn")
    if (itensCount > max || itensCount < min || !piramidRule) {
        prNextBtn.style.display = "none"
    } else {
        if (itensCount <= max && itensCount >= min && piramidRule) {
            prNextBtn.style.display = "block"
        }
    }
}

const itensPlace = [
    {name: "Fisicas", id: "perListFisicas"},
    {name: "De Armas", id: "perListArmas"},
    {name: "De Mobilidade", id: "perListFisicas2"},
    {name: "Sociais", id:"perListSociais"},
    {name: "Investigativas", id:"perListInvestigacao"},
    {name: "De Conhecimento", id: "perListConhecimento"},
    {name: "Paranormais", id:"perListParanormal"}
]

let selectedItemPlace = 0

//Responsividade
const perPlaces = document.getElementById('perPlaces')
const prNextBtn = document.getElementById("pr-next-btn")
const prContent = document.getElementById('Pr-Content')



perListsPlacesGen(false)
//Geração 
function perListsPlacesGen(on) {

    const header = document.querySelector('#perLists header')
    if (!itensPlace[selectedItemPlace]) selectedItemPlace = 0;

    if(!on) {
        document.querySelectorAll('#Pr-Content .itemPlace').forEach(el => {
            el.style.display = "none"
        }); 

        const selectedList = document.getElementById(itensPlace[selectedItemPlace].id);
        if (selectedList) selectedList.style.display = "flex"
        if (header) header.style.display = "flex"
    } else {
        document.querySelectorAll('#Pr-Content .itemPlace').forEach(el => {
            el.style.display = "flex"
        }); 
        if (header) header.style.display = "none"
    }
}

function selectItemPlace(type) {
    selectedItemPlace = type? selectedItemPlace +1: selectedItemPlace -1 
    if (selectedItemPlace == itensPlace.length) selectedItemPlace = 0
    if (selectedItemPlace == -1) selectedItemPlace = itensPlace.length -1
    if (!itensPlace[selectedItemPlace]) selectedItemPlace = 0

    const title = document.querySelector('#perLists header section h2')
    if (title) title.textContent = itensPlace[selectedItemPlace].name;

    document.querySelectorAll('#Pr-Content .itemPlace').forEach(el => {
        el.style.display = "none"
    }); 

    const selectedList = document.getElementById(itensPlace[selectedItemPlace].id);
    if (selectedList) selectedList.style.display = "flex"
}

function finishPer() {
    let perValueMap = [
        ["destreza", "força", "constituição", "luta", "pontaria", "armas_brancas", "pistolas", "rifle", "longo_alcance", "atletismo", "acrobacia", "furtividade", "pilotagem", "labia", "intimidação", "psicologia", "percepção", "crime", "medicina", "tecnologia", "mecanica", "inteligencia", "atualidades", "ciencias", "historia", "profissão", "vontade", "ocultismo", "magia", "sobrevivencia" ],
        [],
        [],
        [],
        [],
        []
    ]
    const map = [
        [gPP(1), gPP(2), gPP(3), gPP(4), gPP(5)],
        [gPP(6), gPP(7), gPP(8), gPP(9), gPP(10)],
        [gPP(11), gPP(12), gPP(13), gPP(14), gPP(15)],
        [gPP(16), gPP(17), gPP(18), gPP(19), gPP(20)],
        [gPP(21), gPP(22), gPP(23), gPP(24), gPP(25)]
    ]
    const rule = levelsRules[level].map

    let HaveMagicPer = false

    for (let linha = 0; linha < rule.length; linha++) {
        for (let coluna = 0; coluna < rule[linha].length; coluna++) {

            const place = map[linha][coluna];
            const value = getValue(place);

            const index = perValueMap[0].indexOf(value);
            if (index !== -1) {
                perValueMap[0].splice(index, 1);
            }

            perValueMap[5 - linha].push(value);

            if (value === "magia" && linha !== 0) {
                HaveMagicPer = true;
            }
        }
    }

    ficha.pericias = perValueMap;
    statusDef()
    /*
    if (ficha.origem.includes(9) || ficha.origem.includes(13)){
        ficha.ConhecimentoMagico += 1
    
    }*/
   console.log(HaveMagicPer)
    if (HaveMagicPer) {
        Pr.style.display = "none"
        Mg.style.display = "flex";
    } else {
        FichaEnd()
    }
}

function displayPericias() {
    document.getElementById('pericias-display').innerHTML = ''
    for (let i = 0; i < 6; i++) {
            const el = document.createElement('div')
            el.id = "perListLvl" + i
            el.classList = "pBlock"
    
            const header = document.createElement('header')
            header.textContent = "Nível " + i
            el.appendChild(header)
            const perElBoxInt = document.createElement('div')
            perElBoxInt.classList = "perDisplayBlockInt"
            el.appendChild(perElBoxInt)
            if(i == 0) {
                perElBoxInt.style.display = 'none'
                const hideNShowBtn = document.createElement('button')
                hideNShowBtn.classList = "hideNShowBtn"
                const icon = document.createElement('img')
                icon.classList = "mMTImage"
                icon.src = "img/menu.svg"

                hideNShowBtn.appendChild(icon)
                header.appendChild(hideNShowBtn)

                if (hideNShowBtn) {
                    hideNShowBtn.addEventListener('click', () => {
                        hideNShowBtn.classList.toggle('active');
                        if (hideNShowBtn.classList.contains('active')) {
                            perElBoxInt.style.display = 'flex';
                            icon.style.rotate = '180deg';
                        } else {
                            perElBoxInt.style.display = 'none';
                            icon.style.rotate = '0deg';
                        }
                    });
                }
            }

            ficha.pericias[i].forEach(per => {
                const perElBox = document.createElement('div')
                perElBox.classList = "perDisplayBlock"
                if (per == '') return;


                const perElName = document.createElement('span')
                perElName.textContent = per
                if(ficha.bonus.includes(per)) {
                    perElName.style.color = "yellow"
                    perElName.textContent += " (+3)"
                } 
                const perElBtn = document.createElement('button')
                perElBtn.addEventListener('click', () => {
                    rollDice(per)
                })
                perElBtn.textContent = "Rolar"
                perElBox.appendChild(perElName)
                perElBox.appendChild(perElBtn)
                perElBoxInt.appendChild(perElBox)
            });
            document.getElementById('pericias-display').appendChild(el)
    }
}

function perLvl(per, withBonus = false) {
    for (let i = 0; i < 6; i++) {
        if (ficha.pericias[i].includes(per)) return i;
        console.log(i)
    }
}
