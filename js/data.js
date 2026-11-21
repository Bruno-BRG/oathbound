/* ==========================================================================
   OATHBOUND — rules data
   Source: "Waystone — A Reference Guide for the Oathbound RPG" (Bruno Rocha Guimarães)
   Based on Ironsworn by Shawn Tomkin. CC BY-NC-SA 4.0.
   ========================================================================== */
window.OB = window.OB || {};

(function (OB) {
  'use strict';

  /* ---------- helpers to build d100 tables ---------- */
  // U(list, width): list of strings, each covering `width` numbers of the d100
  const U = (list, width = 1) => list.map((t, i) => [(i + 1) * width, t]);
  // R(rows): rows = [[max, text], ...]
  const R = rows => rows;

  /* ---------- core constants ---------- */
  OB.STATS = [
    { key: 'agility',  name: 'Agility',  short: 'Agi', desc: 'Speed, balance, reflexes, and ranged combat.' },
    { key: 'strength', name: 'Strength', short: 'Str', desc: 'Power, endurance, toughness, and close combat.' },
    { key: 'finesse',  name: 'Finesse',  short: 'Fin', desc: 'Stealth, precision, deception, and sleight of hand.' },
    { key: 'presence', name: 'Presence', short: 'Pre', desc: 'Courage, willpower, charm, and leadership.' },
    { key: 'insight',  name: 'Insight',  short: 'Ins', desc: 'Knowledge, instinct, observation, and understanding of magic.' }
  ];

  OB.RANKS = [
    { key: 'troublesome', name: 'Troublesome', ticks: 12, harm: 1, suffer: 1, type: 'Common enemies',                       mark: '3 progress', foe: '3 progress per harm' },
    { key: 'dangerous',   name: 'Dangerous',   ticks: 8,  harm: 2, suffer: 2, type: 'Capable fighters and deadly creatures', mark: '2 progress', foe: '2 progress per harm' },
    { key: 'formidable',  name: 'Formidable',  ticks: 4,  harm: 3, suffer: 3, type: 'Exceptional fighters and mighty creatures', mark: '1 progress', foe: '1 progress per harm' },
    { key: 'extreme',     name: 'Extreme',     ticks: 2,  harm: 4, suffer: 4, type: 'Foes of overwhelming skill or power',   mark: '2 ticks',    foe: '2 ticks per harm' },
    { key: 'epic',        name: 'Epic',        ticks: 1,  harm: 5, suffer: 5, type: 'Legendary foes of mythic power',        mark: '1 tick',     foe: '1 tick per harm' }
  ];
  OB.RANK = Object.fromEntries(OB.RANKS.map(r => [r.key, r]));

  // XP reward for Fulfill Your Oath: [strong, weak]
  OB.OATH_XP = { troublesome: [1, 0], dangerous: [2, 1], formidable: [3, 2], extreme: [4, 3], epic: [5, 4] };

  OB.DEBILITIES = [
    { key: 'wounded',    name: 'Wounded',    type: 'Condition', how: 'Marked at 0 health on a failed Endure Harm. You cannot raise health until it is cleared.' },
    { key: 'shaken',     name: 'Shaken',     type: 'Condition', how: 'Marked at 0 spirit on a failed Endure Stress. You cannot raise spirit.' },
    { key: 'unprepared', name: 'Unprepared', type: 'Condition', how: 'Marked when supply is 0 (Out of Supply). The group shares it. You cannot raise supply.' },
    { key: 'encumbered', name: 'Encumbered', type: 'Condition', how: 'Marked when you carry a heavy or awkward load. Clear it when you lighten the load.' },
    { key: 'maimed',     name: 'Maimed',     type: 'Bane',      how: 'A lasting injury. Permanent.' },
    { key: 'corrupted',  name: 'Corrupted',  type: 'Bane',      how: 'Scarred in heart or soul, or a dire miscast. Permanent.' },
    { key: 'cursed',     name: 'Cursed',     type: 'Burden',    how: 'You Faced Death and returned with a quest. Cleared by completing it.' },
    { key: 'tormented',  name: 'Tormented',  type: 'Burden',    how: 'You Faced Desolation and returned with a quest. Cleared by completing it.' }
  ];

  OB.TIERS = [
    { tier: 1, title: 'Sworn',     need: 'You begin play at tier 1.' },
    { tier: 2, title: 'Proven',    need: '10 total experience earned.' },
    { tier: 3, title: 'Renowned',  need: '25 total experience earned, and an extreme or epic oath fulfilled.' },
    { tier: 4, title: 'Legendary', need: '45 total experience earned, and an epic oath fulfilled.' }
  ];

  /* ---------- heritage / upbringing / class ---------- */
  OB.HERITAGES = [
    { key: 'Human', tags: 'bold, restless, many-faced', ability: ['Stubborn Hope', 'When you Swear an Oath, add +1. When you Forsake Your Oath, take +1 spirit after you clear it.'], legacy: ['Indomitable', 'When you Face Death or Face Desolation, add +1. On a hit, take +1 momentum.'] },
    { key: 'Elf', tags: 'long-lived, keen-eyed, patient', ability: ['Long Memory', 'When you Gather Information about something old—a ruin, a fallen kingdom, a forgotten name—add +1. You see well by starlight.'], legacy: ['Timeless Grace', 'When you Face Danger +agility and score a strong hit, take +1 additional momentum.'] },
    { key: 'Dwarf', tags: 'stout, stubborn, stone-wise', ability: ['Stone-Sure', 'When you Face Danger or Endure Harm against poison, a crushing weight, or the perils of deep places, add +1.'], legacy: ['Unbreakable', 'Once per fight, when you would mark wounded, you may instead suffer -2 momentum.'] },
    { key: 'Halfling', tags: 'small, warm-hearted, lucky', ability: ['Lucky', 'When you roll a 1 on your action die, you may reroll it. You must take the second result.'], legacy: ['Small and Unseen', 'When you Face Danger +finesse to hide or slip past a threat, add +1 and take +1 momentum on a hit.'] },
    { key: 'Gnome', tags: 'curious, clever, fey-touched', ability: ['Tinker’s Wit', 'When you Secure an Advantage by building a device, tool, or trap from what you carry, roll +insight and add +1.'], legacy: ['Illusory Double', 'When you Face Danger to avoid an attack, you may spend 1 focus to create a fleeting image of yourself. If you do, add +2.'] },
    { key: 'Orc', tags: 'strong, proud, fierce', ability: ['Relentless', 'When you Endure Harm while at 0 health, add +1. On a hit, take +1 momentum.'], legacy: ['Blood Fury', 'When you Strike or Clash while at +2 health or less, inflict +1 harm on a hit.'] },
    { key: 'Goblin', tags: 'quick, wily, survivors', ability: ['Scrounger', 'When you Resupply by scavenging in a ruin, a town, or a battlefield, add +1.'], legacy: ['Nimble Escape', 'When you Face Danger to flee, slip free of a hold, or squeeze through a narrow gap, add +1 and take +1 momentum on a hit.'] },
    { key: 'Drakkin', tags: 'scaled, proud, dragon-blooded', ability: ['Dragon’s Breath', 'Choose your element: fire, frost, or lightning. When you Strike with your breath at close range, you are armed with a deadly weapon. After you use it, you must spend 1 focus to use it again before you Make Camp.'], legacy: ['Scaled Hide', 'When you Endure Harm from your element, or from a blade or claw, suffer 1 less harm.'] },
    { key: 'Faeborn', tags: 'graceful, strange, beguiling', ability: ['Glamour', 'When you Compel through charm, beauty, or beguilement, add +1.'], legacy: ['Otherwhere Step', 'When you Face Danger to escape a threat, you may spend 2 focus to step through the Otherwhere and reappear nearby. If you do, count a weak hit as a strong hit.'] },
    { key: 'Giantkin', tags: 'towering, steady, mighty', ability: ['Mighty Frame', 'When you Face Danger +strength to lift, push, carry, or break, add +1. You are not encumbered by a load an ordinary person could carry.'], legacy: ['Earthshaker', 'When you Clash and score a strong hit, inflict +1 harm and your foe is knocked down or driven back.'] },
    { key: 'Beastfolk', tags: 'wild, keen, varied', ability: ['Animal Senses', 'Choose your kind. When you Gather Information by scent or tracking, or Face Danger to notice a hidden threat, add +1.'], legacy: ['Natural Weapons', 'Your claws, horns, or fangs are deadly weapons. When you Strike with them and score a strong hit, take +1 momentum.'] },
    { key: 'Forgeborn', tags: 'built, awakened, searching', ability: ['Made, Not Born', 'You do not need to eat, drink, sleep, or breathe, and poison and disease cannot harm you. When you Heal yourself, you are repaired, not treated: roll +insight, and you may suffer -1 supply instead of -1 momentum on a weak hit.'], legacy: ['Overclock', 'Once per fight, spend 1 focus to add +2 to a Strike, Clash, or Face Danger. Afterward, Endure Harm (1 harm) as your gears strain.'] },
    { key: 'Planetouched', tags: 'marked by other worlds', ability: ['Otherworldly Spark', 'Choose your mark: radiant, infernal, or elemental. When you Endure Harm from that power, suffer 1 less harm. When you Cast a Spell drawing on that power, add +1.'], legacy: ['True Nature', 'When you Compel or Face Danger by revealing your true nature in full—wings of light, a crown of flame, a voice like thunder—spend 1 focus and add +2.'] }
  ];
  OB.HERITAGE = Object.fromEntries(OB.HERITAGES.map(h => [h.key, h]));

  OB.UPBRINGINGS = [
    { key: 'City',     tags: 'raised among crowds and stone', ability: ['Streetwise', 'When you Gather Information or Resupply in a town or city, add +1.'] },
    { key: 'Frontier', tags: 'raised at the edge of the known', ability: ['Hard Country', 'When you Make Camp, add +1. When you Seek Haven in a frontier community, take +1 momentum on a hit.'] },
    { key: 'Wilds',    tags: 'raised far from roads and walls', ability: ['Trailwise', 'When you Undertake a Journey through untamed land and score a hit, take +1 momentum.'] },
    { key: 'Road',     tags: 'raised on the move', ability: ['Many Roads', 'When you Compel or Forge a Bond with strangers or travelers, add +1.'] },
    { key: 'Cloister', tags: 'raised in a temple or academy', ability: ['Learned', 'When you Gather Information through study, records, or lore, add +1. When you Center Yourself, take +1 momentum on a hit.'] },
    { key: 'Deep',     tags: 'raised in tunnels and caverns', ability: ['Darkborn', 'You do not need light to move or fight underground. When you Undertake a Journey below the earth, add +1.'] }
  ];
  OB.UPBRINGING = Object.fromEntries(OB.UPBRINGINGS.map(u => [u.key, u]));

  OB.CLASSES = [
    { key: 'Warrior',  paths: ['Champion', 'Warlord'],         focus: 2, casts: null,       suggest: 'Str 3, Agi 2, Pre 2, Ins 1, Fin 1' },
    { key: 'Guardian', paths: ['Sentinel', 'Avenger'],         focus: 3, casts: 'presence', suggest: 'Str 3, Pre 2, Ins 2, Agi 1, Fin 1' },
    { key: 'Ranger',   paths: ['Beastmaster', 'Deadeye'],      focus: 3, casts: 'insight',  suggest: 'Agi 3, Ins 2, Str 2, Fin 1, Pre 1' },
    { key: 'Rogue',    paths: ['Shadowblade', 'Trickster'],    focus: 2, casts: 'finesse',  suggest: 'Fin 3, Agi 2, Ins 2, Pre 1, Str 1' },
    { key: 'Wizard',   paths: ['Evoker', 'Seer'],              focus: 5, casts: 'insight',  suggest: 'Ins 3, Fin 2, Pre 2, Agi 1, Str 1' },
    { key: 'Sorcerer', paths: ['Stormblood', 'Wildsoul'],      focus: 5, casts: 'presence', suggest: 'Pre 3, Ins 2, Agi 2, Str 1, Fin 1' },
    { key: 'Cleric',   paths: ['Lightbringer', 'Gravekeeper'], focus: 4, casts: 'presence', suggest: 'Pre 3, Ins 2, Str 2, Agi 1, Fin 1' },
    { key: 'Druid',    paths: ['Shapeshifter', 'Greenwarden'], focus: 4, casts: 'presence', suggest: 'Ins 3, Pre 2, Agi 2, Str 1, Fin 1' },
    { key: 'Bard',     paths: ['Warsinger', 'Enchanter'],      focus: 4, casts: 'presence', suggest: 'Pre 3, Fin 2, Agi 2, Ins 1, Str 1' },
    { key: 'Warlock',  paths: ['Fiendbound', 'Feybound'],      focus: 5, casts: 'presence', suggest: 'Pre 3, Fin 2, Ins 2, Agi 1, Str 1' }
  ];
  OB.CLASS = Object.fromEntries(OB.CLASSES.map(c => [c.key, c]));
  OB.PATH_TIERS = ['Foundation', 'Specialization', 'Mastery'];

  /* ---------- semi-random setup ---------- */
  OB.SEMI = {
    stat: R([[20, 'agility'], [40, 'strength'], [60, 'finesse'], [80, 'presence'], [100, 'insight']]),
    // each row: [max, heritage, upbringing, class]  (class null => roll twice / again)
    rows: [
      [8,  'Human',        'City',     'Warrior'],
      [17, 'Elf',          'City',     'Guardian'],
      [25, 'Dwarf',        'Frontier', 'Ranger'],
      [33, 'Halfling',     'Frontier', 'Rogue'],
      [42, 'Gnome',        'Wilds',    'Wizard'],
      [50, 'Orc',          'Wilds',    'Sorcerer'],
      [58, 'Goblin',       'Road',     'Cleric'],
      [67, 'Drakkin',      'Road',     'Druid'],
      [75, 'Faeborn',      'Cloister', 'Bard'],
      [83, 'Giantkin',     'Cloister', 'Warlock'],
      [90, 'Beastfolk',    'Deep',     null],
      [95, 'Planetouched', 'Deep',     null],
      [100,'Forgeborn',    null,       null]
    ]
  };

  /* ---------- the Amarin ---------- */
  OB.TRAVEL = [
    ['A moderate distance inside one region', 'troublesome'],
    ['A long distance inside one region, or rough terrain', 'dangerous'],
    ['From one region to another, or very hard terrain', 'formidable'],
    ['Through several regions', 'extreme'],
    ['End to end of the Amarin, or to another land', 'epic']
  ];
  OB.REGIONS = [
    { n: 1, name: 'The Shardsea Isles',       brief: 'Storm-wracked islands, pirates, and sea monsters.',       places: 'The Drowned Bell; the Admiral of Gulls' },
    { n: 2, name: 'The Sunward Coast',        brief: 'Rich free cities, merchant princes, and intrigue.',       places: 'Calvarre, the City of Bridges; the Gilded Exchange' },
    { n: 3, name: 'The Crownlands',           brief: 'Fields, castles, and the rival kingdoms of the heartland.', places: 'Varenhold; Elmarch; the White Road' },
    { n: 4, name: 'The Greenwold',            brief: 'An ancient forest of elves, fey, and wild magic.',        places: 'Sylvaraen; heart-trees; fey rings' },
    { n: 5, name: 'The Shattered Heart',      brief: 'The ruined capital of the Dawn Empire.',                  places: 'Aurenthal; the Spire of Dawn; the Ring of Watchers' },
    { n: 6, name: 'The Mirefen',              brief: 'Marshes of hags, goblins, and the drowned dead.',         places: 'The Hag Mothers; the Drowned Abbey' },
    { n: 7, name: 'The Stormcrown Mountains', brief: 'Dwarven holds, giants, and dragons’ lairs.',              places: 'Khazad Durn; the Deep Roads; the dragon Vharzul' },
    { n: 8, name: 'The Frostmarch',           brief: 'The cold frontier of the north.',                         places: 'The Wall of Kings; the Aurora Stones' },
    { n: 9, name: 'The Ashen Waste',          brief: 'A desert of glass and ash, scarred by old magic.',        places: 'The Buried Cities; glass-storms' }
  ];

  /* ---------- foes ---------- */
  OB.FOES = [
    { kind: 'Folk', list: [['Common Folk','troublesome'],['Bandit','dangerous'],['Mercenary','dangerous'],['Cultist','dangerous'],['Rogue Mage','dangerous'],['Knight','formidable'],['Assassin','formidable']] },
    { kind: 'Goblins and Brutes', list: [['Goblin','troublesome'],['Kobold','troublesome'],['Goblin Warchief','dangerous'],['Gnoll','dangerous'],['Ogre','formidable'],['Troll','formidable'],['Giant','extreme']] },
    { kind: 'Beasts', list: [['Wolf','troublesome'],['Great Boar','dangerous'],['Giant Spider','dangerous'],['Sabretooth','dangerous'],['Dire Bear','formidable'],['Giant Serpent','formidable']] },
    { kind: 'Monsters', list: [['Gloom Ooze','dangerous'],['Griffon','formidable'],['Manticore','formidable'],['Basilisk','formidable'],['Wyvern','extreme'],['Chimera','extreme'],['Hydra','extreme'],['Leviathan','epic']] },
    { kind: 'Undead', list: [['Skeleton','troublesome'],['Ghoul','dangerous'],['Haunt','dangerous'],['Barrow-Wight','formidable'],['Wraith','formidable'],['Vampire','extreme'],['Lich','epic']] },
    { kind: 'Fey and Elder Things', list: [['Sprite','troublesome'],['Redcap','dangerous'],['Dryad','dangerous'],['Hag','formidable'],['Fey Knight','formidable'],['Elemental','formidable'],['Thing From Below','extreme']] },
    { kind: 'Fiends and Dragons', list: [['Imp','troublesome'],['Hellhound','dangerous'],['Drake','dangerous'],['Devil','formidable'],['Demon','extreme'],['Young Dragon','extreme'],['Elder Dragon','epic']] }
  ];

  /* ======================================================================
     MOVES
     Markup in text:  **bold**  *italic*  [[Move Name]] (link)  lines "- " = bullet
     roll: [{label, stat}]   stat = key | 'casting' | 'supply' | 'health' ...
     progress: 'oath'|'journey'|'fight'|'ritual'|'bond'
     fx: deterministic effects offered as one-click buttons {strong:[..],weak:[..],miss:[..]}
         effect keys: momentum, health, spirit, supply, focus  (+/- numbers)
     ====================================================================== */
  const ALLSTATS = [
    { label: 'Agility',  stat: 'agility',  hint: 'speed, mobility, a shot at range' },
    { label: 'Strength', stat: 'strength', hint: 'force, endurance, a show of might' },
    { label: 'Finesse',  stat: 'finesse',  hint: 'stealth, deception, precise handwork' },
    { label: 'Presence', stat: 'presence', hint: 'charm, courage, leadership' },
    { label: 'Insight',  stat: 'insight',  hint: 'knowledge, perception, intuition' }
  ];

  OB.MOVE_CATS = [
    { key: 'adventure',    name: 'Adventure',    img: 'destination' },
    { key: 'relationship', name: 'Relationship', img: 'oath' },
    { key: 'combat',       name: 'Combat',       img: 'fight' },
    { key: 'magic',        name: 'Magic',        img: 'magic' },
    { key: 'suffer',       name: 'Suffer',       img: 'camp' },
    { key: 'quest',        name: 'Quest',        img: 'banner-ruins' },
    { key: 'fate',         name: 'Fate',         img: 'oracle' }
  ];

  OB.MOVES = [
    /* ---------------- ADVENTURE ---------------- */
    { cat: 'adventure', name: 'Face Danger',
      trigger: 'you attempt something risky or react to an imminent threat, envision your action and roll.',
      roll: ALLSTATS,
      strong: 'You are successful. Take +1 momentum.',
      weak: 'You succeed, but face a troublesome cost. Choose one.\n- You are delayed, lose advantage, or face a new danger: Suffer -1 momentum.\n- You are tired or hurt: [[Endure Harm]] (1 harm).\n- You are dispirited or afraid: [[Endure Stress]] (1 stress).\n- You sacrifice resources: Suffer -1 supply.\n- Your concentration breaks: Suffer -1 focus.',
      miss: 'You fail, or your progress is undermined by a dramatic and costly turn of events. [[Pay the Price]].',
      fx: { strong: [{ momentum: 1 }] } },

    { cat: 'adventure', name: 'Secure an Advantage',
      trigger: 'you assess a situation, make preparations, or attempt to gain leverage, envision your action and roll.',
      roll: ALLSTATS,
      strong: 'You gain advantage. Choose one.\n- **Take control:** Make another move now (not a progress move); when you do, add +1.\n- **Prepare to act:** Take +2 momentum.',
      weak: 'Your advantage is short-lived. Take +1 momentum.',
      miss: 'You fail or your assumptions betray you. [[Pay the Price]].',
      fx: { strong: [{ momentum: 2, label: 'Prepare to act' }], weak: [{ momentum: 1 }] } },

    { cat: 'adventure', name: 'Gather Information',
      trigger: 'you search an area, ask questions, conduct an investigation, or follow a track, roll +insight. If you act within a community or ask questions of a person with whom you share a bond, add +1.',
      roll: [{ label: 'Insight', stat: 'insight' }],
      strong: 'You discover something helpful and specific. The path you must follow or action you must take to make progress is made clear. Envision what you learn ([[Ask the Oracle]] if unsure), and take +2 momentum.',
      weak: 'The information complicates your quest or introduces a new danger. Envision what you discover ([[Ask the Oracle]] if unsure), and take +1 momentum.',
      miss: 'Your investigation unearths a dire threat or reveals an unwelcome truth that undermines your quest. [[Pay the Price]].',
      fx: { strong: [{ momentum: 2 }], weak: [{ momentum: 1 }] } },

    { cat: 'adventure', name: 'Heal',
      trigger: 'you treat an injury or ailment, roll +insight. If you are mending your own wounds, roll +insight or +strength, whichever is lower.',
      roll: [{ label: 'Insight', stat: 'insight' }, { label: 'Own wounds (lower of insight / strength)', stat: 'lowInsStr' }],
      strong: 'Your care is helpful. If you (or the ally under your care) have the wounded condition, you may clear it. Then, take or give up to +2 health.',
      weak: 'As above, but you must suffer -1 supply or -1 momentum (your choice).',
      miss: 'Your aid is ineffective. [[Pay the Price]].',
      fx: { strong: [{ health: 2 }], weak: [{ health: 2, supply: -1, label: '+2 health, -1 supply' }, { health: 2, momentum: -1, label: '+2 health, -1 momentum' }] } },

    { cat: 'adventure', name: 'Resupply',
      trigger: 'you hunt, forage, or scavenge, roll +insight.',
      roll: [{ label: 'Insight', stat: 'insight' }],
      strong: 'You bolster your resources. Take +2 supply.',
      weak: 'Take up to +2 supply, but suffer -1 momentum for each.',
      miss: 'You find nothing helpful. [[Pay the Price]].',
      fx: { strong: [{ supply: 2 }], weak: [{ supply: 1, momentum: -1, label: '+1 supply, -1 momentum' }, { supply: 2, momentum: -2, label: '+2 supply, -2 momentum' }] } },

    { cat: 'adventure', name: 'Make Camp',
      trigger: 'you rest and recover for several hours in the wild, roll +supply.',
      roll: [{ label: 'Supply', stat: 'supply' }],
      strong: 'You and your allies may each choose two.',
      weak: 'Choose one.\n- **Recuperate:** Take +1 health for you and any companions.\n- **Partake:** Suffer -1 supply and take +1 health for you and any companions.\n- **Relax:** Take +1 spirit.\n- **Plan:** Take +1 momentum.\n- **Attune:** Take +1 focus.\n- **Prepare:** When you break camp, add +1 if you [[Undertake a Journey]].',
      miss: 'You take no comfort. [[Pay the Price]].' },

    { cat: 'adventure', name: 'Undertake a Journey',
      trigger: 'you travel across hazardous or unfamiliar lands, first set the rank of your journey.\n- Troublesome journey: 3 progress per waypoint.\n- Dangerous journey: 2 progress per waypoint.\n- Formidable journey: 1 progress per waypoint.\n- Extreme journey: 2 ticks per waypoint.\n- Epic journey: 1 tick per waypoint.\n\nThen, for each segment of your journey, roll +insight. If you are setting off from a community with which you share a bond, add +1 to your initial roll.',
      roll: [{ label: 'Insight', stat: 'insight' }],
      track: 'journey',
      strong: 'You reach a waypoint. If the waypoint is unknown to you, envision it ([[Ask the Oracle]] if unsure). Then, choose one.\n- **You make good use of your resources:** Mark progress.\n- **You move at speed:** Mark progress and take +1 momentum, but suffer -1 supply.',
      weak: 'You reach a waypoint and mark progress, but suffer -1 supply.',
      miss: 'You are waylaid by a perilous event. [[Pay the Price]].',
      markOnHit: true },

    { cat: 'adventure', name: 'Reach Your Destination', progress: 'journey',
      trigger: 'your journey comes to an end, roll the challenge dice and compare to your progress. Momentum is ignored on this roll.',
      strong: 'The situation at your destination favors you. Choose one.\n- Make another move now (not a progress move), and add +1.\n- Take +1 momentum.',
      weak: 'You arrive but face an unforeseen hazard or complication. Envision what you find ([[Ask the Oracle]] if unsure).',
      miss: 'You have gone hopelessly astray, your objective is lost to you, or you were misled about your destination. If your journey continues, clear all but one filled progress, and raise the journey’s rank by one (if not already epic).' },

    /* ---------------- RELATIONSHIP ---------------- */
    { cat: 'relationship', name: 'Compel',
      trigger: 'you attempt to persuade someone to do something, envision your approach and roll.',
      roll: [
        { label: 'Presence — charm, pacify, barter, convince (+1 if bond)', stat: 'presence' },
        { label: 'Strength — threaten or incite', stat: 'strength' },
        { label: 'Finesse — lie or swindle', stat: 'finesse' }
      ],
      strong: 'They’ll do what you want or share what they know. Take +1 momentum. If you use this exchange to [[Gather Information]], make that move now and add +1.',
      weak: 'As above, but they ask something of you in return. Envision what they want ([[Ask the Oracle]] if unsure).',
      miss: 'They refuse or make a demand which costs you greatly. [[Pay the Price]].',
      fx: { strong: [{ momentum: 1 }] } },

    { cat: 'relationship', name: 'Seek Haven',
      trigger: 'you spend time in a community seeking assistance, roll +presence. If you share a bond, add +1.',
      roll: [{ label: 'Presence', stat: 'presence' }],
      strong: 'You and your allies may each choose two from within the categories below.',
      weak: 'Choose one. If you share a bond, choose one more.\n\nOn a hit, you and your allies may each focus on one of your chosen recover actions and roll +presence again. If you share a bond, add +1. On a strong hit, take +2 more for that action. On a weak hit, take +1 more. On a miss, it goes badly and you lose all benefits for that action.\n\n**Clear a condition**\n- **Mend:** Clear a wounded debility and take +1 health.\n- **Hearten:** Clear a shaken debility and take +1 spirit.\n- **Equip:** Clear an unprepared debility and take +1 supply.\n\n**Recover**\n- **Recuperate:** Take +2 health for yourself and any companions.\n- **Consort:** Take +2 spirit.\n- **Provision:** Take +2 supply.\n- **Plan:** Take +2 momentum.\n- **Restore:** Take +2 focus.\n\n**Provide aid**\n- **Take a quest:** Envision what this community needs, or what trouble it is facing ([[Ask the Oracle]] if unsure). If you chose to help, [[Swear an Oath]] and add +1.',
      miss: 'You find no help here. [[Pay the Price]].' },

    { cat: 'relationship', name: 'Call a Duel',
      trigger: 'you challenge someone to a formal duel, or accept a challenge, roll +presence. If you share a bond with this community, add +1.',
      roll: [{ label: 'Presence', stat: 'presence' }],
      strong: 'Take +1 momentum. You may also choose up to three boasts and take +1 momentum for each.',
      weak: 'You may choose one boast in exchange for +1 momentum.\n\n**Boasts**\n- **Grant first strike:** Your foe has initiative.\n- **Bare yourself:** Take no benefit of armor or shield; your foe’s harm is +1.\n- **Hold no steel:** Take no benefit of weapons or spells; your harm is 1.\n- **Bloody yourself:** [[Endure Harm]] (1 harm).\n- **To the death:** One way or another, this fight must end with death.',
      miss: 'You begin the duel at a disadvantage. Your foe has initiative. [[Pay the Price]].\n\nThen, make moves to resolve the fight. If you are the victor, you may make a lawful demand, and your opponent must comply or forfeit their honor and standing. If you refuse the challenge, surrender, or are defeated, they make a demand of you.' },

    { cat: 'relationship', name: 'Forge a Bond',
      trigger: 'you spend significant time with a person or community, stand together to face hardships, or make sacrifices for their cause, you can attempt to create a bond. When you do, roll +presence. If you make this move after you successfully [[Fulfill Your Oath]] to their benefit, you may reroll any dice.',
      roll: [{ label: 'Presence', stat: 'presence' }],
      strong: 'Make note of the bond, mark a tick on your bond progress track, and choose one.\n- Take +1 spirit.\n- Take +2 momentum.',
      weak: 'They ask something more of you first. Envision what it is ([[Ask the Oracle]] if unsure), do it (or [[Swear an Oath]]), and mark the bond. If you decline or fail, [[Pay the Price]].',
      miss: 'You are refused. [[Pay the Price]].',
      bondOnHit: true },

    { cat: 'relationship', name: 'Test Your Bond',
      trigger: 'your bond is tested through conflict, betrayal, or circumstance, roll +presence.',
      roll: [{ label: 'Presence', stat: 'presence' }],
      strong: 'This test has strengthened your bond. Choose one.\n- Take +1 spirit.\n- Take +2 momentum.',
      weak: 'Your bond is fragile and you must prove your loyalty. Envision what they ask of you ([[Ask the Oracle]] if unsure), and do it (or [[Swear an Oath]]). If you decline or fail, clear the bond and [[Pay the Price]].',
      miss: 'They have no interest in maintaining this relationship, or if you have no interest, clear the bond and [[Pay the Price]].' },

    { cat: 'relationship', name: 'Aid Your Ally', info: true,
      trigger: 'you [[Secure an Advantage]] in direct support of an ally, and score a hit, they (instead of you) can take the benefits of the move. If you are in combat and score a strong hit, you and your ally both have initiative.' },

    { cat: 'relationship', name: 'Write Your Epilogue', progress: 'bond',
      trigger: 'you retire from your life as Oathbound, envision two things: What you hope for, and what you fear. Then, roll the challenge dice and compare to your bonds. Momentum is ignored on this roll.',
      strong: 'Things come to pass as you hoped.',
      weak: 'Your life takes an unexpected turn, but not necessarily for the worse. You find yourself spending your days with someone or in a place you did not foresee. Envision it ([[Ask the Oracle]] if unsure).',
      miss: 'Your fears are realized.' },

    /* ---------------- COMBAT ---------------- */
    { cat: 'combat', name: 'Enter the Fray',
      trigger: 'you enter into combat, first set the rank of each of your foes.\n- Troublesome foe: 3 progress per harm; inflicts 1 harm.\n- Dangerous foe: 2 progress per harm; inflicts 2 harm.\n- Formidable foe: 1 progress per harm; inflicts 3 harm.\n- Extreme foe: 2 ticks per harm; inflicts 4 harm.\n- Epic foe: 1 tick per harm; inflicts 5 harm.\n\nThen, roll to determine who is in control.',
      roll: [
        { label: 'Presence — facing off against your foe', stat: 'presence' },
        { label: 'Finesse — unaware foe / striking without warning', stat: 'finesse' },
        { label: 'Insight — ambushed', stat: 'insight' }
      ],
      track: 'fight',
      strong: 'Take +2 momentum. You have initiative.',
      weak: 'Choose one.\n- **Bolster your position:** Take +2 momentum.\n- **Prepare to act:** Take initiative.',
      miss: 'Combat begins with you at a disadvantage. [[Pay the Price]]. Your foe has initiative.',
      fx: { strong: [{ momentum: 2 }], weak: [{ momentum: 2, label: 'Bolster: +2 momentum' }] } },

    { cat: 'combat', name: 'Strike',
      trigger: 'you have initiative and attack in close quarters, roll +strength. When you have initiative and attack at range, roll +agility.',
      roll: [{ label: 'Close — Strength', stat: 'strength' }, { label: 'Ranged — Agility', stat: 'agility' }],
      harm: true,
      strong: 'Inflict +1 harm. You retain initiative.',
      weak: 'Inflict your harm and lose initiative.',
      miss: 'Your attack fails and you must [[Pay the Price]]. Your foe has initiative.' },

    { cat: 'combat', name: 'Clash',
      trigger: 'your foe has initiative and you fight with them in close quarters, roll +strength. When you exchange a volley at range, or shoot at an advancing foe, roll +agility.',
      roll: [{ label: 'Close — Strength', stat: 'strength' }, { label: 'Ranged — Agility', stat: 'agility' }],
      harm: true,
      strong: 'Inflict your harm and choose one. You have the initiative.\n- **You bolster your position:** Take +1 momentum.\n- **You find an opening:** Inflict +1 harm.',
      weak: 'Inflict your harm, but then [[Pay the Price]]. Your foe has initiative.',
      miss: 'You are outmatched and must [[Pay the Price]]. Your foe has initiative.' },

    { cat: 'combat', name: 'Turn the Tide', info: true,
      trigger: 'you risk it all (once per fight), you may steal initiative from your foe to make a move (not a progress move). When you do, add +1 and take +1 momentum on a hit. If you fail to score a hit on that move, you must suffer a dire outcome. [[Pay the Price]].' },

    { cat: 'combat', name: 'End the Fight', progress: 'fight',
      trigger: 'you make a move to take decisive action, and score a strong hit, you may resolve the outcome of this fight. If you do, roll the challenge dice and compare to your progress. Momentum is ignored on this roll.',
      strong: 'This foe is no longer in the fight. They are killed, out of action, flee, or surrender as appropriate to the situation and your intent ([[Ask the Oracle]] if unsure).',
      weak: 'As above, but you must also choose one.\n- **It’s worse than you thought:** [[Endure Harm]].\n- **You are overcome:** [[Endure Stress]].\n- **Your victory is short-lived:** A new danger or foe appears, or an existing danger worsens.\n- **You suffer collateral damage:** Something of value is lost or broken, or someone important must pay the cost.\n- **You’ll pay for it:** An objective falls out of reach.\n- **Others won’t forget:** You are marked for vengeance.',
      miss: 'You have lost this fight. [[Pay the Price]].' },

    { cat: 'combat', name: 'Battle',
      trigger: 'you fight a battle, and it happens in a blur, envision your objective and roll.',
      roll: [
        { label: 'Agility — range, speed, terrain', stat: 'agility' },
        { label: 'Presence — courage, allies, companions', stat: 'presence' },
        { label: 'Strength — overpower in close', stat: 'strength' },
        { label: 'Finesse — trickery', stat: 'finesse' },
        { label: 'Insight — careful tactics', stat: 'insight' }
      ],
      strong: 'You achieve your objective unconditionally. Take +2 momentum.',
      weak: 'You achieve your objective, but not without cost. [[Pay the Price]].',
      miss: 'You are defeated and the objective is lost to you. [[Pay the Price]].',
      fx: { strong: [{ momentum: 2 }] } },

    /* ---------------- MAGIC ---------------- */
    { cat: 'magic', name: 'Cast a Spell',
      trigger: 'you use a spell to create an effect that no other move covers, envision the spell and what you want it to do. Spend focus by the scope of the effect, then roll +your casting stat. A spell asset may name a different stat.\n- **Minor** (a small trick, a short or subtle effect): 0 focus.\n- **Major** (an effect that changes the scene): 1 focus.\n- **Mighty** (an effect that changes a battle, a place, or a life): 2 focus.',
      roll: [{ label: 'Casting stat', stat: 'casting' }],
      focusCost: true,
      strong: 'The spell works as you intended. Take +1 momentum, or make the effect last longer or reach further.',
      weak: 'The spell works, but choose one.\n- **It costs more:** Suffer -1 focus.\n- **It is less than you hoped:** It is weaker, shorter, or smaller.\n- **It draws notice:** Suffer -1 momentum. Something hears the magic.',
      miss: 'The magic slips from your control. Roll on the **Miscast** oracle, or [[Pay the Price]].',
      fx: { strong: [{ momentum: 1 }], weak: [{ focus: -1, label: 'Costs more: -1 focus' }, { momentum: -1, label: 'Draws notice: -1 momentum' }] },
      oracle: 'miscast' },

    { cat: 'magic', name: 'Center Yourself',
      trigger: 'you take a quiet moment to gather your power—through meditation, prayer, study, song, or communion with your patron or the wild—roll +your casting stat (or +insight if you have none).',
      roll: [{ label: 'Casting stat (or Insight)', stat: 'casting' }],
      strong: 'Your power answers. Take +2 focus.',
      weak: 'Take +1 focus, but the pause costs you. Suffer -1 momentum or -1 supply.',
      miss: 'Your mind will not settle, or the power answers in a way you did not want. [[Pay the Price]].',
      fx: { strong: [{ focus: 2 }], weak: [{ focus: 1, momentum: -1, label: '+1 focus, -1 momentum' }, { focus: 1, supply: -1, label: '+1 focus, -1 supply' }] } },

    { cat: 'magic', name: 'Perform a Ritual', progress: 'ritual', marker: true,
      trigger: 'you begin a long and complex working of magic—a great summoning, a powerful ward, the breaking of a curse, the opening of a sealed way—envision your goal and give the ritual a rank. Then, set a progress track. Each time you make a move to prepare the ritual (you find a rare component, learn the true words, reach a place of power, gather willing helpers) and score a hit, mark progress per the rank of the ritual.\n\nWhen you complete the ritual, roll the challenge dice and compare to your progress. Momentum is ignored on this roll.',
      strong: 'The ritual works as you intended. Take +1 momentum.',
      weak: 'The ritual works, but choose one.\n- **It is incomplete:** The effect is weaker, shorter, or flawed.\n- **It draws a power:** Something vast takes notice. Envision what it is.\n- **It takes its toll:** [[Endure Stress]] (2 stress) and suffer -2 focus.',
      miss: 'The ritual fails, or succeeds in a terrible way. Roll twice on the **Miscast** oracle and apply both, or [[Pay the Price]].',
      oracle: 'miscast' },

    { cat: 'magic', name: 'Attune to an Artifact',
      trigger: 'you seek to bind yourself to a magic item and unlock its power, envision what you do: study its runes, bleed on its blade, bargain with the spirit inside it, or carry it through a trial. Then roll +insight to understand it, or +presence to master its will.',
      roll: [{ label: 'Insight — understand', stat: 'insight' }, { label: 'Presence — master its will', stat: 'presence' }],
      strong: 'You are attuned. You learn one of its powers. If the item is represented by an asset, you may add it for 2 experience. Take +1 momentum.',
      weak: 'You are attuned, but the item asks something of you. Choose one.\n- **A burden:** [[Endure Stress]] (2 stress).\n- **A purpose:** [[Swear an Oath]] to serve the item’s purpose.\n- **A condition:** The item’s power works only under a condition. Envision it.',
      miss: 'The item rejects you, or binds you in a way you did not want. [[Pay the Price]].',
      fx: { strong: [{ momentum: 1 }] } },

    /* ---------------- SUFFER ---------------- */
    { cat: 'suffer', name: 'Endure Harm', special: 'harm',
      trigger: 'you face physical damage, suffer -health equal to your foe’s rank or as appropriate to the situation. If your health is 0, suffer -momentum equal to any remaining -health. Then, roll +health or +strength, whichever is higher.',
      strong: 'Choose one.\n- **Shake it off:** If your health is greater than 0, suffer -1 momentum in exchange for +1 health.\n- **Embrace the pain:** Take +1 momentum.',
      weak: 'You press on.',
      miss: 'Also suffer -1 momentum. If you are at 0 health, you must mark wounded or maimed (if currently unmarked) or roll on the following table.',
      table: [
        [10, 'The harm is mortal. [[Face Death]].'],
        [20, 'You are dying. You need to [[Heal]] within an hour or two, or [[Face Death]].'],
        [35, 'You are unconscious and out of action. Alone, you wake in an hour or two. If a merciless foe is near, [[Face Death]].'],
        [50, 'You are reeling. If you do anything vigorous before a breather of a few minutes, roll on this table again.'],
        [100, 'You are battered but still standing.']
      ], tableName: 'Endure Harm table',
      fx: { strong: [{ health: 1, momentum: -1, label: 'Shake it off: +1 health, -1 momentum' }, { momentum: 1, label: 'Embrace the pain: +1 momentum' }] } },

    { cat: 'suffer', name: 'Face Death',
      trigger: 'you are brought to the brink of death, and glimpse the world beyond, roll +presence.',
      roll: [{ label: 'Presence', stat: 'presence' }],
      strong: 'Death rejects you. You are cast back into the mortal world.',
      weak: 'Choose one.\n- You die, but not before making a noble sacrifice. Envision your final moments.\n- Death desires something of you in exchange for your life. Envision what it wants ([[Ask the Oracle]] if unsure), and [[Swear an Oath]] (formidable or extreme) to complete that quest. If you fail to score a hit when you Swear an Oath, or refuse the quest, you are dead. Otherwise, you return to the mortal world and are now **cursed**. You may only clear the cursed debility by completing the quest.',
      miss: 'You are dead.' },

    { cat: 'suffer', name: 'Companion Endure Harm', special: 'companion',
      trigger: 'your companion faces physical damage, they suffer -health equal to the amount of harm inflicted. If your companion’s health is 0, exchange any leftover -health for -momentum. Then, roll +presence or +your companion’s health, whichever is higher.',
      strong: 'Your companion rallies. Give them +1 health.',
      weak: 'Your companion is battered. If their health is 0, they cannot assist you until they gain at least +1 health.',
      miss: 'Also suffer -1 momentum. If your companion’s health is 0, they are gravely wounded and out of action. Without aid, they die in an hour or two. If you roll a miss with a 1 on your action die, and your companion’s health is 0, they are now dead. Take 1 experience for each marked ability on your companion asset, and remove it.' },

    { cat: 'suffer', name: 'Endure Stress', special: 'stress',
      trigger: 'you face mental shock or despair, suffer -spirit equal to your foe’s rank or as appropriate to the situation. If your spirit is 0, suffer -momentum equal to any remaining -spirit. Then, roll +presence or +spirit, whichever is higher.',
      strong: 'Choose one.\n- **Shake it off:** If your spirit is greater than 0, suffer -1 momentum in exchange for +1 spirit.\n- **Embrace the darkness:** Take +1 momentum.',
      weak: 'You press on.',
      miss: 'Also suffer -1 momentum. If you are at 0 spirit, you must mark shaken or corrupted (if currently unmarked) or roll on the following table.',
      table: [
        [10, 'You are overwhelmed. [[Face Desolation]].'],
        [25, 'You give up. [[Forsake Your Oath]] (if possible, one that fits your crisis).'],
        [50, 'You give in to a fear or compulsion and act against your better instincts.'],
        [100, 'You persevere.']
      ], tableName: 'Endure Stress table',
      fx: { strong: [{ spirit: 1, momentum: -1, label: 'Shake it off: +1 spirit, -1 momentum' }, { momentum: 1, label: 'Embrace the darkness: +1 momentum' }] } },

    { cat: 'suffer', name: 'Face Desolation',
      trigger: 'you are brought to the brink of desolation, roll +presence.',
      roll: [{ label: 'Presence', stat: 'presence' }],
      strong: 'You resist and press on.',
      weak: 'Choose one.\n- Your spirit or sanity breaks, but not before you make a noble sacrifice. Envision your final moments.\n- You see a vision of a dreaded event coming to pass. Envision that dark future ([[Ask the Oracle]] if unsure), and [[Swear an Oath]] (formidable or extreme) to prevent it. If you fail to score a hit when you Swear an Oath, or refuse the quest, you are lost. Otherwise, you return to your senses and are now **tormented**. You may only clear the tormented debility by completing the quest.',
      miss: 'You succumb to despair or horror and are lost.' },

    { cat: 'suffer', name: 'Out of Supply', info: true,
      trigger: 'your supply is exhausted (reduced to 0), mark unprepared. If you suffer additional -supply while unprepared, you must exchange each additional -supply for any combination of -health, -spirit, or -momentum as appropriate to the circumstances.' },

    { cat: 'suffer', name: 'Face a Setback', info: true,
      trigger: 'your momentum is at its minimum (-6), and you suffer additional -momentum, choose one.\n- Exchange each additional -momentum for any combination of -health, -spirit, or -supply as appropriate to the circumstances.\n- Envision an event or discovery ([[Ask the Oracle]] if unsure) which undermines your progress in a current quest, journey, or fight. Then, for each additional -momentum, clear 1 unit of progress on that track per its rank (troublesome = clear 3 progress; dangerous = clear 2 progress; formidable = clear 1 progress; extreme = clear 2 ticks; epic = clear 1 tick).' },

    { cat: 'suffer', name: 'Overreach',
      trigger: 'you must spend focus that you do not have, set your focus to 0. Then, for each point of focus you lack, suffer -1 health or -1 spirit (your choice). Then roll +your casting stat (or +insight if you have none).',
      roll: [{ label: 'Casting stat (or Insight)', stat: 'casting' }],
      strong: 'You hold the power together. The spell or ability works as normal.',
      weak: 'It works, but the strain lingers. Suffer -1 momentum.',
      miss: 'The power slips. If the spell or ability was part of a move you scored a hit on, it still takes effect, but roll on the **Miscast** oracle.',
      oracle: 'miscast' },

    /* ---------------- QUEST ---------------- */
    { cat: 'quest', name: 'Swear an Oath',
      trigger: 'you swear a solemn oath to complete a quest, write your oath and give the quest a rank. Then, roll +presence. If you make this oath to a person or community with whom you share a bond, add +1.',
      roll: [{ label: 'Presence', stat: 'presence' }],
      track: 'oath',
      strong: 'You are emboldened and it is clear what you must do next ([[Ask the Oracle]] if unsure). Take +2 momentum.',
      weak: 'You are determined but begin your quest with more questions than answers. Take +1 momentum, and envision what you do to find a path forward.',
      miss: 'You face a significant obstacle before you can begin your quest. Envision what stands in your way ([[Ask the Oracle]] if unsure), and choose one.\n- **You press on:** Suffer -2 momentum, and do what you must to overcome this obstacle.\n- **You give up:** [[Forsake Your Oath]].',
      fx: { strong: [{ momentum: 2 }], weak: [{ momentum: 1 }], miss: [{ momentum: -2, label: 'Press on: -2 momentum' }] } },

    { cat: 'quest', name: 'Reach a Milestone', info: true,
      trigger: 'you make significant progress in your quest by overcoming a critical obstacle, completing a perilous journey, solving a complex mystery, defeating a powerful threat, gaining vital support, or acquiring a crucial item, you may mark progress.\n- Troublesome quest: Mark 3 progress.\n- Dangerous quest: Mark 2 progress.\n- Formidable quest: Mark 1 progress.\n- Extreme quest: Mark 2 ticks.\n- Epic quest: Mark 1 tick.',
      milestone: true },

    { cat: 'quest', name: 'Fulfill Your Oath', progress: 'oath',
      trigger: 'you achieve what you believe to be the fulfillment of your oath, roll the challenge dice and compare to your progress. Momentum is ignored on this roll.',
      strong: 'Your quest is complete. Mark experience (troublesome = 1; dangerous = 2; formidable = 3; extreme = 4; epic = 5).',
      weak: 'There is more to be done or you realize the truth of your quest. Envision what you discover ([[Ask the Oracle]] if unsure). Then, mark experience (troublesome = 0; dangerous = 1; formidable = 2; extreme = 3; epic = 4). You may [[Swear an Oath]] to set things right. If you do, add +1.',
      miss: 'Your quest is undone. Envision what happens ([[Ask the Oracle]] if unsure), and choose one.\n- **You recommit:** Clear all but one filled progress, and raise the quest’s rank by one (if not already epic).\n- **You give up:** [[Forsake Your Oath]].' },

    { cat: 'quest', name: 'Forsake Your Oath', info: true, special: 'forsake',
      trigger: 'you renounce your quest, betray your promise, or the goal is lost to you, clear the oath and [[Endure Stress]]. You suffer -spirit equal to the rank of your quest (troublesome = 1; dangerous = 2; formidable = 3; extreme = 4; epic = 5).' },

    { cat: 'quest', name: 'Advance', info: true,
      trigger: 'you focus on your skills, receive training, find inspiration, earn a reward, or gain a companion, you may spend 3 experience to add a new asset, or 2 experience to upgrade an asset. Path cards must come from your class’s paths, or from a path you gained when you [[Ascend]]. You may not add an asset with a tier requirement higher than your tier.',
      special: 'advance' },

    { cat: 'quest', name: 'Ascend', info: true, special: 'ascend',
      trigger: 'you have earned the experience and fulfilled the oaths required for a new tier, you rise to that tier. Envision how your legend has grown. Then choose two. You may not choose the same option twice.\n- **Hone your gifts:** Add +1 to a stat (to a maximum of +4).\n- **Deepen your power:** Add +1 to your max focus (to a maximum of +6).\n- **Awaken your blood:** Gain the legacy ability of your heritage.\n- **Master your craft:** Upgrade an asset without spending experience.\n- **Walk a new path** (tier 3 or 4 only): Gain the Foundation card of a path of another class.\n\nFrom now on, you may add assets with a tier requirement equal to or lower than your tier.' },

    /* ---------------- FATE ---------------- */
    { cat: 'fate', name: 'Pay the Price', special: 'price',
      trigger: 'you suffer the outcome of a move, choose one.\n- Make the most obvious negative outcome happen.\n- Envision two negative outcomes. Rate one as ‘likely’, and [[Ask the Oracle]] using the yes/no table. On a ‘yes’, make that outcome happen. Otherwise, make it the other.\n- If you have difficulty interpreting the result to fit the current situation, roll again.',
      oracle: 'price' },

    { cat: 'fate', name: 'Ask the Oracle', special: 'ask',
      trigger: 'you seek to resolve questions, discover details in the world, determine how other characters respond, or trigger encounters or events, you may…\n- **Draw a conclusion:** Decide the answer based on the most interesting and obvious result.\n- **Ask a yes/no question:** Decide the odds of a ‘yes’, and roll on the table to check the answer.\n- **Pick two:** Envision two options. Rate one as ‘likely’, and roll to see if it is true. If not, it is the other.\n- **Spark an idea:** Brainstorm or use a random prompt.\n\nOn a match, an extreme result or a twist has occurred.' }
  ];
  OB.MOVE = Object.fromEntries(OB.MOVES.map(m => [m.name, m]));

  OB.ODDS = [
    { key: 'almost', name: 'Almost certain', min: 11 },
    { key: 'likely', name: 'Likely',         min: 26 },
    { key: 'fifty',  name: '50/50',          min: 51 },
    { key: 'unlikely', name: 'Unlikely',     min: 76 },
    { key: 'small',  name: 'Small chance',   min: 91 }
  ];

  /* ======================================================================
     ORACLES
     ====================================================================== */
  const ACTION = ['Scheme','Clash','Weaken','Initiate','Create','Swear','Avenge','Guard','Defeat','Control','Break','Risk','Surrender','Inspect','Raid','Evade','Assault','Deflect','Threaten','Attack','Leave','Preserve','Manipulate','Remove','Eliminate','Withdraw','Abandon','Investigate','Hold','Focus','Uncover','Breach','Aid','Uphold','Falter','Suppress','Hunt','Share','Destroy','Avoid','Reject','Demand','Explore','Bolster','Seize','Mourn','Reveal','Gather','Defy','Transform','Persevere','Serve','Begin','Move','Coordinate','Resist','Await','Impress','Take','Oppose','Capture','Overwhelm','Challenge','Acquire','Protect','Finish','Strengthen','Restore','Advance','Command','Refuse','Find','Deliver','Hide','Fortify','Betray','Secure','Arrive','Affect','Change','Defend','Debate','Support','Follow','Construct','Locate','Endure','Release','Lose','Reduce','Escalate','Distract','Journey','Escort','Learn','Communicate','Depart','Search','Charge','Summon'];
  const THEME = ['Risk','Ability','Price','Ally','Battle','Safety','Survival','Weapon','Wound','Shelter','Leader','Fear','Time','Duty','Secret','Innocence','Renown','Direction','Death','Honor','Labor','Solution','Tool','Balance','Love','Barrier','Creation','Decay','Trade','Bond','Hope','Superstition','Peace','Deception','History','World','Oath','Protection','Nature','Opinion','Burden','Vengeance','Opportunity','Faction','Danger','Corruption','Freedom','Debt','Hate','Possession','Stranger','Passage','Land','Creature','Disease','Advantage','Blood','Language','Rumor','Weakness','Greed','Family','Resource','Structure','Dream','Community','War','Portent','Prize','Destiny','Momentum','Power','Memory','Ruin','Magic','Rival','Problem','Idea','Revenge','Health','Fellowship','Enemy','Religion','Spirit','Fame','Desolation','Strength','Knowledge','Truth','Quest','Pride','Loss','Law','Path','Warning','Relationship','Wealth','Home','Strategy','Supply'];

  const DESCRIPTOR = ['Stoic','Attractive','Passive','Aloof','Affectionate','Generous','Smug','Armed','Clever','Brave','Ugly','Sociable','Doomed','Connected','Bold','Jealous','Angry','Active','Suspicious','Hostile','Hardhearted','Successful','Talented','Experienced','Deceitful','Ambitious','Aggressive','Conceited','Proud','Stern','Dependent','Wary','Strong','Insightful','Dangerous','Quirky','Cheery','Disfigured','Intolerant','Skilled','Stingy','Timid','Insensitive','Wild','Bitter','Cunning','Remorseful','Kind','Charming','Oblivious','Critical','Cautious','Resourceful','Weary','Wounded','Anxious','Powerful','Athletic','Driven','Cruel','Quiet','Honest','Infamous','Dying','Reclusive','Artistic','Disabled','Confused','Manipulative','Relaxed','Stealthy','Confident','Weak','Friendly','Wise','Influential','Young','Adventurous','Oppressed','Vengeful','Cooperative','Armored','Apathetic','Determined','Loyal','Sick','Religious','Selfish','Old','Fervent','Violent','Agreeable','Hot-tempered','Stubborn','Incompetent','Greedy','Cowardly','Obsessed','Careless','Oathbound'];

  const HUMAN = ['Aldric','Amara','Anselm','Arden','Aveline','Bastien','Beatrix','Benedikt','Bryn','Caius','Calla','Cassia','Cedric','Corin','Dalia','Darian','Delphine','Desmond','Edda','Elias','Elowen','Emeric','Esme','Evander','Fenna','Gideon','Greta','Hadrian','Hale','Helena','Idris','Ilse','Isolde','Jarek','Joren','Kael','Kaia','Lena','Leopold','Linnea','Lucan','Lysa','Mabel','Magnus','Marisol','Matthias','Mira','Nadia','Nerys','Niall','Odette','Orin','Osric','Petra','Quentin','Rhea','Rowan','Sabine','Sander','Selene','Silas','Soren','Tamsin','Tarek','Thea','Tobias','Ulric','Una','Valen','Vera','Wenna','Willem','Xander','Yara','Ysolde','Zoran','Adela','Bram','Cira','Dorian','Enna','Faris','Galen','Hester','Ivo','Juna','Kasimir','Lorne','Mireille','Nikolai','Ottilie','Pell','Ronan','Sefa','Talia','Ulla','Vidar','Wren','Yorick','Zelie'];

  OB.ORACLES = {
    /* ----- action / theme ----- */
    action: { title: 'Action', group: 'Action and Theme', hint: 'Roll Action and Theme together and read the pair, such as “Bolster Vengeance”.', rows: U(ACTION) },
    theme:  { title: 'Theme',  group: 'Action and Theme', hint: 'Use with Action to inspire a discovery, event, character, or situation.', rows: U(THEME) },

    /* ----- place ----- */
    region: { title: 'Region', group: 'Place', hint: 'Choose a region of the Amarin at random.', rows: R([[12,'The Crownlands'],[22,'The Sunward Coast'],[32,'The Greenwold'],[40,'The Shardsea Isles'],[50,'The Shattered Heart'],[60,'The Mirefen'],[72,'The Stormcrown Mountains'],[84,'The Frostmarch'],[96,'The Ashen Waste'],[100,'Beyond the Amarin, or the Otherwhere']]) },
    location: { title: 'Location', group: 'Place', hint: 'A point of interest, or where someone or something can be found.',
      rows: R([[1,'Hideout'],[2,'Ruin'],[3,'Mine'],[4,'Waste'],[5,'Place of Power'],[6,'Path'],[7,'Outpost'],[8,'Wall'],[9,'Battlefield'],[10,'Tower'],[11,'Spring'],[12,'Lair'],[13,'Fort'],[14,'Bridge'],[15,'Camp'],[16,'Tomb/Barrow'],[18,'Caravan'],[20,'Waterfall'],[22,'Cave'],[24,'Swamp'],[26,'Fen'],[28,'Ravine'],[30,'Road'],[32,'Tree'],[34,'Pond'],[36,'Fields'],[38,'Marsh'],[40,'Farmstead'],[42,'Rapids'],[44,'Pass'],[46,'Trail'],[48,'Glade'],[50,'Plain'],[52,'Ridge'],[54,'Cliff'],[56,'Grove'],[58,'Village'],[60,'Moor'],[62,'Thicket'],[64,'River Ford'],[66,'Valley'],[68,'Bay/Inlet'],[70,'Foothills'],[72,'Lake'],[75,'River'],[79,'Forest'],[83,'Coast'],[88,'Hill'],[93,'Mountain'],[99,'Woods'],[100,'Anomaly']]) },
    coastal: { title: 'Coastal Waters Location', group: 'Place', hint: 'Where something can be found at sea or on the coast.',
      rows: R([[1,'Fleet'],[2,'Sargassum'],[3,'Flotsam'],[4,'Sunken Ruin'],[5,'Lair'],[10,'Wreck'],[15,'Harbor'],[23,'Ship'],[30,'Rocks'],[38,'Strait'],[46,'Estuary'],[54,'Cove'],[62,'Bay'],[70,'Ice'],[85,'Island'],[99,'Open Water'],[100,'Anomaly']]) },
    locdesc: { title: 'Location Descriptor', group: 'Place', hint: 'Describe the character of a place.',
      rows: U(['High','Remote','Exposed','Small','Broken','Diverse','Rough','Dark','Shadowy','Contested','Grim','Wild','Fertile','Blocked','Ancient','Perilous','Hidden','Occupied','Rich','Big','Savage','Defended','Withered','Mystical','Inaccessible','Protected','Abandoned','Wide','Foul','Dead','Ruined','Barren','Cold','Blighted','Low','Beautiful','Abundant','Lush','Flooded','Empty','Strange','Corrupted','Peaceful','Forgotten','Expansive','Settled','Dense','Civilized','Desolate','Isolated'], 2) },
    ruinfeature: { title: 'Ruin Feature', group: 'Place', hint: 'A part of a ruin of the Dawn Empire, a tomb, or an old fortress.',
      rows: U(['Collapsed great hall','Shattered statue of a mage-king','Flooded lower level','Library of rotting books','Sealed vault door','Floating stones','Garden gone wild','Throne room','Mosaic that shows a secret','Laboratory of strange glass','Shrine to a forgotten god','Bridge over a chasm','Hall of mirrors','Armory with rusted weapons','Barracks of stone beds','Prison cells','Observatory open to the sky','Spiral stair into darkness','Crypt of the imperial dead','Fountain still running','Room that is bigger inside','Portal arch, dark and silent','Treasure room, long looted','Camp of other explorers','Something still alive and waiting'], 4) },
    ruindanger: { title: 'Ruin Danger', group: 'Place', hint: 'A threat inside a ruin.',
      rows: U(['Collapsing floor','Guardian construct','Poison gas','Magic trap','Wild magic storm','Restless dead','Nest of beasts','Rival treasure hunters','Cultists at a ritual','Flooding water','Curse on the treasure','Illusions that mislead','Darkness that eats light','Living ooze','Unstable portal','Spirit of a mage','Goblin tribe','Swarm of vermin','Walls that move','A lost explorer, gone mad','Sleeping monster','Ward that burns intruders','Time slips here','Something mimics voices','Roll twice'], 4) },

    /* ----- settlement ----- */
    settype: { title: 'Settlement Type', group: 'Settlement', hint: 'What kind of community you find.',
      rows: R([[25,'Village'],[40,'Hamlet or farmstead'],[55,'Market town'],[63,'Walled city'],[70,'Castle and its village'],[76,'Temple or monastery'],[81,'Trading post or inn'],[86,'Mage’s tower'],[91,'Dwarven hold'],[95,'Nomad camp'],[98,'Hidden or forbidden place'],[100,'Something strange: a floating town, a fey village, a city of the dead']]) },
    setname: { title: 'Settlement Name', group: 'Settlement', hint: 'A ready-made name.',
      rows: U(['Gullwatch','Calder’s Rest','Thornbury','Highmere','Saltmarsh','Ravensgate','Dunmoor','Brightwater','Kestrel Hold','Oldbridge','Mossvale','Copperhill','Wren’s Crossing','Duskhollow','Stonewick','Amberfield','Larkspur','Blackwell','Greyhaven','Fallowmere','Hearthstone','Westmarch','Cinderford','Willowmere','Owlcrest','Redbank','Silverbrook','Ashford','Mill on the Merrow','Harrowgate','Coldspring','Fairhallow','Ember’s End','Kingsfold','Lanternhill','Hollowell','Brindlemoor','Sunreach','Gallows Hill','Tidewater','Elderglen','Riverbend','Vigil','Pellar’s Landing','Frostwick','Thistledown','Saint Ardin’s','Wolfsden','Mirrorlake','The Last Lantern'], 2) },
    setquick: { title: 'Quick Settlement Name', group: 'Settlement', hint: 'Roll once on each column and join them.', pair: true,
      a: U(['Ash','Black','Bright','Briar','Cold','Crow','Dawn','Deep','Elder','Fair','Gold','Gray','Green','High','Hollow','Lark','Mist','Moon','Oak','Raven','Red','Salt','Silver','Stone','Thorn'], 4),
      b: U(['bridge','brook','crest','dale','fall','ford','gate','haven','hold','hollow','keep','march','mere','moor','port','reach','rest','ridge','shire','spire','stead','tor','vale','watch','wick'], 4) },
    settrouble: { title: 'Settlement Trouble', group: 'Settlement', hint: 'The trouble a community faces. You can also use it to set your starting situation.',
      rows: R([...U(['Outsiders rejected','Dangerous discovery','Dreadful omens','Natural disaster','Old wounds reopened','Important object is lost','Someone is captured','Mysterious phenomenon','Revolt against a leader','Vengeful outcast','Rival settlement','Nature strikes back','Someone is missing','Production halts','Mysterious murders','Debt comes due','Unjust leadership','Disastrous accident','In league with the enemy','Raiders prey on the weak','Cursed past','An innocent is accused','Corrupted by dark magic','Isolated by brutal weather','Provisions are scarce','Sickness runs amok','Allies become enemies','Attack is imminent','Lost caravan','Dark secret revealed','Urgent expedition','A leader falls','Families in conflict','Incompetent leadership','Reckless warmongering','Beast on the hunt','Betrayed from within','Broken truce','Restless dead','Conflict with the fey','Trade route blocked','In the crossfire','Stranger causes discord','Important event threatened','Dangerous tradition'], 2), [100, 'Roll twice']]) },

    /* ----- character ----- */
    role: { title: 'Character Role', group: 'Character', hint: 'What a person does.',
      rows: R([[2,'Criminal'],[4,'Healer'],[6,'Bandit'],[9,'Guide'],[12,'Performer'],[15,'Miner'],[18,'Mercenary'],[21,'Outcast'],[24,'Vagrant'],[27,'Forester'],[30,'Traveler'],[33,'Mage'],[36,'Priest'],[39,'Sailor'],[42,'Pilgrim'],[45,'Thief'],[48,'Adventurer'],[51,'Forager'],[54,'Leader'],[58,'Guard'],[62,'Artisan'],[66,'Scout'],[70,'Herder'],[74,'Fisher'],[79,'Warrior'],[84,'Hunter'],[89,'Soldier'],[94,'Trader'],[99,'Farmer'],[100,'Unusual role']]) },
    goal: { title: 'Character Goal', group: 'Character', hint: 'What a person wants.',
      rows: R([...U(['Obtain an object','Make an agreement','Build a relationship','Undermine a relationship','Seek a truth','Pay a debt','Refute a falsehood','Harm a rival','Cure an ill','Find a person','Find a home','Seize power','Restore a relationship','Create an item','Travel to a place','Secure provisions','Rebel against power','Collect a debt','Protect a secret','Spread faith','Enrich themselves','Protect a person','Protect the status quo','Advance status','Defend a place','Avenge a wrong','Fulfill a duty','Gain knowledge','Prove worthiness','Find redemption'], 3), [92,'Escape from something'],[95,'Resolve a dispute'],[100,'Roll twice']]) },
    descriptor: { title: 'Character Descriptor', group: 'Character', hint: 'A trait or condition of a person.', rows: U(DESCRIPTOR) },

    /* ----- names ----- */
    n_human: { title: 'Human Names', group: 'Names', rows: U(HUMAN) },
    n_elf: { title: 'Elf Names', group: 'Names', rows: U(['Aelar','Aerith','Caelynn','Elaris','Eredhel','Faelyn','Galadwen','Ilyndra','Ithilwen','Keryth','Laeroth','Lirael','Maelis','Naerith','Nythiel','Orinel','Quelenna','Rhovan','Saelith','Sariel','Seraphel','Sylvar','Thalion','Thessaly','Valanor','Vaelis','Vendril','Yllendra','Zaltarion','Aenwyn','Belanor','Caladriel','Draethis','Elandor','Faenor','Ilphas','Jhaeros','Liadon','Merilwen','Naivara','Phaelan','Riardon','Shanairra','Tarathiel','Theren','Uthiel','Varis','Xanaphia','Yraen','Zylanthe'], 2) },
    n_dwarf: { title: 'Dwarf Names', group: 'Names', rows: U(['Adrik','Agna','Barendd','Bardryn','Brottor','Bruenna','Dagnal','Delre','Diesa','Eberk','Eldeth','Falkrunn','Farra','Gardain','Gunnloda','Harbek','Helja','Hlin','Kathra','Kildrak','Kristryd','Morgran','Orsik','Oskar','Rangrim','Riswynn','Rurik','Sannl','Taklinn','Torbera','Torgga','Tordek','Travok','Ulfgar','Vistra','Veit','Vondal','Amber','Baern','Dorn','Eirny','Fargrim','Grenda','Hilde','Jarna','Kord','Mardred','Nala','Thrain','Yrsa'], 2) },
    n_halfling: { title: 'Halfling Names', group: 'Names', rows: U(['Alton','Andry','Bree','Callie','Cora','Corrin','Eldon','Garret','Jillian','Kithri','Lavinia','Lidda','Lyle','Merla','Milo','Nedda','Osborn','Paela','Perrin','Portia','Reed','Roscoe','Seraphina','Verna','Wellby'], 4) },
    n_gnome: { title: 'Gnome Names', group: 'Names', rows: U(['Alston','Bimpnottin','Boddynock','Brocc','Caramip','Carlin','Dimble','Ellyjobell','Eldon','Fonkin','Frug','Gerbo','Gimble','Lilli','Lorilla','Mardnab','Nissa','Nyx','Orryn','Roondar','Seebo','Sindri','Tana','Waywocket','Zook'], 4) },
    n_orc: { title: 'Orc Names', group: 'Names', rows: U(['Arha','Baggi','Dench','Emen','Engong','Feng','Gell','Henk','Holg','Imsh','Keth','Krusk','Kansif','Mhurren','Myev','Neega','Ovak','Ownka','Ront','Shautha','Sutha','Thokk','Vola','Volen','Yevelda'], 4) },
    n_goblin: { title: 'Goblin Names', group: 'Names', rows: U(['Bix','Dregg','Fizz','Grub','Iggle','Kizzik','Lub','Mog','Nix','Ozzle','Pib','Quiv','Raggit','Skab','Snik','Tibb','Uggle','Vex','Wiz','Yip','Zag','Blik','Drib','Glum','Snaggle'], 4) },
    n_drakkin: { title: 'Drakkin Names', group: 'Names', rows: U(['Arjhan','Balasar','Bharash','Donaar','Ghesh','Heskan','Kriv','Medrash','Mehen','Nadarr','Pandjed','Patrin','Rhogar','Shamash','Tarhun','Torinn','Akra','Biri','Daar','Harann','Kava','Korinn','Mishann','Sora','Thava'], 4) },
    n_faeborn: { title: 'Faeborn Names', group: 'Names', rows: U(['Ashwyn','Briar','Cinder','Dew','Ember','Fennel','Gossamer','Hollyhock','Ivy','Juniper','Lark','Mallow','Nettle','Oriel','Puck','Quill','Rue','Sorrel','Thistle','Umber','Vesper','Willow','Yarrow','Zephyr','Moth'], 4) },
    n_giantkin: { title: 'Giantkin Names', group: 'Names', rows: U(['Aud','Bolverk','Dagny','Embla','Fjalar','Grima','Hrungnir','Idun','Kari','Logi','Mimir','Nott','Orm','Rind','Skadi','Surt','Thrym','Vali','Ymir','Ask','Bestla','Egil','Gunnar','Halla','Starkad'], 4) },
    n_planetouched: { title: 'Planetouched Names', group: 'Names', rows: U(['Akmenos','Amnon','Barakas','Damakos','Ekemon','Iados','Kairon','Leucis','Melech','Mordai','Morthos','Pelaios','Skamos','Therai','Akta','Anakis','Bryseis','Criella','Damaia','Ea','Kallista','Lerissa','Makaria','Nemeia','Orianna'], 4) },
    n_forgeborn: { title: 'Forgeborn Names', group: 'Names', rows: U(['Brass','Cinder','Cog','Dial','Ember','Gauge','Gear','Gilt','Hammer','Iota','Ledger','Lens','Mender','Piston','Quill','Rivet','Seven','Spindle','Sentry','Talon','Tally','Tock','Vesper','Warden','Whistle'], 4) },
    n_beastfolk: { title: 'Beastfolk Names', group: 'Names', rows: U(['Ash-Ear','Brindle','Copper','Dawnhorn','Ember-Eye','Fleetfoot','Graymane','Hollowfang','Ironhide','Jetwing','Kestrel','Longstride','Mosspelt','Nightclaw','Oakhorn','Quickpaw','Redtail','Silvermane','Stormhoof','Swiftwing','Thornback','Umberfur','Whitefang','Wildheart','Yellowtooth'], 4) },
    n_family: { title: 'Family Names and Epithets', group: 'Names', hint: 'Roll once or twice to add a surname or a title.', rows: U(['Ashford','Blackwood','Brightwater','Coldridge','Dawnstar','Duskbane','Fairweather','Greymantle','Hawthorne','Highmoor','Holloway','Kingsley','Larkin','Marsh','Mournwell','Oakenshield','Proudfoot','Ravencroft','Redcloak','Saltbrook','Silverhand','Stonebrook','Stormwind','Thornfield','Underhill','Vance','Whitlock','Wolfe','Wren','Yarrow','of the Red Hand','the Unbroken','the Wanderer','Oathkeeper','the Gray','Half-Hand','the Fair','the Bold','the Lame','Twice-Born','Dragonbane','the Silent','of the Lantern','the Younger','the Elder','Crowfriend','the Lost','the Merciful','Ashborn','the Unlucky'], 2) },

    /* ----- turning points ----- */
    combat: { title: 'Combat Action', group: 'Turning Points', hint: 'What a foe does next in a fight.',
      rows: R([[3,'Compel a surrender.'],[6,'Coordinate with allies.'],[9,'Gather reinforcements.'],[13,'Seize something or someone.'],[17,'Provoke a reckless response.'],[21,'Intimidate or frighten.'],[25,'Reveal a surprising truth.'],[29,'Shift focus to someone or something else.'],[33,'Destroy something, or render it useless.'],[39,'Take a decisive action.'],[45,'Reinforce defenses.'],[52,'Ready an action.'],[60,'Use the terrain to gain advantage.'],[68,'Leverage the advantage of a weapon or ability.'],[78,'Create an opportunity.'],[89,'Attack with precision.'],[99,'Attack with power.'],[100,'Take a completely unexpected action.']]) },
    challenge: { title: 'Challenge Rank', group: 'Turning Points', hint: 'Pick a rank at random.', rows: R([[20,'Troublesome'],[55,'Dangerous'],[80,'Formidable'],[93,'Extreme'],[100,'Epic']]) },
    miscast: { title: 'Miscast', group: 'Turning Points', hint: 'When you miss on Cast a Spell or Overreach, or (twice) when a ritual fails.',
      rows: U(['The spell turns on you. Endure Harm (2 harm).','The power floods your mind. Endure Stress (2 stress).','Your power drains away. Set your focus to 0.','The spell hits the wrong target: an ally, a bystander, or you.','A flash of light and sound. All foes nearby know where you are.','The spell works, but in reverse.','Something hears the call: a spirit, a fiend, or a curious fey.','The magic marks you (glowing eyes, ash-grey hair, frost on your breath) until you Make Camp.','Your gear burns, rusts, or rots. Suffer -1 supply.','Wild magic changes the area: plants grow, stone cracks, or the weather turns.','Time slips. You lose minutes or hours, and events move on without you.','The spell leaves your mind. You cannot use it until you Make Camp.','The spell works, but later, at the worst moment.','An echo of the spell stays in this place and acts on its own later.','A rival caster, a cult, or an authority learns of your power and wants it.','Your body is not your own for a moment. Suffer -2 momentum.','A rift opens for a moment. Something comes through, or something is pulled in.','You cannot spend focus until you score a strong hit on Center Yourself.','The magic stains your soul. Mark corrupted, or Endure Stress (3 stress).','Roll twice more. Both results happen.'], 5) },
    plot: { title: 'Major Plot Twist', group: 'Turning Points', hint: 'When the story needs a jolt.',
      rows: U(['It was all a diversion.','A dark secret is revealed.','A trap is sprung.','An assumption is revealed to be false.','A secret alliance is revealed.','Your actions benefit an enemy.','Someone returns unexpectedly.','A more dangerous foe is revealed.','You and an enemy share a common goal.','A true identity is revealed.','You are betrayed by someone who was trusted.','You are too late.','The true enemy is revealed.','The enemy gains new allies.','A new danger appears.','Someone or something goes missing.','The truth of a relationship is revealed.','Two seemingly unrelated situations are shown to be connected.','Unexpected powers or abilities are revealed.','Roll twice more on this table. Both results occur. If they are the same, make it worse.'], 5) },
    omen: { title: 'Divine Omen', group: 'Turning Points', hint: 'When a god, spirit, or patron sends you a sign. What does it mean?',
      rows: U(['A bird falls dead at your feet.','A statue weeps.','Your holy symbol grows warm.','A stranger speaks words you once prayed.','The sun is darkened for a moment.','A child repeats a prophecy.','Flowers bloom out of season.','Your reflection does not move with you.','A bell rings with no one to ring it.','Every candle in the room goes out.','A white animal crosses your path.','You dream the same dream as your ally.','Blood in the water.','A shooting star falls toward your destination.','An old enemy offers help.','A temple door opens on its own.','Your god’s symbol appears in the clouds.','You find a coin from the Dawn Empire.','Silence—every animal stops at once.','A voice says your true name.'], 5) },
    fey: { title: 'Fey Bargain', group: 'Turning Points', hint: 'When a fey creature names its price.',
      rows: U(['Your name','Your shadow','A memory you love','Your firstborn','A year and a day of service','Your voice','A lock of your hair','Your laughter','A true answer to any question','A song never heard before','Your sense of taste','A kiss','Your reflection','The color of your eyes','A promise to return','Your fear','Your next dream','The last word you will speak','An item you carry','Your loyalty, once, when called'], 5) },
    treasure: { title: 'Treasure', group: 'Turning Points', hint: 'When you find a reward in a ruin, a hoard, or a fallen foe’s pack.',
      rows: U(['A purse of old imperial coins. Take +2 supply.','Fine jewelry or gems. Take +2 supply, or use it to bargain.','A healing potion.','A potion of focus.','A spell scroll. Roll on the Magic Item table for its theme.','A map to a hidden place.','A letter or journal that reveals a secret.','A fine weapon or suit of armor.','A minor magic item. Roll on the Magic Item tables.','A ward charm.','A relic of a god or saint.','A key to an unknown door.','A crown, seal, or symbol of rank.','Rare components for a ritual.','A trained beast or an egg.','A deed, title, or claim to land.','Something cursed. Roll again for what it seems to be.','An artifact. Roll on the Magic Item tables, and give it a story.','Nothing of value—but something that matters to someone you know.','Roll twice.'], 5) },
    magicitem: { title: 'Magic Item', group: 'Turning Points', hint: 'Roll once on each column. Decide if it is a minor item or an artifact, then give it a name and a history.', pair: true, join: ' — ',
      a: U(['Sword','Dagger','Bow','Shield','Armor','Cloak','Ring','Amulet','Crown or circlet','Staff','Wand','Boots','Gloves','Belt','Lantern','Mirror','Book','Horn','Bell','Orb','Mask','Key','Cup or chalice','Instrument','Figurine'], 4),
      b: U(['Burns with fire','Freezes with frost','Crackles with lightning','Shines with holy light','Hides in shadow','Heals wounds','Wards against harm','Lets you fly or float','Lets you breathe water','Reveals the hidden','Speaks with the dead','Commands beasts','Charms the mind','Stores a spell','Opens any lock','Grants great strength','Grants great speed','Calls a storm','Summons a servant','Changes your shape','Sees far away','Turns you invisible','Drains life','Bends time','Holds a trapped spirit'], 4) },

    /* ----- fate tables ----- */
    price: { title: 'Pay the Price', group: 'Fate', hint: 'Roll when you suffer the outcome of a move.',
      rows: R([[2,'Roll again and make that result worse. On a third time, think of something dreadful that changes the course of your quest.'],[5,'A person or community you trusted loses faith in you, or acts against you.'],[9,'A person or community you care about is exposed to danger.'],[16,'You are separated from something or someone.'],[23,'Your action has an unintended effect.'],[32,'Something of value is lost or destroyed.'],[41,'The current situation worsens.'],[50,'A new danger or foe is revealed.'],[59,'It causes a delay or puts you at a disadvantage.'],[68,'It is harmful.'],[77,'It is stressful.'],[85,'A surprising development complicates your quest.'],[90,'It wastes resources.'],[94,'It forces you to act against your best intentions.'],[98,'A friend, companion, or ally is put in harm’s way (or you are, if alone).'],[100,'Roll twice more on this table. Both results occur. If they are the same, make it worse.']]) }
  };

  OB.ORACLE_GROUPS = ['Fate', 'Action and Theme', 'Place', 'Settlement', 'Character', 'Names', 'Turning Points'];

  /* ---------- Guide content ---------- */
  OB.CREATION_STEPS = [
    ['Envision your character.', 'Think about their history, their hopes, and their flaws.'],
    ['Choose a heritage and an upbringing.', 'Note the ability each one gives you.'],
    ['Choose a class and one of its two paths.', 'Take the class card and the Foundation card of the path. Note your max focus.'],
    ['Choose a name.', ''],
    ['Set your stats.', 'Arrange +3, +2, +2, +1, +1 across agility, strength, finesse, presence, and insight, in any order.'],
    ['Set your tracks.', 'Health, spirit, and supply start at +5. Focus starts at your max focus.'],
    ['Set momentum.', 'Momentum +2, max momentum +10, momentum reset +2.'],
    ['Mark background bonds.', 'Up to three, one tick each.'],
    ['Choose one talent or companion.', ''],
    ['Note important equipment.', 'Keep it simple.'],
    ['Set a background oath of extreme or epic rank.', 'Then envision your inciting incident and Swear an Oath.']
  ];
})(window.OB);
