/* ==========================================================================
   OATHBOUND — Campaign tab (Truths, factions, notes) and Amarin tab (hex map)
   ========================================================================== */
(function (OB) {
  'use strict';
  const E = OB.esc, F = OB.f;

  /* ---------- Campaign ---------- */
  const short = s => (s.length > 74 ? s.slice(0, 72).replace(/\s+\S*$/, '') + '…' : s);
  const RANGES = ['1–33', '34–66', '67–100'];

  function truthCard(t, truths) {
    const st = truths[t.key] || {};
    const quest = st.pick != null ? t.opts[st.pick] : null;
    return `<article class="card truth">
      <div class="truth-h">${OB.icon('book')}<h4>${E(t.name)}</h4></div>
      <div class="truth-sel">
        <select data-act-change="pickTruth" data-key="${t.key}" aria-label="${E(t.name)} option">
          <option value="">Select one, write your own, or roll…</option>
          ${t.opts.map((o, i) => `<option value="${i}" ${st.pick === i ? 'selected' : ''}>${RANGES[i]} · ${E(short(o[0]))}</option>`).join('')}
        </select>
        <button type="button" class="ib" data-act="rollTruth" data-key="${t.key}" aria-label="Roll d100 for ${E(t.name)}" title="Roll d100">${OB.icon('dice')}</button>
      </div>
      ${quest ? `<p class="truth-text">${E(quest[0])}</p>
        <p class="quest"><strong>Quest starter.</strong> ${E(quest[1])}</p>
        <div class="row gap"><button type="button" class="btn sm ghost" data-act="truthNote" data-key="${t.key}">Add to journal</button></div>` : ''}
      <input type="text" data-bind="truths.${t.key}.custom" value="${E(st.custom || '')}" placeholder="Your own truth, or a note…" aria-label="Custom truth for ${E(t.name)}" class="custom-in">
    </article>`;
  }

  function factionCard(f) {
    return `<article class="card fac">
      <div class="fac-h">${F.text(`factions#${f.id}.name`, f.name, { ph: 'Faction or power', cls: 'fac-name', label: 'Faction name' })}
        <button type="button" class="ib sm" data-act="delFaction" data-id="${f.id}" aria-label="Delete faction">${OB.icon('trash')}</button></div>
      <div class="fac-g">
        ${F.text(`factions#${f.id}.type`, f.type, { ph: 'Type', label: 'Faction type' })}
        ${F.text(`factions#${f.id}.influence`, f.influence, { ph: 'Influence', label: 'Influence' })}
        ${F.text(`factions#${f.id}.sphere`, f.sphere, { ph: 'Sphere', label: 'Sphere' })}
      </div>
      ${F.area(`factions#${f.id}.notes`, f.notes, { rows: 2, ph: 'Projects, relationship, notes', label: 'Faction notes' })}
    </article>`;
  }

  OB.v.campaign = function () {
    const c = OB.char();
    c.truths = c.truths || {};
    OB.TRUTHS.forEach(t => { c.truths[t.key] = c.truths[t.key] || {}; });
    return `<section class="card camp-name">
        <label class="fl">Campaign name${F.text('campaignName', c.campaignName, { ph: 'New Campaign - ' + (c.name || 'Name'), cls: 'big-in', label: 'Campaign name' })}</label>
      </section>
      ${OB.band('truths', 'Your truths', `<span class="muted small">Pick one, write your own, or roll.</span>`,
        `<div class="truth-grid">${OB.TRUTHS.map(t => truthCard(t, c.truths)).join('')}</div>`)}
      ${OB.band('factions', 'Factions', OB.bandBtn('addFaction', '', 'New faction'),
        `<div class="fac-grid">${c.factions.map(factionCard).join('') || '<p class="muted empty">No factions yet. Add the powers that rule this story.</p>'}</div>`)}
      ${OB.band('campnotes', 'Campaign notes', '',
        F.area('campaignNotes', c.campaignNotes, { rows: 6, ph: 'Session summaries, open questions, secrets…', label: 'Campaign notes', cls: 'notes-big' }))}`;
  };

})(window.OB);
