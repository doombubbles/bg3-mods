{{- define "wikify" -}}
{{- $str := . -}}
{{- $str = $str 

| replace "**Thunder Clap**" "@@WIKIFY_THUNDER_CLAP@@"

| replace "Bludgeoning" "[[Bludgeoning]]"
| replace "Piercing" "[[Piercing]]"
| replace "Slashing" "[[Slashing]]"
| replace "Cold" "[[Cold]]"
| replace "Lightning" "[[Lightning]]"
| replace "Thunder" "[[Thunder]]"
| replace "Acid" "[[Acid]]"
| replace "Poison" "[[Poison]]"
| replace "Necrotic" "[[Necrotic]]"
| replace "Force" "[[Force]]"
| replace "Fire" "[[Fire]]"
| replace "Radiant" "[[Radiant]]"
| replace "Psychic" "[[Psychic]]"

| replace "**Action**" "[[Action]]"
| replace "Bonus Action" "[[Bonus Action]]"
| replace "Arcane Recovery" "[[Arcane Recovery]]"
| replace "Channel Oath" "[[Channel Oath]]"
| ireplace "Rage Charge(s?)" "[[Rage Charge$1]]"
| ireplace "Blood Rune(s?)" "[[Blood Rune$1]]"
| ireplace "Frost Rune(s?)" "[[Frost Rune$1]]"
| ireplace "Unholy Rune(s?)" "[[Unholy Rune$1]]"
| ireplace "Any Rune(s?)" "[[Any Rune$1]]"
| replace "**Spell Slot" "<img src='Game/ActionResources_c/Icons/c_ico_mini_spellSlot.png' height='25' align='top' alt='Spell Slot' />**Spell Slot"
| replace "Warlock Spell Slot" "[[Warlock Spell Slot]]"
| replace "Sorcery Point" "[[Sorcery Point]]"
| replace "Channel Divinity" "[[Channel Divinity]]"
| ireplace "Superiority D(ie|ice)" "[[Superiority D$1]]"
| replace "Ki Point" "[[Ki Point]]"
| replace "Wild Shape Charge" "[[Wild Shape Charge]]"
| replace "Bardic Inspiration" "[[Bardic Inspiration]]"
| replace "Natural Recovery" "[[Natural Recovery]]"
| replace "Lay on Hands" "[[Lay on Hands]]"
| replace "War Priest" "[[War Priest]]"
| replace "Arcane Arrow" "[[Arcane Arrow]]"
| replace "Star Map" "[[Star Map]]"
| replace "Cosmic Omen" "[[Cosmic Omen]]"
| replace "Bladesong" "[[Bladesong]]"

| replace "**temporary hit points**" "[[temporary hit points]]"
| ireplace "restrain(ing|ed)" "[[restrain$1]]"
| replace "Advantage" "[[Advantage]]"
| replace "Disadvantage" "[[Disadvantage]]"
| replace "Concentration" "[[Concentration]]"

| replace "**hit points**" "[[hit points]]"
| replace "Strength" "[[Strength]]"
| replace "Dexterity" "[[Dexterity]]"
| replace "**Constitution**" "[[Constitution]]"
| replace "Intelligence" "[[Intelligence]]"
| replace "Wisdom" "[[Wisdom]]"
| replace "Charisma" "[[Charisma]]"



| ireplace "Critical Hit(s?)" "[[Critical Hit$1]]"
| ireplace "Resistant" "[[Resistant]]"
| ireplace "Difficult Terrain" "[[Difficult Terrain]]"
| replace "Burning" "[[Burning]]"
| ireplace "Short Rest" "[[Short Rest]]"
| replace "**Rage**" "[[Rage]]"
| replace "Stunned" "[[Stunned]]"
| replace "Howling Blast" "[[Death-Knight-Spells#Howling Blast | Howling Blast]]"
| replace "Obliterate" "[[Death-Knight-Spells#Obliterate | Obliterate]]"
| replace "Frostscythe" "[[Death-Knight-Spells#Frostscythe | Frostscythe]]"
| replace "Runeforged" "[[Death-Knight#Runeforging | Runeforged]]"
| replace "Death Strike" "[[Death-Knight-Spells#Death Strike | Death Strike]]"
| replace "Death and Decay" "[[Death-Knight-Spells#Death and Decay | Death and Decay]]"
| replace "Dark Succor" "[[Death-Knight---Blood#Dark Succor | Dark Succor]]"
| replace "Death Coil" "[[Death-Knight-Spells#Death Coil | Death Coil]]"
| replace "Virulent Plague" "[[Death-Knight-Spells#Virulent Plague | Virulent Plague]]"
| replace "Frost Fever" "[[Death-Knight-Spells#Frost Fever | Frost Fever]]"
| replace "Blood Plague" "[[Death-Knight-Spells#Blood Plague | Blood Plague]]"
| replace "Festering Wound" "[[Death-Knight-Spells#Festering Wound | Festering Wound]]"
| replace "Templar's Verdict" "[[Templar's Verdict]]"
| replace "Divine Storm" "[[Divine Storm]]"
| replace "Avenging Wrath" "[[Avenging Wrath]]"
| replace "Exorcism" "[[Paladin---Abilities#Exorcism | Exorcism]]"

| replace "**Bloodthirst**" "[[Barbarian---Fury#Bloodthirst | Bloodthirst]]"
| replace "**Raging Blow**" "[[Barbarian---Fury#Raging Blow | Raging Blow]]"
| replace "**Wild Strike**" "[[Barbarian---Fury#Wild Strike | Wild Strike]]"
| replace "**Charge**" "[[Charge]]"
| replace "**Execute**" "[[Execute]]"
| replace "**Whirlwind**" "[[Whirlwind]]"
| replace "@@WIKIFY_THUNDER_CLAP@@" "[[Thunder Clap]]"
| replace "**Storm Bolt**" "[[Storm Bolt]]"
| replace "**Overpower**" "[[Fighter---Arms#Overpower | Overpower]]"
| replace "**Sweeping Strikes**" "[[Fighter---Arms#Sweeping Strikes | Sweeping Strikes]]"
| replace "**Cleave**" "[[Fighter---Arms#Cleave | Cleave]]"
| replace "**Mortal Strike**" "[[Fighter---Arms#Mortal Strike | Mortal Strike]]"
| replace "**Slam**" "[[Fighter---Arms#Slam | Slam]]"
| replace "**Colossus Smash**" "[[Fighter---Arms#Colossus Smash | Colossus Smash]]"

| replace "**Shadow Word: Pain**" "[[Cleric---Shadow#Shadow Word: Pain | Shadow Word: Pain]]"
| replace "**Shadow Word: Death**" "[[Cleric---Shadow#Shadow Word: Death | Shadow Word: Death]]"
| replace "**Arcane Blast**" "[[Wizard---Arcane#Arcane Blast | Arcane Blast]]"
| replace "**Arcane Surge**" "[[Wizard---Arcane#Arcane Surge | Arcane Surge]]"
| replace "**Alter Time**" "[[Wizard---Chronomancy#Alter Time | Alter Time]]"
| replace "**Conjure Fiend**" "[[Warlock---Demonology#Conjure Fiend | Conjure Fiend]]"














-}}
{{ $str }}
{{- end -}}

{{- define "pallyScale" -}}
Improving at {{ $.Values.ScaleWithPaladinLevel | ternary "paladin" "character" }} level 5 and 10
{{- end -}}
