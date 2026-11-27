/* ==========================================================================
   OATHBOUND — app shell (Stargazer-style): header, tabs, campaign menu,
   right drawer (dice · oracles · moves · journal), events and actions.
   ========================================================================== */
(function (OB) {
  'use strict';
  const E = OB.esc;
  const $ = (s, r) => (r || document).querySelector(s);
  const WIDE = () => window.matchMedia('(min-width: 1024px)').matches;

  OB.BUILD = '2026-11-27.hf5';
  const TABS = [
    ['campaign', 'Campaign'], ['character', null], ['challenges', 'Challenges'], ['guide', 'Guide']
  ];
  const SECTIONS = ['dice', 'oracles', 'moves', 'journal'];

  /* ---------- chrome ---------- */
  // write innerHTML only when it changed: keeps DOM, scroll and open panels, and saves layout work
  function put(el, html) { if (el._h === html) return false; el._h = html; el.innerHTML = html; return true; }

  function renderTabs() {
    const c = OB.char();
    put($('#tabs'), TABS.map(([k, label]) => {
      const text = k === 'character' ? (c.name || 'Character') : label;
      return `<button type="button" role="tab" class="tab ${OB.ui.tab === k ? 'on' : ''}" aria-selected="${OB.ui.tab === k}" data-act="gotoTab" data-tab="${k}">${E(text)}</button>`;
    }).join(''));
  }

  let lastTab = null;
  function renderView() {
    const v = $('#view');
    if (!OB.v[OB.ui.tab]) OB.ui.tab = 'character';
    put(v, OB.v[OB.ui.tab]());
    v.dataset.tab = OB.ui.tab;
    if (lastTab !== OB.ui.tab) { v.classList.remove('enter'); void v.offsetWidth; v.classList.add('enter'); lastTab = OB.ui.tab; }
  }

  const isOpen = k => (OB.ui.open['dsec:' + k] != null ? !!OB.ui.open['dsec:' + k] : k === 'oracles');
  function renderDrawer() {
    const sec = (key, title, icon, html) => `<details class="dsec dsec-${key}" data-key="dsec:${key}" ${isOpen(key) ? 'open' : ''}>
      <summary><span class="dsec-t">${title}</span>${OB.icon('chevDown', 'chev')}</summary>
      <div class="dsec-b">${html}</div></details>`;
    // render only the open sections; closed ones stay empty until opened (less DOM, faster page)
    const body = k => isOpen(k) ? ({ oracles: OB.drawerOracles, moves: OB.drawerMoves, journal: OB.drawerJournal })[k]() : '';
    put($('#drawer-body'), [
      sec('oracles', 'Oracles', 'oracle', body('oracles')),
      sec('moves', 'Moves', 'moves', body('moves')),
      sec('journal', 'Journal', 'listEdit', body('journal'))
    ].join(''));
    if (OB.renderDice) OB.renderDice();
  }

  function renderMenu() {
    const d = OB.store.data;
    const item = (act, icon, label) => `<button type="button" class="mitem" data-act="${act}">${OB.icon(icon)}<span>${label}</span></button>`;
    put($('#menu-body'), `
      <div class="mcamps">${d.chars.map(x => `<div class="mrow ${x.id === d.active ? 'on' : ''}">
          <button type="button" class="mpick" data-act="selectChar" data-id="${x.id}">${E(x.campaignName || 'New Campaign - ' + (x.name || 'Unnamed'))}</button>
          <button type="button" class="ib sm" data-act="delChar" data-id="${x.id}" aria-label="Delete campaign">${OB.icon('trash')}</button>
        </div>`).join('')}</div>
      ${item('newChar', 'plus', 'New Campaign')}
      <hr>
      ${item('exportOne', 'download', 'Export Campaign Data')}
      ${item('importFile', 'upload', 'Load Campaign Data')}
      <hr>
      ${item('exportAll', 'download', 'Export All Campaigns')}
      ${item('exportJournal', 'download', 'Export Journal')}
      ${item('rulebooks', 'book', 'Rulebook PDFs')}
      <hr>
      ${OB.canInstall ? item('installApp', 'download', 'Install App') : ''}
      ${item('diceStyle', 'dice', 'Dice Style (3D)')}
      ${item('dupChar', 'copy', 'Duplicate Campaign')}
      ${item('printSheet', 'print', 'Print Character')}
      <div class="swatches" aria-label="Accent colour">${OB.THEMES.map(t => `<button type="button" class="sw sw-${t[0]}" data-act="theme" data-t="${t[0]}" title="${t[1]}" aria-label="${t[1]} accent"></button>`).join('')}</div>
      <div class="mfoot"><span id="save-badge"></span><br><b>Build ${OB.BUILD}</b> · ${OB.THEMES.length} themes · 3D dice · moves by type<br>Oathbound by Bruno Rocha Guimarães, based on Ironsworn by Shawn Tomkin. CC BY-NC-SA 4.0.</div>`);
  }

  OB.updateSaveBadge = function () {
    const b = $('#save-badge'); if (!b) return;
    const s = OB.store;
    if (!s.storageOK) { b.className = 'warn'; b.textContent = 'Autosave is off in this browser. Export to keep your data.'; return; }
    b.className = '';
    const t = s.lastSaved ? new Date(s.lastSaved) : null;
    b.textContent = t ? 'Saved ' + t.getHours().toString().padStart(2, '0') + ':' + t.getMinutes().toString().padStart(2, '0') : 'Autosave on';
  };

  OB.refresh = function () {
    const a = document.activeElement;
    const keep = a && a.id && a !== document.body ? { id: a.id, s: a.selectionStart, e: a.selectionEnd } : null;
    const y = window.scrollY;
    renderTabs(); renderView(); renderDrawer(); if (OB.ui.menu) renderMenu();
    put($('#drawer-fab'), OB.icon(OB.ui.drawer ? 'chevRight' : 'chevLeft'));
    document.body.classList.toggle('drawer-open', !!OB.ui.drawer);
    document.body.classList.toggle('dice-open', !!OB.ui.dicePanel);
    document.body.classList.toggle('menu-open', !!OB.ui.menu);
    $('#menu').classList.toggle('open', !!OB.ui.menu);
    OB.updateSaveBadge();
    window.scrollTo(0, y);
    if (keep) { const el = document.getElementById(keep.id); if (el) { el.focus(); try { el.setSelectionRange(keep.s, keep.e); } catch (e) { /* not text */ } } }
  };

  function setMenu(on) { OB.ui.menu = !!on; document.body.classList.toggle('menu-open', OB.ui.menu); $('#menu').classList.toggle('open', OB.ui.menu); if (OB.ui.menu) renderMenu(); }

  /* open a drawer section (and the drawer itself) */
  OB.openDrawer = function (sec) {
    OB.ui.drawer = true;
    if (sec) OB.ui.open['dsec:' + sec] = true;
    OB.refresh();
    if (sec) {
      const el = document.querySelector(`details.dsec-${sec}`);
      if (el) el.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
  };

  /* ---------- modal builders ---------- */
  const rankOpts = (val, only) => OB.RANKS.filter(r => !only || only.includes(r.key)).map(r => `<option value="${r.key}" ${r.key === val ? 'selected' : ''}>${r.name}</option>`).join('');
  const $m = (s, m) => m.querySelector(s);

  function trackModal(kind, o) {
    o = o || {};
    const k = OB.KINDS.find(x => x.key === kind);
    OB.modal({
      title: o.title || k.add,
      html: `<label class="lbl">Name<input type="text" id="tm-name" placeholder="${kind === 'fight' ? 'Foe' : kind === 'oath' ? 'Your vow…' : 'Name'}" autocomplete="off"></label>
        <label class="lbl">Rank<select id="tm-rank">${rankOpts(o.rank || 'dangerous', o.ranks)}</select></label>`,
      ok: 'Create',
      onOk: m => {
        const name = $m('#tm-name', m).value.trim();
        if (!name) { OB.toast('Give it a name.'); return false; }
        OB.addTrack({ kind, name, rank: $m('#tm-rank', m).value, bg: !!o.bg });
        OB.refresh();
      }
    });
  }

  function bondModal(after) {
    OB.modal({
      title: 'New bond',
      html: `<label class="lbl">Person or community<input type="text" id="bm-name" autocomplete="off"></label><label class="lbl">Note<input type="text" id="bm-note" autocomplete="off"></label>`,
      ok: 'Add bond (+1 tick)',
      onOk: m => { const n = $m('#bm-name', m).value.trim(); if (!n) { OB.toast('Give the bond a name.'); return false; } OB.addBond(n, $m('#bm-note', m).value.trim()); OB.refresh(); if (after) after(); }
    });
  }

  function ascendModal() {
    const c = OB.char();
    const next = OB.tierEligible(c);
    if (!next) return;
    OB.modal({
      title: `Ascend to tier ${next} — ${OB.TIERS[next - 1].title}`,
      ok: 'Ascend',
      html: `<p class="muted">Envision how your legend has grown. Choose two. You may not choose the same option twice.</p>
        <div class="asc-opts">
          <label class="opt"><input type="checkbox" value="stat"><span><strong>Hone your gifts.</strong> Add +1 to a stat (max +4).
            <select id="as-stat">${OB.STATS.map(s => `<option value="${s.key}" ${c.stats[s.key] >= 4 ? 'disabled' : ''}>${s.name} (${OB.sgn(c.stats[s.key])})</option>`).join('')}</select></span></label>
          <label class="opt"><input type="checkbox" value="focus" ${OB.maxFocus(c) >= 6 ? 'disabled' : ''}><span><strong>Deepen your power.</strong> Add +1 to your max focus (max +6). Now ${OB.sgn(OB.maxFocus(c))}.</span></label>
          <label class="opt"><input type="checkbox" value="blood" ${c.legacyAwakened ? 'disabled' : ''}><span><strong>Awaken your blood.</strong> Gain the legacy ability of your heritage.</span></label>
          <label class="opt"><input type="checkbox" value="craft"><span><strong>Master your craft.</strong> Upgrade an asset without spending experience.</span></label>
          <label class="opt"><input type="checkbox" value="path" ${next < 3 ? 'disabled' : ''}><span><strong>Walk a new path</strong> (tier 3 or 4 only). Gain the Foundation card of a path of another class.
            <select id="as-cls">${OB.CLASSES.map(x => `<option>${x.key}</option>`).join('')}</select> <select id="as-path"></select></span></label>
        </div>`,
      onOpen: m => {
        const fill = () => { const cls = $m('#as-cls', m).value; $m('#as-path', m).innerHTML = OB.CLASS[cls].paths.map(p => `<option>${p}</option>`).join(''); };
        $m('#as-cls', m).addEventListener('change', fill); fill();
        const boxes = [...m.querySelectorAll('.asc-opts input[type=checkbox]')];
        boxes.forEach(b => { b.dataset.hard = b.disabled ? '1' : ''; });
        m.addEventListener('change', () => {
          const n = boxes.filter(b => b.checked).length;
          boxes.forEach(b => { if (!b.checked) b.disabled = n >= 2 || b.dataset.hard === '1'; });
        });
      },
      onOk: m => {
        const picks = [...m.querySelectorAll('.asc-opts input:checked')].map(b => b.value);
        if (picks.length !== 2) { OB.toast('Choose exactly two.'); return false; }
        const ok = OB.ascend({ picks, stat: $m('#as-stat', m).value, pathCls: $m('#as-cls', m).value, path: $m('#as-path', m).value });
        if (ok) { if (picks.includes('craft')) OB.toast('Master your craft: mark an ability on any asset for free.'); OB.refresh(); }
      }
    });
  }

  /* ---------- Add asset: browse the whole catalog, or make a custom one ---------- */
  function catalogItems(kind, c) {
    const out = [];
    const cls = c && c.cls;
    const traditions = cls ? (OB.CLASS_TRADITIONS[cls] || []) : [];
    const extraPathSet = new Set((c && c.extraPaths || []).map(p => p.path));
    if (kind === 'class') OB.CLASSES.forEach(x => out.push({ v: 'class|' + x.key, label: x.key, ab: OB.CLASS_INFO[x.key].abilities, text: OB.CLASS_INFO[x.key].blurb, block: c.assets.some(a => a.type === 'class' && a.cls === x.key) ? 'Already on your sheet' : '' }));
    else if (kind === 'path') OB.CLASSES.forEach(x => x.paths.forEach(p => OB.PATH_TIERS.forEach((t, i) => {
      const k = (OB.PATH_CARDS[p] || [])[i];
      const nm = k && k.name ? k.name : (i === 0 ? (OB.CLASS_INFO[x.key].foundations || {})[p] : '');
      const fits = !!cls && (x.key === cls || extraPathSet.has(p));
      out.push({
        v: `path|${x.key}|${p}|${i}`,
        label: `${nm ? nm + ' — ' : ''}${x.key} · ${p} · ${t}`,
        ab: k && k.abilities || [],
        text: (k && k.text) || (i === 0 ? (OB.CLASS_INFO[x.key].paths || {})[p] : ''),
        cls: x.key,
        path: p,
        fits,
        block: OB.pathCardBlock(c, x.key, p, i)
      });
    })));
    else if (kind === 'artifact') OB.ARTIFACTS.forEach((a, i) => out.push({ v: 'artifact|' + i, label: a.name, ab: a.abilities, text: a.text }));
    else (OB.CATALOG[kind] || []).forEach((a, i) => {
      const fits = kind === 'spell' && !!cls && (a.cls === cls || extraPathSet.has(a.path) || traditions.includes(a.source));
      const label = kind === 'spell' ? `${a.name} — ${a.source || a.cls} (${a.path} · ${a.tierName})` : a.name;
      out.push({
        v: kind + '|' + i,
        label,
        ab: a.abilities || [],
        text: a.text,
        cls: a.cls || '',
        source: a.source || '',
        fits,
        block: kind === 'spell' ? OB.pathCardBlock(c, a.cls, a.path, a.pathIdx) :
          kind === 'talent' && a.name === 'Battle-Scarred' && !c.deb.maimed ? 'Requires the Maimed bane' : ''
      });
    });
    return out;
  }

  function assetModal() {
    const c = OB.char();
    const KINDS = [['class', 'Class card'], ['path', 'Path card'], ['talent', 'Talent'], ['companion', 'Companion'], ['spell', 'Spell'], ['artifact', 'Artifact'], ['custom', 'Custom asset']];
    const clsLabel = c.cls || '';
    OB.modal({
      title: 'Add asset',
      ok: 'Add',
      html: `<label class="lbl">Category<select id="am-type">${KINDS.map(k => `<option value="${k[0]}" ${k[0] === 'talent' ? 'selected' : ''}>${k[1]}</option>`).join('')}</select></label>
        <div data-for="filter" hidden><label class="lbl">Filter by class / tradition<select id="am-filter"></select></label></div>
        <div data-for="list"><label class="lbl">Card<select id="am-item"></select></label>
          <div id="am-prev" class="am-prev"></div></div>
        <div data-for="name" hidden><label class="lbl">Name<input type="text" id="am-name" autocomplete="off" placeholder="Name of your own asset"></label></div>
        <p id="am-status" class="muted small" role="status"></p>
        <label class="chk"><input type="checkbox" id="am-xp" checked><span class="box"></span><span id="am-xp-l"></span></label>
        <p class="muted small">At creation, your class card, one Foundation, and one talent or companion are free. Untick the box for those.</p>`,
      onOpen: m => {
        const renderFilter = t => {
          const fWrap = m.querySelector('[data-for="filter"]');
          const fSel = $m('#am-filter', m);
          if (t !== 'spell' && t !== 'path') { fWrap.hidden = true; return; }
          fWrap.hidden = false;
          const items = catalogItems(t, c);
          const hasFit = items.some(x => x.fits);
          const opts = [];
          if (hasFit) opts.push(['fits', t === 'spell' ? `${clsLabel} and related magic` : `Paths for ${clsLabel}`]);
          opts.push(['all', `All (${items.length})`]);
          if (t === 'spell') {
            const sources = [...new Set(items.map(x => x.source).filter(Boolean))];
            sources.forEach(s => opts.push(['src:' + s, s]));
          } else {
            OB.CLASSES.forEach(x => opts.push(['cls:' + x.key, x.key]));
          }
          fSel.innerHTML = opts.map(o => `<option value="${E(o[0])}">${E(o[1])}</option>`).join('');
          if (hasFit) fSel.value = 'fits';
        };
        const fillList = () => {
          const t = $m('#am-type', m).value;
          const custom = t === 'custom';
          if (custom) return;
          let items = catalogItems(t, c);
          const fVal = m.querySelector('[data-for="filter"]').hidden ? 'all' : $m('#am-filter', m).value;
          if (fVal === 'fits') items = items.filter(x => x.fits);
          else if (fVal.startsWith('src:')) items = items.filter(x => x.source === fVal.slice(4));
          else if (fVal.startsWith('cls:')) items = items.filter(x => x.cls === fVal.slice(4));
          const label = t === 'spell' ? `${clsLabel} and related magic` : `Paths for ${clsLabel}`;
          let html = '';
          if (fVal === 'all' && (t === 'spell' || t === 'path') && clsLabel && items.some(x => x.fits)) {
            const fitItems = items.filter(x => x.fits);
            const otherItems = items.filter(x => !x.fits);
            html += `<optgroup label="${E(label)}">${fitItems.map(it => `<option value="${E(it.v)}">${E(it.label)}</option>`).join('')}</optgroup>`;
            html += `<optgroup label="Other">${otherItems.map(it => `<option value="${E(it.v)}">${E(it.label)}</option>`).join('')}</optgroup>`;
          } else {
            html = items.map(it => `<option value="${E(it.v)}">${E(it.label)}</option>`).join('');
          }
          if (['talent', 'companion', 'spell', 'artifact'].includes(t)) html += '<option value="custom">Custom…</option>';
          const select = $m('#am-item', m);
          select.innerHTML = html;
          const available = items.find(item => !item.block);
          if (available) select.value = available.v;
        };
        const sync = () => {
          const t = $m('#am-type', m).value;
          const custom = t === 'custom';
          m.querySelector('[data-for="list"]').hidden = custom;
          renderFilter(t);
          fillList();
          pick();
        };
        const pick = () => {
          const t = $m('#am-type', m).value, v = $m('#am-item', m).value;
          const own = t === 'custom' || v === 'custom';
          m.querySelector('[data-for="name"]').hidden = !own;
          const it = own ? null : catalogItems(t, c).find(x => x.v === v);
          $m('#am-prev', m).hidden = !it;
          const block = it?.block || '';
          $m('#am-status', m).textContent = block || (t === 'spell' ? 'Spells from the book are path cards. Choose Custom… for a house rule.' : t === 'artifact' ? 'Add artifacts after attuning to them in the story.' : '');
          $m('[data-m="ok"]', m).disabled = !!block;
          $m('#am-prev', m).innerHTML = it ? `${it.text ? `<p>${E(it.text)}</p>` : ''}${it.ab.length ? `<ol>${it.ab.map(x => `<li>${E(Array.isArray(x) ? x[0] + '. ' + x[1] : x)}</li>`).join('')}</ol>` : '<p class="muted small">No preset abilities.</p>'}` : '';
          const cost = t === 'artifact' ? 2 : t === 'class' ? 0 : 3;
          $m('#am-xp', m).checked = cost > 0; $m('#am-xp', m).disabled = cost === 0;
          $m('#am-xp-l', m).textContent = cost ? `Spend ${cost} experience (available: ${OB.xpAvail(c)})` : 'Class card: free';
        };
        $m('#am-type', m).addEventListener('change', sync);
        $m('#am-filter', m).addEventListener('change', () => { fillList(); pick(); });
        $m('#am-item', m).addEventListener('change', pick);
        sync();
      },
      onOk: m => {
        const t = $m('#am-type', m), kind = t.value, v = $m('#am-item', m).value;
        const own = kind === 'custom' || v === 'custom';
        const item = own ? null : catalogItems(kind, c).find(x => x.v === v);
        if (!own && (!item || item.block)) return false;
        const cost = kind === 'artifact' ? 2 : kind === 'class' ? 0 : 3;
        const pay = cost > 0 && $m('#am-xp', m).checked;
        if (pay && OB.xpAvail(c) < cost) { OB.toast('Not enough experience. Untick the box to add it free.'); return false; }
        const withAb = (type, a) => OB.addAsset({
          type,
          name: a.name,
          sub: a.sub,
          cls: a.cls || '',
          path: a.path || '',
          tier: a.tier || 1,
          maxHealth: a.maxHealth || 4,
          health: a.maxHealth || 4,
          text: a.text || '',
          abilities: a.abilities ? a.abilities.map((x, j) => ({ text: x, on: j === 0 })) : undefined
        });
        if (own) {
          const name = $m('#am-name', m).value.trim();
          if (!name) { OB.toast('Give it a name.'); return false; }
          OB.addAsset({ type: kind === 'custom' ? 'custom' : kind, name, sub: { talent: 'Talent', companion: 'Companion', spell: 'Spell', artifact: 'Artifact' }[kind] || '' });
        } else if (kind === 'class') {
          const cls = v.split('|')[1];
          if (c.assets.some(a => a.type === 'class' && a.cls === cls)) { OB.toast('You already have that class card.'); return false; }
          const info = OB.CLASS_INFO[cls];
          OB.addAsset({ type: 'class', cls, name: cls + ' (class card)', sub: `${Object.keys(info.paths).join(' & ')} paths · max focus +${OB.CLASS[cls].focus}`, text: info.blurb, abilities: info.abilities.map((x, j) => ({ name: x[0], text: x[1], on: j === 0 })) });
        } else if (kind === 'path') {
          const [, cls, path, i] = v.split('|');
          if (c.assets.some(a => a.type === 'path' && a.path === path && a.pathIdx === +i)) { OB.toast('You already have that card.'); return false; }
          OB.addPathCard(cls, path, +i);
        } else if (kind === 'spell') {
          const spell = OB.CATALOG.spell[+v.split('|')[1]];
          OB.addPathCard(spell.cls, spell.path, spell.pathIdx);
        } else if (kind === 'artifact') withAb('artifact', OB.ARTIFACTS[+v.split('|')[1]]);
        else withAb(kind, OB.CATALOG[kind][+v.split('|')[1]]);
        if (pay) OB.spendXp(cost);
        OB.refresh();
      }
    });
  }

  /* ---------- actions ---------- */
  const cid = el => el.dataset.id;
  const trackOf = id => OB.char().tracks.find(t => t.id === id);
  const A = {
    /* navigation */
    gotoTab(el) { OB.ui.tab = el.dataset.tab; OB.refresh(); window.scrollTo(0, 0); },
    gotoMove(el) {
      const name = el.dataset.move; if (!OB.MOVE[name]) return;
      OB.ui.moveFilter = ''; OB.ui.moveCat = 'all'; OB.ui.open['move:' + name] = true;
      OB.openDrawer('moves');
      requestAnimationFrame(() => { const t = document.getElementById('mv-' + OB.slug(name)); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'center' }); });
    },
    toggleDrawer() { OB.ui.drawer = !OB.ui.drawer; OB.refresh(); },
    openDsec(el) { if (el.dataset.s === 'dice') return A.toggleDice(); OB.openDrawer(el.dataset.s); },
    installApp() {
      setMenu(false);
      const ev = OB.installEvt; if (!ev) return;
      ev.prompt(); ev.userChoice.finally(() => { OB.installEvt = null; OB.canInstall = false; });
    },
    diceStyle() { setMenu(false); OB.dice3d.openSettings(); },
    toggleDice() { OB.ui.dicePanel = !OB.ui.dicePanel; document.body.classList.toggle('dice-open', !!OB.ui.dicePanel); },
    copyOracle(el) { const e = OB.rollOracle(el.dataset.key); const t = e.parts.map(p => p.text).join(' '); if (navigator.clipboard) navigator.clipboard.writeText(t).catch(() => {}); OB.toast('Copied: ' + t); },
    menu() { setMenu(!OB.ui.menu); },
    closeMenu() { setMenu(false); },
    palette() { setMenu(false); OB.palette(); },
    search() { OB.palette(); },
    theme(el) { OB.setTheme(el.dataset.t); renderMenu(); },

    /* vitals & character */
    setVital(el) { const c = OB.char(); const k = el.dataset.k, v = +el.dataset.v; OB.applyEffects({ [k]: v - c[k] }); OB.refresh(); },
    burnMomentum() { const c = OB.char(); c.momentum = OB.momentumReset(c); OB.save(); OB.toast('Momentum burned. It is now ' + OB.sgn(c.momentum) + '.'); OB.refresh(); },
    stat(el) { const c = OB.char(); const k = el.dataset.k; c.stats[k] = OB.clamp(c.stats[k] + (+el.dataset.d), 0, 4); OB.save(); OB.refresh(); },
    xp(el) { const c = OB.char(); const k = el.dataset.k; c[k] = Math.max(0, c[k] + (+el.dataset.d)); OB.save(); OB.refresh(); },
    semiRandom() { OB.confirm('This replaces your stats, heritage, upbringing, class, path, and class cards. Your notes stay. Continue?', 'Roll it', () => { OB.semiRandom(); OB.refresh(); }); },
    newBgOath() { trackModal('oath', { title: 'Background oath', ranks: ['extreme', 'epic'], rank: 'extreme', bg: true }); },
    portrait() { $('#portrait-in').click(); },
    portraitDel() { OB.char().portrait = ''; OB.save(); OB.refresh(); },

    /* bonds & tiers */
    addBond() { bondModal(); },
    delBond(el) { const c = OB.char(); c.bonds = c.bonds.filter(b => b.id !== cid(el)); OB.save(); OB.refresh(); },
    rollEpilogue() { OB.rollProgress('bonds', 'Write Your Epilogue'); },
    ascend() { ascendModal(); },
    advance(el) {
      const n = +el.dataset.n;
      if (n === 3) return assetModal();
      if (!OB.spendXp(n)) return;
      OB.toast(`Spent ${n} XP. Mark an ability on an asset.`);
      OB.ui.tab = 'character'; OB.refresh();
    },

    /* assets */
    newAsset() { assetModal(); },
    addPathCard(el) {
      const c = OB.char(); const { cls, path } = el.dataset; const i = +el.dataset.i;
      const card = OB.PATH_CARDS[path][i];
      OB.modal({
        title: card.name, ok: 'Add',
        html: `<p class="muted small">${E(path)} · ${E(card.tier)} · Tier ${i + 1}</p>
          <div class="am-prev">${card.text ? `<p>${E(card.text)}</p>` : ''}<ol>${card.abilities.map(ability => `<li>${E(ability)}</li>`).join('')}</ol></div>
          <label class="chk"><input type="checkbox" id="pc-xp" checked><span class="box"></span><span>Spend 3 experience (available: ${OB.xpAvail(c)})</span></label>`,
        onOk: m => {
          if (OB.pathCardBlock(c, cls, path, i)) return false;
          const pay = $m('#pc-xp', m).checked;
          if (pay && OB.xpAvail(c) < 3) { OB.toast('Not enough experience.'); return false; }
          OB.addPathCard(cls, path, i);
          if (pay) OB.spendXp(3);
          OB.refresh();
        }
      });
    },
    delAsset(el) { const c = OB.char(); const a = c.assets.find(x => x.id === cid(el)); if (!a) return; OB.confirm(`Remove “${a.name || 'this asset'}”?`, 'Remove', () => { c.assets = c.assets.filter(x => x.id !== a.id); OB.save(); OB.refresh(); }); },
    toggleAbility(el) { const a = OB.char().assets.find(x => x.id === cid(el)); if (!a) return; const ab = a.abilities[+el.dataset.i]; ab.on = !ab.on; OB.save(); OB.refresh(); },
    addAbility(el) { const a = OB.char().assets.find(x => x.id === cid(el)); a.abilities.push({ text: '', on: false }); OB.save(); OB.refresh(); },
    delAbility(el) { const a = OB.char().assets.find(x => x.id === cid(el)); a.abilities.splice(+el.dataset.i, 1); OB.save(); OB.refresh(); },
    upgradeAsset(el) {
      const c = OB.char(); const a = c.assets.find(x => x.id === cid(el));
      const ab = a.abilities.find(x => !x.on); if (!ab) return;
      OB.modal({ title: 'Upgrade ' + (a.name || 'asset'), ok: 'Upgrade', html: `<label class="chk"><input type="checkbox" id="up-xp" checked><span class="box"></span><span>Spend 2 experience (available: ${OB.xpAvail(c)})</span></label><p class="muted small">Untick for a free upgrade (Master your craft).</p>`,
        onOk: m => { const pay = $m('#up-xp', m).checked; if (pay && OB.xpAvail(c) < 2) { OB.toast('Not enough experience.'); return false; } ab.on = true; if (pay) OB.spendXp(2); OB.save(); OB.refresh(); } });
    },
    setComp(el) { const a = OB.char().assets.find(x => x.id === cid(el)); if (!a) return; a.health = +el.dataset.v; OB.save(); OB.refresh(); },
    compHarm(el) { const n = document.getElementById('cd-' + cid(el)); OB.companionEndure(cid(el), n ? n.value : 1); },
    addArtifact(el) {
      const a = OB.ARTIFACTS[+el.dataset.i];
      OB.addAsset({ type: 'artifact', name: a.name, sub: a.sub, text: a.text, abilities: a.abilities.map((x, j) => ({ text: x, on: j === 0 })) });
      OB.toast(a.name + ' added to Assets.'); OB.refresh();
    },
    classQuestions() { OB.ui.open.classq = true; OB.refresh(); },

    /* challenges */
    newTrack(el) { trackModal(el.dataset.kind); },
    newJourney() { const n = document.getElementById('uj-name').value.trim(); if (!n) { OB.toast('Name the journey.'); return; } OB.addTrack({ kind: 'journey', name: n, rank: document.getElementById('uj-rank').value }); OB.toast('Journey added to Challenges.'); OB.refresh(); },
    delTrack(el) { const t = trackOf(cid(el)); if (!t) return; OB.confirm(`Delete “${t.name || 'this track'}”?`, 'Delete', () => { OB.removeTrack(t.id); OB.refresh(); }); },
    setBoxes(el) {
      const t = trackOf(cid(el)); if (!t) return;
      const v = +el.dataset.v, cur = Math.floor(t.ticks / 4);
      t.ticks = (cur === v && t.ticks % 4 === 0) ? (v - 1) * 4 : v * 4;
      OB.save(); OB.refresh();
    },
    setRank(el) { const t = trackOf(cid(el)); if (!t) return; t.rank = el.dataset.rank; OB.save(); OB.refresh(); },
    markTrack(el) { OB.markTrack(cid(el)); OB.refresh(); },
    unmarkTrack(el) { OB.unmarkTrack(cid(el)); OB.refresh(); },
    doneTrack(el) { const t = trackOf(cid(el)); if (!t) return; t.done = !t.done; OB.save(); OB.refresh(); },
    toggleInitiative() { const c = OB.char(); c.initiative = !c.initiative; OB.save(); OB.refresh(); },
    harmFoe(el) { const n = document.getElementById('harm-' + cid(el)); const h = Math.max(1, parseInt(n && n.value, 10) || 1); OB.markTrack(cid(el), h); OB.toast(`${h} harm marked.`); OB.refresh(); },
    rollTrack(el) { OB.rollProgress(cid(el), el.dataset.move); },
    rollProgress(el) { OB.rollProgress(el.dataset.track, el.dataset.move); },
    rollProgressSel(el) { const s = document.getElementById(el.dataset.sel); if (s && s.value) OB.rollProgress(s.value, el.dataset.move); },
    rollProgressPanel() { const s = document.getElementById('dp-track'); if (!s || !s.value) { OB.toast('Choose a track.'); return; } const t = trackOf(s.value); OB.rollProgress(s.value, s.value === 'bonds' ? 'Write Your Epilogue' : t ? (OB.KINDS.find(k => k.key === t.kind) || {}).roll : 'Progress roll'); },
    addFoe(el) { OB.addFoe(el.dataset.name, el.dataset.rank); },
    addCustomFoe() { const n = document.getElementById('cf-name').value.trim(); if (!n) { OB.toast('Name the foe.'); return; } OB.addFoe(n, document.getElementById('cf-rank').value); },
    addPack() { const [n, r] = document.getElementById('pk-foe').value.split('|'); OB.addPack(n, r, document.getElementById('pk-size').value); },
    addFoeQuick() { const n = document.getElementById('ef-name').value.trim(); if (!n) { OB.toast('Name the foe.'); return; } OB.addFoe(n, document.getElementById('ef-rank').value); },

    /* campaign & amarin */
    addFaction() { const c = OB.char(); c.factions.push({ id: OB.uid('f'), name: '', type: '', influence: '', sphere: '', notes: '' }); OB.save(); OB.refresh(); },
    delFaction(el) { const c = OB.char(); c.factions = c.factions.filter(f => f.id !== cid(el)); OB.save(); OB.refresh(); },
    rollTruth(el) {
      const c = OB.char(); c.truths = c.truths || {};
      const t = OB.TRUTHS.find(x => x.key === el.dataset.key); if (!t) return;
      const r = OB.d100();
      const pick = r.v <= 33 ? 0 : r.v <= 66 ? 1 : 2;
      c.truths[t.key] = Object.assign(c.truths[t.key] || {}, { pick });
      OB.logPush({ kind: 'oracle', label: t.name, parts: [{ title: t.name, roll: r.v, text: t.opts[pick][0], match: r.match, more: [] }] });
    },
    truthNote(el) {
      const c = OB.char(); const t = OB.TRUTHS.find(x => x.key === el.dataset.key); const st = (c.truths || {})[t.key];
      if (!st || st.pick == null) return;
      c.journal.unshift({ id: OB.uid('j'), date: new Date().toLocaleDateString(), title: t.name + ' — quest starter', text: t.opts[st.pick][1] });
      OB.save(); OB.toast('Added to the journal.'); OB.refresh();
    },
    regionNote(el) {
      const info = OB.REGION_INFO[el.dataset.name]; const c = OB.char();
      c.journal.unshift({ id: OB.uid('j'), date: new Date().toLocaleDateString(), title: el.dataset.name + ' — quest starter', text: OB.pick(info.quests) });
      OB.save(); OB.toast('Quest starter added to the journal.'); OB.refresh();
    },

    /* oracles */
    rollOracle(el) { OB.rollOracle(el.dataset.key); },
    rollAsk(el) { OB.rollAsk(el.dataset.odds); },
    rollCombo(el) { OB.rollCombo(el.dataset.id); },
    rollName() { OB.rollName(); },
    rollTableData(el) { OB.rollTableData(el.dataset.move); },
    rollD100() { const r = OB.d100(); OB.logPush({ kind: 'oracle', label: 'd100', parts: [{ title: 'd100', roll: r.v, text: String(r.v), match: r.match, more: [] }] }); },
    rollDie(el) { OB.rollDie(+el.dataset.n); },
    oracleGroup(el) { OB.ui.oracleGroup = el.dataset.g; OB.refresh(); },

    /* moves & dice */
    guideGo(el) {
      const k = el.dataset.g; OB.ui.open['g:' + k] = true;
      const d = document.getElementById('g-' + k);
      if (d) { d.open = true; d.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    },
    moveCat(el) { OB.ui.moveCat = el.dataset.cat; OB.refresh(); },
    expandMoves(el) { const open = el.dataset.open === '1'; document.querySelectorAll('#drawer details.move').forEach(d => { d.open = open; OB.ui.open[d.dataset.key] = open; }); },
    rollStat(el) {
      const k = el.dataset.k;
      if (k === 'none') OB.rollAction({ label: 'Action roll (no stat)', statName: 'no stat', statVal: 0 });
      else if (['health', 'spirit', 'supply'].includes(k)) OB.rollAction({ label: 'Action roll +' + k, statKey: k });
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
      OB.addTrack({ kind: 'oath', name, rank: document.getElementById('so-rank').value });
      OB.rollMove('Swear an Oath', 'presence');
    },
    castSpell(el) { OB.castSpell(el.dataset.scope); },
    adds(el) { if (el.dataset.set != null) OB.ui.add = +el.dataset.set; else OB.ui.add = OB.clamp(OB.ui.add + (+el.dataset.d), -5, 9); OB.renderDice(); },
    rollDieLog() { OB.rollDie(6); },
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
      else if (x.type === 'table') { OB.save(); OB.rollTableData(x.move); return; }
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

    /* journal */
    addEntry() { const c = OB.char(); c.journal.unshift({ id: OB.uid('j'), date: new Date().toLocaleDateString(), title: '', text: '', pinned: false }); OB.save(); OB.refresh(); },
    delEntry(el) { const c = OB.char(); OB.confirm('Delete this entry?', 'Delete', () => { c.journal = c.journal.filter(j => j.id !== cid(el)); OB.save(); OB.refresh(); }); },
    pinEntry(el) { const j = OB.char().journal.find(x => x.id === cid(el)); if (!j) return; j.pinned = !j.pinned; OB.save(); OB.refresh(); },

    /* campaigns & files */
    selectChar(el) { OB.store.data.active = el.dataset.id; OB.saveNow(); setMenu(false); OB.refresh(); },
    newChar() {
      const d = OB.store.data; const c = OB.newChar(); c.campaignName = 'New Campaign'; d.chars.push(c); d.active = c.id;
      OB.ui.tab = 'character'; OB.saveNow(); setMenu(false); OB.refresh(); OB.toast('New campaign created.');
    },
    delChar(el) {
      const d = OB.store.data; const target = el.dataset.id ? d.chars.find(x => x.id === el.dataset.id) : OB.char();
      if (!target) return;
      OB.confirm(`Delete “${target.campaignName || target.name || 'this campaign'}”? Export first if you want a backup. This cannot be undone.`, 'Delete', () => {
        d.chars = d.chars.filter(x => x.id !== target.id);
        if (!d.chars.length) d.chars.push(OB.newChar());
        if (!d.chars.some(x => x.id === d.active)) d.active = d.chars[0].id;
        OB.saveNow(); OB.refresh();
      });
    },
    dupChar() { const d = OB.store.data; const c = JSON.parse(JSON.stringify(OB.char())); c.id = OB.uid('c'); c.name = (c.name || 'Unnamed') + ' (copy)'; c.campaignName = (c.campaignName || 'New Campaign') + ' (copy)'; d.chars.push(c); d.active = c.id; OB.saveNow(); OB.refresh(); },
    exportOne() { setMenu(false); OB.exportData(false); },
    exportAll() { setMenu(false); OB.exportData(true); },
    exportJournal() {
      const c = OB.char(); setMenu(false);
      const lines = [`# ${c.campaignName || 'Campaign'}`, '', `Character: ${c.name || 'Unnamed'}`, ''];
      c.journal.forEach(j => { lines.push(`## ${j.title || 'Untitled'}${j.date ? ' — ' + j.date : ''}`, '', j.text || '', ''); });
      const blob = new Blob([lines.join('\n')], { type: 'text/markdown' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
      a.download = 'oathbound-journal-' + (OB.slug(c.campaignName || c.name) || 'campaign') + '.md';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      OB.toast('Journal exported.');
    },
    importFile() { setMenu(false); $('#file-in').click(); },
    rulebooks() {
      setMenu(false);
      OB.modal({
        title: 'Rulebook PDFs', ok: false,
        html: `<p class="muted">The system in PDF, straight from this site. Click to open or download.</p>` +
          OB.rulebookLinks().replace(/class="btn sm"/g, 'class="btn"') +
          '<ul class="plain">' + OB.RULEBOOKS.map(r => `<li><strong>${E(r.title)}</strong> — ${E(r.note)}</li>`).join('') + '</ul>'
      });
    },
    printSheet() { setMenu(false); OB.ui.tab = 'character'; OB.refresh(); setTimeout(() => window.print(), 60); }
  };

  /* ---------- palette (Ctrl/Cmd+K or /) ---------- */
  OB.palette = function () {
    const items = [];
    TABS.forEach(t => items.push({ k: 'Go to', n: t[1] || OB.char().name || 'Character', run: () => A.gotoTab({ dataset: { tab: t[0] } }) }));
    OB.MOVES.forEach(m => items.push({ k: 'Move', n: m.name, h: OB.cap(m.cat), run: () => A.gotoMove({ dataset: { move: m.name } }) }));
    Object.keys(OB.ORACLES).forEach(k => items.push({ k: 'Oracle', n: OB.ORACLES[k].title, h: 'roll', run: () => OB.rollOracle(k) }));
    OB.ODDS.forEach(o => items.push({ k: 'Oracle', n: 'Ask the Oracle — ' + o.name, h: o.min + '+', run: () => OB.rollAsk(o.key) }));
    OB.FOES.forEach(g => g.list.forEach(f => items.push({ k: 'Foe', n: f[0], h: f[1] + ' · add to Fights', run: () => OB.addFoe(f[0], f[1]) })));
    [['New vow', () => trackModal('oath')], ['New journey', () => trackModal('journey')], ['Add bond', () => bondModal()],
      ['Add asset', () => assetModal()], ['Roll d100', () => A.rollD100()], ['Export campaign JSON', () => OB.exportData(false)], ['Load campaign JSON', () => $('#file-in').click()],
      ['New campaign', () => A.newChar()], ['Dice style (3D)', () => OB.dice3d.openSettings()], ['Open journal', () => OB.openDrawer('journal')]].forEach(x => items.push({ k: 'Action', n: x[0], run: x[1] }));
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

  /* ---------- theme ---------- */
  OB.THEMES = [['frost', 'Steel'], ['gold', 'Gold'], ['ember', 'Ember'], ['verdant', 'Verdant'], ['arcane', 'Arcane']];
  OB.applyTheme = function () {
    let t = 'frost'; try { t = localStorage.getItem('oathbound.theme') || 'frost'; } catch (e) { /* storage blocked */ }
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
      const S = 360, cv = document.createElement('canvas'); cv.width = cv.height = S;
      const side = Math.min(img.width, img.height);
      cv.getContext('2d').drawImage(img, (img.width - side) / 2, Math.max(0, (img.height - side) / 4), side, side, 0, 0, S, S);
      URL.revokeObjectURL(url);
      OB.char().portrait = cv.toDataURL('image/jpeg', 0.82);
      OB.save(); OB.refresh(); OB.toast('Portrait set.');
    };
    img.onerror = () => OB.toast('Could not read that image.');
    img.src = url;
  }

  /* ---------- events ---------- */
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-act]');
    if (!el || el.disabled) return;
    const fn = A[el.dataset.act];
    if (!fn) return;
    if (el.closest('summary')) e.preventDefault();          // buttons inside a header do not toggle it
    if (el.tagName === 'A') e.preventDefault();
    fn(el, e);
  });

  function setBind(el) {
    const c = OB.char();
    const r = OB.resolve(c, el.dataset.bind);
    if (!r) return;
    let v = el.value;
    if (el.dataset.type === 'bool') v = el.checked;
    else if (el.dataset.type === 'num') v = parseInt(v, 10) || 0;
    r.obj[r.key] = v;
    const hook = el.dataset.hook; if (hook && OB.hooks[hook]) OB.hooks[hook]();
    if (/^deb\./.test(el.dataset.bind)) OB.hooks.deb();
    OB.save();
  }

  document.addEventListener('input', e => {
    const el = e.target;
    if (el.matches('#move-search')) { OB.ui.moveFilter = el.value; OB.refresh(); return; }
    if (el.matches('#oracle-search')) { OB.ui.oracleFilter = el.value; OB.refresh(); return; }
    if (el.matches('#foe-search')) { OB.ui.foeFilter = el.value; OB.refresh(); return; }
    if (el.matches('#journal-search')) { OB.ui.journalQ = el.value; OB.refresh(); return; }
    if (!el.dataset.bind) return;
    if (el.tagName === 'SELECT' || el.type === 'checkbox' || el.type === 'number') return;
    setBind(el);
    if (el.dataset.bind === 'name' || el.dataset.bind === 'campaignName') renderTabs();
  });

  document.addEventListener('change', e => {
    const el = e.target;
    if (el.id === 'file-in') { readFile(el.files[0]); el.value = ''; return; }
    if (el.id === 'portrait-in') { readPortrait(el.files[0]); el.value = ''; return; }
    if (el.dataset.actChange === 'pickTruth') {
      const c = OB.char(); c.truths = c.truths || {}; const st = c.truths[el.dataset.key] = c.truths[el.dataset.key] || {};
      if (el.value === '') delete st.pick; else st.pick = +el.value;
      OB.save(); OB.refresh(); return;
    }
    if (el.dataset.actChange === 'setRegion') { OB.char().region = el.value; OB.save(); OB.refresh(); return; }
    if (!el.dataset.bind) return;
    setBind(el);
    OB.refresh();
  });

  document.addEventListener('toggle', e => {
    const el = e.target;
    if (!el.dataset || !el.dataset.key) return;
    OB.ui.open[el.dataset.key] = el.open;
    if (el.classList.contains('dsec')) {
      const b = el.querySelector('.dsec-b'), k = el.dataset.key.slice(5);
      if (el.open && b && !b.firstElementChild) b.innerHTML = ({ oracles: OB.drawerOracles, moves: OB.drawerMoves, journal: OB.drawerJournal })[k]();
      $('#drawer-body')._h = null;
    }
    if (el.classList.contains('oracle') && el.open && !el.querySelector('.otable')) {
      el.querySelector('.acc-body').insertAdjacentHTML('beforeend', OB.oracleTable(el.dataset.key.slice(7)));
    }
  }, true);

  document.addEventListener('keydown', e => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test((document.activeElement || {}).tagName || '');
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); OB.palette(); }
    else if (e.key === '/' && !typing && !document.getElementById('modal')) { e.preventDefault(); OB.palette(); }
    else if (e.key === 'Escape') {
      if (document.getElementById('modal')) return;
      if (OB.ui.menu) setMenu(false);
      else if (!WIDE() && OB.ui.drawer) { OB.ui.drawer = false; OB.refresh(); }
    }
  });

  function readFile(file) {
    if (!file) return;
    const rd = new FileReader();
    rd.onload = () => {
      let obj;
      try { obj = JSON.parse(rd.result); } catch (err) { OB.toast('That file is not valid JSON.'); return; }
      const list = obj && obj.kind === 'roster' ? obj.characters : obj && obj.kind === 'character' ? [obj.character] : [obj];
      const clash = (list || []).some(x => x && OB.store.data.chars.some(y => y.id === x.id));
      const go = replace => {
        try {
          const r = OB.importPayload(obj, replace);
          OB.ui.tab = 'character'; OB.refresh();
          OB.toast(`Imported ${r.added + r.replaced} campaign${r.added + r.replaced === 1 ? '' : 's'}.`);
        } catch (er) { OB.toast(er.message); }
      };
      if (clash) OB.modal({ title: 'Campaign already here', html: '<p>A campaign with the same ID is already saved in this browser. Replace it with the file, or import the file as a copy?</p>', ok: 'Replace it', cancel: 'Import as copy', onOk: () => go(true), onCancel: () => go(false) });
      else go(false);
    };
    rd.readAsText(file);
  }

  /* drag & drop a .json file anywhere */
  window.addEventListener('dragover', e => e.preventDefault());
  window.addEventListener('drop', e => { e.preventDefault(); const f = e.dataTransfer && e.dataTransfer.files[0]; if (f && /json$/i.test(f.name)) readFile(f); });

  /* ---------- boot ---------- */
  OB.boot = function () {
    OB.load();
    OB.applyTheme();
    $('#app').innerHTML = `
      <div class="app">
        <header class="topbar">
          <button type="button" class="ib" data-act="menu" aria-label="Campaigns and data" title="Campaigns and data">${OB.icon('menu')}</button>
          <div class="ttl"><span class="brand">OATHBOUND</span><span class="bar" aria-hidden="true"></span><span class="sub">Waystone</span></div>
          <div class="tr">
            <button type="button" class="ib" data-act="toggleDice" title="Dice and roll log" aria-label="Dice">${OB.icon('dice')}</button>
            <button type="button" class="ib" data-act="openDsec" data-s="journal" title="Journal" aria-label="Journal">${OB.icon('listEdit')}</button>
          </div>
        </header>
        <nav id="tabs" class="tabs" role="tablist" aria-label="Sections"></nav>
        <div class="stage">
          <main id="view" class="view" tabindex="-1"></main>
          <aside id="drawer" class="drawer" aria-label="Dice, oracles, moves and journal">
            <div class="drawer-top"><span>Tools</span><button type="button" class="ib" data-act="toggleDrawer" aria-label="Close tools">${OB.icon('close')}</button></div>
            <div id="drawer-body" class="drawer-body"></div>
          </aside>
        </div>
        <div id="dicepanel" class="dicepanel" aria-label="Dice and roll log"><button type="button" class="ib dp-x" data-act="toggleDice" aria-label="Close dice">${OB.icon('close')}</button><div id="dice" class="dice"></div></div>
        <button type="button" id="drawer-fab" class="fab" data-act="toggleDrawer" aria-label="Show or hide tools"></button>
        <div id="menu" class="menu" aria-hidden="false">
          <div class="scrim" data-act="closeMenu"></div>
          <aside id="menu-body" class="menu-panel" aria-label="Campaigns and data"></aside>
        </div>
      </div>
      <input type="file" id="file-in" accept=".json,application/json" hidden>
      <input type="file" id="portrait-in" accept="image/*" hidden>`;
    OB.ui.drawer = WIDE();
    OB.refresh();
    window.addEventListener('beforeunload', OB.saveNow);
  };
  /* ---------- PWA: install button + offline service worker ---------- */
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault(); OB.installEvt = e; OB.canInstall = true;
    if (OB.ui && OB.ui.menu) OB.refresh();
  });
  window.addEventListener('appinstalled', () => { OB.installEvt = null; OB.canInstall = false; OB.toast && OB.toast('App installed.'); });
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    const hadSW = !!navigator.serviceWorker.controller;
    let reloaded = false;
    // a new version took over: reload once so the user gets the new files
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!hadSW || reloaded) return;
      reloaded = true; OB.saveNow && OB.saveNow(); location.reload();
    });
    window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).then(r => r.update()).catch(() => {}); });
  }
  document.addEventListener('DOMContentLoaded', OB.boot);
})(window.OB);
