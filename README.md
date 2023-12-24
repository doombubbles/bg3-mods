# DoombubblesTweaks

## Spell Changes

**Chromatic Orb** - All variants now deal the traditional 3d8 damage

**Shield** - Upcasts now give +1 more AC per additional spell slot level

**Longstrider and Enhance Leap** - Applies to all nearby allies in an AOE like Feather Fall

**Divine Favour** - Upcasting at 3rd or 4th level increases bonus to +2d4, 5th and 6th to +3d4

**Hex** - Now also gives disadvantage on Saving Throws for the chosen Ability and not just Checks

**New Ritual Spells**

The following spells can now be casted as rituals out of combat

- Misty Step
- Fog Cloud
- Mage Armor
- Knock
- Feign Death
- Remove Curse
- Dimension Door 

**Disintegrate** - Changed VFX

# New Items

**Sacred Ring** - Your Cantrips that require saving throws still deal half damage on a failed save. Drops from the Scared Boar on the Ravaged Beach.

**Ring of Unreasonable Force** - Whenever you deal Force damage to a creature, you can push the creature up to 3m away from you. Grants a special Magic Missile cantrip that shoots one projectile. Found as loot from one of the (yellow lootable) Flaming Fist Bodies in Waukeen's Rest (TODO needs fixing).

**Sculptor's Gloves** - Allies automatically succeed saving throws against your Evocation Spells and take no damage from them. Found in the Mason's Guild basement chest.

**Practical Caster's Gloves** - Item combination of the Quickspell Gloves, the Gemini Gloves and the Spellmight Gloves.

**The Sturdy Cloth** - Grants Bear's Strength, +2 Con (max 20), Advantage on Saving Throws Against Poison, reduces damage taken by 1. Sold by A'jak'nir Jeera in Crèche Y'llek.

**The Cunning Cloth** - Grants Fox's Cunning, +2 Int (max 20), +1 to Int Saving Throws, reroll nat one ability checks. Sold by Roah Moonglow in Moonrise Towers.

**The Lucid Cloth** - Grants Owl's Wisdom, +2 Wis (max 20), +1 to Wis Saving Throws, immunity to Surprised. Sold by Lann Tarv in Moonrise Towers.

**The Splendid Cloth** - Grants Eagle's Splendour, +2 Cha (max 20), Advantage on Saving Throws against Charmed, 12m darkvision. Sold by Araj Oblodra in Moonrise Towers.

<details>
<summary>UUIDs</summary>

| UID                      | UUID                                   |
| ------------------------ | -------------------------------------- |
| `DBT_SacredRing`         | `c242c2c3-e372-4469-a7d3-58c096fb2ae1` |
| `DBT_ForceRing`          | `b52d175d-cf4a-40ae-bf0b-4858e83026ef` |
| `DBT_SculptorsGloves`    | `55632913-80bc-44a1-9b86-259b159a253c` |
| `DBT_Spell_Combo_Gloves` | `a3ba9ffb-1c74-4a2a-8b0f-4a8e30fbb0fd` |
| `DBT_CON_Cloth`          | `53bc0e86-12b9-4a87-bc29-8ed71d9b7003` |
| `DBT_INT_Cloth`          | `092c5cd7-a19b-4d0f-bbbf-553170020a4b` |
| `DBT_WIS_Cloth`          | `f1771efc-df41-4236-bf40-103a98811e6c` |
| `DBT_CHA_Cloth`          | `78c45258-8bec-40da-9d7b-cfa61dbbf9da` |

</details>

## Item Changes

**Adamatine Weapons** - Now have +2 Enchantment and send targets Reeling on hit

**Mourning Frost**
 - DC for Chilled debuff is now your spell save DC instead of flat 12
 - Cold damage buff is 1d4 instead of 1
 - Provided Ray of Frost is now a once per combat bonus action

**Gold Wyrmling Staff** - Provided Firebolt is now a once per combat bonus action

**Incandescent Staff** - Provided Firebolt is now a once per combat bonus action

**Quickspell Gloves** - Effect now useable once per combat instead of short rest

**Gemini Gloves** - Effect now useable once per combat instead of short rest

**Club of Hill Giant Strength** - Now properly sets Strength to 21 instead of 19

**Ring of Self Immolation** - Deals 1 damage instead of 1d4 and usable per combat instead of per short rest

**Blooded Greataxe, Helmt of Grit, Cap of Wrath** - Trigger based on being less than full health, not less than 50%

**Markoheshkir**

- Added "Force to be Reckoned With" attunement to Force damage
  - Force damage resistance, + Proficiency to Force damage
  - Dealing spell damage grants you 1 turn of Force Conduit
  - Can cast Magic Missile and Disintegrate per Short Rest
- Added "Resplendent Dawn" attunment to Radiant Damage
  - Radiant damage resistance, + Proficiency to Radiant damage
  - Dealing spell damage inflicts 1 turn of Radiant Orb on the target
  - Can cast Guiding Bolt and Sunbeam per Short Rest

## Other Changes

**Heat** - Deals 1 damage per turn instead of 1d4 (this then goes to 0 if you have Fire Resistance)

**Heat Convergence** - Deals 2 damage per turn remaining instead of 1

**Guantlets of Hill Giant Strength** - Renamed to Gauntlets of Frost Strength

**Selune's Spear of Night** - Deals an extra 1d4 Radiant damage, and Moonmote can be used each Short Rest

## Subclass Changes

### War Cleric

- War Priest Extra Attack is now toggleable when it triggers
- Now chooses a Fighting Style at Level 3 from the same list as Paladins
- Now gains "Improved War Priest" at level 5 making War Priest Charges replenish on a Short or Long Rest
- Now gains Extra Attack at level 6 (TODO may not keep this)

### Eldritch Knight

- War Magic now works with Extra Attack and the cantrip and attack can be used in either order
- (Currently Disabled) Now gains spell slots like a half caster instead of a third caster
  - Still chooses specifically Abjuration and Evocation spells at most levels
- (Currently Disabled) Passively learns the Daredevil Proximity effect at level 6

### Arcane Trickster

- Mage Hand no longer has a cooldown
- Mage Hand Legerdemain invisibility now behaves like Greater Invisibility, and Mage Hands passively gain Pass Without A Trace
- Magical Ambush now also lets Sneak Attack be added as reaction to Spell Attacks
- (Currently Disabled) Now gains spell slots like a half caster instead of a third caster
  - Still chooses specifically Illusion and Enchantment spells at most levels

## Pact of the Blade

- You can now choose which Ability Score is used when binding your Pact of the Blade

## Wild Magic Barbarian

- Gain 'Furious Caster' at level 5, making Rage no longer block spell casting 
- Bolstering Magic abilities can be used each Short Rest