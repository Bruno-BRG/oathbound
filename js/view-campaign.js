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
    return `${OB.banner('banner-ruins', 'Campaign', 'Your truths shape the world. Factions and notes keep the story straight.')}
      <section class="card camp-name">
        <label class="fl">Campaign name${F.text('campaignName', c.campaignName, { ph: 'New Campaign - ' + (c.name || 'Name'), cls: 'big-in', label: 'Campaign name' })}</label>
      </section>
      ${OB.band('truths', 'Your truths', `<span class="muted small">Pick one, write your own, or roll.</span>`,
        `<div class="truth-grid">${OB.TRUTHS.map(t => truthCard(t, c.truths)).join('')}</div>`)}
      ${OB.band('factions', 'Factions', OB.bandBtn('addFaction', '', 'New faction'),
        `<div class="fac-grid">${c.factions.map(factionCard).join('') || '<p class="muted empty">No factions yet. Add the powers that rule this story.</p>'}</div>`)}
      ${OB.band('campnotes', 'Campaign notes', '',
        F.area('campaignNotes', c.campaignNotes, { rows: 6, ph: 'Session summaries, open questions, secrets…', label: 'Campaign notes', cls: 'notes-big' }))}`;
  };

  /* ---------- Amarin: hex map over the book map ---------- */
  OB.MAP = { w: 1400, h: 991, r: 34 };            // map.jpg is 1400×991; hex radius in px

  function hexSvg(c, sel) {
    const { w: W, h: H, r } = OB.MAP;
    const hw = Math.sqrt(3) * r;
    const cols = Math.ceil(W / hw) + 1, rows = Math.ceil((H - r) / (1.5 * r)) + 1;
    const corners = (cx, cy) => [0, 1, 2, 3, 4, 5].map(k => {
      const a = (60 * k - 30) * Math.PI / 180;
      return (cx + r * Math.cos(a)).toFixed(1) + ',' + (cy + r * Math.sin(a)).toFixed(1);
    }).join(' ');
    let polys = '', labels = '';
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cx = col * hw + (row % 2) * (hw / 2) + hw / 2, cy = row * 1.5 * r + r;
        if (cx - hw / 2 > W || cy - r > H) continue;
        const k = col + ',' + row, hx = c.hexes[k];
        const marked = !!(hx && (hx.name || hx.control || hx.note));
        const cls = ['hx', marked ? 'marked' : '', sel === k ? 'sel' : ''].join(' ');
        polys += `<polygon class="${cls}" points="${corners(cx, cy)}" data-act="hexSel" data-k="${k}" tabindex="0" role="button" aria-label="${E(marked ? (hx.name || 'Marked hex') : 'Hex ' + k)}"><title>${E(marked ? (hx.name || 'Marked hex') : 'Hex ' + k)}</title></polygon>`;
        if (hx && hx.name) labels += `<text x="${cx.toFixed(1)}" y="${(cy + 5).toFixed(1)}" class="hx-l" text-anchor="middle">${E(hx.name.slice(0, 18))}</text>`;
      }
    }
    return `<svg class="hexmap" viewBox="0 0 ${W} ${H}" role="group" aria-label="Map of the Amarin, hex grid">
      <image href="assets/map.jpg" x="0" y="0" width="${W}" height="${H}" preserveAspectRatio="none"></image>
      <g class="hxs">${polys}</g><g class="hxl">${labels}</g></svg>`;
  }

  function hexEditor(c, k) {
    const h = c.hexes[k] || { name: '', control: '', note: '' };
    return `<div class="hex-h"><span class="hex-coord">${OB.icon('hex')} Hex ${E(k)}</span>
        <button type="button" class="btn sm ghost" data-act="hexClear" data-k="${k}">Clear</button></div>
      <label class="fl">Place name${F.text(`hexes.${k}.name`, h.name, { ph: 'Name this place', label: 'Place name' })}</label>
      <label class="fl">Control${F.text(`hexes.${k}.control`, h.control, { ph: 'Faction, power, or nobody', label: 'Control' })}</label>
      <label class="fl">Notes${F.area(`hexes.${k}.note`, h.note, { rows: 4, ph: 'What is here?', label: 'Hex notes' })}</label>
      <div class="row gap wrap"><button type="button" class="btn sm primary" data-act="hexRollPlace">${OB.icon('dice')}Roll a place</button></div>`;
  }

  OB.v.amarin = function () {
    const c = OB.char();
    const regions = OB.REGIONS.map(r => r.name);
    const reg = c.region || regions[0];
    const info = OB.REGION_INFO[reg] || { text: '', features: [], quests: [] };
    const sel = OB.ui.hex || null;
    const h = sel ? (c.hexes[sel] || { name: '', control: '', note: '' }) : null;
    const marked = Object.keys(c.hexes).filter(k => c.hexes[k] && (c.hexes[k].name || c.hexes[k].control || c.hexes[k].note));
    const field = (label, path, val, ph) => sel
      ? `<label class="fl">${label}${F.text(path, val, { ph, label })}</label>`
      : `<label class="fl">${label}<input type="text" disabled placeholder="Click a hex"></label>`;
    return `<div class="sector-bar">
        <label class="fl">Region<select data-act-change="setRegion" aria-label="Region">${regions.map(r => `<option ${r === reg ? 'selected' : ''}>${E(r)}</option>`).join('')}</select></label>
        ${field('Place', `hexes.${sel}.name`, h && h.name, 'Name this place')}
        ${field('Faction/Control', `hexes.${sel}.control`, h && h.control, 'Faction, power, or nobody')}
        <div class="sector-btns"><button type="button" class="ib" data-act="hexRollPlace" ${sel ? '' : 'disabled'} title="Roll a place" aria-label="Roll a place">${OB.icon('dice')}</button>
          <button type="button" class="ib" data-act="hexClear" data-k="${sel || ''}" ${sel ? '' : 'disabled'} title="Clear this hex" aria-label="Clear this hex">${OB.icon('trash')}</button></div>
      </div>
      <div class="map-wrap">${hexSvg(c, sel)}</div>
      ${sel ? `<label class="fl">Hex ${E(sel)} notes${F.area(`hexes.${sel}.note`, h.note, { rows: 3, ph: 'What is here?', label: 'Hex notes' })}</label>` : ''}
      ${OB.band('region', reg, '', `<p class="region-text">${E(info.text)}</p>
        <h5>Features</h5><ul>${info.features.map(f => `<li>${E(f)}</li>`).join('')}</ul>
        <h5>Quest starters</h5><ul>${info.quests.map(f => `<li>${E(f)}</li>`).join('')}</ul>
        <button type="button" class="btn sm ghost" data-act="regionNote" data-name="${E(reg)}">Add a quest starter to the journal</button>`)}
      ${OB.band('places', 'Marked places', `<span class="pill">${marked.length}</span>`, marked.length ? `<ul class="places">${marked.map(k => `<li><button type="button" class="link" data-act="hexSel" data-k="${k}">${E(c.hexes[k].name || 'Unnamed')}</button> <span class="muted small">${E(c.hexes[k].control || '')} · hex ${E(k)}</span></li>`).join('')}</ul>` : '<p class="muted">Nothing marked yet.</p>')}`;
  };
})(window.OB);
