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

const rollResult = document.getElementById("rollResult");
const rollResultTypeBackText = document.getElementById('rollResultTypeBackText');
const rollResultType = document.getElementById("rollResultType")
const diceInput = document.getElementById("diceInput");
const diceDiv = document.getElementById("dice-div")
const diceDivShow =document.querySelector("#dice-div div")

const DICE_MULTIPLIER_REGEX = /^(\d+)\*d(\d+)$/i;
const DICE_EXPRESSION_REGEX = /^[+-]?((\d+d\d+)|(\d+))(\s*[+-]\s*((\d+d\d+)|(\d+)))*$/i;

var hideDiceResultBlocked = false

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Rolagens Dinâmicas
function isValidDiceExpression(diceString) {
    return DICE_MULTIPLIER_REGEX.test(diceString) || DICE_EXPRESSION_REGEX.test(diceString);
}

function rollDiceExpression(diceString) {
    const normalizedDiceString = diceString.replace(/\s+/g, "");
    const parts = normalizedDiceString.match(/[+-]?[^+-]+/g) || [];
    let total = 0;

    for (const part of parts) {
        const sign = part.startsWith("-") ? -1 : 1;
        const value = part.replace(/^[+-]/, "");
        const diceMatch = value.match(/^(\d+)d(\d+)$/i);

        if (diceMatch) {
            const quantity = parseInt(diceMatch[1]);
            const sides = parseInt(diceMatch[2]);
            for (let i = 0; i < quantity; i++) {
                total += sign * getRandomNumber(1, sides);
            }
        } else {
            total += sign * parseInt(value);
        }
    }

    return total;
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
    rollResult.textContent = total;
}

function closeDiceMultiplierPanel() {
    const panel = document.getElementById('dice-multiplier-panel');
    panel.style.display = 'none';
}

/*
function rollDice(per, damage = false) {

    const diceString = diceInput.value;
    const multiplierMatch = diceString.match(DICE_MULTIPLIER_REGEX);

    if (multiplierMatch) {
        const maxDice = parseInt(multiplierMatch[1]);
        const sides = parseInt(multiplierMatch[2]);
        openDiceMultiplierPanel(maxDice, sides);
        return;
    }
    
    if (!isValidDiceExpression(diceString)) {
        rollResult.textContent = "Formato de dado inválido. Use [quantidade]d[dado], números, +, -, ou [numero]*d[dado]. Ex: 1d6, 1d20+5, 1d12-2, 4*d20";
        return;
    }

    
    const total = rollDiceExpression(diceString);
    let type;

    if (per) {
        type = verificarResultado(total, per).type
        rollResultType.textContent = total != 1? type : "Dessastre";
        rollResultType.style.color = type == "Extremo" ? "purple" : type == "Bom" ? "green" : type == "Normal" ? "white" : total == 1 ? "red" : "gray";
    } else {
        rollResultType.style.color = "white"
        rollResultType.textContent = "--";
        if (damage) { 
            rollResultType.textContent = "de Dano"; 
            diceDivShow.style.background = "linear-gradient(90deg, rgba(2, 0, 36, 0) 0%, rgb(128, 16, 16) 50%, rgba(0, 0, 0, 0) 100%)";
        }
    }

    rollResult.textContent = total;
    diceDiv.style.opacity = "1"
    diceDiv.style.pointerEvents = "all"
    setTimeout(()=> {
        rollResultTypeBackText.style.opacity = "1"
    }, 3000)

    return {value: total, type: type};
}*/


function rollDice(per, dice = false, damage = false) {

    
    if (dice != false){
        diceInput.value = dice;
    }
    if (damage != false) {
        diceInput.value = damage;
    }
    if (per) {
        const lvl = perLvl(per)

        let DICE_QUANT = 1
        let DICE_SOM = 0
        if (lvl >= 3) DICE_QUANT = 2
        if (lvl == 2|| lvl == 4) DICE_SOM = 2
        if (lvl == 5) DICE_SOM = 7
        
        if (ficha.bonus.includes(per)) DICE_SOM += 3
        if (DICE_SOM != 0) DICE_SOM = "+" + DICE_SOM
        else DICE_SOM = ""
        if (lvl == 0) DICE_SOM = "-6"
        if (lvl == 0 && ficha.bonus.includes(per)) DICE_SOM = "+2"

        diceInput.value = DICE_QUANT + "d20" + DICE_SOM
        console.log(DICE_QUANT + "d20" + DICE_SOM)
    }

    const diceString = diceInput.value;
    const multiplierMatch = diceString.match(DICE_MULTIPLIER_REGEX);

    if (multiplierMatch) {
        const maxDice = parseInt(multiplierMatch[1]);
        const sides = parseInt(multiplierMatch[2]);
        openDiceMultiplierPanel(maxDice, sides);
        return;
    }
    
    if (!isValidDiceExpression(diceString)) {
        rollResult.textContent = "Formato de dado inválido. Use [quantidade]d[dado], números, +, -, ou [numero]*d[dado]. Ex: 1d6, 1d20+5, 1d12-2, 4*d20";
        return;
    }
    
    const total = rollDiceExpression(diceString);

    if (per) {
        rollResultType.textContent = diceString
    }
    if (damage) { 
        rollResultType.textContent = "de Dano"; 
        diceDivShow.style.background = "linear-gradient(90deg, rgba(2, 0, 36, 0) 0%, rgb(128, 16, 16) 50%, rgba(0, 0, 0, 0) 100%)";
    }

    rollResult.textContent = total;
    diceDiv.style.opacity = "1"
    diceDiv.style.pointerEvents = "all"
    setTimeout(()=> {
        rollResultTypeBackText.style.opacity = "1"
    }, 3000)

    return total;
}

function hideDiceResult(priority = false) {
    if (hideDiceResultBlocked && !priority) return;
    rollResultTypeBackText.style.opacity = "0"
    diceDiv.style.opacity = "0"
    diceDiv.style.pointerEvents = "none"
    setTimeout(() => {
        diceDivShow.style.background = "linear-gradient(90deg, rgba(2, 0, 36, 0) 0%, rgb(0, 0, 0) 50%, rgba(0, 0, 0, 0) 100%)";
    }, 500);

}

