/* ==========================================================================
   OATHBOUND — Tracks tab and Assets tab
   ========================================================================== */
(function (OB) {
  'use strict';
  const E = OB.esc, F = OB.f;

  const KINDS = [
    { key: 'oath',    title: 'Oaths',    one: 'oath',    mark: 'Reach a Milestone', roll: 'Fulfill Your Oath',      add: 'Swear an Oath', hint: 'Each oath is a quest. Mark progress when you Reach a Milestone. Roll when you believe it is fulfilled.' },
    { key: 'journey', title: 'Journeys', one: 'journey', mark: 'Mark a waypoint',   roll: 'Reach Your Destination', add: 'New journey',   hint: 'Mark progress per waypoint when you Undertake a Journey.' },
    { key: 'fight',   title: 'Fights',   one: 'foe',     mark: 'Inflict harm',      roll: 'End the Fight',          add: 'New foe',       hint: 'Each point of harm marks progress by the foe’s rank. Make End the Fight after a strong hit.' },
    { key: 'ritual',  title: 'Rituals',  one: 'ritual',  mark: 'Prepare',           roll: 'Perform a Ritual',       add: 'New ritual',    hint: 'Each hit on a preparing move marks progress. Roll the track when you complete the ritual.' },
    { key: 'other',   title: 'Other',    one: 'track',   mark: 'Mark progress',     roll: 'Progress roll',          add: 'New track',     hint: 'Any other challenge with a rank.' }
  ];
  OB.KINDS = KINDS;

  function trackCard(t, k) {
    const r = OB.RANK[t.rank];
    const boxes = OB.boxes(t);
    const markLabel = k.key === 'fight' ? `Inflict harm` : k.mark;
    const markAmt = t.rank === 'extreme' || t.rank === 'epic' ? r.mark : r.mark;
    const initTag = '';
    return `<div class="trk ${t.done ? 'done' : ''} kind-${t.kind}" data-track="${t.id}">
      <div class="trk-head">
        ${F.text(`tracks#${t.id}.name`, t.name, { ph: k.one === 'foe' ? 'Foe name' : 'Name', cls: 'trk-name', label: 'Track name' })}
        ${OB.rankSelect('', t.rank, `tracks#${t.id}.rank`)}
        ${t.bg ? '<span class="pill">Background</span>' : ''}
        <button type="button" class="icon-btn" data-act="delTrack" data-id="${t.id}" aria-label="Delete track" title="Delete">×</button>
      </div>
      ${OB.trackBoxes(t.ticks)}
      <div class="trk-meta"><span><strong>${boxes}</strong>/10 boxes · ${t.ticks} ticks</span><span class="muted">${r.type}</span></div>
      <div class="trk-actions">
        ${k.key === 'fight' ? `
          <span class="harm-in"><label>Harm <input type="number" min="1" max="12" value="2" id="harm-${t.id}" aria-label="Harm to inflict"></label>
          <button type="button" class="btn small" data-act="harmFoe" data-id="${t.id}">Inflict</button></span>` : `
          <button type="button" class="btn small" data-act="markTrack" data-id="${t.id}" title="Mark ${markAmt}">${markLabel} (+${markAmt})</button>`}
        <button type="button" class="btn small ghost" data-act="unmarkTrack" data-id="${t.id}" title="Clear ${markAmt}">− Clear</button>
        <button type="button" class="step" data-act="tickTrack" data-id="${t.id}" data-d="-1" aria-label="Remove one tick">−</button>
        <button type="button" class="step" data-act="tickTrack" data-id="${t.id}" data-d="1" aria-label="Add one tick">+</button>
        <button type="button" class="btn small primary" data-act="rollTrack" data-id="${t.id}" data-move="${k.roll}">${k.roll}</button>
        <button type="button" class="btn small ghost" data-act="doneTrack" data-id="${t.id}">${t.done ? 'Reopen' : 'Mark done'}</button>
      </div>
      ${t.kind === 'fight' ? `<p class="muted small">Inflicts <strong>${r.harm} harm</strong> on you · progress per harm: ${r.foe}</p>` : ''}
      ${F.text(`tracks#${t.id}.notes`, t.notes, { ph: 'Notes', cls: 'trk-notes', label: 'Track notes' })}
    </div>`;
  }

  OB.v.tracks = function () {
    const c = OB.char();
    const sections = KINDS.map(k => {
      const list = c.tracks.filter(t => t.kind === k.key);
      const open = list.filter(t => !t.done), done = list.filter(t => t.done);
      return `<section class="trk-sec">
        ${OB.sectionHead(k.title, `<div class="row gap">${k.key === 'fight' ? `<button type="button" class="chip ${c.initiative ? 'on' : ''}" data-act="toggleInitiative" aria-pressed="${!!c.initiative}">Initiative: ${c.initiative ? 'you' : 'foe'}</button>` : ''}<button type="button" class="btn small" data-act="newTrack" data-kind="${k.key}">+ ${k.add}</button></div>`)}
        <p class="muted small">${k.hint}</p>
        <div class="trk-list">${open.map(t => trackCard(t, k)).join('') || '<p class="muted empty">None yet.</p>'}</div>
        ${done.length ? `<details class="acc"><summary>Finished (${done.length})</summary><div class="acc-body trk-list">${done.map(t => trackCard(t, k)).join('')}</div></details>` : ''}
      </section>`;
    }).join('');
    return `${OB.banner('oath', 'Progress Tracks', 'Ten boxes. Four ticks each. Mark progress by rank.')}
      <article class="card tick-help"><div class="rank-table">
        <div class="rt-head"><span>Rank</span><span>Mark progress</span><span>Foe: per harm</span><span>Foe inflicts</span></div>
        ${OB.RANKS.map(r => `<div class="rt-row"><span>${OB.badgeRank(r.key)}</span><span>${r.mark}</span><span>${r.foe}</span><span>${r.harm} harm / −${r.suffer}</span></div>`).join('')}
      </div><p class="muted small">Bonds always mark 1 tick. Progress moves count only full boxes. You cannot burn momentum on a progress roll, and negative momentum does not apply.</p></article>
      ${sections}`;
  };

  /* =========================== ASSETS =========================== */
  const TYPE_NAME = { class: 'Class card', path: 'Path card', talent: 'Talent', companion: 'Companion', artifact: 'Artifact', spell: 'Spell', custom: 'Asset' };

  function assetCard(a, c) {
    const nOn = a.abilities.filter(x => x.on).length;
    const comp = a.type === 'companion';
    return `<article class="asset type-${a.type}" data-asset="${a.id}">
      <header>
        <span class="atype">${TYPE_NAME[a.type] || 'Asset'}${a.cls ? ` · ${E(a.cls)}` : ''}${a.tier && a.type === 'path' ? ` · tier ${a.tier}` : ''}</span>
        <button type="button" class="icon-btn" data-act="delAsset" data-id="${a.id}" aria-label="Remove asset" title="Remove">×</button>
      </header>
      ${F.text(`assets#${a.id}.name`, a.name, { ph: 'Asset name', cls: 'asset-name', label: 'Asset name' })}
      ${F.text(`assets#${a.id}.sub`, a.sub, { ph: 'Type line (e.g. Evoker · Foundation · Spell)', cls: 'asset-sub', label: 'Type line' })}
      ${a.text || true ? F.area(`assets#${a.id}.text`, a.text || '', { rows: 2, ph: 'Description', cls: 'asset-text' }) : ''}
      ${comp ? `<div class="comp-health"><div class="lbl">Health</div><div class="cells">${Array.from({ length: (a.maxHealth || 4) + 1 }, (_, i) => `<button type="button" class="cell ${i <= (a.health || 0) ? 'fill' : ''} ${i === a.health ? 'cur' : ''}" data-act="setComp" data-id="${a.id}" data-v="${i}" aria-label="Companion health ${i}">${i}</button>`).join('')}</div>
        <div class="row gap"><input type="number" min="1" max="9" value="1" id="cd-${a.id}" class="mini" aria-label="Harm to companion"><button type="button" class="btn small" data-act="compHarm" data-id="${a.id}">Companion Endure Harm</button></div></div>` : ''}
      <ul class="abils">${a.abilities.map((ab, i) => `
        <li class="${ab.on ? 'on' : ''}">
          <button type="button" class="dot ${ab.on ? 'on' : ''}" data-act="toggleAbility" data-id="${a.id}" data-i="${i}" aria-pressed="${!!ab.on}" aria-label="Toggle ability ${i + 1}"></button>
          <div class="ab-body">${ab.name ? `<strong class="ab-name">${E(ab.name)}.</strong> ` : ''}${F.area(`assets#${a.id}.abilities.${i}.text`, ab.text, { rows: 2, ph: 'Ability text…', cls: 'ab-text' })}</div>
          <button type="button" class="icon-btn small" data-act="delAbility" data-id="${a.id}" data-i="${i}" aria-label="Remove ability" title="Remove ability">−</button>
        </li>`).join('')}</ul>
      <div class="row gap wrap">
        <button type="button" class="btn small ghost" data-act="addAbility" data-id="${a.id}">+ Ability</button>
        <button type="button" class="btn small" data-act="upgradeAsset" data-id="${a.id}" ${nOn >= a.abilities.length ? 'disabled' : ''}>Upgrade (2 XP)</button>
        <span class="muted small">${nOn}/${a.abilities.length} marked</span>
      </div>
    </article>`;
  }

  OB.v.assets = function () {
    const c = OB.char();
    const info = OB.CLASS_INFO[c.cls];
    const own = c.assets.filter(a => a.type === 'path');
    const paths = [];
    if (c.cls) OB.CLASS[c.cls].paths.forEach(p => paths.push({ cls: c.cls, path: p }));
    c.extraPaths.forEach(p => paths.push(p));
    const pathPanel = paths.length ? `<article class="card paths-panel">
      ${OB.sectionHead('Paths')}
      <p class="muted small">Each path has three cards: Foundation (tier 1), Specialization (tier 2), Mastery (tier 3). Adding a path card costs 3 XP. A Specialization needs tier 2 and the Foundation. A Mastery needs tier 3 and the Specialization. Your class’s other path Foundation can be added at any time for 3 XP.</p>
      ${paths.map(p => {
        const blurb = (OB.CLASS_INFO[p.cls].paths[p.path]) || '';
        return `<div class="path-row"><div><strong>${E(p.path)}</strong> <span class="muted small">${E(p.cls)} path</span><div class="muted small">${E(blurb)}</div></div>
          <div class="row gap">${OB.PATH_TIERS.map((tn, i) => {
            const have = own.some(a => a.path === p.path && a.pathIdx === i);
            const prevOk = i === 0 || own.some(a => a.path === p.path && a.pathIdx === i - 1);
            const tierOk = c.tier >= i + 1 || (i === 0);
            const ok = !have && prevOk && tierOk;
            return `<button type="button" class="btn small ${have ? 'ghost' : ''}" data-act="addPathCard" data-cls="${p.cls}" data-path="${p.path}" data-i="${i}" ${ok ? '' : 'disabled'} title="${have ? 'Already added' : !prevOk ? 'Needs the card before it' : !tierOk ? 'Needs tier ' + (i + 1) : 'Add (3 XP)'}">${have ? '✓ ' : ''}${tn}</button>`;
          }).join('')}</div></div>`;
      }).join('')}
    </article>` : '';

    const classQ = info ? `<article class="card"><details class="acc" data-key="classq" ${OB.ui.open.classq ? 'open' : ''}><summary><h3>${E(c.cls)} — questions and oath seeds</h3></summary><div class="acc-body">
      <h4>Background questions</h4><ul>${info.bg.map(q => `<li>${E(q)}</li>`).join('')}</ul>
      <h4>Bond questions</h4><ul>${info.bond.map(q => `<li>${E(q)}</li>`).join('')}</ul>
      <h4>Oath seeds (d6)</h4><ol>${info.seeds.map(q => `<li>${E(q)}</li>`).join('')}</ol></div></details></article>` : '';

    return `${OB.banner('magic', 'Assets', 'Class card, path cards, talents, companions, and artifacts.')}
      <div class="row gap wrap tab-actions">
        <button class="btn primary" data-act="newAsset">+ Add asset</button>
        <span class="muted small">XP available: <strong>${OB.xpAvail(c)}</strong>. Add a new asset for 3 XP, upgrade for 2 XP.</span>
      </div>
      ${pathPanel}
      <div class="asset-grid">${c.assets.map(a => assetCard(a, c)).join('') || '<p class="muted empty">No assets yet. Choose a class on the Sheet, or add one.</p>'}</div>
      ${classQ}`;
  };
})(window.OB);
