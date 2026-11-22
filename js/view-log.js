/* ==========================================================================
   OATHBOUND — dice panel and roll log
   ========================================================================== */
(function (OB) {
  'use strict';
  const E = OB.esc;
  const HITN = ['MISS', 'WEAK HIT', 'STRONG HIT'];
  const HITC = ['miss', 'weak', 'strong'];

  const time = ts => { const d = new Date(ts); return d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0'); };

  function dice(e) {
    const beat = d => (e.score > d) ? 'beat' : (e.burned && e.mom > d ? 'burn' : 'lose');
    const die = (v, cls) => `<span class="die ${cls}">${v}</span>`;
    const actionPart = e.kind === 'progress'
      ? `<span class="term"><small>Progress</small><b>${e.score}</b></span>`
      : `<span class="term"><small>d6</small>${e.cancelled ? `<span class="die d6 cancel" title="Cancelled by negative momentum">${e.d6}</span>` : die(e.d6, 'd6')}</span>
         <span class="op">+</span><span class="term"><small>${E(e.statName || 'stat')}</small><b>${OB.sgn(e.statVal)}</b></span>
         ${e.add ? `<span class="op">+</span><span class="term"><small>add</small><b>${OB.sgn(e.add)}</b></span>` : ''}
         <span class="op">=</span><span class="term score"><small>score</small><b>${e.score}</b></span>`;
    return `<div class="roll-math">${actionPart}<span class="vs">vs</span>
      <span class="term"><small>d10</small>${die(e.c1, 'd10 ' + beat(e.c1))}</span><span class="term"><small>d10</small>${die(e.c2, 'd10 ' + beat(e.c2))}</span></div>`;
  }

  function chips(e, c) {
    const out = [];
    const m = e.move ? OB.MOVE[e.move] : null;
    const hn = HITC[e.hit];
    const applied = e.applied || {};
    // deterministic effects from the move
    if (m && m.fx && m.fx[hn]) {
      m.fx[hn].forEach((fx, i) => {
        const k = hn + ':' + i;
        out.push(`<button type="button" class="fx" data-act="applyFx" data-id="${e.id}" data-k="${k}" ${applied[k] ? 'disabled' : ''}>${applied[k] ? '✓ ' : ''}${E(OB.fxLabel(fx))}</button>`);
      });
    }
    // extras attached to the roll
    (e.extras || []).forEach((x, i) => {
      const k = 'x' + i; const done = applied[k];
      let label = x.label;
      if (x.type === 'deb') label = 'Mark ' + OB.DEBILITIES.find(d => d.key === x.key).name.toLowerCase();
      if (x.type === 'table') label = 'Roll the ' + OB.MOVE[x.move].tableName.replace(/ table$/, '') + ' table';
      out.push(`<button type="button" class="fx ${x.type}" data-act="applyExtra" data-id="${e.id}" data-i="${i}" ${done ? 'disabled' : ''}>${done ? '✓ ' : ''}${E(label)}</button>`);
    });
    if (!m) return out.join('');
    const hit = e.hit > 0;
    const open = kind => c.tracks.filter(t => t.kind === kind && !t.done);
    // special follow-ups
    if (e.kind === 'action' && m.markOnHit && hit) {
      open('journey').forEach(t => { const k = 'mk' + t.id; out.push(`<button type="button" class="fx" data-act="markFromRoll" data-id="${e.id}" data-track="${t.id}" data-k="${k}" ${applied[k] ? 'disabled' : ''}>${applied[k] ? '✓ ' : ''}Mark progress: ${E(t.name || 'journey')}</button>`); });
    }
    if (e.kind === 'action' && m.bondOnHit && hit) out.push(`<button type="button" class="fx" data-act="bondFromRoll" data-id="${e.id}" ${applied.bond ? 'disabled' : ''}>${applied.bond ? '✓ ' : ''}Add bond (+1 tick)</button>`);
    if (e.kind === 'action' && m.harm && hit) {
      const base = e.weaponHarm || OB.baseHarm(c);
      const bonus = e.bonusHarm || 0;
      const h = OB.harmFor(e, base, bonus);
      out.push(`<div class="harm-box"><span>Harm: <b>${h}</b> <small class="muted">(${base === 2 ? 'deadly weapon 2' : 'unarmed/simple 1'}${e.move === 'Strike' && e.hit === 2 ? ' +1 strong' : ''}${bonus ? ' ' + OB.sgn(bonus) + ' bonus' : ''})</small></span>
        <button type="button" class="step" data-act="bonusHarm" data-id="${e.id}" data-d="-1" aria-label="Less bonus harm">−</button><button type="button" class="step" data-act="bonusHarm" data-id="${e.id}" data-d="1" aria-label="More bonus harm">+</button>
        <button type="button" class="chip ${base === 2 ? 'on' : ''}" data-act="weapon" data-id="${e.id}" data-h="${base === 2 ? 1 : 2}" title="Change base harm for this attack">${base === 2 ? 'Deadly weapon' : 'Unarmed / simple'}</button></div>`);
      open('fight').forEach(t => { const k = 'hf' + t.id; out.push(`<button type="button" class="fx" data-act="harmFromRoll" data-id="${e.id}" data-track="${t.id}" data-k="${k}" ${applied[k] ? 'disabled' : ''}>${applied[k] ? '✓ ' : ''}Inflict ${h} on ${E(t.name || 'foe')}</button>`); });
    }
    if (e.kind === 'progress' && e.trackId && e.trackId !== 'bonds') {
      const t = c.tracks.find(x => x.id === e.trackId);
      if (t) {
        if (hit) {
          const lbl = t.kind === 'oath' ? `Complete oath${OB.OATH_XP[t.rank] ? ' · +' + OB.OATH_XP[t.rank][e.hit === 2 ? 0 : 1] + ' XP' : ''}` : t.kind === 'fight' ? 'Foe defeated: mark done' : t.kind === 'journey' ? 'Journey complete: mark done' : 'Mark done';
          out.push(`<button type="button" class="fx" data-act="completeFromRoll" data-id="${e.id}" ${applied.done ? 'disabled' : ''}>${applied.done ? '✓ ' : ''}${lbl}</button>`);
        } else if (t.kind === 'oath') {
          out.push(`<button type="button" class="fx" data-act="recommit" data-id="${e.id}" ${applied.rec ? 'disabled' : ''}>Recommit: clear all but one, raise rank</button><button type="button" class="fx" data-act="forsakeFromRoll" data-id="${e.id}" ${applied.rec ? 'disabled' : ''}>Forsake Your Oath</button>`);
        } else if (t.kind === 'journey') {
          out.push(`<button type="button" class="fx" data-act="recommit" data-id="${e.id}" ${applied.rec ? 'disabled' : ''}>Lost: clear all but one, raise rank</button>`);
        }
      }
    }
    if (m.oracle === 'miscast' && e.hit === 0) out.push(`<button type="button" class="fx" data-act="rollOracle" data-key="miscast">Roll Miscast</button>`);
    if (m.oracle !== 'price' && e.hit === 0 && e.kind === 'action' && m.name !== 'Pay the Price' && m.miss && /Pay the Price/.test(m.miss)) out.push(`<button type="button" class="fx" data-act="rollOracle" data-key="price">Roll Pay the Price</button>`);
    return out.join('');
  }

  function actionCard(e, c) {
    const m = e.move ? OB.MOVE[e.move] : null;
    const hn = HITC[e.hit];
    const text = m ? m[hn] : null;
    return `<div class="roll hit-${hn}" data-roll="${e.id}">
      <div class="roll-head"><b>${E(e.label)}</b><time>${time(e.ts)}</time></div>
      ${dice(e)}
      <div class="roll-result"><span class="res ${hn}">${HITN[e.hit]}</span>${e.match ? '<span class="tag match">MATCH</span>' : ''}${e.burned ? '<span class="tag burn">momentum burned</span>' : ''}${e.cancelled ? '<span class="tag">action die cancelled</span>' : ''}${e.kind === 'progress' ? '<span class="tag">progress roll</span>' : ''}</div>
      ${e.match ? '<p class="match-note">A match: add a twist, a complication, or an opportunity. Extreme results are as dramatic as they get.</p>' : ''}
      ${e.burn ? `<button type="button" class="burn-btn" data-act="burn" data-id="${e.id}">🔥 Burn momentum ${OB.sgn(e.burn.mom)} → ${HITN[e.burn.hit].toLowerCase()} (momentum resets to ${OB.sgn(e.burn.reset)})</button>` : ''}
      ${text ? `<div class="roll-text">${OB.md(text)}</div>` : ''}
      ${e.note ? `<p class="muted small">${E(e.note)}</p>` : ''}
      <div class="chips-row">${chips(e, c)}</div>
    </div>`;
  }

  function oracleCard(e) {
    const part = p => `<div class="part"><span class="pt">${E(p.title)}</span><span class="pr">${E(String(p.roll))}</span><span class="ptext">${E(p.text)}${p.match ? ' <span class="tag match">MATCH</span>' : ''}</span>
      ${(p.more || []).map(s => `<div class="more"><span class="pr">↳ ${E(String(s.roll))}</span><span class="ptext">${E(s.text)}</span></div>`).join('')}</div>`;
    const joined = e.joined ? `<div class="joined">${E(e.joined)}</div>` : '';
    return `<div class="roll oracle" data-roll="${e.id}"><div class="roll-head"><b>${E(e.label)}</b><time>${time(e.ts)}</time></div>${joined}${e.parts.map(part).join('')}</div>`;
  }

  function askCard(e) {
    return `<div class="roll ask ${e.yes ? 'hit-strong' : 'hit-miss'}" data-roll="${e.id}"><div class="roll-head"><b>${E(e.label)}</b><time>${time(e.ts)}</time></div>
      <div class="roll-math"><span class="term"><small>d100</small><span class="die d100">${e.roll}</span></span><span class="vs">needs ${e.min}+</span></div>
      <div class="roll-result"><span class="res ${e.yes ? 'strong' : 'miss'}">${e.yes ? 'YES' : 'NO'}</span>${e.match ? '<span class="tag match">MATCH — extreme or a twist</span>' : ''}</div></div>`;
  }

  function entry(e, c) {
    const html = entryHtml(e, c);
    return (Date.now() - e.ts < 900) ? html.replace('class="roll', 'class="roll fresh') : html;
  }
  function entryHtml(e, c) {
    if (e.kind === 'action' || e.kind === 'progress') return actionCard(e, c);
    if (e.kind === 'oracle') return oracleCard(e);
    if (e.kind === 'ask') return askCard(e);
    if (e.kind === 'die') return `<div class="roll" data-roll="${e.id}"><div class="roll-head"><b>${E(e.label)}</b><time>${time(e.ts)}</time></div><div class="roll-math"><span class="die d10 big">${e.value}</span></div></div>`;
    if (e.kind === 'note') return `<div class="roll note" data-roll="${e.id}"><div class="roll-head"><b>Note</b><time>${time(e.ts)}</time></div><p>${E(e.text)}</p><div class="chips-row">${chips(e, c)}</div></div>`;
    return '';
  }

  OB.renderDice = function () {
    const c = OB.char();
    const el = document.getElementById('dice');
    if (!el) return;
    const prog = c.tracks.filter(t => !t.done && ['oath', 'journey', 'fight', 'ritual', 'other'].includes(t.kind));
    el.innerHTML = `
            <div class="dice-controls">
        <div class="lbl">Action roll <small class="muted">d6 + stat + adds vs 2d10</small></div>
        <div class="statrow">${OB.STATS.map(s => `<button type="button" class="statbtn" data-act="rollStat" data-k="${s.key}" title="Roll +${s.name.toLowerCase()}"><span>${s.short}</span><b>${OB.sgn(c.stats[s.key])}</b></button>`).join('')}</div>
        <div class="statrow">
          <button type="button" class="statbtn" data-act="rollStat" data-k="health"><span>Health</span><b>${OB.sgn(c.health)}</b></button>
          <button type="button" class="statbtn" data-act="rollStat" data-k="spirit"><span>Spirit</span><b>${OB.sgn(c.spirit)}</b></button>
          <button type="button" class="statbtn" data-act="rollStat" data-k="supply"><span>Supply</span><b>${OB.sgn(c.supply)}</b></button>
          <button type="button" class="statbtn" data-act="rollStat" data-k="none"><span>No stat</span><b>0</b></button>
        </div>
        <div class="add-row"><span class="lbl">Add</span><button type="button" class="step" data-act="adds" data-d="-1" aria-label="Lower add">−</button><span class="add-val">${OB.sgn(OB.ui.add)}</span><button type="button" class="step" data-act="adds" data-d="1" aria-label="Raise add">+</button>
          <button type="button" class="chip" data-act="adds" data-set="1">+1 bond</button><button type="button" class="chip" data-act="adds" data-set="0">0</button></div>
        <div class="add-row">
          <select id="dp-track" aria-label="Progress track"><option value="">Progress roll…</option>${prog.map(t => `<option value="${t.id}">${E(t.name || '(unnamed)')} — ${t.kind}, ${OB.boxes(t)}/10</option>`).join('')}${c.bonds.length ? '<option value="bonds">Bonds</option>' : ''}</select>
          <button type="button" class="btn small" data-act="rollProgressPanel">Roll</button></div>
        <div class="add-row"><span class="lbl">Oracle</span><button type="button" class="btn small" data-act="rollD100">d100</button><button type="button" class="btn small ghost" data-act="rollDie" data-n="6">d6</button><button type="button" class="btn small ghost" data-act="rollDie" data-n="10">d10</button><button type="button" class="btn small ghost" data-act="rollDie" data-n="20">d20</button><button type="button" class="btn small ghost" data-act="diceStyle" title="3D dice style">Style</button></div>
      </div>
      <div class="log-head"><span class="lbl">Roll log</span><button type="button" class="btn small ghost" data-act="clearLog" ${c.log.length ? '' : 'disabled'}>Clear</button></div>
      <div class="log" aria-live="polite">${c.log.filter(e => !e.hold).map(e => entry(e, c)).join('') || '<p class="muted empty">Your rolls appear here.</p>'}</div>`;
  };

  OB.flashLog = function () {
    const fab = document.getElementById('drawer-fab');
    if (fab) { fab.classList.remove('pulse'); void fab.offsetWidth; fab.classList.add('pulse'); }
  };
})(window.OB);
