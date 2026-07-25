{{- define "wikify" -}}
{{- $str := . -}}
{{- $str = $str 

| ireplace "\\bBludgeoning\\b([^\\n.]*\\bdamage\\b)" "[[Bludgeoning]]$1"
| ireplace "\\bPiercing\\b([^\\n.]*\\bdamage\\b)" "[[Piercing]]$1"
| ireplace "\\bSlashing\\b([^\\n.]*\\bdamage\\b)" "[[Slashing]]$1"
| ireplace "\\bCold\\b([^\\n.]*\\bdamage\\b)" "[[Cold]]$1"
| ireplace "\\bLightning\\b([^\\n.]*\\bdamage\\b)" "[[Lightning]]$1"
| ireplace "\\bThunder\\b([^\\n.]*\\bdamage\\b)" "[[Thunder]]$1"
| ireplace "\\bAcid\\b([^\\n.]*\\bdamage\\b)" "[[Acid]]$1"
| ireplace "\\bPoison\\b([^\\n.]*\\bdamage\\b)" "[[Poison]]$1"
| ireplace "\\bNecrotic\\b([^\\n.]*\\bdamage\\b)" "[[Necrotic]]$1"
| ireplace "\\bForce\\b([^\\n.]*\\bdamage\\b)" "[[Force]]$1"
| ireplace "\\bFire\\b([^\\n.]*\\bdamage\\b)" "[[Fire]]$1"
| ireplace "\\bRadiant\\b([^\\n.]*\\bdamage\\b)" "[[Radiant]]$1"
| ireplace "\\bPsychic\\b([^\\n.]*\\bdamage\\b)" "[[Psychic]]$1"

| replace "Arcane Recovery" "[[Arcane Recovery]]"
| replace "Channel Oath" "[[Channel Oath]]"
| ireplace "Rage Charge(s?)" "[[Rage Charge$1]]"
| ireplace "Blood Rune(s?)" "[[Blood Rune$1]]"
| ireplace "Frost Rune(s?)" "[[Frost Rune$1]]"
| ireplace "Unholy Rune(s?)" "[[Unholy Rune$1]]"
| ireplace "Any Rune(s?)" "[[Any Rune$1]]"
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

| ireplace "restrain(ing|ed)" "[[restrain$1]]"
| replace "Advantage" "[[Advantage]]"
| replace "Disadvantage" "[[Disadvantage]]"
| replace "Concentration" "[[Concentration]]"

| replace "Strength" "[[Strength]]"
| replace "Dexterity" "[[Dexterity]]"
| replace "Intelligence" "[[Intelligence]]"
| replace "Wisdom" "[[Wisdom]]"
| replace "Charisma" "[[Charisma]]"



| ireplace "Critical Hit(s?)" "[[Critical Hit$1]]"
| ireplace "Resistant" "[[Resistant]]"
| ireplace "Difficult Terrain" "[[Difficult Terrain]]"
| replace "Burning" "[[Burning]]"
| ireplace "Short Rest" "[[Short Rest]]"
| replace "Stunned" "[[Stunned]]"
| replace "Howling Blast" "[[Howling Blast]]"
| replace "Obliterate" "[[Obliterate]]"
| replace "Frostscythe" "[[Frostscythe]]"
| replace "Runeforged" "[[Runeforged | Death-Knight#Runeforging]]"
| replace "Death Strike" "[[Death Strike]]"
| replace "Death and Decay" "[[Death and Decay]]"
| replace "Dark Succor" "[[Dark Succor]]"
| replace "Death Coil" "[[Death Coil]]"
| replace "Virulent Plague" "[[Virulent Plague]]"
| replace "Frost Fever" "[[Frost Fever]]"
| replace "Blood Plague" "[[Blood Plague]]"
| replace "Festering Wound" "[[Festering Wound]]"
| replace "Templar's Verdict" "[[Templar's Verdict]]"
| replace "Divine Storm" "[[Divine Storm]]"
| replace "Avenging Wrath" "[[Avenging Wrath]]"
| replace "Exorcism" "[[Exorcism]]"

| ireplace "\\*\\*([[:alnum:]][[:alnum:] ':+-]*)\\*\\*" "[[$1]]"













-}}
{{ $str }}
{{- end -}}

{{- define "pallyScale" -}}
Improving at {{ $.Values.ScaleWithPaladinLevel | ternary "paladin" "character" }} level 5 and 10
{{- end -}}
