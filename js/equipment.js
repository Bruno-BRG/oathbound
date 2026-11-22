/* Oathbound equipment rules and catalog, shared by the sheet and PDF appendix. */
(function (OB) {
  'use strict';

  OB.GEAR_SLOTS = { weapon: 'Weapon', armor: 'Armor', offhand: 'Off hand', accessory: 'Accessory', consumable: 'Consumable' };
  OB.GEAR_RULES = [
    ['Carry and equip', 'Record named or remarkable items in your inventory. Equip one weapon, one armor, one off-hand item, and up to two accessories. Carried items have no equipped effect. Change your loadout when you have a safe moment.'],
    ['Supply and discovery', 'Supply covers ordinary ammunition, rations, and travel gear. Start with gear that fits your character. When you Resupply in a suitable market, you may take one consumable instead of the Supply you would gain. Find permanent gear as treasure, trade for it, or Secure an Advantage to craft it when you have the tools and materials. Mark Encumbered when your load becomes a burden.'],
    ['Harm and bonuses', 'A simple weapon deals 1 base harm and a deadly weapon deals 2. If a rule sets the harm for an attack, use that value instead. Apply at most one equipment bonus to a roll and one equipment adjustment to the harm from an attack. Class and asset abilities may still apply. An effect written on both an item and an asset applies only once.'],
    ['Attunement', 'An item marked Attunement needs a successful Attune to an Artifact move. Keep at most two items attuned at a time. Release a bond during a safe moment. The item must also be equipped for its magical ability. Attuning equipment costs no XP. If the item has a separate Artifact asset card, acquiring that card still follows the existing move and XP rules.'],
    ['Uses and timing', 'Mark an ability when you invoke it. A scene use recovers when a new scene begins. A camp use recovers when you complete Make Camp. A consumable leaves your inventory after one use. The sheet tracks these limits and pays listed Focus costs. Resolve the effect itself at the table.'],
    ['Make your own', 'Give an item a name, a slot, a story hook, and one effect tied to a specific move or situation. Start with +1, a reroll, or 1 harm prevented. For a stronger effect, add a Focus cost, a use limit, or an attunement requirement.']
  ];

  OB.EQUIPMENT = [
    { id: 'hunting-knife', name: 'Hunting Knife', slot: 'weapon', harm: 1, text: 'A simple blade for camp work and close quarters.' },
    { id: 'longbow', name: 'Longbow', slot: 'weapon', harm: 2, text: 'A deadly ranged weapon. You need both hands to shoot it.' },
    { id: 'ashguard', name: 'Ashguard', slot: 'weapon', harm: 2, attune: true, use: 'scene', text: 'The blade glows when a promise is broken nearby. When you Strike an undead foe and score a hit, mark a use to inflict +1 harm.' },
    { id: 'wayfarer-mail', name: 'Wayfarer Mail', slot: 'armor', use: 'camp', text: 'Its patched links bear the marks of a dozen roads. Before you Endure Harm from a physical blow, mark a use to reduce that harm by 1, to a minimum of 1.' },
    { id: 'briarcoat', name: 'Briarcoat', slot: 'armor', attune: true, use: 'scene', focus: 1, text: 'Living thorns cover a lining of green silk. Before you Face Danger by slipping through tangled terrain or escaping a grasp, spend 1 Focus and mark a use to add +2.' },
    { id: 'oak-rim-shield', name: 'Oak-Rim Shield', slot: 'offhand', use: 'scene', text: 'An old militia shield with a fresh coat of paint. Before you Clash to shield someone beside you, mark a use to add +1.' },
    { id: 'lantern-of-embers', name: 'Lantern of Last Embers', slot: 'offhand', attune: true, use: 'camp', text: 'Its flame leans toward traces of old enchantments. Before you Gather Information about magic left behind in a dark place, mark a use to add +1 and reroll your action die if you wish. Keep the new result.' },
    { id: 'ring-of-embers', name: 'Ring of Banked Embers', slot: 'accessory', attune: true, use: 'scene', text: 'An iron band that stays warm in winter. Before you Endure Harm from flame or extreme cold, mark a use to reduce that harm by 1, to a minimum of 0.' },
    { id: 'waystone-pendant', name: 'Waystone Pendant', slot: 'accessory', attune: true, use: 'camp', focus: 1, text: 'The stone turns toward a road you have already walked. Before you Undertake a Journey along a familiar route, spend 1 Focus and mark a use to add +2.' },
    { id: 'thread-of-the-host', name: 'Thread of the Host', slot: 'accessory', use: 'camp', text: 'A knotted cord gifted by a welcoming household. When you Seek Haven with people who recognize the cord, mark a use to add +1 before you roll.' },
    { id: 'healing-draught', name: 'Healing Draught', slot: 'consumable', use: 'once', text: 'Drink it to take +2 health, subject to the usual restrictions on recovering health.' },
    { id: 'ward-salt', name: 'Ward Salt', slot: 'consumable', use: 'once', text: 'Scatter the salt before you Endure Stress from a supernatural source. Reduce the incoming stress by 2, to a minimum of 0.' }
  ];

  OB.gearLimit = slot => slot === 'accessory' ? 2 : 1;
  OB.gearUseLabel = { scene: 'Once per scene', camp: 'Once per camp', once: 'Single use' };
  OB.gearMeta = item => [OB.GEAR_SLOTS[item.slot], item.slot === 'weapon' ? item.harm + ' base harm' : '',
    item.attune ? 'Attunement' : '', OB.gearUseLabel[item.use], item.focus ? item.focus + ' Focus' : ''].filter(Boolean).join(' · ');
  OB.gearBlock = (c, item) => {
    if (item.slot !== 'consumable' && !item.equipped) return 'Equip to use';
    if (item.attune && !item.attuned) return 'Attune to use';
    if (item.used) return item.use === 'scene' ? 'Used this scene' : 'Used since camp';
    if (item.focus > c.focus) return 'Not enough Focus';
    return '';
  };
  OB.baseHarm = c => c.equipment.find(item => item.slot === 'weapon' && item.equipped)?.harm || c.weaponHarm || 2;
})(window.OB);
