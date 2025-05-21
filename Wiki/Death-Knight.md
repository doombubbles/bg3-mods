**Death Knight** is a new character class added in this mod adapted from the World of Warcraft class of the same name. I was inspired to create this by [VivaSortiara](https://www.nexusmods.com/baldursgate3/users/187617384)'s [Death Knight Class](https://www.nexusmods.com/baldursgate3/mods/1725) mod. I liked some of their ideas but personally wanted a version that was changed more significantly from WoW to more match the mechanics and vibes of BG3 / DnD 5e Classes. This included things like not having a 0-100 resource like Runic Power, not having direct percentage proc chances, using actual BG3 art style for all the icons, incorporating existing 5e spells, etc.

The end result is a Martial class that can utilize it's unique Rune resource to empower its attacks or to cast powerful spells. It has the most overall similarity with Paladin, Warlock, and Way of the Four Elements Monk.


<img align="right" alt="Death Knight Class Icon" height="150" src="images/ClassIcons/DeathKnight.png" />

Death Knights use Strength (or Dexterity) for their attacks, and Intelligence for their casting.

<h3>

> {{ get .loca "h53fbfa3dgcb23g45c5gb3c3g94e7dbd69fde" | quote }}

</h3>

The Death Knight subclasses are:

<span>
<h3>
<a href="Death Knight - Blood"><img alt="Blood DK Icon" height="50" align="center" src="images/ClassIcons/BloodDK.png"/>Blood</a>
&nbsp;⋅
<a href="Death Knight - Frost"><img alt="Frost DK Icon" height="50" align="center" src="images/ClassIcons/FrostDK.png"/>Frost</a>
&nbsp;⋅
<a href="Death Knight - Unholy"><img alt="Unholy DK Icon" height="50" align="center" src="images/ClassIcons/UnholyDK.png"/>Unholy</a>
</h3>
</span>

<table>
  <tbody>
    <tr>
      <th colspan="42"><div align="center">Death Knight Class Progression</div></th>
    </tr>
    <tr>
      <th><div align="center">Level</div></th>
      <th><div align="center">Proficiency<br/>Bonus</div></th>
      <th><div align="center">Features</div></th>
      <th><div align="center">Spells<br/>Known</div></th>
      <th><div align="center">1st<br/>Rune</div></th>
      <th><div align="center">2nd<br/>Rune</div></th>
      <th><div align="center">3rd<br/>Rune</div></th>
      <th><div align="center">Rune<br/>Die</div></th>
    </tr>
    <tr>
      <td><a href="#level-1">1st</a></td>
      <td rowspan="4"><div align="center">+2</div></td>
      <td>
        <a href="#rune-casting">Rune Casting</a>,
        <a href="#level-1"> <img align="top"  height="25" src="images/ControllerIcons/skills_png/PassiveFeature_DeathKnight_Lichborne.png" alt="PassiveFeature_DeathKnight_Lichborne.png" /> Lichborne</a>
      </td>
      <td><div align="center">-</div></td>
      <td><div align="center">1</div></td>
      <td><div align="center">1</div></td>
      <td><div align="center">1</div></td>
      <td rowspan="3"><div align="center">1d4</div></td>
    </tr>
    <tr>
      <td><a href="#level-2">2nd</a></td>
      <td>
        <a href="https://bg3.wiki/wiki/Fighting_Stylye">Fighting Style</a>,
        <a href="#runeforging"> <img align="top"  height="25" src="images/ControllerIcons/skills_png/Action_DeathKnight_Runeforging.png" alt="Action_DeathKnight_Runeforging.png" /> Runeforging</a>
      </td>
      <td><div align="center">2</div></td>
      <td><div align="center">1</div></td>
      <td><div align="center">1</div></td>
      <td><div align="center">1</div></td>
    </tr>
    <tr>
      <td><a href="#level-3">3rd</a></td>
      <td>
        <a href="#level-3"> <img src="images/ClassIcons/DeathKnight.png" height="25" align="top" /> Choose a subclass</a>
      </td>
      <td><div align="center">3</div></td>
      <td><div align="center">2</div></td>
      <td><div align="center">1</div></td>
      <td><div align="center">1</div></td>
    </tr>
    <tr>
      <td><a href="#level-4">4th</a></td>
      <td>
        <a href="https://bg3.wiki/wiki/Feat"> <img src="https://bg3.wiki/w/images/thumb/a/a9/Generic_Feature_Icon.webp/48px-Generic_Feature_Icon.webp.png" height="25" align="top" /> Feat</a>,
        <a href="#level-4"> <img src="images/ClassIcons/DeathKnight.png" height="25" align="top" /> Subclass Feature</a>
      </td>
      <td><div align="center">4</div></td>
      <td><div align="center">2</div></td>
      <td><div align="center">1</div></td>
      <td><div align="center">1</div></td>
      <td rowspan="3"><div align="center">1d6</div></td>
    </tr>
    <tr>
      <td><a href="#level-5">5th</a></td>
      <td rowspan="4"><div align="center">+3</div></td>
      <td>
        <a href="https://bg3.wiki/wiki/Extra_Attack"> <img src="https://bg3.wiki/w/images/thumb/5/5a/Extra_Attack_Icon.webp/50px-Extra_Attack_Icon.webp.png" height="25" align="top" /> Extra Attack</a>
      </td>
      <td><div align="center">5</div></td>
      <td><div align="center">3</div></td>
      <td><div align="center">1</div></td>
      <td><div align="center">1</div></td>
    </tr>
    <tr>
      <td><a href="#level-6">6th</a></td>
      <td>
        <a href="#level-6"> <img src="images/ClassIcons/DeathKnight.png" height="25" align="top" /> Subclass Feature</a>
      </td>
      <td><div align="center">6</div></td>
      <td><div align="center">3</div></td>
      <td><div align="center">1</div></td>
      <td><div align="center">1</div></td>
    </tr>
    <tr>
      <td><a href="#level-7">7th</a></td>
      <td>
        <a href="#rune-tap"> <img align="top"  height="25" src="images/ControllerIcons/skills_png/Action_DeathKnight_RuneTap.png" alt="Action_DeathKnight_RuneTap.png" /> Rune Tap</a>
      </td>
      <td><div align="center">7</div></td>
      <td><div align="center">4</div></td>
      <td><div align="center">2</div></td>
      <td><div align="center">2</div></td>
      <td rowspan="3"><div align="center">1d8</div></td>
    </tr>
    <tr>
      <td><a href="#level-8">8th</a></td>
      <td>
        <a href="https://bg3.wiki/wiki/Feat"> <img src="https://bg3.wiki/w/images/thumb/a/a9/Generic_Feature_Icon.webp/48px-Generic_Feature_Icon.webp.png" height="25" align="top" /> Feat</a>
      </td>
      <td><div align="center">8</div></td>
      <td><div align="center">4</div></td>
      <td><div align="center">2</div></td>
      <td><div align="center">2</div></td>
    </tr>
    <tr>
      <td><a href="#level-9">9th</a></td>
      <td rowspan="4"><div align="center">+4</div></td>
      <td> 
        <a href="#will-of-the-necropolis"> <img src="images/ControllerIcons/skills_png/PassiveFeature_DeathKnight_WillOfTheNecropolis.png" height="25" align="top" alt="PassiveFeature_DeathKnight_WillOfTheNecropolis.png" /> Will of the Necropolis</a> 
      </td>
      <td><div align="center">9</div></td>
      <td><div align="center">5</div></td>
      <td><div align="center">2</div></td>
      <td><div align="center">2</div></td>
    </tr>
    <tr>
      <td><a href="#level-10">10th</a></td>
      <td>
        <a href="#level-10"> <img src="images/ClassIcons/DeathKnight.png" height="25" align="top" /> Subclass Feature</a>
      </td>
      <td><div align="center">10</div></td>
      <td><div align="center">6</div></td>
      <td><div align="center">2</div></td>
      <td><div align="center">2</div></td>
      <td rowspan="3"><div align="center">1d10</div></td>
    </tr>
    <tr>
      <td><a href="#level-11">11th</a></td>
      <td>
        <a href="#rune-mastery"> <img src="images/ControllerIcons/skills_png/PassiveFeature_DeathKnight_EmpowerRuneWeapon2.png" height="25" align="top" alt="PassiveFeature_DeathKnight_EmpowerRuneWeapon2.png" /> Rune Mastery</a>
      </td>
      <td><div align="center">11</div></td>
      <td><div align="center">6</div></td>
      <td><div align="center">2</div></td>
      <td><div align="center">2</div></td>
    </tr>
    <tr>
      <td><a href="#level-12">12th</a></td>
      <td>
        <a href="https://bg3.wiki/wiki/Feat"> <img src="https://bg3.wiki/w/images/thumb/a/a9/Generic_Feature_Icon.webp/48px-Generic_Feature_Icon.webp.png" height="25" align="top" /> Feat</a>
      </td>
      <td><div align="center">12</div></td>
      <td><div align="center">6</div></td>
      <td><div align="center">2</div></td>
      <td><div align="center">2</div></td>
    </tr>
  </tbody>
</table>

**Note**: [Proficiency bonus](https://bg3.wiki/wiki/Proficiency_bonus) is based on [character level](https://bg3.wiki/wiki/Character_level), not class level. It's included in the table for convenience.

# Class Information

**Hit pints**

- At level 1: `10 + CON Modifier`
- On level up: `6 + CON Modifier`

**Key abilities**

- [ <img src="https://bg3.wiki/w/images/thumb/4/43/Strength_Small_Icon.png/50px-Strength_Small_Icon.png" height="25" align="top" alt="Strength" /> Strength](https://bg3.wiki/wiki/Strength) or [ <img src="https://bg3.wiki/w/images/thumb/d/d1/Dexterity_Small_Icon.png/50px-Dexterity_Small_Icon.png" height="25" align="top" alt="Dexterity" /> Dexterity](https://bg3.wiki/wiki/Dexterity) for physical attacks
- [ <img src="https://bg3.wiki/w/images/thumb/7/7d/Intelligence_Small_Icon.png/50px-Intelligence_Small_Icon.png" height="25" align="top" alt="Intelligence" /> Intelligence](https://bg3.wiki/wiki/Intelligence) for Rune Spell DCs and Attack Rolls
- [ <img src="https://bg3.wiki/w/images/thumb/6/6b/Constitution_Small_Icon.png/50px-Constitution_Small_Icon.png" height="25" align="top" alt="Constitution" /> Constitution](https://bg3.wiki/wiki/Constitution) for Hit Points and [ <img src="https://bg3.wiki/w/images/0/07/Concentration_Icons.png" height="25" align="top" /> Concentration](https://bg3.wiki/wiki/Concentration) Checks

**Saving Throw Proficiencies**
- [ <img src="https://bg3.wiki/w/images/thumb/6/6b/Constitution_Small_Icon.png/50px-Constitution_Small_Icon.png" height="25" align="top" alt="Constitution" /> Constitution](https://bg3.wiki/wiki/Constitution), [ <img src="https://bg3.wiki/w/images/thumb/7/7d/Intelligence_Small_Icon.png/50px-Intelligence_Small_Icon.png" height="25" align="top" alt="Intelligence" /> Intelligence](https://bg3.wiki/wiki/Intelligence)

**Equipment proficiencies**
- [ <img src="https://bg3.wiki/w/images/thumb/d/de/Simple_Weapon_Prof_Icon.png/50px-Simple_Weapon_Prof_Icon.png" height="25" align="top" /> Simple weapons](https://bg3.wiki/wiki/Simple_weapons), [ <img src="https://bg3.wiki/w/images/thumb/1/17/Martial_Weapon_Prof_Icon.png/50px-Martial_Weapon_Prof_Icon.png" height="25" align="top" /> Martial weapons](https://bg3.wiki/wiki/Martial_weapons)
- [ <img src="https://bg3.wiki/w/images/thumb/1/17/Light_Armour_Icon.png/50px-Light_Armour_Icon.png" height="25" align="top" /> Light armour](https://bg3.wiki/wiki/Armour#List_of_light_armour), [ <img src="https://bg3.wiki/w/images/thumb/7/73/Medium_Armour_Icon.png/50px-Medium_Armour_Icon.png" height="25" align="top" /> Medium armour](https://bg3.wiki/wiki/Armour#List_of_medium_armour), [ <img src="https://bg3.wiki/w/images/thumb/b/b7/Heavy_Armour_Icon.png/50px-Heavy_Armour_Icon.png" height="25" align="top" /> Heavy armour](https://bg3.wiki/wiki/Armour#List_of_heavy_armour)

**Skills with proficiency (Choose 2)**
- [ <img src="https://bg3.wiki/w/images/thumb/3/30/Athletics_Icon.png/50px-Athletics_Icon.png" height="25" align="top" /> Athletics](https://bg3.wiki/wiki/Athletics), [ <img src="https://bg3.wiki/w/images/thumb/1/1c/Deception_Icon.png/50px-Deception_Icon.png" height="25" align="top" /> Deception](https://bg3.wiki/wiki/Deception), [ <img src="https://bg3.wiki/w/images/thumb/e/e2/Intimidation_Icon.png/50px-Intimidation_Icon.png" height="25" align="top" /> Intimidation](https://bg3.wiki/wiki/Intimidation), [ <img src="https://bg3.wiki/w/images/thumb/9/92/Perception_Icon.png/50px-Perception_Icon.png" height="25" align="top" /> Perception](https://bg3.wiki/wiki/Perception), [ <img src="https://bg3.wiki/w/images/thumb/4/46/Sleight_of_Hand_Icon.png/50px-Sleight_of_Hand_Icon.png" height="25" align="top" /> Sleight of Hand](https://bg3.wiki/wiki/Sleight_Of_Hand), [ <img src="https://bg3.wiki/w/images/thumb/2/2d/Survival_Icon.png/50px-Survival_Icon.png" height="25" align="top" /> Survival](https://bg3.wiki/wiki/Athletics)

**Starting Equipment**
- <img src="https://bg3.wiki/w/images/9/92/Adamantine_Longsword_Unfaded_Icon.png" height="25" align="top" /> {{ get .loca "hd23a3240g5445g4f23g923fg16b6cb121258" }},
  <img src="https://bg3.wiki/w/images/c/c9/Reaper%27s_Embrace_Unfaded_Icon.png" height="25" align="top" /> {{ get .loca "hb2c30a75g3fb5g4642g92c3gd83694b7b82d" }}, 
  <img src="https://bg3.wiki/w/images/a/ac/Boots_Metal_B_Unfaded_Icon.png" height="25" align="top" /> {{ get .loca "h8c149768gf29fg4699g91d3g67e953236b3d" }}, 
  <img src="https://bg3.wiki/w/images/8/88/Gloves_Metal_2_Unfaded_Icon.png" height="25" align="top" /> {{ get .loca "h8b40104eg7963g4426gb2efgde604c08d5c6" }}

### Rune Casting

*For a list of rune spells available to the Death Knight, see [List of Death Knight Spells](Death-Knight-Spells)*

**Spellcasting Ability**

- [Intelligence](https://bg3.wiki/wiki/Intelligence)

**Known spells**

- Death Knight Spells are Always Prepared. In exchange, Death Knights know fewer Spells at low levels.

**Rune Casting**
- Instead of spell slots, Death Knights use <img src="images/ActionResources_c/Icons/Resources/BloodRune.png" height="25" align="top" alt="BloodRune" /> Blood, <img src="images/ActionResources_c/Icons/Resources/FrostRune.png" height="25" align="top" alt="FrostRune" /> Frost, and <img src="images/ActionResources_c/Icons/Resources/UnholyRune.png" height="25" align="top" alt="UnholyRune" /> Unholy Runes to cast rune "spells"[*](# "Like Way of the Four Elements 'spells', these do not have the `IsSpell` tag and are instead considered Class Actions.").
- Death Knights have a limited number of Runes, but regain them by taking a [Short Rest](https://bg3.wiki/wiki/Short_Rest) or [Long Rest](https://bg3.wiki/wiki/Long_Rest).
- Death Knights learn higher level spells than other Martial/Caster hybrids, but they can't use them as often.

# Level Information

## Level 1

<img align="left"  height="40" src="images/ControllerIcons/skills_png/PassiveFeature_DeathKnight_RuneDie.png" alt="PassiveFeature_DeathKnight_RuneDie.png" />

### Rune Die: 1d4


### Runes: 1 <img align="top"  height="25" src="images/ActionResources_c/Icons/Resources/BloodRune.png" alt="" /> Blood, 1 <img src="images/ActionResources_c/Icons/Resources/FrostRune.png" height="25" align="top" alt="Icon_DK_FrostRune.png" /> Frost, 1 <img src="images/ActionResources_c/Icons/Resources/UnholyRune.png" height="25" align="top" alt="Icon_DK_UnholyRune.png" /> Unholy

### Initial Rune Spells

<a href="Death Knight Spells#death-strike"> <img src="images/ControllerIcons/skills_png/Action_DeathKnight_DeathStrike.png" height="25" align="top" alt="Action_DeathKnight_DeathStrike.png" /> Death Strike</a>,
<a href="Death Knight Spells#frost-Strike"> <img src="images/ControllerIcons/skills_png/Action_DeathKnight_FrostStrike.png" height="25" align="top" alt="Action_DeathKnight_FrostStrike.png" /> Frost Strike</a>,
<a href="Death Knight Spells#feath-Coil"> <img src="images/ControllerIcons/skills_png/Action_DeathKnight_DeathCoil.png" height="25" align="top" alt="Action_DeathKnight_DeathCoil.png" /> Death Coil</a>

<img align="left"  height="40" src="images/ControllerIcons/skills_png/PassiveFeature_DeathKnight_Lichborne.png" alt="PassiveFeature_DeathKnight_Lichborne.png" />

### Lichborne

{{ get .loca "hd2638eddg73ccg4effgbb1ag62cd837b48cb" }}

*Note: This passive is not learned when [Multiclassing](https://bg3.wiki/wiki/Classes#Multiclassing) into Death Knight--only if you are a Death Knight at Level 1*

## Level 2

[**Fighting Style**](https://bg3.wiki/wiki/Fighting_Style)
- [ <img src="https://bg3.wiki/w/images/thumb/e/e2/Defence_Icon.webp/50px-Defence_Icon.webp.png" height="25" align="top" /> Defence](https://bg3.wiki/wiki/Defence)
  - You gain a +1 bonus to [ <img src="https://bg3.wiki/w/images/a/ae/Armour_Class_Icon.png" height="25" align="top" /> Armour Class](https://bg3.wiki/wiki/Armour_Class) while wearing [Armour](https://bg3.wiki/wiki/Armour).
- [ <img src="https://bg3.wiki/w/images/thumb/1/1f/Great_Weapon_Fighting_Icon.webp/50px-Great_Weapon_Fighting_Icon.webp.png" height="25" align="top" /> Great Weapon Fighting](https://bg3.wiki/wiki/Great_Weapon_Fighting)
  - When you roll a 1 or 2 on a damage die for an attack with a **Two-Handed** melee weapon, that die is rerolled once.
- [ <img src="https://bg3.wiki/w/images/thumb/5/54/Two-Weapon_Fighting_Icon.webp/50px-Two-Weapon_Fighting_Icon.webp.png" height="25" align="top" /> Two-Weapon Fighting](https://bg3.wiki/wiki/Two-Weapon_Fighting)
  - When you make an offhand attack, you can add your [Ability Modifier](https://bg3.wiki/wiki/Ability_Modifier) to the damage of the attack.

<img align="left" alt="Action_DeathKnight_Runeforging.png" height="40" src="images/ControllerIcons/skills_png/Action_DeathKnight_Runeforging.png" />

### Runeforging

{{ get .loca "h1dcb24acg6d03g4a45gbe65g9689080eb3e3" }}

{{ get .loca "ha1bbf1f9g9007g4e3egb11eg12b7d78976d5" | replace "Runeblades" "[Runeblades](#runeblades)" }}

<img align="left" alt="Action_DeathKnight_Razorice.png" height="40" src="images/ControllerIcons/skills_png/Action_DeathKnight_Razorice.png" />

#### Rune of Razorice

{{ getf .loca "ha7dc3e14gc3b1g47c7gb454g5a2ca7ff2988" "1 <img src='https://bg3.wiki/w/images/0/05/Cold_Damage_Icon.png' height='25' align='top' alt='Cold Damage' /> Cold damage" }}

<img align="left" alt="Action_DeathKnight_FallenCrusader.png" height="40" src="images/ControllerIcons/skills_png/Action_DeathKnight_FallenCrusader.png" />

#### Rune of the Fallen Crusader

{{ getf .loca "hf14f6741g6c07g4322ga0edg5bb580209a8b" "1 <img src='https://bg3.wiki/w/images/thumb/a/ac/Healing_Icon.png/50px-Healing_Icon.png' height='25' align='top' alt='Hit Points' /> hit point" }}

<img align="left" alt="Action_DeathKnight_Stoneskin_Gargoyle.png" height="40" src="images/ControllerIcons/skills_png/Action_DeathKnight_Stoneskin_Gargoyle.png" />

#### Rune of the Stoneskin Gargoyle

{{ getf .loca "h2bd24ad6gf5c5g4ecag8e1cgf4e281da8d22" "1" | replace "Armour Class" "[Armour Class](https://bg3.wiki/wiki/Armour_Class)" }}


<img src="https://bg3.wiki/w/images/9/92/Adamantine_Longsword_Unfaded_Icon.png" height="40" align="left" alt="" />

#### Runeblades

The Death Knight starter longsword "Runed Soulblade" is a special weapon classified as a **Runeblade**.

{{get .loca "h2e8654a0g6056g4b96ga4f0g96338c13ad56" }}

**More Runeblades may be added in the future**

### Rune Spells Known: 2

- Choose 2 Rune Spells from the <a href ="Death Knight Spells">Death Knight Spell List</a>.

### New Rune Spells

<a href="Death Knight Spells#anti-Magic-Shell"> <img src="images/ControllerIcons/skills_png/Action_DeathKnight_AntiMagicShell.png" height="25" align="top" alt="Action_DeathKnight_AntiMagicShell.png" /> Anti-Magic Shell</a>,
<a href="Death Knight Spells#armor-of-Arthas"> <img src="https://bg3.wiki/w/images/8/87/Armour_Of_Agathys_2_Icon.png" height="25" align="top" /> Armour of Arthas</a>,
<a href="Death Knight Spells#abomination-Limb"> <img src="https://bg3.wiki/w/images/3/3e/Arms_of_Hadar_Icon.webp" height="25" align="top" /> Abomination Limb</a>,
<a href="Death Knight Spells#deaths-advance"> <img src="images/ControllerIcons/skills_png/Action_DeathKnight_DeathsAdvance.png" height="25" align="top" alt="Action_DeathKnight_DeathsAdvance.png" /> Death's Advance</a>,
<a href="Death Knight Spells#gloom-ward"> <img src="https://bg3.wiki/w/images/f/f2/False_Life_Icon.webp" height="25" align="top" /> Gloom Ward</a>,
<a href="Death Knight Spells#scourge"> <img src="https://bg3.wiki/w/images/1/19/Bane_spell_Icon.webp" height="25" align="top" /> Scourge</a>,
<a href="Death Knight Spells#chains-of-ice"> <img src="images/ControllerIcons/skills_png/Action_DeathKnight_ChainsOfIce.png" height="25" align="top" alt="Action_DeathKnight_ChainsOfIce.png" /> Chains of Ice</a>,
<a href="Death Knight Spells#dark-command"> <img src="https://bg3.wiki/w/images/7/7f/Command_Halt_Icon.webp" height="25" align="top" /> Dark Command</a>,
<a href="Death Knight Spells#evenly-matched"> <img src="https://bg3.wiki/w/images/7/73/Compelled_Duel_Icon.webp" height="25" align="top" /> Evenly Matched</a>,
<a href="Death Knight Spells#death-and-decay"> <img src="images/ControllerIcons/skills_png/Action_DeathKnight_DeathAndDecay.png" height="25" align="top" alt="Action_DeathKnight_DeathAndDecay.png" /> Death and Decay</a>,
<a href="Death Knight Spells#mind-Freeze"> <img src="images/ControllerIcons/skills_png/Action_DeathKnight_MindFreeze.png" height="25" align="top" alt="Action_DeathKnight_MindFreeze.png" /> Mind Freeze</a>,
<a href="Death Knight Spells#path-of-frost"> <img src="images/ControllerIcons/skills_png/Action_DeathKnight_PathOfFrost.png" height="25" align="top" alt="Action_DeathKnight_PathOfFrost.png" /> Path of Frost</a>

## Level 3

### Rune Spells Known: 3

- Choose 1 additional Rune Spell from the <a href ="Death Knight Spells">Death Knight Spell List</a>.
- Optionally, choose 1 known Rune Spell and replace it with another in the <a href ="Death Knight Spells">Death Knight Spell List</a>.

### New Rune Spells

<a href="Death Knight Spells#death-grip"> <img src="images/ControllerIcons/skills_png/Action_DeathKnight_DeathGrip.png" height="25" align="top" alt="Action_DeathKnight_DeathGrip.png" /> Death Grip</a>,
<a href="Death Knight Spells#sacrificial-pact"> <img src="images/ControllerIcons/skills_png/Action_DeathKnight_SacrificialPact.png" height="25" align="top" alt="Action_DeathKnight_SacrificialPact.png" /> Sacrificial Pact</a>

### Select a subclass

<table>
  <tbody>
    <tr>
      <th>
        <div align="center">
          <img src="images/ClassIcons/BloodDK.png" alt="Blood DK" height=150 />
          <br/>
          <a href="Death Knight - Blood">Blood</a>
        </div>
      </th>
      <th>
        <div align="center">
        <img src="images/ClassIcons/FrostDK.png" alt="Frost DK" height=150 />
          <br/>
          <a href="Death Knight - Frost">Frost</a>
        </div>
      </th>
      <th>
        <div align="center">
        <img src="images/ClassIcons/UnholyDK.png" alt="Unholy DK" height=150 />
          <br/>
          <a href="Death Knight - Unholy">Unholy</a>
        </div>
      </th>
    </tr>
    <tr>
      <td>
        <ul>
          <li>
            +1 <img src="images/ActionResources_c/Icons/Resources/BloodRune.png" height="25" align="top" alt="BloodRune" /> Blood Rune
          </li>
          <li>
            Known Rune Spells:
            <ul>
              <li>
                <a href="Death Knight Spells#blood-boil"> <img src="images/ControllerIcons/skills_png/Action_DeathKnight_BloodBoil.png" height="25" align="top" alt="Action_DeathKnight_BloodBoil.png" /> Blood Boil</a>
              </li>
              <li>
                <a href="Death Knight Spells#marrowrend"> <img src="images/ControllerIcons/skills_png/Action_DeathKnight_Marrowrend.png" height="25" align="top" alt="Action_DeathKnight_Marrowrend.png" /> Marrowrend</a>
              </li>
              <li>
                <a href="Death Knight Spells#heart-Strike"> <img src="images/ControllerIcons/skills_png/Action_DeathKnight_HeartStrike.png" height="25" align="top" alt="Action_DeathKnight_HeartStrike.png" /> Heart Strike</a>
              </li>
            </ul>
          </li>
          <li>
            New Rune Spells:
            <ul>
              <li>
                <a href="Death Knight Spells#dancing-rune-weapon"> <img src="https://bg3.wiki/w/images/7/73/Spiritual_Weapon_Halberd_Icon.webp" height="25" align="top" /> Dancing Rune Weapon</a>
              </li>
              <li>
                <a href="Death Knight Spells#subduing-grasp-person"> <img src="https://bg3.wiki/w/images/7/75/Hold_Person_Icon.webp" height="25" align="top" /> Subduing Grasp: Person</a>
              </li>
            </ul>
          </li>
        </ul>
      </td>
      <td>
        <ul>
          <li>
            +1 <img src="images/ActionResources_c/Icons/Resources/FrostRune.png" height="25" align="top" alt="FrostRune" /> Frost Rune
          </li>
          <li>
            Known Rune Spells:
            <ul>
              <li>
                <a href="Death Knight Spells#howling-blast"> <img src="images/ControllerIcons/skills_png/Action_DeathKnight_HowlingBlast.png" height="25" align="top" alt="Action_DeathKnight_HowlingBlast.png" /> Howling Blast</a>
              </li>
              <li>
                <a href="Death Knight Spells#obliterate"> <img src="images/ControllerIcons/skills_png/Action_DeathKnight_Obliterate.png" height="25" align="top" alt="Action_DeathKnight_Obliterate.png" /> Obliterate</a>
              </li>
              <li>
                <a href="Death Knight Spells#frostscythe"> <img src="images/ControllerIcons/skills_png/Action_DeathKnight_Frostscythe.png" height="25" align="top" alt="Action_DeathKnight_Frostscythe.png" /> Frostscythe</a>
              </li>
            </ul>
          </li>
        </ul>
      </td>
      <td>
        <ul>
          <li>
            +1 <img src="images/ActionResources_c/Icons/Resources/UnholyRune.png" height="25" align="top" alt="UnholyRune" /> Unholy Rune
          </li>
          <li>
            Known Rune Spells:
            <ul>
              <li>
                <a href="Death Knight Spells#outbreak"> <img src="images/ControllerIcons/skills_png/Action_DeathKnight_Outbreak.png" height="25" align="top" alt="Action_DeathKnight_Outbreak.png" /> Outbreak</a>
              </li>
              <li>
                <a href="Death Knight Spells#festering-strike"> <img src="images/ControllerIcons/skills_png/Action_DeathKnight_FesteringStrike.png" height="25" align="top" alt="Action_DeathKnight_FesteringStrike.png" /> Festering Strike</a>
              </li>
              <li>
                <a href="Death Knight Spells#scourge-strike"> <img src="images/ControllerIcons/skills_png/Action_DeathKnight_ScourgeStrike.png" height="25" align="top" alt="Action_DeathKnight_ScourgeStrike.png" /> Scourge Strike</a>
              </li>
            </ul>
          </li>
          <li>
            New Rune Spells:
            <ul>
              <li>
                <a href="Death Knight Spells#enfeeble"> <img src="https://bg3.wiki/w/images/1/16/Ray_Of_Enfeeblement_Icon.png" height="25" align="top" /> Enfeeble</a>
              </li>
            </ul>
          </li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

## Level 4

### Choose a [Feat](https://bg3.wiki/wiki/Feat).

<img align="left"  height="40" src="images/ControllerIcons/skills_png/PassiveFeature_DeathKnight_RuneDie.png" alt="PassiveFeature_DeathKnight_RuneDie.png" />

### Rune Die: 1d6

### Rune Spells Known: 4

- Choose 1 additional Rune Spell from the <a href ="Death Knight Spells">Death Knight Spell List</a>.
- Optionally, choose 1 known Rune Spell and replace it with another in the <a href ="Death Knight Spells">Death Knight Spell List</a>.


### Subclass feature

<table>
  <tbody>
    <tr>
      <th>
        <div align="center">
          <a href="Death Knight - Blood">Blood</a>
        </p>
      </th>
      <th>
        <div align="center">
          <a href="Death Knight - Frost">Frost</a>
        </p>
      </th>
      <th>
        <div align="center">
          <a href="Death Knight - Unholy">Unholy</a>
        </p>
      </th>
    </tr>
    <tr>
      <td>
        <ul>
          <li>
            <a href="Death Knight - Bloodblood-shield"> <img src="images/ControllerIcons/skills_png/PassiveFeature_DeathKnight_BloodShield.png" height="25" align="top" alt="PassiveFeature_DeathKnight_BloodShield.png" /> Blood Shield</a>
          </li>
        </ul>
      </td>
      <td>
        <ul>
          <li>
            <a href="Death Knight - Frost#frozen-heart"> <img src="images/ControllerIcons/skills_png/PassiveFeature_DeathKnight_FrozenHeart.png" height="25" align="top" alt="PassiveFeature_DeathKnight_FrozenHeart.png" /> Frozen Heart</a>
          </li>
        </ul>
      </td>
      <td>
        <ul>
          <li>
            <a href="Death Knight - Unholy#dreadblade"> <img src="images/ControllerIcons/skills_png/PassiveFeature_DeathKnight_Dreadblade.png" height="25" align="top" alt="PassiveFeature_DeathKnight_Dreadblade.png" /> Dreadblade</a>
          </li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>


## Level 5

<h3><a href="https://bg3.wiki/wiki/Extra_Attack">
<img src="https://bg3.wiki/w/images/thumb/5/5a/Extra_Attack_Icon.webp/80px-Extra_Attack_Icon.webp.png" height="40" align="left" alt="Extra Attack" />
Extra Attack
</a></h3>

- You can attack twice, instead of once, whenever you take the Attack action on your turn.

### Rune Spells Known: 5

- Choose 1 additional Rune Spell from the <a href ="Death Knight Spells">Death Knight Spell List</a>.
- Optionally, choose 1 known Rune Spell and replace it with another in the <a href ="Death Knight Spells">Death Knight Spell List</a>.

### Subclass feature

<table>
  <tbody>
    <tr>
      <th>
        <div align="center">
          <a href="Death Knight - Blood">Blood</a>
        </p>
      </th>
      <th>
        <div align="center">
          <a href="Death Knight - Frost">Frost</a>
        </p>
      </th>
      <th>
        <div align="center">
          <a href="Death Knight - Unholy">Unholy</a>
        </p>
      </th>
    </tr>
    <tr>
      <td>
        <ul>
          <li>
            +1 <img src="images/ActionResources_c/Icons/Resources/BloodRune.png" height="25" align="top" alt="BloodRune" /> Blood Rune
          </li>
          <li>
            New Rune Spells:
            <ul>
              <li>
                <a href="Death Knight Spells#sanlayn-touch"> <img src="https://bg3.wiki/w/images/8/85/Vampiric_Touch_Icon.webp" height="25" align="top" /> San'layn Touch</a>
              </li>
            </ul>
          </li>
        </ul>
      </td>
      <td>
        <ul>
          <li>
            +1 <img src="images/ActionResources_c/Icons/Resources/FrostRune.png" height="25" align="top" alt="FrostRune" /> Frost Rune
          </li>
          <li>
            New Rune Spells:
            <ul>
              <li>
                <a href="Death Knight Spells#absolute-zero"> <img src="https://bg3.wiki/w/images/4/44/Hunger_of_Hadar_Icon.webp" height="25" align="top" /> Absolute Zero</a>
              </li>
            </ul>
          </li>
        </ul>
      </td>
      <td>
        <ul>
          <li>
            +1 <img src="images/ActionResources_c/Icons/Resources/UnholyRune.png" height="25" align="top" alt="UnholyRune" /> Unholy Rune
          </li>
          <li>
            New Rune Spells:
            <ul>
              <li>
                <a href="Death Knight Spells#raise-ally"> <img src="images/ControllerIcons/skills_png/Action_DeathKnight_RaiseAlly.png" height="25" align="top" alt="Action_DeathKnight_RaiseAlly.png" /> Raise Ally</a>
              </li>
              <li>
                <a href="Death Knight Spells#unholy-aura"> <img src="images/ControllerIcons/skills_png/Spell_Conjuration_SpiritGuardians_Necrotic.png" height="25" align="top" alt="Spell_Conjuration_SpiritGuardians_Necrotic.png" /> Unholy Aura</a>
              </li>
              <li>
                <a href="Death Knight Spells#raise-Dead"> <img src="https://bg3.wiki/w/images/9/91/Animate_Dead_Skeleton_Icon.webp" height="25" align="top" /> Raise Dead</a>
              </li>
            </ul>
          </li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

## Level 6

### Rune Spells Known: 6

- Choose 1 additional Rune Spell from the <a href ="Death Knight Spells">Death Knight Spell List</a>.
- Optionally, choose 1 known Rune Spell and replace it with another in the <a href ="Death Knight Spells">Death Knight Spell List</a>.

### Subclass feature

<table>
  <tbody>
    <tr>
      <th>
        <div align="center">
          <a href="Death Knight - Blood">Blood</a>
        </p>
      </th>
      <th>
        <div align="center">
          <a href="Death Knight - Frost">Frost</a>
        </p>
      </th>
      <th>
        <div align="center">
          <a href="Death Knight - Unholy">Unholy</a>
        </p>
      </th>
    </tr>
    <tr>
      <td>
        <ul>
          <li>
            <a href="Death Knight - Blood#dark-succor"> <img src="images/ControllerIcons/skills_png/Action_DeathKnight_DeathStrike.png" height="25" align="top" alt="Action_DeathKnight_DeathStrike.png" /> Dark Succor</a>
          </li>
        </ul>
      </td>
      <td>
        <ul>
          <li>
            <a href="Death Knight - Frost#rime"> <img src="images/ControllerIcons/skills_png/Action_DeathKnight_HowlingBlast.png" height="25" align="top" alt="Action_DeathKnight_HowlingBlast.png" /> Rime</a>
          </li>
        </ul>
      </td>
      <td>
        <ul>
          <li>
            <a href="Death Knight - Unholy#sudden-doom"> <img src="images/ControllerIcons/skills_png/Action_DeathKnight_DeathCoil.png" height="25" align="top" alt="Action_DeathKnight_DeathCoil.png" /> Sudden Doom</a>
          </li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

## Level 7

<img align="left"  height="40" src="images/ControllerIcons/skills_png/PassiveFeature_DeathKnight_RuneDie.png" alt="PassiveFeature_DeathKnight_RuneDie.png" />

### Rune Die: 1d8

### Rune Spells Known: 7

- Choose 1 additional Rune Spell from the <a href ="Death Knight Spells">Death Knight Spell List</a>.
- Optionally, choose 1 known Rune Spell and replace it with another in the <a href ="Death Knight Spells">Death Knight Spell List</a>.

### Additional Runes: +1 <img align="top"  height="25" src="images/ActionResources_c/Icons/Resources/BloodRune.png" alt="" /> Blood, +1 <img src="images/ActionResources_c/Icons/Resources/FrostRune.png" height="25" align="top" alt="Icon_DK_FrostRune.png" /> Frost, +1 <img src="images/ActionResources_c/Icons/Resources/UnholyRune.png" height="25" align="top" alt="Icon_DK_UnholyRune.png" /> Unholy

### New Rune Spells

<a href="Death Knight Spells#anti-magic-zone"> <img src="images/ControllerIcons/skills_png/Action_DeathKnight_AntiMagicZone.png" height="25" align="top" alt="Action_DeathKnight_AntiMagicZone.png" /> Anti-Magic Zone</a>,
<a href="Death Knight Spells#dark-transformation"> <img src="images/ControllerIcons/skills_png/Action_DeathKnight_DarkTransformation.png" height="25" align="top" alt="Action_DeathKnight_DarkTransformation.png" /> Dark Transformation</a>,
<a href="Death Knight Spells#taise-ally"> <img src="images/ControllerIcons/skills_png/Action_DeathKnight_RaiseAlly.png" height="25" align="top" alt="Action_DeathKnight_RaiseAlly.png" /> Raise Ally</a>,
<a href="Death Knight Spells#sanlayn-touch"> <img src="https://bg3.wiki/w/images/8/85/Vampiric_Touch_Icon.webp" height="25" align="top" /> San'layn Touch</a>,
<a href="Death Knight Spells#absolute-zero"> <img src="https://bg3.wiki/w/images/4/44/Hunger_of_Hadar_Icon.webp" height="25" align="top" /> Absolute Zero</a>

<table>
  <tbody>
    <tr>
      <th>
        <div align="center">
          <a href="Death Knight - Blood">Blood</a>
        </p>
      </th>
      <th>
        <div align="center">
          <a href="Death Knight - Frost">Frost</a>
        </p>
      </th>
      <th>
        <div align="center">
          <a href="Death Knight - Unholy">Unholy</a>
        </p>
      </th>
    </tr>
    <tr>
      <td>
        (none)
      </td>
      <td>
        New Rune Spells:
        <ul>
          <li>
            <a href="Death Knight Spellsavalanche"> <img src="https://bg3.wiki/w/images/9/9b/Ice_Storm_Icon.webp" height="25" align="top" /> Avalanche</a>
          </li>
        </ul>
      </td>
      <td>
        New Rune Spells:
        <ul>
          <li>
            <a href="Death Knight Spellsdark-transformation"> <img src="images/ControllerIcons/skills_png/Action_DeathKnight_DarkTransformation.png" height="25" align="top" alt="Action_DeathKnight_DarkTransformation.png" /> Dark Transformation</a>
          </li>
          <li>
            <a href="Death Knight Spells#raise-gargoyle"> <img src="https://bg3.wiki/w/images/4/4f/Animate_Dead_Ghoul_Icon.webp" height="25" align="top" /> Raise Gargoyle</a>
          </li>
          <li>
            <a href="Death Knight Spells#defile"> <img src="https://bg3.wiki/w/images/e/e0/Blight_Icon.webp" height="25" align="top" /> Defile</a>
          </li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

<img align="left"  height="40" src="images/ControllerIcons/skills_png/Action_DeathKnight_RuneTap.png" alt="Action_DeathKnight_RuneTap.png"  />

### Rune Tap

{{ get .loca "hd1e4ba78g33deg446cg9262g11118d6283cd" }}

## Level 8

### Choose a [Feat](https://bg3.wiki/wiki/Feat).

### Rune Spells Known: 8

- Choose 1 additional Rune Spell from the <a href ="Death Knight Spells">Death Knight Spell List</a>.
- Optionally, choose 1 known Rune Spell and replace it with another in the <a href ="Death Knight Spells">Death Knight Spell List</a>.


## Level 9

### Rune Spells Known: 9

- Choose 1 additional Rune Spell from the <a href ="Death Knight Spells">Death Knight Spell List</a>.
- Optionally, choose 1 known Rune Spell and replace it with another in the <a href ="Death Knight Spells">Death Knight Spell List</a>.

### Subclass feature

<table>
  <tbody>
    <tr>
      <th>
        <div align="center">
          <a href="Death Knight - Blood">Blood</a>
        </p>
      </th>
      <th>
        <div align="center">
          <a href="Death Knight - Frost">Frost</a>
        </p>
      </th>
      <th>
        <div align="center">
          <a href="Death Knight - Unholy">Unholy</a>
        </p>
      </th>
    </tr>
    <tr>
      <td>
        <ul>
          <li>
            +1 <img src="images/ActionResources_c/Icons/Resources/BloodRune.png" height="25" align="top" alt="BloodRune" /> Blood Rune
          </li>
          <li>
            New Rune Spells:
            <ul>
              <li>
                <a href="Death Knight Spells#subduing-grasp-monster"> <img src="https://bg3.wiki/w/images/c/cf/Hold_Monster_Icon.webp" height="25" align="top" /> Subduing Grasp: Monster</a>
              </li>
            </ul>
          </li>
        </ul>
      </td>
      <td>
        <ul>
          <li>
            +1 <img src="images/ActionResources_c/Icons/Resources/FrostRune.png" height="25" align="top" alt="FrostRune" /> Frost Rune
          </li>
          <li>
            New Rune Spells:
            <ul>
              <li>
                <a href="Death Knight Spells#breath-of-sindragosa"> <img src="https://bg3.wiki/w/images/e/ef/Cone_of_Cold_Icon.webp" height="25" align="top" /> Breath of Sindragosa</a>
              </li>
            </ul>
          </li>
        </ul>
      </td>
      <td>
        <ul>
          <li>
            +1 <img src="images/ActionResources_c/Icons/Resources/UnholyRune.png" height="25" align="top" alt="UnholyRune" /> Unholy Rune
          </li>
          <li>
            New Rune Spells:
            <ul>
              <li>
                <a href="Death Knight Spells#army-of-the-dead"> <img src="https://bg3.wiki/w/images/9/92/Danse_Macabre_Icon.webp" height="25" align="top" /> Army of the Dead</a>
              </li>
            </ul>
          </li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

<img src="images/ControllerIcons/skills_png/PassiveFeature_DeathKnight_WillOfTheNecropolis.png" height="40" align="left" alt="PassiveFeature_DeathKnight_WillOfTheNecropolis.png" />

### Will of the Necropolis

{{ get .loca "hf65fbb88g1d96g4034ga675g45612b6c7d46" }}

## Level 10

<img align="left"  height="40" src="images/ControllerIcons/skills_png/PassiveFeature_DeathKnight_RuneDie.png" alt="PassiveFeature_DeathKnight_RuneDie.png" />

### Rune Die: 1d10

### Rune Spells Known: 10

- Choose 1 additional Rune Spell from the <a href ="Death Knight Spells">Death Knight Spell List</a>.
- Optionally, choose 1 known Rune Spell and replace it with another in the <a href ="Death Knight Spells">Death Knight Spell List</a>.

### Subclass feature

<table>
  <tbody>
    <tr>
      <th>
        <div align="center">
          <a href="Death Knight - Blood">Blood</a>
        </p>
      </th>
      <th>
        <div align="center">
          <a href="Death Knight - Frost">Frost</a>
        </p>
      </th>
      <th>
        <div align="center">
          <a href="Death Knight - Unholy">Unholy</a>
        </p>
      </th>
    </tr>
    <tr>
      <td>
        <ul>
          <li>
            <a href="Death Knight - Blood#crimson-scourge"> <img src="images/ControllerIcons/skills_png/Action_DeathKnight_DeathAndDecay.png" height="25" align="top" alt="Action_DeathKnight_DeathAndDecay.png" /> Crimson Scourge</a>
          </li>
        </ul>
      </td>
      <td>
        <ul>
          <li>
            <a href="Death Knight - Frost#killing-machine"> <img src="images/ControllerIcons/skills_png/PassiveFeature_DeathKnight_KillingMachine.png" height="25" align="top" alt="PassiveFeature_DeathKnight_KillingMachine.png" /> Killing Machine</a>
          </li>
        </ul>
      </td>
      <td>
        <ul>
          <li>
            <a href="Death Knight - Unholy#improved-death-coil"> <img src="images/ControllerIcons/skills_png/Action_DeathKnight_DeathCoil.png" height="25" align="top" alt="Action_DeathKnight_DeathCoil.png" /> Improved Death Coil</a>
          </li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

## Level 11

### Rune Spells Known: 11

- Choose 1 additional Rune Spell from the <a href ="Death Knight Spells">Death Knight Spell List</a>.
- Optionally, choose 1 known Rune Spell and replace it with another in the <a href ="Death Knight Spells">Death Knight Spell List</a>.

<img src="images/ControllerIcons/skills_png/PassiveFeature_DeathKnight_EmpowerRuneWeapon2.png" height="40" align="left" alt="PassiveFeature_DeathKnight_EmpowerRuneWeapon2.png" />

### Rune Mastery

Each subclass chooses one of it options for a new passive feature.

<table>
  <tbody>
    <tr>
      <th>
        <div align="center">
          <a href="Death Knight - Blood">Blood</a>
        </p>
      </th>
      <th>
        <div align="center">
          <a href="Death Knight - Frost">Frost</a>
        </p>
      </th>
      <th>
        <div align="center">
          <a href="Death Knight - Unholy">Unholy</a>
        </p>
      </th>
    </tr>
    <tr>
      <td>
        <ul>
          <li>
            <a href="Death Knight - Blood#empower-rune-weapon"> <img src="images/ControllerIcons/skills_png/PassiveFeature_DeathKnight_EmpowerRuneWeapon_Blood.png" height="25" align="top" alt="PassiveFeature_DeathKnight_EmpowerRuneWeapon_Blood.png" /> Empower Rune Weapon</a>
          </li>
          <li>
            <a href="Death Knight - Blood#carnage"> <img src="images/ControllerIcons/skills_png/Status_DeathKnight_BoneShield.png" height="25" align="top" alt="Status_DeathKnight_BoneShield.png" /> Carnage </a>
          </li>
        </ul>
      </td>
      <td>
        <ul>
          <li>
            <a href="Death Knight - Frost#empower-rune-weapon"> <img src="images/ControllerIcons/skills_png/PassiveFeature_DeathKnight_EmpowerRuneWeapon_Frost.png" height="25" align="top" alt="PassiveFeature_DeathKnight_EmpowerRuneWeapon_Frost.png" /> Empower Rune Weapon </a>
          </li>
          <li>
            <a href="Death Knight - Frost#obliteration"> <img src="images/ControllerIcons/skills_png/Action_DeathKnight_Obliterate.png" height="25" align="top" alt="Action_DeathKnight_Obliterate.png" /> Obliteration</a>
          </li>
        </ul>
      </td>
      <td>
        <ul>
          <li>
            <a href="Death Knight - Unholy#empowe-rune-weapon"> <img src="images/ControllerIcons/skills_png/PassiveFeature_DeathKnight_EmpowerRuneWeapon_Unholy.png" height="25" align="top" alt="PassiveFeature_DeathKnight_EmpowerRuneWeapon_Unholy.png" /> Empower Rune Weapon</a>
          </li>
          <li>
            <a href="Death Knight - Unholy#superstrain"> <img src="images/ControllerIcons/skills_png/Status_DeathKnight_VirulentPlague.png" height="25" align="top" alt="Status_DeathKnight_VirulentPlague.png" /> Superstrain </a>
          </li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>


### Subclass feature

<table>
  <tbody>
    <tr>
      <th>
        <div align="center">
          <a href="Death Knight - Blood">Blood</a>
        </p>
      </th>
      <th>
        <div align="center">
          <a href="Death Knight - Frost">Frost</a>
        </p>
      </th>
      <th>
        <div align="center">
          <a href="Death Knight - Unholy">Unholy</a>
        </p>
      </th>
    </tr>
    <tr>
      <td>
        <ul>
          <li>
            +1 <img src="images/ActionResources_c/Icons/Resources/BloodRune.png" height="25" align="top" alt="BloodRune" /> Blood Rune
          </li>
          <li>
            New Rune Spells:
            <ul>
              <li>
                <a href="Death Knight Spells#bloodshot"> <img src="https://bg3.wiki/w/images/f/f7/Eyebite_Panicked_Icon.webp" height="25" align="top" /> Bloodshot</a>
              </li>
            </ul>
          </li>
        </ul>
      </td>
      <td>
        <ul>
          <li>
            +1 <img src="images/ActionResources_c/Icons/Resources/FrostRune.png" height="25" align="top" alt="FrostRune" /> Frost Rune
          </li>
          <li>
            New Rune Spells:
            <ul>
              <li>
                <a href="Death Knight Spells#glacial-advance"> <img src="https://bg3.wiki/w/images/d/d2/Wall_of_Ice_Icon.webp" height="25" align="top" /> Glacial Advance</a>
              </li>
            </ul>
          </li>
        </ul>
      </td>
      <td>
        <ul>
          <li>
            +1 <img src="images/ActionResources_c/Icons/Resources/UnholyRune.png" height="25" align="top" alt="UnholyRune" /> Unholy Rune
          </li>
          <li>
            New Rune Spells:
            <ul>
              <li>
                <a href="Death Knight Spells#apocalypse"> <img src="https://bg3.wiki/w/images/f/f2/Circle_of_Death_Icon.webp" height="25" align="top" /> Apocalypse</a>
              </li>
              <li>
                <a href="Death Knight Spells#commander-of-the-dead"> <img src="https://bg3.wiki/w/images/d/da/Create_Undead_Icon.webp" height="25" align="top" /> Commander of the Dead</a>
              </li>
            </ul>
          </li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

## Level 12

### Choose a [Feat](https://bg3.wiki/wiki/Feat).

### Rune Spells Known: 12

- Choose 1 additional Rune Spell from the <a href ="Death Knight Spells">Death Knight Spell List</a>.
- Optionally, choose 1 known Rune Spell and replace it with another in the <a href ="Death Knight Spells">Death Knight Spell List</a>.
