/* ==========================================================================
   OATHBOUND — class cards, path cards, world data
   Source: Oathbound Core Rulebook (Bruno Rocha Guimarães), chapters 3, 5, 6
   and Appendix A. Text licensed CC BY-NC-SA 4.0.
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
        ['Sneak Attack', 'When you Strike a foe who is unaware of you or distracted by an ally, you may roll +agility. On a hit, inflict +1 harm.'],
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

  /* ---------- path cards: all 20 paths × 3 tiers from Appendix A ---------- */
  OB.PATH_CARDS = {
    Champion: [
      { tier: 'Foundation', name: 'Champion’s Blade', abilities: [
        'When you Call a Duel or Enter the Fray against a single worthy foe, add +1. On a strong hit, take +1 additional momentum.',
        'When you Strike a foe whose rank is equal to or higher than yours, inflict +1 harm on a strong hit.',
        'When you Swear an Oath upon your weapon, add +1. When you Fulfill Your Oath, you may name your weapon. Once named, when you Endure Stress in battle, add +1.'] },
      { tier: 'Specialization', name: 'Peerless', abilities: [
        'When you burn momentum to improve the result of a Strike or Clash, inflict +2 harm on a hit.',
        'When you Clash and score a strong hit, you may disarm your foe, break their guard, or drive them back. Take +1 momentum.',
        'When you Compel by challenge, boast, or a show of skill, roll +strength and add +1.'] },
      { tier: 'Mastery', name: 'Living Legend', abilities: [
        'When you End the Fight against a formidable or greater foe and score a strong hit, take +1 experience. Your deed is sung across the land.',
        'Once per fight, when you Strike or Clash, you may spend 1 focus to count a weak hit as a strong hit.',
        'When you Face Death in battle, add +2. On a hit, you rise and fight on with +2 health.'] }
    ],
    Warlord: [
      { tier: 'Foundation', name: 'Battle Captain', abilities: [
        'When you Battle, add +1. On a strong hit, you and your allies take +1 momentum.',
        'When you Aid Your Ally with a shouted command, add +1. On a strong hit, take +1 momentum yourself.',
        'When you Compel soldiers, guards, or militia to follow you, add +1.'] },
      { tier: 'Specialization', name: 'Shield of the Line', abilities: [
        'When you fight side by side with allies or soldiers and must Endure Harm, you may spend 1 focus to suffer 2 less harm.',
        'When you Clash to protect an ally, add +1. On a hit, they take +1 momentum.',
        'When you Make Camp with soldiers or allies and choose to plan, take +2 momentum instead of +1.'] },
      { tier: 'Mastery', name: 'General', abilities: [
        'When you lead a company, a militia, or an army into battle, you may Battle +presence and add +2. On a strong hit, the enemy is routed, and your forces suffer no losses.',
        'When you Secure an Advantage by planning an attack or a defense, roll +insight and add +1. On a strong hit, all allies add +1 to their next move in the fight.',
        'When you Swear an Oath to defend a people or a place, add +2.'] }
    ],
    Sentinel: [
      { tier: 'Foundation', name: 'Unbroken Guard', abilities: [
        'When you Clash with a shield or heavy weapon, add +1. On a strong hit, an ally you protect takes +1 momentum.',
        'When you stand guard over a place or person, Face Danger +insight to spot danger, and add +1. On a strong hit, you may take initiative when the threat comes.',
        'When an ally under your protection must Endure Harm, you may step in and Endure Harm in their place. Add +1.'] },
      { tier: 'Specialization', name: 'Iron Will', abilities: [
        'When you Endure Harm or Endure Stress, you may spend 1 focus to reroll your action die.',
        'When you are at 0 health and still fighting, add +1 to Strike and Clash.',
        'Once per session, when you would mark wounded or shaken, you may ignore it.'] },
      { tier: 'Mastery', name: 'The Last Gate', abilities: [
        'When you hold a gate, a bridge, or a narrow way against a superior force, Battle +strength and add +2. On a strong hit, the enemy breaks against you.',
        'When you Clash and score a strong hit, you may inflict your harm on every foe in reach.',
        'When your allies Endure Harm while fighting at your side, they add +1.'] }
    ],
    Avenger: [
      { tier: 'Foundation', name: 'Smite', spell: true, source: 'Divine magic', abilities: [
        'When you Strike with a weapon wreathed in divine light, you may spend 1 focus to inflict +2 harm on a hit.',
        'When you Strike a foe who has harmed the innocent, or one who serves a dark power, add +1.',
        'When you Enter the Fray by calling your god’s name, roll +presence and add +1.'] },
      { tier: 'Specialization', name: 'Mark of Judgment', spell: true, source: 'Divine magic', abilities: [
        'When you spend 1 focus to mark a foe for judgment, you always know where they are. When you Gather Information to find them, add +2.',
        'When you Strike a marked foe, inflict +1 harm on a hit.',
        'When a marked foe flees, surrenders, or hides, you may Face Danger +presence to compel them to face you.'] },
      { tier: 'Mastery', name: 'Wrath of Heaven', spell: true, source: 'Divine magic', abilities: [
        'When you spend 3 focus and call down holy fire, Strike or Battle +presence and add +2. Undead and fiends suffer +2 harm on a hit.',
        'When you Swear an Oath to destroy a great evil, take +2 momentum and add +1 to every Reach a Milestone for that oath.',
        'When you Face Death while your oath of vengeance is unfulfilled, roll twice and choose the better result.'] }
    ],
    Beastmaster: [
      { tier: 'Foundation', name: 'Animal Partner', companion: true, maxHealth: 4, text: 'Choose a beast: wolf, bear, great cat, hawk, or boar. It is a companion with a health track of +4.', abilities: [
        'When you Strike or Clash alongside your beast, add +1. On a hit, inflict +1 harm.',
        'When you Gather Information or Face Danger using your beast’s senses, add +1.',
        'When your beast must Companion Endure Harm, add +1. It heals +1 health when you Make Camp.'] },
      { tier: 'Specialization', name: 'Pack Bond', abilities: [
        'When you and your beast attack the same foe, you may suffer -1 momentum to inflict your harm twice on a hit.',
        'When you Secure an Advantage by sending your beast to flank, distract, or harry, add +1 and take +1 momentum on a hit.',
        'Your beast’s health track increases to +5.'] },
      { tier: 'Mastery', name: 'Lord of Beasts', abilities: [
        'When you spend 2 focus and call the beasts of the land, they come to fight at your side for one scene. Battle +insight and add +2.',
        'Your beast grows to a dire beast. When you Strike alongside it, inflict +2 harm on a hit instead of +1.',
        'When you Face Death and your beast is near, it drags you back. Add +2.'] }
    ],
    Deadeye: [
      { tier: 'Foundation', name: 'Hunter’s Aim', text: 'If you wield a bow…', abilities: [
        'When you Secure an Advantage +agility by taking a moment to aim, envision where you intend to land your shot. Then, add +1 and take +1 momentum on a hit.',
        'Once per fight, when you Strike or Clash, you may take extra shots and suffer -1 supply. When you do, reroll any dice. On a hit, inflict +2 harm and take +1 momentum.',
        'When you Resupply by hunting, add +1 and take +1 momentum on a hit.'] },
      { tier: 'Specialization', name: 'Called Shot', abilities: [
        'When you Strike at range and score a strong hit, choose one: pin your foe in place, cut a rope or strap, or strike a weak point (+1 harm).',
        'When you Face Danger +agility to shoot a missile, a beast in flight, or a falling object out of the air, add +1.',
        'When you Enter the Fray from hiding with a bow, add +1. On a hit, you may make one Strike before the fight begins.'] },
      { tier: 'Mastery', name: 'Arrow of Fate', abilities: [
        'Once per oath, you may spend 3 focus to loose a perfect shot. Strike +agility and add +3. On a hit, inflict 4 harm.',
        'When you Strike at extreme range, you suffer no penalty, and your arrows strike true through wind, fog, or darkness.',
        'When you End the Fight with a shot, take +2 momentum.'] }
    ],
    Shadowblade: [
      { tier: 'Foundation', name: 'Assassin', abilities: [
        'When you Enter the Fray against an unaware foe, add +1. On a hit, you may make one Strike before the fight begins.',
        'When you Strike an unaware or helpless foe, inflict +2 harm on a hit.',
        'When you Gather Information about a target you have sworn to kill, add +1.'] },
      { tier: 'Specialization', name: 'Shadow Step', spell: true, source: 'Shadow magic', abilities: [
        'When you spend 1 focus to step into one shadow and out of another nearby, Face Danger +agility to escape or reach a place. Add +1.',
        'When you shadow step behind a foe and Strike, add +1 and inflict +1 harm on a hit.',
        'When you Make Camp or Seek Haven, you may suffer -1 supply to prepare a poison. Your next Strike with a poisoned weapon inflicts +1 harm on a hit.'] },
      { tier: 'Mastery', name: 'Unseen Death', spell: true, source: 'Shadow magic', abilities: [
        'When you spend 2 focus to turn invisible, you can’t be seen until you attack or the scene ends. Add +2 when you Face Danger to sneak or escape.',
        'When you Strike while invisible, inflict +2 harm on a hit.',
        'When you End the Fight by assassination, the foe’s allies must flee, surrender, or Face Danger against you in terror.'] }
    ],
    Trickster: [
      { tier: 'Foundation', name: 'Silver Tongue', abilities: [
        'When you Compel by lying, flattering, or bluffing, add +1. On a strong hit, take +1 momentum.',
        'When you Face Danger by talking your way out of trouble, roll +presence and add +1.',
        'When you Gather Information by gossip and rumor, add +1.'] },
      { tier: 'Specialization', name: 'Master of Disguise', abilities: [
        'When you Secure an Advantage by taking on a disguise or a false identity, roll +presence and add +1. On a hit, you can move freely among your enemies for a scene.',
        'When you Face Danger to pick a pocket, a lock, or a trap, add +1.',
        'When you Resupply by stealing or swindling, add +1.'] },
      { tier: 'Mastery', name: 'The Grand Scheme', abilities: [
        'When you Swear an Oath to pull off a great heist or con, you may mark 2 progress immediately. When you Reach a Milestone for it, take +1 momentum.',
        'When your scheme goes wrong, you may spend 2 focus to reveal you planned for it all along. Turn a miss into a weak hit.',
        'When you Compel a powerful person, add +2.'] }
    ],
    Evoker: [
      { tier: 'Foundation', name: 'Arcane Bolt', spell: true, source: 'Learned magic', abilities: [
        'When you Strike or Clash with a bolt of raw force at range, roll +insight. This costs no focus. On a strong hit, inflict +1 harm.',
        'When you Strike with your bolt, you may spend 1 focus to make it a storm of light. On a hit, inflict +2 harm instead of +1.',
        'When you Endure Harm from an attack you can see coming, you may spend 1 focus to raise a shield of force. If you do, suffer 2 less harm.'] },
      { tier: 'Specialization', name: 'Fireball', spell: true, source: 'Learned magic', abilities: [
        'When you Strike or Battle by hurling a bead of fire that bursts into flame, roll +insight and spend 1 focus. On a hit, inflict +1 harm, and the fire strikes every foe near your target. You can’t use this spell if your allies are too close.',
        'When you score a strong hit with your fireball, the flames spread to the place around your foes. Envision how this changes the fight, and take +1 momentum.',
        'When a foe casts a spell at you, you may spend 1 focus and Face Danger +insight to unravel it. On a hit, the magic fails.'] },
      { tier: 'Mastery', name: 'Meteor Swarm', spell: true, source: 'Learned magic', abilities: [
        'When you spend 3 focus and call fire from the sky upon a battlefield, a fortress, or a horde, Battle +insight and add +2. On a hit, the enemy is broken or scattered. On a miss, the fire falls where it will. Roll on the Miscast oracle.',
        'When you use this spell in a fight, you may instead Strike +insight against a single foe and inflict 4 harm on a hit.',
        'When you score a strong hit with this spell, take +2 momentum and your foes must flee, surrender, or face you alone.'] }
    ],
    Seer: [
      { tier: 'Foundation', name: 'Read the Weave', spell: true, source: 'Learned magic', abilities: [
        'When you Gather Information about a magical object, place, or creature, roll +insight and add +1. On a strong hit, also learn one weakness or hidden purpose.',
        'When you Attune to an Artifact, add +1. On a weak hit, you may count it as a strong hit if you Endure Stress (2).',
        'When you Ask the Oracle about magic, roll twice and choose the result.'] },
      { tier: 'Specialization', name: 'Far Sight', spell: true, source: 'Learned magic', abilities: [
        'When you spend 1 focus to send your sight to a place you know or can see on a map, Gather Information +insight from a distance. You see and hear, but cannot act there.',
        'When you spend 1 focus to vanish and reappear a short distance away, Face Danger +insight to escape a threat. Add +1.',
        'When you Undertake a Journey and use far sight to scout ahead, add +1 and take +1 momentum on a strong hit.'] },
      { tier: 'Mastery', name: 'Word of Unmaking', spell: true, source: 'Learned magic', abilities: [
        'When you speak the true name of a creature, spell, or artifact and spend 3 focus, Cast a Spell +insight and add +2. On a strong hit, it is undone: banished, broken, or destroyed.',
        'When you Gather Information to learn a true name, add +2.',
        'When you glimpse the future before a danger, spend 2 focus. Once during the scene, you may reroll any dice.'] }
    ],
    Stormblood: [
      { tier: 'Foundation', name: 'Storm Spark', spell: true, source: 'Blood magic', abilities: [
        'When you Strike or Clash with lightning or fire from your hands, roll +presence. This costs no focus. On a strong hit, take +1 momentum.',
        'When you Face Danger against fire, lightning, or a storm, add +1.',
        'When you are angry or afraid and roll a match on a spell, the storm surges: inflict +1 harm, or take +1 focus.'] },
      { tier: 'Specialization', name: 'Call Lightning', spell: true, source: 'Blood magic', abilities: [
        'When you spend 2 focus under an open sky, Strike with a bolt of lightning, roll +presence, and inflict +2 harm on a hit.',
        'When a storm is already raging, the spell costs 1 focus.',
        'When you score a strong hit, the lightning leaps to a second foe. Inflict your harm on both.'] },
      { tier: 'Mastery', name: 'Eye of the Storm', spell: true, source: 'Blood magic', abilities: [
        'When you spend 3 focus to become a living storm, you fly on the wind, and you add +2 to Strike, Battle, and Face Danger until the scene ends. Then Endure Stress (2 stress).',
        'When you Undertake a Journey by riding the storm, mark progress twice on a hit.',
        'When you Overreach, add +1.'] }
    ],
    Wildsoul: [
      { tier: 'Foundation', name: 'Wild Surge', spell: true, source: 'Blood magic', abilities: [
        'When you Cast a Spell, you may let your magic run wild. Add +2. Then roll on the Miscast oracle, even on a hit. On a hit, choose whether the miscast happens.',
        'When you roll a match on any move, take +1 focus.',
        'When you Face Danger by a burst of chaos magic, roll +presence and add +1.'] },
      { tier: 'Specialization', name: 'Bend Luck', spell: true, source: 'Blood magic', abilities: [
        'When you or an ally makes a move, you may spend 1 focus to reroll one challenge die.',
        'When you Ask the Oracle, you may spend 1 focus to roll twice and choose.',
        'When you Pay the Price, you may roll on the table twice and choose.'] },
      { tier: 'Mastery', name: 'Chaos Unbound', spell: true, source: 'Blood magic', abilities: [
        'When you spend 3 focus, you may Cast a Spell of any kind, even one outside your class. Roll +presence and add +2. On a miss, roll on the Miscast oracle twice.',
        'When you roll on the Miscast oracle, you may roll twice and choose.',
        'When you Face Death, chaos saves you. Add +2.'] }
    ],
    Lightbringer: [
      { tier: 'Foundation', name: 'Healing Word', spell: true, source: 'Divine magic', abilities: [
        'When you Heal by calling on divine power, roll +presence. This costs no focus. On a hit, also take or give +1 spirit.',
        'When you spend 1 focus, you may Heal at a distance, or Heal two people at once.',
        'When you Strike with holy fire, roll +presence. This costs no focus. Against undead or fiends, inflict +1 harm on a hit.'] },
      { tier: 'Specialization', name: 'Holy Ward', spell: true, source: 'Divine magic', abilities: [
        'When you spend 1 focus to raise a circle of holy light, undead, fiends, and the fey cannot cross it unless they Face Danger against you. You may Face Danger +presence to hold the circle.',
        'When you bless an ally before a danger, spend 1 focus. The next time they make a move to face that danger, they add +1 and take +1 momentum on a hit.',
        'When you Heal and score a strong hit, you may also clear one condition: wounded or shaken.'] },
      { tier: 'Mastery', name: 'Resurrection', spell: true, source: 'Divine magic', abilities: [
        'When an ally dies, you may Perform a Ritual (extreme) to call them back. If you score a hit, they return, but mark one bane or burden of their choice.',
        'When an ally must Face Death in your presence, you may spend 2 focus to let them roll twice and choose the better result.',
        'When you spend 2 focus to call a servant of your god, it aids you for one scene. You and your allies add +1 to all moves where its help makes sense.'] }
    ],
    Gravekeeper: [
      { tier: 'Foundation', name: 'Speak with the Dead', spell: true, source: 'Divine magic', abilities: [
        'When you spend 1 focus to call the spirit of a corpse, you may Gather Information by asking it questions. Add +1 if you share a bond. On a weak hit, the spirit also delivers troubling news. Endure Stress (1 stress).',
        'You may also speak with the long dead, if you have their bones or an object they loved.',
        'When you Compel a ghost or haunt, roll +presence and add +1.'] },
      { tier: 'Specialization', name: 'Lay to Rest', spell: true, source: 'Divine magic', abilities: [
        'When you Strike or Battle against the undead with your holy symbol raised, roll +presence and add +1. On a strong hit, inflict +2 harm.',
        'When you Endure Stress from death, the dead, or despair, add +1.',
        'When you perform last rites for a fallen ally or foe, take +1 spirit and +1 momentum.'] },
      { tier: 'Mastery', name: 'Gate of Souls', spell: true, source: 'Divine magic', abilities: [
        'When you spend 3 focus and open the gate of death, every undead in the scene must Face Danger against you or be destroyed. Battle +presence and add +2.',
        'When you Face Death, you walk the land of the dead as a guest. Add +2, and on a hit, return with a secret.',
        'When you Perform a Ritual involving the dead, add +2 to the progress roll.'] }
    ],
    Shapeshifter: [
      { tier: 'Foundation', name: 'Many Shapes', abilities: [
        'You may take your beast form without spending focus once per scene. While in beast form, you add +1 to Face Danger and Strike where the form helps.',
        'When you Undertake a Journey in beast form, add +1.',
        'When you Endure Harm in beast form, you may return to your own form and ignore the harm. Then suffer -1 momentum.'] },
      { tier: 'Specialization', name: 'Dire Form', abilities: [
        'When you spend 1 focus to take a dire form (a cave bear, a sabretooth, a giant eagle), you are a formidable creature. Strike and Clash +strength, and inflict +2 harm on a hit.',
        'When you Enter the Fray in a dire form, add +2.',
        'When you take the form of a tiny creature, you can go almost anywhere unseen. Add +2 to Face Danger to sneak.'] },
      { tier: 'Mastery', name: 'Primal Avatar', abilities: [
        'When you spend 3 focus to take the form of a legendary beast (a wyvern, a great elk, a primeval bear), Battle or Strike +strength and add +2. You may fly or swim as the form allows.',
        'When you are in beast form and must Face Death, add +2.',
        'You can keep your beast form while you speak and use your spells.'] }
    ],
    Greenwarden: [
      { tier: 'Foundation', name: 'Thornwhip', spell: true, source: 'Wild magic', abilities: [
        'When you Strike or Clash with a whip of thorns, roll +presence. This costs no focus. On a strong hit, you may pull your foe toward you or drag them down.',
        'When you spend 1 focus to make roots and vines grasp at your foes, Secure an Advantage +presence. On a hit, they are held. You and your allies add +1 to Strike against them.',
        'When you Resupply in the wild, add +1. On a strong hit, take +1 more supply.'] },
      { tier: 'Specialization', name: 'Barkskin', spell: true, source: 'Wild magic', abilities: [
        'When you spend 1 focus to harden your skin like bark, suffer 1 less harm when you Endure Harm until the scene ends. You may cast it on an ally instead.',
        'When you Heal with herbs and green magic, roll +presence and add +1.',
        'When you Make Camp in a forest or grove, add +1 and take +1 spirit on a hit.'] },
      { tier: 'Mastery', name: 'Earthquake', spell: true, source: 'Wild magic', abilities: [
        'When you spend 3 focus and shake the earth, Battle +presence and add +2. On a hit, walls fall, foes are thrown down, and the battlefield changes.',
        'When you Face Danger to open a passage in rock or bring down a cliff, add +2.',
        'When you spend 2 focus, you may wake a great tree or a stone giant to fight for you for one scene.'] }
    ],
    Warsinger: [
      { tier: 'Foundation', name: 'Battle Hymn', spell: true, source: 'Song magic', abilities: [
        'When you Enter the Fray or Battle with a war song, roll +presence. On a hit, you and your allies take +1 momentum.',
        'When you spend 1 focus as you sing in a fight, your allies add +1 the next time they Strike or Clash.',
        'When you Endure Stress while singing, add +1.'] },
      { tier: 'Specialization', name: 'Dissonant Whispers', spell: true, source: 'Song magic', abilities: [
        'When you Strike with a whisper of terrible music, roll +presence. This costs no focus. Your foe suffers 1 harm, and you take +1 momentum on a hit.',
        'When you spend 1 focus as you Strike with dissonant whispers, your foe is driven back in terror. Inflict +1 harm on a hit.',
        'When you Compel by threatening with your magic, add +1.'] },
      { tier: 'Mastery', name: 'Ballad of Heroes', spell: true, source: 'Song magic', abilities: [
        'When you spend 2 focus and sing the ballad of a great deed, you and your allies add +1 to all moves for the rest of the scene.',
        'When you Fulfill Your Oath and compose a song of it, you and your allies take +1 experience.',
        'When an ally must Face Death and you sing for them, they add +2.'] }
    ],
    Enchanter: [
      { tier: 'Foundation', name: 'Words of Charm', spell: true, source: 'Song magic', abilities: [
        'When you Compel with a magical song or charming words, spend 1 focus and add +2.',
        'When you Forge a Bond, add +1.',
        'When you Make Camp and choose to relax, you may share a song or story. You and your allies may each take +1 spirit or +1 momentum.'] },
      { tier: 'Specialization', name: 'Lullaby', spell: true, source: 'Song magic', abilities: [
        'When you spend 1 focus to sing a soft, magical song, Secure an Advantage +presence to put a beast or a few weak foes to sleep. On a hit, they sleep until roughly woken.',
        'When you spend 2 focus, your lullaby can affect a dangerous foe, or a crowd.',
        'When someone you have charmed is asked to act against you, they must make a choice. Ask the Oracle (likely) to see if they refuse.'] },
      { tier: 'Mastery', name: 'Song of Ages', spell: true, source: 'Song magic', abilities: [
        'When you spend 3 focus and sing to a crowd, a court, or an army, Compel +presence and add +3. On a strong hit, they will follow you for a time.',
        'When you Seek Haven and perform, take +2 momentum and you may choose one more option.',
        'When you Gather Information from the dead or the fey by song, roll +presence and add +1.'] }
    ],
    Fiendbound: [
      { tier: 'Foundation', name: 'Eldritch Blast', spell: true, source: 'Pact magic', abilities: [
        'When you Strike or Clash with a beam of hellfire, roll +presence. This costs no focus. On a strong hit, take +1 momentum.',
        'When you Strike with eldritch blast, you may spend 1 focus to hurl your foe back or knock them down. On a hit, inflict +1 harm.',
        'When you spend 1 focus to curse a foe you can see, the next time you Strike them, add +1 and inflict +1 harm on a hit.'] },
      { tier: 'Specialization', name: 'Infernal Servant', spell: true, source: 'Pact magic', abilities: [
        'When you spend 2 focus to call a servant of your patron (an imp, a hellhound, a horned brute), it serves you for a scene. It can fight as a dangerous foe on your side, scout, or carry a message.',
        'When your servant fights with you, add +1 to Strike.',
        'You see in darkness, even magical darkness. When you Face Danger or Gather Information in the dark, add +1.'] },
      { tier: 'Mastery', name: 'Open the Gate', spell: true, source: 'Pact magic', abilities: [
        'When you spend 3 focus in a fight, you may call your patron’s power through a brief rift. Battle +presence and add +2. On a miss, something else comes through.',
        'When you Perform a Ritual to open a gate to the Abyss, add +2 to the progress roll.',
        'When you Face Death, your patron may claim you. Roll twice and choose; if you live, you owe a great service.'] }
    ],
    Feybound: [
      { tier: 'Foundation', name: 'Fey Glamour', spell: true, source: 'Pact magic', abilities: [
        'When you Compel by beguiling someone with fey magic, spend 1 focus and add +2. On a hit, they remember nothing strange.',
        'When you Face Danger by cloaking yourself in an illusion, roll +presence and add +1.',
        'When you Strike with a lance of moonlight, roll +presence. This costs no focus.'] },
      { tier: 'Specialization', name: 'Otherwhere Step', spell: true, source: 'Pact magic', abilities: [
        'When you spend 1 focus to step through the Otherwhere and reappear nearby, Face Danger +presence to escape or reach a place. Add +1.',
        'When you spend 2 focus, you may make one person see you as someone they trust for a scene.',
        'When you make a bargain with a fey creature, you may Ask the Oracle to learn its hidden price before you agree.'] },
      { tier: 'Mastery', name: 'Court of Thorns', spell: true, source: 'Pact magic', abilities: [
        'When you spend 3 focus to bring a piece of the Otherwhere into the world, the place becomes a dream for one scene. Battle +presence and add +2. Your foes are lost, charmed, or afraid.',
        'When you Undertake a Journey through the Otherwhere, mark progress twice on a hit, but each segment may take a day or a year.',
        'When you Face Death, the fey court bargains for you. Add +2. On a hit, Swear an Oath to your patron.'] }
    ]
  };

  /* ---------- catalog: all 24 talents, 8 companions, and 38 spells from Appendix A ---------- */
  OB.CATALOG = {
    talent: [
      { name: 'Herbalist', sub: 'Talent', abilities: [
        'When you Heal using herbal remedies, and you have at least +1 supply, choose one (before rolling): add +2; or suffer -1 supply and take +1 momentum on a hit.',
        'When you Heal and score a strong hit, you or your patient also take +1 spirit.',
        'When you Make Camp and choose to recuperate, add +1. On a hit, you may suffer -1 supply to take +1 additional health.'] },
      { name: 'Sailor', sub: 'Talent', abilities: [
        'When you Undertake a Journey by ship or boat, add +1.',
        'When you Face Danger on deck, in rough water, or in a storm, add +1.',
        'When you Seek Haven in a port, take +1 momentum on a hit.'] },
      { name: 'Explorer', sub: 'Talent', abilities: [
        'When you Undertake a Journey and score a strong hit, take +1 momentum in addition to your other choices.',
        'When you Reach Your Destination and score a strong hit, take +1 experience the first time you find a place no one has mapped.',
        'When you Gather Information to find your way through a ruin, add +1.'] },
      { name: 'Blacksmith', sub: 'Talent', abilities: [
        'When you Make Camp or Seek Haven with tools, you may repair a broken weapon, shield, or armor. Take +1 momentum.',
        'When you Secure an Advantage by improving your gear before a fight, add +1. On a hit, your next Strike inflicts +1 harm.',
        'When you Compel or Seek Haven among craftsfolk, add +1.'] },
      { name: 'Linguist', sub: 'Talent', abilities: [
        'When you Compel or Gather Information in a foreign tongue, add +1.',
        'When you Gather Information from old writing, add +1. On a strong hit, take +1 momentum.',
        'When you meet a people whose language you don’t speak, you may Face Danger +insight to learn enough to be understood.'] },
      { name: 'Noble Born', sub: 'Talent', abilities: [
        'When you Compel nobles, officials, or servants, add +1.',
        'When you Resupply or Seek Haven in a town where your name is known, take +1 supply on a hit.',
        'When you Swear an Oath to restore your house’s honor, add +1.'] },
      { name: 'Veteran', sub: 'Talent', abilities: [
        'When you Enter the Fray, add +1.',
        'When you Battle, add +1. On a strong hit, take +1 momentum.',
        'When you Endure Stress from the horrors of war, add +1.'] },
      { name: 'Brawler', sub: 'Talent · unarmed or improvised weapon', text: 'If you fight unarmed or with an improvised weapon…', abilities: [
        'When you Strike or Clash, add +1. You inflict 2 harm instead of 1.',
        'When you Secure an Advantage by grappling, add +1. On a hit, your foe is held.',
        'When you Compel in a tavern or a brawl, add +1.'] },
      { name: 'Merchant', sub: 'Talent', abilities: [
        'When you Compel by bartering, add +1. On a strong hit, take +1 supply.',
        'When you Resupply in a town or city, add +1.',
        'When you Gather Information about prices, routes, or rivals, add +1.'] },
      { name: 'Ruin Delver', sub: 'Talent', abilities: [
        'When you Face Danger to avoid a trap, a collapse, or a hazard in a ruin, add +1.',
        'When you Gather Information in a ruin, add +1. On a strong hit, you also find treasure. Roll on the Treasure oracle.',
        'When you Undertake a Journey through a ruin or the deep places, add +1.'] },
      { name: 'Slayer', sub: 'Talent', abilities: [
        'When you Gather Information by tracking a monster, or when you Secure an Advantage by readying yourself for a fight against one, add +1 and take +1 momentum on a hit.',
        'When you Swear an Oath to slay a monster, you may reroll any dice. When you Fulfill Your Oath and mark experience, take +1 experience.',
        'When you slay a monster (at least formidable), you may take a trophy. When you or an ally later perform a ritual, reroll any dice (one time only).'] },
      { name: 'Survivor', sub: 'Talent', abilities: [
        'When you Endure Harm while at +2 health or less, add +1.',
        'When you are Out of Supply, you may Resupply +insight and add +2.',
        'When you Face Death, add +1. On a hit, take +1 momentum.'] },
      { name: 'Fearless', sub: 'Talent', abilities: [
        'When you Endure Stress from fear or terror, add +1.',
        'When you Enter the Fray against a frightening foe, roll +presence and add +1.',
        'When you Face Desolation, add +1.'] },
      { name: 'Swift', sub: 'Talent', abilities: [
        'When you Face Danger +agility to run, chase, or flee, add +1.',
        'When you Enter the Fray and score a strong hit, take +1 additional momentum.',
        'When you Undertake a Journey on foot at speed, you may mark progress and take +1 momentum without suffering -1 supply.'] },
      { name: 'Swordmaster', sub: 'Talent · needs a sword', text: 'If you wield a sword…', abilities: [
        'When you burn momentum to improve your result on a Strike or Clash, inflict +2 harm on a hit.',
        'When you Secure an Advantage by studying a foe’s fighting style, add +1. On a hit, you may also reroll your action die the next time you Strike or Clash against them.',
        'When you Swear an Oath upon your blade, add +1. When you Fulfill Your Oath, you may name your sword. Once named, when you Endure Stress in battle, add +1.'] },
      { name: 'Archer', sub: 'Talent · needs a bow', text: 'If you wield a bow…', abilities: [
        'When you Secure an Advantage +agility by taking a moment to aim, envision where you intend to land your shot. Then, add +1 and take +1 momentum on a hit.',
        'Once per fight, when you Strike or Clash, you may take extra shots and suffer -1 supply. When you do, reroll any dice. On a hit, inflict +2 harm and take +1 momentum.',
        'When you Resupply by hunting, add +1 and take +1 momentum on a hit.'] },
      { name: 'Twin Blades', sub: 'Talent · weapon in each hand', text: 'If you wield a weapon in each hand…', abilities: [
        'When you Strike or Clash with both blades, add +1. On a strong hit, take +1 momentum.',
        'When you Face Danger to deflect a blow or a missile, add +1.',
        'When you Strike and score a hit, you may suffer -1 momentum to attack a second foe nearby. Inflict your harm on both.'] },
      { name: 'Duelist', sub: 'Talent · single foe with a light blade', text: 'If you fight a single foe with a light blade…', abilities: [
        'When you Clash, you may roll +agility. On a strong hit, take +1 momentum.',
        'When you Call a Duel, add +1. When you choose a boast, take +1 additional momentum.',
        'When you Secure an Advantage by taunting a foe into a reckless attack, roll +presence. On a hit, your next Strike against them inflicts +1 harm.'] },
      { name: 'Shieldwall', sub: 'Talent · needs a shield at the ready', text: 'If you wield a shield…', abilities: [
        'When you Clash with a shield in hand, add +1. On a strong hit, you may also protect an ally: they take +1 momentum.',
        'When you Endure Harm from an attack that your shield can stop, spend 1 focus to suffer 1 less harm.',
        'When forced to Endure Harm in a fight, you may instead sacrifice your shield and ignore all harm. If you do, your shield is destroyed or will require extensive repair; suffer −2 momentum.'] },
      { name: 'Plate and Steel', sub: 'Talent · heavy armor', abilities: [
        'When you wear heavy armor and mark encumbered, you may suffer 1 less harm when you Endure Harm (to a minimum of 1), and add +1 when you Face Danger to resist a blow.',
        'When you Clash while armored, you may roll +strength. On a strong hit, take +1 momentum.',
        'When you Make Camp and care for your armor, you may clear encumbered until you break camp.'] },
      { name: 'Banner-Sworn', sub: 'Talent · bond with leader or faction', text: 'You share a bond with a leader or faction.', abilities: [
        'When you Swear an Oath in service to your leader or faction, add +1. When you Fulfill Your Oath for them, take +1 experience.',
        'When you Battle under your banner, or rally others to it, add +1 and take +1 momentum on a hit.',
        'When you Compel in the name of your leader or faction, add +1.'] },
      { name: 'Battle-Scarred', sub: 'Talent · requires maimed', text: 'You are maimed.', abilities: [
        'Your max momentum is not reduced by the maimed debility. When you Endure Harm, add +1.',
        'When you Compel or Face Danger by showing your scars and your will, roll +strength and add +1.',
        'When you Face Death, add +1.'] },
      { name: 'Alchemist', sub: 'Talent', abilities: [
        'When you Make Camp or Seek Haven with your tools, you may suffer -1 supply to brew one consumable: a healing potion, a potion of focus, or a flask of alchemical fire (2 harm when thrown).',
        'When you Heal using your potions and salves, roll +insight and add +1.',
        'When you Secure an Advantage with a smoke bomb, acid, or alchemical trick, add +1 and take +1 momentum on a hit.'] },
      { name: 'Monster Lore', sub: 'Talent', abilities: [
        'When you Gather Information about a monster, beast, or foe, add +1. On a hit, also learn one weakness.',
        'When you Enter the Fray against a creature you have studied, add +1 and take +1 momentum on a hit.',
        'When you slay a monster (at least formidable), you may take a trophy. When you or an ally later face its kind, add +1 once per fight.'] }
    ],
    companion: [
      { name: 'Hawk', sub: 'Companion', maxHealth: 3, text: 'Your hawk can aid you when it is aloft.', abilities: [
        'Far-seeing: When you Undertake a Journey, or when you Resupply by hunting for small game, add +1.',
        'Fierce: When you Secure an Advantage +agility using your hawk to harass and distract your foes, add +1 and take +1 momentum on a hit.',
        'Vigilant: When you Face Danger +insight to detect an approaching threat, or when you Enter the Fray +insight against an ambush, add +2.'] },
      { name: 'Horse', sub: 'Companion', maxHealth: 5, text: 'You and your horse ride as one.', abilities: [
        'Swift: When you Face Danger +agility using your horse’s speed and grace, or when you Undertake a Journey, add +1.',
        'Fearless: When you Enter the Fray or Secure an Advantage +presence by charging into combat, add +1 and take +1 momentum on a hit.',
        'Mighty: When you Strike or Clash at close range while mounted, add +1 and inflict +1 harm on a hit.'] },
      { name: 'Hound', sub: 'Companion', maxHealth: 4, text: 'Your hound is your loyal companion.', abilities: [
        'Sharp: When you Gather Information using your hound’s keen senses to track your quarry or investigate a scene, add +1 and take +1 momentum on a hit.',
        'Ferocious: When you Strike or Clash alongside your hound and score a hit, inflict +1 harm.',
        'Loyal: When you Endure Stress in the company of your hound, add +1.'] },
      { name: 'Familiar', sub: 'Companion', maxHealth: 2, text: 'A small spirit in the shape of an owl, a cat, a toad, or a raven.', abilities: [
        'Watcher: When you Gather Information by sending your familiar to spy, add +1. You can see through its eyes.',
        'Spell-carrier: When you use a spell, you may cast it through your familiar, as if you stood where it is.',
        'Bound Spirit: When you Center Yourself with your familiar nearby, add +1. When you Overreach, your familiar may suffer the harm in your place.'] },
      { name: 'Great Cat', sub: 'Companion', maxHealth: 4, text: 'A panther, a snow lion, or a striped hunter of the steppes.', abilities: [
        'Stalker: When you Face Danger or Enter the Fray by stealth with your cat at your side, add +1.',
        'Pounce: When you Strike alongside your cat against an unaware foe, inflict +1 harm on a hit.',
        'Guardian: When you Make Camp with your cat keeping watch, add +1.'] },
      { name: 'Hireling', sub: 'Companion', maxHealth: 4, text: 'A sworn sword, a loyal squire, or a porter who knows the roads.', abilities: [
        'Strong Back: When you Undertake a Journey or Resupply with your hireling’s help, add +1.',
        'Shield-Bearer: When you Clash with your hireling fighting at your side, add +1.',
        'Steadfast: When you Endure Stress, your hireling’s loyalty steadies you. Add +1. If you have a bond with them, take +1 momentum on a hit.'] },
      { name: 'Wyrmling Drake', sub: 'Companion', maxHealth: 3, text: 'A young drake, no larger than a dog—for now.', abilities: [
        'Fiery: When you Strike alongside your drake, it breathes fire. Inflict +1 harm on a hit.',
        'Fearsome: When you Compel by threat with your drake beside you, add +1.',
        'Growing: When you Ascend, your drake grows. Add +1 to its health track (to a maximum of +5), and it may carry you in flight once per session.'] },
      { name: 'Spirit Guide', sub: 'Companion', maxHealth: 2, text: 'An ancestor, a saint, or a spirit of the land who walks with you, unseen by others.', abilities: [
        'Counsel: When you Gather Information or Ask the Oracle, you may ask your spirit. Add +1, or roll twice on the oracle and choose.',
        'Ward: When you Endure Stress from the dead or the supernatural, add +1.',
        'Beyond: When you Face Death or Face Desolation, your spirit guides you. Add +1, and on a hit, take +1 momentum.'] }
    ],
    spell: []
  };

  /* Populate the Spell catalog from every spell card in Appendix A */
  (function buildSpellCatalog() {
    const classForPath = {};
    Object.keys(OB.CLASS_INFO).forEach(cls => {
      Object.keys(OB.CLASS_INFO[cls].paths).forEach(p => { classForPath[p] = cls; });
    });
    const tierNum = { Foundation: 1, Specialization: 2, Mastery: 3 };
    Object.keys(OB.PATH_CARDS).forEach(path => {
      const cls = classForPath[path] || '';
      OB.PATH_CARDS[path].forEach((k, idx) => {
        if (!k.spell) return;
        OB.CATALOG.spell.push({
          name: k.name,
          cls,
          path,
          tier: tierNum[k.tier] || (idx + 1),
          pathIdx: idx,
          tierName: k.tier,
          source: k.source || 'Magic',
          sub: path + ' · ' + k.tier + ' · Spell' + (k.source ? ' · ' + k.source : ''),
          text: cls + ' (' + path + ') · Tier ' + (tierNum[k.tier] || (idx + 1)) + ' (' + k.tier + ')',
          abilities: k.abilities
        });
      });
    });
  })();

  /* Magic traditions each class normally draws from (Chapter 5) */
  OB.CLASS_TRADITIONS = {
    Guardian: ['Divine magic'],
    Ranger: ['Wild magic'],
    Rogue: ['Shadow magic'],
    Wizard: ['Learned magic'],
    Sorcerer: ['Blood magic'],
    Cleric: ['Divine magic'],
    Druid: ['Wild magic'],
    Bard: ['Song magic'],
    Warlock: ['Pact magic']
  };

  /* ---------- all 5 artifacts printed in Appendix A ---------- */
  OB.ARTIFACTS = [
    { name: 'Emberbrand', sub: 'Artifact', text: 'An old sword of the Dawn Empire. Its blade burns at a word.', abilities: [
      'When you Strike or Clash with the burning blade, inflict +1 harm on a hit. Undead and creatures of cold take +1 more.',
      'When you hold the blade high in a dark place, its fire lights the way and holds back fear. When you Endure Stress in darkness, add +1.',
      'When you Swear an Oath to destroy a great evil upon this blade, add +1. If you Forsake Your Oath, the blade goes cold until you redeem yourself.'] },
    { name: 'Crown of the Drowned King', sub: 'Artifact', text: 'A crown of black pearl and coral. It is always wet.', abilities: [
      'When you Gather Information from the dead or Compel the restless dead, roll +presence and add +1.',
      'When you wear the crown under water, you breathe as a fish and see as clearly as by day.',
      'When you spend 2 focus and command the drowned dead to rise, a troublesome host serves you for one scene. Then Endure Stress (2 stress) as the crown whispers.'] },
    { name: 'Staff of the Archmage', sub: 'Artifact', text: 'A staff of black wood, crowned by a captured star.', abilities: [
      'When you use a spell, you may spend 1 focus from the staff instead of your own. The staff holds 3 focus. It recharges when you Make Camp.',
      'When you Cast a Spell, add +1.',
      'When you break the staff, Strike or Battle +insight with all of its stored power. Inflict 5 harm on a hit. The staff is destroyed.'] },
    { name: 'Cloak of the Hidden Moon', sub: 'Artifact', text: 'A gray cloak blessed by Veyla. It shimmers like moonlight on water.', abilities: [
      'When you Face Danger to hide or sneak, add +1.',
      'When you spend 1 focus, you can become invisible until you attack or the scene ends.',
      'When you Ask the Oracle about luck, chance, or fortune, roll twice and choose.'] },
    { name: 'Ring of Warding', sub: 'Artifact', text: 'A ring of three intertwined metals.', abilities: [
      'When you Endure Harm from a magical source, suffer 1 less harm.',
      'When you Face Danger against a spell, a curse, or a ward, add +1.',
      'When you spend 2 focus, the ring raises a shield. All allies near you suffer 1 less harm until the scene ends.'] }
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
