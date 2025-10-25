var ficha = { 
    nome: "",
    idade: 0,

    ConhecimentoMagico: 0,
    origem: [],
    tipo: 0,
    raça: 0,
    peso: 62,
    altura: 165,
    elementos: [],
    status: {
        vida: 0,
        pontosDeMagia: 0,
        medo: 0,
        
        vidaMax: 0,
        pontosDeMagiaMax: 0,
        medoMax: 0
    },
    pericias: {
        Lábia: {value: 1, min: 0, max: 16, editable: true},
        Aparência: {value: 1, min: 0, max: 16, editable: true},
        Intimidar: {value: 1, min: 0, max: 16, editable: true},
        Poder: {value: 1, min: 0, max: 16, editable: true},
        Sorte: {value: 1, min: 0, max: 16, editable: true},
        Força: {value: 1, min: 0, max: 16, editable: true},
        Corpo: {value: 1, min: 0, max: 16, editable: false},
        Constituição: {value: 1, min: 0, max: 16, editable: true},
        Destreza: {value: 1, min: 0, max: 16, editable: true},
        Inteligência: {value: 1, min: 0, max: 16, editable: true},
        Percepção: {value: 1, min: 0, max: 16, editable: true},
        Estabilidade: {value: 1, min: 0, max: 16, editable: true},
        ArmasBrancas: {value: 1, min: 0, max: 16, editable: true},
        Pistolas: {value: 1, min: 0, max: 16, editable: true},
        Rifles: {value: 1, min: 0, max: 16, editable: true},
        LongoAlcance: {value: 1, min: 0, max: 16, editable: true},
        Arremeçar: {value: 1, min: 0, max: 16, editable: true},
        Movimento: {value: 1, min: 0, max: 16, editable: false},
        Furtividade: {value: 1, min: 0, max: 16, editable: false},
        Esquiva: {value: 1, min: 0, max: 16, editable: false},
        Acrobacia: {value: 1, min: 0, max: 16, editable: true},
        ContraAtaque: {value: 1, min: 0, max: 16, editable: false},
        Magia: {value: 1, min: 0, max: 16, editable: true},
        Alquimia: {value: 1, min: 0, max: 16, editable: true},
        Ocultismo: {value: 1, min: 0, max: 16, editable: true},
        História: {value: 1, min: 0, max: 16, editable: true},
        Mecanica: {value: 1, min: 0, max: 16, editable: true},
        UsarComputadores: {value: 1, min: 0, max: 16, editable: true},
        Sobrevivência: {value: 1, min: 0, max: 16, editable: true},
        Música: {value: 1, min: 0, max: 16, editable: true},
        ConhecimentosGerais: {value: 1, min: 0, max: 16, editable: true},
        Linguas: {value: 1, min: 0, max: 16, editable: true},
        Medicina: {value: 1, min: 0, max: 16, editable: true},
        Ciência: {value: 1, min: 0, max: 16, editable: true},
        Aprendizado: {value: 1, min: 0, max: 16, editable: true}
    },
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
        contatosProximos: "",
        historia: "",
        comportamento: ""
    }

};

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

// Exemplo de uso:

// 2. Carregando um objeto:

// Primeiro, você precisa ter um elemento <input type="file"> no seu HTML:
// <input type="file" id="arquivoJSON">

const inputArquivo = document.getElementById('arquivoJSON');

if (inputArquivo) {
  inputArquivo.addEventListener('change', (event) => {
    const arquivo = event.target.files[0]; // Pega o primeiro arquivo selecionado

    if (arquivo) {
      carregarObjetoJSON(arquivo)
        .then((dadosCarregados) => {
          console.log('Dados carregados:', dadosCarregados);
          ficha = dadosCarregados;

            irParaJogo()
            renderTraumas()
            updateTotalWeight()
            updateWeaponArea()
            renderGuardados()
            renderInventory()

            ficha.habilidades.forEach(h => {
                addHabilidade(h.name, h.description, h.dice, true)
            });

            ficha.magias.forEach(m => {
                magicName.value = m.name;
                magicDescription.value = m.description;
                magicDice.value = m.dice;
                createMagic(true)
            });
          // Faça algo com os dados carregados aqui (por exemplo, exiba-os na tela)
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
