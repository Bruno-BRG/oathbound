/* ==========================================================================
   OATHBOUND — core: helpers, state, storage, calculations
   ========================================================================== */
(function (OB) {
  'use strict';

  /* ---------- tiny helpers ---------- */
  OB.esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  OB.uid = (p = 'x') => p + Math.random().toString(36).slice(2, 7) + Date.now().toString(36).slice(-4);
  OB.clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  OB.cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
  OB.slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  OB.sgn = n => (n > 0 ? '+' + n : String(n));

  // unbiased random integer 1..n using the browser's crypto source
  OB.rint = function (n) {
    const a = new Uint32Array(1);
    const lim = Math.floor(4294967296 / n) * n;
    let x;
    do { (window.crypto || window.msCrypto).getRandomValues(a); x = a[0]; } while (x >= lim);
    return (x % n) + 1;
  };
  OB.pick = arr => arr[OB.rint(arr.length) - 1];

  /* markup: **bold**  *italic*  [[Move Link]]  "- " bullets */
  OB.md = function (text) {
    const inline = s => OB.esc(s)
      .replace(/\[\[([^\]]+)\]\]/g, (m, n) => `<a href="#" class="mvlink" data-act="gotoMove" data-move="${n}">${n}</a>`)
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>');
    const out = [];
    let list = null;
    String(text || '').split('\n').forEach(line => {
      if (/^- /.test(line)) {
        if (!list) { list = []; }
        list.push(`<li>${inline(line.slice(2))}</li>`);
      } else {
        if (list) { out.push(`<ul>${list.join('')}</ul>`); list = null; }
        if (line.trim()) out.push(`<p>${inline(line)}</p>`);
      }
    });
    if (list) out.push(`<ul>${list.join('')}</ul>`);
    return out.join('');
  };

  /* ---------- character model ---------- */
  OB.newChar = function () {
    return {
      id: OB.uid('c'),
      created: Date.now(),
      name: '', concept: '', pronouns: '', portrait: '', epithet: '',
      campaignName: '', campaignNotes: '', region: 'The Crownlands', factions: [], hexes: {},
      heritage: '', legacyFrom: '', upbringing: '', cls: '', path: '',
      extraPaths: [],            // paths gained by Ascend: [{cls, path}]
      stats: { agility: 0, strength: 0, finesse: 0, presence: 0, insight: 0 },
      ascStats: 0,               // +1 stat boosts taken through Ascend
      health: 5, spirit: 5, supply: 5, focus: 0, momentum: 2,
      focusBonus: 0,             // +max focus from Ascend (max +6 total)
      deb: {},
      tier: 1, xpEarned: 0, xpSpent: 0,
      legacyAwakened: false,
      initiative: false,
      truths: {},                // world truths: {key: {pick, custom}}
      weaponHarm: 2,
      bonds: [],                 // [{id, name, note}]
      tracks: [],                // [{id, kind, name, rank, ticks, done, notes, bg}]
      assets: [],                // [{id, type, name, sub, tier, text, abilities:[{text,on}], health, maxHealth}]
      gear: '', background: '', flaws: '', hopes: '', notes: '',
      journal: [],               // [{id, date, title, text}]
      log: []                    // roll log (newest first)
    };
  };

  OB.normalize = function (c) {
    const base = OB.newChar();
    const out = Object.assign({}, base, c || {});
    out.stats = Object.assign({}, base.stats, (c && c.stats) || {});
    out.deb = Object.assign({}, (c && c.deb) || {});
    ['extraPaths', 'bonds', 'tracks', 'assets', 'journal', 'log', 'factions'].forEach(k => { if (!Array.isArray(out[k])) out[k] = []; });
    if (!out.hexes || typeof out.hexes !== 'object') out.hexes = {};
    out.log.forEach(e => { delete e.hold; });
    out.factions.forEach(f => { f.id = f.id || OB.uid('f'); });
    OB.STATS.forEach(s => { out.stats[s.key] = OB.clamp(parseInt(out.stats[s.key], 10) || 0, 0, 9); });
    ['health', 'spirit', 'supply'].forEach(k => { out[k] = OB.clamp(parseInt(out[k], 10) || 0, 0, 5); });
    out.momentum = OB.clamp(parseInt(out.momentum, 10) || 0, -6, 10);
    out.tier = OB.clamp(parseInt(out.tier, 10) || 1, 1, 4);
    out.xpEarned = Math.max(0, parseInt(out.xpEarned, 10) || 0);
    out.xpSpent = Math.max(0, parseInt(out.xpSpent, 10) || 0);
    out.focusBonus = OB.clamp(parseInt(out.focusBonus, 10) || 0, 0, 6);
    out.tracks.forEach(t => { t.id = t.id || OB.uid('t'); t.ticks = OB.clamp(parseInt(t.ticks, 10) || 0, 0, 40); if (!OB.RANK[t.rank]) t.rank = 'dangerous'; });
    out.assets.forEach(a => { a.id = a.id || OB.uid('a'); if (!Array.isArray(a.abilities)) a.abilities = []; });
    out.bonds.forEach(b => { b.id = b.id || OB.uid('b'); });
    out.journal.forEach(j => { j.id = j.id || OB.uid('j'); });
    out.focus = OB.clamp(parseInt(out.focus, 10) || 0, 0, OB.maxFocus(out));
    return out;
  };

  /* ---------- derived values ---------- */
  OB.maxFocus = c => OB.clamp(((OB.CLASS[c.cls] || {}).focus || 0) + (c.focusBonus || 0), 0, 6);
  OB.debCount = c => OB.DEBILITIES.filter(d => c.deb && c.deb[d.key]).length;
  OB.maxMomentum = c => 10 - OB.debCount(c);
  OB.momentumReset = c => { const n = OB.debCount(c); return n === 0 ? 2 : n === 1 ? 1 : 0; };
  OB.castStat = c => (OB.CLASS[c.cls] || {}).casts || null;
  OB.boxes = t => Math.floor((t.ticks || 0) / 4);
  OB.xpAvail = c => c.xpEarned - c.xpSpent;
  OB.oathDone = (c, ranks) => c.tracks.some(t => t.kind === 'oath' && t.done && ranks.includes(t.rank));

  // next tier the character qualifies for (0 if none)
  OB.tierEligible = function (c) {
    const n = c.tier + 1;
    if (n > 4) return 0;
    if (n === 2 && c.xpEarned >= 10) return 2;
    if (n === 3 && c.xpEarned >= 25 && OB.oathDone(c, ['extreme', 'epic'])) return 3;
    if (n === 4 && c.xpEarned >= 45 && OB.oathDone(c, ['epic'])) return 4;
    return 0;
  };

  OB.statValue = function (c, key) {
    if (key === 'casting') return c.stats[OB.castStat(c) || 'insight'] || 0;
    if (key === 'lowInsStr') return Math.min(c.stats.insight, c.stats.strength);
    if (key === 'supply' || key === 'health' || key === 'spirit') return c[key];
    return c.stats[key] || 0;
  };
  OB.statLabel = function (c, key) {
    if (key === 'casting') { const s = OB.castStat(c); return s ? OB.cap(s) + ' (casting)' : 'Insight (no casting stat)'; }
    if (key === 'lowInsStr') return 'Insight/Strength (lower)';
    return OB.cap(key);
  };

  /* ---------- store (localStorage + JSON import/export) ---------- */
  const KEY = 'oathbound.sheet.v1';
  OB.store = { data: { v: 1, active: null, chars: [] }, storageOK: true, lastSaved: null, lastExport: null };

  OB.char = () => OB.store.data.chars.find(c => c.id === OB.store.data.active) || null;

  OB.load = function () {
    let raw = null;
    try { raw = window.localStorage.getItem(KEY); } catch (e) { OB.store.storageOK = false; }
    if (raw) {
      try {
        const d = JSON.parse(raw);
        OB.store.data = { v: 1, active: d.active, chars: (d.chars || []).map(OB.normalize) };
        OB.store.lastExport = d.lastExport || null;
      } catch (e) { console.warn('Could not read saved data', e); }
    }
    if (!OB.store.data.chars.length) {
      const c = OB.newChar();
      OB.store.data.chars.push(c);
      OB.store.data.active = c.id;
    }
    if (!OB.char()) OB.store.data.active = OB.store.data.chars[0].id;
  };

  let saveTimer = null;
  OB.saveNow = function () {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(Object.assign({}, OB.store.data, { lastExport: OB.store.lastExport })));
      OB.store.lastSaved = Date.now();
      OB.store.storageOK = true;
    } catch (e) { OB.store.storageOK = false; }
    OB.updateSaveBadge && OB.updateSaveBadge();
  };
  OB.save = function () { clearTimeout(saveTimer); saveTimer = setTimeout(OB.saveNow, 250); };

  /* ---------- export / import ---------- */
  OB.exportData = function (all) {
    const c = OB.char();
    const payload = all
      ? { app: 'oathbound-sheet', version: 1, kind: 'roster', exported: new Date().toISOString(), characters: OB.store.data.chars }
      : { app: 'oathbound-sheet', version: 1, kind: 'character', exported: new Date().toISOString(), character: c };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    const nm = all ? 'oathbound-all-characters' : 'oathbound-' + (OB.slug(c.name) || 'character');
    a.href = URL.createObjectURL(blob);
    a.download = nm + '.json';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    OB.store.lastExport = Date.now();
    OB.saveNow();
    OB.toast(all ? 'Exported all characters.' : 'Exported ' + (c.name || 'character') + '.');
  };

  // returns {added, replaced}
  OB.importPayload = function (obj, replaceSame) {
    let list = [];
    if (obj && obj.kind === 'roster' && Array.isArray(obj.characters)) list = obj.characters;
    else if (obj && obj.kind === 'character' && obj.character) list = [obj.character];
    else if (obj && obj.stats && obj.id) list = [obj];       // bare character
    else throw new Error('This file is not an Oathbound character file.');
    let added = 0, replaced = 0, last = null;
    list.forEach(raw => {
      const c = OB.normalize(raw);
      const idx = OB.store.data.chars.findIndex(x => x.id === c.id);
      if (idx >= 0 && replaceSame) { OB.store.data.chars[idx] = c; replaced++; }
      else { if (idx >= 0) c.id = OB.uid('c'); OB.store.data.chars.push(c); added++; }
      last = c;
    });
    if (last) OB.store.data.active = last.id;
    OB.saveNow();
    return { added, replaced };
  };

  /* ---------- path helper for data-bind="a.b#id.c" ---------- */
  OB.resolve = function (root, path) {
    const parts = path.split('.');
    let obj = root;
    for (let i = 0; i < parts.length - 1; i++) {
      const p = parts[i];
      const h = p.indexOf('#');
      if (h >= 0) { const arr = obj[p.slice(0, h)]; obj = arr.find(x => x.id === p.slice(h + 1)); }
      else obj = obj[p];
      if (obj == null) return null;
    }
    return { obj, key: parts[parts.length - 1] };
  };
})(window.OB);
