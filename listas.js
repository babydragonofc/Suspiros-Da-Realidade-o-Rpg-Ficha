
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
        box.className = "magic-card";
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
        innerBox.className = "magic-card-inner";
        box.appendChild(innerBox);

        const frontSide = document.createElement('div');
        frontSide.className = "magic-card-front";
        const backSide = document.createElement('div');
        backSide.className = "magic-card-back";

        if (magic.isFavorite) {
            frontSide.classList.add('favorited'); // Add a class for styling favorited items
        }

        const magicNameEl = document.createElement('h2');
        magicNameEl.className = "title";
        magicNameEl.style.color = "white";
        magicNameEl.textContent = magic.name;
        frontSide.appendChild(magicNameEl);

        const magicDescriptionEl = document.createElement('p');
        magicDescriptionEl.className = "magicDesc scroll-container";
        magicDescriptionEl.innerHTML = magic.description.replaceAll("\n", "<br>");
        backSide.appendChild(magicDescriptionEl);

        // Add favorite star icon
        const favoriteStar = document.createElement('span');
        favoriteStar.className = 'favorite-star';
        favoriteStar.innerHTML = '&#9733;'; // Unicode star character
        if (magic.isFavorite) {
            favoriteStar.style.display = "block";
        } else {
            favoriteStar.style.display = "none";
        }
        frontSide.appendChild(favoriteStar);

        const btnsDiv = document.createElement('div');
        btnsDiv.className = "btns-div";
        backSide.appendChild(btnsDiv);

        if (magic.dice) {
            const rollBtn = document.createElement('button');
            rollBtn.className = 'btn';
            rollBtn.textContent = 'Rolar';
            rollBtn.onclick = (e) => {
                e.stopPropagation();
                rollDice(false, magic.dice);
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
        box.className = "ability-card";
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
        innerBox.className = "ability-card-inner";
        box.appendChild(innerBox);

        const frontSide = document.createElement('div');
        frontSide.className = "ability-card-front";
        const backSide = document.createElement('div');
        backSide.className = "ability-card-back";

        if (ability.isFavorite) {
            frontSide.classList.add('favorited'); // Add a class for styling favorited items
        }

        const abilityNameEl = document.createElement('h2');
        abilityNameEl.className = "title";
        abilityNameEl.style.color = "white";
        abilityNameEl.textContent = ability.name;
        frontSide.appendChild(abilityNameEl);

        const abilityDescriptionEl = document.createElement('p');
        abilityDescriptionEl.className = "abilityDesc scroll-container";
        abilityDescriptionEl.innerHTML = ability.description.replaceAll("\n", "<br>");
        backSide.appendChild(abilityDescriptionEl);

        // Add favorite star icon
        const favoriteStar = document.createElement('span');
        favoriteStar.className = 'favorite-star';
        favoriteStar.innerHTML = '&#9733;'; // Unicode star character
        if (ability.isFavorite) {
            favoriteStar.style.display = "block";
        } else {
            favoriteStar.style.display = "none";
        }
        frontSide.appendChild(favoriteStar);

        const btnsDiv = document.createElement('div');
        btnsDiv.className = "btns-div";
        backSide.appendChild(btnsDiv);

        if (ability.dice) {
            const rollBtn = document.createElement('button');
            rollBtn.className = 'btn';
            rollBtn.textContent = 'Rolar';
            rollBtn.onclick = (e) => {
                e.stopPropagation();
                rollDice(false, ability.dice);
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
            rollDice(false, magic.dice);
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

function createAbility(nome, descricao, dado, load = false) {
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
            rollDice(false, ability.dice);
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
