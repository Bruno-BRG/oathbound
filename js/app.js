/* ==========================================================================
   OATHBOUND — app: shell, rendering, events, actions
   ========================================================================== */
(function (OB) {
  'use strict';
  const E = OB.esc;
  const $ = (s, r) => (r || document).querySelector(s);

  const TABS = [
    ['sheet', 'Sheet'], ['tracks', 'Tracks'], ['assets', 'Assets'], ['moves', 'Moves'],
    ['oracles', 'Oracles'], ['foes', 'Foes'], ['guide', 'Guide'], ['journal', 'Journal']
  ];

  /* ---------- chrome ---------- */
  function renderTop() {
    const d = OB.store.data;
    const c = OB.char();
    $('#top-chars').innerHTML = `<select id="char-select" aria-label="Character">${d.chars.map(x => `<option value="${x.id}" ${x.id === c.id ? 'selected' : ''}>${E(x.name || 'Unnamed')}${x.cls ? ' — ' + E(x.cls) : ''}</option>`).join('')}</select>`;
    OB.updateSaveBadge();
  }
  OB.updateSaveBadge = function () {
    const b = $('#save-badge'); if (!b) return;
    const s = OB.store;
    if (!s.storageOK) { b.className = 'warn'; b.textContent = 'Autosave is off in this browser. Export to keep your data.'; return; }
    b.className = '';
    const t = s.lastSaved ? new Date(s.lastSaved) : null;
    b.textContent = t ? 'Saved ' + t.getHours().toString().padStart(2, '0') + ':' + t.getMinutes().toString().padStart(2, '0') : 'Autosave on';
  };

  const initials = n => (n || '?').trim().split(/\s+/).slice(0, 2).map(x => x[0]).join('').toUpperCase() || '?';
  OB.avatar = (c, cls) => c.portrait ? `<img class="av ${cls || ''}" src="${c.portrait}" alt="">` : `<span class="av ${cls || ''}">${E(initials(c.name))}</span>`;

  function renderHud() {
    const c = OB.char();
    const reset = OB.momentumReset(c), maxM = OB.maxMomentum(c), maxF = OB.maxFocus(c);
    const vit = (k, name, val, hint, max, icon, pct) => `<div class="hv v-${k}" title="${hint} · ${max}">
      <span class="hv-i">${OB.icon(icon)}</span>
      <div class="hv-m"><span class="hv-l">${name}</span>
        <div class="hv-c"><button type="button" class="step" data-act="vital" data-k="${k}" data-d="-1" aria-label="Lower ${name}">−</button><b class="${val <= 0 && k !== 'momentum' ? 'zero' : ''}">${OB.sgn(val)}</b><button type="button" class="step" data-act="vital" data-k="${k}" data-d="1" aria-label="Raise ${name}">+</button></div>
        <i class="hv-bar" style="--p:${Math.max(0, Math.min(100, pct))}%"></i></div>
      <small>${max}</small></div>`;
    const n = OB.debCount(c);
    $('#hud').innerHTML = `<div class="hud-inner">
      <div class="hud-id">${OB.avatar(c)}<div><b>${E(c.name || 'Unnamed')}</b><small>${[c.heritage, c.cls, 'Tier ' + c.tier].filter(Boolean).map(E).join(' · ')}</small></div></div>
      ${vit('health', 'Health', c.health, 'Endure Harm', 'max +5', 'heart', c.health / 5 * 100)}
      ${vit('spirit', 'Spirit', c.spirit, 'Endure Stress', 'max +5', 'flame', c.spirit / 5 * 100)}
      ${vit('supply', 'Supply', c.supply, 'Shared with allies', 'max +5', 'bag', c.supply / 5 * 100)}
      ${vit('focus', 'Focus', c.focus, 'Magic and grit', 'max +' + maxF, 'star', maxF ? c.focus / maxF * 100 : 0)}
      ${vit('momentum', 'Momentum', c.momentum, 'Burn after a roll to improve it', 'max +' + maxM + ' · reset ' + OB.sgn(reset), 'bolt', (c.momentum + 6) / 16 * 100)}
      <div class="hud-deb">${n ? OB.DEBILITIES.filter(d => c.deb[d.key]).map(d => `<span class="pill bad">${d.name}</span>`).join('') : ''}</div>
    </div>`;
  }

  const TAB_ICON = { sheet: 'sheet', tracks: 'tracks', assets: 'assets', moves: 'moves', oracles: 'oracles', foes: 'foes', guide: 'guide', journal: 'journal' };
  function renderTabs() {
    $('#tabs').innerHTML = `<div class="rail-logo" aria-hidden="true">${OB.icon('logo')}</div>` +
      TABS.map(t => `<button type="button" role="tab" class="tab ${OB.ui.tab === t[0] ? 'on' : ''}" aria-selected="${OB.ui.tab === t[0]}" data-act="gotoTab" data-tab="${t[0]}">${OB.icon(TAB_ICON[t[0]])}<span>${t[1]}</span></button>`).join('') +
      `<button type="button" class="tab rail-dice" data-act="toggleDice" aria-label="Dice">${OB.icon('dice')}<span>Dice</span></button>`;
  }

  let lastTab = null;
  function renderView() {
    const v = $('#view');
    v.innerHTML = OB.v[OB.ui.tab]();
    v.dataset.tab = OB.ui.tab;
    if (lastTab !== OB.ui.tab) { v.classList.remove('enter'); void v.offsetWidth; v.classList.add('enter'); lastTab = OB.ui.tab; }
  }

  OB.refresh = function () {
    const a = document.activeElement;
    const keep = a && a.id && a !== document.body ? { id: a.id, s: a.selectionStart, e: a.selectionEnd } : null;
    const y = window.scrollY;
    renderTop(); renderHud(); renderTabs(); renderView(); OB.renderDice();
    window.scrollTo(0, y);
    const sb = document.querySelector('.stickybar'); if (sb) document.documentElement.style.setProperty('--sticky-h', sb.offsetHeight + 'px');
    if (keep) { const el = document.getElementById(keep.id); if (el) { el.focus(); try { el.setSelectionRange(keep.s, keep.e); } catch (e) { /* not text */ } } }
    document.body.classList.toggle('dice-open', !!OB.ui.diceOpen);
  };

  /* ---------- modal builders ---------- */
  const rankOpts = (val, only) => OB.RANKS.filter(r => !only || only.includes(r.key)).map(r => `<option value="${r.key}" ${r.key === val ? 'selected' : ''}>${r.name}</option>`).join('');

  function trackModal(kind, o) {
    o = o || {};
    const k = OB.KINDS.find(x => x.key === kind);
    OB.modal({
      title: o.title || k.add,
      html: `<label class="lbl">Name<input type="text" id="tm-name" placeholder="${kind === 'fight' ? 'Foe' : kind === 'oath' ? 'Your vow…' : 'Name'}" autocomplete="off"></label>
        <label class="lbl">Rank<select id="tm-rank">${rankOpts(o.rank || 'dangerous', o.ranks)}</select></label>`,
      ok: 'Create',
      onOk: m => {
        const name = $('#tm-name', m).value.trim();
        if (!name) { OB.toast('Give it a name.'); return false; }
        OB.addTrack({ kind, name, rank: $('#tm-rank', m).value, bg: !!o.bg });
        OB.refresh();
        if (OB.ui.tab !== 'tracks' && !o.stay) { OB.toast(k.one + ' added to Tracks.'); }
      }
    });
  }

  function bondModal(after) {
    OB.modal({
      title: 'New bond',
      html: `<label class="lbl">Person or community<input type="text" id="bm-name" autocomplete="off"></label><label class="lbl">Note<input type="text" id="bm-note" autocomplete="off"></label>`,
      ok: 'Add bond (+1 tick)',
      onOk: m => { const n = $('#bm-name', m).value.trim(); if (!n) { OB.toast('Give the bond a name.'); return false; } OB.addBond(n, $('#bm-note', m).value.trim()); OB.refresh(); if (after) after(); }
    });
  }

  function ascendModal() {
    const c = OB.char();
    const next = OB.tierEligible(c);
    if (!next) return;
    const allCls = OB.CLASSES.map(x => x.key);
    OB.modal({
      title: `Ascend to tier ${next} — ${OB.TIERS[next - 1].title}`,
      ok: 'Ascend',
      html: `<p class="muted">Envision how your legend has grown. Choose two. You may not choose the same option twice.</p>
        <div class="asc-opts">
          <label class="opt"><input type="checkbox" value="stat"><span><strong>Hone your gifts.</strong> Add +1 to a stat (max +4).
            <select id="as-stat">${OB.STATS.map(s => `<option value="${s.key}" ${c.stats[s.key] >= 4 ? 'disabled' : ''}>${s.name} (${OB.sgn(c.stats[s.key])})</option>`).join('')}</select></span></label>
          <label class="opt"><input type="checkbox" value="focus" ${OB.maxFocus(c) >= 6 ? 'disabled' : ''}><span><strong>Deepen your power.</strong> Add +1 to your max focus (max +6). Now +${OB.maxFocus(c)}.</span></label>
          <label class="opt"><input type="checkbox" value="blood" ${c.legacyAwakened ? 'disabled' : ''}><span><strong>Awaken your blood.</strong> Gain the legacy ability of your heritage.</span></label>
          <label class="opt"><input type="checkbox" value="craft"><span><strong>Master your craft.</strong> Upgrade an asset without spending experience (mark an ability on its card).</span></label>
          <label class="opt"><input type="checkbox" value="path" ${next < 3 ? 'disabled' : ''}><span><strong>Walk a new path</strong> (tier 3 or 4 only). Gain the Foundation card of a path of another class.
            <select id="as-cls">${allCls.map(x => `<option>${x}</option>`).join('')}</select> <select id="as-path"></select></span></label>
        </div>`,
      onOpen: m => {
        const fill = () => { const cls = $('#as-cls', m).value; $('#as-path', m).innerHTML = OB.CLASS[cls].paths.map(p => `<option>${p}</option>`).join(''); };
        $('#as-cls', m).addEventListener('change', fill); fill();
        m.addEventListener('change', e => {
          const boxes = [...m.querySelectorAll('.asc-opts input[type=checkbox]')];
          const n = boxes.filter(b => b.checked).length;
          boxes.forEach(b => { if (!b.checked) b.disabled = n >= 2 || b.dataset.hard === '1'; });
        });
        m.querySelectorAll('.asc-opts input[type=checkbox]').forEach(b => { if (b.disabled) b.dataset.hard = '1'; });
      },
      onOk: m => {
        const picks = [...m.querySelectorAll('.asc-opts input:checked')].map(b => b.value);
        if (picks.length !== 2) { OB.toast('Choose exactly two.'); return false; }
        const ok = OB.ascend({ picks, stat: $('#as-stat', m).value, pathCls: $('#as-cls', m).value, path: $('#as-path', m).value });
        if (ok) { if (picks.includes('craft')) OB.toast('Master your craft: mark an ability on any asset for free.'); OB.refresh(); }
      }
    });
  }

  function assetModal() {
    const c = OB.char();
    const paths = [];
    if (c.cls) OB.CLASS[c.cls].paths.forEach(p => paths.push({ cls: c.cls, path: p }));
    c.extraPaths.forEach(p => paths.push(p));
    OB.modal({
      title: 'Add asset',
      ok: 'Add',
      html: `<label class="lbl">Type<select id="am-type">
          <option value="talent">Talent</option><option value="companion">Companion</option>
          <option value="path" ${paths.length ? '' : 'disabled'}>Path card</option>
          <option value="artifact">Artifact</option><option value="spell">Spell</option><option value="custom">Custom asset</option></select></label>
        <div data-for="name"><label class="lbl">Name<input type="text" id="am-name" autocomplete="off" placeholder="Swordmaster, Archer, Herbalist, Horse…"></label></div>
        <div data-for="path" hidden><label class="lbl">Path<select id="am-path">${paths.map(p => `<option value="${p.cls}|${p.path}">${p.path} (${p.cls})</option>`).join('')}</select></label>
          <label class="lbl">Card<select id="am-tier">${OB.PATH_TIERS.map((t, i) => `<option value="${i}">${t} (tier ${i + 1})</option>`).join('')}</select></label></div>
        <div data-for="artifact" hidden><label class="lbl">Artifact<select id="am-art">${OB.ARTIFACTS.map((a, i) => `<option value="${i}">${E(a.name)}</option>`).join('')}<option value="-1">Custom artifact…</option></select></label></div>
        <label class="chk"><input type="checkbox" id="am-xp" checked><span class="box"></span><span id="am-xp-l">Spend 3 experience (available: ${OB.xpAvail(c)})</span></label>
        <p class="muted small">At creation, your class card, one Foundation, and one talent or companion are free. Untick the box for those.</p>`,
      onOpen: m => {
        const sync = () => {
          const t = $('#am-type', m).value;
          m.querySelectorAll('[data-for]').forEach(el => { const f = el.dataset.for; el.hidden = !(f === t || (f === 'name' && t !== 'path' && !(t === 'artifact' && $('#am-art', m).value !== '-1'))); });
          $('#am-xp-l', m).textContent = (t === 'artifact' ? 'Spend 2 experience' : 'Spend 3 experience') + ` (available: ${OB.xpAvail(c)})`;
          if (t === 'artifact') $('#am-name', m).placeholder = 'Custom artifact name';
        };
        m.addEventListener('change', sync); sync();
      },
      onOk: m => {
        const t = $('#am-type', m).value;
        const cost = t === 'artifact' ? 2 : 3;
        const pay = $('#am-xp', m).checked;
        if (pay && OB.xpAvail(c) < cost) { OB.toast('Not enough experience. Untick the box to add it free.'); return false; }
        if (t === 'path') {
          const [cls, path] = $('#am-path', m).value.split('|'); const i = +$('#am-tier', m).value;
          if (c.assets.some(a => a.type === 'path' && a.path === path && a.pathIdx === i)) { OB.toast('You already have that card.'); return false; }
          OB.addPathCard(cls, path, i);
        } else if (t === 'artifact' && $('#am-art', m).value !== '-1') {
          const a = OB.ARTIFACTS[+$('#am-art', m).value];
          OB.addAsset({ type: 'artifact', name: a.name, sub: a.sub, text: a.text, abilities: a.abilities.map((x, j) => ({ text: x, on: j === 0 })) });
        } else {
          const name = $('#am-name', m).value.trim();
          if (!name) { OB.toast('Give it a name.'); return false; }
          OB.addAsset({ type: t, name, sub: t === 'talent' ? 'Talent' : t === 'companion' ? 'Companion' : t === 'spell' ? 'Spell' : '' });
        }
        if (pay) OB.spendXp(cost);
        OB.refresh();
      }
    });
  }

  /* ---------- actions ---------- */
  const cid = el => el.dataset.id;
  const A = {
    gotoTab(el) { OB.ui.tab = el.dataset.tab; OB.refresh(); window.scrollTo(0, 0); },
    gotoMove(el) {
      const name = el.dataset.move; const m = OB.MOVE[name]; if (!m) return;
      OB.ui.tab = 'moves'; OB.ui.moveFilter = ''; OB.ui.moveCat = 'all'; OB.ui.open['move:' + name] = true;
      OB.refresh();
      const t = document.getElementById('mv-' + OB.slug(name)); if (t) { t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    },
    toggleDice() { OB.ui.diceOpen = !OB.ui.diceOpen; OB.renderDice(); document.body.classList.toggle('dice-open', !!OB.ui.diceOpen); },

    /* vitals */
    setVital(el) { const c = OB.char(); const k = el.dataset.k, v = +el.dataset.v; OB.applyEffects({ [k]: v - c[k] }); OB.refresh(); },
    vital(el) { OB.applyEffects({ [el.dataset.k]: +el.dataset.d }); OB.refresh(); },
    burnHud() { const c = OB.char(); c.momentum = OB.momentumReset(c); OB.save(); OB.refresh(); },
    stat(el) { const c = OB.char(); const k = el.dataset.k; c.stats[k] = OB.clamp(c.stats[k] + (+el.dataset.d), 0, 4); OB.save(); OB.refresh(); },
    xp(el) { const c = OB.char(); const k = el.dataset.k; c[k] = Math.max(0, c[k] + (+el.dataset.d)); OB.save(); OB.refresh(); },
    oathSeed() {
      const c = OB.char(); const info = OB.CLASS_INFO[c.cls]; if (!info) return;
      const i = OB.rint(6);
      OB.logNote(`Oath seed (${c.cls}, d6=${i}): ${info.seeds[i - 1]}`);
    },
    classQuestions() {
      const c = OB.char(); const info = OB.CLASS_INFO[c.cls]; if (!info) return;
      OB.modal({ title: c.cls + ' — questions', ok: false, cancel: 'Close', html: `<h4>Background</h4><ul>${info.bg.map(q => `<li>${E(q)}</li>`).join('')}</ul><h4>Bonds</h4><ul>${info.bond.map(q => `<li>${E(q)}</li>`).join('')}</ul><h4>Oath seeds (d6)</h4><ol>${info.seeds.map(q => `<li>${E(q)}</li>`).join('')}</ol>` });
    },
    semiRandom() { OB.confirm('This replaces your stats, heritage, upbringing, class, path, and class cards. Your notes stay. Continue?', 'Roll it', () => { OB.semiRandom(); OB.refresh(); }); },

    /* bonds */
    addBond() { bondModal(); },
    delBond(el) { const c = OB.char(); c.bonds = c.bonds.filter(b => b.id !== cid(el)); OB.save(); OB.refresh(); },
    rollEpilogue() { OB.rollProgress('bonds', 'Write Your Epilogue'); },

    /* tiers & assets */
    ascend() { ascendModal(); },
    advance(el) {
      const n = +el.dataset.n;
      if (!OB.spendXp(n)) return;
      OB.toast(`Spent ${n} XP. ${n === 3 ? 'Add a new asset.' : 'Mark an ability on an asset.'}`);
      OB.ui.tab = 'assets'; OB.refresh();
    },
    newAsset() { assetModal(); },
    addPathCard(el) {
      const c = OB.char(); const { cls, path } = el.dataset; const i = +el.dataset.i;
      OB.modal({
        title: `Add ${path} — ${OB.PATH_TIERS[i]}`, ok: 'Add',
        html: `<label class="chk"><input type="checkbox" id="pc-xp" checked><span class="box"></span><span>Spend 3 experience (available: ${OB.xpAvail(c)})</span></label><p class="muted small">Untick if it is free: your starting Foundation, or a path gained when you Ascend.</p>`,
        onOk: m => {
          const pay = $('#pc-xp', m).checked;
          if (pay && OB.xpAvail(c) < 3) { OB.toast('Not enough experience.'); return false; }
          OB.addPathCard(cls, path, i);
          if (pay) OB.spendXp(3);
          OB.refresh();
        }
      });
    },
    addArtifact(el) {
      const a = OB.ARTIFACTS[+el.dataset.i];
      OB.addAsset({ type: 'artifact', name: a.name, sub: a.sub, text: a.text, abilities: a.abilities.map((x, j) => ({ text: x, on: j === 0 })) });
      OB.toast(a.name + ' added to Assets.'); OB.refresh();
    },
    delAsset(el) { const c = OB.char(); const a = c.assets.find(x => x.id === cid(el)); OB.confirm(`Remove “${a.name || 'this asset'}”?`, 'Remove', () => { c.assets = c.assets.filter(x => x.id !== a.id); OB.save(); OB.refresh(); }); },
    toggleAbility(el) { const a = OB.char().assets.find(x => x.id === cid(el)); const ab = a.abilities[+el.dataset.i]; ab.on = !ab.on; OB.save(); OB.refresh(); },
    addAbility(el) { const a = OB.char().assets.find(x => x.id === cid(el)); a.abilities.push({ text: '', on: false }); OB.save(); OB.refresh(); },
    delAbility(el) { const a = OB.char().assets.find(x => x.id === cid(el)); a.abilities.splice(+el.dataset.i, 1); OB.save(); OB.refresh(); },
    upgradeAsset(el) {
      const c = OB.char(); const a = c.assets.find(x => x.id === cid(el));
      const ab = a.abilities.find(x => !x.on); if (!ab) return;
      OB.modal({ title: 'Upgrade ' + (a.name || 'asset'), ok: 'Upgrade', html: `<label class="chk"><input type="checkbox" id="up-xp" checked><span class="box"></span><span>Spend 2 experience (available: ${OB.xpAvail(c)})</span></label><p class="muted small">Untick for a free upgrade (Master your craft).</p>`,
        onOk: m => { const pay = $('#up-xp', m).checked; if (pay && OB.xpAvail(c) < 2) { OB.toast('Not enough experience.'); return false; } ab.on = true; if (pay) OB.spendXp(2); OB.save(); OB.refresh(); } });
    },
    setComp(el) { const a = OB.char().assets.find(x => x.id === cid(el)); a.health = +el.dataset.v; OB.save(); OB.refresh(); },
    compHarm(el) { const n = document.getElementById('cd-' + cid(el)); OB.companionEndure(cid(el), n ? n.value : 1); },

    /* tracks */
    newTrack(el, ev) { if (ev) ev.preventDefault(); const k = el.dataset.kind; trackModal(k, { ranks: k === 'oath' ? null : null }); },
    newBgOath() { trackModal('oath', { title: 'Background oath', ranks: ['extreme', 'epic'], rank: 'extreme', bg: true, stay: true }); },
    delTrack(el) { const c = OB.char(); const t = c.tracks.find(x => x.id === cid(el)); OB.confirm(`Delete “${t.name || 'this track'}”?`, 'Delete', () => { OB.removeTrack(t.id); OB.refresh(); }); },
    markTrack(el) { OB.markTrack(cid(el)); OB.refresh(); },
    unmarkTrack(el) { OB.unmarkTrack(cid(el)); OB.refresh(); },
    tickTrack(el) { OB.tickTrack(cid(el), +el.dataset.d); OB.refresh(); },
    doneTrack(el) { const t = OB.char().tracks.find(x => x.id === cid(el)); t.done = !t.done; OB.save(); OB.refresh(); },
    toggleInitiative() { const c = OB.char(); c.initiative = !c.initiative; OB.save(); OB.refresh(); },
    harmFoe(el) { const n = document.getElementById('harm-' + cid(el)); const h = Math.max(1, parseInt(n && n.value, 10) || 1); OB.markTrack(cid(el), h); OB.toast(`${h} harm marked.`); OB.refresh(); },
    rollTrack(el) { OB.rollProgress(cid(el), el.dataset.move); },
    rollProgress(el) { OB.rollProgress(el.dataset.track, el.dataset.move); },
    rollProgressSel(el) { const s = document.getElementById(el.dataset.sel); if (s && s.value) OB.rollProgress(s.value, el.dataset.move); },
    rollProgressPanel() { const s = document.getElementById('dp-track'); if (!s || !s.value) { OB.toast('Choose a track.'); return; } const t = OB.char().tracks.find(x => x.id === s.value); OB.rollProgress(s.value, s.value === 'bonds' ? 'Write Your Epilogue' : (OB.KINDS.find(k => k.key === t.kind) || {}).roll); },

    /* rolls */
    rollStat(el) {
      const k = el.dataset.k;
      if (k === 'none') OB.rollAction({ label: 'Action roll (no stat)', statName: 'no stat', statVal: 0 });
      else OB.rollAction({ label: 'Action roll +' + k, statKey: k });
    },
    rollMove(el) { OB.rollMove(el.dataset.move, el.dataset.stat); },
    endure(el) { const n = document.getElementById('en-' + el.dataset.kind); OB.endure(el.dataset.kind, n ? n.value : 1); },
    compEndureSel() { OB.companionEndure(document.getElementById('ce-sel').value, document.getElementById('ce-amt').value); },
    forsakeSel() { const s = document.getElementById('fo-sel'); if (s && s.value) OB.forsakeOath(s.value); },
    milestoneSel() { const s = document.getElementById('ms-sel'); if (s && s.value) { OB.markTrack(s.value); OB.toast('Milestone marked.'); OB.refresh(); } },
    swearOath() {
      const name = document.getElementById('so-name').value.trim();
      if (!name) { OB.toast('Write your oath first.'); return; }
      const t = OB.addTrack({ kind: 'oath', name, rank: document.getElementById('so-rank').value });
      OB.rollMove('Swear an Oath', 'presence'); void t;
    },
    addFoeQuick() { const n = document.getElementById('ef-name').value.trim(); if (!n) { OB.toast('Name the foe.'); return; } OB.addFoe(n, document.getElementById('ef-rank').value); },
    newJourney() { const n = document.getElementById('uj-name').value.trim(); if (!n) { OB.toast('Name the journey.'); return; } OB.addTrack({ kind: 'journey', name: n, rank: document.getElementById('uj-rank').value }); OB.toast('Journey added to Tracks.'); OB.refresh(); },
    castSpell(el) { OB.castSpell(el.dataset.scope); },
    rollOracle(el) { OB.rollOracle(el.dataset.key); },
    rollAsk(el) { OB.rollAsk(el.dataset.odds); },
    rollCombo(el) { OB.rollCombo(el.dataset.id); },
    rollName() { OB.rollName(); },
    rollTableData(el) { OB.rollTableData(el.dataset.move); },
    rollD100() { const r = OB.d100(); OB.logPush({ kind: 'oracle', label: 'd100', parts: [{ title: 'd100', roll: r.v, text: String(r.v), match: r.match, more: [] }] }); },
    rollDie(el) { OB.rollDie(+el.dataset.n); },
    adds(el) { if (el.dataset.set != null) OB.ui.add = +el.dataset.set; else OB.ui.add = OB.clamp(OB.ui.add + (+el.dataset.d), -5, 9); OB.renderDice(); },
    clearLog() { OB.confirm('Clear the roll log?', 'Clear', () => { OB.char().log = []; OB.save(); OB.refresh(); }); },
    burn(el) { OB.burn(cid(el)); },

    /* roll follow-ups */
    applyFx(el) {
      const c = OB.char(); const e = c.log.find(x => x.id === cid(el)); const [hn, i] = el.dataset.k.split(':');
      const fx = OB.MOVE[e.move].fx[hn][+i];
      OB.applyEffects(fx); e.applied = e.applied || {}; e.applied[el.dataset.k] = true; OB.save(); OB.refresh();
    },
    applyExtra(el) {
      const c = OB.char(); const e = c.log.find(x => x.id === cid(el)); const i = +el.dataset.i; const x = e.extras[i];
      e.applied = e.applied || {}; e.applied['x' + i] = true;
      if (x.type === 'fx') OB.applyEffects(x.fx);
      else if (x.type === 'deb') { OB.markDeb(x.key, true); OB.toast(OB.DEBILITIES.find(d => d.key === x.key).name + ' marked.'); }
      else if (x.type === 'table') { OB.rollTableData(x.move); return; }
      else if (x.type === 'companion') { const a = c.assets.find(z => z.id === x.id); if (a) a.health = Math.min(a.maxHealth || 4, (a.health || 0) + x.delta); }
      else if (x.type === 'overreach') { OB.save(); OB.overreach(x.lack, x.track); return; }
      OB.save(); OB.refresh();
    },
    markFromRoll(el) { const e = OB.char().log.find(x => x.id === cid(el)); OB.markTrack(el.dataset.track); e.applied = e.applied || {}; e.applied[el.dataset.k] = true; OB.save(); OB.refresh(); },
    harmFromRoll(el) {
      const c = OB.char(); const e = c.log.find(x => x.id === cid(el));
      const h = OB.harmFor(e, c.weaponHarm || 2, e.bonusHarm || 0);
      OB.markTrack(el.dataset.track, h); e.applied = e.applied || {}; e.applied[el.dataset.k] = true; OB.save(); OB.refresh();
    },
    bonusHarm(el) { const e = OB.char().log.find(x => x.id === cid(el)); e.bonusHarm = OB.clamp((e.bonusHarm || 0) + (+el.dataset.d), -2, 6); OB.save(); OB.refresh(); },
    weapon(el) { OB.char().weaponHarm = +el.dataset.h; OB.save(); OB.refresh(); },
    bondFromRoll(el) { const e = OB.char().log.find(x => x.id === cid(el)); bondModal(() => { e.applied = e.applied || {}; e.applied.bond = true; OB.save(); OB.refresh(); }); },
    completeFromRoll(el) { const e = OB.char().log.find(x => x.id === cid(el)); OB.completeTrack(e.trackId, e.hit); e.applied = e.applied || {}; e.applied.done = true; OB.save(); OB.refresh(); },
    recommit(el) {
      const c = OB.char(); const e = c.log.find(x => x.id === cid(el)); const t = c.tracks.find(x => x.id === e.trackId); if (!t) return;
      t.ticks = Math.min(t.ticks, 4); const i = OB.RANKS.findIndex(r => r.key === t.rank); t.rank = OB.RANKS[Math.min(4, i + 1)].key;
      e.applied = e.applied || {}; e.applied.rec = true; OB.save(); OB.refresh();
    },
    forsakeFromRoll(el) { const e = OB.char().log.find(x => x.id === cid(el)); e.applied = e.applied || {}; e.applied.rec = true; OB.forsakeOath(e.trackId); },

    /* lists & filters */
    moveCat(el) { OB.ui.moveCat = el.dataset.cat; OB.refresh(); },
    expandMoves(el) { const open = el.dataset.open === '1'; document.querySelectorAll('#view details.move').forEach(d => { d.open = open; OB.ui.open[d.dataset.key] = open; }); },
    oracleGroup(el) { OB.ui.oracleGroup = el.dataset.g; OB.refresh(); },
    addFoe(el) { OB.addFoe(el.dataset.name, el.dataset.rank); },
    addCustomFoe() { const n = document.getElementById('cf-name').value.trim(); if (!n) { OB.toast('Name the foe.'); return; } OB.addFoe(n, document.getElementById('cf-rank').value); },
    addPack() { const [n, r] = document.getElementById('pk-foe').value.split('|'); OB.addPack(n, r, document.getElementById('pk-size').value); },

    /* journal & world */
    addEntry() { const c = OB.char(); c.journal.unshift({ id: OB.uid('j'), date: new Date().toLocaleDateString(), title: '', text: '' }); OB.save(); OB.refresh(); },
    delEntry(el) { const c = OB.char(); OB.confirm('Delete this entry?', 'Delete', () => { c.journal = c.journal.filter(j => j.id !== cid(el)); OB.save(); OB.refresh(); }); },
    regionNote(el) {
      const info = OB.REGION_INFO[el.dataset.name]; const c = OB.char();
      c.journal.unshift({ id: OB.uid('j'), date: new Date().toLocaleDateString(), title: el.dataset.name + ' — quest starter', text: OB.pick(info.quests) });
      OB.save(); OB.toast('Quest starter added to the journal.');
    },
    rollTruth(el) {
      const c = OB.char(); c.truths = c.truths || {}; const r = OB.rint(100);
      const pick = r <= 33 ? 0 : r <= 66 ? 1 : 2; c.truths[el.dataset.key] = Object.assign(c.truths[el.dataset.key] || {}, { pick });
      OB.save(); OB.toast(`d100 = ${r}`); OB.refresh();
    },
    truthNote(el) {
      const c = OB.char(); const t = OB.TRUTHS.find(x => x.key === el.dataset.key); const st = c.truths[t.key];
      c.journal.unshift({ id: OB.uid('j'), date: new Date().toLocaleDateString(), title: t.name + ' — quest starter', text: t.opts[st.pick][1] });
      OB.save(); OB.toast('Added to the journal.');
    },

    /* characters & files */
    newChar() {
      const d = OB.store.data; const c = OB.newChar(); d.chars.push(c); d.active = c.id; OB.ui.tab = 'sheet'; OB.saveNow(); OB.refresh(); OB.toast('New character created.');
    },
    delChar() {
      const d = OB.store.data; const c = OB.char();
      OB.confirm(`Delete ${c.name || 'this character'}? Export first if you want a backup. This cannot be undone.`, 'Delete', () => {
        d.chars = d.chars.filter(x => x.id !== c.id);
        if (!d.chars.length) d.chars.push(OB.newChar());
        d.active = d.chars[0].id; OB.saveNow(); OB.refresh();
      });
    },
    dupChar() { const d = OB.store.data; const c = JSON.parse(JSON.stringify(OB.char())); c.id = OB.uid('c'); c.name = (c.name || 'Unnamed') + ' (copy)'; d.chars.push(c); d.active = c.id; OB.saveNow(); OB.refresh(); },
    exportOne() { OB.exportData(false); closeMenu(); },
    exportAll() { OB.exportData(true); closeMenu(); },
    importFile() { closeMenu(); $('#file-in').click(); },
    printSheet() { closeMenu(); window.print(); },
    theme(el) { OB.setTheme(el.dataset.t); },
    palette() { closeMenu(); OB.palette(); },
    portrait() { $('#portrait-in').click(); },
    portraitDel() { OB.char().portrait = ''; OB.save(); OB.refresh(); }
  };
  const closeMenu = () => { const m = $('#file-menu'); if (m) m.open = false; };

  /* ---------- events ---------- */
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-act]');
    if (!el || el.disabled) return;
    const fn = A[el.dataset.act];
    if (!fn) return;
    if (el.tagName === 'A') e.preventDefault();
    fn(el, e);
  });

  function setBind(el, rerender) {
    const c = OB.char();
    const r = OB.resolve(c, el.dataset.bind);
    if (!r) return;
    let v = el.value;
    const type = el.dataset.type;
    if (type === 'bool') v = el.checked;
    else if (type === 'num') v = parseInt(v, 10) || 0;
    r.obj[r.key] = v;
    const hook = el.dataset.hook; if (hook && OB.hooks[hook]) OB.hooks[hook]();
    if (el.dataset.bind === 'deb' || /^deb\./.test(el.dataset.bind)) OB.hooks.deb();
    OB.save();
    return rerender;
  }
  document.addEventListener('input', e => {
    const el = e.target;
    if (el.matches('#move-search')) { OB.ui.moveFilter = el.value; OB.refresh(); return; }
    if (el.matches('#oracle-search')) { OB.ui.oracleFilter = el.value; OB.refresh(); return; }
    if (el.matches('#foe-search')) { OB.ui.foeFilter = el.value; OB.refresh(); return; }
    if (!el.dataset.bind) return;
    if (el.tagName === 'SELECT' || el.type === 'checkbox' || el.type === 'number') return;
    setBind(el, false);
    if (el.dataset.bind === 'name') { renderTop(); renderHud(); }
  });
  document.addEventListener('change', e => {
    const el = e.target;
    if (el.id === 'char-select') { OB.store.data.active = el.value; OB.saveNow(); OB.refresh(); return; }
    if (el.id === 'file-in') { readFile(el.files[0]); el.value = ''; return; }
    if (el.id === 'portrait-in') { readPortrait(el.files[0]); el.value = ''; return; }
    if (el.dataset.actChange === 'nameHeritage') { OB.ui.nameHeritage = el.value; return; }
    if (el.dataset.actChange === 'pickTruth') { const c = OB.char(); c.truths = c.truths || {}; c.truths[el.dataset.key] = Object.assign(c.truths[el.dataset.key] || {}, { pick: +el.value }); OB.save(); OB.refresh(); return; }
    if (!el.dataset.bind) return;
    setBind(el, true);
    OB.refresh();
  });
  document.addEventListener('toggle', e => {
    const el = e.target;
    if (!el.dataset || !el.dataset.key) return;
    OB.ui.open[el.dataset.key] = el.open;
    if (el.classList.contains('oracle') && el.open && !el.querySelector('.otable')) {
      el.querySelector('.acc-body').insertAdjacentHTML('beforeend', OB.oracleTable(el.dataset.key.slice(7)));
    }
  }, true);

  function readFile(file) {
    if (!file) return;
    const rd = new FileReader();
    rd.onload = () => {
      let obj;
      try { obj = JSON.parse(rd.result); } catch (err) { OB.toast('That file is not valid JSON.'); return; }
      try {
        const list = obj.kind === 'roster' ? obj.characters : obj.kind === 'character' ? [obj.character] : [obj];
        const clash = (list || []).some(x => x && OB.store.data.chars.some(y => y.id === x.id));
        const go = replace => {
          try { const r = OB.importPayload(obj, replace); OB.ui.tab = 'sheet'; OB.refresh(); OB.toast(`Imported ${r.added + r.replaced} character${r.added + r.replaced === 1 ? '' : 's'}.`); }
          catch (er) { OB.toast(er.message); }
        };
        if (clash) OB.modal({ title: 'Character already here', html: '<p>A character with the same ID is already saved in this browser. Replace it with the file, or import the file as a copy?</p>', ok: 'Replace it', cancel: 'Import as copy', onOk: () => go(true), onCancel: () => go(false) });
        else go(false);
      } catch (er) { OB.toast(er.message); }
    };
    rd.readAsText(file);
  }

  /* drag & drop a .json file anywhere */
  window.addEventListener('dragover', e => e.preventDefault());
  window.addEventListener('drop', e => { e.preventDefault(); const f = e.dataTransfer && e.dataTransfer.files[0]; if (f && /json$/i.test(f.name)) readFile(f); });


  /* ---------- theme ---------- */
  OB.THEMES = [['gold', 'Gold'], ['ember', 'Ember'], ['frost', 'Frost'], ['verdant', 'Verdant'], ['arcane', 'Arcane']];
  OB.applyTheme = function () {
    let t = 'gold'; try { t = localStorage.getItem('oathbound.theme') || 'gold'; } catch (e) { /* storage blocked */ }
    document.documentElement.dataset.theme = t;
  };
  OB.setTheme = function (t) {
    document.documentElement.dataset.theme = t;
    try { localStorage.setItem('oathbound.theme', t); } catch (e) { /* storage blocked */ }
  };

  /* ---------- portrait: crop square, shrink, store as data URL ---------- */
  function readPortrait(file) {
    if (!file) return;
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const S = 420, cv = document.createElement('canvas'); cv.width = cv.height = S;
      const side = Math.min(img.width, img.height);
      cv.getContext('2d').drawImage(img, (img.width - side) / 2, (img.height - side) / 4 > 0 ? (img.height - side) / 4 : 0, side, side, 0, 0, S, S);
      URL.revokeObjectURL(url);
      OB.char().portrait = cv.toDataURL('image/jpeg', 0.82);
      OB.save(); OB.refresh(); OB.toast('Portrait set.');
    };
    img.onerror = () => OB.toast('Could not read that image.');
    img.src = url;
  }

  /* ---------- command palette (Ctrl/Cmd+K or /) ---------- */
  OB.palette = function () {
    const items = [];
    TABS.forEach(t => items.push({ k: 'Go to', n: t[1], run: () => A.gotoTab({ dataset: { tab: t[0] } }) }));
    OB.MOVES.forEach(m => items.push({ k: 'Move', n: m.name, h: OB.cap(m.cat), run: () => A.gotoMove({ dataset: { move: m.name } }) }));
    Object.keys(OB.ORACLES).forEach(k => items.push({ k: 'Oracle', n: OB.ORACLES[k].title, h: 'roll', run: () => OB.rollOracle(k) }));
    OB.ODDS.forEach(o => items.push({ k: 'Oracle', n: 'Ask the Oracle — ' + o.name, h: o.min + '+', run: () => OB.rollAsk(o.key) }));
    OB.FOES.forEach(g => g.list.forEach(f => items.push({ k: 'Foe', n: f[0], h: f[1] + ' · add to Fights', run: () => OB.addFoe(f[0], f[1]) })));
    [['New oath', () => A.newTrack({ dataset: { kind: 'oath' } })], ['New journey', () => A.newTrack({ dataset: { kind: 'journey' } })], ['Add bond', () => A.addBond()],
      ['Add asset', () => A.newAsset()], ['Roll d100', () => A.rollD100()], ['Export JSON', () => OB.exportData(false)], ['Import JSON', () => $('#file-in').click()],
      ['New character', () => A.newChar()]].forEach(x => items.push({ k: 'Action', n: x[0], run: x[1] }));
    let sel = 0, list = items;
    const close = () => { const m = document.getElementById('modal'); if (m) m.remove(); };
    const draw = m => {
      m.querySelector('.pal-list').innerHTML = list.slice(0, 40).map((it, i) => `<button type="button" class="pal-item ${i === sel ? 'on' : ''}" data-i="${i}"><span class="pk">${it.k}</span><span class="pn">${E(it.n)}</span><span class="ph">${E(it.h || '')}</span></button>`).join('') || '<p class="muted empty">Nothing found.</p>';
      const on = m.querySelector('.pal-item.on'); if (on) on.scrollIntoView({ block: 'nearest' });
    };
    OB.modal({
      title: 'Search', ok: false, noCancel: true,
      html: `<input type="search" class="pal-in" placeholder="Move, oracle, foe, action…" aria-label="Search" autocomplete="off"><div class="pal-list"></div>`,
      onOpen: m => {
        m.classList.add('pal');
        const inp = m.querySelector('.pal-in');
        const go = i => { const it = list[i]; if (!it) return; close(); setTimeout(it.run, 0); };
        inp.addEventListener('input', () => { const q = inp.value.toLowerCase().trim(); list = !q ? items : items.filter(it => (it.k + ' ' + it.n).toLowerCase().includes(q)); sel = 0; draw(m); });
        inp.addEventListener('keydown', e => {
          if (e.key === 'ArrowDown') { sel = Math.min(sel + 1, Math.min(list.length, 40) - 1); draw(m); e.preventDefault(); }
          else if (e.key === 'ArrowUp') { sel = Math.max(sel - 1, 0); draw(m); e.preventDefault(); }
          else if (e.key === 'Enter') go(sel);
        });
        m.querySelector('.pal-list').addEventListener('click', e => { const b = e.target.closest('.pal-item'); if (b) go(+b.dataset.i); });
        draw(m);
      }
    });
  };
  document.addEventListener('keydown', e => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test((document.activeElement || {}).tagName || '');
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); OB.palette(); }
    else if (e.key === '/' && !typing && !document.getElementById('modal')) { e.preventDefault(); OB.palette(); }
  });

  /* ---------- boot ---------- */
  OB.boot = function () {
    OB.load();
    OB.applyTheme();
    $('#app').innerHTML = `
      <div class="shell">
        <nav id="tabs" class="rail" role="tablist" aria-label="Sections"></nav>
        <div class="col">
          <header class="masthead">
            <div class="brand"><span class="mark">OATHBOUND</span><small>Character sheet · Waystone</small></div>
            <div class="top-tools">
              <span id="top-chars"></span>
              <button type="button" class="btn small ghost ico-btn" data-act="palette" title="Search everything (Ctrl+K)" aria-label="Search">${OB.icon('search')}<span class="kbd">Ctrl K</span></button>
              <button type="button" class="btn small" data-act="newChar" title="New character">${OB.icon('plus')}<span>New</span></button>
              <button type="button" class="btn small primary" data-act="exportOne" title="Download this character as a JSON file">${OB.icon('download')}<span>Export</span></button>
              <button type="button" class="btn small" data-act="importFile" title="Load a character from a JSON file">${OB.icon('upload')}<span>Import</span></button>
              <details class="menu" id="file-menu"><summary class="btn small ghost" aria-label="More">${OB.icon('more')}</summary>
                <div class="menu-pop">
                  <div class="menu-sec">Accent</div>
                  <div class="swatches">${OB.THEMES.map(t => `<button type="button" class="sw sw-${t[0]}" data-act="theme" data-t="${t[0]}" title="${t[1]}" aria-label="${t[1]} accent"></button>`).join('')}</div>
                  <button type="button" class="only-m" data-act="importFile">Import character (JSON)</button>
                  <button type="button" data-act="exportAll">Export all characters</button>
                  <button type="button" data-act="dupChar">Duplicate character</button>
                  <button type="button" data-act="printSheet">Print sheet</button>
                  <button type="button" class="danger" data-act="delChar">Delete character</button>
                </div></details>
              <span id="save-badge"></span>
            </div>
          </header>
          <div id="hud" class="hud"></div>
          <main id="view" class="view"></main>
          <footer class="foot">Autosaves in this browser. <strong>Export</strong> a JSON file to keep a backup or to move to another device. · Based on <em>Oathbound</em> by Bruno Rocha Guimarães, which is based on <em>Ironsworn</em> by Shawn Tomkin · CC BY-NC-SA 4.0</footer>
        </div>
        <aside id="dice" class="dice" aria-label="Dice and roll log"></aside>
      </div>
      <button type="button" id="dice-fab" class="fab" data-act="toggleDice" aria-label="Open dice and roll log">${OB.icon('dice')}</button>
      <input type="file" id="file-in" accept=".json,application/json" hidden>
      <input type="file" id="portrait-in" accept="image/*" hidden>`;
    OB.refresh();
    window.addEventListener('beforeunload', OB.saveNow);
  };
  document.addEventListener('DOMContentLoaded', OB.boot);
})(window.OB);
