{{- define "wikify" -}}
{{- $str := . -}}
{{- $str = $str 

| replace "**Thunder Clap**" "@@WIKIFY_THUNDER_CLAP@@"

| replace "Bludgeoning" "<img src='images/_bg3/Game/Public/Game/GUI/Assets/Shared_c/c_damage_icons/c_ico_dmg_blunt.png' height='25' align='top' alt='Bludgeoning Damage' />Bludgeoning"
| replace "Piercing" "<img src='images/_bg3/Game/Public/Game/GUI/Assets/Shared_c/c_damage_icons/c_ico_dmg_piercing.png' height='25' align='top' alt='Piercing Damage' />Piercing"
| replace "Slashing" "<img src='images/_bg3/Game/Public/Game/GUI/Assets/Shared_c/c_damage_icons/c_ico_dmg_slashing.png' height='25' align='top' alt='Slashing Damage' />Slashing"
| replace "Cold" "<img src='images/_bg3/Game/Public/Game/GUI/Assets/Shared_c/c_damage_icons/c_ico_dmg_cold.png' height='25' align='top' alt='Cold Damage' />Cold"
| replace "Lightning" "<img src='images/_bg3/Game/Public/Game/GUI/Assets/Shared_c/c_damage_icons/c_ico_dmg_lightning.png' height='25' align='top' alt='Lightning Damage' />Lightning"
| replace "Thunder" "<img src='images/_bg3/Game/Public/Game/GUI/Assets/Shared_c/c_damage_icons/c_ico_dmg_thunder.png' height='25' align='top' alt='Thunder Damage' />Thunder"
| replace "Acid" "<img src='images/_bg3/Game/Public/Game/GUI/Assets/Shared_c/c_damage_icons/c_ico_dmg_acid.png' height='25' align='top' alt='Acid Damage' />Acid"
| replace "Poison" "<img src='images/_bg3/Game/Public/Game/GUI/Assets/Shared_c/c_damage_icons/c_ico_dmg_poison.png' height='25' align='top' alt='Poison Damage' />Poison"
| replace "Necrotic" "<img src='images/_bg3/Game/Public/Game/GUI/Assets/Shared_c/c_damage_icons/c_ico_dmg_necrotic.png' height='25' align='top' alt='Necrotic Damage' />Necrotic"
| replace "Force" "<img src='images/_bg3/Game/Public/Game/GUI/Assets/Shared_c/c_damage_icons/c_ico_dmg_force.png' height='25' align='top' alt='Force Damage' />Force"
| replace "Fire" "<img src='images/_bg3/Game/Public/Game/GUI/Assets/Shared_c/c_damage_icons/c_ico_dmg_fire.png' height='25' align='top' alt='Fire Damage' />Fire"
| replace "Radiant" "<img src='images/_bg3/Game/Public/Game/GUI/Assets/Shared_c/c_damage_icons/c_ico_dmg_radiant.png' height='25' align='top' alt='Radiant Damage' />Radiant"
| replace "Psychic" "<img src='images/_bg3/Game/Public/Game/GUI/Assets/Shared_c/c_damage_icons/c_ico_dmg_psychic.png' height='25' align='top' alt='Psychic Damage' />Psychic"

| replace "**Action**" "<img src='images/_bg3/Game/Public/Game/GUI/Assets/ActionResources_c/Icons/c_ico_AP.png' height='25' align='top' alt='ActionPoint' />**Action**"
| replace "Bonus Action" "<img src='images/_bg3/Game/Public/Game/GUI/Assets/ActionResources_c/Icons/c_ico_bonusAction.png' height='25' align='top' alt='ActionPoint' />Bonus Action"
| replace "Arcane Recovery" "<img src='images/_bg3/Game/Public/Game/GUI/Assets/ActionResources_c/Icons/c_ico_classRes_arcaneRecovery.png' height='25' align='top' alt='Arcane Recovery' />Arcane Recovery"
| replace "Channel Oath" "<img src='images/_bg3/Game/Public/Game/GUI/Assets/ActionResources_c/Icons/c_ico_classRes_channelOath.png' height='25' align='top' alt='Channel Oath' />Channel Oath"
| ireplace "Rage Charge(s?)" "<img src='images/_bg3/Game/Public/Game/GUI/Assets/ActionResources_c/Icons/c_ico_classRes_rage.png' height='25' align='top' alt='Rage Charge' />Rage Charge$1"
| ireplace "Blood Rune(s?)" "<img src='images/ActionResources_c/Icons/Resources/BloodRune.png' height='25' align='top' alt='Blood Rune' />Blood Rune$1"
| ireplace "Frost Rune(s?)" "<img src='images/ActionResources_c/Icons/Resources/FrostRune.png' height='25' align='top' alt='Frost Rune' />Frost Rune$1"
| ireplace "Unholy Rune(s?)" "<img src='images/ActionResources_c/Icons/Resources/UnholyRune.png' height='25' align='top' alt='Unholy Rune' />Unholy Rune$1"
| ireplace "Any Rune(s?)" "<img src='images/ActionResources_c/Icons/Resources/BloodRune.png' height='25' align='top' alt='Blood Rune' /><img src='images/ActionResources_c/Icons/Resources/FrostRune.png' height='25' align='top' alt='Frost Rune' /><img src='images/ActionResources_c/Icons/Resources/UnholyRune.png' height='25' align='top' alt='Unholy Rune' />Any Rune$1"
| replace "**Spell Slot" "<img src='images/_bg3/Game/Public/Game/GUI/Assets/ActionResources_c/Icons/c_ico_mini_spellSlot.png' height='25' align='top' alt='Spell Slot' />**Spell Slot"
| replace "Warlock Spell Slot" "<img src='images/_bg3/Game/Public/Game/GUI/Assets/ActionResources_c/Icons/c_ico_mini_spellSlot_warlock.png' height='25' align='top' alt='Warlock Spell Slot' />Warlock Spell Slot"
| replace "Sorcery Point" "<img src='images/_bg3/Game/Public/Game/GUI/Assets/ActionResources_c/Icons/c_ico_classRes_sorc.png' height='25' align='top' alt='Sorcery Point' />Sorcery Point"
| replace "Channel Divinity" "<img src='images/_bg3/Game/Public/Game/GUI/Assets/ActionResources_c/Icons/c_ico_classRes_channelDivinity.png' height='25' align='top' alt='Channel Divinity' />Channel Divinity"
| replace "Superiority Di" "<img src='images/_bg3/Game/Public/Game/GUI/Assets/ActionResources_c/Icons/c_ico_res_superiorityDice.png' height='25' align='top' alt='Superiority Di' />Superiority Di"
| replace "Ki Point" "<img src='images/_bg3/Game/Public/Game/GUI/Assets/ActionResources_c/Icons/c_ico_classRes_ki.png' height='25' align='top' alt='Ki Point' />Ki Point"
| replace "Wild Shape Charge" "<img src='images/_bg3/Game/Public/Game/GUI/Assets/ActionResources_c/Icons/c_ico_classRes_wildshape.png' height='25' align='top' alt='Wild Shape Charge' />Wild Shape Charge"
| replace "Bardic Inspiration" "<img src='images/_bg3/Game/Public/Game/GUI/Assets/ActionResources_c/Icons/c_ico_classRes_inspiration.png' height='25' align='top' alt='Bardic Inspiration' />Bardic Inspiration"
| replace "Natural Recovery" "<img src='images/_bg3/Game/Public/Game/GUI/Assets/ActionResources_c/Icons/c_ico_classRes_NaturalRecovery.png' height='25' align='top' alt='Natural Recovery' />Natural Recovery"
| replace "Lay on Hands" "<img src='images/_bg3/Game/Public/Game/GUI/Assets/ActionResources_c/Icons/c_ico_classRes_LayOnHands.png' height='25' align='top' alt='Lay on Hands' />Lay on Hands"
| replace "War Priest" "<img src='images/_bg3/Game/Public/Game/GUI/Assets/ActionResources_c/Icons/c_ico_classRes_warPriest.png' height='25' align='top' alt='War Priest' />War Priest"
| replace "Arcane Arrow" "<img src='images/_bg3/Game/Public/Game/GUI/Assets/ActionResources_c/Icons/c_ico_classRes_arcaneShot_d.png' height='25' align='top' alt='Arcane Arrow' />Arcane Arrow"
| replace "Star Map" "<img src='images/_bg3/Gustav_Textures/Mods/GustavX/GUI/Assets/ActionResources_c/Icons/StarMapPoint.png' height='25' align='top' alt='Star Map' />Star Map"
| replace "Cosmic Omen" "<img src='images/_bg3/Gustav_Textures/Mods/GustavX/GUI/Assets/ActionResources_c/Icons/CosmicOmen.png' height='25' align='top' alt='Cosmic Omen' />Cosmic Omen"
| replace "Bladesong" "<img src='images/_bg3/Gustav_Textures/Mods/GustavX/GUI/Assets/ActionResources_c/Icons/Bladesong.png' height='25' align='top' alt='Bladesong' />Bladesong"

| replace "**temporary hit points**" "[<img src='images/_bg3/Game/Public/Game/GUI/Assets/BottomBar/ico_extraHP.png' height='25' align='top' />**temporary hit points**](https://bg3.wiki/wiki/temporary_hit_points)"
| ireplace "restrain(ing|ed)" "[<img src='images/_bg3/Icons/Public/Shared/Assets/Textures/Icons/Icons_Skills.DDS/Status_Restrained.png' height='25' align='top' /> restrain$1](https://bg3.wiki/wiki/Restrained_(Condition))"
| replace "Advantage" "<img src='images/_bg3/Game/Public/Game/GUI/Assets/Shared/ico_advantage.png' height='25' align='top' alt='Advantage' />Advantage"
| replace "Disadvantage" "<img src='images/_bg3/Game/Public/Game/GUI/Assets/Shared/ico_disadvantage.png' height='25' align='top' alt='Disadvantage' />Disadvantage"
| replace "Concentration" "<img src='images/_bg3/Game/Public/Game/GUI/Assets/Tooltips/ico_concentration.png' height='25' align='top' alt='Concentration' />Concentration"

| replace "**hit points**" "<img src='images/_bg3/Game/Public/Game/GUI/Assets/Shared/ico_healing.png' height='25' align='top' />**hit points**"
| replace "Strength" "<img src=\"images/_bg3/Game/Public/Game/GUI/Assets/AbilityIcons/strength.png\" height=\"25\" align=\"top\" alt=\"Strength\" />Strength"
| replace "Dexterity" "<img src=\"images/_bg3/Game/Public/Game/GUI/Assets/AbilityIcons/dexterity.png\" height=\"25\" align=\"top\" alt=\"Dexterity\" /> Dexterity"
| replace "**Constitution**" "<img src='images/_bg3/Game/Public/Game/GUI/Assets/AbilityIcons/constitution.png' height='25' align='top' alt='Constitution' />Constitution"
| replace "Intelligence" "<img src=\"images/_bg3/Game/Public/Game/GUI/Assets/AbilityIcons/intelligence.png\" height=\"25\" align=\"top\" alt=\"Intelligence\" />Intelligence"
| replace "Wisdom" "<img src=\"images/_bg3/Game/Public/Game/GUI/Assets/AbilityIcons/wisdom.png\" height=\"25\" align=\"top\" alt=\"Wisdom\" /> Wisdom"
| replace "Charisma" "<img src='images/_bg3/Game/Public/Game/GUI/Assets/AbilityIcons/charisma.png' height='25' align='top' alt='Charisma' />Charisma"



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

| replace "**Bloodthirst**" "<a href='Barbarian---Fury#bloodthirst'> <img src='images/_bg3/Game/Public/Game/GUI/Assets/ControllerUIIcons/skills_png/Action_SacrificeToLoviatar.png' height='25' align='top' alt='Bloodthirst' />Bloodthirst</a>"
| replace "**Raging Blow**" "<a href='Barbarian---Fury#raging-blow'> <img src='images/_bg3/Game/Public/Game/GUI/Assets/ControllerUIIcons/skills_png/Action_Barbarian_FrenziedStrike.png' height='25' align='top' alt='Raging Blow' />Raging Blow</a>"
| replace "**Wild Strike**" "<a href='Barbarian---Fury#wild-strike'> <img src='images/_bg3/Game/Public/Game/GUI/Assets/ControllerUIIcons/skills_png/Action_Slash.png' height='25' align='top' alt='Wild Strike' />Wild Strike</a>"
| replace "**Charge**" "<a href='#charge'> <img src='images/_bg3/Game/Public/Game/GUI/Assets/ControllerUIIcons/skills_png/Action_Rush.png' height='25' align='top' alt='Charge' />Charge</a>"
| replace "**Execute**" "<a href='#execute'> <img src='images/_bg3/Game/Public/Game/GUI/Assets/ControllerUIIcons/skills_png/Action_DivineStrike_Physical_Melee.png' height='25' align='top' alt='Execute' />Execute</a>"
| replace "**Whirlwind**" "<a href='#whirlwind'> <img src='images/_bg3/Game/Public/Game/GUI/Assets/ControllerUIIcons/skills_png/Action_Multiattack_WhirlwindAttack.png' height='25' align='top' alt='Whirlwind' />Whirlwind</a>"
| replace "@@WIKIFY_THUNDER_CLAP@@" "<a href='#thunder-clap'> <img src='images/_bg3/Game/Public/Game/GUI/Assets/ControllerUIIcons/skills_png/Action_Mag_GrandSlam.png' height='25' align='top' alt='Thunder Clap' />Thunder Clap</a>"
| replace "**Storm Bolt**" "<a href='#storm-bolt'> <img src='images/_bg3/Game/Public/Game/GUI/Assets/ControllerUIIcons/skills_png/Action_AbsolutePower.png' height='25' align='top' alt='Storm Bolt' />Storm Bolt</a>"
| replace "**Overpower**" "<a href='Fighter---Arms#overpower'> <img src='images/_bg3/Game/Public/Game/GUI/Assets/ControllerUIIcons/skills_png/PassiveFeature_GuidedStrike.png' height='25' align='top' alt='Overpower' />Overpower</a>"
| replace "**Sweeping Strikes**" "<a href='Fighter---Arms#sweeping-strikes'> <img src='images/_bg3/Game/Public/Game/GUI/Assets/ControllerUIIcons/skills_png/Action_SweepingAttack.png' height='25' align='top' alt='Sweeping Strikes' />Sweeping Strikes</a>"
| replace "**Cleave**" "<a href='Fighter---Arms#cleave'> <img src='images/_bg3/Game/Public/Game/GUI/Assets/ControllerUIIcons/skills_png/Action_Cleave_New.png' height='25' align='top' alt='Cleave' />Cleave</a>"
| replace "**Mortal Strike**" "<a href='Fighter---Arms#mortal-strike'> <img src='images/_bg3/Game/Public/Game/GUI/Assets/ControllerUIIcons/skills_png/Action_FullSwing.png' height='25' align='top' alt='Mortal Strike' />Mortal Strike</a>"
| replace "**Slam**" "<a href='Fighter---Arms#slam'> <img src='images/_bg3/Game/Public/Game/GUI/Assets/ControllerUIIcons/skills_png/Action_HeartStopper.png' height='25' align='top' alt='Slam' />Slam</a>"
| replace "**Colossus Smash**" "<a href='Fighter---Arms#colossus-smash'> <img src='images/_bg3/Game/Public/Game/GUI/Assets/ControllerUIIcons/skills_png/Action_PostureBreaker.png' height='25' align='top' alt='Colossus Smash' />Colossus Smash</a>"

| replace "**Shadow Word: Pain**" "<a href='Cleric---Shadow#shadow-word-pain'> <img src='images/ControllerIcons/skills_png/Spell_Cleric_ShadowWordPain.png' height='25' align='top' alt='Shadow Word: Pain' />Shadow Word: Pain</a>"
| replace "**Shadow Word: Death**" "<a href='Cleric---Shadow#shadow-word-death'> <img src='images/ControllerIcons/skills_png/Spell_Cleric_ShadowWordDeath.png' height='25' align='top' alt='Shadow Word: Death' />Shadow Word: Death</a>"
| replace "**Arcane Blast**" "<a href='Wizard---Arcane#arcane-blast'> <img src='images/ControllerIcons/skills_png/Spell_Wizard_ArcaneBlast.png' height='25' align='top' alt='Arcane Blast' />Arcane Blast</a>"
| replace "**Arcane Surge**" "<a href='Wizard---Arcane#arcane-surge'> <img src='images/ControllerIcons/skills_png/Spell_Wizard_ArcaneSurge.png' height='25' align='top' alt='Arcane Surge' />Arcane Surge</a>"
| replace "**Alter Time**" "<a href='Wizard---Chronomancy#alter-time'> <img src='images/ControllerIcons/skills_png/Spell_Wizard_AlterTime.png' height='25' align='top' alt='Alter Time' />Alter Time</a>"
| replace "**Conjure Fiend**" "<a href='Warlock---Demonology#conjure-fiend'> <img src='images/_bg3/Game/Public/Game/GUI/Assets/ControllerUIIcons/skills_png/Spell_Conjuration_PlanarAlly.png' height='25' align='top' alt='Conjure Fiend' />Conjure Fiend</a>"














-}}
{{ $str }}
{{- end -}}

{{- define "pallyScale" -}}
Improving at {{ $.Values.ScaleWithPaladinLevel | ternary "paladin" "character" }} level 5 and 10
{{- end -}}
