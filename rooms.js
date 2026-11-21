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
  query, limitToLast, serverTimestamp
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

function toast(msg) {
  document.querySelectorAll('.sl-toast').forEach(t => t.remove());
  const t = h('div', { class: 'sl-toast' }, msg);
  document.body.append(t);
  setTimeout(() => t.remove(), 4000);
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
  presence: null,
  lastApplied: null,
  ui: { step: 1, tab: {} }
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
  if (/permission[_ ]denied/i.test(m)) return 'Permissão negada pelo banco. Confira se as regras de database.rules.json foram publicadas.';
  return (e && e.message) || String(e);
}

// ---------------------------------------------------------------- ficha <-> nuvem
const SKIP = new Set(['mods', 'customStatus', 'options', 'customWallpaper', 'assinatura', 'versão']);
const BIO_FIELDS = ['familia', 'gostos', 'desgostos', 'medos', 'contatos', 'historia', 'comportamento', 'dinheiro'];
const STATS = [['vida', 'vidaMax', 'PV', 'pv'], ['energia', 'energiaMax', 'PE', 'pe'], ['medo', 'medoMax', 'MD', 'md']];

function snapshotFicha() {
  const o = {};
  for (const k of Object.keys(ficha)) if (!SKIP.has(k)) o[k] = ficha[k];
  return JSON.stringify(o);
}

function summaryOf(f) {
  const st = f.status || {};
  const r = f['raça'];
  return {
    nome: f.nome || '', raca: (r && typeof r === 'object' ? r.nome : '') || '',
    vida: num(st.vida), vidaMax: num(st.vidaMax),
    energia: num(st.energia), energiaMax: num(st.energiaMax),
    medo: num(st.medo), medoMax: num(st.medoMax)
  };
}
function summaryPaths(prefix, f) {
  const out = {};
  for (const [k, v] of Object.entries(summaryOf(f))) out[`${prefix}/${k}`] = v;
  return out;
}

// Envia a ficha do jogador para a sala (só se mudou)
async function pushPlayer(force = false, strict = false) {
  if (state.role !== 'player' || !state.code || !db || applying) return;
  const json = snapshotFicha();
  if (!force && json === lastPushed) return;
  const before = lastPushed;
  lastPushed = json;
  const base = `rooms/${state.code}`;
  try {
    await update(ref(db), {
      [`${base}/fichas/${uid}`]: { fichaJson: json, rev: Date.now(), editedBy: 'player' },
      ...summaryPaths(`${base}/players/${uid}`, ficha)
    });
  } catch (e) {
    lastPushed = before;
    if (strict) throw e;
    console.warn('[sala] erro ao sincronizar', e);
  }
}
function scheduleSync() {
  if (state.role !== 'player' || !state.code || applying) return;
  clearTimeout(syncTimer);
  syncTimer = setTimeout(() => pushPlayer(), 500);
}

// Aplica uma ficha editada pelo mestre na ficha local e redesenha a interface
function applyRemoteFicha(rf) {
  applying = true;
  const realAlert = window.alert;
  window.alert = () => {};
  try {
    for (const k of Object.keys(rf)) if (!SKIP.has(k)) ficha[k] = rf[k];
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
      'renderMagias', 'renderHabilidades', 'renderTraumas', 'displayPericias', 'statusAtu']) {
      try { if (typeof window[fn] === 'function') window[fn](); } catch (e) { console.warn('[sala] refresh', fn, e); }
    }
    const mod = document.getElementById('modificadores');
    if (mod && ficha.modificadores) {
      mod.innerHTML = `<span class="text sm">Defesa Ativa: ${num(ficha.modificadores.defesaAtiva)}%</span>
        <span class="text sm">Deslocamento: ${num(ficha.modificadores.deslocamento)}</span>
        <span class="text sm">Reflexos: ${num(ficha.modificadores.reflexos)}</span>`;
    }
  } finally {
    window.alert = realAlert;
    applying = false;
  }
  lastPushed = snapshotFicha();
}

// ---------------------------------------------------------------- conexão com a sala
function disconnectRoom() {
  state.unsub.forEach(u => { try { u(); } catch { /* ignore */ } });
  Object.assign(state, {
    unsub: [], role: null, code: null, meta: null, players: {}, fichas: {}, rolls: [],
    containers: [], rollBoxes: [], presence: null, lastApplied: null
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
  if (meta.masterUid === uid) throw new Error('Você é o mestre desta sala. Abra-a por "Sala do Mestre" no menu inicial.');

  // Se o mestre editou a ficha enquanto o jogador estava fora, a versão da sala vence
  const remote = (await get(ref(db, `rooms/${code}/fichas/${uid}`))).val();
  if (remote && remote.editedBy === 'master') {
    try {
      const rf = JSON.parse(remote.fichaJson);
      const use = rf.nome === ficha.nome ||
        confirm(`Esta sala já tem uma ficha sua chamada "${rf.nome}" (editada pelo mestre).\nOK = usar a ficha da sala · Cancelar = substituir pela ficha atual ("${ficha.nome}")`);
      if (use) { state.lastApplied = remote.rev; applyRemoteFicha(rf); }
    } catch (e) { console.warn(e); }
  }

  disconnectRoom();
  Object.assign(state, { role: 'player', code, meta });
  lsSet(LS_PLAYER, { code });
  lastPushed = null;
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
  state.unsub.push(onValue(ref(db, `rooms/${code}/fichas/${uid}`), s => {
    const v = s.val();
    if (!v) { if (state.role === 'player') { toast('Você foi removido da sala.'); forceLeave(); } return; }
    if (v.editedBy === 'master' && v.rev !== state.lastApplied) {
      try { const rf = JSON.parse(v.fichaJson); state.lastApplied = v.rev; applyRemoteFicha(rf); toast('O mestre atualizou a sua ficha.'); }
      catch (e) { console.warn(e); }
    }
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
  const list = lsGet(LS_MASTER, []);
  list.push({ code, name: name || 'Mesa' });
  lsSet(LS_MASTER, list);
  return code;
}

async function openMasterRoom(code) {
  await init();
  const meta = (await get(ref(db, `rooms/${code}/meta`))).val();
  if (!meta) {
    lsSet(LS_MASTER, lsGet(LS_MASTER, []).filter(r => r.code !== code));
    throw new Error('Essa sala não existe mais.');
  }
  if (meta.masterUid !== uid) throw new Error('Você não é o mestre desta sala neste navegador.');
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
  };
  const err = e => toast(friendly(e));
  state.unsub.push(onChildAdded(fr, upsert, err));
  state.unsub.push(onChildChanged(fr, upsert, err));
  state.unsub.push(onChildRemoved(fr, s => { delete state.fichas[s.key]; renderAll(); }, err));
}

async function masterCommit(puid, f) {
  const base = `rooms/${state.code}`;
  const json = JSON.stringify(f);
  const entry = state.fichas[puid] || (state.fichas[puid] = {});
  entry.ficha = f; entry.json = json;
  try {
    await update(ref(db), {
      [`${base}/fichas/${puid}`]: { fichaJson: json, rev: Date.now(), editedBy: 'master' },
      ...summaryPaths(`${base}/players/${puid}`, f)
    });
  } catch (e) { toast('Erro ao salvar: ' + friendly(e)); }
  renderAll();
}

function adjust(puid, key, dir) {
  const e = state.fichas[puid];
  if (!e) return toast('A ficha desse jogador ainda está carregando.');
  const f = e.ficha;
  f.status = f.status || {};
  f.status[key] = Math.max(0, num(f.status[key]) + dir * state.ui.step);
  masterCommit(puid, f);
  rebuildEditorIfOpen(puid);
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

function wrapRolls() {
  const origRoll = window.rollDice;
  if (typeof origRoll === 'function') {
    window.rollDice = function (value, type = 'dice') {
      const input = document.getElementById('diceInput');
      // o botão "Rolar Dado" chama rollDice() sem argumentos: usa o que está no campo
      if (value === undefined && input) value = input.value;
      const total = origRoll.call(this, value, type);
      if (typeof total === 'number' && state.role === 'player' && state.code) {
        const expr = input ? input.value : String(value);
        const d = document.getElementById('descriçãoDeRolagem');
        const detail = ((d && d.textContent) || '').replace(/^de Dano\s*/, '').trim();
        const label = type === 'per' ? fmtName(value) : type === 'damage' ? 'Dano' : 'Dado';
        logRoll({ label, expr, total, detail, kind: type });
      }
      return total;
    };
  }
  const origMult = window.rollMultiplierDice;
  if (typeof origMult === 'function') {
    window.rollMultiplierDice = function (quantity, sides) {
      const r = origMult.apply(this, arguments);
      if (state.role === 'player' && state.code) {
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

function masterRoll(exprRaw) {
  const expr = String(exprRaw || '').trim();
  if (!expr) return;
  if (/\*/.test(expr) || !isValidDiceExpression(expr)) return toast('Formato inválido. Exemplos: 1d20, 2d6+3, 1d12-2');
  const r = rollDiceExpression(expr);
  const detail = r.rolls.map(x => `${x.sign < 0 ? '-' : ''}${x.dice} (${x.value})`).join(' ');
  logRoll({ label: 'Dado', expr, total: r.total, detail });
}

function fillRolls(box) {
  const rows = [...state.rolls].reverse().map(r => {
    const t = num(r.ts) ? new Date(num(r.ts)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
    return h('div', { class: 'sl-roll' + (r.kind === 'damage' ? ' dmg' : '') },
      h('div', {},
        h('div', {}, h('b', {}, r.who || '?'), ' · ', r.label || 'Dado'),
        h('div', { class: 'sl-muted' }, [r.expr, r.detail].filter(Boolean).join(' — ')),
        h('div', { class: 'sl-muted' }, t)),
      h('b', { class: 'total' }, String(r.total)));
  });
  box.replaceChildren(...(rows.length ? rows : [h('p', { class: 'sl-muted' }, 'Nenhuma rolagem ainda.')]));
}
function renderRolls() { state.rollBoxes.forEach(fillRolls); }

// ---------------------------------------------------------------- cards (vista rápida)
function buildCard(puid, master) {
  const r = {};
  const card = h('div', { class: 'sl-card' + (puid === uid ? ' me' : ''), 'data-uid': puid },
    h('header', {},
      (r.dot = h('span', { class: 'sl-dot' })),
      (r.name = h('span', { class: 'sl-name' })),
      (r.race = h('span', { class: 'sl-muted' })),
      master ? (r.toggle = h('button', { class: 'sl-btn', onclick: () => toggleExpand(puid) }, 'Abrir')) : null,
      master ? h('button', { class: 'sl-btn sl-danger', title: 'Remover da sala', onclick: () => kick(puid) }, '✕') : null),
    h('div', { class: 'sl-bars' }, STATS.map(([k, , label, cls]) => {
      const fill = h('i'); const txt = h('span');
      r[k] = { fill, txt, label };
      return h('div', { class: 'sl-stat' },
        h('div', { class: 'sl-bar ' + cls }, fill, txt),
        master ? h('div', { class: 'sl-adj' },
          h('button', { class: 'sl-btn', onclick: () => adjust(puid, k, -1) }, '−'),
          h('button', { class: 'sl-btn', onclick: () => adjust(puid, k, +1) }, '+')) : null);
    })),
    master ? (r.body = h('div', { class: 'sl-body', style: 'display:none' })) : null);
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
const TABS = [['status', 'Status'], ['pericias', 'Perícias'], ['inv', 'Inventário'], ['magias', 'Magias'],
  ['hab', 'Habilidades'], ['traumas', 'Traumas'], ['bio', 'Personagem']];

function masterCard(puid) {
  const c = state.containers.find(x => x.master);
  return c && c.el._cards ? c.el._cards.get(puid) : null;
}

function toggleExpand(puid) {
  const card = masterCard(puid);
  if (!card) return;
  const body = card._refs.body;
  const open = body.style.display === 'none';
  body.style.display = open ? 'block' : 'none';
  card._refs.toggle.textContent = open ? 'Fechar' : 'Abrir';
  if (open) buildEditor(puid, body);
}

function rebuildEditorIfOpen(puid) {
  const card = masterCard(puid);
  if (!card) return;
  const body = card._refs.body;
  if (body.style.display === 'none') return;
  const a = document.activeElement;
  if (body.contains(a) && /INPUT|TEXTAREA|SELECT/.test(a.tagName)) { body._dirty = true; return; }
  buildEditor(puid, body);
}

function buildEditor(puid, body) {
  body.replaceChildren();
  const entry = state.fichas[puid];
  if (!entry || !entry.ficha) { body.append(h('p', { class: 'sl-muted' }, 'Carregando ficha…')); return; }
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
  let tab = state.ui.tab[puid] || 'status';
  const tabsEl = h('div', { class: 'sl-tabs' });
  const content = h('div', { class: 'sl-tabbody' });
  const renderTab = () => {
    tabsEl.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.t === tab));
    content.replaceChildren(TAB_FN[tab](ctx));
  };
  TABS.forEach(([id, label]) => tabsEl.append(
    h('button', { class: 'sl-btn', 'data-t': id, onclick: () => { tab = id; state.ui.tab[puid] = id; renderTab(); } }, label)));
  body.append(tabsEl, content);
  renderTab();
}

// ---- campos
const fld = (label, input, cls = '') => h('div', { class: 'sl-f ' + cls }, h('label', {}, label), input);

function inp(type, value, onSet, ctx) {
  const i = h(type === 'area' ? 'textarea' : 'input', { class: 'sl-in', rows: type === 'area' ? 3 : null, type: type === 'area' ? null : type });
  i.value = value ?? '';
  i.addEventListener('change', () => { onSet(type === 'number' ? num(i.value) : i.value); ctx.commit(); });
  return i;
}
function sel(options, value, onSet, ctx) {
  const s = h('select', { class: 'sl-in' }, options.map(o => { const [v, l] = Array.isArray(o) ? o : [o, o]; return h('option', { value: v }, l); }));
  s.value = value ?? '';
  s.addEventListener('change', () => { onSet(s.value); ctx.commit(); });
  return s;
}
function chk(label, checked, onSet, ctx) {
  const c = h('input', { type: 'checkbox' });
  c.checked = !!checked;
  c.addEventListener('change', () => { onSet(c.checked); ctx.commit(); });
  return h('label', { class: 'sl-chk' }, c, ' ' + label);
}
function diceInp(value, onSet, ctx) {
  const i = h('input', { class: 'sl-in', placeholder: 'ex: 1d20+5' });
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
    keys.map(k => h('div', { class: 'sl-fs' },
      fld(names[k] || k, inp('number', f.status[k], v => { f.status[k] = v; }, ctx)),
      fld((names[k] || k) + ' — máx.', inp('number', f.status[k + 'Max'], v => { f.status[k + 'Max'] = v; }, ctx)))),
    h('div', { class: 'sl-fs' },
      fld('Defesa ativa (%)', inp('number', f.modificadores.defesaAtiva, v => { f.modificadores.defesaAtiva = v; }, ctx)),
      fld('Deslocamento', inp('number', f.modificadores.deslocamento, v => { f.modificadores.deslocamento = v; }, ctx)),
      fld('Reflexos', inp('number', f.modificadores.reflexos, v => { f.modificadores.reflexos = v; }, ctx))));
}

// ---- aba Perícias
function tabPericias(ctx) {
  const f = ctx.f;
  if (!Array.isArray(f.pericias)) return h('p', { class: 'sl-muted' }, 'Esta ficha usa o formato antigo de perícias e não pode ser editada aqui.');
  while (f.pericias.length < 6) f.pericias.push([]);
  const lvlOf = n => { for (let i = 5; i >= 0; i--) if ((f.pericias[i] || []).includes(n)) return i; return 0; };
  const names = [...new Set(f.pericias.flat().filter(Boolean))]
    .sort((a, b) => lvlOf(b) - lvlOf(a) || a.localeCompare(b, 'pt'));
  const opts = [[0, '0 — sem treino'], [1, '1'], [2, '2'], [3, '3'], [4, '4'], [5, '5']];
  return h('div', {},
    h('p', { class: 'sl-muted' }, 'Mudar o nível de uma perícia não recalcula PV/PE/MD máximos; ajuste-os na aba Status.'),
    h('div', { class: 'sl-pergrid' }, names.map(n => h('div', { class: 'sl-perrow' },
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

function itemEditor(ctx, list, it, place) {
  const f = ctx.f, inv = f.inventario;
  it.data = it.data || {};
  const d = it.data;
  const title = () => (it.isFavorite ? '★ ' : '') + (it.name || '(sem nome)');
  const sum = h('summary', {}, title(), h('span', { class: 'sl-muted' }, ` · ${it.type || '?'} · peso ${num(it.weight)}`));
  const syncWeapon = () => { if (inv.weapon && inv.weapon.id === it.id) inv.weapon = JSON.parse(JSON.stringify(it)); };
  const S = fn => v => { fn(v); syncWeapon(); };
  const fields = [
    fld('Nome', inp('text', it.name, S(v => { it.name = v; sum.firstChild.textContent = title(); }), ctx)),
    fld('Peso', inp('number', it.weight, S(v => { it.weight = v; }), ctx)),
    fld('Descrição', inp('area', it.description, S(v => { it.description = v; }), ctx), 'wide'),
    chk('Favorito', it.isFavorite, S(v => { it.isFavorite = v; sum.firstChild.textContent = title(); }), ctx)
  ];
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
  const other = place === 'inv' ? inv.guardados : inv.content;
  return h('details', { class: 'sl-item', open: ctx.justAdded === it },
    sum,
    h('div', { class: 'sl-fs' }, fields),
    h('div', { class: 'sl-row' },
      h('button', { class: 'sl-btn', onclick: () => {
        list.splice(list.indexOf(it), 1); other.push(it); ctx.commit(); ctx.rerender();
      } }, place === 'inv' ? 'Guardar' : 'Mover p/ inventário'),
      h('button', { class: 'sl-btn sl-danger', onclick: () => {
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
    h('h4', { class: 'sl-h' }, t),
    list.length ? list.map(it => itemEditor(ctx, list, it, place)) : h('p', { class: 'sl-muted' }, 'Vazio.'));
  return h('div', {},
    h('div', { class: 'sl-fs' },
      fld('Capacidade (peso adicional)', inp('number', inv.additionalWeight, v => { inv.additionalWeight = v; }, ctx)),
      fld('Usando', inp('area', inv.usando, v => { inv.usando = v; }, ctx), 'wide')),
    h('p', { class: 'sl-muted' }, `Peso carregado: ${total} / ${num(inv.additionalWeight)} · Arma equipada: ${(inv.weapon && inv.weapon.name) || '—'}`,
      inv.weapon && inv.weapon.name ? h('button', { class: 'sl-btn', style: 'margin-left:8px', onclick: () => { inv.weapon = {}; ctx.commit(); ctx.rerender(); } }, 'Desequipar') : null),
    sec('Inventário', inv.content, 'inv'),
    sec('Guardados', inv.guardados, 'gua'),
    h('div', { class: 'sl-row', style: 'margin-top:8px' }, where, cat,
      h('button', { class: 'sl-btn', onclick: () => {
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
  const items = arr.map(it => {
    const title = () => (it.isFavorite ? '★ ' : '') + (it.name || '(sem nome)');
    const sum = h('summary', {}, title());
    const fields = [
      fld('Nome', inp('text', it.name, v => { it.name = v; sum.textContent = title(); }, ctx)),
      fld('Dado', diceInp(it[dk], v => { it[dk] = v; }, ctx))
    ];
    if (isT) {
      const ti = h('input', { class: 'sl-in', placeholder: '2H, 1D ou PER' });
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
    return h('details', { class: 'sl-item', open: ctx.justAdded === it },
      sum,
      h('div', { class: 'sl-fs' }, fields),
      h('div', { class: 'sl-row' }, h('button', { class: 'sl-btn sl-danger', onclick: () => {
        if (!confirm(`Excluir "${it.name}"?`)) return;
        arr.splice(arr.indexOf(it), 1); ctx.commit(); ctx.rerender();
      } }, 'Excluir')));
  });
  return h('div', {},
    items.length ? items : h('p', { class: 'sl-muted' }, 'Nada por aqui.'),
    h('button', { class: 'sl-btn', style: 'margin-top:8px', onclick: () => {
      const it = isT ? { name: 'Novo trauma', description: '', dado: '', time: { numero: 'PER', tipoT: 'PER' }, isFavorite: false }
        : { name: 'Novo', description: '', dice: '', isFavorite: false };
      arr.push(it); ctx.justAdded = it; ctx.commit(); ctx.rerender();
    } }, '+ Adicionar'));
}

// ---- aba Personagem
function tabBio(ctx) {
  const f = ctx.f;
  f.biografia = f.biografia || {};
  const b = f.biografia;
  const lab = { familia: 'Família', gostos: 'Gostos', desgostos: 'Desgostos', medos: 'Medos', contatos: 'Contatos próximos', historia: 'História', comportamento: 'Comportamento' };
  const nm = x => (x && typeof x === 'object' ? x.nome : '') || '—';
  return h('div', {},
    h('div', { class: 'sl-fs' },
      fld('Nome', inp('text', f.nome, v => { f.nome = v; }, ctx)),
      fld('Idade', inp('text', f.idade, v => { f.idade = v; }, ctx)),
      fld('Nascimento', inp('text', f.dataNascimento, v => { f.dataNascimento = v; }, ctx)),
      fld('Dinheiro', inp('text', b.dinheiro, v => { b.dinheiro = v; }, ctx))),
    h('p', { class: 'sl-muted' }, `Raça: ${nm(f['raça'])} · Ocupação: ${nm(f['ocupação'])} · Origem: ${nm(f.origem)}`),
    Object.keys(lab).map(k => fld(lab[k], inp('area', b[k], v => { b[k] = v; }, ctx), 'wide')));
}

const TAB_FN = {
  status: tabStatus, pericias: tabPericias, inv: tabInv, bio: tabBio,
  magias: c => listTab(c, 'magias'), hab: c => listTab(c, 'habilidades'), traumas: c => listTab(c, 'traumas')
};

// ---------------------------------------------------------------- tela do jogador (aba "Sala")
let salaContent;

function renderPlayerSala() {
  if (!salaContent) return;
  salaContent.replaceChildren();
  state.containers = state.containers.filter(c => c.master);
  state.rollBoxes = [];

  if (!CFG_OK) {
    salaContent.append(h('div', { class: 'sl-wrap' }, h('div', { class: 'sl-box' },
      h('h3', { class: 'sl-h' }, 'Salas'),
      h('p', {}, 'As salas ainda não estão configuradas. Preencha o arquivo firebase-config.js com os dados do seu projeto Firebase.'))));
    return;
  }

  if (state.role === 'player' && state.code) {
    const players = h('div', { class: 'sl-grid' });
    players._empty = h('p', { class: 'sl-muted' }, 'Aguardando jogadores…');
    state.containers.push({ el: players, master: false });
    const rolls = h('div', { class: 'sl-rolls' });
    state.rollBoxes.push(rolls);
    salaContent.append(h('div', { class: 'sl-wrap' },
      h('div', { class: 'sl-box sl-row' },
        h('div', {}, h('div', { class: 'sl-muted' }, 'Sala' + (state.meta && state.meta.name ? ' · ' + state.meta.name : '')),
          h('div', { class: 'sl-code' }, state.code)),
        h('div', { style: 'flex:1' }),
        h('button', { class: 'sl-btn', onclick: () => navigator.clipboard && navigator.clipboard.writeText(state.code).then(() => toast('Código copiado')) }, 'Copiar código'),
        h('button', { class: 'sl-btn sl-danger', onclick: () => { if (confirm('Sair da sala?')) leaveAsPlayer(); } }, 'Sair da sala')),
      h('div', { class: 'sl-box' }, h('h3', { class: 'sl-h' }, 'Jogadores'), players, players._empty),
      h('div', { class: 'sl-box' }, h('h3', { class: 'sl-h' }, 'Histórico de rolagens'), rolls)));
    renderAll(); fillRolls(rolls);
    return;
  }

  const msg = h('p', { class: 'sl-muted' }, 'Peça o código ao mestre.');
  const code = h('input', { class: 'sl-in sl-codein', placeholder: 'CÓDIGO', maxlength: 8 });
  code.addEventListener('input', () => { code.value = cleanCode(code.value); });
  const go = async () => {
    msg.className = 'sl-muted'; msg.textContent = 'Entrando…';
    try { await joinAsPlayer(code.value); renderPlayerSala(); toast('Você entrou na sala ' + state.code); }
    catch (e) { msg.className = 'sl-err'; msg.textContent = friendly(e); }
  };
  code.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
  salaContent.append(h('div', { class: 'sl-wrap' }, h('div', { class: 'sl-box' },
    h('h3', { class: 'sl-h' }, 'Entrar em uma sala'),
    h('p', { class: 'sl-muted' }, 'Ao entrar, nome, PV, PE e MD ficam visíveis para a mesa e o mestre passa a ver (e poder editar) a sua ficha. As rolagens aparecem no histórico da sala.'),
    h('div', { class: 'sl-row' }, code, h('button', { class: 'sl-btn', onclick: go }, 'Entrar')),
    msg)));
}

// ---------------------------------------------------------------- tela do mestre (sobreposição)
let overlay;

function openMaster() {
  if (!overlay) { overlay = h('div', { class: 'sl-overlay' }); document.body.append(overlay); }
  overlay.classList.add('open');
  masterHome();
}
function closeMaster() { disconnectRoom(); overlay.classList.remove('open'); }

function masterHome() {
  disconnectRoom();
  const msg = h('p', { class: 'sl-muted' });
  const say = (t, bad) => { msg.textContent = t; msg.className = bad ? 'sl-err' : 'sl-muted'; };
  const nameIn = h('input', { class: 'sl-in', placeholder: 'Nome da mesa (opcional)', maxlength: 40 });
  const list = h('div', { class: 'sl-grid' });
  const enter = async code => {
    say('Abrindo…');
    try { await openMasterRoom(code); masterRoomView(); }
    catch (e) { say(friendly(e), true); masterListFill(); }
  };
  const masterListFill = () => {
    const rooms = lsGet(LS_MASTER, []);
    list.replaceChildren(...(rooms.length ? rooms.map(r => h('div', { class: 'sl-box sl-row' },
      h('div', {}, h('b', {}, r.name), h('div', { class: 'sl-code', style: 'font-size:20px' }, r.code)),
      h('div', { style: 'flex:1' }),
      h('button', { class: 'sl-btn', onclick: () => enter(r.code) }, 'Abrir'),
      h('button', { class: 'sl-btn sl-danger', onclick: async () => {
        if (!confirm(`Excluir a sala ${r.code} para todos? Isso apaga as fichas sincronizadas dela.`)) return;
        try { await init(); await remove(ref(db, `rooms/${r.code}`)); } catch (e) { say(friendly(e), true); return; }
        lsSet(LS_MASTER, lsGet(LS_MASTER, []).filter(x => x.code !== r.code)); masterListFill();
      } }, 'Excluir'))) : [h('p', { class: 'sl-muted' }, 'Nenhuma sala criada neste navegador.')]));
  };
  masterListFill();
  overlay.replaceChildren(
    h('div', { class: 'sl-top' }, h('b', { class: 'sl-h', style: 'font-size:20px' }, 'Sala do Mestre'),
      h('div', { style: 'flex:1' }), h('button', { class: 'sl-btn', onclick: closeMaster }, 'Voltar ao menu')),
    h('div', { class: 'sl-wrap', style: 'padding:14px;max-width:720px;margin:0 auto' },
      CFG_OK ? null : h('div', { class: 'sl-box' }, h('p', { class: 'sl-err' }, 'Firebase não configurado. Preencha firebase-config.js.')),
      h('div', { class: 'sl-box' },
        h('h3', { class: 'sl-h' }, 'Criar nova sala'),
        h('div', { class: 'sl-row' }, nameIn, h('button', { class: 'sl-btn', onclick: async () => {
          say('Criando…');
          try { const code = await createRoom(nameIn.value.trim()); await enter(code); } catch (e) { say(friendly(e), true); }
        } }, 'Criar sala')), msg),
      h('div', { class: 'sl-box' }, h('h3', { class: 'sl-h' }, 'Suas salas'), list),
      h('p', { class: 'sl-muted' }, 'A sala fica ligada ao navegador em que foi criada (login anônimo). Se limpar os dados do site, você perde o acesso de mestre a ela.')));
}

function masterRoomView() {
  state.containers = []; state.rollBoxes = [];
  const players = h('div', { class: 'sl-grid' });
  players._empty = h('p', { class: 'sl-muted' }, 'Nenhum jogador entrou ainda. Passe o código da sala.');
  state.containers.push({ el: players, master: true });
  const rolls = h('div', { class: 'sl-rolls' });
  state.rollBoxes.push(rolls);
  const dice = h('input', { class: 'sl-in', placeholder: 'ex: 2d6+3', style: 'flex:1;min-width:90px' });
  const roll = () => { masterRoll(dice.value); };
  dice.addEventListener('keydown', e => { if (e.key === 'Enter') roll(); });
  const step = h('select', { class: 'sl-in', style: 'width:auto' }, [1, 5, 10].map(n => h('option', { value: n }, n)));
  step.value = String(state.ui.step);
  step.addEventListener('change', () => { state.ui.step = num(step.value) || 1; });

  overlay.replaceChildren(
    h('div', { class: 'sl-top' },
      h('button', { class: 'sl-btn', onclick: masterHome }, '← Salas'),
      h('div', {}, h('div', { class: 'sl-muted' }, (state.meta && state.meta.name) || 'Mesa'), h('div', { class: 'sl-code' }, state.code)),
      h('button', { class: 'sl-btn', onclick: () => navigator.clipboard && navigator.clipboard.writeText(state.code).then(() => toast('Código copiado')) }, 'Copiar código'),
      h('div', { style: 'flex:1' }),
      h('label', { class: 'sl-muted' }, 'Passo dos botões − / + '), step,
      h('button', { class: 'sl-btn', onclick: closeMaster }, 'Fechar')),
    h('div', { class: 'sl-main' },
      h('div', {}, h('h3', { class: 'sl-h' }, 'Jogadores'), players, players._empty),
      h('div', {},
        h('h3', { class: 'sl-h' }, 'Rolagens'),
        h('div', { class: 'sl-row', style: 'margin-bottom:6px' }, dice, h('button', { class: 'sl-btn', onclick: roll }, 'Rolar'),
          ['d4', 'd6', 'd8', 'd10', 'd12', 'd20'].map(d => h('button', { class: 'sl-btn', onclick: () => masterRoll('1' + d) }, d))),
        h('div', { class: 'sl-row', style: 'margin-bottom:6px' }, h('button', { class: 'sl-btn sl-danger', onclick: async () => {
          if (confirm('Limpar o histórico de rolagens?')) { try { await remove(ref(db, `rooms/${state.code}/rolls`)); } catch (e) { toast(friendly(e)); } }
        } }, 'Limpar histórico')),
        rolls)));
  renderAll(); fillRolls(rolls);
}

// ---------------------------------------------------------------- estilos
const CSS = `
.sl-wrap{display:flex;flex-direction:column;gap:12px;width:100%;color:#fff;font-size:14px;box-sizing:border-box}
.sl-box{background:rgba(0,0,0,.55);border:1px solid rgba(255,255,255,.18);border-radius:8px;padding:10px 12px}
.sl-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.sl-h{margin:0 0 8px;font-size:16px;font-weight:700}
.sl-code{font-size:26px;letter-spacing:4px;font-weight:700;line-height:1.1}
.sl-muted{opacity:.7;font-size:12px;margin:2px 0}
.sl-err{color:#ff7373;font-size:13px}
.sl-grid{display:flex;flex-direction:column;gap:8px}
.sl-btn{background:#2a2a35;color:#fff;border:1px solid #555;border-radius:4px;padding:5px 10px;cursor:pointer;font:inherit;font-size:13px}
.sl-btn:hover{background:#3b3b4a}
.sl-btn.on{background:#555;border-color:#aaa}
.sl-danger{border-color:#8a3030;background:#3a1b1b}
.sl-danger:hover{background:#5a2323}
.sl-in{background:#1b1b22;color:#fff;border:1px solid #444;border-radius:4px;padding:6px 8px;font:inherit;font-size:13px;box-sizing:border-box;max-width:100%}
.sl-in.bad{border-color:#ff5555}
textarea.sl-in{resize:vertical;width:100%}
.sl-codein{text-transform:uppercase;letter-spacing:4px;width:140px;font-size:18px}
.sl-card{background:rgba(0,0,0,.55);border:1px solid rgba(255,255,255,.18);border-radius:8px;padding:8px 10px}
.sl-card.me{border-color:#9cff9c}
.sl-card header{display:flex;align-items:center;gap:8px}
.sl-dot{width:9px;height:9px;border-radius:50%;background:#666;flex:none}
.sl-dot.on{background:#4cd964;box-shadow:0 0 6px #4cd964}
.sl-name{font-weight:700;font-size:16px;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.sl-bars{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:6px}
.sl-bar{position:relative;height:22px;background:rgba(255,255,255,.12);border-radius:4px;overflow:hidden}
.sl-bar i{position:absolute;top:0;bottom:0;left:0;width:0;transition:width .25s}
.sl-bar span{position:relative;z-index:1;display:block;text-align:center;line-height:22px;font-size:12px;text-shadow:0 0 3px #000}
.sl-bar.pv i{background:#b3261e}.sl-bar.pe i{background:#2563eb}.sl-bar.md i{background:#7e3fb8}
.sl-adj{display:flex;gap:4px;margin-top:4px}.sl-adj .sl-btn{flex:1;padding:2px 0}
.sl-body{margin-top:10px;border-top:1px solid rgba(255,255,255,.15);padding-top:8px}
.sl-tabs{display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px}
.sl-fs{display:flex;gap:8px;flex-wrap:wrap;margin:6px 0}
.sl-f{display:flex;flex-direction:column;gap:2px;min-width:120px;flex:1}
.sl-f.wide{flex-basis:100%}
.sl-f label{font-size:11px;opacity:.7}
.sl-chk{display:flex;align-items:center;gap:4px;font-size:13px}
details.sl-item{border:1px solid #333;border-radius:6px;margin:6px 0;padding:4px 8px;background:rgba(255,255,255,.04)}
details.sl-item>summary{cursor:pointer;padding:2px 0}
.sl-pergrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:4px 12px}
.sl-perrow{display:flex;justify-content:space-between;align-items:center;gap:6px}
.sl-rolls{max-height:60vh;overflow-y:auto}
.sl-roll{display:flex;justify-content:space-between;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.1)}
.sl-roll .total{font-size:22px}.sl-roll.dmg .total{color:#ff7b72}
.sl-overlay{position:fixed;inset:0;z-index:20000;background:#0d0d10;color:#eee;overflow:auto;display:none}
.sl-overlay.open{display:block}
.sl-top{position:sticky;top:0;z-index:2;background:#0d0d10;border-bottom:1px solid #333;padding:10px 14px;display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.sl-main{display:grid;grid-template-columns:minmax(0,2fr) minmax(280px,1fr);gap:16px;padding:14px;color:#fff}
@media(max-width:800px){.sl-main{grid-template-columns:1fr}}
.sl-toast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:#111;color:#fff;border:1px solid #666;border-radius:8px;padding:10px 16px;z-index:30000;font-size:14px;max-width:90vw;text-align:center}
`;

// ---------------------------------------------------------------- inicialização da interface
function boot() {
  document.head.append(h('style', {}, CSS));
  window.abrirSalaMestre = openMaster;

  // botão no menu inicial
  const wrapper = document.querySelector('main .file-upload-wrapper');
  const homeBtn = h('button', { class: 'btn', onclick: openMaster }, 'Sala do Mestre');
  if (wrapper) wrapper.after(homeBtn); else if (document.querySelector('main')) document.querySelector('main').append(homeBtn);

  // aba "Sala" dentro do jogo
  const menu = document.getElementById('mt-menu');
  const area = document.querySelector('#multiTask > main');
  if (menu && area) {
    salaContent = h('div', { class: 'mt-content', id: 'sala-content', style: 'display:none;flex-direction:column;overflow-y:auto;padding:8px;box-sizing:border-box' });
    area.append(salaContent);
    const sep = h('div', { class: 'Sline' });
    const tabBtn = h('button', { class: 'mTBtn', onclick: function () { window.gameHabaSel(7, this); } }, 'Sala');
    const diario = [...menu.querySelectorAll('button')].find(b => /gameHabaSel\(5/.test(b.getAttribute('onclick') || ''));
    if (diario) diario.after(sep, tabBtn); else menu.append(sep, tabBtn);

    const origHaba = window.gameHabaSel;
    window.gameHabaSel = function (id, btn) {
      if (id !== 7) return origHaba.apply(this, arguments);
      const active = document.querySelector('.mTBtn.active');
      if (active) active.classList.remove('active');
      btn.classList.add('active');
      document.querySelectorAll('.mt-content').forEach(c => { c.style.display = 'none'; });
      salaContent.style.display = 'flex';
      const mob = document.getElementById('MobileMTBtn');
      if (mob) mob.innerHTML = btn.innerHTML + '<img src="img/menu.svg" alt="" class="mMTImage">';
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
