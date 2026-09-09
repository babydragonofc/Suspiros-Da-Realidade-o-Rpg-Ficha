
const diceInput = document.getElementById("diceInput");
const resultadoFinalDeRolagem = document.getElementById("resultadoFinalDeRolagem");
const rollResultTypeBackText = document.getElementById('rollResultTypeBackText');
const descriçãoDeRolagem = document.getElementById("descriçãoDeRolagem")
const divDeRolagem = document.getElementById("divDeRolagem")
const fundoDeDivDeRolagem = document.querySelector("#divDeRolagem div")

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
    const rolls = [];

    for (const part of parts) {

        const sign = part.startsWith("-") ? -1 : 1;
        const value = part.replace(/^[+-]/, "");

        const diceMatch = value.match(/^(\d+)d(\d+)$/i);

        if (diceMatch) {

            const quantity = parseInt(diceMatch[1]);
            const sides = parseInt(diceMatch[2]);

            for (let i = 0; i < quantity; i++) {

                const roll = getRandomNumber(1, sides);

                total += sign * roll;

                rolls.push({
                    dice: `d${sides}`,
                    value: roll,
                    sign: sign
                });
            }

        } else {

            const number = parseInt(value);

            total += sign * number;
        }
    }

    return {
        total: total,
        rolls: rolls
    };
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
    resultadoFinalDeRolagem.textContent = total;
}

function closeDiceMultiplierPanel() {
    const panel = document.getElementById('dice-multiplier-panel');
    panel.style.display = 'none';
}

var vantagens = 0;

/**
 * 
 * @param {string} value dados a serem jogados | em "per", será o nome da pericia
 * @param {string} type tipo de rolagem : "per", "damage", "dice"
 * @returns 
 */
function rollDice(value, type = "dice") {
    
    if (type == "dice"){
        diceInput.value = value;
    }
    if (type == "damage") {
        diceInput.value = value;
    }
    if (type == "per") {
        const lvl = perLvl(value)

        if (lvl == 0) MAIN_DICE = "1d8";
        if (lvl == 1) MAIN_DICE = "1d12";
        if (lvl == 2) MAIN_DICE = "1d12+1d6";
        if (lvl == 3) MAIN_DICE = "1d12+1d8";
        if (lvl == 4) MAIN_DICE = "1d12+1d12";
        if (lvl == 5) MAIN_DICE = "1d20+1d6";

        const periciaTreinada = ficha.ocupação.pericias.includes(value)? 1: null;
        const vantagemFinal = periciaTreinada||vantagens>0? "+ "+ PASSOS_DE_DADOS[vantagens + periciaTreinada]: ""; 

        diceInput.value = `${MAIN_DICE + vantagemFinal}`;
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
        resultadoFinalDeRolagem.textContent = "Formato de dado inválido. Use [quantidade]d[dado], números, +, -, ou [numero]*d[dado]. Ex: 1d6, 1d20+5, 1d12-2, 4*d20";
        return;
    }
    
    const rolagem = rollDiceExpression(diceString);

    let descriçãoDeDados = ""
    rolagem.rolls.forEach((roll)=>{
        descriçãoDeDados += roll.dice
        descriçãoDeDados += ` (${roll.value}) `
    })

    if (type != "damage") {
        descriçãoDeRolagem.textContent = descriçãoDeDados;
    }
    else { 
        descriçãoDeRolagem.textContent = `de Dano \n ${descriçãoDeDados}`; 
        fundoDeDivDeRolagem.style.background = "linear-gradient(90deg, rgba(2, 0, 36, 0) 0%, rgb(128, 16, 16) 50%, rgba(0, 0, 0, 0) 100%)";
    }

    resultadoFinalDeRolagem.textContent = rolagem.total;
    divDeRolagem.style.opacity = "1"
    divDeRolagem.style.pointerEvents = "all"
    setTimeout(()=> {
        rollResultTypeBackText.style.opacity = "1"
    }, 3000)

    return rolagem.total;
}

function hideDiceResult(priority = false) {
    if (hideDiceResultBlocked && !priority) return;
    rollResultTypeBackText.style.opacity = "0"
    divDeRolagem.style.opacity = "0"
    divDeRolagem.style.pointerEvents = "none"
    setTimeout(() => {
        fundoDeDivDeRolagem.style.background = "linear-gradient(90deg, rgba(2, 0, 36, 0) 0%, rgb(0, 0, 0) 50%, rgba(0, 0, 0, 0) 100%)";
    }, 500);

}

