{{- define "wikify" -}}
{{- $str := . -}}
{{- $str = $str 

| replace "Bludgeoning" "<img src='https://bg3.wiki/w/images/7/7d/Bludgeoning_Damage_Icon.png' height='25' align='top' alt='Bludgeoning Damage' />Bludgeoning"
| replace "Piercing" "<img src='https://bg3.wiki/w/images/0/0b/Piercing_Damage_Icon.png' height='25' align='top' alt='Piercing Damage' />Piercing"
| replace "Slashing" "<img src='https://bg3.wiki/w/images/f/f0/Slashing_Damage_Icon.png' height='25' align='top' alt='Slashing Damage' />Slashing"
| replace "Cold" "<img src='https://bg3.wiki/w/images/0/05/Cold_Damage_Icon.png' height='25' align='top' alt='Cold Damage' />Cold"
| replace "Necrotic" "<img src='https://bg3.wiki/w/images/3/39/Necrotic_Damage_Icon.png' height='25' align='top' alt='Necrotic Damage' />Necrotic"
| replace "Force" "<img src='https://bg3.wiki/w/images/d/d1/Force_Damage_Icon.png' height='25' align='top' alt='Force Damage' />Force"
| replace "Fire" "<img src='https://bg3.wiki/w/images/8/84/Fire_Damage_Icon.png' height='25' align='top' alt='Fire Damage' />Fire"
| replace "Radiant" "<img src='https://bg3.wiki/w/images/7/78/Radiant_Damage_Icon.png' height='25' align='top' alt='Radiant Damage' />Radiant"
| replace "Psychic" "<img src='https://bg3.wiki/w/images/0/04/Psychic_Damage_Icon.png' height='25' align='top' alt='Psychic Damage' />Psychic"

| replace "**Action**" "<img src='https://bg3.wiki/w/images/f/f2/Action_Icon.png' height='25' align='top' alt='ActionPoint' />**Action**"
| replace "Bonus Action" "<img src='https://bg3.wiki/w/images/c/c9/Bonus_Action_Icon.png' height='25' align='top' alt='ActionPoint' />Bonus Action"
| replace "Arcane Recovery" "<img src='https://bg3.wiki/w/images/thumb/0/04/Arcane_Recovery_Charges_Icons.png/25px-Arcane_Recovery_Charges_Icons.png' height='25' align='top' alt='Arcane Receovery' />Arcane Recovery"
| replace "Channel Oath" "<img src='https://bg3.wiki/w/images/thumb/4/4a/Channel_Oath_Icon.png/25px-Channel_Oath_Icon.png' height='25' align='top' alt='Channel Oath' />Channel Oath"
| ireplace "Rage Charge(s?)" "<img src='https://bg3.wiki/w/images/thumb/d/d6/Rage_Charges_Icons.png/27px-Rage_Charges_Icons.png' height='25' align='top' alt='Rage Charge' />Rage Charge$1"
| replace "**Spell Slot" "<img src='https://bg3.wiki/w/images/thumb/6/62/4_Level_1_Spell_Slots.png/22px-4_Level_1_Spell_Slots.png' height='25' align='top' alt='Spell Slot' />**Spell Slot"
| replace "Warlock Spell Slot" "<img src='https://bg3.wiki/w/images/thumb/2/22/2_Level_1_Warlock_Spell_Slots.png/24px-2_Level_1_Warlock_Spell_Slots.png' height='25' align='top' alt='Warlock Spell Slot' />Warlock Spell Slot"
| replace "Sorcery Point" "<img src='https://bg3.wiki/w/images/thumb/b/be/Sorcery_Points_Icons.png/30px-Sorcery_Points_Icons.png' height='25' align='top' alt='Sorcery Point' />Sorcery Point"
| replace "Channel Divinity" "<img src='https://bg3.wiki/w/images/thumb/b/ba/Channel_Divinity_Charges_Icons.png/30px-Channel_Divinity_Charges_Icons.png' height='25' align='top' alt='Channel Divinity' />Channel Divinity"
| replace "Superiority Di" "<img src='https://bg3.wiki/w/images/thumb/9/9f/Superiority_Die_d8_Icon.png/30px-Superiority_Die_d8_Icon.png' height='25' align='top' alt='Superiority Di' />Superiority Di"
| replace "Ki Point" "<img src='https://bg3.wiki/w/images/thumb/7/7f/Monk_Ki_Icon.png/30px-Monk_Ki_Icon.png' height='25' align='top' alt='Ki Point' />Ki Point"
| replace "Wild Shape Charge" "<img src='https://bg3.wiki/w/images/thumb/b/b6/Wild_Shape_Charges_Icon.png/30px-Wild_Shape_Charges_Icon.png' height='25' align='top' alt='Wild Shape Charge' />Wild Shape Charge"
| replace "Bardic Inspiration" "<img src='https://bg3.wiki/w/images/thumb/b/be/Bardic_Inspiration_Resource_Icon.png/30px-Bardic_Inspiration_Resource_Icon.png' height='25' align='top' alt='Bardic Inspiration' />Bardic Inspiration"
| replace "Natural Recovery" "<img src='https://bg3.wiki/w/images/thumb/9/99/Natural_Recovery_Charges_Icon.png/30px-Natural_Recovery_Charges_Icon.png' height='25' align='top' alt='Natural Recovery' />Natural Recovery"
| replace "Lay on Hands" "<img src='https://bg3.wiki/w/images/thumb/0/08/Lay_on_Hands_Resource_Icon.png/30px-Lay_on_Hands_Resource_Icon.png' height='25' align='top' alt='Lay on Hands' />Lay on Hands"
| replace "War Priest" "<img src='https://bg3.wiki/w/images/thumb/9/90/War_Priest_Charges_Icon.png/30px-War_Priest_Charges_Icon.png' height='25' align='top' alt='War Priest' />War Priest"
| replace "Arcane Arrow" "<img src='https://bg3.wiki/w/images/thumb/5/51/Arcane_Arrow_Resource_Icon.png/30px-Arcane_Arrow_Resource_Icon.png' height='25' align='top' alt='Arcane Arrow' />Arcane Arrow"
| replace "Star Map" "<img src='https://bg3.wiki/w/images/thumb/7/7a/Star_Map_Resource_Icon.png/30px-Star_Map_Resource_Icon.png' height='25' align='top' alt='Star Map' />Star Map"
| replace "Cosmic Omen" "<img src='https://bg3.wiki/w/images/thumb/a/a9/Cosmic_Omen_Resource_Icon.png/30px-Cosmic_Omen_Resource_Icon.png' height='25' align='top' alt='Cosmic Omen' />Cosmic Omen"
| replace "Bladesong" "<img src='https://bg3.wiki/w/images/thumb/1/12/Bladesong_Resource_Icon.png/30px-Bladesong_Resource_Icon.png' height='25' align='top' alt='Bladesong' />Bladesong"

| replace "**temporary hit points**" "[<img src='https://bg3.wiki/w/images/2/25/HP_Icon.png' height='25' align='top' />**temporary hit points**](https://bg3.wiki/wiki/temporary_hit_points)"
| ireplace "restrain(ing|ed)" "[<img src='https://bg3.wiki/w/images/thumb/2/20/Restrained_Condition_Icon.webp/60px-Restrained_Condition_Icon.webp.png' height='25' align='top' /> restrain$1](https://bg3.wiki/wiki/Restrained_(Condition))"
| replace "Advantage" "<img src='https://bg3.wiki/w/images/thumb/f/fc/Advantage_Icon.png/35px-Advantage_Icon.png' height='25' align='top' alt='35px-Advantage_Icon.png' />Advantage"
| replace "Disadvantage" "<img src='https://bg3.wiki/w/images/thumb/b/b9/Disadvantage_Icon.png/33px-Disadvantage_Icon.png' height='25' align='top' alt='33px-Disadvantage_Icon.png' />Disadvantage"

| replace "**hit points**" "<img src='https://bg3.wiki/w/images/thumb/a/ac/Healing_Icon.png/50px-Healing_Icon.png' height='25' align='top' />**hit points**"
| replace "Strength" "<img src=\"https://bg3.wiki/w/images/thumb/4/43/Strength_Small_Icon.png/50px-Strength_Small_Icon.png\" height=\"25\" align=\"top\" alt=\"Strength\" />Strength"
| replace "Dexterity" "<img src=\"https://bg3.wiki/w/images/thumb/d/d1/Dexterity_Small_Icon.png/50px-Dexterity_Small_Icon.png\" height=\"25\" align=\"top\" alt=\"Dexterity\" /> Dexterity"
| replace "**Constitution**" "<img src='https://bg3.wiki/w/images/thumb/6/6b/Constitution_Small_Icon.png/50px-Constitution_Small_Icon.png' height='25' align='top' alt='Constitution' />Constitution"
| replace "Intelligence" "<img src=\"https://bg3.wiki/w/images/thumb/7/7d/Intelligence_Small_Icon.png/20px-Intelligence_Small_Icon.png\" height=\"25\" align=\"top\" alt=\"Intelligence\" />Intelligence"
| replace "Wisdom" "<img src=\"https://bg3.wiki/w/images/thumb/b/b7/Wisdom_Small_Icon.png/20px-Wisdom_Small_Icon.png\" height=\"25\" align=\"top\" alt=\"Wisdom\" /> Wisdom"
| replace "Charisma" "<img src='https://bg3.wiki/w/images/thumb/8/8f/Charisma_Small_Icon.png/20px-Charisma_Small_Icon.png' height='25' align='top' alt='Charisma' />Charisma"



| ireplace "Critical Hit(s?)" "[Critical Hit$1](https://bg3.wiki/wiki/Critical_Hit)"
| ireplace "Resistant" "[Resistant](https://bg3.wiki/wiki/Resistance)"
| ireplace "Difficult Terrain" "[Difficult Terrain](https://bg3.wiki/wiki/Difficult_Terrain)"
| replace "Burning" "[Burning](https://bg3.wiki/wiki/Burning_(Condition))"
| ireplace "Short Rest" "[Short Rest](https://bg3.wiki/wiki/Short_Rest)"
| replace "**Rage**" "[**Rage**](https://bg3.wiki/wiki/Rage)"
| replace "Stunned" "[Stunned](https://bg3.wiki/wiki/Stunned)"


| replace "Howling Blast" "<a href='Death Knight Spells#howling-blast'> <img src='images/ControllerIcons/skills_png/Action_DeathKnight_HowlingBlast.png' height='25' align='top' alt='Action_DeathKnight_HowlingBlast.png' />Howling Blast</a>"
| replace "Obliterate" "<a href='Death Knight Spells#obliterate'> <img src='images/ControllerIcons/skills_png/Action_DeathKnight_Obliterate.png' height='25' align='top' alt='Action_DeathKnight_Obliterate.png' />Obliterate</a>"
| replace "Frostscythe" "<a href='Death Knight Spells#frostscythe'> <img src='images/ControllerIcons/skills_png/Action_DeathKnight_Frostscythe.png' height='25' align='top' alt='Action_DeathKnight_Frostscythe.png' />Frostscythe</a>"
| replace "Runeforged" "<a href='Death Knight#runeforging'> <img src='images/ControllerIcons/skills_png/Action_DeathKnight_Runeforging.png' height='25' align='top' alt='Action_DeathKnight_Runeforging.png' />Runeforged</a>"
| replace "Death Strike" "<a href='Death Knight Spells#death-strike'> <img src='images/ControllerIcons/skills_png/Action_DeathKnight_DeathStrike.png' height='25' align='top' alt='Action_DeathKnight_DeathStrike.png' />Death Strike</a>"
| replace "Death and Decay" "<a href='Death Knight Spells#death-and-decay'> <img src='images/ControllerIcons/skills_png/Action_DeathKnight_DeathAndDecay.png' height='25' align='top' alt='Action_DeathKnight_DeathAndDecay.png' />Death and Decay</a>"
| replace "Dark Succor" "<a href='Death Knight - Blood#dark-succor'> <img src='images/ControllerIcons/skills_png/Action_DeathKnight_DeathStrike.png' height='25' align='top' alt='Action_DeathKnight_DeathStrike.png' />Dark Succor</a>"
| replace "Death Coil" "<a href='Death Knight Spells#death-coil'> <img src='images/ControllerIcons/skills_png/Action_DeathKnight_DeathCoil.png' height='25' align='top' alt='Action_DeathKnight_DeathCoil.png' />Death Coil</a>"
| replace "Virulent Plague" "<a href='Death Knight Spells#virulent-plague'> <img src='images/ControllerIcons/skills_png/Status_DeathKnight_VirulentPlague.png' height='25' align='top' alt='Status_DeathKnight_VirulentPlague.png' />Virulent Plague</a>"
| replace "Frost Fever" "<a href='Death Knight Spells#frost-fever'> <img src='images/ControllerIcons/skills_png/Status_DeathKnight_FrostFever.png' height='25' align='top' alt='Status_DeathKnight_FrostFever.png' />Frost Fever</a>"
| replace "Blood Plague" "<a href='Death Knight Spells#blood-plague'> <img src='images/ControllerIcons/skills_png/Status_DeathKnight_BloodPlague.png' height='25' align='top' alt='Status_DeathKnight_BloodPlague.png' />Blood Plague</a>"
| replace "Festering Wound" "<a href='Death Knight Spells#festering-wound'> <img src='images/ControllerIcons/skills_png/Status_DeathKnight_FesteringWound.png' height='25' align='top' alt='Status_DeathKnight_FesteringWound.png' />Festering Wound</a>"
| replace "Templar's Verdict" "<a href='#templars-verdict'> <img src='images/ControllerIcons/skills_png/Action_Paladin_TemplarsVerdict.png' height='25' align='top' alt='Action_Paladin_TemplarsVerdict.png' />Templar's Verdict</a>"
| replace "Divine Storm" "<a href='#divine-storm'> <img src='images/ControllerIcons/skills_png/Action_Paladin_DivineStorm.png' height='25' align='top' alt='Action_Paladin_DivineStorm.png' />Divine Storm</a>"
| replace "Avenging Wrath" "<a href='#avenging-wrath'> <img src='images/ControllerIcons/skills_png/Action_Paladin_AvengingWrath.png' height='25' align='top' alt='Action_Paladin_AvengingWrath.png' />Avenging Wrath</a>"
| replace "Exorcism" "<a href='Paladin---Abilities#exorcism'> <img src='images/ControllerIcons/skills_png/Action_Paladin_Exorcism.png' height='25' align='top' alt='Action_Paladin_Exorcism.png' />Exorcism</a>"














-}}
{{ $str }}
{{- end -}}

{{- define "pallyScale" -}}
Improving at {{ $.Values.ScaleWithPaladinLevel | ternary "paladin" "character" }} level 5 and 10
{{- end -}}