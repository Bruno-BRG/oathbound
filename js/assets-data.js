/* ==========================================================================
   OATHBOUND — class cards, path cards, world data
   Source: Oathbound Core Rulebook (Bruno Rocha Guimarães), chapters 3, 5 and 6.
   Path cards for most paths live in Appendix A of the book. Their text is not
   in this file yet: the sheet creates the card with its name, and you type
   the abilities. Evoker is complete. Add more in OB.PATH_CARDS below.
   ========================================================================== */
(function (OB) {
  'use strict';

  /* ---------- class cards: three abilities each, first one marked at start ---------- */
  OB.CLASS_INFO = {
    Warrior: {
      blurb: 'You are a master of arms. Others pray or chant or sneak; you stand in front, weapon in hand, and you do not break.',
      abilities: [
        ['Weapon Master', 'Choose a weapon type you have mastered (blades, axes, spears, hammers, or bows). When you Strike or Clash with that weapon, add +1.'],
        ['Second Wind', 'Once per fight, when you are at +2 health or less, you may spend 1 focus to take +2 health. If you are wounded, you may instead spend 1 focus to ignore that condition until the fight ends.'],
        ['Unstoppable', 'When you burn momentum to improve the result of a Strike or Clash, inflict +1 harm on a hit.']
      ],
      paths: { Champion: 'You fight for glory, honor, and the thrill of single combat. Your blade is your name.', Warlord: 'You are a commander and a soldier’s soldier. On the battlefield, others follow your voice.' },
      foundations: { Champion: 'Champion’s Blade', Warlord: 'Battle Captain' },
      bg: ['Who trained you to fight, and what was the hardest lesson they taught you?', 'What battle do you still dream about?', 'What weapon do you carry, and where did it come from?'],
      bond: ['Which of your allies did you once fight beside—or against?', 'Who do you protect, even when they do not want it?'],
      seeds: ['Avenge the company that was betrayed and slaughtered.', 'Win back the honor you lost on the field.', 'Defend a village that cannot defend itself.', 'Defeat the champion who has never been beaten.', 'Find the lord who sold your company to the enemy.', 'Carry your dying captain’s blade to her homeland.']
    },
    Guardian: {
      blurb: 'You are a shield made flesh. You swore to protect, and the gods heard your oath.',
      abilities: [
        ['Sworn Protector', 'When you Face Danger or Clash to protect an ally or someone in your care, add +1. On a hit, they take +1 momentum.'],
        ['Unyielding', 'When you Endure Harm or Endure Stress, you may spend 1 focus to add +2.'],
        ['Last Bastion', 'When you hold the line so others may escape, Battle and add +2. On a hit, all those you protect escape the fight, and you take +1 spirit.']
      ],
      paths: { Sentinel: 'You are a living wall. Nothing gets past you while you still stand.', Avenger: 'Your god is a god of justice, and you are its blade. You hunt those who harm the innocent.' },
      foundations: { Sentinel: 'Unbroken Guard', Avenger: 'Smite' },
      bg: ['What god, order, or ideal do you serve, and what does it ask of you?', 'Whom did you fail to protect?', 'What symbol is painted on your shield, and why?'],
      bond: ['Which ally have you sworn to keep safe?', 'Who once saved your life, and how can you ever repay them?'],
      seeds: ['Guard a sacred relic on its journey to a distant shrine.', 'Bring a fallen knight of your order to justice.', 'Protect a child of prophecy from those who hunt her.', 'Restore a temple that was desecrated.', 'Hold a mountain pass against the coming horde.', 'Redeem your order’s name after a great betrayal.']
    },
    Ranger: {
      blurb: 'You know the wild places as others know their own homes. Nothing you hunt escapes you for long.',
      abilities: [
        ['Pathfinder', 'When you Undertake a Journey or Gather Information by tracking or reading the land, add +1.'],
        ['Chosen Quarry', 'When you Swear an Oath to hunt a specific foe, they become your quarry. When you Strike your quarry, inflict +1 harm on a hit. When you Gather Information to find them, take +1 momentum on a hit.'],
        ['Wild Heart', 'When you Make Camp in the wilderness, add +1. If you choose to recuperate or relax, you may also take +1 focus.']
      ],
      paths: { Beastmaster: 'A great beast is your partner, your friend, and your other half.', Deadeye: 'No shot is too far, no target too fast. You hunt with bow and patience.' },
      foundations: { Beastmaster: 'Animal Partner', Deadeye: 'Hunter’s Aim' },
      bg: ['What land do you know better than anyone alive?', 'What creature took something from you, and what did it take?', 'Why did you leave the company of other people?'],
      bond: ['Which ally would you trust to watch your back in the dark?', 'Who taught you to track, and where are they now?'],
      seeds: ['Hunt the beast that has been taking children from the borderland.', 'Find the lost expedition in the haunted forest.', 'Guide refugees through the mountains before winter closes the passes.', 'Find the source of the sickness spreading through the wild.', 'Track the poachers who killed your wolf.', 'Map the road to the ruined city that no one returns from.']
    },
    Rogue: {
      blurb: 'Locks open for you. Guards look the other way. Your enemies never see the knife until it is too late.',
      abilities: [
        ['Sneak Attack', 'When you Strike a foe who is unaware of you or distracted by an ally, you may roll +finesse. On a hit, inflict +1 harm.'],
        ['Slippery', 'When you Face Danger to evade, escape, or hide, add +1. On a strong hit, take +1 momentum.'],
        ['Tricks of the Trade', 'When you Secure an Advantage by deception, theft, or sabotage, you may spend 1 focus after rolling to count a weak hit as a strong hit.']
      ],
      paths: { Shadowblade: 'You are a killer in the dark. Your enemies never see you coming.', Trickster: 'You win with wit, nerve, and lies. Every lock, purse, and heart can be opened.' },
      foundations: { Shadowblade: 'Assassin', Trickster: 'Silver Tongue' },
      bg: ['What was the first thing you ever stole, and from whom?', 'Which guild, gang, or master do you owe—and how much?', 'What is the one line you will not cross?'],
      bond: ['Which ally knows a secret that could hang you?', 'Who did you leave behind when the job went wrong?'],
      seeds: ['Steal back the heirloom that was taken from your family.', 'Expose the guildmaster who framed you for murder.', 'Rob the tyrant’s treasury and give it back to the people.', 'Find the partner who vanished with the score.', 'Bring a hidden letter to the queen before her enemies do.', 'Pay off a deadly debt before the new moon.']
    },
    Wizard: {
      blurb: 'You learned magic the hard way: through books, teachers, and many long nights. Your power is not a gift. You earned it, and you can lose it.',
      abilities: [
        ['Spellbook', 'When you Make Camp and choose to study your spellbook, take +1 focus. When you Gather Information about magic, add +1.'],
        ['Arcane Recovery', 'When you Make Camp and score a strong hit, set your focus to its maximum.'],
        ['Mastery', 'Choose one Arcane or Lore spell you have. When you use it, it costs 1 less focus (to a minimum of 0).']
      ],
      paths: { Evoker: 'You study the magic of force and fire. Your spells are weapons of war.', Seer: 'You study the magic of knowledge, distance, and time. You see what others cannot.' },
      foundations: { Evoker: 'Arcane Bolt', Seer: 'Read the Weave' },
      bg: ['Who taught you magic, and why did you leave them?', 'What spell did you learn too early, and what did it cost?', 'What page is missing from your spellbook?'],
      bond: ['Which ally once saved you from your own magic?', 'Which rival wizard still writes to you?'],
      seeds: ['Find the teacher who betrayed your circle.', 'Recover a stolen grimoire before it is read.', 'Undo a spell that you cast in anger.', 'Prove that the sealed tower can be opened.', 'Learn the true name of the thing in your dreams.', 'Destroy the last copy of a forbidden book.']
    },
    Sorcerer: {
      blurb: 'Magic is in your blood. It answers your moods, your fears, and your fury—whether you want it to or not.',
      abilities: [
        ['Raw Power', 'Your magic is in your blood. You may roll +presence instead of +insight for Arcane spells. When you spend focus on a spell, you may spend 1 more focus to add +2.'],
        ['Surge', 'When you roll a match on a spell, the magic surges. On a strong hit, take +2 focus. On a miss, roll on the Miscast oracle twice and choose one result.'],
        ['Shape the Spell', 'When you use a spell, you may spend 1 focus to bend it: it reaches one more target, it lasts much longer, or you cast it with no sound or gesture.']
      ],
      paths: { Stormblood: 'Lightning and fire run in your veins. When your temper rises, the sky answers.', Wildsoul: 'Your magic is chaos. It changes shape, bends luck, and never does the same thing twice.' },
      foundations: { Stormblood: 'Storm Spark', Wildsoul: 'Wild Surge' },
      bg: ['When did your magic first wake, and who was hurt?', 'Where does your power come from? What do you fear it will become?', 'What sign marks you as a sorcerer—a glow, a scent, a storm that follows you?'],
      bond: ['Which ally is not afraid of you, and why?', 'Who wants to cage your power, or to use it?'],
      seeds: ['Find the source of your power before it consumes you.', 'Repair the damage your power did to your hometown.', 'Escape the mage-hunters who killed your mentor.', 'Seal the rift that opened when your magic woke.', 'Find the others born on the night of the red comet.', 'Defeat the dragon whose blood runs in your veins.']
    },
    Cleric: {
      blurb: 'Your god speaks through you. Your hands heal; your words burn. You carry faith where it is needed most.',
      abilities: [
        ['Channel the Divine', 'When you Heal through prayer and the laying on of hands, roll +presence. When you Center Yourself in prayer, add +1.'],
        ['Turn the Unholy', 'When you Face Danger or Compel against undead, fiends, or the corrupted by presenting your holy symbol, roll +presence and add +1. On a strong hit, they flee or cower before you.'],
        ['Divine Favor', 'When you Face Death or Face Desolation, call upon your god. Roll the challenge dice twice and use the better result. If you score a hit, you must Swear an Oath to serve your god.']
      ],
      paths: { Lightbringer: 'Your god is a god of life and light. You heal the hurt and drive back the darkness.', Gravekeeper: 'Your god keeps the gates of death. You guide the dead to rest and destroy those who will not go.' },
      foundations: { Lightbringer: 'Healing Word', Gravekeeper: 'Speak with the Dead' },
      bg: ['Which god do you serve, and what is their domain?', 'When did your god first answer you?', 'What doubt do you hide from your fellow believers?'],
      bond: ['Which ally does not share your faith, and how do you get along?', 'Who did you heal who should have died?'],
      seeds: ['Carry the word of your god into a land that has forgotten it.', 'Destroy the necromancer who raised your village’s dead.', 'Find the stolen relic of your temple.', 'Heal the plague that the healers cannot touch.', 'Learn why your god has fallen silent.', 'Bring peace between two faiths at war.']
    },
    Druid: {
      blurb: 'The green world is alive, and it speaks to you. You are its voice, its claw, and its keeper.',
      abilities: [
        ['Wild Shape', 'When you spend 1 focus to take the form of a beast, choose its gift: swift, mighty, keen-sensed, winged, or aquatic. While in this form, add +1 to moves that its gift helps. You cannot speak or use spells until you return to your own form.'],
        ['Speaker for the Green', 'When you Gather Information from plants, beasts, or the land itself, roll +presence and add +1.'],
        ['Primal Form', 'When you Strike or Clash in beast form, you are armed with a deadly weapon. On a strong hit, inflict +1 harm. You may also choose the form of a great beast: mighty and armored.']
      ],
      paths: { Shapeshifter: 'You run with wolves and fly with hawks. Your body is as wild as your heart.', Greenwarden: 'Roots, thorns, and stone obey you. You are the keeper of the living land.' },
      foundations: { Shapeshifter: 'Many Shapes', Greenwarden: 'Thornwhip' },
      bg: ['Which circle or old druid taught you, and where is your sacred grove?', 'What beast form do you take most often, and why?', 'What part of the wild has been wounded, and who wounded it?'],
      bond: ['Which ally reminds you why people are worth protecting too?', 'Which spirit of the land owes you a favor—or holds a grudge?'],
      seeds: ['Heal the dying heart-tree of the old forest.', 'Stop the loggers and miners who are tearing open the sacred hills.', 'Find the great beast that has vanished from the plains.', 'Break the curse that turns the river black.', 'Bring a lost spirit of the land back to its home.', 'Stop the spread of the blight before it reaches the farms.']
    },
    Bard: {
      blurb: 'Words are your weapons, and music is your magic. You make heroes of ordinary folk—and fools of kings.',
      abilities: [
        ['Inspire', 'When you Aid Your Ally or Secure an Advantage with a song, story, or rousing speech, add +1. On a strong hit, one ally also takes +1 momentum.'],
        ['Cutting Words', 'When you Clash or Face Danger with mocking words or a dissonant chord, roll +presence. On a hit, your foe falters: take +1 momentum.'],
        ['Song of Rest', 'When you Make Camp and perform for your companions, you and your allies may each take +1 spirit or +1 focus on a hit.']
      ],
      paths: { Warsinger: 'Your songs are war drums. Heroes fight harder when you sing.', Enchanter: 'Your songs charm, soothe, and beguile. Hearts and minds bend to your music.' },
      foundations: { Warsinger: 'Battle Hymn', Enchanter: 'Words of Charm' },
      bg: ['What instrument do you play, and who gave it to you?', 'Which song of yours made someone powerful very angry?', 'What true story do you refuse to tell?'],
      bond: ['Which ally is the hero of the song you are writing?', 'Which noble owes you a favor, and which wants you gone?'],
      seeds: ['Find the ending of the lost epic that no one remembers.', 'Prove the hero of a famous ballad was a fraud.', 'Rescue your old troupe from a tyrant’s prison.', 'Recover the enchanted instrument stolen from your college.', 'Bring news of a hidden war to a city that will not listen.', 'Win the heart—or the forgiveness—of someone you wronged.']
    },
    Warlock: {
      blurb: 'You made a bargain with something vast and strange. It gave you power. Someday, it will want something back.',
      abilities: [
        ['Patron’s Gift', 'When you Center Yourself by calling to your patron, add +2. On a weak hit, your patron asks a favor. Envision it, or Ask the Oracle. Refuse, and suffer -2 momentum.'],
        ['Dark Bargain', 'When you Overreach, you may ask your patron to pay the cost. If you do, ignore all harm and stress, but Swear an Oath (dangerous) to serve your patron.'],
        ['Patron’s Shield', 'When you Endure Harm or Endure Stress in the presence of a foe, you may spend 1 focus to add +2.']
      ],
      paths: { Fiendbound: 'Your patron is a lord of the burning Abyss. Your power is fire, fear, and terrible bargains.', Feybound: 'Your patron is a lord of the Otherwhere. Your power is glamour, trickery, and the laws of strange courts.' },
      foundations: { Fiendbound: 'Eldritch Blast', Feybound: 'Fey Glamour' },
      bg: ['Who or what is your patron, and how did you first meet?', 'What did you want so badly that you made the bargain?', 'What does your patron call you?'],
      bond: ['Which ally knows about your pact? Which does not?', 'Who is trying to free you from your patron—or to take your place?'],
      seeds: ['Find a way to break your pact before the debt comes due.', 'Steal a relic your patron desires.', 'Destroy the rival who serves your patron’s enemy.', 'Free your sibling, who made the same bargain and lost.', 'Learn your patron’s true name.', 'Use your patron’s power to save the city—and survive the price.']
    }
  };

  /* ---------- path cards ----------
     Each path has 3 cards: Foundation (tier 1), Specialization (tier 2), Mastery (tier 3).
     A card with `abilities` is complete. A card with only a name is a placeholder you fill in.
     To add the rest of Appendix A, add entries here:
       PathName: [ {tier:'Foundation', name, spell:bool, abilities:['…','…','…']}, {tier:'Specialization'…}, {tier:'Mastery'…} ]
  */
  OB.PATH_CARDS = {
    Evoker: [
      { tier: 'Foundation', name: 'Arcane Bolt', spell: true, abilities: [
        'When you Strike or Clash with a bolt of raw force at range, roll +insight. This costs no focus. On a strong hit, inflict +1 harm.',
        'When you Strike with your bolt, you may spend 1 focus to make it a storm of light. On a hit, inflict +2 harm instead of +1.',
        'When you Face Danger to shoot down a threat (an arrow, a falling stone, a beast in flight), roll +insight. On a hit, take +1 momentum.'] },
      { tier: 'Specialization', name: 'Fireball', spell: true, abilities: [
        'When you Strike or Battle by hurling a bead of fire that bursts into flame, roll +insight and spend 1 focus. On a hit, inflict +1 harm, and the fire strikes every foe near your target. You can’t use this spell if your allies are too close.',
        'When you score a strong hit with your fireball, the flames spread to the place around your foes. Envision how this changes the fight, and take +1 momentum.',
        'When a foe casts a spell at you, you may spend 1 focus and Face Danger +insight to unravel it. On a hit, the magic fails.'] },
      { tier: 'Mastery', name: '' }
    ]
  };


  /* ---------- catalog: talents, companions, spells ----------
     Cards with `abilities` are complete (text printed in the book's chapters 1 to 6).
     Cards marked todo:true have only the name: the book prints them in Appendix A.
     Add or complete an entry here and it shows up in "Add asset" at once:
       { name, sub, text, abilities:['…','…','…'], todo:false } */
  OB.CATALOG = {
    talent: [
      { name: 'Shieldwall', sub: 'Talent · needs a shield at the ready', text: 'If you wield a shield…', abilities: [
        'When you Clash with a shield in hand, add +1. On a strong hit, you may also protect an ally: they take +1 momentum.',
        'When you Endure Harm from an attack that your shield can stop, spend 1 focus to suffer 1 less harm.',
        'When forced to Endure Harm in a fight, you may instead sacrifice your shield and ignore all harm. If you do, your shield is destroyed or will require extensive repair; suffer −2 momentum.'] },
      { name: 'Swordmaster', sub: 'Talent', todo: true }, { name: 'Archer', sub: 'Talent', todo: true },
      { name: 'Healer', sub: 'Talent', todo: true }, { name: 'Sailor', sub: 'Talent', todo: true },
      { name: 'Scholar of Beasts', sub: 'Talent', todo: true }, { name: 'Herbalist', sub: 'Talent', todo: true }
    ],
    companion: [
      { name: 'Hawk', sub: 'Companion', text: 'Your hawk can aid you when it is aloft.', abilities: [
        'Far-seeing: When you Undertake a Journey, or when you Resupply by hunting for small game, add +1.',
        'Fierce: When you Secure an Advantage +agility using your hawk to harass and distract your foes, add +1 and take +1 momentum on a hit.',
        'Vigilant: When you Face Danger +insight to detect an approaching threat, or when you Enter the Fray +insight against an ambush, add +2.'] },
      { name: 'Horse', sub: 'Companion', todo: true }, { name: 'Hound', sub: 'Companion', todo: true },
      { name: 'Familiar', sub: 'Companion', todo: true }, { name: 'Hired Blade', sub: 'Companion', todo: true }
    ],
    spell: [
      { name: 'Far Sight', sub: 'Spell', todo: true }, { name: 'Meteor Swarm', sub: 'Spell · needs tier 3', todo: true }
    ]
  };

  /* ---------- artifacts printed in chapter 5 ---------- */
  OB.ARTIFACTS = [
    { name: 'Emberbrand', sub: 'Artifact', text: 'An old sword of the Dawn Empire. Its blade burns at a word.', abilities: [
      'When you Strike or Clash with the burning blade, inflict +1 harm on a hit. Undead and creatures of cold take +1 more.',
      'When you hold the blade high in a dark place, its fire lights the way and holds back fear. When you Endure Stress in darkness, add +1.',
      'When you Swear an Oath to destroy a great evil upon this blade, add +1. If you Forsake Your Oath, the blade goes cold until you redeem yourself.'] },
    { name: 'Crown of the Drowned King', sub: 'Artifact', text: 'A crown of black pearl and coral. It is always wet.', abilities: [
      'When you Gather Information from the dead or Compel the restless dead, roll +presence and add +1.',
      'When you wear the crown under water, you breathe as a fish and see as clearly as by day.',
      'When you spend 2 focus and command the drowned dead to rise, a troublesome host serves you for one scene. Then Endure Stress (2 stress) as the crown whispers.'] }
  ];

  /* ---------- magic reference (chapter 5) ---------- */
  OB.SCOPES = [
    { key: 'minor',  name: 'Minor',  cost: 0, ex: 'Light a torch, mend a cloak, open a simple lock, send a whispered message across a room, make a small illusion, sense whether magic is near.' },
    { key: 'major',  name: 'Major',  cost: 1, ex: 'Put a few guards to sleep, open a warded door, breathe under water for an hour, speak with a beast, cross a chasm on a bridge of light, hide a group from sight.' },
    { key: 'mighty', name: 'Mighty', cost: 2, ex: 'Bring down a bridge, call a storm, turn the tide of a battle, reveal a demon’s true name, raise a wall of stone, end a curse on a village.' }
  ];
  OB.MAGIC_SOURCES = [
    ['Learned magic', 'Studied in books, academies, and towers. Wizards use it. Precise and broad, but slow to master. (Evoker, Seer)'],
    ['Blood magic', 'Born in the caster. Sorcerers have it. Raw and strong; it answers emotion more than study. (Stormblood, Wildsoul)'],
    ['Divine magic', 'Granted by gods and holy powers. Clerics and guardians receive it. A gift, and gifts can be taken away. (Lightbringer, Gravekeeper, Avenger)'],
    ['Wild magic', 'Drawn from beasts, plants, storms, and the earth. Druids and some rangers know it. (Shapeshifter, Greenwarden, Beastmaster)'],
    ['Song magic', 'Woven from music, poetry, and the spoken word. Bards are its masters. (Warsinger, Enchanter)'],
    ['Pact magic', 'Borrowed from a patron beyond the world. Warlocks wield it, and they pay for it. (Fiendbound, Feybound)']
  ];
  OB.SPELL_RULES = [
    'Attack spells work through **Strike**, **Clash**, or **Battle**. A spell attack from a spell asset counts as a deadly weapon (2 harm), unless the asset says otherwise.',
    'Defensive spells work through **Face Danger**, **Clash**, or **Endure Harm**.',
    'Divination spells work through **Gather Information** or **Secure an Advantage**.',
    'Healing spells work through **Heal**.',
    'Spells of influence work through **Compel**.',
    'Other spells create effects that no other move covers. Then you **Cast a Spell**.',
    'When you use a spell through another move, roll the stat the spell names. If it names none, roll your casting stat. The spell costs no focus unless the asset says so.',
    '**Magic without a spell asset:** the cost is one step higher. Minor costs 1 focus, major costs 2 focus, and mighty effects are beyond you. If the magic does not fit your class or paths at all, you cannot try it—unless you Perform a Ritual.'
  ];
  OB.RITUALS = [
    ['Bless a village’s well against sickness', 'troublesome'],
    ['Seal a crypt so its dead cannot rise', 'dangerous'],
    ['Call a spirit of the land to bargain', 'dangerous'],
    ['Break a curse that has lasted a generation', 'formidable'],
    ['Bind a demon to answer three questions', 'formidable'],
    ['Raise a ward of thorns around a hold', 'formidable'],
    ['Open a sealed door of the Dawn Empire', 'extreme'],
    ['Call back a soul that has just passed', 'extreme'],
    ['Banish a dragon from its lair', 'extreme'],
    ['Close a rift to the Otherwhere or the Abyss', 'epic']
  ];
  OB.GODS = [
    ['Aurel, the Oathwarden', 'Sun, justice, oaths', 'A golden ring'],
    ['Morvanna, the Gray Lady', 'Death, memory, the passage of souls', 'A white candle'],
    ['Ilvaris, the Weaver', 'Magic, knowledge, fate', 'A silver spindle'],
    ['Sylvanor, the Green Father', 'Wild, beasts, seasons', 'An antlered crown'],
    ['Kethra, the Storm Queen', 'Sea, storms, travel', 'A blue feather'],
    ['Durgan Hammerhand', 'Forge, craft, hearth', 'An anvil'],
    ['Veyla, the Hidden Moon', 'Luck, trickery, secrets', 'A crescent coin'],
    ['Ashkarr, the Chained King', 'Tyranny, fire, conquest', 'A broken chain']
  ];
  OB.PATRONS = [
    ['An archfiend of the Abyss', 'Souls, chaos, and the breaking of oaths'],
    ['An archfey of the Otherwhere', 'Amusement, beauty, and the keeping of bargains'],
    ['A dead god', 'To be remembered, worshipped, and reborn'],
    ['A thing from beyond the stars', 'To learn, to grow, and to enter the world'],
    ['An ancient dragon', 'Treasure, territory, and the fall of its rivals'],
    ['A spirit of the elements', 'Balance, or the destruction of what upsets it']
  ];
  OB.CONSUMABLES = [
    ['Healing potion', 'When you drink it, take +2 health. A greater healing potion also clears the wounded condition.'],
    ['Potion of focus', 'When you drink it, take +2 focus.'],
    ['Spell scroll', 'You may Cast a Spell written on the scroll, even if it is outside your class, at its normal cost. Then the scroll burns away.'],
    ['Ward charm', 'When you Endure Harm or Endure Stress from a magical source, you may break the charm to suffer 2 less harm or stress.']
  ];

  /* ---------- Regions: features and quest starters (chapter 6) ---------- */
  OB.REGION_INFO = {
    'The Shardsea Isles': { text: 'A scatter of rocky islands off the western coast, battered by storms. Home to fishing villages, pirate havens, and lighthouses kept by monks of the Storm Queen.',
      features: ['Pirate fleets that answer to the Admiral of Gulls, who has never been seen.', 'The Drowned Bell, a sunken imperial temple whose bell rings at low tide.', 'Lighthouses on the outer isles, some long dark, some lit by unknown hands.', 'Whirlpools, sea serpents, and reefs of living coral that bite.'],
      quests: ['A lighthouse on the farthest isle has gone dark. Ships have been lost on the rocks. The keepers were your friends. What waits in the tower?', 'A pirate captain offers you a share of a sunken treasure if you can dive into the Drowned Bell. Why do you agree, and what do you know that she does not?'] },
    'The Sunward Coast': { text: 'The warm southern coast is lined with free cities: proud, rich, and quarrelsome. Each is ruled by a council of merchant princes, guildmasters, or mage-lords. The greatest is Calvarre, the City of Bridges.',
      features: ['Calvarre, built on a hundred islands joined by a thousand bridges. The Gilded Exchange, where anything can be bought, including secrets and souls.', 'Old imperial aqueducts, now home to smugglers and thieves’ guilds.', 'Vineyards, olive groves, and the summer palaces of the rich.'],
      quests: ['A merchant prince has been murdered, and the city watch is hunting you for it. Who framed you, and why?', 'A guild of mages in Calvarre is selling a drug made from a powdered spellbook. It drives users mad. Who taught them to make it?'] },
    'The Crownlands': { text: 'The heartland of the Amarin is a rolling country of fields, rivers, and old forests, divided between rival kingdoms that rose from the provinces of the Dawn Empire. The largest are Varenhold, ruled by an aging king with no clear heir, and Elmarch, ruled by a young queen with too many.',
      features: ['The White Road, an imperial highway that still runs straight and true.', 'Castles of feuding lords, and villages caught between them.', 'Temples of the Oathwarden, whose knights keep the peace—when they can.', 'Old battlefields where ghosts march on misty nights.'],
      quests: ['The old king of Varenhold is dying, and three claimants have raised banners. You carry a sealed letter that names the true heir. Who gave it to you, and who will kill to have it?', 'Bandits who call themselves the Free Company are robbing lords and feeding the poor. The lord who hired you says they are murderers. Who is telling the truth?'] },
    'The Greenwold': { text: 'An ancient forest of giant trees, older than the Empire and older than the elves who dwell in it. Thick with wild magic. Paths shift. Time slips. In places, the border with the Otherwhere grows thin. The elven realm of Sylvaraen lies deep in its heart, closed to outsiders for a century.',
      features: ['Heart-trees, giant trees that hold the spirits of the forest.', 'Fey rings and moonlit glades where mortals vanish for a year and a day.', 'Druid circles that keep the old bargains between people and the wild.', 'Ruined imperial watchtowers, swallowed by roots.'],
      quests: ['A child of your village wandered into the Greenwold and came back a week later—as an old woman. She will not speak. What happened to her?', 'The elves of Sylvaraen have sent an envoy to the human kingdoms for the first time in a hundred years. Someone wants the envoy dead. Why do you swear to protect her?'] },
    'The Shattered Heart': { text: 'In the center of the Amarin lies the ruin of Aurenthal, the capital of the Dawn Empire. The storm of magic that destroyed it still lingers. The ground is cracked and twisted. Towers float in the air on broken chains of stone. Scavengers, cultists, and monsters fight over the treasures that remain.',
      features: ['The Spire of Dawn, a tower that rises higher each year, though no one builds it.', 'Wild magic storms that change the ruins—and those caught in them.', 'The Ring of Watchers, a circle of camps where treasure hunters gather and trade.', 'Sealed vaults of the mage-kings, some still guarded by their constructs.'],
      quests: ['A map of the imperial vaults has surfaced in the Ring of Watchers. Three expeditions are racing to reach the vault it shows. Which one are you with, and what do you hope to find?', 'A storm of wild magic swept over your camp and changed your companion. They are becoming something else. Can the change be reversed?'] },
    'The Mirefen': { text: 'A vast swamp of black water, reeds, and drowned forests, where the great river meets the eastern sea. Once farmland, until the fall of the Empire broke its dikes. Now home to goblin tribes, lizard-folk, river pirates, and the hags who rule from crooked houses on stilts. The dead do not rest easily here.',
      features: ['Sunken villages, their roofs just above the water.', 'The Hag Mothers, three sisters who bargain with anyone—for a price.', 'Will-o’-wisps that lead travelers to treasure or to death.', 'The Drowned Abbey, where monks still sing beneath the water.'],
      quests: ['A hag has stolen the voice of a famous singer, and the singer wants it back. The hag will trade it only for something you hold dear. What is it?', 'The drowned dead are walking out of the Mirefen and into the villages on its edge. Something is calling them. What is it?'] },
    'The Stormcrown Mountains': { text: 'A wall of high peaks along the northern edge of the Crownlands, crowned by storms. The great dwarven holds lie beneath them, connected by deep roads that run for hundreds of miles. Above, giants herd mammoths and wyverns nest on the cliffs. In the highest peaks, dragons sleep on their hoards.',
      features: ['Khazad Durn, the greatest of the dwarven holds, whose gates have been shut for twenty years.', 'The Deep Roads, dark tunnels beneath the mountains, some long abandoned.', 'Giant steadings of stone and ice, and their ancient feuds.', 'Vharzul, a red dragon that has slept for a century—and is beginning to stir.'],
      quests: ['The gates of Khazad Durn have opened at last, and a single dwarf has come out, carrying a sealed box. She is dying. She asks you to take the box to a temple in the south. What is in it?', 'A village in the foothills has felt the mountain tremble three nights in a row. The old folk say the dragon is waking. How do you plan to stop it?'] },
    'The Frostmarch': { text: 'The cold lands of the far north, where the forests give way to tundra and the long winter lasts eight months of the year. A frontier. Hardy clans of humans, orcs, and giantkin live in timber halls and fight over hunting grounds. Some kingdoms of the south claim this land. None of them hold it.',
      features: ['The Wall of Kings, an imperial fortress-wall now held by outcasts and exiles.', 'Frozen lakes where ancient things sleep beneath the ice.', 'The Aurora Stones, standing stones that sing when the northern lights burn.', 'Clan halls that welcome guests—once.'],
      quests: ['A clan chief has offered her daughter’s hand to the hero who slays the white wyrm of the ice lake. Her daughter does not agree. What do you do?', 'Something has been found frozen in the ice beneath the Wall of Kings: a mage-king of the Empire, perfectly preserved. Some want to wake him. Some want him destroyed.'] },
    'The Ashen Waste': { text: 'South of the Shattered Heart lies a desert of gray dust and black glass. Once it was the breadbasket of the Empire. Now nothing grows there. The sky glows faintly at night, and old magic lingers in the sand. Nomad clans cross it on beasts that drink no water, and they know where the hidden oases and the buried cities lie.',
      features: ['Glass-storms, winds that carry sand sharp enough to strip flesh.', 'The Buried Cities, imperial towns sunk beneath the dunes.', 'Oases guarded by djinn and the spirits of the old empire.', 'Nomad caravans that trade in salt, spices, and relics.'],
      quests: ['A nomad caravan has found a door in the sand, sealed with the mark of the last mage-king. The nomads are afraid to open it. They have asked for your help. Why do they trust you?', 'The glass-storms are moving north toward the farms of the Crownlands. A sage believes they are caused by something buried in the Waste. What is it?'] }
  };

  /* ---------- Your Truths (chapter 6): three options per category ---------- */
  OB.TRUTHS = [
    { key: 'empire', name: 'The Dawn Empire', opts: [
      ['The mage-kings grew too proud. They tried to make themselves gods, and the gods struck them down. The storm that destroyed Aurenthal was divine punishment, and the silence of the gods that followed was a warning.', 'A cult claims the last mage-king did not die, and that he is ready to finish the ritual that would make him a god. They are gathering relics. What relic do you hold, and why must they never have it?'],
      ['The Empire was betrayed from within. A circle of its own mages opened a gate to something beyond the world, and the gate tore the capital apart. Some of those mages fled, and their heirs still hide among us.', 'You have learned that one of your ancestors was among the traitor mages. A hunter of their bloodline has found you. What will you do to clear your name—or to finish what your ancestor began?'],
      ['No one knows why the Empire fell. The histories disagree, and the ruins keep their secrets. But the magic of the Empire is not dead. It sleeps in the vaults, the towers, and the roads—and it is waking.', 'The White Road has begun to glow at night, and travelers on it vanish. The glow is moving toward the Shattered Heart. Where are the travelers going?']] },
    { key: 'kingdoms', name: 'The Kingdoms', opts: [
      ['The kingdoms are weak and quarrelsome, and the land is divided among petty lords. Brigands and monsters roam where no lord rules. There is no peace, only truce.', 'Two lords are about to go to war over a village that sits between their lands. You were born in that village. How will you stop the war?'],
      ['One kingdom rises above the rest. Varenhold has conquered or bound most of the Crownlands to its crown. Its laws bring order, and its armies bring fear.', 'The king of Varenhold has outlawed all magic not sworn to his crown. Your teacher has been arrested. Can you free them before the trial?'],
      ['The free cities hold the true power. Their gold buys armies, their ships rule the seas, and the kingdoms bow to their bankers. Everything is for sale.', 'A merchant prince of Calvarre has bought the debt of an entire kingdom—and now demands its crown. The queen has asked for your help. What is your plan?']] },
    { key: 'magic', name: 'Magic', opts: [
      ['Magic is rare and feared. Most folk have never seen a true spell. Those who wield it are watched, and mage-hunters ride the roads with iron collars.', 'A child in a frontier village has shown signs of magic. The mage-hunters are coming. Will you help the child escape?'],
      ['Magic is known and respected, but controlled. The great academies and mages’ guilds license spellcasters, and unlicensed magic is a crime in most cities.', 'The Grand Academy has expelled you, and your spellbook is in their vault. Without it, your magic will fade. How will you get it back?'],
      ['Magic is everywhere. Charms hang over every door, wizards sell spells in the market, and wild magic leaks from the ruins. It makes life easier, and far more dangerous.', 'A wave of wild magic has swept through a town and made every spell there go wrong. People are trapped in their own enchantments. What caused the wave?']] },
    { key: 'gods', name: 'The Gods', opts: [
      ['The gods are close and real. They speak through their priests, walk among mortals in disguise, and fight their wars through their followers.', 'A god has appeared in your village as a beggar, and asks for shelter. The next morning, the beggar is dead. Who killed a god—and what happens now?'],
      ['The gods are distant. Their power flows through clerics and holy places, but they do not speak plainly. Faith is a matter of trust, and many have lost it.', 'The great temple of the Oathwarden has lost its power. Its clerics cannot heal; its wards have failed. The high priest asks you to learn why.'],
      ['The gods are silent. Since the fall of the Empire, no god has spoken. Divine magic still works—but no one knows where it comes from. Some say the gods are dead, and something else answers prayers in their place.', 'You have heard the voice that answers your prayers, and it is not your god. What does it want?']] },
    { key: 'peoples', name: 'The Peoples', opts: [
      ['The peoples of the Amarin live together in the cities and the kingdoms. Old hatreds remain, but most folk judge each other by deeds, not blood.', 'Someone is stirring up hatred against the orcs of a river town, and violence is near. Who gains from this, and how will you stop it?'],
      ['Each people keeps to its own lands. Humans hold the kingdoms, dwarves the mountains, elves the forests, and orcs the steppes. Travelers are welcome—as guests, never as neighbors.', 'A dwarf and an elf have fallen in love, and both peoples have forbidden it. They have asked you to help them flee. Where will you take them?'],
      ['An old war between the peoples has just ended, and the peace is fragile. Everyone remembers the dead. Everyone suspects the others of planning the next war.', 'An envoy carrying the peace treaty has vanished on the road. If it is not delivered by the new moon, the war begins again. Where is the envoy?']] },
    { key: 'dead', name: 'The Dead', opts: [
      ['The dead rest, if they are buried with the proper rites. Those who are not may rise as hungry shades. Every village has a keeper of the dead, and every keeper is busy.', 'A battlefield of a forgotten war has been plowed by farmers, and the dead have risen to defend their graves. Can they be laid to rest?'],
      ['Necromancy is real and common. Some lords use the dead as laborers and soldiers. Others call it an abomination. The living argue; the dead obey.', 'Your own grandmother’s body has been taken to serve in a necromancer’s mines. Her ghost has come to you for help.'],
      ['Since the fall of the Empire, the dead do not leave. Their souls linger as ghosts, and the land of the dead is closed. No one knows why.', 'A priestess of the Gray Lady believes she has found the lost gate to the land of the dead. She needs someone to guard her on the way there.']] },
    { key: 'monsters', name: 'Monsters', opts: [
      ['Monsters are rare. Most folk think they are stories to scare children. Those who have met one do not speak of it.', 'You saw a monster kill your friend, but no one believes you. The village blames you for the death. Can you find the creature and prove the truth?'],
      ['Monsters haunt the wild places and the ruins. Settled lands are mostly safe, but no one travels far without a weapon. Monster hunters are well paid.', 'The guild of monster hunters has posted a bounty for a beast no one has ever seen. Every hunter who took the bounty has disappeared.'],
      ['Monsters are everywhere, and they are growing in number. Something is breeding them, calling them, or making them. Each year, more villages fall.', 'Monsters have begun to work together, as if commanded. A village survivor heard them speak a single name. What is it?']] },
    { key: 'otherwhere', name: 'The Otherwhere', opts: [
      ['The realm of the fey is a myth. There are strange things in the deep forests, but no other world.', 'A traveler claims to come from a world beyond a door in the forest, and asks for help to go home. Is he mad, or is the myth true?'],
      ['The Otherwhere lies close to our world, and the border is thin in wild places. Fey come and go, making bargains and stealing what they want. They keep their word, to the letter.', 'Your family made a bargain with a fey lord three generations ago. The payment is due, and it is you.'],
      ['Many other worlds touch the Amarin: the Otherwhere of the fey, the burning Abyss, the high halls of the gods, the cold Void between the stars. The fall of the Empire tore holes between them, and not all have closed.', 'A rift has opened above a town, and through it you can see another world. Things are coming through. Who will close it, and how?']] }
  ];
})(window.OB);
