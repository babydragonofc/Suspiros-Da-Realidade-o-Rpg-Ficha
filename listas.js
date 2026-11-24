
const magiasContent = document.getElementsByClassName('magias-content')[0];
const habilidadesContent = document.getElementsByClassName('habilidades-content')[0];

// Renderização
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
        box.className = "carta-magia";
            if(!isMobileDevice()) {
                box.addEventListener('mouseenter', () => {
                    box.classList.add('hover')
                })
                box.addEventListener('mouseleave', () => {
                    box.classList.remove('hover')
                })
            }
            else {
                box.addEventListener('click', () => {
                    if(document.getElementsByClassName('hover')[0]) 
                    document.getElementsByClassName('hover')[0].classList.remove('hover');
                
                    box.classList.toggle('hover')
                })
            }
        const innerBox = document.createElement('div');
        innerBox.className = "carta-magia-interior";
        box.appendChild(innerBox);

        const frontSide = document.createElement('div');
        frontSide.className = "carta-magia-frente";
        const backSide = document.createElement('div');
        backSide.className = "carta-magia-verso";

        if (magic.isFavorite) {
            frontSide.classList.add('favoritado'); // Add a class for styling favorited items
        }

        const magicNameEl = document.createElement('h2');
        magicNameEl.className = "title";
        magicNameEl.style.color = "white";
        magicNameEl.textContent = magic.name;
        frontSide.appendChild(magicNameEl);

        const magicDescriptionEl = document.createElement('p');
        magicDescriptionEl.className = "descricao-magia container-rolagem";
        magicDescriptionEl.innerHTML = magic.description.replaceAll("\n", "<br>");
        backSide.appendChild(magicDescriptionEl);

        // Add favorite star icon
        const favoriteStar = document.createElement('span');
        favoriteStar.className = 'estrela-favorito';
        favoriteStar.innerHTML = '&#9733;'; // Unicode star character
        if (magic.isFavorite) {
            favoriteStar.style.display = "block";
        } else {
            favoriteStar.style.display = "none";
        }
        frontSide.appendChild(favoriteStar);

        const btnsDiv = document.createElement('div');
        btnsDiv.className = "grupo-botoes";
        backSide.appendChild(btnsDiv);

        if (magic.dice) {
            const rollBtn = document.createElement('button');
            rollBtn.className = 'btn';
            rollBtn.textContent = 'Rolar';
            rollBtn.onclick = (e) => {
                e.stopPropagation();
                rollDice(magic.dice, "dice");
            }
            btnsDiv.appendChild(rollBtn);
        }

        const editBtn = document.createElement('button');
        editBtn.className = 'btn';
        editBtn.textContent = 'Editar';
        btnsDiv.appendChild(editBtn)
        editBtn.addEventListener('click', () => {
            showMagicInfo(magic); // Pass the entire magic object
        });

        innerBox.appendChild(frontSide);
        innerBox.appendChild(backSide);

        magiasContent.appendChild(box);
    });
    registerScrollShadows()
    verifyAutoSave()
}
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
        box.className = "carta-habilidade";
        if(!isMobileDevice()) {
                box.addEventListener('mouseenter', () => {
                    box.classList.add('hover')
                })
                box.addEventListener('mouseleave', () => {
                    box.classList.remove('hover')
                })
            }
            else {
                box.addEventListener('click', () => {
                    if(document.getElementsByClassName('hover')[0]) 
                    document.getElementsByClassName('hover')[0].classList.remove('hover');
                
                    box.classList.toggle('hover')
                })
            }
        const innerBox = document.createElement('div');
        innerBox.className = "carta-habilidade-interior";
        box.appendChild(innerBox);

        const frontSide = document.createElement('div');
        frontSide.className = "carta-habilidade-frente";
        const backSide = document.createElement('div');
        backSide.className = "carta-habilidade-verso";

        if (ability.isFavorite) {
            frontSide.classList.add('favoritado'); // Add a class for styling favorited items
        }

        const abilityNameEl = document.createElement('h2');
        abilityNameEl.className = "title";
        abilityNameEl.style.color = "white";
        abilityNameEl.textContent = ability.name;
        frontSide.appendChild(abilityNameEl);

        const abilityDescriptionEl = document.createElement('p');
        abilityDescriptionEl.className = "descricao-habilidade container-rolagem";

        abilityDescriptionEl.textContent = ability.description;
        abilityDescriptionEl.style.whiteSpace = "pre-line";
        backSide.appendChild(abilityDescriptionEl);

        // Add favorite star icon
        const favoriteStar = document.createElement('span');
        favoriteStar.className = 'estrela-favorito';
        favoriteStar.innerHTML = '&#9733;'; // Unicode star character
        if (ability.isFavorite) {
            favoriteStar.style.display = "block";
        } else {
            favoriteStar.style.display = "none";
        }
        frontSide.appendChild(favoriteStar);

        const btnsDiv = document.createElement('div');
        btnsDiv.className = "grupo-botoes";
        backSide.appendChild(btnsDiv);

        if (ability.dice) {
            const rollBtn = document.createElement('button');
            rollBtn.className = 'btn';
            rollBtn.textContent = 'Rolar';
            rollBtn.onclick = (e) => {
                e.stopPropagation();
                rollDice(ability.dice, "dice");
            }
            btnsDiv.appendChild(rollBtn);
        }

        const editBtn = document.createElement('button');
        editBtn.className = 'btn';
        editBtn.textContent = 'Editar';
        btnsDiv.appendChild(editBtn)
        editBtn.addEventListener('click', () => {
            showAbilityInfo(ability); // Pass the entire magic object
        });

        innerBox.appendChild(frontSide);
        innerBox.appendChild(backSide);

        habilidadesContent.appendChild(box);
    });
    verifyAutoSave()
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
        traumaCard.className = 'carta-trauma';
        traumaCard.textContent = trauma.name;
        traumaCard.dataset.traumaId = trauma.id; // Assuming trauma objects have an 'id' property
        
        traumaCard.addEventListener('click', (event) => {
            showTraumaInfo(trauma); // Pass the trauma object
        });

        traumaContainer.appendChild(traumaCard);
    });
    verifyAutoSave()
}

// Magias
const magicName = document.getElementById('magicName')
const magicDescription = document.getElementById('magicDescription')
const magicDice = document.getElementById('magicDice')

function startMagicCreation() {
    panelOpen("MagicCreate")
    magicName.value = ""
    magicDescription.value = ""
    magicDice.value = ""
}

function createMagic(load = false) {
    const diceString = magicDice.value;

    if (diceString && !isValidDiceExpression(diceString)) {
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

function showMagicInfo(magic) {
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
            rollDice(magic.dice, "dice");
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
    deleteBtn.className = 'btn botao-excluir';
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

//Habilidades
const abilityName = document.getElementById('abilityName');
const abilityDescription = document.getElementById('abilityDescription');
const abilityDice = document.getElementById('abilityDice');

function startAbilityCreation() {
    panelOpen("AbilityCreate");
    abilityName.value = "";
    abilityDescription.value = "";
    abilityDice.value = "";
}

document.getElementById('abilityCreateBtn').addEventListener('click', function() {
    createAbility(abilityName.value, abilityDescription.value, abilityDice.value, load = false)
    console.log("a")
})

function createAbility(nome, descricao, dado, load = false) {
    if(!nome&&!descricao) return;
    const abilityVar = {
        name: nome,
        description: descricao,
        dice: dado,
        isFavorite: false
    };

    if (!ficha.habilidades.some(h => h.name === nome) && !load) {
        ficha.habilidades.push(abilityVar);
    }

    panelClose()
    renderHabilidades()
}

function showAbilityInfo(ability) {
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
            rollDice(ability.dice, "dice");
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
    deleteBtn.className = 'btn botao-excluir';
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

//Traumas
function startTraumaCreation() {
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
    deleteBtn.className = 'btn botao-excluir';
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

const preset = {
    "armas": [
    // ARMAS BRANCAS - PEQUENAS - CORTE
    {
        name: "Faca de cozinha",
        description: "Uma faca comum, encontrada facilmente em cozinhas.",
        weight: 2,
        type: "arma",
        data: { type: "branca", size: "pequena", category: "corte", damage: "1d8", critical: "1d8 + Força" }
    },
    {
        name: "Faca",
        description: "Uma faca simples e versátil.",
        weight: 2,
        type: "arma",
        data: { type: "branca", size: "pequena", category: "corte", damage: "1d10", critical: "1d10 + Força" }
    },
    {
        name: "Faca de caça",
        description: "Faca resistente, feita para atividades de caça e sobrevivência.",
        weight: 2,
        type: "arma",
        data: { type: "branca", size: "pequena", category: "corte", damage: "1d10", critical: "12 + Força" }
    },
    {
        name: "Faca de corte",
        description: "Lâmina extremamente afiada, capaz de causar ferimentos profundos.",
        weight: 2,
        type: "arma",
        data: { type: "branca", size: "pequena", category: "corte", damage: "1d10 + Sangramento", critical: "10 + Sangramento" }
    },
    {
        name: "Foice de mão",
        description: "Pequena foice usada principalmente para cortar vegetação.",
        weight: 2,
        type: "arma",
        data: { type: "branca", size: "pequena", category: "corte", damage: "1d10", critical: "1d10 + 1d6" }
    },
    {
        name: "Canivete",
        description: "Pequena lâmina dobrável, fácil de esconder e transportar.",
        weight: 1,
        type: "arma",
        data: { type: "branca", size: "pequena", category: "corte", damage: "1d6", critical: "1d8 + Força" }
    },
    {
        name: "Adaga",
        description: "Lâmina curta feita principalmente para estocadas.",
        weight: 2,
        type: "arma",
        data: { type: "branca", size: "pequena", category: "corte", damage: "1d8", critical: "1d8 + Destreza" }
    },
    {
        name: "Estilete",
        description: "Lâmina fina e pequena, adequada para golpes precisos.",
        weight: 1,
        type: "arma",
        data: { type: "branca", size: "pequena", category: "corte", damage: "1d4 + Destreza", critical: "6 + Destreza" }
    },

    // ARMAS BRANCAS - PEQUENAS - CONTUSÃO
    {
        name: "Soco inglês",
        description: "Arma metálica colocada sobre os dedos para aumentar o impacto dos socos.",
        weight: 1,
        type: "arma",
        data: { type: "branca", size: "pequena", category: "contusao", damage: "1d6 + Força", critical: "8 + Força" }
    },
    {
        name: "Martelo de unha",
        description: "Ferramenta pesada que pode ser utilizada como arma improvisada.",
        weight: 2,
        type: "arma",
        data: { type: "branca", size: "pequena", category: "contusao", damage: "1d8 + Força", critical: "10 + Força" }
    },
    {
        name: "Cassetete",
        description: "Bastão curto utilizado para desferir golpes contundentes.",
        weight: 2,
        type: "arma",
        data: { type: "branca", size: "pequena", category: "contusao", damage: "1d8", critical: "1d8 + Força" }
    },
    {
        name: "Chave inglesa",
        description: "Ferramenta pesada capaz de causar fortes impactos.",
        weight: 3,
        type: "arma",
        data: { type: "branca", size: "pequena", category: "contusao", damage: "1d8 + Força", critical: "2d6 + Força" }
    },

    // ARMAS BRANCAS - MÉDIAS - CORTE
    {
        name: "Espada",
        description: "Arma equilibrada, capaz de realizar cortes e estocadas.",
        weight: 3,
        type: "arma",
        data: { type: "branca", size: "media", category: "corte", damage: "1d12", critical: "2x" }
    },
    {
        name: "Katana",
        description: "Espada japonesa leve, favorecendo golpes rápidos e precisos.",
        weight: 3,
        type: "arma",
        data: { type: "branca", size: "media", category: "corte", damage: "1d10 + Destreza", critical: "2x" }
    },
    {
        name: "Foice",
        description: "Lâmina curva presa a um cabo, capaz de realizar cortes amplos.",
        weight: 3,
        type: "arma",
        data: { type: "branca", size: "media", category: "corte", damage: "1d10", critical: "1d12 + Destreza" }
    },
    {
        name: "Sabre",
        description: "Espada de lâmina curva, leve e adequada para cortes rápidos.",
        weight: 3,
        type: "arma",
        data: { type: "branca", size: "media", category: "corte", damage: "1d10 + Destreza + Sangramento (Constituição DT 6 resiste)", critical: "2x + Sangramento (Constituição DT 10 resiste)" }
    },
    {
        name: "Rapieira",
        description: "Espada fina e longa, especializada em estocadas.",
        weight: 3,
        type: "arma",
        data: { type: "branca", size: "media", category: "corte", damage: "1d8 + Destreza", critical: "2x + Sangramento" }
    },
    {
        name: "Kukri",
        description: "Lâmina curva e pesada, projetada para cortes fortes.",
        weight: 3,
        type: "arma",
        data: { type: "branca", size: "media", category: "corte", damage: "1d10", critical: "1d10 + Sangramento" }
    },

    // ARMAS BRANCAS - MÉDIAS - CONTUSÃO
    {
        name: "Taco",
        description: "Simples, comum e fácil de encontrar.",
        weight: 3,
        type: "arma",
        data: { type: "branca", size: "media", category: "contusao", damage: "1d10 + Força", critical: "2d8" }
    },
    {
        name: "Bastão reforçado",
        description: "Um bastão mais pesado e resistente, feito para suportar impactos.",
        weight: 3,
        type: "arma",
        data: { type: "branca", size: "media", category: "contusao", damage: "1d10 + Força", critical: "1d12 + Força" }
    },
    {
        name: "Porrete",
        description: "Pedaço de madeira pesado, geralmente improvisado.",
        weight: 3,
        type: "arma",
        data: { type: "branca", size: "media", category: "contusao", damage: "1d10", critical: "1d12 + Força" }
    },
    {
        name: "Pé de cabra",
        description: "Ferramenta pesada de metal que pode ser usada para golpes.",
        weight: 3,
        type: "arma",
        data: { type: "branca", size: "media", category: "contusao", damage: "1d10 + Força", critical: "2d8 + Força" }
    },

    // ARMAS BRANCAS - GRANDES - CORTE
    {
        name: "Espada Longa",
        description: "Espada de duas mãos com uma lâmina longa e pesada.",
        weight: 5,
        type: "arma",
        data: { type: "branca", size: "grande", category: "corte", damage: "1d12", critical: "1d12 + Força" }
    },
    {
        name: "Machado Longo",
        description: "Machado preso a um cabo comprido, aumentando seu alcance e força de impacto.",
        weight: 5,
        type: "arma",
        data: { type: "branca", size: "grande", category: "corte", damage: "1d10 + Força", critical: "2d10 + Força" }
    },
    {
        name: "Montante",
        description: "Espada extremamente grande e pesada, utilizada com ambas as mãos.",
        weight: 5,
        type: "arma",
        data: { type: "branca", size: "grande", category: "corte", damage: "2d8", critical: "2x" }
    },
    {
        name: "Alabarda",
        description: "Arma de haste longa que combina uma lâmina de machado com uma ponta de lança.",
        weight: 5,
        type: "arma",
        data: { type: "branca", size: "grande", category: "corte", damage: "1d12", critical: "1d12 + Força" }
    },
    {
        name: "Lança",
        description: "Arma de haste longa terminada em uma ponta afiada.",
        weight: 5,
        type: "arma",
        data: { type: "branca", size: "grande", category: "corte", damage: "1d10", critical: "1d10 + Força" }
    },
    {
        name: "Glaive",
        description: "Arma de haste longa com uma grande lâmina curva na extremidade.",
        weight: 5,
        type: "arma",
        data: { type: "branca", size: "grande", category: "corte", damage: "1d10", critical: "1d10 + 1d6" }
    },

    // ARMAS BRANCAS - GRANDES - CONTUSÃO
    {
        name: "Marreta",
        description: "Ferramenta extremamente pesada capaz de causar impactos devastadores.",
        weight: 8,
        type: "arma",
        data: { type: "branca", size: "grande", category: "contusao", damage: "1d12 + Força", critical: "2d12 + Força" }
    },
    {
        name: "Maça Grande",
        description: "Arma pesada com uma cabeça metálica projetada para esmagar.",
        weight: 5,
        type: "arma",
        data: { type: "branca", size: "grande", category: "contusao", damage: "1d10 + Força", critical: "2d10 + Força" }
    },
    {
        name: "Bastão",
        description: "Arma simples e versátil, podendo ser usada para bloquear e golpear.",
        weight: 5,
        type: "arma",
        data: { type: "branca", size: "grande", category: "contusao", damage: "1d8 + Força", critical: "1d10 + Força" }
    },

    // PISTOLAS
    {
        name: "Estilingue",
        description: "Simples, improvisado, útil contra animais.",
        weight: 1,
        type: "arma",
        data: { type: "pistola", damage: "1d6", critical: "1d8", mmo: 0, maxMmo: 0 }
    },
    {
        name: "Revólver .38",
        description: "Arma simples e confiável, com capacidade limitada de munição.",
        weight: 2,
        type: "arma",
        data: { type: "pistola", damage: "1d8", critical: "1d12", mmo: 0, maxMmo: 6 }
    },
    {
        name: "Revólver de cano longo",
        description: "Revólver com cano alongado, favorecendo a precisão e o alcance.",
        weight: 2,
        type: "arma",
        data: { type: "pistola", damage: "1d10", critical: "1d12 + 1d8", mmo: 0, maxMmo: 8 }
    },
    {
        name: "Desert Eagle",
        description: "Pistola pesada de alto poder de fogo.",
        weight: 3,
        type: "arma",
        data: { type: "pistola", damage: "1d12", critical: "2d8", mmo: 0, maxMmo: 8 }
    },
    {
        name: "Pistola policial",
        description: "Pistola semiautomática equilibrada e de uso comum.",
        weight: 2,
        type: "arma",
        data: { type: "pistola", damage: "1d8", critical: "1d10", mmo: 0, maxMmo: 12 }
    },
    {
        name: "Sinalizador",
        description: "Uma arma de grande impacto e incineradora; um tiro deixa o alvo em chamas.",
        weight: 2,
        type: "arma",
        data: { type: "pistola", damage: "2d10", critical: "4d8", mmo: 0, maxMmo: 2 }
    },

    // RIFLES
    {
        name: "Rifle Bolt Action",
        description: "Rifle de ferrolho, preciso e potente, mas de baixa cadência.",
        weight: 5,
        type: "arma",
        data: { type: "rifle", damage: "1d12", critical: "2d10", mmo: 0, maxMmo: 5 }
    },
    {
        name: "Rifle Lever Action",
        description: "Rifle de alavanca com boa cadência e potência.",
        weight: 5,
        type: "arma",
        data: { type: "rifle", damage: "1d10", critical: "2d8", mmo: 0, maxMmo: 8 }
    },
    {
        name: "Fuzil de Assalto",
        description: "Arma automática versátil, adequada para combates prolongados.",
        weight: 5,
        type: "arma",
        data: { type: "rifle", damage: "1d10", critical: "2d8", mmo: 0, maxMmo: 24 }
    },
    {
        name: "Fuzil Antimaterial",
        description: "Rifle extremamente potente, projetado para atingir alvos resistentes.",
        weight: 8,
        type: "arma",
        data: { type: "rifle", damage: "2d12", critical: "4d12", mmo: 0, maxMmo: 5 }
    },
    {
        name: "Carabina",
        description: "Rifle compacto, equilibrando alcance, potência e mobilidade.",
        weight: 3,
        type: "arma",
        data: { type: "rifle", damage: "1d10", critical: "1d12 + 1d6", mmo: 0, maxMmo: 10 }
    },
    {
        name: "Escopeta",
        description: "Arma de alto impacto, especialmente perigosa em curta distância.",
        weight: 5,
        type: "arma",
        data: { type: "rifle", damage: "Curta: 4d8; Média: 2d8; Longa: 1d8", critical: "2x", mmo: 0, maxMmo: 2 }
    },

    // LONGO ALCANCE
    {
        name: "Sniper de Suporte",
        description: "Rifle de precisão voltado para disparos à distância.",
        weight: 5,
        type: "arma",
        data: { type: "longo_alcance", damage: "1d12", critical: "2d10", mmo: 0, maxMmo: 8 }
    },
    {
        name: "Sniper de Ação",
        description: "Rifle de precisão voltado para disparos rápidos durante o combate.",
        weight: 5,
        type: "arma",
        data: { type: "longo_alcance", damage: "2d8", critical: "2d12", mmo: 0, maxMmo: 10 }
    },
    {
        name: "Espingarda",
        description: "Arma de longo alcance especializada em disparos de alta dispersão.",
        weight: 5,
        type: "arma",
        data: { type: "longo_alcance", damage: "2d10", critical: "3d10", mmo: 0, maxMmo: 2 }
    }
    ],
    "municoes": [
    {
        name: "Bala de pistola",
        description: "Munição avulsa para pistola. Ao usar, recarrega 1 de munição da arma equipada.",
        weight: 0,
        type: "municao",
        data: { type: "bala", weapon: "pistola" }
    },
    {
        name: "Cartucho de pistola",
        description: "Cartucho completo para pistola. Recarrega a arma por inteiro, mas só pode ser usado quando a munição dela estiver zerada.",
        weight: 1,
        type: "municao",
        data: { type: "cartucho", weapon: "pistola" }
    },
    {
        name: "Bala de rifle",
        description: "Munição avulsa para rifle. Ao usar, recarrega 1 de munição da arma equipada.",
        weight: 0,
        type: "municao",
        data: { type: "bala", weapon: "rifle" }
    },
    {
        name: "Cartucho de rifle",
        description: "Cartucho completo para rifle. Recarrega a arma por inteiro, mas só pode ser usado quando a munição dela estiver zerada.",
        weight: 1,
        type: "municao",
        data: { type: "cartucho", weapon: "rifle" }
    },
    {
        name: "Bala de longo alcance",
        description: "Munição avulsa para arma de longo alcance. Ao usar, recarrega 1 de munição da arma equipada.",
        weight: 0,
        type: "municao",
        data: { type: "bala", weapon: "longo_alcance" }
    },
    {
        name: "Cartucho de longo alcance",
        description: "Cartucho completo para arma de longo alcance. Recarrega a arma por inteiro, mas só pode ser usado quando a munição dela estiver zerada.",
        weight: 1,
        type: "municao",
        data: { type: "cartucho", weapon: "longo_alcance" }
    }
    ],
    "vestimentas": [
        {
            name: "Casaco",
            description: "Roupas quentes e confortáveis. Oferece 2 de defesa a cortes e proteção térmica.",
            weight: 2,
            type: "vestimenta",
            data: {}
        },
        {
            name: "Roupa de viajante",
            description: "Roupas curtas e bem ventiladas, ideais para grandes viagens em regiões quentes. Oferece resistência completa ao calor.",
            weight: 1,
            type: "vestimenta",
            data: {}
        },
        {
            name: "Colete à prova de balas",
            description: "Roupas que protegem seu personagem de forma passiva contra tiros. Aumenta a DT de acertos de ataques cortantes em 3 e de tiros em 5.",
            weight: 3,
            type: "vestimenta",
            data: {}
        },
        {
            name: "Colete anticortes",
            description: "Roupas que protegem seu personagem de forma passiva contra cortes. Aumenta a DT de acertos de ataques cortantes em 5.",
            weight: 2,
            type: "vestimenta",
            data: {}
        },
        {
            name: "Roupa Flutuante",
            description: "Roupas que boiam na água. Oferece vantagem para nadar.",
            weight: 2,
            type: "vestimenta",
            data: {}
        },
        {
            name: "Roupa apropriada",
            description: "Não é uma roupa específica, mas roupas apropriadas em certas ocasiões, como fardas, ternos etc. Oferece vantagem em testes de Conversação.",
            weight: 2,
            type: "vestimenta",
            data: {}
        }
    ],

    "itens":[

    // DOCUMENTOS
    {
        name: "Diário",
        description: "Um diário pessoal.",
        weight: 1,
        type: "documento",
        data: {}
    },
    {
        name: "Mapa",
        description: "Um mapa da região, recebe vantagem em testes de jornada.",
        weight: 0,
        type: "documento",
        data: {}
    },
    {
        name: "Relatório de investigação",
        description: "Um documento contendo informações sobre um caso ou ocorrência.",
        weight: 0,
        type: "documento",
        data: {}
    },

    // ITENS COMUNS
    {
        name: "Lanterna",
        description: "Uma lanterna portátil utilizada para iluminar ambientes escuros.",
        weight: 1,
        type: "item",
        data: {}
    },
    {
        name: "Isqueiro",
        description: "Um pequeno isqueiro metálico.",
        weight: 0,
        type: "item",
        data: {}
    },
    {
        name: "Caixa de fósforos",
        description: "Uma pequena caixa contendo fósforos.",
        weight: 0,
        type: "item",
        data: {}
    },
    {
        name: "Corda",
        description: "Uma corda resistente, útil para escaladas e amarrações.",
        weight: 3,
        type: "item",
        data: {}
    },
    {
        name: "Fita adesiva",
        description: "Um rolo de fita adesiva resistente.",
        weight: 1,
        type: "item",
        data: {}
    },
    {
        name: "Binóculos",
        description: "Um instrumento óptico utilizado para observar objetos distantes. Oferece vantagem a testes de percepção à distância.",
        weight: 1,
        type: "item",
        data: {}
    },
    {
        name: "Câmera fotográfica",
        description: "Uma câmera utilizada para registrar imagens.",
        weight: 2,
        type: "item",
        data: {}
    },
    {
        name: "Rádio comunicador",
        description: "Um aparelho portátil utilizado para comunicação à distância.",
        weight: 2,
        type: "item",
        data: {}
    },
    {
        name: "Bandagem",
        description: "Um rolo de bandagens anestésicas. Cura 1d4 de vida, não cura lesão grave nem sangramento",
        weight: 2,
        type: "item",
        data: {}
    },
    {
        name: "Kit de primeiros socorros",
        description: "Uma pequena maleta contendo materiais básicos para tratar ferimentos. Cura 1d8 de vida, não cura lesão grave",
        weight: 2,
        type: "item",
        data: {}
    },
    {
        name: "Kit de primeiros socorros avançado",
        description: "Uma maleta contendo materiais mais avançados para tratar ferimentos. Cura 2d6 de vida",
        weight: 2,
        type: "item",
        data: {}
    },
    {
        name: "Espelho pequeno",
        description: "Um pequeno espelho de bolso.",
        weight: 0,
        type: "item",
        data: {}
    },
    {
        name: "Pé de cabra",
        description: "Uma ferramenta metálica utilizada para forçar aberturas e remover objetos.",
        weight: 3,
        type: "item",
        data: {}
    },
    {
        name: "Alicate",
        description: "Uma ferramenta utilizada para segurar, dobrar ou cortar materiais.",
        weight: 1,
        type: "item",
        data: {}
    },
    {
        name: "Bússola",
        description: "Um instrumento utilizado para orientação geográfica. Dá vantagem em testes de jornada",
        weight: 0,
        type: "item",
        data: {}
    },

    // EXPLORAÇÃO
    {
        name: "Detector de metais",
        description: "Um equipamento eletrônico capaz de identificar objetos metálicos próximos.",
        weight: 3,
        type: "item",
        data: {}
    },
    {
        name: "Câmera infravermelha",
        description: "Uma câmera capaz de registrar imagens utilizando radiação infravermelha.",
        weight: 3,
        type: "item",
        data: {}
    },
    {
        name: "Medidor de radiação",
        description: "Um aparelho utilizado para detectar e medir níveis de radiação.",
        weight: 1,
        type: "item",
        data: {}
    },
    {
        name: "Kit de escalada",
        description: "Um conjunto de equipamentos utilizados para escalar superfícies e estruturas.",
        weight: 3,
        type: "item",
        data: {}
    },
    {
        name: "Máscara de gás",
        description: "Uma máscara que protege o usuário contra determinados gases e partículas.",
        weight: 2,
        type: "item",
        data: {}
    },
    {
        name: "Kit de arrombamento",
        description: "Um conjunto de ferramentas pequenas utilizadas para abrir fechaduras. Oferece +1 tentativa por rodada para destravar trancas",
        weight: 1,
        type: "item",
        data: {}
    },
    {
        name: "Holofote portátil",
        description: "Uma fonte de iluminação potente, capaz de iluminar grandes áreas.",
        weight: 5,
        type: "item",
        data: {}
    },
    {
        name: "Localizador GPS",
        description: "Um aparelho eletrônico utilizado para identificar sua localização.",
        weight: 1,
        type: "item",
        data: {}
    },

    // CONSUMÍVEIS
    {
        name: "Analgésicos",
        description: "Medicamentos utilizados para aliviar dores. Cura 2 PV e 1 PE",
        weight: 0,
        type: "item",
        data: {}
    },
    {
        name: "Antisséptico",
        description: "Uma solução utilizada para limpar ferimentos e reduzir o risco de infecções. Pode ser utilizado para criar bandagens que curam lesão grave",
        weight: 1,
        type: "item",
        data: {}
    },
    {
        name: "Ataduras",
        description: "Faixas de tecido utilizadas para proteger e comprimir ferimentos. Cura sangramento",
        weight: 0,
        type: "item",
        data: {}
    },
    {
        name: "Energético",
        description: "Uma bebida estimulante. Dá 1d4 de PE, role Constituição DT 4; caso falhe, perde 1d4 de medo.",
        weight: 1,
        type: "item",
        data: {}
    },
    {
        name: "Sinalizador",
        description: "Um dispositivo luminoso utilizado para indicar uma localização ou pedir ajuda.",
        weight: 1,
        type: "item",
        data: {}
    },
    {
        name: "Pó fluorescente",
        description: "Um pó que brilha quando exposto à luz ultravioleta.",
        weight: 0,
        type: "item",
        data: {}
    },

    // ARTEFATOS
    {
        name: "Vela que nunca apaga",
        description: "Uma vela roxa com o símbolo de energia, cuja chama rosa permanece acesa mesmo diante de ventos ou tentativas de apagá-la.",
        weight: 0,
        type: "artefato",
        data: {}
    },
    {
        name: "Espelho rachado",
        description: "Um espelho antigo que, ocasionalmente, reflete lugares diferentes daqueles em que se encontra.",
        weight: 1,
        type: "artefato",
        data: {}
    },
    {
        name: "Relógio atrasado",
        description: "Um relógio de bolso que parece perder tempo quando está próximo de manifestações do Outro Lado.",
        weight: 1,
        type: "artefato",
        data: {}
    }
]

}