// =====================================================================
//  rooms.js — Salas compartilhadas para "Suspiros da Realidade"
//  Usa Firebase Realtime Database + login anônimo.
//  Carregado em index.html com: <script type="module" src="rooms.js"></script>
// =====================================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getDatabase, ref, set, get, update, remove, push,
  onValue, onChildAdded, onChildChanged, onChildRemoved, onDisconnect,
  query, limitToLast, serverTimestamp, runTransaction
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { firebaseConfig } from "./firebase-config.js";

const CFG_OK = !!(firebaseConfig && firebaseConfig.apiKey && !/COLE/i.test(firebaseConfig.apiKey) &&
  firebaseConfig.databaseURL && /^https:\/\//.test(firebaseConfig.databaseURL));

// ---------------------------------------------------------------- utilidades
const LS_PLAYER = 'suspiros_sala_jogador';
const LS_MASTER = 'suspiros_salas_mestre';
const lsGet = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } };
const num = v => (Number.isFinite(Number(v)) ? Number(v) : 0);
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const newCode = () => Array.from({ length: 5 }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join('');
const newSecret = () => {
  const a = new Uint32Array(12); crypto.getRandomValues(a);
  return Array.from(a, n => CODE_CHARS[n % CODE_CHARS.length]).join('');
};
const cleanSecret = s => String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 16);
const cleanCode = s => String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
const rid = () => (crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()));
const fmtName = n => String(n).replace(/_/g, ' ').replace(/(^|\s)\p{L}/gu, l => l.toUpperCase());

// Pequeno construtor de DOM (usa textContent, então nada digitado por outros jogadores vira HTML)
function h(tag, props, ...kids) {
  const e = document.createElement(tag);
  let val;
  for (const [k, v] of Object.entries(props || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') e.className = v;
    else if (k === 'style') e.style.cssText = v;
    else if (k === 'value') val = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2).toLowerCase(), v);
    else e.setAttribute(k, v === true ? '' : v);
  }
  for (const kid of kids.flat(Infinity)) {
    if (kid == null || kid === false) continue;
    e.append(kid instanceof Node ? kid : String(kid));
  }
  if (val !== undefined) e.value = val;
  return e;
}

// Avisos da sala usam o mesmo sistema do resto do site (notificar, em tooltip.js).
// O tipo é deduzido pela mensagem: erros e permissões em vermelho, confirmações em verde.
function toast(msg, tipo) {
  if (!tipo) {
    const m = String(msg);
    tipo = /^erro|permiss|formato inv|arquivo inv|incorret|negada|ative o login|removido|encerrada|desconectad/i.test(m) ? 'erro'
      : /^(escolha|digite|adicione|nenhum|n[ãa]o h[áa]|todos os|esse arquivo|algu[ée]m j[áa]|este jogador j[áa]|esse jogador j[áa]|a ficha desse|o jogador alterou)/i.test(m) ? 'aviso'
      : /(salv|criad|gerad|substitu|copiad|atualiz|entrou|no máximo|enviad|adicionad|reconectado|baixad|entregue|pegou|colocou|pronto|alterado)/i.test(m) ? 'sucesso' : 'info';
  }
  notificar(msg, tipo);
}

// ---------------------------------------------------------------- estado
const state = {
  role: null,            // 'player' | 'master' | null
  code: null,
  meta: null,
  players: {},           // resumo público: nome, raça, PV/PE/MD
  fichas: {},            // (mestre) ficha completa de cada jogador
  rolls: [],
  unsub: [],
  containers: [],        // listas de cards a manter atualizadas
  rollBoxes: [],
  mesa: {},              // itens que estão na mesa
  ini: {},               // iniciativa
  presets: {},           // (mestre) itens, rituais, habilidades e NPCs salvos
  condicoes: {},         // condições por alvo (jogador ou NPC)
  npcs: {},              // (mestre) NPCs em cena
  segredo: null,         // (mestre) código para entrar como mestre em outro aparelho
  views: [],             // blocos de interface (mesa / iniciativa / presets)
  iniSeen: false, mesaSeen: false,
  presence: null,
  lastApplied: null,
  ui: { step: 1, tab: {}, sub: {}, secreta: false, anonima: false, npcAberto: {} }
};
let app, auth, db, uid = null, ready = null;
let lastPushed = null, applying = false, syncTimer = null;

function init() {
  if (ready) return ready;
  ready = (async () => {
    if (!CFG_OK) throw new Error('Firebase não configurado. Preencha o arquivo firebase-config.js.');
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getDatabase(app);
    await new Promise((res, rej) => {
      const un = onAuthStateChanged(auth, u => { if (u) { un(); res(u); } }, rej);
      signInAnonymously(auth).catch(rej);
    });
    uid = auth.currentUser.uid;
  })().catch(e => { ready = null; throw e; });
  return ready;
}

function friendly(e) {
  const m = String((e && (e.code || e.message)) || e);
  if (m.includes('operation-not-allowed')) return 'Ative o login "Anônimo" em Authentication → Sign-in method, no console do Firebase.';
  if (/permission[_ ]denied/i.test(m)) return 'Permissão negada pelo banco. Se a sala é antiga, este navegador pode não ser mais o mestre dela (use "Entrar com código de mestre"); senão, confira se as regras de database.rules.json foram publicadas.';
  return (e && e.message) || String(e);
}

// ---------------------------------------------------------------- ficha <-> nuvem
const SKIP = new Set(['mods', 'customStatus', 'options', 'customWallpaper', 'fundosPersonalizados', 'assinatura', 'versão']);
const BIO_FIELDS = ['familia', 'gostos', 'desgostos', 'medos', 'contatos', 'historia', 'comportamento', 'dinheiro'];
const STATS = [['vida', 'vidaMax', 'PV', 'pv'], ['energia', 'energiaMax', 'PE', 'pe'], ['medo', 'medoMax', 'MD', 'md']];

const SKIP_PUSH = new Set(['mods', 'customStatus', 'options', 'customWallpaper', 'fundosPersonalizados']);
function snapshotFicha() {
  const o = {};
  for (const k of Object.keys(ficha)) if (!SKIP_PUSH.has(k)) o[k] = ficha[k];
  return JSON.stringify(o);
}

function summaryOf(f) {
  const st = f.status || {};
  const r = f['raça'];
  return {
    nome: f.nome || '', raca: (r && typeof r === 'object' ? r.nome : '') || '',
    vida: num(st.vida), vidaMax: num(st.vidaMax),
    energia: num(st.energia), energiaMax: num(st.energiaMax),
    medo: num(st.medo), medoMax: num(st.medoMax),
    cond: f.condicoes && typeof f.condicoes === 'object' && Object.keys(f.condicoes).length ? f.condicoes : null
  };
}
function summaryPaths(prefix, f) {
  const out = {};
  for (const [k, v] of Object.entries(summaryOf(f))) out[`${prefix}/${k}`] = v;
  return out;
}

// ---- mesclagem por campo
// Em vez de um lado sobrescrever a ficha inteira do outro, cada gravação envia só os campos que
// aquele lado mudou e os aplica sobre a versão mais recente da nuvem (dentro de uma transação).
const ehObj = v => v && typeof v === 'object' && !Array.isArray(v);
const igual = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const copia = v => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));
function diffCampos(base, atual, caminho = [], saida = []) {
  const chaves = new Set([...Object.keys(base || {}), ...Object.keys(atual || {})]);
  for (const k of chaves) {
    const a = base ? base[k] : undefined, b = atual ? atual[k] : undefined;
    if (ehObj(a) && ehObj(b)) diffCampos(a, b, [...caminho, k], saida);
    else if (!igual(a, b)) saida.push({ caminho: [...caminho, k], valor: copia(b) });
  }
  return saida;
}
function lerCaminho(o, caminho) {
  let c = o;
  for (const k of caminho) { if (c == null || typeof c !== 'object') return undefined; c = c[k]; }
  return c;
}
function gravarCaminho(o, caminho, valor) {
  let c = o;
  for (const k of caminho.slice(0, -1)) { if (!ehObj(c[k])) c[k] = {}; c = c[k]; }
  const ultimo = caminho[caminho.length - 1];
  if (valor === undefined) delete c[ultimo]; else c[ultimo] = copia(valor);
}

// Grava na nuvem só o que mudou desde `baseJson` e devolve a ficha mesclada (ou null se nada mudou).
// Sem `baseJson` a ficha da nuvem é substituída pela ficha enviada.
async function gravarFichaNuvem(puid, atual, baseJson, editadoPor, forcar = false) {
  const base = baseJson ? JSON.parse(baseJson) : null;
  const mudancas = base ? diffCampos(base, atual) : null;
  if (mudancas && !mudancas.length && !forcar) return null;
  let mesclada = atual;
  await runTransaction(ref(db, `rooms/${state.code}/fichas/${puid}`), cur => {
    let rf = null;
    if (mudancas && cur && typeof cur.fichaJson === 'string') { try { rf = JSON.parse(cur.fichaJson); } catch { rf = null; } }
    if (rf) mudancas.forEach(m => gravarCaminho(rf, m.caminho, m.valor));
    else rf = copia(atual);
    mesclada = rf;
    return { fichaJson: JSON.stringify(rf), rev: Date.now(), editedBy: editadoPor };
  });
  return mesclada;
}

// Envia a ficha do jogador para a sala (só se mudou)
let enviando = false, enviarDeNovo = false;
async function pushPlayer(force = false, strict = false) {
  if (state.role !== 'player' || !state.code || !db || applying) return;
  const json = snapshotFicha();
  if (!force && json === lastPushed) return;
  if (enviando) { enviarDeNovo = true; return; }
  enviando = true;
  try {
    const mesclada = await gravarFichaNuvem(uid, JSON.parse(json), lastPushed, 'player', force);
    if (mesclada) {
      lastPushed = json;
      await update(ref(db), summaryPaths(`rooms/${state.code}/players/${uid}`, mesclada));
    }
  } catch (e) {
    if (strict) throw e;
    console.warn('[sala] erro ao sincronizar', e);
  } finally {
    enviando = false;
    if (enviarDeNovo) { enviarDeNovo = false; scheduleSync(); }
  }
}
function scheduleSync() {
  if (state.role !== 'player' || !state.code || applying) return;
  clearTimeout(syncTimer);
  syncTimer = setTimeout(() => pushPlayer(), 500);
}

// Redesenha a interface a partir da ficha local
function atualizarInterface() {
  const silenciadoAntes = window.avisosSilenciados;
  window.avisosSilenciados = true;
  try {
    // campos de texto primeiro: save() relê personagem-contatos
    for (const f of BIO_FIELDS) {
      const el = document.getElementById('personagem-' + f);
      if (el) el.value = (ficha.biografia && ficha.biografia[f]) || '';
    }
    const setTxt = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    setTxt('personagem-nome', ficha.nome || '');
    setTxt('personagem-idade', ficha.idade || '');
    setTxt('personagem-nascimento', ficha.dataNascimento || '');
    const us = document.getElementById('useInput');
    if (us) us.value = (ficha.inventario && ficha.inventario.usando) || '';
    for (const fn of ['renderInventory', 'renderGuardados', 'renderTotalWeight', 'renderWeaponArea',
      'renderMagias', 'renderHabilidades', 'renderTraumas', 'displayPericias', 'statusAtu', 'renderCondicoes']) {
      try { if (typeof window[fn] === 'function') window[fn](); } catch (e) { console.warn('[sala] refresh', fn, e); }
    }
    const mod = document.getElementById('modificadores');
    if (mod && ficha.modificadores) {
      mod.innerHTML = `<span class="text sm">Defesa Ativa: ${num(ficha.modificadores.defesaAtiva)}%</span>
        <span class="text sm">Deslocamento: ${num(ficha.modificadores.deslocamento)}</span>
        <span class="text sm">Reflexos: ${num(ficha.modificadores.reflexos)}</span>`;
    }
  } finally {
    window.avisosSilenciados = silenciadoAntes;
  }
}

// Mantém a cópia salva no navegador igual à da sala (para a ficha antiga não voltar ao reabrir o site)
function salvarCopiaLocal() {
  try {
    if (!localStorage.getItem('hasFichaSave')) return;
    localStorage.setItem('ficha', JSON.stringify(ficha));
    localStorage.setItem('hour', JSON.stringify(new Date()));
  } catch (e) { console.warn('[sala] cópia local', e); }
}

// Substitui a ficha local inteira pela da sala (usado ao entrar)
function applyRemoteFicha(rf) {
  applying = true;
  try {
    for (const k of Object.keys(rf)) if (!SKIP.has(k)) ficha[k] = rf[k];
    atualizarInterface();
  } finally {
    applying = false;
  }
  lastPushed = snapshotFicha();
}

// Traz para a ficha local só o que mudou na nuvem (ex.: edição do mestre), sem apagar o que o jogador
// alterou e ainda não enviou. Devolve quantos campos mudaram.
function mesclarDaNuvem(v) {
  if (!lastPushed || typeof v.fichaJson !== 'string') return 0;
  let rf;
  try { rf = JSON.parse(v.fichaJson); } catch { return 0; }
  for (const k of SKIP_PUSH) delete rf[k];
  const base = JSON.parse(lastPushed);
  const mudancas = diffCampos(base, rf).filter(m => !SKIP.has(m.caminho[0]));
  if (!mudancas.length) return 0;
  const local = JSON.parse(snapshotFicha());
  const aplicar = mudancas.filter(m => igual(lerCaminho(local, m.caminho), lerCaminho(base, m.caminho)));
  lastPushed = JSON.stringify(rf);   // a nuvem passa a ser a base; o que ficou pendente aqui será enviado depois
  if (!aplicar.length) return 0;
  applying = true;
  try {
    aplicar.forEach(m => gravarCaminho(ficha, m.caminho, m.valor));
    atualizarInterface();
  } finally { applying = false; }
  salvarCopiaLocal();
  return aplicar.length;
}

// ---------------------------------------------------------------- conexão com a sala
function disconnectRoom() {
  state.unsub.forEach(u => { try { u(); } catch { /* ignore */ } });
  Object.assign(state, {
    unsub: [], role: null, code: null, meta: null, players: {}, fichas: {}, rolls: [],
    containers: [], rollBoxes: [], presence: null, lastApplied: null,
    mesa: {}, ini: {}, presets: {}, condicoes: {}, npcs: {}, segredo: null, views: [], iniSeen: false, mesaSeen: false, migradas: null
  });
}

function attachCommon(code) {
  const base = `rooms/${code}`;
  const err = e => toast(friendly(e));
  state.unsub.push(onValue(ref(db, `${base}/players`), s => { state.players = s.val() || {}; renderAll(); }, err));
  state.unsub.push(onValue(ref(db, `${base}/meta`), s => {
    if (!s.exists()) { if (state.code === code) { toast('A sala foi encerrada.'); forceLeave(); } }
    else state.meta = s.val();
  }, err));
  const q = query(ref(db, `${base}/rolls`), limitToLast(60));
  state.unsub.push(onChildAdded(q, s => {
    const r = { id: s.key, ...s.val() };
    state.rolls.push(r);
    renderRolls();
    if (r.uid !== uid && Date.now() - num(r.ts) < 8000) toast(`${r.who} rolou ${r.label}: ${r.total}`);
  }, err));
  state.unsub.push(onChildRemoved(q, s => { state.rolls = state.rolls.filter(r => r.id !== s.key); renderRolls(); }, err));

  // condições (envenenado, caído…)
  state.unsub.push(onValue(ref(db, `${base}/condicoes`), s => { state.condicoes = s.val() || {}; renderAll(); renderKind('condicoes'); migrarCondicoesAntigas(); }, err));

  // mesa de itens
  state.unsub.push(onValue(ref(db, `${base}/mesa`), s => {
    const prev = state.mesa;
    state.mesa = s.val() || {};
    renderKind('mesa');
    if (state.mesaSeen) {
      for (const [id, m] of Object.entries(state.mesa)) {
        if (!prev[id] && m.uid !== uid) toast(`${m.by || 'Alguém'} colocou "${m.nome}" na mesa`);
      }
    }
    state.mesaSeen = true;
  }, err));

  // iniciativa
  state.unsub.push(onValue(ref(db, `${base}/iniciativa`), s => {
    const prev = state.ini || {};
    const v = s.val() || {};
    state.ini = v;
    renderKind('ini');
    if (state.iniSeen && v.ativa && v.atual && v.atual !== prev.atual) {
      const e = v.entries && v.entries[v.atual];
      if (v.atual === 'p_' + uid) toast('É a sua vez!');
      else if (e) toast('Turno de ' + e.nome);
    }
    state.iniSeen = true;
  }, err));
}

function forceLeave() {
  const wasMaster = state.role === 'master';
  disconnectRoom();
  if (wasMaster) masterHome(); else { localStorage.removeItem(LS_PLAYER); renderPlayerSala(); }
}

// ---- jogador
async function joinAsPlayer(codeRaw) {
  const code = cleanCode(codeRaw);
  if (code.length < 4) throw new Error('Digite o código da sala.');
  await init();
  if (!ficha || !ficha.nome) throw new Error('Carregue ou crie uma ficha antes de entrar numa sala.');
  const meta = (await get(ref(db, `rooms/${code}/meta`))).val();
  if (!meta) throw new Error('Sala não encontrada. Confira o código.');
  if (await souMestreDa(code, meta)) throw new Error('Você é o mestre desta sala. Abra-a por "Sala do Mestre" no menu inicial.');

  // A ficha da sala vence: ela já traz as edições do mestre e o que o jogador fez na última sessão.
  // (Usar a cópia salva no navegador, que pode estar velha, fazia PV, PE e outros campos voltarem.)
  const remote = (await get(ref(db, `rooms/${code}/fichas/${uid}`))).val();
  let usouNuvem = false;
  if (remote && typeof remote.fichaJson === 'string') {
    try {
      const rf = JSON.parse(remote.fichaJson);
      const use = rf.nome === ficha.nome || (remote.editedBy === 'master' &&
        confirm(`Esta sala já tem uma ficha sua chamada "${rf.nome}" (editada pelo mestre).\nOK = usar a ficha da sala · Cancelar = substituir pela ficha atual ("${ficha.nome}")`));
      if (use) { state.lastApplied = remote.rev; applyRemoteFicha(rf); salvarCopiaLocal(); usouNuvem = true; }
    } catch (e) { console.warn(e); }
  }

  disconnectRoom();
  Object.assign(state, { role: 'player', code, meta });
  lsSet(LS_PLAYER, { code });
  if (!usouNuvem) lastPushed = null;   // ficha nova na sala: grava a ficha local inteira
  try { await pushPlayer(true, true); } catch (e) { disconnectRoom(); throw e; }

  attachCommon(code);
  const pr = ref(db, `rooms/${code}/players/${uid}/online`);
  state.unsub.push(onValue(ref(db, '.info/connected'), s => {
    if (s.val() === true) {
      state.presence = onDisconnect(pr);
      state.presence.set(false).catch(() => {});
      set(pr, true).catch(() => {});
    }
  }));
  // itens que outros jogadores (ou o mestre) entregaram a mim
  state.unsub.push(onChildAdded(ref(db, `rooms/${code}/entregas/${uid}`), s => receberEntrega(s.key, s.val()), e => toast(friendly(e))));
  state.unsub.push(onValue(ref(db, `rooms/${code}/fichas/${uid}`), s => {
    const v = s.val();
    if (!v) { if (state.role === 'player') { toast('Você foi removido da sala.'); forceLeave(); } return; }
    try {
      const n = mesclarDaNuvem(v);
      if (n && v.editedBy === 'master' && v.rev !== state.lastApplied) { state.lastApplied = v.rev; toast('O mestre atualizou a sua ficha.'); }
    } catch (e) { console.warn('[sala] mesclagem', e); }
  }, e => toast(friendly(e))));
}

async function leaveAsPlayer() {
  const code = state.code;
  const pres = state.presence;
  // para os ouvintes antes de apagar, senão "fui removido" dispararia
  state.unsub.forEach(u => { try { u(); } catch { /* ignore */ } });
  state.unsub = [];
  try {
    if (pres) await pres.cancel();
    await update(ref(db), { [`rooms/${code}/players/${uid}`]: null, [`rooms/${code}/fichas/${uid}`]: null });
  } catch (e) { console.warn(e); }
  disconnectRoom();
  localStorage.removeItem(LS_PLAYER);
  renderPlayerSala();
}

// ---- mestre
async function createRoom(name) {
  await init();
  let code = null;
  for (let i = 0; i < 8 && !code; i++) {
    const c = newCode();
    if (!(await get(ref(db, `rooms/${c}/meta`))).exists()) code = c;
  }
  if (!code) throw new Error('Não foi possível gerar um código. Tente de novo.');
  await set(ref(db, `rooms/${code}/meta`), { masterUid: uid, name: name || 'Mesa', createdAt: serverTimestamp() });
  try { await set(ref(db, `rooms/${code}/segredo`), newSecret()); } catch (e) { console.warn('[sala] código de mestre não criado', e); }
  const list = lsGet(LS_MASTER, []);
  list.push({ code, name: name || 'Mesa' });
  lsSet(LS_MASTER, list);
  return code;
}

// Outro aparelho vira mestre informando o código de mestre da sala
async function claimMaster(codeRaw, secretRaw) {
  const code = cleanCode(codeRaw), secret = cleanSecret(secretRaw);
  if (code.length < 4) throw new Error('Digite o código da sala.');
  if (secret.length < 8) throw new Error('Digite o código de mestre (12 letras e números).');
  await init();
  const meta = (await get(ref(db, `rooms/${code}/meta`))).val();
  if (!meta) throw new Error('Sala não encontrada. Confira o código.');
  if (meta.masterUid !== uid) {
    try { await set(ref(db, `rooms/${code}/claim/${uid}`), secret); }
    catch (e) {
      if (/permission[_ ]denied/i.test(String((e && (e.code || e.message)) || e))) throw new Error('Código de mestre incorreto.');
      throw e;
    }
  }
  const list = lsGet(LS_MASTER, []);
  if (!list.some(r => r.code === code)) { list.push({ code, name: meta.name || 'Mesa' }); lsSet(LS_MASTER, list); }
  return code;
}
const souMestreDa = async (code, meta) =>
  meta.masterUid === uid || (await get(ref(db, `rooms/${code}/claim/${uid}`))).exists();

async function openMasterRoom(code) {
  await init();
  const meta = (await get(ref(db, `rooms/${code}/meta`))).val();
  if (!meta) {
    lsSet(LS_MASTER, lsGet(LS_MASTER, []).filter(r => r.code !== code));
    throw new Error('Essa sala não existe mais.');
  }
  if (!(await souMestreDa(code, meta))) throw new Error('Este navegador não é mais reconhecido como mestre desta sala (acontece quando os dados do navegador são apagados ou ao trocar de aparelho). Use "Entrar com código de mestre", com o código gerado quando a sala foi criada. Salas criadas antes do código de mestre: no Firebase, em rooms/' + code + ', crie o campo "segredo" com 8 a 16 letras e números e use esse valor como código.');
  disconnectRoom();
  Object.assign(state, { role: 'master', code, meta });
  attachCommon(code);
  const fr = ref(db, `rooms/${code}/fichas`);
  const upsert = s => {
    const v = s.val();
    if (!v || typeof v.fichaJson !== 'string') return;
    const old = state.fichas[s.key];
    if (old && old.json === v.fichaJson) { old.rev = v.rev; old.editedBy = v.editedBy; return; }
    let nf;
    try { nf = JSON.parse(v.fichaJson); } catch { return; }
    state.fichas[s.key] = { ficha: nf, json: v.fichaJson, rev: v.rev, editedBy: v.editedBy };
    renderAll();
    rebuildEditorIfOpen(s.key);
    renderKind('condicoes');
    migrarCondicoesAntigas();
  };
  const err = e => toast(friendly(e));
  state.unsub.push(onChildAdded(fr, upsert, err));
  state.unsub.push(onChildChanged(fr, upsert, err));
  state.unsub.push(onChildRemoved(fr, s => { delete state.fichas[s.key]; renderAll(); }, err));
  state.unsub.push(onValue(ref(db, `rooms/${code}/presets`), s => { state.presets = s.val() || {}; renderKind('presets'); }, err));
  state.unsub.push(onValue(ref(db, `rooms/${code}/npcs`), s => { state.npcs = s.val() || {}; renderKind('npcs'); }, err));
  state.unsub.push(onValue(ref(db, `rooms/${code}/segredo`), s => { state.segredo = s.val() || null; renderKind('segredo'); }, err));
}

async function masterCommit(puid, f) {
  const base = `rooms/${state.code}`;
  const entry = state.fichas[puid] || (state.fichas[puid] = {});
  const baseJson = entry.json;          // última versão da ficha vista na nuvem
  entry.ficha = f; entry.json = JSON.stringify(f);
  try {
    const mesclada = await gravarFichaNuvem(puid, f, baseJson, 'master', true);
    if (mesclada) await update(ref(db), summaryPaths(`${base}/players/${puid}`, mesclada));
  } catch (e) { toast('Erro ao salvar: ' + friendly(e)); }
  renderAll();
}

// Aplica uma mudança sobre a ficha mais recente da nuvem (não sobre a cópia do mestre, que pode estar
// um pouco atrás): assim ajustes de PV/PE nunca desfazem o que o jogador acabou de fazer.
async function masterMutar(puid, mudar) {
  const base = `rooms/${state.code}`;
  let nova = null;
  try {
    await runTransaction(ref(db, `${base}/fichas/${puid}`), cur => {
      if (!cur || typeof cur.fichaJson !== 'string') return;   // ficha ainda não carregada: cancela
      const rf = JSON.parse(cur.fichaJson);
      mudar(rf);
      nova = rf;
      return { fichaJson: JSON.stringify(rf), rev: Date.now(), editedBy: 'master' };
    });
    if (!nova) { toast('A ficha desse jogador ainda está carregando.'); return false; }
    state.fichas[puid] = { ficha: nova, json: JSON.stringify(nova), rev: Date.now(), editedBy: 'master' };
    await update(ref(db), summaryPaths(`${base}/players/${puid}`, nova));
  } catch (e) { toast('Erro ao salvar: ' + friendly(e)); return false; }
  renderAll();
  rebuildEditorIfOpen(puid);
  renderKind('condicoes');
  return true;
}

function adjust(puid, key, dir) {
  if (!state.fichas[puid]) return toast('A ficha desse jogador ainda está carregando.');
  const passo = state.ui.step;
  masterMutar(puid, f => {
    f.status = f.status || {};
    f.status[key] = Math.max(0, num(f.status[key]) + dir * passo);
  });
}

async function kick(puid) {
  const nome = (state.players[puid] || {}).nome || 'este jogador';
  if (!confirm(`Remover ${nome} da sala?`)) return;
  const base = `rooms/${state.code}`;
  try { await update(ref(db), { [`${base}/players/${puid}`]: null, [`${base}/fichas/${puid}`]: null }); }
  catch (e) { toast(friendly(e)); }
}

// ---------------------------------------------------------------- rolagens
async function logRoll(r) {
  if (!state.code || !db) return;
  const who = state.role === 'master' ? 'Mestre' : (ficha.nome || 'Jogador');
  try {
    await push(ref(db, `rooms/${state.code}/rolls`), {
      uid, who, label: r.label || 'Dado', expr: r.expr || '', total: num(r.total),
      detail: r.detail || '', kind: r.kind || 'dice', ts: serverTimestamp()
    });
  } catch (e) { console.warn('[sala] rolagem não enviada', e); }
}

// Rolagem anônima: o jogador rola normalmente, mas o resultado não vai para o histórico da sala
function anonimaCheckbox() {
  const c = h('input', { type: 'checkbox', class: 'sala-anonima-chk' });
  c.checked = !!state.ui.anonima;
  c.addEventListener('change', () => {
    state.ui.anonima = c.checked;
    document.querySelectorAll('.sala-anonima-chk').forEach(o => { o.checked = c.checked; });
  });
  return h('label', { class: 'sala-opcao sala-anonima', title: 'Quando marcado, suas rolagens não aparecem no histórico da sala' }, c, ' Anônima');
}

function wrapRolls() {
  const origRoll = window.rollDice;
  if (typeof origRoll === 'function') {
    window.rollDice = function (value, type = 'dice') {
      const input = document.getElementById('diceInput');
      // o botão "Rolar Dado" chama rollDice() sem argumentos: usa o que está no campo
      if (value === undefined && input) value = input.value;
      const total = origRoll.call(this, value, type);
      if (typeof total === 'number' && state.role === 'player' && state.code && !state.ui.anonima) {
        const expr = input ? input.value : String(value);
        const d = document.getElementById('descriçãoDeRolagem');
        const detail = ((d && d.textContent) || '').replace(/^de Dano\s*/, '').trim();
        const label = type === 'per' ? fmtName(value) : type === 'damage' ? 'Dano' : 'Dado';
        logRoll({ label, expr, total, detail, kind: type });
      }
      return total;
    };
  }
  const btn = document.getElementById('diceBtnRoll');
  if (btn && btn.after) btn.after(anonimaCheckbox());
  const origMult = window.rollMultiplierDice;
  if (typeof origMult === 'function') {
    window.rollMultiplierDice = function (quantity, sides) {
      const r = origMult.apply(this, arguments);
      if (state.role === 'player' && state.code && !state.ui.anonima) {
        const out = document.getElementById('resultadoFinalDeRolagem');
        logRoll({ label: 'Dado', expr: `${quantity}d${sides}`, total: out ? out.textContent : 0, detail: '' });
      }
      return r;
    };
  }
  const origVerify = window.verifyAutoSave;
  if (typeof origVerify === 'function') {
    window.verifyAutoSave = function () { const r = origVerify.apply(this, arguments); scheduleSync(); return r; };
  }
}

function masterRoll(exprRaw, secreta = !!state.ui.secreta) {
  const expr = String(exprRaw || '').trim();
  if (!expr) return;
  if (/\*/.test(expr) || !isValidDiceExpression(expr)) return toast('Formato inválido. Exemplos: 1d20, 2d6+3, 1d12-2');
  const r = rollDiceExpression(expr);
  const detail = r.rolls.map(x => `${x.sign < 0 ? '-' : ''}${x.dice} (${x.value})`).join(' ');
  if (secreta) {   // rolagem secreta: só aparece para o mestre e não é enviada à sala
    state.rolls.push({ id: 's_' + rid(), uid, who: 'Mestre', label: 'Dado', expr, total: r.total, detail, kind: 'dice', ts: Date.now(), secreta: true });
    renderRolls();
    return;
  }
  logRoll({ label: 'Dado', expr, total: r.total, detail });
}

function fillRolls(box) {
  const rows = [...state.rolls].reverse().map(r => {
    const t = num(r.ts) ? new Date(num(r.ts)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
    return h('div', { class: 'sala-rolagem' + (r.kind === 'damage' ? ' dmg' : '') + (r.secreta ? ' secreta' : '') },
      h('div', {},
        h('div', {}, r.secreta ? '🔒 ' : null, h('b', {}, r.who || '?'), ' · ', r.label || 'Dado'),
        h('div', { class: 'sala-discreto' }, [r.expr, r.detail].filter(Boolean).join(' — ')),
        h('div', { class: 'sala-discreto' }, t)),
      h('b', { class: 'total' }, String(r.total)));
  });
  box.replaceChildren(...(rows.length ? rows : [h('p', { class: 'sala-discreto' }, 'Nenhuma rolagem ainda.')]));
}
function renderRolls() { state.rollBoxes.forEach(fillRolls); }

// ---------------------------------------------------------------- condições (envenenado, caído…)
// CONDICOES (lista oficial) vem de listas.js, junto com a lógica das condições da ficha.
// Jogadores: as condições ficam na ficha (ficha.condicoes). NPCs: no banco da sala (state.condicoes).
const ehJogador = a => a === uid || !!(state.players && state.players[a]);
function condicoesDe(alvo) {
  let mapa;
  if (alvo === uid && state.role === 'player') mapa = condicoesDaFicha();
  else if (ehJogador(alvo)) mapa = state.fichas[alvo] ? state.fichas[alvo].ficha.condicoes : (state.players[alvo] || {}).cond;
  else mapa = state.condicoes && state.condicoes[alvo];
  return Object.entries(mapa || {}).map(([cid, c]) => ({ cid, ...c }));
}
// Altera as condições de um jogador: a própria ficha (jogador) ou a ficha mais recente da nuvem (mestre)
async function mudarCondicoes(alvo, mudar) {
  if (alvo === uid && state.role === 'player') { mudar(condicoesDaFicha()); condicoesMudaram(); return true; }
  return masterMutar(alvo, rf => { if (!ehObj(rf.condicoes)) rf.condicoes = {}; mudar(rf.condicoes); });
}
async function addCondicao(alvo, nome, turnos, descricao) {
  nome = String(nome || '').trim().slice(0, 40);
  if (!nome) return toast('Escolha ou digite a condição.');
  const padrao = CONDICOES.find(c => c.nome.toLowerCase() === nome.toLowerCase());
  const t = Math.max(0, Math.min(99, Math.floor(num(turnos))));
  const desc = String(descricao != null && descricao !== '' ? descricao : (padrao ? padrao.descricao : '')).slice(0, 700);
  const cond = { nome: padrao ? padrao.nome : nome, turnos: t, descricao: desc };
  if (ehJogador(alvo)) return mudarCondicoes(alvo, m => { m[novoIdCondicao()] = cond; });
  try { await push(ref(db, `rooms/${state.code}/condicoes/${alvo}`), cond); }
  catch (e) { toast(friendly(e)); }
}
function delCondicao(alvo, cid) {
  if (ehJogador(alvo)) return mudarCondicoes(alvo, m => { delete m[cid]; });
  remove(ref(db, `rooms/${state.code}/condicoes/${alvo}/${cid}`)).catch(e => toast(friendly(e)));
}
function turnosCondicao(alvo, cid, valor) {
  const v = Math.max(0, Math.min(99, num(valor)));
  if (ehJogador(alvo)) return mudarCondicoes(alvo, m => { if (m[cid]) m[cid].turnos = v; });
  update(ref(db), { [`rooms/${state.code}/condicoes/${alvo}/${cid}/turnos`]: v }).catch(e => toast(friendly(e)));
}
// Condições antigas (guardadas no banco da sala) passam para a ficha do jogador, uma única vez
function migrarCondicoesAntigas() {
  if (state.role !== 'master') return;
  const feitas = state.migradas || (state.migradas = new Set());
  for (const [alvo, mapa] of Object.entries(state.condicoes || {})) {
    if (!mapa || !state.players[alvo] || !state.fichas[alvo] || feitas.has(alvo)) continue;
    feitas.add(alvo);
    masterMutar(alvo, rf => {
      if (!ehObj(rf.condicoes)) rf.condicoes = {};
      for (const [cid, c] of Object.entries(mapa)) if (!rf.condicoes[cid]) rf.condicoes[cid] = { nome: c.nome, turnos: num(c.turnos), descricao: c.descricao || '' };
    }).then(ok => { if (ok) remove(ref(db, `rooms/${state.code}/condicoes/${alvo}`)).catch(() => {}); else feitas.delete(alvo); });
  }
}
// Emblemas de condição; ✕ só aparece quando `editavel` (dentro da ficha do personagem). Toque/passe o mouse mostra a descrição.
function emblemas(alvo, editavel) {
  return condicoesDe(alvo).map(c => h('span', { class: 'sala-condicao', title: [c.descricao, c.turnos ? `${c.turnos} turno(s) restante(s)` : 'Sem limite de turnos'].filter(Boolean).join('\n') },
    c.nome + (c.turnos ? ` (${c.turnos})` : ''),
    editavel ? h('button', { class: 'sala-condicao-x', title: 'Remover condição', onclick: () => delCondicao(alvo, c.cid) }, '✕') : null));
}
// Formulário de aplicar condição (só na ficha do personagem / card do NPC)
function condicaoForm(alvo) {
  const lista = sel([['', 'Escolha a condição…'], ...CONDICOES.map(c => [c.nome, c.nome]), ['__outra', 'Outra (personalizada)…']], '', () => atualiza(), { commit() {} });
  const nome = h('input', { class: 'sala-campo sala-expandir', placeholder: 'Nome da condição', hidden: true });
  const turnos = h('input', { class: 'sala-campo sala-largura-numero', type: 'number', min: 0, max: 99, placeholder: 'Turnos' });
  const desc = h('div', { class: 'sala-descricao' });
  function atualiza() {
    nome.hidden = lista.value !== '__outra';
    const c = CONDICOES.find(x => x.nome === lista.value);
    desc.textContent = c ? c.descricao : '';
    if (c) turnos.value = c.turnos || '';
  }
  return h('div', { class: 'sala-condicao-form' },
    h('div', { class: 'sala-linha' }, lista, nome, turnos,
      h('button', { class: 'sala-botao', onclick: () => {
        const n = lista.value === '__outra' ? nome.value : lista.value;
        addCondicao(alvo, n, turnos.value);
        lista.value = ''; nome.value = ''; turnos.value = ''; atualiza();
      } }, '+ Aplicar')),
    desc);
}
// a quem pertencem as condições de uma linha da iniciativa
const alvoIni = e => e.uid || e.npc || e.id;

// ---------------------------------------------------------------- cards (vista rápida)
function buildCard(puid, master) {
  const r = {};
  const card = h('div', { class: 'sala-card' + (puid === uid ? ' me' : ''), 'data-uid': puid },
    h('header', {},
      (r.dot = h('span', { class: 'sala-indicador' })),
      (r.name = h('span', { class: 'sala-nome' })),
      (r.race = h('span', { class: 'sala-discreto' })),
      master ? (r.toggle = h('button', { class: 'sala-botao', onclick: () => toggleExpand(puid) }, 'Abrir')) : null,
      master ? h('button', { class: 'sala-botao sala-perigo', title: 'Remover da sala', onclick: () => kick(puid) }, '✕') : null),
    h('div', { class: 'sala-barras' }, STATS.map(([k, , label, cls]) => {
      const fill = h('i'); const txt = h('span');
      r[k] = { fill, txt, label };
      return h('div', { class: 'sala-estatistica' },
        h('div', { class: 'sala-barra ' + cls }, fill, txt),
        master ? h('div', { class: 'sala-ajuste' },
          h('button', { class: 'sala-botao', onclick: () => adjust(puid, k, -1) }, '−'),
          h('button', { class: 'sala-botao', onclick: () => adjust(puid, k, +1) }, '+')) : null);
    })),
    master ? (r.info = h('div', { class: 'sala-info sala-discreto' })) : null,
    (r.cond = h('div', { class: 'sala-condicoes' })),
    master ? (r.body = Object.assign(h('div', { class: 'sala-corpo' }), { hidden: true })) : null);
  if (master) {
    r.body.addEventListener('focusout', () => {
      if (r.body._dirty) { r.body._dirty = false; setTimeout(() => rebuildEditorIfOpen(puid), 80); }
    });
  }
  card._refs = r;
  return card;
}

function updateCard(card, puid, master) {
  const p = state.players[puid] || {};
  const e = master && state.fichas[puid];
  const d = e && e.ficha ? summaryOf(e.ficha) : p;
  const r = card._refs;
  r.name.textContent = d.nome || '(sem nome)';
  r.race.textContent = d.raca || '';
  r.dot.classList.toggle('on', !!p.online);
  for (const [k, mk] of STATS) {
    const cur = num(d[k]), max = num(d[mk]);
    r[k].txt.textContent = `${r[k].label} ${cur}/${max}`;
    r[k].fill.style.width = (max > 0 ? Math.max(0, Math.min(100, (cur / max) * 100)) : 0) + '%';
  }
  // destaques: vida baixa e medo alto
  card.classList.toggle('critico', num(d.vidaMax) > 0 && num(d.vida) / num(d.vidaMax) <= 0.25);
  card.classList.toggle('assustado', num(d.medoMax) > 0 && num(d.medo) / num(d.medoMax) >= 0.75);
  r.cond.replaceChildren(...emblemas(puid, false));
  if (r.info) r.info.textContent = e && e.ficha ? infoRapida(e.ficha) : '';
}
// arma equipada e perícias mais altas (linha extra no card do mestre)
function infoRapida(f) {
  const partes = [];
  const arma = f.inventario && f.inventario.weapon;
  if (arma && arma.name) partes.push('Arma: ' + arma.name);
  if (Array.isArray(f.pericias)) {
    const top = f.pericias.flatMap((arr, lvl) => (Array.isArray(arr) ? arr : []).map(n => [n, lvl])).filter(x => x[1] > 0)
      .sort((a, b) => b[1] - a[1]).slice(0, 3).map(([n, lvl]) => `${fmtName(n)} ${lvl}`);
    if (top.length) partes.push('Perícias: ' + top.join(', '));
  }
  return partes.join(' · ');
}

function syncCards(container, master) {
  const cards = container._cards || (container._cards = new Map());
  const ids = Object.keys(state.players).sort((a, b) =>
    String(state.players[a].nome || '').localeCompare(String(state.players[b].nome || ''), 'pt'));
  for (const [id, card] of cards) if (!state.players[id]) { card.remove(); cards.delete(id); }
  ids.forEach((id, i) => {
    let card = cards.get(id);
    if (!card) { card = buildCard(id, master); cards.set(id, card); }
    updateCard(card, id, master);
    if (container.children[i] !== card) container.insertBefore(card, container.children[i] || null);
  });
  if (container._empty) container._empty.style.display = ids.length ? 'none' : '';
}

function renderAll() { state.containers.forEach(c => syncCards(c.el, c.master)); }

// ---------------------------------------------------------------- editor do mestre
const TABS = [['dados', 'Dados'], ['status', 'Status'], ['pericias', 'Perícias'], ['inv', 'Inventário'], ['magias', 'Magias'],
  ['hab', 'Habilidades'], ['traumas', 'Traumas'], ['cond', 'Condições'], ['bio', 'Biografia'], ['avancado', 'Avançado']];

function masterCard(puid) {
  const c = state.containers.find(x => x.master);
  return c && c.el._cards ? c.el._cards.get(puid) : null;
}

function toggleExpand(puid) {
  const card = masterCard(puid);
  if (!card) return;
  const body = card._refs.body;
  const open = !!body.hidden;
  body.hidden = !open;
  card._refs.toggle.textContent = open ? 'Fechar' : 'Abrir';
  if (open) buildEditor(puid, body);
}

function rebuildEditorIfOpen(puid) {
  const card = masterCard(puid);
  if (!card) return;
  const body = card._refs.body;
  if (body.hidden) return;
  const a = document.activeElement;
  if (body.contains(a) && /INPUT|TEXTAREA|SELECT/.test(a.tagName)) { body._dirty = true; return; }
  buildEditor(puid, body);
}

function buildEditor(puid, body) {
  body.replaceChildren();
  const entry = state.fichas[puid];
  if (!entry || !entry.ficha) { body.append(h('p', { class: 'sala-discreto' }, 'Carregando ficha…')); return; }
  const f = entry.ficha;
  const ctx = {
    puid, f, justAdded: null,
    commit() {
      const e = state.fichas[puid];
      if (e && e.ficha !== f) { toast('O jogador alterou a ficha ao mesmo tempo. Refaça a alteração.'); return; }
      return masterCommit(puid, f);
    },
    rerender() { renderTab(); }
  };
  let tab = state.ui.tab[puid] || 'dados';
  const tabsEl = h('div', { class: 'sala-abas' });
  const content = h('div', { class: 'sala-aba-corpo' });
  const renderTab = () => {
    tabsEl.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.t === tab));
    content.replaceChildren(TAB_FN[tab](ctx));
  };
  TABS.forEach(([id, label]) => tabsEl.append(
    h('button', { class: 'sala-botao', 'data-t': id, onclick: () => { tab = id; state.ui.tab[puid] = id; renderTab(); } }, label)));
  body.append(tabsEl, content);
  renderTab();
}

// ---- campos
const fld = (label, input, cls = '') => h('div', { class: 'sala-campo-rotulado ' + cls }, h('label', {}, label), input);

function inp(type, value, onSet, ctx) {
  const i = h(type === 'area' ? 'textarea' : 'input', { class: 'sala-campo', rows: type === 'area' ? 3 : null, type: type === 'area' ? null : type });
  i.value = value ?? '';
  i.addEventListener('change', () => { onSet(type === 'number' ? num(i.value) : i.value); ctx.commit(); });
  return i;
}
function sel(options, value, onSet, ctx) {
  const s = h('select', { class: 'sala-campo' }, options.map(o => { const [v, l] = Array.isArray(o) ? o : [o, o]; return h('option', { value: v }, l); }));
  s.value = value ?? '';
  s.addEventListener('change', () => { onSet(s.value); ctx.commit(); });
  return s;
}
function chk(label, checked, onSet, ctx) {
  const c = h('input', { type: 'checkbox' });
  c.checked = !!checked;
  c.addEventListener('change', () => { onSet(c.checked); ctx.commit(); });
  return h('label', { class: 'sala-opcao' }, c, ' ' + label);
}
function diceInp(value, onSet, ctx) {
  const i = h('input', { class: 'sala-campo', placeholder: 'ex: 1d20+5' });
  i.value = value || '';
  i.addEventListener('change', () => {
    const v = i.value.trim();
    if (v && typeof isValidDiceExpression === 'function' && !isValidDiceExpression(v)) { i.classList.add('bad'); return; }
    i.classList.remove('bad'); onSet(v); ctx.commit();
  });
  return i;
}

// ---- aba Status
function tabStatus(ctx) {
  const f = ctx.f;
  f.status = f.status || {}; f.modificadores = f.modificadores || {};
  const names = { vida: 'Vida (PV)', energia: 'Energia (PE)', medo: 'Medo (MD)' };
  const keys = Object.keys(f.status).filter(k => !k.endsWith('Max'));
  return h('div', {},
    keys.map(k => h('div', { class: 'sala-grupo-campos' },
      fld(names[k] || k, inp('number', f.status[k], v => { f.status[k] = v; }, ctx)),
      fld((names[k] || k) + ' — máx.', inp('number', f.status[k + 'Max'], v => { f.status[k + 'Max'] = v; }, ctx)))),
    h('div', { class: 'sala-grupo-campos' },
      fld('Defesa ativa (%)', inp('number', f.modificadores.defesaAtiva, v => { f.modificadores.defesaAtiva = v; }, ctx)),
      fld('Deslocamento', inp('number', f.modificadores.deslocamento, v => { f.modificadores.deslocamento = v; }, ctx)),
      fld('Reflexos', inp('number', f.modificadores.reflexos, v => { f.modificadores.reflexos = v; }, ctx))));
}

// ---- aba Perícias
function tabPericias(ctx) {
  const f = ctx.f;
  if (!Array.isArray(f.pericias)) return h('p', { class: 'sala-discreto' }, 'Esta ficha usa o formato antigo de perícias e não pode ser editada aqui.');
  while (f.pericias.length < 6) f.pericias.push([]);
  const lvlOf = n => { for (let i = 5; i >= 0; i--) if ((f.pericias[i] || []).includes(n)) return i; return 0; };
  const names = [...new Set(f.pericias.flat().filter(Boolean))]
    .sort((a, b) => lvlOf(b) - lvlOf(a) || a.localeCompare(b, 'pt'));
  const opts = [[0, '0 — sem treino'], [1, '1'], [2, '2'], [3, '3'], [4, '4'], [5, '5']];
  return h('div', {},
    h('p', { class: 'sala-discreto' }, 'Mudar o nível de uma perícia não recalcula PV/PE/MD máximos; ajuste-os na aba Status.'),
    h('div', { class: 'sala-pericias-grade' }, names.map(n => h('div', { class: 'sala-pericia-linha' },
      h('span', {}, fmtName(n)),
      sel(opts, lvlOf(n), v => {
        f.pericias.forEach(arr => { const i = arr.indexOf(n); if (i !== -1) arr.splice(i, 1); });
        f.pericias[num(v)].push(n);
      }, ctx)))));
}

// ---- aba Inventário
function newItem(type) {
  const data = type === 'arma' ? { type: 'branca', mmo: 0, maxMmo: 0, damage: '', critical: '' }
    : type === 'municao' ? { type: 'cartucho', weapon: 'pistola' } : { dice: '', type: 'objeto' };
  return { id: rid(), name: 'Novo item', description: '', weight: 0, isFavorite: false, type, data };
}

// Campos editáveis de um item (usado no editor do mestre, no formulário da mesa e nos presets)
function itemFieldList(it, ctx, S = fn => fn, onTitle = () => {}, withFav = false) {
  it.data = it.data || {};
  const d = it.data;
  const fields = [
    fld('Nome', inp('text', it.name, S(v => { it.name = v; onTitle(); }), ctx)),
    fld('Peso', inp('number', it.weight, S(v => { it.weight = v; }), ctx)),
    fld('Descrição', inp('area', it.description, S(v => { it.description = v; }), ctx), 'wide')
  ];
  if (withFav) fields.push(chk('Favorito', it.isFavorite, S(v => { it.isFavorite = v; onTitle(); }), ctx));
  if (it.type === 'arma') {
    fields.push(
      fld('Tipo', sel(['branca', 'pistola', 'rifle', 'longo_alcance'], d.type, S(v => { d.type = v; }), ctx)),
      fld('Munição atual', inp('number', d.mmo, S(v => { d.mmo = v; }), ctx)),
      fld('Munição máx.', inp('number', d.maxMmo, S(v => { d.maxMmo = v; }), ctx)),
      fld('Dano', diceInp(d.damage, S(v => { d.damage = v; }), ctx)),
      fld('Dano crítico', diceInp(d.critical, S(v => { d.critical = v; }), ctx)));
  } else if (it.type === 'municao') {
    fields.push(
      fld('Tipo', sel(['bala', 'cartucho'], d.type, S(v => { d.type = v; }), ctx)),
      fld('Arma', sel(['pistola', 'rifle', 'longo_alcance'], d.weapon, S(v => { d.weapon = v; }), ctx)));
  } else if (it.type === 'item') {
    fields.push(
      fld('Dado', diceInp(d.dice, S(v => { d.dice = v; }), ctx)),
      fld('Categoria', sel(['objeto', 'documento', 'vestimenta', 'artefato'], d.type, S(v => { d.type = v; }), ctx)));
  }
  return fields;
}

function itemEditor(ctx, list, it, place) {
  const f = ctx.f, inv = f.inventario;
  it.data = it.data || {};
  const d = it.data;
  const title = () => (it.isFavorite ? '★ ' : '') + (it.name || '(sem nome)');
  const sum = h('summary', {}, title(), h('span', { class: 'sala-discreto' }, ` · ${it.type || '?'} · peso ${num(it.weight)}`));
  const syncWeapon = () => { if (inv.weapon && inv.weapon.id === it.id) inv.weapon = JSON.parse(JSON.stringify(it)); };
  const S = fn => v => { fn(v); syncWeapon(); };
  const fields = itemFieldList(it, ctx, S, () => { sum.firstChild.textContent = title(); }, true);
  const other = place === 'inv' ? inv.guardados : inv.content;
  return h('details', { class: 'sala-item', open: ctx.justAdded === it },
    sum,
    h('div', { class: 'sala-grupo-campos' }, fields),
    h('div', { class: 'sala-linha' },
      h('button', { class: 'sala-botao', onclick: () => {
        list.splice(list.indexOf(it), 1); other.push(it); ctx.commit(); ctx.rerender();
      } }, place === 'inv' ? 'Guardar' : 'Mover p/ inventário'),
      h('button', { class: 'sala-botao sala-perigo', onclick: () => {
        if (!confirm(`Excluir "${it.name}"?`)) return;
        if (inv.weapon && inv.weapon.id === it.id) inv.weapon = {};
        list.splice(list.indexOf(it), 1); ctx.commit(); ctx.rerender();
      } }, 'Excluir')));
}

function tabInv(ctx) {
  const f = ctx.f;
  f.inventario = f.inventario || {};
  const inv = f.inventario;
  inv.content = inv.content || []; inv.guardados = inv.guardados || [];
  if (inv.additionalWeight == null) inv.additionalWeight = 0;
  const total = inv.content.reduce((s, i) => s + num(i.weight), 0);
  const where = sel([['inv', 'Inventário'], ['gua', 'Guardados']], 'inv', () => {}, { commit() {} });
  const cat = sel([['item', 'Item'], ['arma', 'Arma'], ['municao', 'Munição']], 'item', () => {}, { commit() {} });
  const sec = (t, list, place) => h('div', {},
    h('h4', { class: 'sala-titulo' }, t),
    list.length ? list.map(it => itemEditor(ctx, list, it, place)) : h('p', { class: 'sala-discreto' }, 'Vazio.'));
  return h('div', {},
    h('div', { class: 'sala-grupo-campos' },
      fld('Capacidade (peso adicional)', inp('number', inv.additionalWeight, v => { inv.additionalWeight = v; }, ctx)),
      fld('Usando', inp('area', inv.usando, v => { inv.usando = v; }, ctx), 'wide')),
    h('p', { class: 'sala-discreto' }, `Peso carregado: ${total} / ${num(inv.additionalWeight)} · Arma equipada: ${(inv.weapon && inv.weapon.name) || '—'}`,
      inv.weapon && inv.weapon.name ? h('button', { class: 'sala-botao sala-margem-esquerda', onclick: () => { inv.weapon = {}; ctx.commit(); ctx.rerender(); } }, 'Desequipar') : null),
    sec('Inventário', inv.content, 'inv'),
    sec('Guardados', inv.guardados, 'gua'),
    h('div', { class: 'sala-linha sala-margem-topo' }, where, cat,
      h('button', { class: 'sala-botao', onclick: () => {
        const it = newItem(cat.value);
        (where.value === 'inv' ? inv.content : inv.guardados).push(it);
        ctx.justAdded = it; ctx.commit(); ctx.rerender();
      } }, '+ Adicionar item')));
}

// ---- abas Magias / Habilidades / Traumas
const timeStr = t => (!t || !t.time ? '' : t.time.numero === 'PER' ? 'PER' : `${t.time.numero}${t.time.tipoT || t.time.tipo || ''}`);

function listTab(ctx, key) {
  const f = ctx.f;
  if (!Array.isArray(f[key])) f[key] = [];
  const arr = f[key];
  const isT = key === 'traumas';
  const dk = isT ? 'dado' : 'dice';
  const tipo = key === 'magias' ? 'ritual' : 'habilidade';
  const items = arr.map(it => {
    const title = () => (it.isFavorite ? '★ ' : '') + (it.name || '(sem nome)');
    const sum = h('summary', {}, title());
    const fields = [
      fld('Nome', inp('text', it.name, v => { it.name = v; sum.textContent = title(); }, ctx)),
      fld('Dado', diceInp(it[dk], v => { it[dk] = v; }, ctx))
    ];
    if (isT) {
      const ti = h('input', { class: 'sala-campo', placeholder: '2H, 1D ou PER' });
      ti.value = timeStr(it);
      ti.addEventListener('change', () => {
        const s = ti.value.trim().toUpperCase();
        let t = null;
        if (s === 'PER') t = { numero: 'PER', tipoT: 'PER' };
        else { const m = s.match(/^(\d+)([A-Z]+)$/); if (m) t = { numero: parseInt(m[1], 10), tipoT: m[2] }; }
        if (!t) { ti.classList.add('bad'); return; }
        ti.classList.remove('bad'); it.time = t; ctx.commit();
      });
      fields.push(fld('Tempo', ti));
    }
    fields.push(
      fld('Descrição', inp('area', it.description, v => { it.description = v; }, ctx), 'wide'),
      chk('Favorito', it.isFavorite, v => { it.isFavorite = v; sum.textContent = title(); }, ctx));
    return h('details', { class: 'sala-item', open: ctx.justAdded === it },
      sum,
      h('div', { class: 'sala-grupo-campos' }, fields),
      h('div', { class: 'sala-linha' },
        isT ? null : h('button', { class: 'sala-botao', title: 'Salvar como preset para dar a outros jogadores', onclick: () => savePreset(it, tipo) }, '→ Preset'),
        h('button', { class: 'sala-botao sala-perigo', onclick: () => {
        if (!confirm(`Excluir "${it.name}"?`)) return;
        arr.splice(arr.indexOf(it), 1); ctx.commit(); ctx.rerender();
      } }, 'Excluir')));
  });
  // adicionar a partir de um preset
  const pSel = h('select', { class: 'sala-campo sala-expandir' });
  const fillP = () => {
    const ids = presetsDoTipo(tipo);
    pSel.replaceChildren(...(ids.length ? ids.map(id => h('option', { value: id }, state.presets[id].nome)) : [h('option', { value: '' }, 'Nenhum preset salvo')]));
  };
  pSel.addEventListener('focus', fillP);
  fillP();
  const dePreset = isT ? null : h('div', { class: 'sala-linha sala-margem-topo' }, pSel,
    h('button', { class: 'sala-botao', onclick: () => {
      const p = state.presets[pSel.value];
      if (!p) return toast('Nenhum preset salvo ainda (aba Presets).');
      const c = textoPreset(parseItem(p.json, p.nome));
      if (arr.some(x => String(x.name || '').toLowerCase() === c.name.toLowerCase())) return toast('Este jogador já tem isso.');
      arr.push(c); ctx.justAdded = c; ctx.commit(); ctx.rerender();
    } }, '+ De preset'));
  return h('div', {},
    items.length ? items : h('p', { class: 'sala-discreto' }, 'Nada por aqui.'),
    dePreset,
    h('button', { class: 'sala-botao sala-margem-topo', onclick: () => {
      const it = isT ? { name: 'Novo trauma', description: '', dado: '', time: { numero: 'PER', tipoT: 'PER' }, isFavorite: false }
        : { name: 'Novo', description: '', dice: '', isFavorite: false };
      arr.push(it); ctx.justAdded = it; ctx.commit(); ctx.rerender();
    } }, '+ Adicionar'));
}

// ---- aba Condições (única forma de aplicar/editar condições de um jogador)
function tabCondicoes(ctx) {
  const alvo = ctx.puid;
  const lista = h('div', {});
  const render = () => safeRender(lista, () => {
    const cs = condicoesDe(alvo);
    lista.replaceChildren(...(cs.length ? cs.map(c => {
      const t = h('input', { class: 'sala-campo sala-largura-numero', type: 'number', min: 0, max: 99, value: num(c.turnos) });
      t.addEventListener('change', () => turnosCondicao(alvo, c.cid, t.value));
      return h('div', { class: 'sala-item sala-condicao-linha' },
        h('div', { class: 'sala-linha' }, h('b', { class: 'sala-expandir' }, c.nome), fld('Turnos (0 = sem limite)', t),
          h('button', { class: 'sala-botao sala-perigo', onclick: () => delCondicao(alvo, c.cid) }, 'Remover')),
        c.descricao ? h('div', { class: 'sala-descricao' }, c.descricao) : null);
    }) : [h('p', { class: 'sala-discreto' }, 'Nenhuma condição aplicada.')]));
  });
  addView('condicoes', render);
  render();
  const propria = alvo === uid;
  return h('div', {},
    propria ? h('p', { class: 'sala-discreto' }, 'Condições que afetam o seu personagem. O mestre e os outros jogadores também veem as suas condições.') : null,
    h('h4', { class: 'sala-subtitulo' }, 'Condições ativas'), lista,
    h('h4', { class: 'sala-subtitulo sala-margem-topo' }, propria ? 'Adicionar condição' : 'Aplicar condição'), condicaoForm(alvo));
}

// ---- aba Personagem
function tabBio(ctx) {
  const f = ctx.f;
  f.biografia = f.biografia || {};
  const b = f.biografia;
  const lab = { familia: 'Família', gostos: 'Gostos', desgostos: 'Desgostos', medos: 'Medos', contatos: 'Contatos próximos', historia: 'História', comportamento: 'Comportamento' };
  return h('div', {},
    h('div', { class: 'sala-grupo-campos' }, fld('Dinheiro', inp('text', b.dinheiro, v => { b.dinheiro = v; }, ctx))),
    Object.keys(lab).map(k => fld(lab[k], inp('area', b[k], v => { b[k] = v; }, ctx), 'wide')));
}

// ---- aba Dados: identidade do personagem
function objetoNomeado(f, chave) {                      // raça/ocupação/origem são objetos {nome,...}
  if (!f[chave] || typeof f[chave] !== 'object') f[chave] = { nome: '' };
  return f[chave];
}
function tabDados(ctx) {
  const f = ctx.f;
  f.status = f.status || {};
  const raca = objetoNomeado(f, 'raça'); raca.status = raca.status || { Pv: 0, Pe: 0, Md: 0 };
  const ocup = objetoNomeado(f, 'ocupação'), orig = objetoNomeado(f, 'origem');
  return h('div', {},
    h('div', { class: 'sala-grupo-campos' },
      fld('Nome', inp('text', f.nome, v => { f.nome = v; }, ctx)),
      fld('Idade', inp('text', f.idade, v => { f.idade = v; }, ctx)),
      fld('Sexo', inp('text', f.sexo, v => { f.sexo = v; }, ctx)),
      fld('Nascimento', inp('text', f.dataNascimento, v => { f.dataNascimento = v; }, ctx))),
    h('div', { class: 'sala-grupo-campos' },
      fld('Raça', inp('text', raca.nome, v => { raca.nome = v; }, ctx)),
      fld('Ocupação', inp('text', ocup.nome, v => { ocup.nome = v; }, ctx)),
      fld('Origem', inp('text', orig.nome, v => { orig.nome = v; }, ctx))),
    h('p', { class: 'sala-discreto' }, 'Bônus de status da raça'),
    h('div', { class: 'sala-grupo-campos' },
      fld('PV', inp('number', raca.status.Pv, v => { raca.status.Pv = v; }, ctx)),
      fld('PE', inp('number', raca.status.Pe, v => { raca.status.Pe = v; }, ctx)),
      fld('MD', inp('number', raca.status.Md, v => { raca.status.Md = v; }, ctx))),
    h('div', { class: 'sala-grupo-campos' },
      fld('Pontos disponíveis', inp('number', f.pontos, v => { f.pontos = v; }, ctx)),
      fld('Conhecimento mágico', inp('number', f.ConhecimentoMagico, v => { f.ConhecimentoMagico = v; }, ctx))));
}

// ---- aba Avançado: baixar, substituir, restaurar
function baixarFicha(puid) {
  const e = state.fichas[puid];
  if (!e || !e.ficha) return toast('A ficha desse jogador ainda está carregando.');
  baixarArquivo(nomeArquivo(e.ficha.nome) + '.json', JSON.stringify(e.ficha));
  toast('Ficha baixada');
}

function tabAvancado(ctx) {
  const { f, puid } = ctx;
  const e = state.fichas[puid] || {};
  const p = state.players[puid] || {};
  const arq = h('input', { type: 'file', accept: '.json,application/json', hidden: true });
  arq.addEventListener('change', async () => {
    const file = arq.files[0]; arq.value = '';
    if (!file) return;
    let novo;
    try { novo = JSON.parse(await file.text()); } catch { return toast('Arquivo inválido (não é JSON).'); }
    if (!novo || typeof novo !== 'object' || Array.isArray(novo) || !novo.nome) return toast('Esse arquivo não parece uma ficha.');
    if (!confirm(`Substituir TODA a ficha de ${f.nome || 'este jogador'} pela do arquivo "${file.name}"? Isso não pode ser desfeito.`)) return;
    for (const k of Object.keys(f)) delete f[k];
    for (const k of Object.keys(novo)) if (!SKIP_PUSH.has(k)) f[k] = novo[k];
    ctx.commit(); ctx.rerender(); toast('Ficha substituída');
  });
  const maxAll = () => {
    f.status = f.status || {};
    for (const [k, mk] of STATS) f.status[k] = num(f.status[mk]);
    ctx.commit(); ctx.rerender(); toast('PV, PE e MD no máximo');
  };
  const zeraMedo = () => { f.status = f.status || {}; f.status.medo = 0; ctx.commit(); ctx.rerender(); };
  return h('div', {},
    h('p', { class: 'sala-discreto' },
      `Última edição: ${e.editedBy === 'master' ? 'mestre' : 'jogador'}` + (e.rev ? ' · ' + new Date(e.rev).toLocaleString('pt-BR') : '') +
      (p.online ? ' · jogador online' : ' · jogador offline')),
    h('div', { class: 'sala-grupo-campos' },
      h('button', { class: 'sala-botao', onclick: () => baixarFicha(puid) }, 'Baixar ficha (.json)'),
      h('button', { class: 'sala-botao', onclick: () => arq.click() }, 'Substituir por arquivo…'), arq),
    h('p', { class: 'sala-discreto' }, 'O arquivo baixado abre normalmente em "Carregar ficha" do site. Substituir troca a ficha inteira do jogador, na hora.'),
    h('div', { class: 'sala-grupo-campos' },
      h('button', { class: 'sala-botao', onclick: maxAll }, 'PV, PE e MD no máximo'),
      h('button', { class: 'sala-botao', onclick: zeraMedo }, 'Zerar medo')),
    h('div', { class: 'sala-grupo-campos' },
      h('button', { class: 'sala-botao sala-perigo', onclick: () => kick(puid) }, 'Remover da sala')));
}

const TAB_FN = {
  dados: tabDados, avancado: tabAvancado, status: tabStatus, pericias: tabPericias, inv: tabInv, bio: tabBio,
  cond: tabCondicoes, magias: c => listTab(c, 'magias'), hab: c => listTab(c, 'habilidades'), traumas: c => listTab(c, 'traumas')
};

// ---------------------------------------------------------------- blocos de interface compartilhados
function addView(kind, render) { state.views.push({ kind, render }); }
function renderKind(kind) { state.views.forEach(v => { if (v.kind === kind) v.render(); }); }
// Submenu: uma linha de botões e um painel por botão (todos montados uma vez; só o ativo aparece)
function submenu(key, items) {
  const bar = h('div', { class: 'sala-submenu' });
  const panels = {};
  let atual = state.ui.sub[key];
  if (!items.some(i => i[0] === atual)) atual = items[0][0];
  const show = id => {
    atual = id; state.ui.sub[key] = id;
    bar.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.t === id));
    for (const k of Object.keys(panels)) panels[k].hidden = k !== id;
  };
  const wrap = h('div', {}, bar);
  for (const [id, label, node] of items) {
    bar.append(h('button', { class: 'sala-botao', 'data-t': id, onclick: () => show(id) }, label));
    panels[id] = Object.assign(h('div', { class: 'sala-subpainel' }, node), { hidden: true });
    wrap.append(panels[id]);
  }
  show(atual);
  return wrap;
}

function baixarArquivo(nome, texto) {
  const url = URL.createObjectURL(new Blob([texto], { type: 'application/json' }));
  const a = h('a', { href: url, download: nome });
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
const nomeArquivo = t => String(t || 'ficha').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w\- ]+/g, '').trim().replace(/\s+/g, '_') || 'ficha';

// Redesenha uma lista, mas espera o usuário sair do campo em que está digitando
function safeRender(box, fn) {
  const a = document.activeElement;
  if (a && box.contains(a) && /INPUT|TEXTAREA|SELECT/.test(a.tagName)) {
    box._pending = fn;
    if (!box._fo) {
      box._fo = true;
      box.addEventListener('focusout', () => setTimeout(() => {
        const b = document.activeElement;
        if (box._pending && !(b && box.contains(b))) { const f = box._pending; box._pending = null; f(); }
      }, 80));
    }
    return;
  }
  box._pending = null;
  fn();
}

const stripItem = it => { const c = JSON.parse(JSON.stringify(it)); delete c.id; c.isFavorite = false; return c; };
function parseItem(json, nome) {
  try { return JSON.parse(json); } catch { return { name: nome || 'Item', description: '', weight: 0, type: 'item', data: { dice: '', type: 'objeto' } }; }
}
function itemInfo(it) {
  const d = it.data || {};
  const parts = [];
  if (it.type === 'arma') { parts.push('Arma ' + (d.type || '')); if (d.damage) parts.push('dano ' + d.damage); if (d.critical) parts.push('crítico ' + d.critical); if (d.maxMmo) parts.push('munição ' + d.maxMmo); }
  else if (it.type === 'municao') { parts.push('Munição ' + (d.type || '') + (d.weapon ? ' de ' + d.weapon : '')); }
  else { if (d.type) parts.push(d.type); if (d.dice) parts.push('dado ' + d.dice); }
  if (num(it.weight)) parts.push('peso ' + num(it.weight));
  return parts.join(' · ');
}

// ---------------------------------------------------------------- mesa de itens
async function putOnTable(it, qty = 1, by = 'Mestre') {
  if (!state.code) return;
  const copy = stripItem(it);
  if (!copy.name) copy.name = 'Novo item';
  const payload = { json: JSON.stringify(copy), nome: copy.name, by, uid, ts: serverTimestamp() };
  const n = Math.max(1, Math.min(20, Math.floor(num(qty)) || 1));
  try {
    for (let i = 0; i < n; i++) await push(ref(db, `rooms/${state.code}/mesa`), payload);
    return true;
  } catch (e) { toast(friendly(e)); return false; }
}

async function removeFromTable(id) {
  try { await remove(ref(db, `rooms/${state.code}/mesa/${id}`)); } catch (e) { toast(friendly(e)); }
}

function addToInventory(it) {
  const item = { name: it.name || 'Item', description: it.description || '', weight: it.weight, type: it.type, data: it.data || {} };
  if (typeof createItem === 'function') createItem(item, 'inventario');
  else {
    ficha.inventario.content.push({ ...item, id: rid(), weight: num(item.weight), isFavorite: false });
    for (const fn of ['renderInventory', 'renderTotalWeight']) { try { if (typeof window[fn] === 'function') window[fn](); } catch { /* ignore */ } }
  }
  scheduleSync();
}

// Pegar da mesa: a transação garante que só um jogador leva o item
async function grabItem(id) {
  const m = state.mesa[id];
  if (!m) return;
  let found = false;
  try {
    await runTransaction(ref(db, `rooms/${state.code}/mesa/${id}`), cur => { found = cur !== null; return null; });
  } catch (e) { toast(friendly(e)); return; }
  if (!found) { toast('Alguém já pegou este item.'); return; }
  const it = parseItem(m.json, m.nome);
  addToInventory(it);
  toast(`Você pegou "${it.name}"`);
}

// Tira um item do inventário/guardados do jogador (depois de colocar na mesa ou entregar)
function tirarDoInventario({ it, list }) {
  const inv = ficha.inventario;
  if (inv.weapon && inv.weapon.id === it.id) inv.weapon = {};
  const i = list.indexOf(it);
  if (i !== -1) list.splice(i, 1);
  for (const fn of ['renderInventory', 'renderGuardados', 'renderWeaponArea', 'renderTotalWeight']) {
    try { if (typeof window[fn] === 'function') window[fn](); } catch { /* ignore */ }
  }
  scheduleSync();
}

// Colocar na mesa um item do inventário/guardados do jogador
async function placeItem(entry) {
  if (!entry || !entry.it) return;
  const ok = await putOnTable(entry.it, 1, ficha.nome || 'Jogador');
  if (!ok) return;
  tirarDoInventario(entry);
  toast(`Você colocou "${entry.it.name}" na mesa`);
}

// Entregar um item direto a outro jogador (vale também para o mestre, via preset)
async function darItem(it, destUid, deNome = 'Mestre') {
  if (!state.code || !destUid) return false;
  const copy = stripItem(it);
  try {
    await push(ref(db, `rooms/${state.code}/entregas/${destUid}`), { json: JSON.stringify(copy), nome: copy.name || 'Item', de: uid, deNome, ts: serverTimestamp() });
    return true;
  } catch (e) { toast(friendly(e)); return false; }
}
async function entregarItem(entry, destUid) {
  if (!entry || !entry.it) return toast('Escolha um item do seu inventário.');
  if (!destUid) return toast('Escolha para quem entregar.');
  const ok = await darItem(entry.it, destUid, ficha.nome || 'Jogador');
  if (!ok) return;
  tirarDoInventario(entry);
  const p = state.players[destUid];
  toast(`Você entregou "${entry.it.name}" a ${(p && p.nome) || 'outro jogador'}`);
}
// Chegou um item entregue a mim: a transação garante que ele só entra uma vez no inventário
async function receberEntrega(key, v) {
  if (!v || state.role !== 'player' || !state.code) return;
  let achou = false;
  try {
    await runTransaction(ref(db, `rooms/${state.code}/entregas/${uid}/${key}`), cur => { achou = cur !== null; return null; });
  } catch (e) { console.warn('[sala] entrega', e); return; }
  if (!achou) return;
  const it = parseItem(v.json, v.nome);
  addToInventory(it);
  toast(`${v.deNome || 'Alguém'} entregou "${it.name}" a você`);
}

// Lista de jogadores para escolher (um jogador ou "todos")
function jogadorSel(comTodos, semEu) {
  const s = h('select', { class: 'sala-campo' });
  const fill = () => {
    const atual = s.value;
    const ids = Object.keys(state.players).filter(id => !(semEu && id === uid))
      .sort((a, b) => String(state.players[a].nome || '').localeCompare(String(state.players[b].nome || ''), 'pt'));
    s.replaceChildren(...[comTodos && ids.length ? h('option', { value: '*' }, 'Todos os jogadores') : null,
      ...ids.map(id => h('option', { value: id }, state.players[id].nome || '(sem nome)'))].filter(Boolean));
    if ([...s.children].some(o => o.value === atual)) s.value = atual;
  };
  s.addEventListener('focus', fill);
  fill();
  s.alvos = () => (s.value === '*' ? Object.keys(state.players) : (s.value ? [s.value] : []));
  return s;
}

function mesaRow(id, m, master) {
  const it = parseItem(m.json, m.nome);
  return h('div', { class: 'sala-mesa-linha' },
    h('div', { class: 'sala-expandir sala-encolher' },
      h('div', {}, h('b', {}, it.name || m.nome), h('span', { class: 'sala-discreto' }, ' · por ' + (m.by || '?'))),
      h('div', { class: 'sala-discreto' }, itemInfo(it)),
      it.description ? h('div', { class: 'sala-descricao' }, it.description) : null),
    h('div', { class: 'sala-linha sala-fixo' },
      master ? [h('button', { class: 'sala-botao', title: 'Salvar este item como preset', onclick: () => savePreset(it) }, '→ Preset'),
        h('button', { class: 'sala-botao sala-perigo', onclick: () => removeFromTable(id) }, 'Remover')]
        : h('button', { class: 'sala-botao', onclick: () => grabItem(id) }, 'Pegar')));
}

function mesaForm() {
  let draft = newItem('item');
  const nctx = { commit() {} };
  const box = h('div', { class: 'sala-grupo-campos' });
  const fill = () => box.replaceChildren(...itemFieldList(draft, nctx));
  const cat = sel([['item', 'Item'], ['arma', 'Arma'], ['municao', 'Munição']], 'item', v => {
    draft = Object.assign(newItem(v), { name: draft.name, description: draft.description, weight: draft.weight });
    fill();
  }, nctx);
  const qty = h('input', { class: 'sala-campo sala-largura-quantidade', type: 'number', value: 1, min: 1, max: 20 });
  fill();
  return h('div', {},
    h('div', { class: 'sala-grupo-campos' }, fld('Categoria', cat)),
    box,
    h('div', { class: 'sala-linha' }, fld('Quantidade', qty),
      h('button', { class: 'sala-botao', onclick: () => putOnTable(draft, qty.value, 'Mestre') }, 'Colocar na mesa'),
      h('button', { class: 'sala-botao', onclick: () => savePreset(draft) }, 'Salvar como preset')));
}

// Lista com os itens do inventário e dos guardados do jogador
function escolherItem() {
  const s = h('select', { class: 'sala-campo sala-expandir sala-largo' });
  let map = [], chosen = null;
  const fill = () => {
    map = [];
    const inv = ficha.inventario || {};
    (inv.content || []).forEach(it => map.push({ it, list: inv.content, where: 'inventário' }));
    (inv.guardados || []).forEach(it => map.push({ it, list: inv.guardados, where: 'guardados' }));
    s.replaceChildren(...(map.length ? map.map((m, i) => h('option', { value: i }, `${m.it.name} (${m.where})`)) : [h('option', { value: '' }, 'Nada para escolher')]));
    const idx = map.findIndex(m => m.it === chosen);
    s.value = idx >= 0 ? String(idx) : (map.length ? '0' : '');
  };
  s.addEventListener('focus', fill);
  s.addEventListener('change', () => { const m = map[Number(s.value)]; chosen = m ? m.it : null; });
  fill();
  return { el: s, pick: () => map[Number(s.value)] || null, refresh() { chosen = null; fill(); } };
}

function placeForm() {
  const e = escolherItem();
  return h('div', { class: 'sala-linha sala-margem-topo' }, e.el,
    h('button', { class: 'sala-botao', onclick: async () => {
      const m = e.pick();
      if (!m) return toast('Escolha um item do seu inventário.');
      await placeItem(m); e.refresh();
    } }, 'Colocar na mesa'));
}

function entregarForm() {
  const e = escolherItem();
  const dest = jogadorSel(false, true);
  return h('div', { class: 'sala-margem-topo' },
    h('p', { class: 'sala-discreto' }, 'O item sai do seu inventário e vai direto para o inventário do jogador escolhido.'),
    h('div', { class: 'sala-linha' }, e.el, dest,
      h('button', { class: 'sala-botao', onclick: async () => {
        await entregarItem(e.pick(), dest.value);
        e.refresh();
      } }, 'Entregar')));
}

function mesaView(master) {
  const list = h('div', {});
  const render = () => {
    const ids = Object.keys(state.mesa).sort((a, b) => num(state.mesa[a].ts) - num(state.mesa[b].ts));
    list.replaceChildren(...(ids.length ? ids.map(id => mesaRow(id, state.mesa[id], master)) : [h('p', { class: 'sala-discreto' }, 'A mesa está vazia.')]));
  };
  addView('mesa', render);
  render();
  return master
    ? submenu('mesa-mestre', [['mesa', 'Na mesa', list], ['novo', 'Criar item', mesaForm()]])
    : submenu('mesa-jogador', [['mesa', 'Na mesa', list], ['colocar', 'Colocar item meu', placeForm()], ['entregar', 'Entregar a alguém', entregarForm()]]);
}

// ---------------------------------------------------------------- presets (mestre)
// Cada preset tem um tipo: item, ritual, habilidade ou npc
const TIPOS_PRESET = [['item', 'Itens'], ['ritual', 'Rituais'], ['habilidade', 'Habilidades'], ['npc', 'NPCs']];
const presetsDoTipo = tipo => Object.keys(state.presets)
  .filter(id => (state.presets[id].tipo || 'item') === tipo)
  .sort((a, b) => String(state.presets[a].nome).localeCompare(String(state.presets[b].nome), 'pt'));
const textoPreset = it => ({ name: it.name || 'Novo', description: it.description || '', dice: it.dice || '', isFavorite: false });

async function savePreset(it, tipo = 'item') {
  if (!state.code) return;
  const copy = tipo === 'item' ? stripItem(it)
    : tipo === 'npc' ? { ...NPC_VAZIO(), ...it, pv: num(it.pvMax), pe: num(it.peMax), md: 0 }
    : textoPreset(it);
  const nome = copy.name || copy.nome || (tipo === 'item' ? 'Novo item' : tipo === 'npc' ? 'NPC' : 'Novo');
  if (tipo === 'item' && !copy.name) copy.name = nome;
  try {
    await push(ref(db, `rooms/${state.code}/presets`), { json: JSON.stringify(copy), nome, tipo });
    toast(`Preset "${nome}" salvo`);
  } catch (e) { toast(friendly(e)); }
}
function excluirPreset(id, nome) {
  if (confirm(`Excluir o preset "${nome}"?`)) remove(ref(db, `rooms/${state.code}/presets/${id}`)).catch(e => toast(friendly(e)));
}
const salvarPresetEditado = (id, tipo, c) =>
  update(ref(db), { [`rooms/${state.code}/presets/${id}`]: { json: JSON.stringify(c), nome: c.name || c.nome || 'Preset', tipo } })
    .catch(e => toast(friendly(e)));

function presetRow(id) {
  const p = state.presets[id];
  const it = parseItem(p.json, p.nome);
  const name = h('span', {}, it.name || p.nome);
  const sum = h('summary', {}, name, h('span', { class: 'sala-discreto' }, ' ' + itemInfo(it)),
    h('button', { class: 'sala-botao sala-margem-esquerda', onclick: e => { if (e.preventDefault) e.preventDefault(); putOnTable(it, 1, 'Mestre'); } }, '+ Mesa'));
  const qty = h('input', { class: 'sala-campo sala-largura-quantidade', type: 'number', value: 1, min: 1, max: 20 });
  const dest = jogadorSel(true);
  const ctx = { commit() { salvarPresetEditado(id, 'item', stripItem(it)); } };
  return h('details', { class: 'sala-item' }, sum,
    h('div', { class: 'sala-grupo-campos' }, itemFieldList(it, ctx, undefined, () => { name.textContent = it.name || '(sem nome)'; })),
    h('div', { class: 'sala-linha' }, fld('Quantidade', qty),
      h('button', { class: 'sala-botao', onclick: () => putOnTable(it, qty.value, 'Mestre') }, 'Colocar na mesa')),
    h('div', { class: 'sala-linha sala-margem-topo' }, dest,
      h('button', { class: 'sala-botao', onclick: async () => {
        const alvos = dest.alvos();
        if (!alvos.length) return toast('Não há jogadores na sala.');
        for (const a of alvos) await darItem(it, a, 'Mestre');
        toast(`"${it.name}" entregue a ${alvos.length} jogador(es)`);
      } }, 'Dar ao jogador'),
      h('button', { class: 'sala-botao sala-perigo', onclick: () => excluirPreset(id, it.name) }, 'Excluir preset')));
}

// Dá um ritual ou habilidade a um ou mais jogadores (grava direto na ficha deles)
async function darPreset(it, tipo, puids) {
  const key = tipo === 'ritual' ? 'magias' : 'habilidades';
  if (!puids.length) return toast('Não há jogadores na sala.');
  let ok = 0, ja = 0;
  for (const puid of puids) {
    const e = state.fichas[puid];
    if (!e || !e.ficha) continue;
    const f = JSON.parse(JSON.stringify(e.ficha));
    if (!Array.isArray(f[key])) f[key] = [];
    if (f[key].some(x => String(x.name || '').toLowerCase() === String(it.name || '').toLowerCase())) { ja++; continue; }
    f[key].push(textoPreset(it));
    await masterCommit(puid, f);
    rebuildEditorIfOpen(puid);
    ok++;
  }
  const rotulo = tipo === 'ritual' ? 'Ritual' : 'Habilidade';
  toast(ok ? `${rotulo} "${it.name}" dado a ${ok} jogador(es)` + (ja ? ` (${ja} já tinha)` : '') : (ja ? 'Esse jogador já tem isso.' : 'Nenhuma ficha carregada.'));
}

function presetTextoRow(id, tipo) {
  const p = state.presets[id];
  const it = { ...textoPreset({}), ...parseItem(p.json, p.nome) };
  const sum = h('summary', {}, it.name || p.nome, it.dice ? h('span', { class: 'sala-discreto' }, ' · ' + it.dice) : null);
  const ctx = { commit() { salvarPresetEditado(id, tipo, textoPreset(it)); } };
  const dest = jogadorSel(true);
  return h('details', { class: 'sala-item' }, sum,
    h('div', { class: 'sala-grupo-campos' },
      fld('Nome', inp('text', it.name, v => { it.name = v; sum.firstChild.textContent = v || '(sem nome)'; }, ctx)),
      fld('Dado', diceInp(it.dice, v => { it.dice = v; }, ctx)),
      fld('Descrição', inp('area', it.description, v => { it.description = v; }, ctx), 'wide')),
    h('div', { class: 'sala-linha' }, dest,
      h('button', { class: 'sala-botao', onclick: () => darPreset(it, tipo, dest.alvos()) }, 'Dar ao jogador'),
      h('button', { class: 'sala-botao sala-perigo', onclick: () => excluirPreset(id, it.name) }, 'Excluir preset')));
}

function presetNpcRow(id) {
  const p = state.presets[id];
  const d = { ...NPC_VAZIO(), ...parseItem(p.json, p.nome) };
  const ctx = { commit() { salvarPresetEditado(id, 'npc', { ...d, nome: d.nome || 'NPC' }); } };
  const sum = h('summary', {}, d.nome || p.nome, h('span', { class: 'sala-discreto' }, ` · PV ${num(d.pvMax)} · PE ${num(d.peMax)} · MD ${num(d.mdMax)}`));
  return h('details', { class: 'sala-item' }, sum,
    h('div', { class: 'sala-grupo-campos' },
      fld('Nome', inp('text', d.nome, v => { d.nome = v; }, ctx)),
      fld('PV máx.', inp('number', d.pvMax, v => { d.pvMax = v; d.pv = v; }, ctx)),
      fld('PE máx.', inp('number', d.peMax, v => { d.peMax = v; d.pe = v; }, ctx)),
      fld('MD máx.', inp('number', d.mdMax, v => { d.mdMax = v; }, ctx)),
      fld('Notas', inp('area', d.notas, v => { d.notas = v; }, ctx), 'wide')),
    h('div', { class: 'sala-linha' },
      h('button', { class: 'sala-botao', onclick: () => npcNovo(npcDePreset(d)).then(k => k && toast(`"${d.nome}" entrou em cena`)) }, 'Colocar em cena'),
      h('button', { class: 'sala-botao sala-perigo', onclick: () => excluirPreset(id, d.nome) }, 'Excluir preset')));
}
const npcDePreset = d => ({ ...d, pv: num(d.pvMax), pe: num(d.peMax), md: 0 });

// Formulário para criar um ritual ou habilidade novo já como preset
function presetNovoForm(tipo) {
  const vazio = () => ({ name: '', description: '', dice: '', isFavorite: false });
  let draft = vazio();
  const box = h('div', { class: 'sala-grupo-campos' });
  const nctx = { commit() {} };
  const fill = () => box.replaceChildren(
    fld('Nome', inp('text', draft.name, v => { draft.name = v; }, nctx)),
    fld('Dado', diceInp(draft.dice, v => { draft.dice = v; }, nctx)),
    fld('Descrição', inp('area', draft.description, v => { draft.description = v; }, nctx), 'wide'));
  fill();
  return h('div', { class: 'sala-caixa' },
    h('h4', { class: 'sala-subtitulo' }, tipo === 'ritual' ? 'Novo ritual' : 'Nova habilidade'), box,
    h('button', { class: 'sala-botao sala-margem-topo', onclick: async () => {
      if (!String(draft.name).trim()) return toast('Digite o nome.');
      await savePreset(draft, tipo); draft = vazio(); fill();
    } }, 'Salvar preset'));
}

function presetsView() {
  const blocos = TIPOS_PRESET.map(([tipo, rotulo]) => {
    const list = h('div', {});
    const render = () => safeRender(list, () => {
      const ids = presetsDoTipo(tipo);
      const vazio = tipo === 'item' ? 'Nenhum item salvo. Crie um item em Mesa → "Criar item" e use "Salvar como preset", ou use "→ Preset" num item da mesa.'
        : tipo === 'npc' ? 'Nenhum NPC salvo. Crie um na aba NPCs e use "Salvar preset".'
        : 'Nenhum preset ainda. Crie um abaixo, ou use "→ Preset" na aba do jogador.';
      list.replaceChildren(...(ids.length ? ids.map(id => tipo === 'item' ? presetRow(id) : tipo === 'npc' ? presetNpcRow(id) : presetTextoRow(id, tipo))
        : [h('p', { class: 'sala-discreto' }, vazio)]));
    });
    addView('presets', render);
    render();
    return [tipo, rotulo, h('div', {}, list, tipo === 'ritual' || tipo === 'habilidade' ? presetNovoForm(tipo) : null)];
  });
  return submenu('presets', blocos);
}

// ---------------------------------------------------------------- NPCs (mestre)
const NPC_VAZIO = () => ({ nome: 'Novo NPC', pv: 10, pvMax: 10, pe: 0, peMax: 0, md: 0, mdMax: 10, notas: '' });
const NPC_STATS = [['pv', 'pvMax', 'PV', 'pv'], ['pe', 'peMax', 'PE', 'pe'], ['md', 'mdMax', 'MD', 'md']];

async function npcNovo(d) {
  if (!state.code) return null;
  try { const r = await push(ref(db, `rooms/${state.code}/npcs`), { ...NPC_VAZIO(), ...d }); return r.key; }
  catch (e) { toast(friendly(e)); return null; }
}
function npcSet(nid, patch) {
  const u = {};
  for (const [k, v] of Object.entries(patch)) u[`rooms/${state.code}/npcs/${nid}/${k}`] = v;
  return update(ref(db), u).catch(e => toast(friendly(e)));
}
function npcAjuste(nid, k, mk, dir) {
  const n = state.npcs[nid];
  if (!n) return;
  const max = num(n[mk]);
  let v = num(n[k]) + dir * (state.ui.step || 1);
  v = Math.max(0, max > 0 ? Math.min(max, v) : v);
  npcSet(nid, { [k]: v });
}
function npcIni(nid) {
  const n = state.npcs[nid];
  if (!n) return;
  const r = 1 + Math.floor(Math.random() * 20);
  return iniUpdate({ [`entries/n_${nid}`]: { nome: n.nome || 'NPC', valor: r, tipo: 'npc', npc: nid } });
}
async function npcRemover(nid) {
  const n = state.npcs[nid];
  if (!confirm(`Remover "${(n && n.nome) || 'NPC'}" da cena?`)) return;
  const base = `rooms/${state.code}`, eid = 'n_' + nid;
  const u = { [`${base}/npcs/${nid}`]: null, [`${base}/condicoes/${nid}`]: null };
  const ini = state.ini || {};
  if (ini.entries && ini.entries[eid]) {
    u[`${base}/iniciativa/entries/${eid}`] = null;
    if (ini.atual === eid) { const resto = iniSorted().filter(e => e.id !== eid); u[`${base}/iniciativa/atual`] = resto.length ? resto[0].id : null; }
  }
  try { await update(ref(db), u); } catch (e) { toast(friendly(e)); }
}

function npcCard(nid) {
  const n = state.npcs[nid];
  const nome = h('input', { class: 'sala-campo sala-expandir', value: n.nome || '' });
  nome.addEventListener('change', () => {
    const v = nome.value.trim() || 'NPC';
    npcSet(nid, { nome: v });
    const ent = state.ini && state.ini.entries && state.ini.entries['n_' + nid];
    if (ent) iniUpdate({ [`entries/n_${nid}/nome`]: v });
  });
  const barras = h('div', { class: 'sala-barras' }, NPC_STATS.map(([k, mk, label, cls]) => {
    const cur = num(n[k]), max = num(n[mk]);
    const fill = h('i'); fill.style.width = (max > 0 ? Math.max(0, Math.min(100, (cur / max) * 100)) : 0) + '%';
    return h('div', { class: 'sala-estatistica' },
      h('div', { class: 'sala-barra ' + cls }, fill, h('span', {}, `${label} ${cur}/${max}`)),
      h('div', { class: 'sala-ajuste' },
        h('button', { class: 'sala-botao', onclick: () => npcAjuste(nid, k, mk, -1) }, '−'),
        h('button', { class: 'sala-botao', onclick: () => npcAjuste(nid, k, mk, +1) }, '+')));
  }));
  const numero = k => { const i = h('input', { class: 'sala-campo', type: 'number', value: num(n[k]) }); i.addEventListener('change', () => npcSet(nid, { [k]: num(i.value) })); return i; };
  const notas = h('textarea', { class: 'sala-campo', rows: 3 });
  notas.value = n.notas || '';
  notas.addEventListener('change', () => npcSet(nid, { notas: notas.value }));
  const det = h('details', { class: 'sala-item', open: !!state.ui.npcAberto[nid] },
    h('summary', {}, 'Detalhes'),
    h('div', { class: 'sala-grupo-campos' },
      NPC_STATS.flatMap(([k, mk, label]) => [fld(label + ' atual', numero(k)), fld(label + ' máx.', numero(mk))]),
      fld('Notas', notas, 'wide')));
  det.addEventListener('toggle', () => { state.ui.npcAberto[nid] = det.open; });
  return h('div', { class: 'sala-card', 'data-npc': nid },
    h('header', {}, nome),
    barras,
    h('div', { class: 'sala-condicoes' }, emblemas(nid, true)),
    condicaoForm(nid),
    det,
    h('div', { class: 'sala-linha sala-margem-topo' },
      h('button', { class: 'sala-botao', onclick: () => npcIni(nid) }, '→ Iniciativa'),
      h('button', { class: 'sala-botao', onclick: () => savePreset({ ...n }, 'npc').catch(() => {}) }, 'Salvar preset'),
      h('button', { class: 'sala-botao sala-perigo', onclick: () => npcRemover(nid) }, 'Remover')));
}

function npcsView() {
  const list = h('div', { class: 'sala-lista' });
  const render = () => safeRender(list, () => {
    const ids = Object.keys(state.npcs).sort((a, b) => String(state.npcs[a].nome).localeCompare(String(state.npcs[b].nome), 'pt'));
    list.replaceChildren(...(ids.length ? ids.map(npcCard) : [h('p', { class: 'sala-discreto' }, 'Nenhum NPC em cena. Crie um abaixo ou coloque um preset em cena.')]));
  });
  addView('npcs', render);
  addView('condicoes', render);
  render();
  const nome = h('input', { class: 'sala-campo sala-expandir', placeholder: 'Nome (ex: Lobo sombrio)' });
  const pv = h('input', { class: 'sala-campo sala-largura-numero', type: 'number', placeholder: 'PV', value: 10 });
  const pe = h('input', { class: 'sala-campo sala-largura-numero', type: 'number', placeholder: 'PE', value: 0 });
  const md = h('input', { class: 'sala-campo sala-largura-numero', type: 'number', placeholder: 'MD', value: 10 });
  return h('div', {}, list,
    h('div', { class: 'sala-caixa sala-margem-topo' }, h('h4', { class: 'sala-subtitulo' }, 'Novo NPC'),
      h('div', { class: 'sala-linha' }, nome, pv, pe, md,
        h('button', { class: 'sala-botao', onclick: async () => {
          const k = await npcNovo({ nome: nome.value.trim() || 'Novo NPC', pv: num(pv.value), pvMax: num(pv.value), pe: num(pe.value), peMax: num(pe.value), md: 0, mdMax: num(md.value) });
          if (k) nome.value = '';
        } }, '+ Criar')),
      h('p', { class: 'sala-discreto' }, 'Os campos são PV, PE e MD máximos. Depois de criado, dá para ajustar tudo e salvar como preset.')));
}

// ---------------------------------------------------------------- iniciativa
const iniSorted = () => Object.entries((state.ini && state.ini.entries) || {})
  .map(([id, e]) => ({ id, ...e }))
  .sort((a, b) => num(b.valor) - num(a.valor) || String(a.nome).localeCompare(String(b.nome), 'pt'));

async function iniUpdate(map, extra = {}) {
  const base = `rooms/${state.code}/iniciativa`;
  const u = { ...extra };
  for (const [k, v] of Object.entries(map)) u[`${base}/${k}`] = v;
  try { await update(ref(db), u); } catch (e) { toast(friendly(e)); }
}
function iniToggle() {
  const ini = state.ini || {};
  const on = !ini.ativa;
  const patch = { ativa: on };
  if (on) {
    if (!ini.rodada) patch.rodada = 1;
    if (!ini.atual || !(ini.entries && ini.entries[ini.atual])) { const first = iniSorted()[0]; if (first) patch.atual = first.id; }
  }
  return iniUpdate(patch);
}
function iniNext() {
  const list = iniSorted();
  if (!list.length) return toast('Adicione alguém à ordem de iniciativa.');
  const ini = state.ini || {};
  const idx = list.findIndex(e => e.id === ini.atual);
  let next = idx + 1, rodada = num(ini.rodada) || 1;
  if (idx < 0) next = 0;
  else if (next >= list.length) { next = 0; rodada++; }
  // ao fim do turno, as condições de quem acabou de jogar perdem 1 turno
  const extra = {}, acabou = [];
  if (idx >= 0) {
    const alvo = alvoIni(list[idx]);
    const ativas = condicoesDe(alvo).filter(c => num(c.turnos) > 0);
    for (const c of ativas) if (c.turnos <= 1) acabou.push(c.nome);
    if (ehJogador(alvo)) {
      if (ativas.length) mudarCondicoes(alvo, m => {
        for (const c of ativas) { const x = m[c.cid]; if (!x) continue; if (x.turnos <= 1) delete m[c.cid]; else x.turnos -= 1; }
      });
    } else {
      for (const c of ativas) {
        const caminho = `rooms/${state.code}/condicoes/${alvo}/${c.cid}`;
        if (c.turnos <= 1) extra[caminho] = null; else extra[`${caminho}/turnos`] = c.turnos - 1;
      }
    }
    if (acabou.length) toast(`${list[idx].nome}: ${acabou.join(', ')} terminou`);
  }
  return iniUpdate({ atual: list[next].id, rodada, ativa: true }, extra);
}
function iniReset() {
  const first = iniSorted()[0];
  return iniUpdate({ rodada: 1, atual: first ? first.id : null });
}
function iniAdd(nome, valor) {
  if (!nome) return toast('Digite um nome.');
  const id = 'n_' + rid().replace(/-/g, '').slice(0, 8);
  return iniUpdate({ [`entries/${id}`]: { nome, valor: num(valor), tipo: 'npc' } });
}
function iniAddPlayers() {
  const entries = (state.ini && state.ini.entries) || {};
  const map = {};
  for (const [puid, p] of Object.entries(state.players)) {
    if (!entries['p_' + puid]) map[`entries/p_${puid}`] = { nome: p.nome || 'Jogador', valor: 0, uid: puid, tipo: 'jogador' };
  }
  if (!Object.keys(map).length) return toast('Todos os jogadores já estão na lista.');
  return iniUpdate(map);
}
function iniClear() {
  if (!confirm('Limpar toda a lista de iniciativa?')) return;
  return iniUpdate({ entries: null, atual: null, rodada: 1 });
}
function iniDel(id) {
  const patch = { [`entries/${id}`]: null };
  const ini = state.ini || {};
  if (ini.atual === id) {
    const rest = iniSorted().filter(e => e.id !== id);
    const i = iniSorted().findIndex(e => e.id === id);
    patch.atual = rest.length ? rest[Math.min(i, rest.length - 1)].id : null;
  }
  return iniUpdate(patch);
}
function setMyIni(valor) {
  const v = Number(valor);
  if (!Number.isFinite(v)) return toast('Digite um número.');
  return update(ref(db), { [`rooms/${state.code}/iniciativa/entries/p_${uid}`]: { nome: ficha.nome || 'Jogador', valor: v, uid, tipo: 'jogador' } })
    .catch(e => toast(friendly(e)));
}

function iniRow(e, master, ini) {
  const cur = !!(ini.ativa && ini.atual === e.id);
  if (!master) {
    return h('div', { class: 'sala-iniciativa-linha' + (cur ? ' cur' : '') },
      h('span', { class: 'sala-iniciativa-valor' }, String(num(e.valor))),
      h('span', { class: 'sala-iniciativa-nome' }, (cur ? '▶ ' : '') + (e.nome || '?') + (e.uid === uid ? ' (você)' : '')),
      h('span', { class: 'sala-condicoes' }, emblemas(alvoIni(e), false)));
  }
  const val = h('input', { class: 'sala-campo', type: 'number' });
  val.value = num(e.valor);
  val.addEventListener('change', () => iniUpdate({ [`entries/${e.id}/valor`]: num(val.value) }));
  const nm = h('input', { class: 'sala-campo sala-iniciativa-nome' });
  nm.value = e.nome || '';
  nm.addEventListener('change', () => { if (nm.value.trim()) iniUpdate({ [`entries/${e.id}/nome`]: nm.value.trim() }); });
  return h('div', { class: 'sala-iniciativa-linha' + (cur ? ' cur' : '') },
    h('span', { class: 'sala-iniciativa-valor' }, val), nm,
    h('span', { class: 'sala-condicoes' }, emblemas(alvoIni(e), false)),
    h('button', { class: 'sala-botao', title: 'Dar o turno a este', onclick: () => iniUpdate({ atual: e.id, ativa: true }) }, '▶'),
    h('button', { class: 'sala-botao', title: 'Rolar d20', onclick: () => iniUpdate({ [`entries/${e.id}/valor`]: 1 + Math.floor(Math.random() * 20) }) }, 'd20'),
    h('button', { class: 'sala-botao sala-perigo', onclick: () => iniDel(e.id) }, '✕'));
}

function iniView(master) {
  const refs = {};
  const list = h('div', {});
  let top;
  if (master) {
    const nm = h('input', { class: 'sala-campo sala-expandir sala-largo', placeholder: 'Nome (inimigo/NPC)' });
    const vl = h('input', { class: 'sala-campo sala-largura-numero', type: 'number', placeholder: 'Valor' });
    top = h('div', {},
      h('div', { class: 'sala-linha' },
        (refs.toggle = h('button', { class: 'sala-botao', onclick: iniToggle }, 'Ativar iniciativa')),
        h('button', { class: 'sala-botao', onclick: iniNext }, 'Próximo turno ▶'),
        h('button', { class: 'sala-botao', onclick: iniReset }, 'Reiniciar rodada'),
        (refs.round = h('span', { class: 'sala-discreto' }))),
      h('div', { class: 'sala-linha sala-margem-vertical' }, nm, vl,
        h('button', { class: 'sala-botao', onclick: () => { iniAdd(nm.value.trim(), vl.value); nm.value = ''; vl.value = ''; } }, '+ Adicionar'),
        h('button', { class: 'sala-botao', onclick: iniAddPlayers }, '+ Jogadores'),
        h('button', { class: 'sala-botao sala-perigo', onclick: iniClear }, 'Limpar lista')));
  } else {
    const v = h('input', { class: 'sala-campo sala-largura-numero wide', type: 'number', placeholder: 'Sua iniciativa' });
    refs.self = h('div', { class: 'sala-linha sala-margem-topo' }, v,
      h('button', { class: 'sala-botao', onclick: () => setMyIni(v.value) }, 'Definir'),
      h('button', { class: 'sala-botao', onclick: () => {
        const r = 1 + Math.floor(Math.random() * 20);
        v.value = r; setMyIni(r);
        logRoll({ label: 'Iniciativa', expr: '1d20', total: r, detail: `d20 (${r})` });
      } }, 'Rolar d20'));
    refs.round = h('div', { class: 'sala-discreto' });
    top = h('div', {}, refs.round);
  }
  const render = () => {
    const ini = state.ini || {};
    if (refs.toggle) refs.toggle.textContent = ini.ativa ? 'Desativar iniciativa' : 'Ativar iniciativa';
    if (refs.round) refs.round.textContent = ini.ativa ? `Rodada ${num(ini.rodada) || 1}` : (master ? 'Desativada' : 'A iniciativa não está ativa.');
    if (refs.self) refs.self.hidden = !ini.ativa;
    safeRender(list, () => {
      const rows = (master || ini.ativa) ? iniSorted().map(e => iniRow(e, master, ini)) : [];
      list.replaceChildren(...(rows.length ? rows : (master || ini.ativa ? [h('p', { class: 'sala-discreto' }, 'Ninguém na ordem ainda.')] : [])));
    });
  };
  addView('ini', render);
  addView('condicoes', render);
  render();
  return h('div', {}, top, list, refs.self || null);
}

// ---------------------------------------------------------------- opções avançadas da sala (mestre)
function baixarTodasFichas() {
  const lista = Object.keys(state.fichas).map(id => state.fichas[id].ficha).filter(Boolean);
  if (!lista.length) return toast('Nenhuma ficha carregada ainda.');
  baixarArquivo(`sala_${state.code}_fichas.json`, JSON.stringify({ sala: state.code, mesa: (state.meta && state.meta.name) || '', baixadoEm: new Date().toISOString(), fichas: lista }, null, 1));
  toast(`${lista.length} ficha(s) baixada(s) em um arquivo`);
}
async function limparNo(caminho, texto) {
  if (!confirm(texto)) return;
  try { await remove(ref(db, `rooms/${state.code}/${caminho}`)); toast('Pronto'); } catch (e) { toast(friendly(e)); }
}
function salaAvancado() {
  const nome = h('input', { class: 'sala-campo sala-expandir', maxlength: 40 });
  nome.value = (state.meta && state.meta.name) || '';
  const salvar = async () => {
    const n = nome.value.trim() || 'Mesa';
    try {
      await update(ref(db), { [`rooms/${state.code}/meta/name`]: n });
      const l = lsGet(LS_MASTER, []); l.forEach(r => { if (r.code === state.code) r.name = n; }); lsSet(LS_MASTER, l);
      toast('Nome da mesa alterado');
    } catch (e) { toast(friendly(e)); }
  };
  const todos = async () => {
    const ids = Object.keys(state.players);
    if (!ids.length) return toast('Não há jogadores na sala.');
    if (!confirm(`Remover os ${ids.length} jogadores da sala? As fichas dentro da sala serão apagadas (cada jogador mantém a dele no navegador).`)) return;
    const base = `rooms/${state.code}`, u = {};
    ids.forEach(id => { u[`${base}/players/${id}`] = null; u[`${base}/fichas/${id}`] = null; });
    try { await update(ref(db), u); } catch (e) { toast(friendly(e)); }
  };
  const seg = h('code', { class: 'sala-codigo sm' });
  let visivel = false;
  const pintaSeg = () => {
    seg.textContent = state.segredo ? (visivel ? state.segredo : '••••••••••••') : 'Esta sala ainda não tem código de mestre.';
    if (btnVer) btnVer.textContent = visivel ? 'Ocultar' : 'Mostrar';
    if (btnGerar) btnGerar.hidden = !!state.segredo;
  };
  const trocaSeg = async revogar => {
    if (revogar && !confirm('Gerar um novo código e tirar o acesso de mestre de todos os outros aparelhos?')) return;
    const u = { [`rooms/${state.code}/segredo`]: newSecret() };
    if (revogar) u[`rooms/${state.code}/claim`] = null;
    try { await update(ref(db), u); toast(revogar ? 'Novo código gerado; outros aparelhos foram desconectados' : 'Código de mestre gerado'); }
    catch (e) { toast(friendly(e)); }
  };
  const btnGerar = h('button', { class: 'sala-botao', onclick: () => trocaSeg(false) }, 'Gerar código');
  const btnVer = h('button', { class: 'sala-botao', onclick: () => { visivel = !visivel; pintaSeg(); } }, 'Mostrar');
  addView('segredo', pintaSeg);
  pintaSeg();
  return h('div', { class: 'sala-lista' },
    h('div', { class: 'sala-caixa' }, h('h3', { class: 'sala-titulo' }, 'Acesso do mestre (outros aparelhos)'),
      h('p', { class: 'sala-discreto' }, 'Quem tiver este código e o código da sala pode mestrar daqui. Guarde com cuidado: ele permite editar tudo da sala.'),
      h('div', { class: 'sala-linha' }, seg, btnVer,
        h('button', { class: 'sala-botao', onclick: () => state.segredo && navigator.clipboard && navigator.clipboard.writeText(state.segredo).then(() => toast('Código de mestre copiado')) }, 'Copiar'),
        btnGerar,
        h('button', { class: 'sala-botao sala-perigo', onclick: () => trocaSeg(true) }, 'Gerar novo e revogar outros'))),
    h('div', { class: 'sala-caixa' }, h('h3', { class: 'sala-titulo' }, 'Mesa'),
      h('div', { class: 'sala-linha' }, nome, h('button', { class: 'sala-botao', onclick: salvar }, 'Renomear'))),
    h('div', { class: 'sala-caixa' }, h('h3', { class: 'sala-titulo' }, 'Fichas'),
      h('div', { class: 'sala-linha' },
        h('button', { class: 'sala-botao', onclick: baixarTodasFichas }, 'Baixar todas as fichas (1 arquivo)')),
      h('p', { class: 'sala-discreto' }, 'Para baixar uma ficha só, abra o jogador e use a aba Avançado.')),
    h('div', { class: 'sala-caixa' }, h('h3', { class: 'sala-titulo' }, 'Limpeza'),
      h('div', { class: 'sala-linha' },
        h('button', { class: 'sala-botao', onclick: () => limparNo('mesa', 'Remover todos os itens da mesa?') }, 'Limpar mesa'),
        h('button', { class: 'sala-botao', onclick: () => limparNo('rolls', 'Limpar o histórico de rolagens?') }, 'Limpar rolagens'),
        h('button', { class: 'sala-botao', onclick: iniClear }, 'Limpar iniciativa'),
        h('button', { class: 'sala-botao sala-perigo', onclick: todos }, 'Remover todos os jogadores'))));
}

// ---------------------------------------------------------------- tela do jogador (aba "Sala")
let salaContent;

function renderPlayerSala() {
  if (!salaContent) return;
  salaContent.replaceChildren();
  state.containers = state.containers.filter(c => c.master);
  state.rollBoxes = [];
  state.views = [];

  if (!CFG_OK) {
    salaContent.append(h('div', { class: 'sala-conteudo' }, h('div', { class: 'sala-caixa' },
      h('h3', { class: 'sala-titulo' }, 'Salas'),
      h('p', {}, 'As salas ainda não estão configuradas. Preencha o arquivo firebase-config.js com os dados do seu projeto Firebase.'))));
    return;
  }

  if (state.role === 'player' && state.code) {
    const players = h('div', { class: 'sala-lista' });
    players._empty = h('p', { class: 'sala-discreto' }, 'Aguardando jogadores…');
    state.containers.push({ el: players, master: false });
    const rolls = h('div', { class: 'sala-rolagens' });
    state.rollBoxes.push(rolls);
    const anon = anonimaCheckbox();
    salaContent.append(h('div', { class: 'sala-conteudo' },
      h('div', { class: 'sala-caixa sala-linha' },
        h('div', {}, h('div', { class: 'sala-discreto' }, 'Sala' + (state.meta && state.meta.name ? ' · ' + state.meta.name : '')),
          h('div', { class: 'sala-codigo' }, state.code)),
        h('div', { class: 'sala-expandir' }),
        h('button', { class: 'sala-botao', onclick: () => navigator.clipboard && navigator.clipboard.writeText(state.code).then(() => toast('Código copiado')) }, 'Copiar código'),
        h('button', { class: 'sala-botao sala-perigo', onclick: () => { if (confirm('Sair da sala?')) leaveAsPlayer(); } }, 'Sair da sala')),
      h('div', { class: 'sala-caixa' }, submenu('jogador', [
        ['jogadores', 'Jogadores', h('div', {}, players, players._empty)],
        ['iniciativa', 'Iniciativa', iniView(false)],
        ['mesa', 'Mesa', mesaView(false)],
        ['rolagens', 'Rolagens', h('div', {}, h('div', { class: 'sala-margem-baixo' }, anon,
          h('div', { class: 'sala-discreto' }, 'Com "Anônima" marcada, o que você rolar não aparece no histórico da sala.')), rolls)]]))));
    renderAll(); fillRolls(rolls);
    return;
  }

  const msg = h('p', { class: 'sala-discreto' }, 'Peça o código ao mestre.');
  const code = h('input', { class: 'sala-campo sala-campo-codigo', placeholder: 'CÓDIGO', maxlength: 8 });
  code.addEventListener('input', () => { code.value = cleanCode(code.value); });
  const go = async () => {
    msg.className = 'sala-discreto'; msg.textContent = 'Entrando…';
    try { await joinAsPlayer(code.value); renderPlayerSala(); toast('Você entrou na sala ' + state.code); }
    catch (e) { msg.className = 'sala-erro'; msg.textContent = friendly(e); }
  };
  code.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
  salaContent.append(h('div', { class: 'sala-conteudo' }, h('div', { class: 'sala-caixa' },
    h('h3', { class: 'sala-titulo' }, 'Entrar em uma sala'),
    h('p', { class: 'sala-discreto' }, 'Ao entrar, nome, PV, PE e MD ficam visíveis para a mesa e o mestre passa a ver (e poder editar) a sua ficha. As rolagens aparecem no histórico da sala.'),
    h('div', { class: 'sala-linha' }, code, h('button', { class: 'sala-botao', onclick: go }, 'Entrar')),
    msg)));
}

// ---------------------------------------------------------------- tela do mestre (sobreposição)
let overlay;

function openMaster() {
  if (!overlay) { overlay = h('div', { class: 'sala-sobreposicao' }); document.body.append(overlay); }
  overlay.classList.add('open');
  masterHome();
}
function closeMaster() { disconnectRoom(); overlay.classList.remove('open'); }

function masterHome() {
  disconnectRoom();
  const msg = h('p', { class: 'sala-discreto' });
  const say = (t, bad) => { msg.textContent = t; msg.className = bad ? 'sala-erro' : 'sala-discreto'; };
  const nameIn = h('input', { class: 'sala-campo', placeholder: 'Nome da mesa (opcional)', maxlength: 40 });
  const list = h('div', { class: 'sala-lista' });
  const salaIn = h('input', { class: 'sala-campo sala-campo-codigo', placeholder: 'SALA', maxlength: 8 });
  const segIn = h('input', { class: 'sala-campo sala-expandir', placeholder: 'CÓDIGO DE MESTRE', maxlength: 16 });
  salaIn.addEventListener('input', () => { salaIn.value = cleanCode(salaIn.value); });
  segIn.addEventListener('input', () => { segIn.value = cleanSecret(segIn.value); });
  const enter = async code => {
    say('Abrindo…');
    try { await openMasterRoom(code); masterRoomView(); }
    catch (e) { say(friendly(e), true); masterListFill(); }
  };
  const masterListFill = () => {
    const rooms = lsGet(LS_MASTER, []);
    list.replaceChildren(...(rooms.length ? rooms.map(r => h('div', { class: 'sala-caixa sala-linha' },
      h('div', {}, h('b', {}, r.name), h('div', { class: 'sala-codigo sm' }, r.code)),
      h('div', { class: 'sala-expandir' }),
      h('button', { class: 'sala-botao', onclick: () => enter(r.code) }, 'Abrir'),
      h('button', { class: 'sala-botao sala-perigo', onclick: async () => {
        if (!confirm(`Excluir a sala ${r.code} para todos? Isso apaga as fichas sincronizadas dela.`)) return;
        try { await init(); await remove(ref(db, `rooms/${r.code}`)); } catch (e) { say(friendly(e), true); return; }
        lsSet(LS_MASTER, lsGet(LS_MASTER, []).filter(x => x.code !== r.code)); masterListFill();
      } }, 'Excluir'))) : [h('p', { class: 'sala-discreto' }, 'Nenhuma sala criada neste navegador.')]));
  };
  masterListFill();
  overlay.replaceChildren(
    h('div', { class: 'sala-topo' }, h('b', { class: 'sala-titulo lg' }, 'Sala do Mestre'),
      h('div', { class: 'sala-expandir' }), h('button', { class: 'sala-botao', onclick: closeMaster }, 'Voltar ao menu')),
    h('div', { class: 'sala-conteudo sala-pagina' },
      CFG_OK ? null : h('div', { class: 'sala-caixa' }, h('p', { class: 'sala-erro' }, 'Firebase não configurado. Preencha firebase-config.js.')),
      h('div', { class: 'sala-caixa' },
        h('h3', { class: 'sala-titulo' }, 'Criar nova sala'),
        h('div', { class: 'sala-linha' }, nameIn, h('button', { class: 'sala-botao', onclick: async () => {
          say('Criando…');
          try { const code = await createRoom(nameIn.value.trim()); await enter(code); } catch (e) { say(friendly(e), true); }
        } }, 'Criar sala')), msg),
      h('div', { class: 'sala-caixa' }, h('h3', { class: 'sala-titulo' }, 'Suas salas'), list),
      h('div', { class: 'sala-caixa' },
        h('h3', { class: 'sala-titulo' }, 'Entrar com código de mestre'),
        h('p', { class: 'sala-discreto' }, 'Para mestrar a mesma sala em outro aparelho: copie o código de mestre em Avançado → Acesso do mestre e informe aqui junto com o código da sala.'),
        h('div', { class: 'sala-linha' }, salaIn, segIn,
          h('button', { class: 'sala-botao', onclick: async () => {
            say('Verificando…');
            try { const c = await claimMaster(salaIn.value, segIn.value); await enter(c); }
            catch (e) { say(friendly(e), true); }
          } }, 'Entrar'))),
      h('p', { class: 'sala-discreto' }, 'Cada aparelho entra com um login anônimo. Para continuar mestrando depois de limpar os dados do site, ou em outro aparelho, use o código de mestre da sala.')));
}

function masterRoomView() {
  state.containers = []; state.rollBoxes = []; state.views = [];
  const players = h('div', { class: 'sala-lista' });
  players._empty = h('p', { class: 'sala-discreto' }, 'Nenhum jogador entrou ainda. Passe o código da sala.');
  state.containers.push({ el: players, master: true });
  const rolls = h('div', { class: 'sala-rolagens' });
  state.rollBoxes.push(rolls);
  const dice = h('input', { class: 'sala-campo sala-expandir', placeholder: 'ex: 2d6+3' });
  const roll = () => { masterRoll(dice.value); };
  const secreta = h('input', { type: 'checkbox' });
  secreta.checked = !!state.ui.secreta;
  secreta.addEventListener('change', () => { state.ui.secreta = secreta.checked; });
  dice.addEventListener('keydown', e => { if (e.key === 'Enter') roll(); });
  const step = h('select', { class: 'sala-campo sala-largura-auto' }, [1, 5, 10].map(n => h('option', { value: n }, n)));
  step.value = String(state.ui.step);
  step.addEventListener('change', () => { state.ui.step = num(step.value) || 1; });

  overlay.replaceChildren(
    h('div', { class: 'sala-topo' },
      h('button', { class: 'sala-botao', onclick: masterHome }, '← Salas'),
      h('div', {}, h('div', { class: 'sala-discreto' }, (state.meta && state.meta.name) || 'Mesa'), h('div', { class: 'sala-codigo' }, state.code)),
      h('button', { class: 'sala-botao', onclick: () => navigator.clipboard && navigator.clipboard.writeText(state.code).then(() => toast('Código copiado')) }, 'Copiar código'),
      h('div', { class: 'sala-expandir' }),
      h('label', { class: 'sala-discreto' }, 'Passo dos botões − / + '), step,
      h('button', { class: 'sala-botao', onclick: closeMaster }, 'Fechar')),
    h('div', { class: 'sala-principal' },
      h('div', {}, h('h3', { class: 'sala-titulo' }, 'Jogadores'), players, players._empty),
      h('div', {}, submenu('mestre', [
        ['iniciativa', 'Iniciativa', iniView(true)],
        ['npcs', 'NPCs', npcsView()],
        ['mesa', 'Mesa', mesaView(true)],
        ['presets', 'Presets', presetsView()],
        ['rolagens', 'Rolagens', h('div', {},
          h('label', { class: 'sala-opcao sala-margem-baixo', title: 'A rolagem só aparece para você e não vai para o histórico da sala' }, secreta, ' Secreta (só eu vejo)'),
          h('div', { class: 'sala-linha sala-margem-baixo' }, dice, h('button', { class: 'sala-botao', onclick: roll }, 'Rolar'),
            ['d4', 'd6', 'd8', 'd10', 'd12', 'd20'].map(d => h('button', { class: 'sala-botao', onclick: () => masterRoll('1' + d) }, d))),
          rolls)],
        ['avancado', 'Avançado', salaAvancado()]]))));
  renderAll(); fillRolls(rolls);
}

// ---------------------------------------------------------------- estilos
// Todos os estilos da sala ficam em style.css (seção "SALAS").

// ---------------------------------------------------------------- inicialização da interface
function boot() {
  window.abrirSalaMestre = openMaster;

  // botão no menu inicial
  const wrapper = document.querySelector('main .file-upload-wrapper');
  const homeBtn = h('button', { class: 'btn', onclick: openMaster }, 'Sala do Mestre');
  if (wrapper) wrapper.after(homeBtn); else if (document.querySelector('main')) document.querySelector('main').append(homeBtn);

  // aba "Sala" dentro do jogo
  const menu = document.getElementById('mt-menu');
  const area = document.querySelector('#multiTask > main');
  if (menu && area) {
    salaContent = h('div', { class: 'aba-conteudo', id: 'sala-content' });
    area.append(salaContent);
    const sep = h('div', { class: 'linha-curta' });
    const tabBtn = h('button', { class: 'aba-botao', onclick: function () { window.gameHabaSel(7, this); } }, 'Sala');
    const diario = [...menu.querySelectorAll('button')].find(b => /gameHabaSel\(5/.test(b.getAttribute('onclick') || ''));
    if (diario) diario.after(sep, tabBtn); else menu.append(sep, tabBtn);

    const origHaba = window.gameHabaSel;
    window.gameHabaSel = function (id, btn) {
      if (id !== 7) return origHaba.apply(this, arguments);
      const active = document.querySelector('.aba-botao.active');
      if (active) active.classList.remove('active');
      btn.classList.add('active');
      document.querySelectorAll('.aba-conteudo').forEach(c => { c.style.display = 'none'; });
      salaContent.style.display = 'flex';
      const mob = document.getElementById('MobileMTBtn');
      if (mob) mob.innerHTML = btn.innerHTML + '<img src="img/menu.svg" alt="" class="aba-icone-menu">';
      renderPlayerSala();
    };
  }

  wrapRolls();
  setInterval(() => { pushPlayer().catch(() => {}); }, 5000);

  // reconecta sozinho à última sala quando a ficha já estiver carregada
  const saved = lsGet(LS_PLAYER, null);
  if (saved && saved.code && CFG_OK) {
    const t = setInterval(async () => {
      if (state.role) { clearInterval(t); return; }
      const game = document.getElementById('game');
      if (!ficha || !ficha.nome || !game || getComputedStyle(game).display === 'none') return;
      clearInterval(t);
      try { await joinAsPlayer(saved.code); renderPlayerSala(); toast('Reconectado à sala ' + saved.code); }
      catch (e) { console.warn('[sala] reconexão', e); if (/não encontrada/i.test(e.message)) localStorage.removeItem(LS_PLAYER); }
    }, 1500);
  }
}

boot();
