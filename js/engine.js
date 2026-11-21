/* ==========================================================================
   OATHBOUND — engine: dice, moves, effects, tracks, assets, tiers
   ========================================================================== */
(function (OB) {
  'use strict';
  const { clamp, rint, uid } = OB;

  OB.ui = {
    tab: 'character', drawer: true, menu: false, dsec: {}, hex: null, journalQ: '', add: 0, open: {}, moveFilter: '', moveCat: 'all',
    oracleFilter: '', oracleGroup: 'all', diceOpen: false, hudOpen: true,
    nameHeritage: '', foeFilter: '', creationOpen: true
  };

  const HIT = { 0: 'miss', 1: 'weak', 2: 'strong' };
  OB.hitName = h => HIT[h];

  /* ---------- d100 as two d10 ---------- */
  OB.d100 = function () {
    const t = rint(10) - 1, u = rint(10) - 1;
    const v = t * 10 + u;
    return { v: v === 0 ? 100 : v, match: t === u };
  };
  OB.lookup = (rows, v) => (rows.find(r => v <= r[0]) || rows[rows.length - 1])[1];

  /* ---------- log ---------- */
  OB.logPush = function (entry) {
    const c = OB.char();
    entry.id = uid('r'); entry.ts = Date.now();
    c.log.unshift(entry);
    if (c.log.length > 80) c.log.length = 80;
    OB.save();
    if (entry.kind !== 'note') OB.ui.dicePanel = true;
    OB.refresh && OB.refresh();
    OB.flashLog && OB.flashLog();
    return entry;
  };
  OB.logNote = (text, extras) => OB.logPush({ kind: 'note', text, extras: extras || [] });

  /* ---------- hit calculation ---------- */
  const level = (score, c1, c2, mom) => {
    const b = d => (score > d || (mom != null && mom > d)) ? 1 : 0;
    return b(c1) + b(c2);
  };

  /* ---------- action roll ---------- */
  OB.rollAction = function (o) {
    const c = OB.char();
    const statVal = o.statVal != null ? o.statVal : (o.statKey ? OB.statValue(c, o.statKey) : 0);
    const add = (o.add != null ? o.add : OB.ui.add) || 0;
    if (o.add == null) OB.ui.add = 0;
    const d6 = rint(6), c1 = rint(10), c2 = rint(10);
    const mom = c.momentum;
    const cancelled = mom < 0 && Math.abs(mom) === d6;
    const die = cancelled ? 0 : d6;
    const score = Math.min(10, die + statVal + add);
    const e = {
      kind: 'action', label: o.label, move: o.move || null,
      statName: o.statName || (o.statKey ? OB.statLabel(c, o.statKey) : ''),
      statVal, add, d6, c1, c2, mom, cancelled, score, match: c1 === c2,
      extras: o.extras || [], note: o.note || null, harm: o.harm || null, trackId: o.trackId || null
    };
    e.hit = level(score, c1, c2, null);
    if (mom > 0 && !o.noBurn) {
      const bh = level(score, c1, c2, mom);
      if (bh > e.hit) e.burn = { hit: bh, reset: OB.momentumReset(c), mom };
    }
    return OB.logPush(e);
  };

  OB.burn = function (id) {
    const c = OB.char();
    const e = c.log.find(x => x.id === id);
    if (!e || !e.burn) return;
    e.burnedFrom = e.hit;
    e.hit = e.burn.hit;
    e.burned = true;
    c.momentum = clamp(e.burn.reset, -6, OB.maxMomentum(c));
    delete e.burn;
    OB.save(); OB.toast('Momentum burned. It is now ' + OB.sgn(c.momentum) + '.');
    OB.refresh();
  };

  /* ---------- progress roll ---------- */
  OB.rollProgress = function (trackId, moveName) {
    const c = OB.char();
    let score, name, rank = null;
    if (trackId === 'bonds') { score = Math.min(10, Math.floor(c.bonds.length / 4)); name = 'Bonds'; }
    else {
      const t = c.tracks.find(x => x.id === trackId);
      if (!t) return;
      score = Math.min(10, OB.boxes(t)); name = t.name; rank = t.rank;
    }
    const c1 = rint(10), c2 = rint(10);
    const e = {
      kind: 'progress', label: (moveName || 'Progress roll') + ' — ' + name, move: moveName || null,
      score, c1, c2, match: c1 === c2, hit: level(score, c1, c2, null), trackId, rank, extras: []
    };
    return OB.logPush(e);
  };

  /* ---------- move rolls ---------- */
  OB.statChoiceLabel = (c, key) => OB.statLabel(c, key);

  OB.rollMove = function (moveName, statKey, extra) {
    const c = OB.char();
    const m = OB.MOVE[moveName];
    extra = extra || {};
    let label = moveName;
    if (statKey) label += ' +' + OB.statLabel(c, statKey).toLowerCase();
    const o = Object.assign({ label, move: moveName, statKey }, extra);
    if (m && m.harm) o.harm = true;
    return OB.rollAction(o);
  };

  // Strike/Clash harm helper (computed when the card is drawn)
  OB.harmFor = function (e, weapon, bonus) {
    if (!e || !e.harm || e.hit === 0) return 0;
    let h = weapon + (bonus || 0);
    if (e.move === 'Strike' && e.hit === 2) h += 1;
    return h;
  };

  /* ---------- effects ---------- */
  const BLOCK = { health: 'wounded', spirit: 'shaken', supply: 'unprepared' };
  OB.applyEffects = function (fx) {
    const c = OB.char();
    const msgs = [];
    ['health', 'spirit', 'supply', 'focus', 'momentum'].forEach(k => {
      let d = fx[k];
      if (!d) return;
      if (d > 0 && BLOCK[k] && c.deb[BLOCK[k]]) { msgs.push(`Cannot raise ${k}: ${BLOCK[k]}.`); return; }
      const cur = c[k];
      if (k === 'momentum') {
        const next = cur + d;
        if (next < -6) msgs.push('Momentum is at its minimum: Face a Setback.');
        c.momentum = clamp(next, -6, OB.maxMomentum(c));
      } else if (k === 'focus') {
        const next = cur + d;
        if (next < 0) msgs.push(`You lack ${-next} focus: Overreach.`);
        c.focus = clamp(next, 0, OB.maxFocus(c));
      } else {
        const next = cur + d;
        c[k] = clamp(next, 0, 5);
        if (k === 'supply' && c.supply === 0 && cur > 0 && !c.deb.unprepared) { c.deb.unprepared = true; msgs.push('Supply is 0: unprepared marked (Out of Supply).'); }
        else if (k === 'supply' && next < 0 && c.deb.unprepared) msgs.push('Out of Supply: exchange each extra -supply for -health, -spirit, or -momentum.');
      }
    });
    c.momentum = clamp(c.momentum, -6, OB.maxMomentum(c));
    OB.save();
    msgs.forEach(m => OB.toast(m));
    return msgs;
  };

  // one effect button (from move fx / extras)
  OB.fxLabel = function (fx) {
    if (fx.label) return fx.label;
    return ['momentum', 'health', 'spirit', 'supply', 'focus'].filter(k => fx[k]).map(k => OB.sgn(fx[k]) + ' ' + k).join(', ');
  };

  OB.markDeb = function (key, on) {
    const c = OB.char();
    c.deb[key] = on !== false;
    if (!c.deb[key]) delete c.deb[key];
    c.momentum = clamp(c.momentum, -6, OB.maxMomentum(c));
    OB.save();
  };

  /* ---------- Endure Harm / Stress ---------- */
  OB.endure = function (kind, amount) {
    const c = OB.char();
    amount = Math.max(0, parseInt(amount, 10) || 0);
    const tk = kind === 'harm' ? 'health' : 'spirit';
    const loss = Math.min(c[tk], amount), over = amount - loss;
    const fx = {}; fx[tk] = -loss; if (over > 0) fx.momentum = -over;
    OB.applyEffects(fx);
    const other = kind === 'harm' ? 'strength' : 'presence';
    const v1 = c[tk], v2 = c.stats[other];
    const useTrack = v1 >= v2;
    const moveName = kind === 'harm' ? 'Endure Harm' : 'Endure Stress';
    const e = OB.rollAction({
      label: `${moveName} (-${amount} ${tk})`, move: moveName,
      statKey: useTrack ? tk : other,
      statName: OB.cap(useTrack ? tk : other) + ' (higher of ' + tk + ' / ' + other + ')',
      statVal: useTrack ? v1 : v2
    });
    const ex = [];
    if (e.hit === 0) {
      ex.push({ type: 'fx', fx: { momentum: -1 }, label: 'Miss: suffer -1 momentum' });
      if (c[tk] === 0) {
        if (kind === 'harm') { ex.push({ type: 'deb', key: 'wounded' }, { type: 'deb', key: 'maimed' }); }
        else { ex.push({ type: 'deb', key: 'shaken' }, { type: 'deb', key: 'corrupted' }); }
        ex.push({ type: 'table', move: moveName });
      }
    }
    e.extras = ex; e.overflow = over;
    OB.save(); OB.refresh();
  };

  OB.companionEndure = function (assetId, amount) {
    const c = OB.char();
    const a = c.assets.find(x => x.id === assetId);
    if (!a) return;
    amount = Math.max(0, parseInt(amount, 10) || 0);
    const loss = Math.min(a.health || 0, amount), over = amount - loss;
    a.health = (a.health || 0) - loss;
    if (over > 0) OB.applyEffects({ momentum: -over });
    const v1 = c.stats.presence, v2 = a.health || 0;
    const e = OB.rollAction({
      label: `Companion Endure Harm — ${a.name || 'companion'} (-${amount})`, move: 'Companion Endure Harm',
      statName: v1 >= v2 ? 'Presence' : 'Companion health', statVal: Math.max(v1, v2)
    });
    e.extras = [];
    if (e.hit === 2) e.extras.push({ type: 'companion', id: assetId, delta: 1, label: 'Companion rallies: +1 health' });
    if (e.hit === 0) e.extras.push({ type: 'fx', fx: { momentum: -1 }, label: 'Miss: suffer -1 momentum' });
    OB.save(); OB.refresh();
  };

  /* ---------- casting ---------- */
  OB.castSpell = function (scopeKey) {
    const c = OB.char();
    const sc = OB.SCOPES.find(s => s.key === scopeKey) || OB.SCOPES[0];
    const lack = Math.max(0, sc.cost - c.focus);
    if (sc.cost > 0) {
      const spend = Math.min(sc.cost, c.focus);
      c.focus -= spend;
    }
    OB.save();
    const e = OB.rollMove('Cast a Spell', 'casting', { label: `Cast a Spell (${sc.name}, ${sc.cost} focus) +${OB.statLabel(c, 'casting').toLowerCase()}` });
    if (lack > 0) {
      e.extras = [{ type: 'overreach', lack, track: 'health', label: `Overreach: -${lack} health & roll` }, { type: 'overreach', lack, track: 'spirit', label: `Overreach: -${lack} spirit & roll` }];
      OB.toast(`You lack ${lack} focus. Overreach.`);
    }
    OB.refresh();
  };

  OB.overreach = function (lack, track) {
    const fx = {}; fx[track] = -lack;
    OB.applyEffects(fx);
    OB.rollMove('Overreach', 'casting');
  };

  /* ---------- oracles ---------- */
  const isTwice = t => /^Roll twice/i.test(t);
  const isAgain = t => /^Roll again/i.test(t);

  // roll one table; returns {title, roll, text, match, more:[{roll,text}]}
  function rollTable(key, depth) {
    const t = OB.ORACLES[key];
    depth = depth || 0;
    if (t.pair) {
      const r1 = OB.d100(), r2 = OB.d100();
      const a = OB.lookup(t.a, r1.v), b = OB.lookup(t.b, r2.v);
      return { key, title: t.title, roll: r1.v + ' / ' + r2.v, text: a + (t.join || '') + b, match: false, more: [] };
    }
    const r = OB.d100();
    const text = OB.lookup(t.rows, r.v);
    const part = { key, title: t.title, roll: r.v, text, match: r.match, more: [] };
    if (depth < 2 && (isTwice(text) || (key === 'price' && isAgain(text)))) {
      const n = isTwice(text) ? 2 : 1;
      for (let i = 0; i < n; i++) {
        const sub = rollTable(key, depth + 1);
        part.more.push(sub);
      }
    }
    return part;
  }
  OB.rollOracle = function (keys, title) {
    const parts = (Array.isArray(keys) ? keys : [keys]).map(k => rollTable(k, 0));
    return OB.logPush({ kind: 'oracle', label: title || parts[0].title, parts });
  };

  OB.rollAsk = function (oddsKey) {
    const o = OB.ODDS.find(x => x.key === oddsKey);
    const r = OB.d100();
    return OB.logPush({ kind: 'ask', label: 'Ask the Oracle — ' + o.name, odds: o.name, min: o.min, roll: r.v, yes: r.v >= o.min, match: r.match });
  };

  OB.rollTableData = function (move) {
    const m = OB.MOVE[move];
    const r = OB.d100();
    return OB.logPush({ kind: 'oracle', label: m.tableName, parts: [{ title: m.tableName, roll: r.v, text: OB.lookup(m.table, r.v), match: r.match, more: [] }] });
  };

  OB.rollDie = function (n) {
    const v = rint(n);
    return OB.logPush({ kind: 'die', label: 'd' + n, sides: n, value: v });
  };

  /* ---------- tracks ---------- */
  OB.addTrack = function (o) {
    const c = OB.char();
    const t = { id: uid('t'), kind: o.kind || 'other', name: o.name || '', rank: o.rank || 'dangerous', ticks: 0, done: false, notes: '', bg: !!o.bg };
    c.tracks.push(t);
    OB.save();
    return t;
  };
  const track = id => OB.char().tracks.find(t => t.id === id);
  OB.markTrack = function (id, times) {
    const t = track(id); if (!t) return;
    t.ticks = clamp(t.ticks + OB.RANK[t.rank].ticks * (times || 1), 0, 40);
    OB.save();
  };
  OB.unmarkTrack = function (id, times) {
    const t = track(id); if (!t) return;
    t.ticks = clamp(t.ticks - OB.RANK[t.rank].ticks * (times || 1), 0, 40);
    OB.save();
  };
  OB.tickTrack = function (id, d) { const t = track(id); if (!t) return; t.ticks = clamp(t.ticks + d, 0, 40); OB.save(); };
  OB.removeTrack = function (id) { const c = OB.char(); c.tracks = c.tracks.filter(t => t.id !== id); OB.save(); };
  OB.completeTrack = function (id, hit) {
    const c = OB.char(); const t = track(id); if (!t) return;
    t.done = true;
    if (t.kind === 'oath' && hit) {
      const xp = OB.OATH_XP[t.rank][hit === 2 ? 0 : 1];
      c.xpEarned += xp;
      OB.toast(`Oath fulfilled. +${xp} experience.`);
    }
    OB.save();
  };
  OB.forsakeOath = function (id) {
    const c = OB.char(); const t = track(id); if (!t) return;
    const n = OB.RANK[t.rank].suffer;
    c.tracks = c.tracks.filter(x => x.id !== id);
    if (c.heritage === 'Human') { OB.applyEffects({ spirit: 1 }); OB.toast('Stubborn Hope: +1 spirit.'); }
    OB.save();
    OB.endure('stress', n);
  };

  /* ---------- bonds ---------- */
  OB.addBond = function (name, note) {
    const c = OB.char();
    if (c.bonds.length >= 40) return;
    c.bonds.push({ id: uid('b'), name: name || 'Bond', note: note || '' });
    OB.save();
  };

  /* ---------- XP / tiers ---------- */
  OB.spendXp = function (n) {
    const c = OB.char();
    if (OB.xpAvail(c) < n) { OB.toast('Not enough experience.'); return false; }
    c.xpSpent += n; OB.save(); return true;
  };

  OB.ascend = function (opts) {
    const c = OB.char();
    const next = OB.tierEligible(c);
    if (!next) return false;
    if (opts.picks.includes('stat') && opts.stat) { c.stats[opts.stat] = Math.min(4, c.stats[opts.stat] + 1); c.ascStats++; }
    if (opts.picks.includes('focus')) c.focusBonus = Math.min(6, c.focusBonus + 1);
    if (opts.picks.includes('blood')) c.legacyAwakened = true;
    if (opts.picks.includes('path') && opts.pathCls && opts.path) {
      c.extraPaths.push({ cls: opts.pathCls, path: opts.path });
      OB.addPathCard(opts.pathCls, opts.path, 0, true);
    }
    c.tier = next;
    c.ascended = (c.ascended || []).concat([{ tier: next, picks: opts.picks, at: Date.now() }]);
    OB.save();
    OB.logNote(`Ascended to tier ${next} (${OB.TIERS[next - 1].title}): ` + opts.picks.map(p => ({ stat: 'Hone your gifts', focus: 'Deepen your power', blood: 'Awaken your blood', craft: 'Master your craft', path: 'Walk a new path' }[p])).join(' + ') + '.');
    return true;
  };

  /* ---------- assets ---------- */
  OB.addAsset = function (a) {
    const c = OB.char();
    const asset = Object.assign({ id: uid('a'), type: 'talent', name: '', sub: '', tier: 1, text: '', abilities: [{ text: '', on: true }, { text: '', on: false }, { text: '', on: false }], health: 4, maxHealth: 4, auto: false }, a);
    c.assets.push(asset);
    OB.save();
    return asset;
  };

  OB.addPathCard = function (cls, path, idx, free) {
    const info = OB.CLASS_INFO[cls];
    if (!info) return null;
    const cards = OB.PATH_CARDS[path];
    const tierName = OB.PATH_TIERS[idx];
    let proto;
    if (cards && cards[idx] && cards[idx].name) {
      const k = cards[idx];
      proto = { type: 'path', name: k.name, sub: `${path} · ${tierName}${k.spell ? ' · Spell' : ''}`, tier: idx + 1, abilities: k.abilities.map((t, i) => ({ text: t, on: i === 0 })) };
    } else {
      const nm = idx === 0 ? (info.foundations[path] || tierName) : '';
      proto = { type: 'path', name: nm, sub: `${path} · ${tierName}`, tier: idx + 1, text: info.paths[path] && idx === 0 ? info.paths[path] : '', abilities: [{ text: '', on: true }, { text: '', on: false }, { text: '', on: false }] };
    }
    proto.path = path; proto.cls = cls; proto.pathIdx = idx;
    return OB.addAsset(proto);
  };

  // set class (and starting path). Replaces auto class/foundation cards.
  OB.applyClass = function (cls, path) {
    const c = OB.char();
    const prev = c.assets.find(a => a.auto && a.type === 'class');
    const oldMax = prev && prev.cls && OB.CLASS[prev.cls] ? OB.clamp(OB.CLASS[prev.cls].focus + c.focusBonus, 0, 6) : 0;
    const hadFull = !prev || c.focus >= oldMax;
    c.assets = c.assets.filter(a => !(a.auto && (a.type === 'class' || (a.type === 'path' && a.pathIdx === 0))));
    c.cls = cls || ''; c.path = path || '';
    if (cls && OB.CLASS_INFO[cls]) {
      const info = OB.CLASS_INFO[cls];
      OB.addAsset({
        type: 'class', cls, name: cls + ' (class card)', sub: `${info.paths ? Object.keys(info.paths).join(' & ') : ''} paths · max focus +${OB.CLASS[cls].focus}`, auto: true, text: info.blurb,
        abilities: info.abilities.map((a, i) => ({ name: a[0], text: a[1], on: i === 0 }))
      });
      c.assets.unshift(c.assets.pop());   // class card first
      if (path) { const pa = OB.addPathCard(cls, path, 0); if (pa) pa.auto = true; }
    }
    c.focus = hadFull ? OB.maxFocus(c) : Math.min(c.focus, OB.maxFocus(c));
    OB.save();
  };

  /* ---------- semi-random character ---------- */
  OB.nameKey = h => 'n_' + String(h || 'human').toLowerCase();
  OB.semiRandom = function () {
    const c = OB.char();
    const best = OB.lookup(OB.SEMI.stat, rint(100));
    const pickRow = needs => { for (;;) { const v = rint(100); const r = OB.SEMI.rows.find(x => v <= x[0]); if (r[needs]) return r; } };
    const row = (() => { const v = rint(100); return OB.SEMI.rows.find(x => v <= x[0]); })();
    const heritage = row[1];
    const upbringing = row[2] || pickRow(2)[2];
    const cls = row[3] || pickRow(3)[3];
    const info = OB.CLASS[cls];
    const path = info.paths[rint(6) <= 3 ? 0 : 1];
    // stats: best = +3, then 2,2,1,1 in the class's suggested order
    const abbr = { Str: 'strength', Agi: 'agility', Fin: 'finesse', Pre: 'presence', Ins: 'insight' };
    const order = info.suggest.split(',').map(s => abbr[s.trim().split(' ')[0]]).filter(k => k !== best);
    const vals = [2, 2, 1, 1];
    OB.STATS.forEach(s => { c.stats[s.key] = 0; });
    c.stats[best] = 3;
    order.forEach((k, i) => { c.stats[k] = vals[i]; });
    c.ascStats = 0;
    c.heritage = heritage; c.legacyFrom = heritage; c.upbringing = upbringing;
    OB.applyClass(cls, path);
    if (!c.name) {
      const nt = OB.ORACLES[OB.nameKey(heritage)];
      if (nt) c.name = OB.lookup(nt.rows, rint(100));
    }
    c.health = c.spirit = c.supply = 5; c.momentum = 2; c.deb = {};
    c.focus = OB.maxFocus(c);
    OB.save();
    OB.logNote(`Semi-random setup: best stat ${OB.cap(best)} (+3). ${heritage}, ${upbringing}, ${cls} (${path}).`);
  };
})(window.OB);
