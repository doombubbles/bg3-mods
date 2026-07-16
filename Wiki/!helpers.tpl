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
| replace "Howling Blast" "[[Howling Blast | Death-Knight-Spells#Howling Blast]]"
| replace "Obliterate" "[[Obliterate | Death-Knight-Spells#Obliterate]]"
| replace "Frostscythe" "[[Frostscythe | Death-Knight-Spells#Frostscythe]]"
| replace "Runeforged" "[[Runeforged | Death-Knight#Runeforging]]"
| replace "Death Strike" "[[Death Strike | Death-Knight-Spells#Death Strike]]"
| replace "Death and Decay" "[[Death and Decay | Death-Knight-Spells#Death and Decay]]"
| replace "Dark Succor" "[[Dark Succor | Death-Knight---Blood#Dark Succor]]"
| replace "Death Coil" "[[Death Coil | Death-Knight-Spells#Death Coil]]"
| replace "Virulent Plague" "[[Virulent Plague | Death-Knight-Spells#Virulent Plague]]"
| replace "Frost Fever" "[[Frost Fever | Death-Knight-Spells#Frost Fever]]"
| replace "Blood Plague" "[[Blood Plague | Death-Knight-Spells#Blood Plague]]"
| replace "Festering Wound" "[[Festering Wound | Death-Knight-Spells#Festering Wound]]"
| replace "Templar's Verdict" "[[Templar's Verdict]]"
| replace "Divine Storm" "[[Divine Storm]]"
| replace "Avenging Wrath" "[[Avenging Wrath]]"
| replace "Exorcism" "[[Exorcism | Paladin---Abilities#Exorcism]]"

| replace "**Bloodthirst**" "[[Bloodthirst | Barbarian---Fury#Bloodthirst]]"
| replace "**Raging Blow**" "[[Raging Blow | Barbarian---Fury#Raging Blow]]"
| replace "**Wild Strike**" "[[Wild Strike | Barbarian---Fury#Wild Strike]]"
| replace "**Charge**" "[[Charge]]"
| replace "**Execute**" "[[Execute]]"
| replace "**Whirlwind**" "[[Whirlwind]]"
| replace "@@WIKIFY_THUNDER_CLAP@@" "[[Thunder Clap]]"
| replace "**Storm Bolt**" "[[Storm Bolt]]"
| replace "**Overpower**" "[[Overpower | Fighter---Arms#Overpower]]"
| replace "**Sweeping Strikes**" "[[Sweeping Strikes | Fighter---Arms#Sweeping Strikes]]"
| replace "**Cleave**" "[[Cleave | Fighter---Arms#Cleave]]"
| replace "**Mortal Strike**" "[[Mortal Strike | Fighter---Arms#Mortal Strike]]"
| replace "**Slam**" "[[Slam | Fighter---Arms#Slam]]"
| replace "**Colossus Smash**" "[[Colossus Smash | Fighter---Arms#Colossus Smash]]"

| replace "**Shadow Word: Pain**" "[[Shadow Word: Pain | Cleric---Shadow#Shadow Word: Pain]]"
| replace "**Shadow Word: Death**" "[[Shadow Word: Death | Cleric---Shadow#Shadow Word: Death]]"
| replace "**Arcane Blast**" "[[Arcane Blast | Wizard---Arcane#Arcane Blast]]"
| replace "**Arcane Surge**" "[[Arcane Surge | Wizard---Arcane#Arcane Surge]]"
| replace "**Alter Time**" "[[Alter Time | Wizard---Chronomancy#Alter Time]]"
| replace "**Conjure Fiend**" "[[Conjure Fiend | Warlock---Demonology#Conjure Fiend]]"














-}}
{{ $str }}
{{- end -}}

{{- define "pallyScale" -}}
Improving at {{ $.Values.ScaleWithPaladinLevel | ternary "paladin" "character" }} level 5 and 10
{{- end -}}
