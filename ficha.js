var ficha = { 
    assinatura: "FichaSuspirosDaRealidade",
    versão: siteVersion,
    imagem: "",
    nome: "",
    idade: 0,
    sexo: "",
    dataNascimento: "",

    ConhecimentoMagico: 0,
    origem: [],

    tipo: 0,
    raça: 0,
    elementos: [],
    status: {
        vida: 0,
        magia: 0,
        medo: 0,
        
        vidaMax: 0,
        magiaMax: 0,
        medoMax: 0
    },
    pericias: [
        [], //0
        [], //1
        [], //2
        [], //3
        [], //4
        []  //5
    ],

    bonus: [],


    pontos: 0,
    habilidades: [],
    magias: [],
    inventario: {
        content: [],
        guardados: [],
        usando: "",
        weapon: {},
        additionalWeight: 0
    },
    traumas: [],
    biografia: {
        familia: "",
        gostos: "",
        desgostos: "",
        medos: "",
        contatos: "",
        historia: "",
        comportamento: "",
        dinheiro: ""
    },
    options: {
      wallpaper: 0,
      statusModifier: false,
      perForDices: false,
      translucidPer: false,
      blurPer: false,
      blurPerValue: 5,
      autoSave: false
    },
    mods :[],
    customStatus: [],
    customWallpaper: {},
};

// PUTA QUE PARIU QUE NOTIFICAÇÃO ARROMBADA

const notionText = "Seu save foi atualizado para a versão mais recente " + ficha.versão + "!Verifique a lista de updates";

const defaultFicha = JSON.parse(JSON.stringify(ficha));
let saveUpdated = false;

function mergeFicha(loadedFicha) {
    saveUpdated = false;
    const mergedFicha = JSON.parse(JSON.stringify(defaultFicha));

    function recursiveMerge(target, source) {
        for (const key in source) {
            if (source.hasOwnProperty(key)) {
                if (target.hasOwnProperty(key)) {
                    if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
                        recursiveMerge(target[key], source[key]);
                    } else {
                        target[key] = source[key];
                    }
                } else {
                    target[key] = source[key];
                }
            }
        }
    }

    recursiveMerge(mergedFicha, loadedFicha);
    return mergedFicha;
}

/**
 * Baixa um objeto JavaScript como um arquivo JSON e permite que ele seja carregado.
 *
 * @param {object} data O objeto JavaScript a ser baixado.
 * @param {string} filename O nome do arquivo JSON a ser criado.
 */
function baixarObjetoComoJSON(data, filename) {
  // Converte o objeto para uma string JSON
  const jsonString = JSON.stringify(data, null, 2); // O "null" e o "2" são para formatação (indentação)

  // Cria um Blob (objeto binário grande) contendo a string JSON
  const blob = new Blob([jsonString], { type: 'application/json' });

  // Cria um link temporário para download
  const url = URL.createObjectURL(blob);

  // Cria um elemento <a> (link)
  const a = document.createElement('a');
  a.href = url;
  a.download = filename + '.json'; // Define o nome do arquivo
  document.body.appendChild(a); // Adiciona o link ao DOM (necessário para funcionar)
  a.click(); // Simula um clique no link para iniciar o download
  document.body.removeChild(a); // Remove o link do DOM
  URL.revokeObjectURL(url); // Libera a URL do objeto para liberar memória
}

/**
 * Função para carregar um arquivo JSON e retornar o objeto JavaScript.
 *
 * @param {File} file O arquivo JSON a ser carregado.
 * @returns {Promise<object>} Uma Promise que resolve para o objeto JavaScript, ou rejeita em caso de erro.
 */
function carregarObjetoJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        resolve(data);
      } catch (error) {
        reject(new Error('Erro ao analisar o JSON: ' + error.message));
      }
    };

    reader.onerror = (event) => {
      reject(new Error('Erro ao ler o arquivo: ' + event.target.error));
    };

    reader.readAsText(file);
  });
}

const inputArquivo = document.getElementById('arquivoJSON');

if (inputArquivo) {
  inputArquivo.addEventListener('change', (event) => {
    const arquivo = event.target.files[0]; // Pega o primeiro arquivo selecionado

    if (arquivo) {
      carregarObjetoJSON(arquivo).then((dadosCarregados) => {
        if (!dadosCarregados.nome/* !dadosCarregados.assinatura == "FichaSuspirosDaRealidade"*/) {
          alert("Insira um arquivo valido!")
          return;
        }

        if (dadosCarregados.versão == ficha.versão) saveUpdated = true;
        console.log('Dados carregados:', dadosCarregados, 'versão:', dadosCarregados.versão);
        if (!dadosCarregados.versão) {
            panelOpen(false, 'ATUALIZAÇÃO', 'o sistema de pericias foi atualizados, vá em Personagem > Editar pericias para adicionar suas pericias')
            fichaComPericiasAntigas = true
        }
        ficha = mergeFicha(dadosCarregados);

            if (!saveUpdated) {

              setTimeout(() => {
                  document.getElementById("update-notification-text").innerHTML = notionText
                  const notification = document.getElementById('update-notification');
                  if (notification) {
                    notification.style.display = 'block';
                  }
              }, 2000);
            }

            CarregarFicha()
        })
        .catch((erro) => {
          console.error('Erro ao carregar o arquivo:', erro);
          alert('Erro ao carregar o arquivo: ' + erro.message); // Exibe uma mensagem de erro ao usuário
        });
    }
  });
} else {
  console.warn('Elemento <input type="file" id="arquivoJSON"> não encontrado no HTML.');
}

// Eventos

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

    if (!loadedFicha.versão == ficha.versão) {
        setTimeout(() => {
            const notification = document.getElementById('update-notification');
            if (notification) {
                notification.style.display = 'block';
            }
        }, 2000);
    }
    
    ficha = mergeFicha(loadedFicha);

    CarregarFicha()

}

function CarregarFicha() {
    
    if (!debug) loadScream( localStorage.getItem('fastLogin')? 2: 4)

    setTimeout(() => {
        imageField.value = ficha.imagem
        RenderPlayerImage()
        reloadMods()
        irParaJogo();
        displayPericias();
        renderTraumas()
        renderTotalWeight()
        renderWeaponArea()
        renderGuardados()
        renderInventory()
        setWallpaper(ficha.options.wallpaper)
        loadUserOptions()
        //ficha.biografia.comportamento = ficha.biografia.contatos
    
        habilidadesContent.innerHTML = '';
        magiasContent.innerHTML = '';
    
        if (ficha.habilidades && Array.isArray(ficha.habilidades)) {
            ficha.habilidades.forEach(h => {
                createAbility(h.name, h.description, h.dice, true)
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
    
    
        prDiv = Pr
        cF.remove()
        renderMagias(); // Call renderMagias after all magic items are processed
        statusAtu()
    }, debug? 0:2000)
}
