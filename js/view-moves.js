/* ==========================================================================
   OATHBOUND — Moves tab
   ========================================================================== */
(function (OB) {
  'use strict';
  const E = OB.esc;

  const PROGRESS_KIND = { oath: 'oath', journey: 'journey', fight: 'fight', ritual: 'ritual' };

  function trackOptions(c, kind) {
    const list = c.tracks.filter(t => t.kind === kind && !t.done);
    return list.map(t => `<option value="${t.id}">${E(t.name || '(unnamed)')} — ${OB.RANK[t.rank].name} (${OB.boxes(t)}/10)</option>`).join('');
  }

  function widget(m, c) {
    const id = OB.slug(m.name);
    const out = [];

    // plain stat rolls
    if (m.roll && !m.special) {
      out.push(`<div class="rollrow">${m.roll.map(r => {
        const v = OB.statValue(c, r.stat);
        return `<button type="button" class="rollbtn" data-act="rollMove" data-move="${E(m.name)}" data-stat="${r.stat}" title="${E(r.hint || r.label)}"><span>${E(r.label)}</span><b>${OB.sgn(v)}</b></button>`;
      }).join('')}</div>`);
    }

    // progress moves
    if (m.progress) {
      if (m.progress === 'bond') {
        out.push(`<div class="rollrow"><button type="button" class="rollbtn prog" data-act="rollProgress" data-track="bonds" data-move="${E(m.name)}"><span>Roll your bonds</span><b>${Math.min(10, Math.floor(c.bonds.length / 4))}</b></button></div>`);
      } else {
        const opts = trackOptions(c, PROGRESS_KIND[m.progress]);
        out.push(opts
          ? `<div class="rollrow"><select id="pt-${id}" aria-label="Track">${opts}</select><button type="button" class="rollbtn prog" data-act="rollProgressSel" data-sel="pt-${id}" data-move="${E(m.name)}"><span>Roll progress</span></button></div>`
          : `<p class="muted small">No open ${m.progress} track. <a href="#" data-act="newTrack" data-kind="${m.progress}">Create one</a>.</p>`);
      }
    }

    switch (m.special) {
      case 'harm':
      case 'stress': {
        const k = m.special;
        out.push(`<div class="rollrow"><label class="inl">${k === 'harm' ? 'Harm' : 'Stress'} <input type="number" min="0" max="12" value="1" id="en-${k}" class="mini" aria-label="Amount"></label>
          <button type="button" class="rollbtn" data-act="endure" data-kind="${k}"><span>Endure ${k === 'harm' ? 'Harm' : 'Stress'}</span></button></div>
          <p class="muted small">Applies −${k === 'harm' ? 'health' : 'spirit'} first, passes overflow to momentum, then rolls the higher of ${k === 'harm' ? 'health or strength' : 'presence or spirit'}.</p>`);
        break;
      }
      case 'companion': {
        const comps = c.assets.filter(a => a.type === 'companion');
        out.push(comps.length ? `<div class="rollrow"><select id="ce-sel" aria-label="Companion">${comps.map(a => `<option value="${a.id}">${E(a.name || 'Companion')} (health ${a.health})</option>`).join('')}</select>
          <input type="number" min="0" max="9" value="1" id="ce-amt" class="mini" aria-label="Harm"><button type="button" class="rollbtn" data-act="compEndureSel"><span>Roll</span></button></div>` : '<p class="muted small">Add a companion in Assets first.</p>');
        break;
      }
      case 'forsake': {
        const opts = trackOptions(c, 'oath');
        out.push(opts ? `<div class="rollrow"><select id="fo-sel" aria-label="Oath">${opts}</select><button type="button" class="rollbtn" data-act="forsakeSel"><span>Forsake and Endure Stress</span></button></div>` : '<p class="muted small">No open oath.</p>');
        break;
      }
      case 'advance':
        out.push(`<div class="rollrow"><button type="button" class="rollbtn" data-act="advance" data-n="3"><span>New asset</span><b>−3 XP</b></button><button type="button" class="rollbtn" data-act="advance" data-n="2"><span>Upgrade asset</span><b>−2 XP</b></button><span class="muted small">Available: ${OB.xpAvail(c)} XP</span></div>`);
        break;
      case 'ascend':
        out.push(`<div class="rollrow"><button type="button" class="rollbtn prog" data-act="ascend" ${OB.tierEligible(c) ? '' : 'disabled'}><span>${OB.tierEligible(c) ? 'Ascend to tier ' + OB.tierEligible(c) : 'Not ready'}</span></button></div>`);
        break;
      case 'price':
        out.push(`<div class="rollrow"><button type="button" class="rollbtn" data-act="rollOracle" data-key="price"><span>Roll the Pay the Price table</span></button></div>`);
        break;
      case 'ask':
        out.push(`<div class="rollrow">${OB.ODDS.map(o => `<button type="button" class="rollbtn" data-act="rollAsk" data-odds="${o.key}"><span>${o.name}</span><b>${o.min}+</b></button>`).join('')}</div>`);
        break;
    }

    if (m.name === 'Cast a Spell') {
      out.push(`<div class="rollrow">${OB.SCOPES.map(s => `<button type="button" class="rollbtn" data-act="castSpell" data-scope="${s.key}" title="${E(s.ex)}"><span>${s.name}</span><b>${s.cost} focus</b></button>`).join('')}</div>
        <p class="muted small">Rolls +${E(OB.statLabel(c, 'casting').toLowerCase())}. Focus now ${c.focus}/${OB.maxFocus(c)}. With no fitting spell asset, the cost is one step higher.</p>`);
    }
    if (m.milestone) {
      const opts = trackOptions(c, 'oath');
      out.push(opts ? `<div class="rollrow"><select id="ms-sel" aria-label="Oath">${opts}</select><button type="button" class="rollbtn" data-act="milestoneSel"><span>Mark milestone</span></button></div>` : '<p class="muted small">No open oath.</p>');
    }
    if (m.name === 'Swear an Oath') {
      out.push(`<div class="rollrow wrap"><input type="text" id="so-name" placeholder="Your oath…" aria-label="Oath text" class="grow">${OB.rankSelect('so-rank', 'dangerous')}
        <button type="button" class="rollbtn" data-act="swearOath"><span>Swear +presence</span><b>${OB.sgn(c.stats.presence)}</b></button></div>
        <p class="muted small">Creates the oath track, then rolls. If the oath is made to someone you share a bond with, add +1 in the dice panel first.</p>`);
    }
    if (m.name === 'Enter the Fray') {
      out.push(`<div class="rollrow wrap"><input type="text" id="ef-name" placeholder="Foe name…" aria-label="Foe name" class="grow">${OB.rankSelect('ef-rank', 'dangerous')}<button type="button" class="rollbtn" data-act="addFoeQuick"><span>Add foe track</span></button></div>`);
    }
    if (m.name === 'Undertake a Journey') {
      out.push(`<div class="rollrow wrap"><input type="text" id="uj-name" placeholder="Journey…" aria-label="Journey name" class="grow">${OB.rankSelect('uj-rank', 'dangerous')}<button type="button" class="rollbtn" data-act="newJourney"><span>Set a journey</span></button></div>
        <p class="muted small">Travel rank: moderate distance = troublesome; long or rough = dangerous; region to region = formidable; several regions = extreme; end to end = epic.</p>`);
    }
    if (m.oracle === 'miscast') {
      out.push(`<div class="rollrow"><button type="button" class="rollbtn" data-act="rollOracle" data-key="miscast"><span>Roll Miscast</span></button></div>`);
    }
    return out.join('');
  }

  function outcome(label, cls, text) {
    return text ? `<div class="out ${cls}"><span class="out-k">${label}</span><div>${OB.md(text)}</div></div>` : '';
  }

  function card(m, c) {
    const key = 'move:' + m.name;
    const open = OB.ui.open[key] != null ? OB.ui.open[key] : false;
    const badge = m.progress ? '<span class="pill prog">Progress move</span>' : m.info ? '<span class="pill">Reference</span>' : '';
    const table = m.table ? `<details class="acc"><summary>${E(m.tableName)} (d100)</summary><div class="acc-body"><table class="otable">${m.table.map((r, i) => `<tr><td class="n">${i ? m.table[i - 1][0] + 1 : 1}–${r[0]}</td><td>${OB.md(r[1]).replace(/^<p>|<\/p>$/g, '')}</td></tr>`).join('')}</table>
      <button type="button" class="btn small" data-act="rollTableData" data-move="${E(m.name)}">Roll this table</button></div></details>` : '';
    return `<details class="move cat-${m.cat}" id="mv-${OB.slug(m.name)}" data-key="${E(key)}" ${open ? 'open' : ''}>
      <summary><span class="mname">${E(m.name)}</span>${badge}<span class="mcat">${OB.cap(m.cat)}</span></summary>
      <div class="move-body">
        <p class="trigger"><strong>When</strong> ${OB.md(m.trigger).replace(/^<p>/, '').replace(/<\/p>$/, '')}</p>
        ${widget(m, c)}
        <div class="outs">${outcome('Strong hit', 'strong', m.strong)}${outcome('Weak hit', 'weak', m.weak)}${outcome('Miss', 'miss', m.miss)}</div>
        ${table}
      </div>
    </details>`;
  }

  OB.drawerMoves = function () {
    const c = OB.char();
    const q = OB.ui.moveFilter.toLowerCase().trim();
    const catSel = OB.ui.moveCat;
    const match = m => (catSel === 'all' || m.cat === catSel) && (!q || (m.name + ' ' + m.trigger + ' ' + (m.strong || '') + ' ' + (m.weak || '') + ' ' + (m.miss || '')).toLowerCase().includes(q));
    const cats = OB.MOVE_CATS.map(cat => {
      const list = OB.MOVES.filter(m => m.cat === cat.key && match(m));
      if (!list.length) return '';
      return `<section class="move-cat"><h3 class="cat-title"><span>${cat.name} moves</span></h3>${list.map(m => card(m, c)).join('')}</section>`;
    }).join('');
    return `      <div class="filters">
        <input type="search" id="move-search" placeholder="Search moves…" value="${E(OB.ui.moveFilter)}" aria-label="Search moves">
        <div class="chips" role="group" aria-label="Move category">
          <button type="button" class="chip ${catSel === 'all' ? 'on' : ''}" data-act="moveCat" data-cat="all">All</button>
          ${OB.MOVE_CATS.map(x => `<button type="button" class="chip ${catSel === x.key ? 'on' : ''}" data-act="moveCat" data-cat="${x.key}">${x.name}</button>`).join('')}
        </div>
        <div class="row gap"><button type="button" class="btn small ghost" data-act="expandMoves" data-open="1">Expand all</button><button type="button" class="btn small ghost" data-act="expandMoves" data-open="0">Collapse all</button></div>
      </div>
      <p class="muted small">Roll: d6 + stat + adds against two d10. Strong hit beats both dice. Weak hit beats one. Ties go to the challenge dice. Use the dice panel to set an <em>add</em> before you roll.</p>
      ${cats || '<p class="muted empty">No moves match.</p>'}`;
  };
})(window.OB);
