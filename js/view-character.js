/* ==========================================================================
   OATHBOUND — Character tab (Stargazer-style layout)
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

  const TYPE_NAME = { class: 'Class card', path: 'Path card', talent: 'Talent', companion: 'Companion', artifact: 'Artifact', spell: 'Spell', custom: 'Asset' };

  /* ---------- portrait + identity ---------- */
  function identity(c) {
    const cls = OB.CLASS[c.cls];
    const paths = cls ? cls.paths : [];
    const portrait = c.portrait
      ? `<img src="${c.portrait}" alt="Portrait of ${E(c.name || 'your character')}">`
      : OB.icon('sheet');
    return `<section class="card ident">
      <div class="portrait-col">
        <div class="portrait">${portrait}</div>
        <div class="portrait-actions">
          <button type="button" class="btn sm ghost" data-act="portrait">${OB.icon('camera')}<span>${c.portrait ? 'Change' : 'Add portrait'}</span></button>
          ${c.portrait ? `<button type="button" class="ib sm" data-act="portraitDel" aria-label="Remove portrait">${OB.icon('close')}</button>` : ''}
        </div>
      </div>
      <div class="ident-main">
        <div class="ident-top">
          <label class="fl grow">Name${F.text('name', c.name, { ph: 'Who are you?', cls: 'name-in', label: 'Character name' })}</label>
          <label class="fl">Pronouns${F.text('pronouns', c.pronouns, { ph: 'they/them, she/her…', label: 'Pronouns' })}</label>
        </div>
        <label class="fl">Epithet${F.text('epithet', c.epithet, { ph: 'the Unbroken, of the Red Hand…', label: 'Epithet' })}</label>
        <div class="ident-chars" role="group" aria-label="Characteristics">
          <label class="fl">Heritage${F.sel('heritage', c.heritage, OB.HERITAGES.map(h => h.key), { hook: 'heritage', label: 'Heritage' })}</label>
          <label class="fl">Legacy from${F.sel('legacyFrom', c.legacyFrom, OB.HERITAGES.map(h => h.key), { blank: '— same —', hook: 'heritage', label: 'Legacy from' })}</label>
          <label class="fl">Upbringing${F.sel('upbringing', c.upbringing, OB.UPBRINGINGS.map(u => u.key), { label: 'Upbringing' })}</label>
          <label class="fl">Class${F.sel('cls', c.cls, OB.CLASSES.map(x => x.key), { hook: 'class', label: 'Class' })}</label>
          <label class="fl">Path${F.sel('path', c.path, paths, { hook: 'path', blank: cls ? '— choose —' : 'Choose a class first', label: 'Path' })}</label>
        </div>
        <label class="fl">Concept — history, hopes, flaws${F.text('concept', c.concept, { ph: 'A wandering knight who lost her company…', label: 'Concept' })}</label>
        ${c.extraPaths.length ? `<p class="muted small">Other paths walked: ${c.extraPaths.map(p => `${E(p.path)} (${E(p.cls)})`).join(', ')}</p>` : ''}
      </div>
    </section>`;
  }

  /* ---------- vitals: health, spirit, supply in a row; momentum and focus full width ---------- */
  function vitals(c) {
    const maxM = OB.maxMomentum(c), reset = OB.momentumReset(c), maxF = OB.maxFocus(c);
    const block = (k, name, ic, val, max, o) => `<div class="vit v-${k} ${o && o.blocked ? 'blocked' : ''}">
        <div class="vit-h">${OB.icon(ic)}<b>${name}</b>${o && o.hint ? `<small class="muted">${o.hint}</small>` : ''}${o && o.blocked ? `<small class="warn">${o.blocked}</small>` : ''}</div>
        ${OB.cells(k, val, 0, max, { rev: true, cls: 'strip' })}
      </div>`;
    return `<section class="card vitals">
      <div class="vit-grid">
        ${block('health', 'Health', 'heart', c.health, 5, { hint: 'Endure Harm', blocked: c.deb.wounded ? 'wounded: cannot raise' : '' })}
        ${block('spirit', 'Spirit', 'flame', c.spirit, 5, { hint: 'Endure Stress', blocked: c.deb.shaken ? 'shaken: cannot raise' : '' })}
        ${block('supply', 'Supply', 'bag', c.supply, 5, { hint: 'Shared', blocked: c.deb.unprepared ? 'unprepared: cannot raise' : '' })}
      </div>
      <div class="vit v-momentum mom">
        <div class="vit-h">${OB.icon('bolt')}<b>Momentum</b>
          <span class="mom-meta"><span>Max <b>${OB.sgn(maxM)}</b></span><span>Reset <b>${OB.sgn(reset)}</b></span></span>
          <button type="button" class="burn ${c.momentum > reset ? 'ready' : ''}" data-act="burnMomentum" ${c.momentum > reset ? '' : 'disabled'} title="Burn momentum: reset to ${OB.sgn(reset)}" aria-label="Burn momentum">${OB.icon('flame')}<span>Burn</span></button>
        </div>
        ${OB.cells('momentum', c.momentum, -6, 10, { rev: true, signed: true, lockAbove: maxM, reset, cls: 'strip mstrip' })}
      </div>
      <div class="vit v-focus">
        <div class="vit-h">${OB.icon('star')}<b>Focus</b><small class="muted">${maxF ? `max ${OB.sgn(maxF)} · ${OB.castStat(c) ? 'casts with ' + OB.castStat(c) : 'grit and luck'}` : 'Choose a class to set max focus'}</small></div>
        ${maxF > 0 ? OB.cells('focus', c.focus, 0, maxF, { rev: true, signed: true, cls: 'strip' }) : ''}
      </div>
    </section>`;
  }

  /* ---------- stats: five boxes, click the number to roll ---------- */
  function stats(c) {
    const sum = OB.STATS.reduce((a, s) => a + c.stats[s.key], 0);
    return `<section class="card stats">
      <div class="card-h"><h3>Stats</h3><span class="pill ${sum - c.ascStats === 9 ? 'good' : ''}" title="At creation arrange +3, +2, +2, +1, +1">Σ ${sum}${c.ascStats ? ` · ${c.ascStats} from Ascend` : ''}</span></div>
      <div class="stat-row">${OB.STATS.map(s => `<div class="stat s-${s.key}">
          <div class="stat-n">${s.name}</div>
          <button type="button" class="stat-v" data-act="rollStat" data-k="${s.key}" title="Roll +${s.name.toLowerCase()}" aria-label="Roll ${s.name}">${OB.sgn(c.stats[s.key])}</button>
          <div class="stat-ctl"><button type="button" class="step" data-act="stat" data-k="${s.key}" data-d="-1" aria-label="Lower ${s.name}">−</button><button type="button" class="step" data-act="stat" data-k="${s.key}" data-d="1" aria-label="Raise ${s.name}">+</button></div>
          <div class="stat-d">${E(s.desc)}</div>
        </div>`).join('')}</div>
      <p class="muted small">${c.cls ? `Suggested for ${E(c.cls)}: ${E(OB.CLASS[c.cls].suggest)}.` : 'Arrange +3, +2, +2, +1, +1 across the five stats.'}</p>
    </section>`;
  }

  /* ---------- gear and notes ---------- */
  function gear(c) {
    return `<section class="card">
      <div class="card-h"><h3>Gear &amp; notes</h3></div>
      <label class="fl">Important equipment <small>(keep it simple)</small>${F.area('gear', c.gear, { ph: 'Sword, shield, a spellbook, your captain’s ring…', rows: 3, label: 'Equipment' })}</label>
      <label class="fl">Background and flaws${F.area('background', c.background, { rows: 3, ph: 'Where you come from. What holds you back.', label: 'Background' })}</label>
      <label class="fl">Hopes and fears${F.area('hopes', c.hopes, { rows: 2, label: 'Hopes and fears' })}</label>
      <label class="fl">Notes${F.area('notes', c.notes, { rows: 3, ph: 'Anything else.', label: 'Notes' })}</label>
    </section>`;
  }

  /* ---------- impacts (debilities) ---------- */
  function impacts(c) {
    const groups = [['Conditions', 'Condition'], ['Banes', 'Bane'], ['Burdens', 'Burden']];
    return `<section class="card impacts">
      <div class="card-h"><h3>Impacts</h3><span class="pill">${OB.debCount(c)} marked</span></div>
      <div class="imp-grid">${groups.map(([title, type]) => `<div class="imp-g">
        <h4>${title}</h4>${OB.DEBILITIES.filter(d => d.type === type).map(d => `<div class="imp-row">${F.chk('deb.' + d.key, !!c.deb[d.key], d.name, { hook: 'deb' })}<small class="muted" title="${E(d.how)}">${E(d.how)}</small></div>`).join('')}
      </div>`).join('')}</div>
      <p class="muted small">Each marked impact lowers max momentum by 1 and may lower your reset. Max momentum <strong>${OB.sgn(OB.maxMomentum(c))}</strong>, reset <strong>${OB.sgn(OB.momentumReset(c))}</strong>.</p>
    </section>`;
  }

  /* ---------- legacy: bonds ---------- */
  function bonds(c) {
    const body = `${OB.trackBoxes(c.bonds.length)}
      <div class="bond-list">${c.bonds.map(b => `<div class="bond-row">
        ${F.text(`bonds#${b.id}.name`, b.name, { ph: 'Person or community', label: 'Bond name' })}
        ${F.text(`bonds#${b.id}.note`, b.note, { ph: 'Note', label: 'Bond note' })}
        <button type="button" class="ib sm" data-act="delBond" data-id="${b.id}" aria-label="Remove bond">${OB.icon('trash')}</button></div>`).join('') || '<p class="muted small">No bonds yet. Mark up to three background bonds.</p>'}</div>
      <p class="muted small">Each bond marks 1 tick. Bonds give +1 on certain moves.</p>
      <div class="row gap wrap"><button class="btn sm" data-act="addBond">${OB.icon('plus')}Add bond</button>
      <button class="btn sm ghost" data-act="rollEpilogue" ${c.bonds.length ? '' : 'disabled'}>Write Your Epilogue</button></div>`;
    return OB.band('bonds', 'Legacy — Bonds', `<span class="pill">${c.bonds.length} tick${c.bonds.length === 1 ? '' : 's'}</span>`, body);
  }

  /* ---------- experience & tier ---------- */
  function xp(c) {
    const elig = OB.tierEligible(c);
    const goal = c.tier === 1 ? 10 : c.tier === 2 ? 25 : 45;
    const pct = Math.min(100, Math.round(c.xpEarned / goal * 100));
    const stepper = (k, label, val) => `<div class="xp-c"><div class="lbl-s">${label}</div><div class="stepper"><button class="step" data-act="xp" data-k="${k}" data-d="-1" aria-label="Less ${label}">−</button><span>${val}</span><button class="step" data-act="xp" data-k="${k}" data-d="1" aria-label="More ${label}">+</button></div></div>`;
    const body = `<div class="xp-grid">${stepper('xpEarned', 'Earned', c.xpEarned)}${stepper('xpSpent', 'Spent', c.xpSpent)}
        <div class="xp-c"><div class="lbl-s">Available</div><div class="xp-big">${OB.xpAvail(c)}</div></div></div>
      <div class="bar" title="${c.xpEarned} total earned"><i style="width:${pct}%"></i></div>
      <p class="muted small">${c.tier < 4 ? `Next: tier ${c.tier + 1} (${OB.TIERS[c.tier].title}). ${E(OB.TIERS[c.tier].need)}` : 'Legendary. You are at the top tier.'}</p>
      <div class="row gap wrap">
        <button class="btn sm primary" data-act="ascend" ${elig ? '' : 'disabled'}>${elig ? `Ascend to tier ${elig}` : 'Ascend'}</button>
        <button class="btn sm" data-act="advance" data-n="3">New asset · 3 XP</button>
        <button class="btn sm" data-act="advance" data-n="2">Upgrade · 2 XP</button>
      </div>`;
    return OB.band('xp', 'Experience', `<span class="pill tier">Tier ${c.tier} · ${OB.TIERS[c.tier - 1].title}</span>`, body);
  }

  /* ---------- assets ---------- */
  function compHealth(a) {
    const max = a.maxHealth || 4;
    const cells = Array.from({ length: max + 1 }, (_, i) => max - i).map(i => `<button type="button" class="cell ${i <= (a.health || 0) ? 'fill' : ''} ${i === a.health ? 'cur' : ''}" data-act="setComp" data-id="${a.id}" data-v="${i}" aria-label="Companion health ${i}">${i}</button>`).join('');
    return `<div class="comp"><div class="lbl-s">Companion health</div><div class="cells strip">${cells}</div>
      <div class="row gap"><input type="number" min="1" max="9" value="1" id="cd-${a.id}" class="mini" aria-label="Harm to companion"><button type="button" class="btn sm" data-act="compHarm" data-id="${a.id}">Companion Endure Harm</button></div></div>`;
  }

  function assetCard(a) {
    const nOn = a.abilities.filter(x => x.on).length;
    return `<article class="asset type-${a.type}" data-asset="${a.id}">
      <header class="asset-h">
        <div class="hexes" aria-label="Abilities">${a.abilities.map((ab, i) => `<button type="button" class="hexbtn ${ab.on ? 'on' : ''}" data-act="toggleAbility" data-id="${a.id}" data-i="${i}" aria-pressed="${!!ab.on}" aria-label="Ability ${i + 1}"></button>`).join('')}</div>
        <div class="asset-t">${F.text(`assets#${a.id}.name`, a.name, { ph: 'Asset name', cls: 'asset-name', label: 'Asset name' })}</div>
        <span class="asset-k">${TYPE_NAME[a.type] || 'Asset'}${a.cls ? ` · ${E(a.cls)}` : ''}${a.tier && a.type === 'path' ? ` · tier ${a.tier}` : ''}</span>
        <button type="button" class="ib sm" data-act="delAsset" data-id="${a.id}" aria-label="Remove asset">${OB.icon('trash')}</button>
      </header>
      ${F.area(`assets#${a.id}.sub`, a.sub || '', { rows: 1, ph: 'Type line (e.g. Evoker · Foundation · Spell)', cls: 'asset-sub', label: 'Type line' })}
      ${F.area(`assets#${a.id}.text`, a.text || '', { rows: 2, ph: 'Description', cls: 'asset-text', label: 'Description' })}
      <ul class="abil-list">${a.abilities.map((ab, i) => `<li class="${ab.on ? 'on' : ''}">
          <button type="button" class="dot ${ab.on ? 'on' : ''}" data-act="toggleAbility" data-id="${a.id}" data-i="${i}" aria-pressed="${!!ab.on}" aria-label="Mark ability ${i + 1}"></button>
          <div class="ab-body">${F.area(`assets#${a.id}.abilities.${i}.text`, ab.text, { rows: 2, ph: 'Ability text…', cls: 'ab-text', label: 'Ability ' + (i + 1) })}</div>
          <button type="button" class="ib sm" data-act="delAbility" data-id="${a.id}" data-i="${i}" aria-label="Remove ability">−</button></li>`).join('')}</ul>
      ${a.type === 'companion' ? compHealth(a) : ''}
      <footer class="asset-f">
        <button type="button" class="btn sm ghost" data-act="addAbility" data-id="${a.id}">+ Ability</button>
        <button type="button" class="btn sm" data-act="upgradeAsset" data-id="${a.id}" ${nOn >= a.abilities.length ? 'disabled' : ''}>Upgrade · 2 XP</button>
        <span class="muted small">${nOn}/${a.abilities.length} marked</span>
      </footer>
    </article>`;
  }

  function pathPanel(c) {
    const paths = [];
    if (c.cls) OB.CLASS[c.cls].paths.forEach(p => paths.push({ cls: c.cls, path: p }));
    c.extraPaths.forEach(p => paths.push(p));
    if (!paths.length) return '';
    const own = c.assets.filter(a => a.type === 'path');
    return `<div class="paths-panel">
      <p class="muted small">Each path has three cards: Foundation (tier 1), Specialization (tier 2), Mastery (tier 3). Adding a path card costs 3 XP.</p>
      ${paths.map(p => `<div class="path-row"><div><strong>${E(p.path)}</strong> <span class="muted small">${E(p.cls)} path</span><div class="muted small">${E((OB.CLASS_INFO[p.cls].paths[p.path]) || '')}</div></div>
        <div class="row gap wrap">${OB.PATH_TIERS.map((tn, i) => {
          const have = own.some(a => a.path === p.path && a.pathIdx === i);
          const prevOk = i === 0 || own.some(a => a.path === p.path && a.pathIdx === i - 1);
          const tierOk = c.tier >= i + 1;
          const ok = !have && prevOk && tierOk;
          const why = have ? 'Already added' : !prevOk ? 'Needs the card before it' : !tierOk ? 'Needs tier ' + (i + 1) : 'Add (3 XP)';
          return `<button type="button" class="btn sm ${have ? 'ghost' : ''}" data-act="addPathCard" data-cls="${p.cls}" data-path="${p.path}" data-i="${i}" ${ok ? '' : 'disabled'} title="${why}">${have ? '✓ ' : ''}${tn}</button>`;
        }).join('')}</div></div>`).join('')}
    </div>`;
  }

  function assets(c) {
    const info = OB.CLASS_INFO[c.cls];
    const classQ = info ? `<details class="acc" data-key="classq" ${OB.ui.open.classq ? 'open' : ''}><summary><h4>${E(c.cls)} — questions and oath seeds</h4></summary><div class="acc-body">
      <h5>Background questions</h5><ul>${info.bg.map(q => `<li>${E(q)}</li>`).join('')}</ul>
      <h5>Bond questions</h5><ul>${info.bond.map(q => `<li>${E(q)}</li>`).join('')}</ul>
      <h5>Oath seeds (d6)</h5><ol>${info.seeds.map(q => `<li>${E(q)}</li>`).join('')}</ol></div></details>` : '';
    const body = `<div class="row gap wrap tab-actions">
        <button class="btn primary sm" data-act="newAsset">${OB.icon('plus')}Add asset</button>
        <span class="muted small">XP available: <strong>${OB.xpAvail(c)}</strong>. Class card, path, talent, companion, or artifact.</span>
      </div>
      ${pathPanel(c)}
      <div class="asset-list">${c.assets.map(assetCard).join('') || '<p class="muted empty">No assets yet. Choose a class, or add a talent or companion.</p>'}</div>
      ${classQ}`;
    return OB.band('assets', 'Assets', `<span class="pill">${c.assets.length}</span>`, body);
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
    const body = `<ol class="steps">${OB.CREATION_STEPS.map((s, i) => `<li class="${steps[i] ? 'done' : ''}"><span class="n">${i + 1}</span><div><strong>${E(s[0])}</strong> ${E(s[1])}</div></li>`).join('')}</ol>
      <div class="row gap wrap">
        <button class="btn sm" data-act="semiRandom">Semi-random setup</button>
        <button class="btn sm" data-act="newBgOath">Add background oath</button>
        <button class="btn sm ghost" data-act="gotoTab" data-tab="challenges">Go to Challenges</button>
      </div>`;
    return OB.band('creation', 'Character creation', `<span class="pill ${done === 11 ? 'good' : ''}">${done}/11</span>`, body, done < 11);
  }

  OB.v.character = function () {
    const c = OB.char();
    return `${OB.banner('cover', c.name || 'New Oathbound', 'Swear an oath. See it fulfilled. No matter the cost.')}
      ${identity(c)}
      ${vitals(c)}
      ${stats(c)}
      <div class="g2">${impacts(c)}${gear(c)}</div>
      <div class="g2"><div>${bonds(c)}</div><div>${xp(c)}</div></div>
      ${assets(c)}
      ${creation(c)}`;
  };
})(window.OB);
