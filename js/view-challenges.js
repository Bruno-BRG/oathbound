/* ==========================================================================
   OATHBOUND — Challenges tab: vows, progress, foes (Stargazer-style)
   ========================================================================== */
(function (OB) {
  'use strict';
  const E = OB.esc, F = OB.f;

  const KINDS = [
    { key: 'oath',    title: 'Vows',     one: 'oath',    roll: 'Fulfill Your Oath',      add: 'New vow' },
    { key: 'journey', title: 'Journeys', one: 'journey', roll: 'Reach Your Destination', add: 'New journey' },
    { key: 'fight',   title: 'Fights',   one: 'foe',     roll: 'End the Fight',          add: 'New foe' },
    { key: 'ritual',  title: 'Rituals',  one: 'ritual',  roll: 'Perform a Ritual',       add: 'New ritual' },
    { key: 'other',   title: 'Other',    one: 'track',   roll: 'Progress roll',          add: 'New track' }
  ];
  OB.KINDS = KINDS;

  /* one progress track, drawn as Stargazer draws its vows */
  function trkCard(t, k) {
    const r = OB.RANK[t.rank];
    const boxes = OB.boxes(t);
    const markBoxes = [...Array(10).keys()].map(i => {
      const n = Math.max(0, Math.min(4, t.ticks - i * 4));
      return `<button type="button" class="pbox ${n === 4 ? 'full' : n > 0 ? 'part' : ''}" data-act="setBoxes" data-id="${t.id}" data-v="${i + 1}" aria-label="Set progress to ${i + 1} of 10 boxes" title="${i + 1} of 10">${OB.tickSvg(n)}</button>`;
    }).join('');
    const ranks = OB.RANKS.map(x => `<button type="button" class="rk ${x.key === t.rank ? 'on' : ''}" data-act="setRank" data-id="${t.id}" data-rank="${x.key}" aria-pressed="${x.key === t.rank}">${x.name}</button>`).join('');
    const open = OB.ui.open['notes:' + t.id];
    const act = k.key === 'fight'
      ? `<span class="harm-in"><label>Harm <input type="number" min="1" max="12" value="2" id="harm-${t.id}" aria-label="Harm to inflict"></label>
           <button type="button" class="btn sm" data-act="harmFoe" data-id="${t.id}">Inflict</button></span>`
      : `<button type="button" class="btn sm" data-act="markTrack" data-id="${t.id}">Mark (+${r.mark})</button>`;
    return `<article class="trk kind-${t.kind} ${t.done ? 'done' : ''}" data-track="${t.id}">
      <header class="trk-h">
        ${F.text(`tracks#${t.id}.name`, t.name, { ph: k.one === 'foe' ? 'Foe name' : 'Name', cls: 'trk-name', label: 'Track name' })}
        ${t.bg ? '<span class="pill">Background</span>' : ''}
        <button type="button" class="ib sm" data-act="delTrack" data-id="${t.id}" aria-label="Delete track">${OB.icon('trash')}</button>
      </header>
      <div class="trk-mark"><span class="mk-l">Mark</span><div class="ptrack">${markBoxes}</div></div>
      <div class="rk-row" role="group" aria-label="Rank">${ranks}</div>
      <div class="trk-meta"><span>${OB.icon('clock')}${t.ticks} ticks</span><span>${boxes}/10 boxes</span>${t.done ? '<span class="pill good">Done</span>' : ''}</div>
      <div class="trk-actions">
        ${act}
        <button type="button" class="btn sm primary" data-act="rollTrack" data-id="${t.id}" data-move="${k.roll}">${k.roll}</button>
        <button type="button" class="ib sm" data-act="unmarkTrack" data-id="${t.id}" title="Clear ${r.mark}" aria-label="Clear progress">− clear</button>
        <button type="button" class="btn sm ghost" data-act="doneTrack" data-id="${t.id}">${t.done ? 'Reopen' : 'Mark done'}</button>
      </div>
      ${t.kind === 'fight' ? `<p class="muted small">Inflicts <strong>${r.harm} harm</strong> on you. Progress per harm: ${r.foe}.</p>` : ''}
      <details class="notes-d" data-key="notes:${t.id}" ${open ? 'open' : ''}><summary>${OB.icon('doc')}<span>Notes</span></summary>
        ${F.area(`tracks#${t.id}.notes`, t.notes, { rows: 2, ph: 'Notes', cls: 'trk-notes', label: 'Track notes' })}</details>
    </article>`;
  }

  function list(c, kind, k) {
    const all = c.tracks.filter(t => t.kind === kind);
    const open = all.filter(t => !t.done), done = all.filter(t => t.done);
    return `<div class="trk-list">${open.map(t => trkCard(t, k)).join('') || '<p class="muted empty">None yet.</p>'}</div>
      ${done.length ? `<details class="acc"><summary><h4>Finished (${done.length})</h4></summary><div class="acc-body"><div class="trk-list">${done.map(t => trkCard(t, k)).join('')}</div></div></details>` : ''}`;
  }

  function subHead(title, kind, extra) {
    return `<div class="subhead"><h4>${title}</h4><div class="row gap">${extra || ''}<button type="button" class="btn sm" data-act="newTrack" data-kind="${kind}">${OB.icon('plus')}New</button></div></div>`;
  }

  OB.v.challenges = function () {
    const c = OB.char();
    const vows = KINDS[0];
    const fight = KINDS.find(k => k.key === 'fight');
    // Fights live in the Foes band only: one place per foe, no duplicated track.
    const progress = KINDS.slice(1).filter(k => k.key !== 'fight').map(k => `<section class="prog-sec">
        ${subHead(k.title, k.key, k.key === 'fight' ? `<button type="button" class="chip ${c.initiative ? 'on' : ''}" data-act="toggleInitiative" aria-pressed="${!!c.initiative}">Initiative: ${c.initiative ? 'you' : 'foe'}</button>` : '')}
        ${list(c, k.key, k)}
      </section>`).join('');
    const rules = `<table class="rank-table"><thead><tr><th>Rank</th><th>Mark progress</th><th>Foe: per harm</th><th>Foe inflicts</th></tr></thead><tbody>
      ${OB.RANKS.map(r => `<tr><td>${OB.badgeRank(r.key)}</td><td>${r.mark}</td><td>${r.foe}</td><td>${r.harm} harm · −${r.suffer}</td></tr>`).join('')}</tbody></table>
      <p class="muted small">Bonds always mark 1 tick. Progress moves count only full boxes. You cannot burn momentum on a progress roll, and negative momentum does not apply.</p>`;
    return `${OB.band('vows', 'Vows', `<button type="button" class="band-btn" data-act="newTrack" data-kind="oath" aria-label="New vow" title="New vow">${OB.icon('plus')}</button>`, list(c, 'oath', vows))}
      ${OB.band('progress', 'Progress', '', progress)}
      ${OB.band('foes', 'Foes', `<button type="button" class="band-btn" data-act="newTrack" data-kind="fight" aria-label="New foe" title="New foe">${OB.icon('plus')}</button>`, `${subHead('In the fray', 'fight', `<button type="button" class="chip ${c.initiative ? 'on' : ''}" data-act="toggleInitiative" aria-pressed="${!!c.initiative}">Initiative: ${c.initiative ? 'you' : 'foe'}</button>`)}
        ${list(c, 'fight', fight)}
        ${OB.foesPanel ? OB.foesPanel() : ''}`)}
      ${OB.band('rules', 'Progress rules', '', rules, false)}`;
  };

  /* the key-kind list used by the drawer and the palette */
  OB.trackKindLabel = k => (KINDS.find(x => x.key === k) || {}).one || 'track';
})(window.OB);
