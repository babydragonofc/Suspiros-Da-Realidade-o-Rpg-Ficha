// Sistema de Imagem de player

const imageField = document.getElementById("image-field")
const playerImg = document.getElementById("playerImg")

imageField.addEventListener('change', function() {
    RenderPlayerImage()
}); 

function RenderPlayerImage() {
    ficha.imagem = imageField.value
    playerImg.style.backgroundImage = "url(" + imageField.value + ")";
    verifyAutoSave()
}

// ====================== FUNDOS (papel de parede + cores do site) ======================
// COMO CRIAR UM FUNDO NOVO
//   • Sem mexer no código: Opções → Papel de Parede → "+ Criar fundo". Tem seletor de cores, prévia ao vivo
//     e "Sugerir cores pela imagem". O fundo fica salvo na ficha.
//   • Fixo no site: coloque a imagem em img/backgrounds/ e acrescente um item na lista `fundos` abaixo
//     (o botão "Copiar código" do criador já gera o item pronto). O botão aparece sozinho em Opções.
// CORES (só `principal` é obrigatória; o que faltar é calculado sozinho):
//   principal  = textos e linhas        terciaria = bordas e detalhes suaves    controle = destaque (barras, chaves)
//   botao / botaoHover / botaoTexto = botões     abaInativa = fundo das abas desligadas     secundaria = uso raro
// ATENÇÃO: a ordem da lista importa — as fichas salvas guardam o número do fundo escolhido. Novos vão no fim.
const fundos = [
    { nome: "Medo", imagem: "img/backgrounds/wallpaperMedo.png",
      cores: { principal: "white", terciaria: "#929292", controle: "#333333" } },
    { nome: "Realidade", imagem: "img/backgrounds/wallpaperRealidade.png",
      cores: { principal: "black", terciaria: "#160f0f", controle: "#333333",
               botao: "rgb(17, 2, 2)", botaoHover: "rgb(40, 3, 3)", botaoTexto: "white", abaInativa: "#0000007a" } },
    { nome: "Energia", imagem: "img/backgrounds/wallpaperEnergia.png",
      cores: { principal: "white", terciaria: "#555", controle: "#5E13CF" } },
    { nome: "Sangue", imagem: "img/backgrounds/wallpaperSangue.png",
      cores: { principal: "white", terciaria: "#c1c1c1", controle: "#CB0E09" } },
]

// ---- utilidades de cor
const contextoDeCor = document.createElement('canvas').getContext('2d')

function corParaRgb(cor) { // aceita nomes, #hex, rgb() e rgba()
    contextoDeCor.fillStyle = '#000000'
    contextoDeCor.fillStyle = cor
    const v = contextoDeCor.fillStyle
    if (v[0] == '#') return [1, 3, 5].map(p => parseInt(v.slice(p, p + 2), 16))
    return v.match(/[\d.]+/g).slice(0, 3).map(Number)
}

function rgbParaHex(rgb) {
    return '#' + rgb.map(x => Math.round(Math.max(0, Math.min(255, x))).toString(16).padStart(2, '0')).join('')
}

function luminanciaDaCor(rgb) {
    const [r, g, b] = rgb.map(x => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4 })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function misturarCores(cor, alvo, quanto) {
    const a = corParaRgb(cor), b = corParaRgb(alvo)
    return 'rgb(' + a.map((x, i) => Math.round(x + (b[i] - x) * quanto)).join(', ') + ')'
}

// Chaves antigas (usadas em mods e saves) → nomes em português
const chavesAntigasDeCor = { main: 'principal', sec: 'secundaria', btnBg: 'botao', btnHvr: 'botaoHover', btnTx: 'botaoTexto', ter: 'terciaria', uTb: 'abaInativa', sc: 'controle' }

function normalizarCores(c) {
    const saida = {}
    for (const [k, v] of Object.entries(c || {})) saida[chavesAntigasDeCor[k] || k] = v
    return saida
}

// Preenche o que faltar a partir da cor principal
function completarCores(entrada) {
    const c = normalizarCores(entrada)
    const principal = c.principal || 'white'
    const claro = luminanciaDaCor(corParaRgb(principal)) > 0.5
    const botao = c.botao || misturarCores(principal, claro ? 'black' : 'white', 0.063)
    return {
        principal,
        secundaria: c.secundaria || 'black',
        terciaria: c.terciaria || '#555',
        controle: c.controle || '#2196F3',
        botao,
        botaoHover: c.botaoHover || misturarCores(principal, claro ? 'black' : 'white', 0.196),
        botaoTexto: c.botaoTexto || (luminanciaDaCor(corParaRgb(botao)) > 0.5 ? 'black' : 'white'),
        abaInativa: c.abaInativa ?? ''
    }
}

// ---- aplicar um fundo na tela
function aplicarFundo(fundo) {
    const cores = completarCores(fundo.cores)
    const imagem = fundo.imagem ? 'url("' + String(fundo.imagem).replace(/"/g, '%22') + '")' : ''
    document.body.style.backgroundImage = imagem
    if (window.innerWidth < 500 && ficha.options.translucidPer) periciasDisplayer.style.backgroundImage = imagem
    const raiz = document.documentElement
    const variaveis = {
        '--cor-principal': cores.principal, '--cor-secundaria': cores.secundaria,
        '--botao-fundo': cores.botao, '--botao-fundo-hover': cores.botaoHover, '--botao-texto': cores.botaoTexto,
        '--cor-terciaria': cores.terciaria, '--cor-aba-inativa': cores.abaInativa, '--cor-controle': cores.controle
    }
    for (const [nome, valor] of Object.entries(variaveis)) raiz.style.setProperty(nome, valor)
}

function fundosPersonalizados() {
    if (!Array.isArray(ficha.fundosPersonalizados)) ficha.fundosPersonalizados = []
    return ficha.fundosPersonalizados
}

// value: número da lista `fundos`, 'p:<id>' (fundo criado pelo jogador) ou 'custom' (fundo de mod)
function setWallpaper(value) {
    if (value == 'custom') {
        setCustomWallpaper(ficha.customWallpaper)
        return;
    }
    if (typeof value == 'string' && value.startsWith('p:')) {
        const f = fundosPersonalizados().find(x => x.id == value.slice(2))
        if (f) {
            ficha.options.wallpaper = value
            aplicarFundo(f)
            marcarFundoAtivo()
            verifyAutoSave()
            return;
        }
        value = 0
    }
    value = Number(value)
    if (!fundos[value]) value = 0
    ficha.options.wallpaper = value
    aplicarFundo(fundos[value])
    marcarFundoAtivo()
    verifyAutoSave()
}

function setCustomWallpaper(settings) {
    ficha.options.wallpaper = 'custom';
    ficha.customWallpaper = settings;
    aplicarFundo({ imagem: settings.bg, cores: settings })
    marcarFundoAtivo()
    verifyAutoSave()
}

// ---- botões de fundo em Opções (gerados a partir da lista)
function renderBotoesFundos() {
    const area = document.getElementById('fundos-botoes')
    if (!area) return
    const botoes = fundos.map((f, i) => botaoDeFundo(f.nome, i, () => setWallpaper(i)))
    fundosPersonalizados().forEach(f => botoes.push(botaoDeFundo(f.nome, 'p:' + f.id, () => setWallpaper('p:' + f.id), f)))
    const novo = document.createElement('button')
    novo.className = 'btn'
    novo.textContent = '+ Criar fundo'
    novo.addEventListener('click', () => abrirEditorDeFundo())
    area.replaceChildren(...botoes, novo)
    marcarFundoAtivo()
}

function botaoDeFundo(nome, chave, aoClicar, personalizado) {
    const grupo = document.createElement('span')
    grupo.className = 'fundo-botao'
    grupo.dataset.chave = String(chave)
    const b = document.createElement('button')
    b.className = 'btn'
    b.textContent = nome
    b.addEventListener('click', aoClicar)
    grupo.appendChild(b)
    if (personalizado) {
        const editar = document.createElement('button')
        editar.className = 'btn fundo-botao-extra'
        editar.title = 'Editar este fundo'
        editar.textContent = '✎'
        editar.addEventListener('click', () => abrirEditorDeFundo(personalizado))
        grupo.appendChild(editar)
    }
    return grupo
}

function marcarFundoAtivo() {
    document.querySelectorAll('#fundos-botoes .fundo-botao').forEach(g => {
        g.classList.toggle('ativo', g.dataset.chave == String(ficha.options.wallpaper))
    })
}

// ---- criador de fundos
let rascunhoDeFundo = null   // { id, nome, imagem, cores } em edição
let fundoAntesDaEdicao = null

const camposDeCor = [
    ['principal', 'Cor principal', 'Textos e linhas do site'],
    ['terciaria', 'Cor de detalhes', 'Bordas e elementos suaves'],
    ['controle', 'Cor de destaque', 'Barras, chaves e controles']
]
const camposAvancados = [
    ['botao', 'Fundo dos botões'], ['botaoHover', 'Botão ao passar o mouse'], ['botaoTexto', 'Texto dos botões'], ['secundaria', 'Cor secundária (uso raro)']
]

function abrirEditorDeFundo(existente) {
    fundoAntesDaEdicao = ficha.options.wallpaper
    rascunhoDeFundo = existente
        ? JSON.parse(JSON.stringify(existente))
        : { id: null, nome: '', imagem: '', cores: { principal: '#ffffff', terciaria: '#929292', controle: '#2196F3' } }
    rascunhoDeFundo.cores = normalizarCores(rascunhoDeFundo.cores)
    montarEditorDeFundo()
    previaDoFundo()
    panelOpen('painel-fundos', null, null, true)
}

function previaDoFundo() {
    aplicarFundo(rascunhoDeFundo)
    const amostra = document.querySelector('.fundo-amostra')
    if (amostra) amostra.style.backgroundImage = rascunhoDeFundo.imagem ? 'url("' + rascunhoDeFundo.imagem.replace(/"/g, '%22') + '")' : ''
}

// Fecha o criador sem salvar: volta ao fundo que estava antes (chamado também ao fechar o painel)
function fecharEditorDeFundo() {
    if (!rascunhoDeFundo) return
    rascunhoDeFundo = null
    setWallpaper(fundoAntesDaEdicao)
}

function criarEl(tag, classe, texto) {
    const e = document.createElement(tag)
    if (classe) e.className = classe
    if (texto != null) e.textContent = texto
    return e
}

function campoDeCor(rotulo, dica, valorInicial, aoMudar, opcional) {
    const linha = criarEl('label', 'fundo-campo-cor')
    const textos = criarEl('span', 'fundo-campo-textos')
    textos.append(criarEl('b', '', rotulo), criarEl('small', 'text sm', dica || ''))
    const cor = document.createElement('input')
    cor.type = 'color'
    const usar = () => rgbParaHex(corParaRgb(valorInicial || '#000000'))
    cor.value = usar()
    linha.append(textos, cor)
    if (opcional) {
        const auto = document.createElement('input')
        auto.type = 'checkbox'
        auto.checked = !valorInicial
        auto.title = 'Automático'
        const autoRotulo = criarEl('small', 'text sm', 'Auto')
        cor.disabled = auto.checked
        auto.addEventListener('change', () => {
            cor.disabled = auto.checked
            aoMudar(auto.checked ? undefined : cor.value)
        })
        cor.addEventListener('input', () => aoMudar(cor.value))
        linha.append(auto, autoRotulo)
    } else {
        cor.addEventListener('input', () => aoMudar(cor.value))
    }
    return linha
}

function montarEditorDeFundo() {
    const area = document.querySelector('.fundos-editor')
    if (!area) return
    const r = rascunhoDeFundo
    const mudou = () => { previaDoFundo(); atualizarCodigoDoFundo() }

    const nome = document.createElement('input')
    nome.placeholder = 'Nome do fundo'
    nome.maxLength = 30
    nome.value = r.nome
    nome.addEventListener('input', () => { r.nome = nome.value; atualizarCodigoDoFundo() })

    const imagem = document.createElement('input')
    imagem.placeholder = 'Endereço da imagem (https://…)'
    imagem.value = r.imagem && !r.imagem.startsWith('data:') ? r.imagem : ''
    const estado = criarEl('small', 'text sm', r.imagem.startsWith('data:') ? 'Imagem enviada do seu aparelho.' : '')
    imagem.addEventListener('change', () => { r.imagem = imagem.value.trim(); estado.textContent = ''; mudou() })
    const arquivo = document.createElement('input')
    arquivo.type = 'file'
    arquivo.accept = 'image/*'
    arquivo.hidden = true
    arquivo.addEventListener('change', async () => {
        if (!arquivo.files[0]) return
        try {
            r.imagem = await reduzirImagem(arquivo.files[0])
            imagem.value = ''
            estado.textContent = 'Imagem enviada do seu aparelho (fica salva na ficha).'
            mudou()
        } catch (e) { notificar('Não foi possível ler essa imagem.', 'erro') }
    })
    const enviar = criarEl('button', 'btn', 'Enviar arquivo')
    enviar.addEventListener('click', () => arquivo.click())
    const sugerir = criarEl('button', 'btn', 'Sugerir cores pela imagem')
    sugerir.addEventListener('click', async () => {
        if (!r.imagem) return notificar('Escolha uma imagem primeiro.', 'aviso')
        const sugestao = await sugerirCoresDaImagem(r.imagem)
        if (!sugestao) return notificar('Não foi possível ler as cores dessa imagem (o site dela bloqueia). Escolha as cores à mão ou envie o arquivo.', 'aviso')
        Object.assign(r.cores, sugestao)
        montarEditorDeFundo(); mudou()
        notificar('Cores sugeridas! Ajuste do seu jeito.', 'sucesso')
    })

    const principais = camposDeCor.map(([chave, rotulo, dica]) =>
        campoDeCor(rotulo, dica, r.cores[chave], v => { r.cores[chave] = v; mudou() }))

    const avancado = document.createElement('details')
    avancado.className = 'fundo-avancado'
    avancado.appendChild(criarEl('summary', '', 'Avançado (botões e outras cores)'))
    camposAvancados.forEach(([chave, rotulo]) =>
        avancado.appendChild(campoDeCor(rotulo, '', r.cores[chave], v => { if (v === undefined) delete r.cores[chave]; else r.cores[chave] = v; mudou() }, true)))
    const aba = document.createElement('input')
    aba.placeholder = 'Fundo das abas desligadas (vazio = padrão, ex.: rgba(0,0,0,0.5))'
    aba.value = r.cores.abaInativa || ''
    aba.addEventListener('input', () => { if (aba.value.trim()) r.cores.abaInativa = aba.value.trim(); else delete r.cores.abaInativa; mudou() })
    avancado.appendChild(aba)

    const amostra = criarEl('div', 'fundo-amostra')
    const amostraTexto = criarEl('span', 'fundo-amostra-texto', 'Texto de exemplo')
    const amostraBotao = criarEl('button', 'btn', 'Botão')
    const amostraAba = criarEl('span', 'fundo-amostra-aba', 'Aba')
    amostra.append(amostraTexto, amostraBotao, amostraAba)

    const codigo = document.createElement('textarea')
    codigo.className = 'fundo-codigo'
    codigo.rows = 4
    codigo.placeholder = 'Código do fundo: copie para compartilhar ou cole um código recebido e clique em Importar.'
    codigo.spellcheck = false
    const copiar = criarEl('button', 'btn', 'Copiar código')
    copiar.addEventListener('click', async () => {
        try { await navigator.clipboard.writeText(codigo.value); notificar('Código copiado!', 'sucesso') }
        catch (e) { codigo.select(); notificar('Selecione e copie o código acima.', 'info') }
    })
    const importar = criarEl('button', 'btn', 'Importar código')
    importar.addEventListener('click', () => {
        try {
            const d = JSON.parse(codigo.value)
            if (!d || typeof d != 'object' || !d.cores) throw new Error('formato')
            r.nome = d.nome || r.nome; r.imagem = d.imagem || r.imagem; r.cores = normalizarCores(d.cores)
            montarEditorDeFundo(); mudou()
            notificar('Fundo importado.', 'sucesso')
        } catch (e) { notificar('Código inválido.', 'erro') }
    })

    const salvar = criarEl('button', 'btn', r.id ? 'Salvar alterações' : 'Salvar fundo')
    salvar.addEventListener('click', () => salvarFundoPersonalizado())
    const cancelar = criarEl('button', 'btn', 'Cancelar')
    cancelar.addEventListener('click', () => panelClose())
    const botoes = criarEl('div', 'fundo-acoes')
    botoes.append(salvar, cancelar)
    if (r.id) {
        const excluir = criarEl('button', 'btn', 'Excluir fundo')
        excluir.addEventListener('click', () => {
            if (!confirm('Excluir o fundo "' + (r.nome || 'sem nome') + '"?')) return
            ficha.fundosPersonalizados = fundosPersonalizados().filter(f => f.id != r.id)
            if (fundoAntesDaEdicao == 'p:' + r.id) fundoAntesDaEdicao = 0
            renderBotoesFundos(); verifyAutoSave()
            panelClose()
        })
        botoes.appendChild(excluir)
    }

    area.replaceChildren(
        criarEl('label', 'text sm', 'Nome'), nome,
        criarEl('label', 'text sm', 'Imagem de fundo'), imagem, criarEl('div', 'fundo-acoes', ''), estado,
        ...principais, avancado, amostra,
        criarEl('label', 'text sm', 'Compartilhar'), codigo,
        botoes)
    area.querySelector('.fundo-acoes').append(enviar, sugerir, arquivo)
    area.append((() => { const d = criarEl('div', 'fundo-acoes'); d.append(copiar, importar); return d })())
    atualizarCodigoDoFundo()
}

function atualizarCodigoDoFundo() {
    const codigo = document.querySelector('.fundo-codigo')
    if (!codigo || !rascunhoDeFundo) return
    const imagem = rascunhoDeFundo.imagem.startsWith('data:') ? 'img/backgrounds/TROQUE-PELO-NOME-DO-ARQUIVO.png' : rascunhoDeFundo.imagem
    codigo.value = JSON.stringify({ nome: rascunhoDeFundo.nome, imagem, cores: rascunhoDeFundo.cores })
}

function salvarFundoPersonalizado() {
    const r = rascunhoDeFundo
    if (!r.nome.trim()) return notificar('Dê um nome ao fundo.', 'aviso')
    const lista = fundosPersonalizados()
    if (!r.id) { r.id = Date.now().toString(36); lista.push({ id: r.id, nome: r.nome.trim(), imagem: r.imagem, cores: r.cores }) }
    else {
        const i = lista.findIndex(f => f.id == r.id)
        const novo = { id: r.id, nome: r.nome.trim(), imagem: r.imagem, cores: r.cores }
        if (i >= 0) lista[i] = novo; else lista.push(novo)
    }
    const id = r.id
    rascunhoDeFundo = null
    renderBotoesFundos()
    setWallpaper('p:' + id)
    notificar('Fundo "' + r.nome.trim() + '" salvo!', 'sucesso')
    panelClose()
}

// Reduz a imagem enviada (máx. 1600 px) para caber na ficha
function reduzirImagem(arquivo) {
    return new Promise((resolve, reject) => {
        const leitor = new FileReader()
        leitor.onerror = reject
        leitor.onload = () => {
            const img = new Image()
            img.onerror = reject
            img.onload = () => {
                const escala = Math.min(1, 1600 / Math.max(img.width, img.height))
                const tela = document.createElement('canvas')
                tela.width = Math.round(img.width * escala); tela.height = Math.round(img.height * escala)
                tela.getContext('2d').drawImage(img, 0, 0, tela.width, tela.height)
                resolve(tela.toDataURL('image/jpeg', 0.78))
            }
            img.src = leitor.result
        }
        leitor.readAsDataURL(arquivo)
    })
}

// Olha a imagem e propõe as cores do tema; devolve null se o navegador não deixar ler os pixels
function sugerirCoresDaImagem(src) {
    return new Promise(resolve => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onerror = () => resolve(null)
        img.onload = () => {
            try {
                const lado = 48
                const tela = document.createElement('canvas')
                tela.width = tela.height = lado
                const ctx = tela.getContext('2d')
                ctx.drawImage(img, 0, 0, lado, lado)
                const px = ctx.getImageData(0, 0, lado, lado).data
                let n = 0; const soma = [0, 0, 0]; const grupos = new Map()
                for (let i = 0; i < px.length; i += 4) {
                    if (px[i + 3] < 128) continue
                    const r = px[i], g = px[i + 1], b = px[i + 2]
                    n++; soma[0] += r; soma[1] += g; soma[2] += b
                    const chave = (r >> 5) << 6 | (g >> 5) << 3 | (b >> 5)
                    const gr = grupos.get(chave) || { n: 0, r: 0, g: 0, b: 0 }
                    gr.n++; gr.r += r; gr.g += g; gr.b += b
                    grupos.set(chave, gr)
                }
                if (!n) return resolve(null)
                const media = soma.map(x => x / n)
                const principal = luminanciaDaCor(media) > 0.35 ? '#000000' : '#ffffff'
                let melhor = null, pontos = 0
                for (const gr of grupos.values()) {
                    const c = [gr.r / gr.n, gr.g / gr.n, gr.b / gr.n]
                    const maior = Math.max(...c), menor = Math.min(...c)
                    const luz = (maior + menor) / 510
                    const sat = maior == menor ? 0 : (maior - menor) / (255 - Math.abs(maior + menor - 255))
                    if (luz < 0.2 || luz > 0.8 || sat < 0.25) continue
                    const p = Math.sqrt(gr.n) * sat
                    if (p > pontos) { pontos = p; melhor = c }
                }
                resolve({
                    principal,
                    terciaria: rgbParaHex(corParaRgb(misturarCores(principal, rgbParaHex(media), 0.5))),
                    controle: melhor ? rgbParaHex(melhor) : '#2196F3'
                })
            } catch (e) { resolve(null) }  // imagem de outro site sem permissão
        }
        img.src = src
    })
}

renderBotoesFundos()
setWallpaper(ficha.options.wallpaper) //init

// Opções

const statusModifierEdit = document.getElementById('statusModifierEdit')

function turnStatusMod() {
    ficha.options.statusModifier = !ficha.options.statusModifier 
    statusModifierEdit.style.display = ficha.options.statusModifier? "flex": "none"
    verifyAutoSave()
}

function changestatusModifier(value) {
    statusModifierValue = value

    if(document.getElementsByClassName('on').length == 1) document.getElementsByClassName('on')[0].classList.remove('on');
    document.getElementById(value+"-dM").classList.add('on')
}

function turnPerTranslucid() {
    ficha.options.translucidPer = !ficha.options.translucidPer
    document.getElementById('periciasDisplayer').classList.toggle('translucido')
    if (!ficha.options.translucidPer) periciasDisplayer.style.backgroundImage = "" ;
    const translucidPerOp = ficha.options.translucidPer? "(on)": "(off)"
    document.getElementById('translucidPerBtn').innerHTML = "Perícias translúcidas " + translucidPerOp;
    verifyAutoSave()
}

function turnPerBlur() {
    ficha.options.blurPer = !ficha.options.blurPer
    document.getElementById('periciasDisplayer').classList.toggle('blur')
    const blurPerOp = ficha.options.blurPer? "(on)": "(off)"
    document.getElementById('blurPerBtn').innerHTML = "Blur nas perícias " + blurPerOp;
 
    verifyAutoSave()
}

document.getElementById('perBlurInput').addEventListener('change', function() {
    ficha.options.blurPerValue = this.value
    const root = document.documentElement;
    root.style.setProperty ('--desfoque-pericias', ficha.options.blurPerValue + "px");
    verifyAutoSave()
})

function changeAutoSave() {
    const changeAutoSaveBtn = document.getElementById("changeAutoSaveBtn")
    ficha.options.autoSave = !ficha.options.autoSave;
    verifyAutoSave()

    if (ficha.options.autoSave) {
        changeAutoSaveBtn.innerHTML = "Salvamento Automático Ligado"
    } else {
        changeAutoSaveBtn.innerHTML = "Salvamento Automático Desligado"
    }
}

function changeFastLogin() {
    const changeFastLoginBtn = document.getElementById("changeFastLoginBtn")

    localStorage.setItem('fastLogin', !localStorage.getItem('fastLogin')||false)
    verifyAutoSave()

    if (localStorage.getItem('fastLogin')) {
        changeFastLoginBtn.innerHTML = "Carregamento Rápido Ligado"
    } else {
        changeFastLoginBtn.innerHTML = "Carregamento Rápido Desligado"
    }
}

// TODAS NOVAS FUNÇÕES VÃO EM CIMA DESSA
function loadUserOptions() {
    if(!ficha.options.blurPer) ficha.options.blurPer = 5

    document.getElementById('perBlurInput').value = ficha.options.blurPerValue;
    const blurPerOp = ficha.options.blurPer? "(on)": "(off)"
    document.getElementById('blurPerBtn').innerHTML = "Blur nas perícias " + blurPerOp
    const translucidPerOp = ficha.options.translucidPer? "(on)": "(off)"
    document.getElementById('translucidPerBtn').innerHTML = "Perícias translúcidas " + translucidPerOp;

    const root = document.documentElement;
    root.style.setProperty ('--desfoque-pericias', ficha.options.blurPerValue + "px");

    if (ficha.options.statusModifier) {
        statusModifierEdit.style.display = 'flex'
    }else {
        statusModifierEdit.style.display = "none"
    }
    if(ficha.options.translucidPer) {
        periciasDisplayer.style.backgroundImage = document.querySelector('body').style.backgroundImage ;
        document.getElementById('periciasDisplayer').classList.add('translucido')
    }
    else {
        periciasDisplayer.style.backgroundImage = "" ;
    }
    if(ficha.options.blurPer) {
        document.getElementById('periciasDisplayer').classList.add('blur')
    }
    const changeAutoSaveBtn = document.getElementById("changeAutoSaveBtn")
    if (ficha.options.autoSave) {
        changeAutoSaveBtn.innerHTML = "Salvamento Automático Ligado"
    } else {
        changeAutoSaveBtn.innerHTML = "Salvamento Automático Desligado"
    }
    

    const changeFastLoginBtn = document.getElementById("changeFastLoginBtn")
    if (localStorage.getItem('fastLogin')) {
        changeFastLoginBtn.innerHTML = "Carregamento Rápido Ligado"
    } else {
        changeFastLoginBtn.innerHTML = "Carregamento Rápido Desligado"
    }
    verifyAutoSave()
}

//Vai pra parte de saves
function verifyAutoSave() {
    if (!ficha.options.autoSave) return;
    save(false)
}

/**
 *     const exampleMod = {

        id: "example_magic",

        name: "Example Magic Mod",

        author: 'Babydragon',

        version: "1.0",

        description:
            "MOD OFICIAL DA CAMPANHA Eternal Midnight Trip.",

        skills: [

            {

                name: "Shadow Bolt",

                description:
                    "MOD OFICIAL DA CAMPANHA Eternal Midnight Trip.",

                dice: "2d8+4"

            }

        ],

        statuses: [

            {
                id: "cm",
                name: "Calma",
                max: 100,
                value: 50,
                background:"https://i.imgur.com/KjoMoq3.png",
                fillColor: "#57e389ff"
            },
            {
                id: "en",
                name: "Energia",
                max: 100,
                value: 50,
                background:"https://i.imgur.com/ykWerrn.png",
                fillColor: "#c061cbff"
            }

        ],

        options: {

            enableCorruption: true,

            damageMultiplier: 2

        }

    };
 */
