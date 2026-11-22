/* ==========================================================================
   OATHBOUND — Guide tab and Journal tab
   ========================================================================== */
(function (OB) {
  'use strict';
  const E = OB.esc, F = OB.f;

  const table = (head, rows) => `<table class="otable wide"><thead><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((x, i) => `<td${i === 0 ? ' class="strong"' : ''}>${x}</td>`).join('')}</tr>`).join('')}</tbody></table>`;

  function gettingStarted(c) {
    return `
      <h4>Character creation</h4>
      <ol class="steps big">${OB.CREATION_STEPS.map((s, i) => `<li><span class="n">${i + 1}</span><div><strong>${E(s[0])}</strong> ${E(s[1])}</div></li>`).join('')}</ol>
      <h4>The five stats</h4>
      ${table(['Stat', 'Meaning'], OB.STATS.map(s => [s.name, s.desc]))}
      <h4>Campaign setup</h4>
      <ol class="plain">
        <li><strong>Create your character.</strong> Envision them, choose heritage, upbringing, and class, set stats, take assets, and choose a name.</li>
        <li><strong>Create your world.</strong> Use the “Your Truths” exercise (Journal tab), or your own setting. Choose where the story starts and mark it on your map.</li>
        <li><strong>Mark background bonds.</strong> Up to three: a home, friends, family, or other loyalties. One tick each.</li>
        <li><strong>Write your background oath.</strong> A sworn quest from your past, ranked extreme or epic. You do not make the <em>Swear an Oath</em> move for it.</li>
        <li><strong>Envision your inciting incident.</strong> The problem that drives you into action now. Make it personal, urgent, and limited in scope.</li>
        <li><strong>Set the scene.</strong> Begin with a prologue of the normal world, or in the middle of the trouble. Envision the scene and begin play.</li>
        <li><strong>Swear an Oath.</strong> Make the move and write down your vow. Rank it troublesome, dangerous, or formidable.</li>
        <li><strong>Take your next steps.</strong> Use the result of the move to decide what happens next. Then play to see what happens.</li>
      </ol>
      <h4>Semi-random setup</h4>
      <p>To give fate a heavier hand, roll for your best stat and for your heritage, upbringing, and class. Roll 1d6 for your path: 1–3 the first path, 4–6 the second. Assign +3 to the result and place +2, +2, +1, +1 on the other stats as you like.</p>
      <div class="two-tables">
        ${table(['D100', 'Best stat (+3)'], [['1–20', 'Agility: nimble, fast, and precise'], ['21–40', 'Strength: strong, forceful, and enduring'], ['41–60', 'Finesse: cunning, stealthy, and precise'], ['61–80', 'Presence: willful, courageous, and charming'], ['81–100', 'Insight: smart, perceptive, and wise']])}
        ${table(['D100', 'Heritage', 'Upbringing', 'Class'], (() => { let prev = 0; return OB.SEMI.rows.map(r => { const rg = (prev + 1 === r[0] ? r[0] : (prev + 1) + '–' + r[0]); prev = r[0]; return [rg, r[1], r[2] || 'Roll again', r[3] || (r[1] === 'Forgeborn' ? 'Roll again' : 'Roll twice; choose')]; }); })())}
      </div>
      <div class="row gap"><button class="btn" data-act="semiRandom">Apply semi-random setup to the current character</button></div>`;
  }

  function mechanics() {
    return `
      <h4>The action roll</h4>
      <p>Roll one action die (d6) and two challenge dice (d10). Your <strong>action score</strong> is the action die + your stat + any adds. It never goes above 10. Compare it to each challenge die. It must be <em>greater</em> than a die to beat it. Ties go to the challenge dice.</p>
      ${table(['Result', 'Meaning'], [['Strong hit', 'Action score beats both challenge dice. You succeed.'], ['Weak hit', 'It beats one die. You succeed with a lesser effect or a cost.'], ['Miss', 'It beats neither die. You fail. Something happens: <em>Pay the Price</em>.']])}
      <h4>Matches</h4>
      <p>A <strong>match</strong> is a matching pair on the challenge dice. In solo and co-op play, add a twist, a complication, or an opportunity. If you are not sure, <em>Ask the Oracle</em>. With a GM, it is their prompt for a surprise. On a strong hit: a twist, something interesting, or a new opportunity. On a miss: a worse outcome, a complication, or a new danger.</p>
      <h4>Momentum</h4>
      <p>Momentum runs from −6 to +10. It stays between scenes and sessions. <strong>Burning momentum:</strong> after you roll, with positive momentum, cancel any challenge die that is less than your momentum. Cancelling both gives a strong hit. If only one is cancelled, the other stands. After you burn, momentum goes to your <strong>reset</strong>.</p>
      <ul class="plain"><li>Default reset: +2. One debility marked: reset +1. Two or more: reset 0.</li><li>Max momentum is +10, minus 1 for each marked debility.</li><li><strong>Negative momentum:</strong> if momentum is below 0 and equals your action die, cancel the action die. At −6, any further −momentum makes you <em>Face a Setback</em>.</li></ul>
      <h4>Progress tracks</h4>
      <p>A progress track has ten boxes. Each box holds four ticks. A progress move counts only the <strong>full boxes</strong>. Roll the challenge dice against it. You cannot burn momentum, and negative momentum does not apply. Bonds always mark 1 tick. Allies who work together share one track; one player rolls.</p>
      ${table(['Rank', 'Mark progress', 'Foe: progress per harm', 'Foe inflicts', 'Suffer'], OB.RANKS.map(r => [r.name, r.mark, r.foe, r.harm + ' harm', '−' + r.suffer]))}
      <h4>Harm and stress</h4>
      <p>When you face physical injury or hardship, make <em>Endure Harm</em>. When you face mental shock or despair, make <em>Endure Stress</em>. At 0 health or spirit, a miss puts you at risk of a debility, death, or desolation. Heal with <em>Heal</em>, <em>Make Camp</em>, and <em>Seek Haven</em>. You inflict harm on foes; you do not inflict stress by the rules.</p>
      <p><strong>Inflicting harm:</strong> a deadly weapon (sword, axe, spear, bow) inflicts <strong>2 harm</strong>. Unarmed, improvised, or simple weapons (shield, club, staff, rock) inflict <strong>1 harm</strong>. Attack spells and some assets tell you their harm. Each point of harm marks progress on the foe’s track by its rank.</p>
      <h4>Focus and magic</h4>
      <p>Focus runs from 0 to your max focus: +2 for a warrior or rogue, up to +5 for a wizard, sorcerer, or warlock. For non-casters, focus is grit and luck.</p>
      <div class="two-tables">
        ${table(['You spend focus when…'], [['You <em>Cast a Spell</em> of major (1) or mighty (2) scope.'], ['An asset or class ability asks for it.'], ['You lose concentration on a weak hit of <em>Face Danger</em> (−1).']])}
        ${table(['You recover focus when…'], [['You <em>Make Camp</em> and choose to attune (+1).'], ['You <em>Seek Haven</em> and choose to restore (+2).'], ['You <em>Center Yourself</em> (+1 or +2).'], ['An asset or class ability gives it.']])}
      </div>
      <h4>Debilities</h4>
      ${table(['Type', 'Debility', 'How it works'], OB.DEBILITIES.map(d => [d.type, d.name, d.how]))}
      <h4>Supply and companions</h4>
      <p><strong>Supply</strong> is your preparedness: ammo, food, water, and general upkeep. It runs 0 to +5. You and your allies share one supply value. At 0, all make the <em>Out of Supply</em> move.</p>
      <p><strong>Companions</strong> are NPC assets. If you roll a 1 on your action die when you use a companion ability, make the companion the focus of any negative outcome. When a companion is hurt, make <em>Companion Endure Harm</em>.</p>
      <h4>Bonds and oracles</h4>
      <p><strong>Bonds</strong> link you to people and communities. Make <em>Forge a Bond</em> to add one (1 tick). Bonds give +1 on certain moves and decide how your story ends when you <em>Write Your Epilogue</em>.</p>
      <p><strong>Oracles.</strong> For a result from 1 to 100, roll two d10. One die is the tens, one is the units. 00 and 0 is 100. In solo or co-op play, <em>Ask the Oracle</em> for answers and ideas. With a GM, the GM is the oracle.</p>`;
  }

  function magic() {
    return `
      <p>Magic in the Amarin is real, powerful, and dangerous. It flows through all things like an invisible river. Scholars call it the Weave. Priests call it the breath of the gods. <strong>Magic is a tool, not a key:</strong> it opens doors, but it does not remove the danger behind them.</p>
      <h4>Sources of magic</h4>
      ${table(['Source', 'Description'], OB.MAGIC_SOURCES)}
      <h4>Spells as assets</h4>
      <p>Your spells are assets. Each spell asset has a name, three abilities, and the word Spell in its type line. You begin with its first ability and upgrade it with experience.</p>
      <ul class="plain">${OB.SPELL_RULES.map(t => `<li>${OB.md(t).replace(/^<p>|<\/p>$/g, '')}</li>`).join('')}</ul>
      <h4>Scope of a spell</h4>
      ${table(['Scope', 'Cost', 'Examples'], OB.SCOPES.map(s => [s.name, s.cost + ' focus', s.ex]))}
      <h4>Miscasts</h4>
      <p>When you miss on <em>Cast a Spell</em>, the magic slips from your control. You may <em>Pay the Price</em> or roll on the Miscast oracle. You also roll on a miss when you <em>Overreach</em>, and twice when a <em>Perform a Ritual</em> goes wrong. When you roll a match on a miss while casting, roll twice and combine both results, or choose the more dramatic one.</p>
      <div class="row gap"><button class="btn small" data-act="rollOracle" data-key="miscast">Roll Miscast</button></div>
      <h4>Rituals</h4>
      <p>Some magic is too great for a single spell. A ritual is a progress challenge: you prepare it through your adventures, then make a progress roll. You usually need knowledge of it (a teacher, a page from an old book, or an asset). You may also need rare components, a place of power, a holy day, or willing helpers. Each is a step on the track.</p>
      ${table(['D10', 'Ritual', 'Rank'], OB.RITUALS.map((r, i) => [i + 1, r[0], OB.badgeRank(r[1])]))}
      <h4>The gods</h4>
      ${table(['God', 'Domains', 'Symbol'], OB.GODS)}
      <p class="muted small">Ashkarr is worshipped in secret, and his priests are hunted in most lands. When you play a cleric or guardian, choose a god—or an ideal, a saint, or a lost faith.</p>
      <h4>Warlock patrons (d6)</h4>
      ${table(['D6', 'Patron', 'What it wants'], OB.PATRONS.map((p, i) => [i + 1, p[0], p[1]]))}
      <h4>Magic items</h4>
      <p><strong>Minor items</strong> need no attunement and have no asset. They give a narrative advantage. <strong>Consumables</strong> are used once. <strong>Artifacts</strong> are magic items of real power, represented by asset cards. To use their full power, you must <em>Attune to an Artifact</em>.</p>
      ${table(['Consumable', 'Effect'], OB.CONSUMABLES)}
      <div class="row gap wrap"><button class="btn small" data-act="rollOracle" data-key="treasure">Roll Treasure</button><button class="btn small" data-act="rollOracle" data-key="magicitem">Roll Magic Item</button>${OB.ARTIFACTS.map((a, i) => `<button class="btn small ghost" data-act="addArtifact" data-i="${i}">Add artifact: ${E(a.name)}</button>`).join('')}</div>`;
  }

  function equipment() {
    return `<dl class="gear-rules">${OB.GEAR_RULES.map(([heading, rule]) => `<dt>${E(heading)}</dt><dd>${E(rule)}</dd>`).join('')}</dl>
      <h4>Example equipment</h4>
      <div class="gear-items">${OB.EQUIPMENT.map(item => `<article class="gear-item"><div><h4>${E(item.name)}</h4>
        <span class="muted small">${E(OB.gearMeta(item))}</span></div><p>${E(item.text)}</p></article>`).join('')}</div>`;
  }

  function amarin() {
    return `
      <p>The Amarin is a wide land between two seas. Three hundred years ago it was the heart of the Dawn Empire, ruled by mage-kings who built roads of white stone, towers that touched the clouds, and vaults that still hold their secrets. Then, in a single night, the Empire fell. Its capital was torn apart by a storm of wild magic. Its armies turned on each other. Its gods went silent for a generation.</p>
      <h4>Travel</h4>
      <p>Make <em>Undertake a Journey</em> when you cross dangerous or unknown lands. Choose a rank from the fiction. Do not measure distance exactly; travel moves at the speed of the story. An imperial road, a known coast by ship, or a trusted guide can lower the rank. A ruin of the Empire, a fey-touched forest, or a war-torn border can raise it.</p>
      ${table(['Journey', 'Rank'], OB.TRAVEL.map(t => [t[0], OB.badgeRank(t[1])]))}
      <h4>Regions</h4>
      ${OB.REGIONS.map(r => {
        const info = OB.REGION_INFO[r.name];
        const body = `<p>${E(info.text)}</p><h5>Features</h5><ul>${info.features.map(f => `<li>${E(f)}</li>`).join('')}</ul><h5>Quest starters</h5><ul>${info.quests.map(f => `<li>${E(f)}</li>`).join('')}</ul>
          <div class="row gap"><button class="btn small ghost" data-act="regionNote" data-name="${E(r.name)}">Add quest starter to journal</button></div>`;
        return OB.details('region:' + r.name, `<span class="rn">${r.n}</span> <strong>${E(r.name)}</strong> <span class="muted">— ${E(r.brief)}</span>`, body);
      }).join('')}`;
  }

  function lineage() {
    return `
      <h4>Heritages</h4>
      <p>Your heritage is your character’s people or race. It gives one starting ability now and a <strong>legacy</strong> ability that awakens when you Ascend and choose “Awaken your blood”.</p>
      ${table(['Heritage', 'Ability', 'Legacy'], OB.HERITAGES.map(h => [`${h.key}<br><small class="muted"><em>${E(h.tags)}</em></small>`, `<strong>${E(h.ability[0])}.</strong> ${E(h.ability[1])}`, `<strong>${E(h.legacy[0])}.</strong> ${E(h.legacy[1])}`]))}
      <h4>Upbringings</h4>
      ${table(['Upbringing', 'Ability'], OB.UPBRINGINGS.map(u => [`${u.key}<br><small class="muted"><em>${E(u.tags)}</em></small>`, `<strong>${E(u.ability[0])}.</strong> ${E(u.ability[1])}`]))}
      <h4>Classes</h4>
      ${table(['Class', 'Paths', 'Focus', 'Casts with', 'Suggested stats'], OB.CLASSES.map(x => [x.key, x.paths.join(', '), '+' + x.focus, x.casts ? OB.cap(x.casts) : '—', x.suggest]))}
      <p><strong>Paths and tiers.</strong> A path has three cards: Foundation (tier 1), Specialization (tier 2), and Mastery (tier 3). You begin with one Foundation. Adding a path card costs 3 experience; an upgrade costs 2. Your second path costs 3 experience at any time. At tier 3 or 4, <em>Ascend</em> lets you take the Foundation of another class’s path. Talents and companions are open to every class.</p>
      <h4>Tiers of play</h4>
      ${table(['Tier', 'Title', 'To reach this tier…'], OB.TIERS.map(t => [t.tier, t.title, t.need]))}`;
  }

  /* quick references */
  const md = t => OB.md(t).replace(/^<p>|<\/p>$/g, '');

  function combat() {
    const step = (n, title, body) => `<li class="cstep"><span class="cn">${n}</span><div><strong>${title}</strong><div class="cb">${body}</div></div></li>`;
    return `
      <p class="lead">Combat is a loop: one side has <strong>initiative</strong>. That side attacks. A hit marks progress on the foe. When you are ready, you finish the fight with a progress roll.</p>
      <ol class="csteps">
        ${step(1, 'Enter the Fray', md('Rank each foe, then roll to see who has initiative: **+presence** (face to face), **+finesse** (they are unaware), **+insight** (you are ambushed). Strong hit: +2 momentum and initiative. Weak hit: +2 momentum *or* initiative. Miss: foe has initiative, and you [[Pay the Price]].'))}
        ${step(2, 'You have initiative: Strike', md('Roll **+strength** (close) or **+agility** (ranged). Strong hit: inflict your harm +1 and keep initiative. Weak hit: inflict your harm, lose initiative. Miss: [[Pay the Price]], foe has initiative.'))}
        ${step(3, 'Foe has initiative: Clash', md('Roll **+strength** (close) or **+agility** (ranged). Strong hit: inflict your harm, take initiative, and choose +1 momentum or +1 harm. Weak hit: inflict your harm, then [[Pay the Price]]. Miss: you are outmatched, [[Pay the Price]].'))}
        ${step(4, 'Mark progress on the foe', md('Each harm you inflict marks progress on the foe track, by rank (table below). When the foe hits you, [[Endure Harm]] for the harm its rank inflicts.'))}
        ${step(5, 'End the Fight', md('After a **strong hit** on any move, you may end the fight. Roll your progress (full boxes) against the challenge dice. Strong: the foe is out. Weak: out, but you choose a cost. Miss: you lost, [[Pay the Price]].'))}
      </ol>
      <div class="two-tables">
        ${table(['Foe rank', 'Progress per harm', 'Inflicts'], OB.RANKS.map(r => [r.name, r.foe, r.harm + ' harm']))}
        ${table(['Your weapon', 'Harm'], [['Sword, axe, spear, bow (deadly)', '2'], ['Unarmed, shield, club, staff, rock', '1'], ['Two foes, one fight', 'One track each. Strike one at a time.']])}
      </div>
      <div class="gtips">
        <div class="gtip"><b>Turn the Tide</b>${md('Once per fight, steal initiative to make a move. +1 and +1 momentum on a hit. If you miss, the outcome is dire.')}</div>
        <div class="gtip"><b>Battle</b>${md('For a fight that happens in a blur, roll once for the objective with the stat that fits.')}</div>
        <div class="gtip"><b>Burn momentum</b>${md('After any roll, if momentum beats a challenge die, cancel that die. Reset afterwards.')}</div>
      </div>
      <div class="row gap wrap"><button class="btn" data-act="gotoMove" data-move="Enter the Fray">Open Enter the Fray</button><button class="btn" data-act="gotoMove" data-move="Strike">Open Strike</button><button class="btn" data-act="gotoMove" data-move="Clash">Open Clash</button><button class="btn" data-act="gotoMove" data-move="End the Fight">Open End the Fight</button></div>`;
  }

  function quick() {
    return `
      <div class="gq-grid">
        <div class="gq"><h4>Action roll</h4><p class="big">d6 + stat + adds <span>vs</span> 2 × d10</p><p class="muted">Beat both = strong hit. Beat one = weak hit. Beat none = miss. Score never goes above 10.</p></div>
        <div class="gq"><h4>Progress roll</h4><p class="big">full boxes <span>vs</span> 2 × d10</p><p class="muted">No d6, no stat, no burning momentum. Only full boxes count (4 ticks each).</p></div>
        <div class="gq"><h4>Momentum</h4><p class="big">−6 … +10</p><p class="muted">Reset +2 (less with debilities). Burn it to cancel a challenge die that is lower than your momentum.</p></div>
        <div class="gq"><h4>Match</h4><p class="big">both d10 equal</p><p class="muted">Add a twist or an opportunity. If unsure, Ask the Oracle.</p></div>
      </div>`;
  }

  const SECTIONS = [
    ['combat', 'Combat', 'combat', 'How a fight works, step by step'],
    ['mech', 'Core rules', 'adventure', 'Rolls, momentum, tracks, harm'],
    ['start', 'Getting started', 'quest', 'Create a character and a campaign'],
    ['magic', 'Magic', 'magic', 'Spells, rituals, gods, items'],
    ['equipment', 'Equipment', 'adventure', 'Loadout, attunement, and item effects'],
    ['amarin', 'The Amarin', 'relationship', 'Regions and travel'],
    ['lineage', 'Lineage and class', 'suffer', 'Heritage, upbringing, class, tiers'],
    ['credits', 'Credits', 'fate', 'License']
  ];

  OB.v.guide = function () {
    const c = OB.char();
    const body = {
      combat: combat(), mech: mechanics(), start: gettingStarted(c), magic: magic(), equipment: equipment(), amarin: amarin(), lineage: lineage(),
      credits: `<p><strong>Design and writing:</strong> Bruno Rocha Guimarães. <strong>Based on:</strong> Ironsworn by Shawn Tomkin (ironswornrpg.com).</p>
          <p>The text of Oathbound is licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International license (CC BY-NC-SA 4.0). You may share and adapt it for non-commercial use if you give credit and share alike.</p>
          <p>Some ideas for classes, heritages, upbringings, and paths draw inspiration from Daggerheart by Darrington Press. This sheet is not affiliated with or endorsed by Darrington Press, Critical Role, or Shawn Tomkin.</p>`
    };
    return `<div class="guide">
      ${quick()}
      <div class="gnav" role="navigation" aria-label="Guide sections">${SECTIONS.map(x => `<button type="button" class="gtile cat-${x[2]}" data-act="guideGo" data-g="${x[0]}"><b>${x[1]}</b><span>${x[3]}</span></button>`).join('')}</div>
      <div class="acc-stack">${SECTIONS.map(x => OB.details('g:' + x[0], `<h3>${x[1]}</h3>`, body[x[0]], x[0] === 'combat').replace('class="acc"', `class="acc gsec cat-${x[2]}" id="g-${x[0]}"`)).join('')}</div>
    </div>`;
  };

})(window.OB);
