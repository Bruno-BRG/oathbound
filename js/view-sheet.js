/* ==========================================================================
   OATHBOUND — Sheet tab
   ========================================================================== */
(function (OB) {
  'use strict';
  const E = OB.esc, F = OB.f;

  OB.hooks = {
    heritage() { /* nothing extra */ },
    class() {
      const c = OB.char();
      const info = OB.CLASS[c.cls];
      if (!info || !info.paths.includes(c.path)) c.path = '';
      OB.applyClass(c.cls, c.path);
    },
    path() { const c = OB.char(); OB.applyClass(c.cls, c.path); },
    deb() {
      const c = OB.char();
      Object.keys(c.deb).forEach(k => { if (!c.deb[k]) delete c.deb[k]; });
      c.momentum = OB.clamp(c.momentum, -6, OB.maxMomentum(c));
    }
  };

  const legacyKey = c => c.legacyFrom || c.heritage;

  /* ---------- identity ---------- */
  function identity(c) {
    const cls = OB.CLASS[c.cls];
    const paths = cls ? cls.paths : [];
    const tier = OB.TIERS[c.tier - 1];
    return `<article class="card identity">
      ${OB.sectionHead('Oathbound', `<span class="pill tier">Tier ${c.tier} · ${tier.title}</span>`)}
      <label class="lbl">Name${F.text('name', c.name, { ph: 'Who are you?', cls: 'big-input', label: 'Character name' })}</label>
      <label class="lbl">Concept — history, hopes, flaws${F.text('concept', c.concept, { ph: 'A wandering knight who lost her company…' })}</label>
      <div class="two">
        <label class="lbl">Heritage${F.sel('heritage', c.heritage, OB.HERITAGES.map(h => h.key), { hook: 'heritage' })}</label>
        <label class="lbl">Legacy from <small>(mixed heritage)</small>${F.sel('legacyFrom', c.legacyFrom, OB.HERITAGES.map(h => h.key), { blank: '— same as heritage —', hook: 'heritage' })}</label>
        <label class="lbl">Upbringing${F.sel('upbringing', c.upbringing, OB.UPBRINGINGS.map(u => u.key))}</label>
        <label class="lbl">Class${F.sel('cls', c.cls, OB.CLASSES.map(x => x.key), { hook: 'class' })}</label>
      </div>
      <label class="lbl">Path${F.sel('path', c.path, paths, { hook: 'path', blank: cls ? '— choose a path —' : 'Choose a class first' })}</label>
      ${c.extraPaths.length ? `<p class="muted small">Other paths walked: ${c.extraPaths.map(p => `${E(p.path)} (${E(p.cls)})`).join(', ')}</p>` : ''}
    </article>`;
  }

  /* ---------- abilities ---------- */
  function abilities(c) {
    const h = OB.HERITAGE[c.heritage], l = OB.HERITAGE[legacyKey(c)], u = OB.UPBRINGING[c.upbringing];
    const ci = OB.CLASS[c.cls], info = OB.CLASS_INFO[c.cls];
    const cast = OB.castStat(c);
    const row = (kind, name, text, extra) => `<div class="abil"><div class="abil-k">${kind}</div><div><strong>${E(name)}.</strong> ${E(text)}${extra || ''}</div></div>`;
    return `<article class="card abilities">
      ${OB.sectionHead('Abilities')}
      ${h ? row('Heritage — ' + h.key, h.ability[0], h.ability[1]) : '<p class="muted">Choose a heritage.</p>'}
      ${l ? `<div class="abil legacy ${c.legacyAwakened ? 'on' : ''}"><div class="abil-k">Legacy — ${E(l.key)}</div><div><strong>${E(l.legacy[0])}.</strong> ${E(l.legacy[1])}
         <div class="legacy-toggle">${F.chk('legacyAwakened', c.legacyAwakened, 'Awakened (gained through Ascend)')}</div></div></div>` : ''}
      ${u ? row('Upbringing — ' + u.key, u.ability[0], u.ability[1]) : '<p class="muted">Choose an upbringing.</p>'}
      ${ci ? `<div class="abil"><div class="abil-k">Class — ${E(c.cls)}</div><div>Max focus <strong>+${OB.maxFocus(c)}</strong> · Casts with <strong>${cast ? OB.cap(cast) : 'no casting stat'}</strong> ${cast ? '' : '<small class="muted">(Center Yourself and Overreach use insight)</small>'}
        <p class="muted small">${E(info ? info.blurb : '')}</p>
        <div class="row gap">
          <button class="btn small" data-act="oathSeed">Roll an oath seed</button>
          <button class="btn small ghost" data-act="classQuestions">Background questions</button>
        </div></div></div>` : ''}
    </article>`;
  }

  /* ---------- stats ---------- */
  function stats(c) {
    const sum = OB.STATS.reduce((a, s) => a + c.stats[s.key], 0);
    const ok = sum - c.ascStats === 9 && [...OB.STATS.map(s => c.stats[s.key])].sort().join() !== '';
    return `<article class="card stats">
      ${OB.sectionHead('Stats', `<span class="pill ${ok ? 'good' : ''}" title="At creation arrange +3, +2, +2, +1, +1">Σ ${sum}${c.ascStats ? ` (+${c.ascStats} ascend)` : ''}</span>`)}
      <div class="stat-grid">${OB.STATS.map(s => `
        <div class="stat">
          <div class="stat-name">${s.name}</div>
          <div class="stat-val"><button type="button" class="step" data-act="stat" data-k="${s.key}" data-d="-1" aria-label="Lower ${s.name}">−</button><span>${OB.sgn(c.stats[s.key])}</span><button type="button" class="step" data-act="stat" data-k="${s.key}" data-d="1" aria-label="Raise ${s.name}">+</button></div>
          <div class="stat-desc">${s.desc}</div>
        </div>`).join('')}</div>
      ${c.cls ? `<p class="muted small">Suggested for ${E(c.cls)}: ${E(OB.CLASS[c.cls].suggest)}</p>` : '<p class="muted small">Arrange +3, +2, +2, +1, +1 across the five stats.</p>'}
    </article>`;
  }

  /* ---------- tracks & momentum ---------- */
  function vitals(c) {
    const maxM = OB.maxMomentum(c), reset = OB.momentumReset(c), maxF = OB.maxFocus(c);
    const IC = { health: 'heart', spirit: 'flame', supply: 'bag', focus: 'star', momentum: 'bolt' };
    const row = (k, name, val, blocked, hint) => `
      <div class="vital-row v-${k} ${blocked ? 'blocked' : ''}">
        <div class="vital-name">${OB.icon(IC[k])}<div>${name}${blocked ? `<small class="warn">${blocked}</small>` : ''}<small class="muted">${hint}</small></div></div>
        ${OB.cells(k, val, 0, 5, { signed: true })}
      </div>`;
    return `<article class="card vitals">
      ${OB.sectionHead('Tracks')}
      ${row('health', 'Health', c.health, c.deb.wounded ? 'wounded: cannot raise' : '', 'Endure Harm')}
      ${row('spirit', 'Spirit', c.spirit, c.deb.shaken ? 'shaken: cannot raise' : '', 'Endure Stress')}
      ${row('supply', 'Supply', c.supply, c.deb.unprepared ? 'unprepared: cannot raise' : '', 'Shared with allies')}
      <div class="vital-row v-focus">
        <div class="vital-name">${OB.icon('star')}<div>Focus<small class="muted">max +${maxF} · ${OB.castStat(c) ? 'casts with ' + OB.castStat(c) : 'grit and luck'}</small></div></div>
        ${maxF > 0 ? OB.cells('focus', c.focus, 0, maxF, { signed: true }) : '<span class="muted small">Choose a class to set max focus.</span>'}
      </div>
      <div class="vital-row mom v-momentum">
        <div class="vital-name">${OB.icon('bolt')}<div>Momentum<small class="muted">max +${maxM} · reset ${OB.sgn(reset)}</small></div></div>
        ${OB.cells('momentum', c.momentum, -6, 10, { signed: true, lockAbove: maxM, reset, cls: 'mstrip' })}
        <div class="row gap mom-actions">
          <button type="button" class="btn small" data-act="burnHud" ${c.momentum > reset ? '' : 'disabled'}>Burn → ${OB.sgn(reset)}</button>
          <span class="muted small">Burn after a roll from its card. This button only resets the track.</span>
        </div>
      </div>
    </article>`;
  }

  /* ---------- debilities ---------- */
  function debilities(c) {
    const n = OB.debCount(c);
    const groups = ['Condition', 'Bane', 'Burden'];
    return `<article class="card deb">
      ${OB.sectionHead('Debilities', `<span class="pill">${n} marked</span>`)}
      <p class="muted small">Each marked debility lowers max momentum by 1 and may lower your reset. Max momentum <strong>+${OB.maxMomentum(c)}</strong>, reset <strong>${OB.sgn(OB.momentumReset(c))}</strong>.</p>
      ${groups.map(g => `<div class="deb-group"><h4>${g}s</h4>${OB.DEBILITIES.filter(d => d.type === g).map(d => `
        <div class="deb-row">${F.chk('deb.' + d.key, !!c.deb[d.key], `<strong>${d.name}</strong>`, { hook: 'deb' })}<small class="muted">${E(d.how)}</small></div>`).join('')}</div>`).join('')}
    </article>`;
  }

  /* ---------- bonds ---------- */
  function bonds(c) {
    return `<article class="card bonds">
      ${OB.sectionHead('Bonds', `<span class="pill">${c.bonds.length} tick${c.bonds.length === 1 ? '' : 's'}</span>`)}
      ${OB.trackBoxes(c.bonds.length)}
      <p class="muted small">Each bond marks 1 tick. Mark up to three background bonds: a home, friends, family, or other loyalties. Bonds give +1 on certain moves.</p>
      <div class="bond-list">${c.bonds.map(b => `
        <div class="bond-row">${F.text(`bonds#${b.id}.name`, b.name, { ph: 'Person or community', label: 'Bond name' })}${F.text(`bonds#${b.id}.note`, b.note, { ph: 'Note', label: 'Bond note' })}
        <button type="button" class="icon-btn" data-act="delBond" data-id="${b.id}" aria-label="Clear bond" title="Clear bond">×</button></div>`).join('') || '<p class="muted">No bonds yet.</p>'}</div>
      <div class="row gap"><button class="btn small" data-act="addBond">+ Add bond</button>
      <button class="btn small ghost" data-act="rollEpilogue" ${c.bonds.length ? '' : 'disabled'}>Write Your Epilogue</button></div>
    </article>`;
  }

  /* ---------- experience & tier ---------- */
  function xp(c) {
    const next = c.tier < 4 ? OB.TIERS[c.tier] : null;
    const elig = OB.tierEligible(c);
    const goal = c.tier === 1 ? 10 : c.tier === 2 ? 25 : c.tier === 3 ? 45 : 45;
    const pct = Math.min(100, Math.round(c.xpEarned / goal * 100));
    return `<article class="card xp">
      ${OB.sectionHead('Experience', `<span class="pill tier">Tier ${c.tier} · ${OB.TIERS[c.tier - 1].title}</span>`)}
      <div class="xp-grid">
        <div><div class="lbl">Earned</div><div class="stepper"><button class="step" data-act="xp" data-k="xpEarned" data-d="-1" aria-label="Less earned">−</button><span>${c.xpEarned}</span><button class="step" data-act="xp" data-k="xpEarned" data-d="1" aria-label="More earned">+</button></div></div>
        <div><div class="lbl">Spent</div><div class="stepper"><button class="step" data-act="xp" data-k="xpSpent" data-d="-1" aria-label="Less spent">−</button><span>${c.xpSpent}</span><button class="step" data-act="xp" data-k="xpSpent" data-d="1" aria-label="More spent">+</button></div></div>
        <div><div class="lbl">Available</div><div class="stepper big"><span>${OB.xpAvail(c)}</span></div></div>
      </div>
      <div class="bar" title="${c.xpEarned} total earned"><i style="width:${pct}%"></i></div>
      ${next ? `<p class="muted small">Next tier ${next.tier} (${next.title}): ${E(next.need)}</p>` : '<p class="muted small">Legendary. You are at the top tier.</p>'}
      <div class="row gap">
        <button class="btn small primary" data-act="ascend" ${elig ? '' : 'disabled'}>${elig ? `Ascend to tier ${elig}` : 'Ascend'}</button>
        <button class="btn small" data-act="advance" data-n="3">Advance: new asset (3)</button>
        <button class="btn small" data-act="advance" data-n="2">Upgrade asset (2)</button>
      </div>
    </article>`;
  }

  /* ---------- gear & notes ---------- */
  function gear(c) {
    return `<article class="card gear">
      ${OB.sectionHead('Equipment and notes')}
      <label class="lbl">Important equipment <small>(keep it simple)</small>${F.area('gear', c.gear, { ph: 'Sword, shield, a spellbook, your captain’s ring…', rows: 3 })}</label>
      <label class="lbl">Background and flaws${F.area('background', c.background, { rows: 3, ph: 'Where you come from. What holds you back.' })}</label>
      <label class="lbl">Hopes and fears${F.area('hopes', c.hopes, { rows: 2 })}</label>
      <label class="lbl">Notes${F.area('notes', c.notes, { rows: 4, ph: 'Anything else.' })}</label>
    </article>`;
  }

  /* ---------- creation checklist ---------- */
  function creation(c) {
    const sorted = OB.STATS.map(s => c.stats[s.key]).sort((a, b) => b - a).join('');
    const bgOath = c.tracks.some(t => t.kind === 'oath' && t.bg);
    const steps = [
      !!c.concept, !!(c.heritage && c.upbringing), !!(c.cls && c.path), !!c.name,
      sorted === '32211' || c.ascStats > 0,
      c.health === 5 && c.spirit === 5 && c.supply === 5 && c.focus === OB.maxFocus(c),
      c.momentum === 2 && OB.debCount(c) === 0,
      c.bonds.length > 0, c.assets.some(a => a.type === 'talent' || a.type === 'companion'),
      !!c.gear.trim(), bgOath
    ];
    const done = steps.filter(Boolean).length;
    const open = OB.ui.open.creation != null ? OB.ui.open.creation : done < 11;
    return `<details class="card creation acc" data-key="creation" ${open ? 'open' : ''}>
      <summary><h3>Character creation <span class="pill ${done === 11 ? 'good' : ''}">${done}/11</span></h3></summary>
      <ol class="steps">${OB.CREATION_STEPS.map((s, i) => `<li class="${steps[i] ? 'done' : ''}"><span class="n">${i + 1}</span><div><strong>${E(s[0])}</strong> ${E(s[1])}</div></li>`).join('')}</ol>
      <div class="row gap wrap">
        <button class="btn small" data-act="semiRandom">Semi-random setup</button>
        <button class="btn small" data-act="newBgOath">Add background oath</button>
        <button class="btn small ghost" data-act="gotoTab" data-tab="assets">Choose talent or companion</button>
      </div>
      <p class="muted small">Semi-random fills heritage, upbringing, class, path, stats, and a name. It keeps your notes.</p>
    </details>`;
  }

  function plate(c) {
    const tier = OB.TIERS[c.tier - 1];
    const tags = [c.heritage, c.upbringing, c.cls, c.path].filter(Boolean);
    return `<section class="plate">
      <div class="plate-art" aria-hidden="true"></div>
      <div class="portrait-wrap">
        <div class="portrait">${c.portrait ? `<img src="${c.portrait}" alt="Portrait of ${E(c.name || 'your character')}">` : OB.icon('sheet')}</div>
        <div class="portrait-actions"><button type="button" class="btn small ghost" data-act="portrait">${OB.icon('camera')}<span>${c.portrait ? 'Change' : 'Portrait'}</span></button>${c.portrait ? '<button type="button" class="icon-btn" data-act="portraitDel" aria-label="Remove portrait">×</button>' : ''}</div>
      </div>
      <div class="plate-body">
        <div class="kicker"><span>Tier ${c.tier}</span><i></i><span>${E(tier.title)}</span></div>
        <h1 class="plate-name">${E(c.name || 'Unnamed Oathbound')}</h1>
        ${c.concept ? `<p class="plate-concept">${E(c.concept)}</p>` : '<p class="plate-concept dim">Swear an oath. See it fulfilled. No matter the cost.</p>'}
        <div class="tags">${tags.map(t => `<span class="tag-chip">${E(t)}</span>`).join('') || '<span class="muted small">Choose a heritage, upbringing, and class below.</span>'}</div>
        <div class="runes" role="group" aria-label="Roll a stat">${OB.STATS.map(s => `<button type="button" class="rune" data-act="rollStat" data-k="${s.key}" title="Roll +${s.name.toLowerCase()}"><b>${OB.sgn(c.stats[s.key])}</b><span>${s.name}</span></button>`).join('')}</div>
      </div>
    </section>`;
  }

  OB.v.sheet = function () {
    const c = OB.char();
    return `${plate(c)}
      <div class="grid sheet-grid">
        ${identity(c)}${stats(c)}${vitals(c)}${abilities(c)}${debilities(c)}${bonds(c)}${xp(c)}${gear(c)}
      </div>
      ${creation(c)}`;
  };
})(window.OB);
