/* ==========================================================================
   OATHBOUND — Oracles tab and Foes tab
   ========================================================================== */
(function (OB) {
  'use strict';
  const E = OB.esc;

  const COMBOS = [
    { id: 'actiontheme', title: 'Action + Theme', hint: 'Read the pair for a discovery, event, or situation.', keys: ['action', 'theme'] },
    { id: 'npc', title: 'Character', hint: 'Role, goal, and descriptor.', keys: ['role', 'goal', 'descriptor'] },
    { id: 'settlement', title: 'Settlement', hint: 'Type, name, and trouble.', keys: ['settype', 'setquick', 'settrouble'] },
    { id: 'place', title: 'Place', hint: 'Region, location, and descriptor.', keys: ['region', 'location', 'locdesc'] },
    { id: 'ruin', title: 'Ruin', hint: 'A feature and a danger.', keys: ['ruinfeature', 'ruindanger'] },
    { id: 'coast', title: 'Coast', hint: 'A place at sea, and its descriptor.', keys: ['coastal', 'locdesc'] }
  ];

  function tableRows(t) {
    const one = rows => rows.map((r, i) => `<tr><td class="n">${i ? (rows[i - 1][0] + 1 === r[0] ? r[0] : (rows[i - 1][0] + 1) + '–' + r[0]) : (r[0] === 1 ? 1 : '1–' + r[0])}</td><td>${E(r[1])}</td></tr>`).join('');
    if (t.pair) return `<div class="two-tables"><table class="otable">${one(t.a)}</table><table class="otable">${one(t.b)}</table></div>`;
    return `<table class="otable">${one(t.rows)}</table>`;
  }

  OB.oracleTable = k => tableRows(OB.ORACLES[k]);

  OB.v.oracles = function () {
    const q = OB.ui.oracleFilter.toLowerCase().trim();
    const grp = OB.ui.oracleGroup;
    const heritages = OB.HERITAGES.map(h => h.key);
    const nameSel = OB.ui.nameHeritage || (OB.char().heritage || 'Human');
    const quick = `<section class="quick-oracles">
      <article class="card">
        ${OB.sectionHead('Ask the Oracle')}
        <p class="muted small">Decide the odds of a “yes”, then roll d100. The answer is yes if you roll the number shown or higher. A match means an extreme result or a twist.</p>
        <div class="odds">${OB.ODDS.map(o => `<button type="button" class="odd" data-act="rollAsk" data-odds="${o.key}"><span>${o.name}</span><b>${o.min}+</b></button>`).join('')}</div>
      </article>
      <article class="card">
        ${OB.sectionHead('Name')}
        <div class="row gap wrap">
          <select id="name-her" aria-label="Heritage for the name" data-act-change="nameHeritage">${heritages.map(h => `<option ${h === nameSel ? 'selected' : ''}>${h}</option>`).join('')}</select>
          <label class="chk"><input type="checkbox" id="name-fam" checked><span class="box"></span><span>Family name or epithet</span></label>
          <button type="button" class="btn primary" data-act="rollName">Roll a name</button>
        </div>
        <p class="muted small">Many folk of the Amarin take names from other peoples. Roll on any table you like.</p>
      </article>
      ${COMBOS.map(cb => `<article class="card combo"><div class="sec-head"><h3>${cb.title}</h3><button type="button" class="btn small primary" data-act="rollCombo" data-id="${cb.id}">Roll</button></div><p class="muted small">${cb.hint}</p></article>`).join('')}
    </section>`;

    const keys = Object.keys(OB.ORACLES).filter(k => {
      const t = OB.ORACLES[k];
      if (grp !== 'all' && t.group !== grp) return false;
      if (q && !(t.title + ' ' + (t.hint || '')).toLowerCase().includes(q)) return false;
      return true;
    });
    const groups = OB.ORACLE_GROUPS.filter(g => keys.some(k => OB.ORACLES[k].group === g));
    const body = groups.map(g => `<section class="o-group"><h3 class="cat-title"><span>${g}</span></h3>
      <div class="o-grid">${keys.filter(k => OB.ORACLES[k].group === g).map(k => {
        const t = OB.ORACLES[k];
        const key = 'oracle:' + k;
        return `<details class="oracle" data-key="${key}" ${OB.ui.open[key] ? 'open' : ''}>
          <summary><span class="oname">${E(t.title)}</span><button type="button" class="btn small primary" data-act="rollOracle" data-key="${k}" onclick="event.stopPropagation()">Roll</button></summary>
          <div class="acc-body">${t.hint ? `<p class="muted small">${E(t.hint)}</p>` : ''}${OB.ui.open[key] ? tableRows(t) : ''}</div></details>`;
      }).join('')}</div></section>`).join('');

    return `${OB.banner('oracle', 'Oracles', 'Ask what happens. In solo or co-op play, the oracle is your game master.')}
      ${quick}
      <div class="filters">
        <input type="search" id="oracle-search" placeholder="Search oracles…" value="${E(OB.ui.oracleFilter)}" aria-label="Search oracles">
        <div class="chips" role="group" aria-label="Oracle group">
          <button type="button" class="chip ${grp === 'all' ? 'on' : ''}" data-act="oracleGroup" data-g="all">All</button>
          ${OB.ORACLE_GROUPS.map(g => `<button type="button" class="chip ${grp === g ? 'on' : ''}" data-act="oracleGroup" data-g="${g}">${g}</button>`).join('')}
        </div>
      </div>
      ${body || '<p class="muted empty">No oracle matches.</p>'}`;
  };

  OB.rollCombo = function (id) {
    const cb = COMBOS.find(x => x.id === id);
    OB.rollOracle(cb.keys, cb.title);
  };
  OB.rollName = function () {
    const her = (document.getElementById('name-her') || {}).value || 'Human';
    const fam = document.getElementById('name-fam');
    const keys = [OB.nameKey(her)];
    if (fam && fam.checked) keys.push('n_family');
    const e = OB.rollOracle(keys, her + ' name');
    // join the parts into one line
    e.joined = e.parts.map(p => p.text).join(' ');
    OB.save(); OB.refresh();
  };

  /* =========================== FOES =========================== */
  function raise(rank, n) {
    const i = OB.RANKS.findIndex(r => r.key === rank);
    return OB.RANKS[Math.min(OB.RANKS.length - 1, i + n)].key;
  }
  OB.addFoe = function (name, rank, suffix) {
    const t = OB.addTrack({ kind: 'fight', name: name + (suffix || ''), rank });
    OB.toast(`${t.name} added to Fights.`);
    OB.refresh();
    return t;
  };
  OB.addPack = function (name, rank, size) {
    if (!['troublesome', 'dangerous'].includes(rank)) { OB.toast('Only troublesome or dangerous foes form a pack.'); return; }
    const n = size === 'large' ? 2 : 1;
    OB.addFoe(name, raise(rank, n), size === 'large' ? ' (large pack, 6–10)' : ' (small pack, 3–5)');
  };

  OB.v.foes = function () {
    const c = OB.char();
    const q = OB.ui.foeFilter.toLowerCase().trim();
    const flat = OB.FOES.flatMap(g => g.list.map(f => f[0]));
    const fights = c.tracks.filter(t => t.kind === 'fight' && !t.done);
    return `${OB.banner('fight', 'Foes', 'Give each foe a rank and a progress track. Harm marks progress by rank.')}
      <article class="card">
        ${OB.sectionHead('Fighting a foe')}
        <div class="rank-table">
          <div class="rt-head"><span>Rank</span><span>Type</span><span>Progress per harm</span><span>Inflicts</span></div>
          ${OB.RANKS.map(r => `<div class="rt-row"><span>${OB.badgeRank(r.key)}</span><span>${r.type}</span><span>${r.foe}</span><span>${r.harm} harm</span></div>`).join('')}
        </div>
        <ul class="plain">
          <li>When you <em>Enter the Fray</em>, give each foe a rank and a standard progress track (10 boxes). When you <em>Strike</em> or <em>Clash</em> and inflict harm, mark progress for each point of harm by the foe’s rank.</li>
          <li>When you fail to defend against a foe’s attack, make <em>Endure Harm</em> and reduce health by the harm the foe inflicts. If it fits the foe, they can also force <em>Endure Stress</em>, put you at a disadvantage, reveal a complication, or create a new danger.</li>
          <li>When you take decisive action to end the fight, tally the progress and make <em>End the Fight</em>.</li>
          <li><strong>Packs:</strong> a group of troublesome or dangerous foes may share one track. A small pack (about 3 to 5) raises the rank by one. A large pack (about 6 to 10) raises it by two. Use the Combat Action oracle to decide what a foe does next.</li>
        </ul>
        <div class="row gap wrap"><button type="button" class="btn small" data-act="rollOracle" data-key="combat">Combat Action oracle</button><button type="button" class="btn small" data-act="rollOracle" data-key="challenge">Challenge Rank oracle</button></div>
      </article>
      ${fights.length ? `<article class="card">${OB.sectionHead('In the fray', `<span class="pill">${fights.length}</span>`)}
        ${fights.map(t => `<div class="fray-row"><div class="fr-name"><strong>${E(t.name || 'Foe')}</strong> ${OB.badgeRank(t.rank)}</div>${OB.trackBoxes(t.ticks)}
          <div class="row gap"><input type="number" min="1" max="12" value="2" id="harm-${t.id}" class="mini" aria-label="Harm"><button type="button" class="btn small" data-act="harmFoe" data-id="${t.id}">Inflict harm</button><button type="button" class="btn small primary" data-act="rollTrack" data-id="${t.id}" data-move="End the Fight">End the Fight</button></div></div>`).join('')}
      </article>` : ''}
      <article class="card">
        ${OB.sectionHead('Pack builder')}
        <div class="row gap wrap">
          <select id="pk-foe" aria-label="Foe">${OB.FOES.map(g => g.list.filter(f => ['troublesome', 'dangerous'].includes(f[1])).map(f => `<option value="${E(f[0])}|${f[1]}">${E(f[0])} (${f[1]})</option>`).join('')).join('')}</select>
          <select id="pk-size" aria-label="Pack size"><option value="small">Small pack (3–5): rank +1</option><option value="large">Large pack (6–10): rank +2</option></select>
          <button type="button" class="btn" data-act="addPack">Add pack to Fights</button>
        </div>
      </article>
      <div class="filters"><input type="search" id="foe-search" placeholder="Search foes…" value="${E(OB.ui.foeFilter)}" aria-label="Search foes"></div>
      <div class="foe-groups">${OB.FOES.map(g => {
        const list = g.list.filter(f => !q || f[0].toLowerCase().includes(q) || g.kind.toLowerCase().includes(q));
        if (!list.length) return '';
        return `<section class="card foe-group"><h3>${g.kind}</h3>${list.map(f => `
          <div class="foe-row"><span class="fname">${E(f[0])}</span>${OB.badgeRank(f[1])}<button type="button" class="btn small" data-act="addFoe" data-name="${E(f[0])}" data-rank="${f[1]}">+ Fight</button></div>`).join('')}</section>`;
      }).join('')}</div>
      <article class="card">
        ${OB.sectionHead('Custom foe')}
        <div class="row gap wrap"><input type="text" id="cf-name" placeholder="Foe name…" aria-label="Foe name" class="grow">${OB.rankSelect('cf-rank', 'dangerous')}<button type="button" class="btn" data-act="addCustomFoe">+ Fight</button></div>
      </article>
      <p class="muted small">${flat.length} sample foes from the Oathbound book, by kind and rank.</p>`;
  };
})(window.OB);
