# DoombubblesTweaks

<details>
<summary><h3>Install Guide</h3></summary>

1. Download [BG3 Mod Manager](https://github.com/LaughingLeader/BG3ModManager/releases/latest/download/BG3ModManager_Latest.zip) and extract the folder to somewhere easy to access.
2. Download this mod's [latest release](https://github.com/doombubbles/DoombubblesTweaks/releases/latest/download/DoombubblesTweaks.zip)
3. Open BG3 Mod Manager
4. Drag DoombubblesTweaks to the left section of the BG3 Mod Manager window, from the "Inactive Mods" section to the "Active Mods" section
5. Use the `File -> Export Order to Game` option in the menu (Ctrl + E or the button next to "Export")
6. Launch the Game (through Steam or with Ctrl + Shift + G)

OR

1. Download [BG3 Mod Manager](https://github.com/LaughingLeader/BG3ModManager/releases/latest/download/BG3ModManager_Latest.zip) and extract the folder to somewhere easy to access.
2. Download the `UpdateDoomBubblesTweaks.bat` script and save it somewhere easy to access like your desktop
3. Run `UpdateDoomBubblesTweaks.bat` to download the mod.
4. Open BG3 Mod Manager
5. Drag DoombubblesTweaks to the left section of the BG3 Mod Manager window, from the "Inactive Mods" section to the "Active Mods" section
6. Use the `File -> Export Order to Game` option in the menu (Ctrl + E or the button next to "Export")
7. Launch the Game (through Steam or with Ctrl + Shift + G)

Optional steps
- Pin BG3 Mod Manager to startup for ease of access
- In BG3 Mod Manager, use `Tools -> Download & Extract the Script Extender` (Ctrl + Shift + Alt + T) and click Yes. Then, go to `Settings -> Open Preferences` (Ctrl + P) and under the Script Extender tab, ensure "Enable Achievements" is checked

To Disable:
1. Drag DoombubblesTweaks and any other Active Mods back into the inactive mods section
2. Use the `File -> Export Order to Game` option in the menu (Ctrl + E or the button next to "Export")

</details>

## Spell Changes

**Chromatic Orb** - All variants now deal the traditional 3d8 damage

**Longstrider and Enhance Leap** - Applies to all nearby allies in an AOE like Feather Fall

**Hex** - Now also gives disadvantage on Saving Throws for the chosen Ability and not just Checks

**True Strike** - Now a Bonus Action that's usable only once per fight

**Shield Bash** - Fixed base game effect

**Smites** - Smite Spells other than Banishing no longer require Concentration for their status effects

### New Ritual Spells

The following spells can now be casted as rituals out of combat

- Misty Step
- Fog Cloud
- Mage Armor
- Knock
- Feign Death
- Remove Curse
- Dimension Door

### New Upcast Effects

**Shield** - Upcasts now give +1 more AC per additional spell slot level

**Divine Favour** - Upcasting at 3rd or 4th level increases bonus to +2d4, 5th and 6th to +3d4

**Goodberry** - Now creates 1 additional Berry per additional spell slot level

**Thunderous Smite** - Now deals an extra 1d6 damage per additional spell slot level

**Witch Bolt** - Subsequent activations now also deal an additional 1d12 damage per spell slot level

# New Items

**Sacred Ring** - Your Cantrips that require saving throws still deal half damage on a failed save. Drops from the Scared Boar on the Ravaged Beach.

**Ring of Unreasonable Force** - Whenever you deal Force damage to a creature, you can push the creature up to 3m away from you. Grants a special Magic Missile cantrip that shoots one projectile. Found as loot from one of the (yellow lootable) Flaming Fist Bodies in Waukeen's Rest (TODO needs fixing).

**Sculptor's Gloves** - Allies automatically succeed saving throws against your Evocation Spells and take no damage from them. Found in the Mason's Guild basement chest.

**Practical Caster's Gloves** - Effects of the Quickspell Gloves, the Gemini Gloves and the Spellmight Gloves. Combine using 

**The Sturdy Cloth** - Grants Bear's Strength, +2 Con (max 20), Advantage on Saving Throws Against Poison, reduces damage taken by 1. Sold by A'jak'nir Jeera in Crèche Y'llek.

**The Cunning Cloth** - Grants Fox's Cunning, +2 Int (max 20), +1 to Int Saving Throws, reroll nat one ability checks. Sold by Roah Moonglow in Moonrise Towers.

**The Lucid Cloth** - Grants Owl's Wisdom, +2 Wis (max 20), +1 to Wis Saving Throws, immunity to Surprised. Sold by Lann Tarv in Moonrise Towers.

**The Splendid Cloth** - Grants Eagle's Splendour, +2 Cha (max 20), Advantage on Saving Throws against Charmed, 12m darkvision. Sold by Araj Oblodra in Moonrise Towers.

**Cryothermic Clutches** - Effects of Thermoarcanic Gloves and Winter's Clutches. Combine using 

**Hat of Frostfire Acuity** - Effects of Combination of Hat of Fire Acuity and Coldbrim Hat. Combine using 

**A Staff of Ice and Fire** - +2 Staff. Resistance to Cold and Fire Damage. Whenever you deal Cold damage, also deal 1d4 Fire damage. Whenever you deal Fire damage, also deal 1d4 Cold damage. Effcts of Mourning Frost and Incandescent Staff. Combine using 

**Thread of Uninhibited Kushigo** - New crafting component dropped by the Oprhic Monks.

**The Physical Cloth** - Combines most of the effects of The Mighty Cloth, The Graceful Cloth, and The Sturdy Cloth. Combine using a Thread of Uninhibited Kushigo.

**The Mental Cloth** - Combines most of the effects of The Cunning Cloth, The Lucid Cloth, and The Splendid Cloth. Combine using a Thread of Uninhibited Kushigo.

**The Universal Cloth** - Combines most of the effects of The Physical Cloth and The Mental Cloth. Combine using a Thread of Uninhibited Kushigo, and supply the final power up using the Orphic Ring (which you can now get from Orpheus w/o killing him).

<details>
<summary>UUIDs</summary>

| Name                          | UID                      | UUID                                   |
| ----------------------------- | ------------------------ | -------------------------------------- |
| Sacred Ring                   | `DBT_SacredRing`         | `c242c2c3-e372-4469-a7d3-58c096fb2ae1` |
| Practical Caster's Gloves     | `DBT_Spell_Combo_Gloves` | `a3ba9ffb-1c74-4a2a-8b0f-4a8e30fbb0fd` |
| Sculptor's Gloves             | `DBT_SculptorsGloves`    | `55632913-80bc-44a1-9b86-259b159a253c` |
| Ring of Unreasonable Force    | `DBT_ForceRing`          | `b52d175d-cf4a-40ae-bf0b-4858e83026ef` |
| The Sturdy Cloth              | `DBT_CON_Cloth`          | `53bc0e86-12b9-4a87-bc29-8ed71d9b7003` |
| The Cunning Cloth             | `DBT_INT_Cloth`          | `092c5cd7-a19b-4d0f-bbbf-553170020a4b` |
| The Lucid Cloth               | `DBT_WIS_Cloth`          | `f1771efc-df41-4236-bf40-103a98811e6c` |
| The Splendid Cloth            | `DBT_CHA_Cloth`          | `78c45258-8bec-40da-9d7b-cfa61dbbf9da` |
| Cryothermic Clutches          | `DBT_FrostFire_Gloves`   | `d660e90e-84be-4ad9-997b-9ecc4c15fed8` |
| A Staff of Ice and Fire       | `DBT_FrostFire_Staff`    | `d75bfa7e-aac9-482f-ae67-08a6e520af7a` |
| Hat of Frostfire Acuity       | `DBT_FrostFire_Hat`      | `c4247b73-bb7a-4072-8bfc-a50f7b4e5a46` |
| Thread of Uninhibited Kushigo | `DBT_Cloth_Material`     | `5925af05-beb1-4561-9ba4-31738bda6179` |
| The Physical Cloth            | `DBT_Physical_Cloth`     | `a93ec861-f0ab-4da4-a083-d01fdb73d1e7` |
| The Mental Cloth              | `DBT_Mental_Cloth`       | `b822eb60-7f60-4941-8c17-d9ab69cd647f` |
| The Universal Cloth           | `DBT_Universal_Cloth`    | `efc3c81f-0eda-4dad-a963-401055ab0b60` |
 
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

**Doom Hammer** - Deals an extra 1d4 Lightning damage but cannot be dipped

**Selune's Spear of Night** - Deals an extra 1d4 Radiant damage, and Moonmote can be used each Short Rest

**Hat of Uninhibited Kushigo** - Effect can now stack additively for multiple turns, but you lose stacks when taking damage.

**Training Shield** - Can be used without Shield Proficiency

**Markoheshkir**

- Added "Force to be Reckoned With" attunement to Force damage
  - Force damage resistance, + Proficiency to Force damage
  - Dealing spell damage grants you 1 turn of Force Conduit
  - Can cast Magic Missile and Disintegrate per Short Rest
- Added "Resplendent Dawn" attunment to Radiant Damage
  - Radiant damage resistance, + Proficiency to Radiant damage
  - Dealing spell damage inflicts 1 turn of Radiant Orb on the target
  - Can cast Guiding Bolt and Sunbeam per Short Rest

## Item Upgrading

**Headband of Intellect** - Unobtainable 19 INT version can now be created by combining the normal Warped Headband of Intellect with Enriched Infernal Iron

**Shar's Spear of Darkness** - Can be created by combining Seluûne's Spear of Evening with a Stone of Shadows purchased from Nocturne

**Dark Justiciar's Half-Plate** - Can be created by combining Dark Justiciar's Half-Plate with a Stone of Shadows purchased from Nocturne

**Dark Justiciar's Gloves** - Can be created by combining Dark Justiciar's Gloves with a Stone of Shadows purchased from Nocturne

**Dark Justiciar's Boots** - Can be created by combining Metallic Boots with a Stone of Shadows purchased from Nocturne

## Other Changes

**Heat** - Deals 1 damage per turn instead of 1d4 (this then goes to 0 if you have Fire Resistance)

**Heat Convergence** - Deals 2 damage per turn remaining instead of 1

**Mystra's Benevolence** - No longer removed on respec

**Polearm Master** - Bonus Attack now correctly adds Damage Modifiers

## Class / Subclass Changes

### Cleric

- Blessed Strikes - Divine Strike can now also be applied when you deal damage with a Cantrip
- Harness Divine Power - Spend Channel Divinity to recharge a Spell Slot (up to half of your highest known Spell Slot level rounded up)

#### War Domain

- War Priest Extra Attack is now toggleable when it triggers
- Now chooses a Fighting Style at Level 3 from the same list as Paladins
- Now gains "Improved War Priest" at level 5 making War Priest Charges replenish on a Short or Long Rest
- Now gains Extra Attack at level 6 (TODO may not keep this)

#### Trickery Domain

- Blessing of the Trickster no longer requires concentration

### Fighter

#### Eldritch Knight

- War Magic now works with Extra Attack and the cantrip and attack can be used in either order
- ~~Now gains spell slots like a half caster instead of a third caster~~
  - ~~Still chooses specifically Abjuration and Evocation spells at most levels~~

### Rogue

- (EXPERIMENTAL) Now gains Extra Attack at Level 5
- (EXPERIMENTAL) Now gains Improved Sneak Attack at Level 11, letting you trigger Sneak Attack an additional time each turn

(Because seriously, I haven't seen a single build that ever recommends more than 4 levels of Rogue)

#### Arcane Trickster

- Mage Hand no longer has a cooldown
- Mage Hand Legerdemain invisibility now behaves like Greater Invisibility, and Mage Hands passively gain Pass Without A Trace
- Magical Ambush now also lets Sneak Attack be added as reaction to Spell Attacks
- ~~Now gains spell slots like a half caster instead of a third caster~~
  - ~~Still chooses specifically Illusion and Enchantment spells at most levels~~

### Warlock

#### Pact of the Blade

- Will only use Charisma for attack rolls if it's higher than Strength (and/or Dexterity for Finesse weapons)

### Barbarian

#### Wild Magic 
- Gain 'Furious Caster' at level 5, making Rage no longer block spell casting 
- Bolstering Magic abilities can be used each Short Rest

## Standardization Changes

**Disintegrate** - Changed VFX slightly to include some more red

**Guantlets of Hill Giant Strength** - Renamed to Gauntlets of Frost Strength
