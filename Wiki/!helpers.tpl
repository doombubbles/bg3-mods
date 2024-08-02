{{- define "wikify" -}}
{{- $str := . -}}
{{- $str = $str 

| replace "Bludgeoning" "<img src='https://bg3.wiki/w/images/7/7d/Bludgeoning_Damage_Icon.png' height='25' align='top' alt='Bludgeoning Damage' />Bludgeoning"
| replace "Piercing" "<img src='https://bg3.wiki/w/images/0/0b/Piercing_Damage_Icon.png' height='25' align='top' alt='Piercing Damage' />Piercing"
| replace "Slashing" "<img src='https://bg3.wiki/w/images/f/f0/Slashing_Damage_Icon.png' height='25' align='top' alt='Slashing Damage' />Slashing"
| replace "Cold" "<img src='https://bg3.wiki/w/images/0/05/Cold_Damage_Icon.png' height='25' align='top' alt='Cold Damage' />Cold"
| replace "Necrotic" "<img src='https://bg3.wiki/w/images/3/39/Necrotic_Damage_Icon.png' height='25' align='top' alt='Necrotic Damage' />Necrotic"
| replace "Force" "<img src='https://bg3.wiki/w/images/d/d1/Force_Damage_Icon.png' height='25' align='top' alt='Force Damage' />Force"

| replace "**Action**" "<img src='https://bg3.wiki/w/images/f/f2/Action_Icon.png' height='25' align='top' alt='ActionPoint' />Action"
| replace "Bonus Action" "<img src='https://bg3.wiki/w/images/c/c9/Bonus_Action_Icon.png' height='25' align='top' alt='ActionPoint' />Bonus Action"


| replace "**temporary hit points**" "[<img src='https://bg3.wiki/w/images/2/25/HP_Icon.png' height='25' align='top' />**temporary hit points**](https://bg3.wiki/wiki/temporary_hit_points)"
| ireplace "restrain(ing|ed)" "[<img src='https://bg3.wiki/w/images/thumb/2/20/Restrained_Condition_Icon.webp/60px-Restrained_Condition_Icon.webp.png' height='25' align='top' /> restrain$1](https://bg3.wiki/wiki/Restrained_(Condition))"

| replace "**Constitution**" "<img src='https://bg3.wiki/w/images/thumb/6/6b/Constitution_Small_Icon.png/50px-Constitution_Small_Icon.png' height='25' align='top' alt='Constitution' />Constitution"

| replace "**hit points**" "<img src='https://bg3.wiki/w/images/thumb/a/ac/Healing_Icon.png/50px-Healing_Icon.png' height='25' align='top' />**hit points**"
| replace "Strength" "<img src=\"https://bg3.wiki/w/images/thumb/4/43/Strength_Small_Icon.png/50px-Strength_Small_Icon.png\" height=\"25\" align=\"top\" alt=\"Strength\" />Strength"


| ireplace "Critical Hit" "[Critical Hit](https://bg3.wiki/wiki/Critical_Hit)"
| ireplace "Resistant" "[Resistant](https://bg3.wiki/wiki/Resistance)"
| ireplace "Difficult Terrain" "[Difficult Terrain](https://bg3.wiki/wiki/Difficult_Terrain)"


| replace "Howling Blast" "<a href='Death Knight Spells#Howling-Blast'> <img src='images/ControllerIcons/skills_png/Action_DeathKnight_HowlingBlast.png' height='25' align='top' alt='Action_DeathKnight_HowlingBlast.png' />Howling Blast</a>"
| replace "Obliterate" "<a href='Death Knight Spells#Obliterate'> <img src='images/ControllerIcons/skills_png/Action_DeathKnight_Obliterate.png' height='25' align='top' alt='Action_DeathKnight_Obliterate.png' />Obliterate</a>"
| replace "Frostscythe" "<a href='Death Knight Spells#Frostscythe'> <img src='images/ControllerIcons/skills_png/Action_DeathKnight_Frostscythe.png' height='25' align='top' alt='Action_DeathKnight_Frostscythe.png' />Frostscythe</a>"
| replace "Runeforged" "<a href='Death Knight#Runeforging'> <img src='images/ControllerIcons/skills_png/Action_DeathKnight_Runeforging.png' height='25' align='top' alt='Action_DeathKnight_Runeforging.png' />Runeforged</a>"
| replace "Death Strike" "<a href='Death Knight Spells#Death-Strike'> <img src='images/ControllerIcons/skills_png/Action_DeathKnight_DeathStrike.png' height='25' align='top' alt='Action_DeathKnight_DeathStrike.png' />Death Strike</a>"
| replace "Death and Decay" "<a href='Death Knight Spells#Death-and-Decay'> <img src='images/ControllerIcons/skills_png/Action_DeathKnight_DeathAndDecay.png' height='25' align='top' alt='Action_DeathKnight_DeathAndDecay.png' />Death and Decay</a>"
| replace "Dark Succor" "<a href='Death Knight - Blood#Dark-Succor'> <img src='images/ControllerIcons/skills_png/Action_DeathKnight_DeathStrike.png' height='25' align='top' alt='Action_DeathKnight_DeathStrike.png' />Dark Succor</a>"
| replace "Death Coil" "<a href='Death Knight Spells#Death-Coil'> <img src='images/ControllerIcons/skills_png/Action_DeathKnight_DeathCoil.png' height='25' align='top' alt='Action_DeathKnight_DeathCoil.png' />Death Coil</a>"
| replace "Virulent Plague" "<a href='Death Knight Spells#Virulent-Plague'> <img src='images/ControllerIcons/skills_png/Status_DeathKnight_VirulentPlague.png' height='25' align='top' alt='Status_DeathKnight_VirulentPlague.png' />Virulent Plague</a>"
| replace "Frost Fever" "<a href='Death Knight Spells#Frost-Fever'> <img src='images/ControllerIcons/skills_png/Status_DeathKnight_FrostFever.png' height='25' align='top' alt='Status_DeathKnight_FrostFever.png' />Frost Fever</a>"
| replace "Blood Plague" "<a href='Death Knight Spells#Blood-Plague'> <img src='images/ControllerIcons/skills_png/Status_DeathKnight_BloodPlague.png' height='25' align='top' alt='Status_DeathKnight_BloodPlague.png' />Blood Plague</a>"
| replace "Festering Wound" "<a href='Death Knight Spells#Festering-Wound'> <img src='images/ControllerIcons/skills_png/Status_DeathKnight_FesteringWound.png' height='25' align='top' alt='Status_DeathKnight_FesteringWound.png' />Festering Wound</a>"














-}}
{{ $str }}
{{- end -}}