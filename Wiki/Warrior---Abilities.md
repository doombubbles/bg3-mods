# Warrior Abilities

{{ if $.Values.FuryRevamp -}}
Warrior Abilities are a shared set of combat actions that can be chosen by a various new subclasses of ?[[Fighter]] and ?[[Barbarian]]. Most Warrior Abilities can be used once per [[Short Rest]], while a few more powerful ones can only be used once per [[Long Rest]]. If a single-target Warrior Ability misses, it can be used again.
{{- else -}}
Warrior Abilities are selectable combat techniques. Fury Barbarians spend 1 [[Rage Charge]] to use most Warrior Abilities, while Arms Fighters and Mountain Thane Barbarians can use most Warrior Abilities once per [[Short Rest]]. A few more powerful ones can only be used once per [[Long Rest]]. If a single-target Warrior Ability misses, it can be used again.
{{- end }}

![[Game/ControllerUIIcons/skills_png/Action_SacrificeToLoviatar.png]]

### Bloodthirst

- Available for [[Fury | Barbarian---Fury]]/[[Mountain Thane | Barbarian---Mountain-Thane]] Level 3+
- Costs 1 [[Action]]
- Weapon attack; restores [2](## 'Proficiency Bonus')d6 [[Hit Points]]
- {{ get .loca "h7cfa12d9ga912g4421ga9b8g4b18f0c93fcb" | include "wikify" }}

![[Game/ControllerUIIcons/skills_png/Action_Rush.png]]

### Charge

- Available for [[Arms | Fighter---Arms]]/[[Fury | Barbarian---Fury]]/[[Mountain Thane | Barbarian---Mountain-Thane]]/[[Protection | Fighter---Protection]] Level 3+
- Costs 1 [[Bonus Action]]
- Weapon attack, 9m range
- [[STR]] [[Saving Throw]] ([[Weapon Action DC]])
- {{ getf .loca "hf0da666cg2c85g4ec5g8e19g809ec529afbf" "1" | include "wikify" }}

![[Game/ControllerUIIcons/skills_png/Action_Cleave_New.png]]

### Cleave

- Available for [[Arms | Fighter---Arms]]/[[Protection | Fighter---Protection]] Level 3+
- Costs 1 [[Action]]; melee weapon attack in a 2m cone
- Deals full weapon damage
- {{ getf .loca "h1758449dg7435g46a0g8088g4485293de676" "3" | include "wikify" }}

![[Game/ControllerUIIcons/skills_png/Action_DivineStrike_Physical_Melee.png]]

### Execute

- Available for [[Arms | Fighter---Arms]]/[[Fury | Barbarian---Fury]]/[[Mountain Thane | Barbarian---Mountain-Thane]]/[[Protection | Fighter---Protection]] Level 3+
- Costs 1 [[Action]]
- Melee weapon attack
- {{ getf .loca "h9baff8c6gb3d0g4292gb126gf254ec89fb28" "50%" "[2](## 'Proficiency Bonus')d6" | include "wikify" }}

![[images/ControllerIcons/skills_png/Action_Warrior_MortalStrike.png]]

### Mortal Strike

- Available for [[Arms | Fighter---Arms]] Level 3+
- Costs 1 [[Action]]; melee weapon attack
- {{ get .loca "h39713ea2gd8ccg43bbgab88ge0cab9f1eea8" | include "wikify" }}
- Mortal Wounds lasts 3 turns.

![[Icons/Textures/Icons/Icons_Skills.DDS/statIcons_OpenWound.png]]

#### Mortal Wounds

{{ get .loca "ha67d0dffg013bg49f9g8d52gf3823c1bde37" | include "wikify" }}

![[Game/ControllerUIIcons/skills_png/PassiveFeature_GuidedStrike.png]]

### Overpower

- Available for [[Arms | Fighter---Arms]] Level 3+
- No action cost; triggered as an interrupt after missing with a melee weapon attack
- {{ get .loca "h921192a5g0910g47c0gbb85g3cfdde961410" | include "wikify" }}

![[Game/ControllerUIIcons/skills_png/Action_Barbarian_FrenziedStrike.png]]

### Raging Blow

- Available for [[Fury | Barbarian---Fury]] Level 3+
- Costs 1 [[Action]]
- Requires dual wielding; one weapon attack that deals both main-hand and off-hand weapon damage on a hit
- {{ getf .loca "hcdffe4f3gd2ffg4fecg80c0g0ef6e608c252" | include "wikify" }}

![[images/ControllerIcons/skills_png/Action_Warrior_Ravager.png]]

### Ravager

- Available for [[Arms | Fighter---Arms]]/{{ if $.Values.FuryRevamp }}[[Fury | Barbarian---Fury]]/{{ end }}[[Mountain Thane | Barbarian---Mountain-Thane]]/[[Protection | Fighter---Protection]] Level 3+
- Costs 1 [[Action]]; 9m range
- Deals [2](## 'Proficiency Bonus')d6 [[Slashing Damage]] to anyone inside a 2m radius each turn
- {{ getf .loca "h7109dcd0g0762g4af8gbcc1g83c98040035b" "3" | include "wikify" }}

![[Game/ControllerUIIcons/skills_png/Action_Barbarian_UnrelentingFerocity.png]]

### Ignore Pain

- Available for [[Protection | Fighter---Protection]] Level 3+
- Costs 1 [[Bonus Action]]
- {{ getf .loca "h74f65a9ag4ee7g49dagbf07g4515a01917d1" "5" "2" | include "wikify" }}

![[Game/ControllerUIIcons/skills_png/PassiveAction_ShieldMaster_Block.png]]

### Shield Block

- Available for [[Protection | Fighter---Protection]] Level 3+
- Costs 1 [[Bonus Action]]; requires a shield
- {{ getf .loca "hfb4ea036g6fedg40f0g9c98gfb9469cdaa98" "5" "2" | include "wikify" }}

![[Game/ControllerUIIcons/skills_png/Action_Bash.png]]

### Shield Slam

- Available for [[Protection | Fighter---Protection]] Level 3+
- Costs 1 [[Action]]; requires a shield
- Once per combat
- Melee unarmed attack; deals unarmed damage
- On a hit, [[STR]] [[Saving Throw]] ([[Weapon Action DC]]); a failed save knocks the target [[Prone]] for 1 turn
- {{ get .loca "h723672e7g263dg4487g838dgfb2492caeac8" | include "wikify" }}

![[Game/ControllerUIIcons/skills_png/Action_SweepingAttack.png]]

### Sweeping Strikes

- Available for [[Arms | Fighter---Arms]] Level 3+
- Costs 1 [[Bonus Action]]
- {{ get .loca "h5c4bc3bdg0b93g4cf7gb699ge1b657b5d2e9" | include "wikify" }}

![[images/ControllerIcons/skills_png/Action_Warrior_ThunderClap.png]]

### Thunder Clap

- Available for [[Arms | Fighter---Arms]]/[[Fury | Barbarian---Fury]]/[[Mountain Thane | Barbarian---Mountain-Thane]]/[[Protection | Fighter---Protection]] Level 3+
- Costs 1 [[Action]]
- [[CON]] [[Saving Throw]] ([[Weapon Action DC]]); affects enemies within 3m
- Deals [2](## 'Proficiency Bonus')d6 [[Thunder Damage]], or half on a successful save; [[Prone]] lasts 1 turn
- {{ get .loca "h1b63a656g6499g4b52g91f6g758d6e5adbff" | include "wikify" }}

![[Game/ControllerUIIcons/skills_png/Action_Slash.png]]

### Wild Strike

- Available for [[Fury | Barbarian---Fury]] Level 3+
- Costs 1 [[Bonus Action]]
- Requires an off-hand weapon
- {{ getf .loca "h769dce28g69f7g46f1g9cafg69714b51c3d1" | include "wikify" }}

![[Game/ControllerUIIcons/skills_png/Action_Multiattack_WhirlwindAttack.png]]

### Whirlwind

- Available for [[Arms | Fighter---Arms]]/[[Fury | Barbarian---Fury]]/[[Mountain Thane | Barbarian---Mountain-Thane]]/[[Protection | Fighter---Protection]] Level 3+
- Costs 1 [[Action]]
- 2m-radius weapon attack
- {{ get .loca "ha331a835gf3c8g4043gaa9ag68646d8ff4ac" | include "wikify" }}

![[Game/ControllerUIIcons/skills_png/Action_HeartStopper.png]]

### Slam

- Available for [[Arms | Fighter---Arms]] Level 5+
- Costs 1 [[Action]] and is not valid for [[Extra Attack]]
- Melee weapon attack
- {{ get .loca "hb8420ca7g0e1eg4618g9e6cg45c751959a04" | include "wikify" }}
- {{ get .loca "h2417a761gd0bag41e9gb829g965399bdb815" | include "wikify" }}

![[images/ControllerIcons/skills_png/Action_Warrior_LightningStrike.png]]

### Lightning Strike

- Available for [[Mountain Thane | Barbarian---Mountain-Thane]] Level 6+
- Costs 1 [[Action]]; 9m range, 2m radius; electrifies surfaces in the area
- [[DEX]] [[Saving Throw]] ([[Weapon Action DC]])
- Deals [3](## 'Proficiency Bonus')d6 [[Lightning Damage]]; a successful save takes half damage
- {{ get .loca "h031e5358gcd22g4a2cg9793ga54ebd8d3c40" | replace "**Avatar**" "[[Avatar | Barbarian---Mountain-Thane#Avatar (Replaces Rage)]]" | include "wikify" }}

![[Game/ControllerUIIcons/skills_png/Action_AbsolutePower.png]]

### Storm Bolt

- Available for [[Fury | Barbarian---Fury]]/[[Mountain Thane | Barbarian---Mountain-Thane]] Level 6+, [[Arms | Fighter---Arms]]/[[Protection | Fighter---Protection]] Level 7+
- Costs 1 [[Action]]
- [[CON]] [[Saving Throw]] ([[Weapon Action DC]]), 9m range
- Deals [3](## 'Proficiency Bonus')d6 [[Lightning Damage]]; a successful save takes half damage
- {{ get .loca "ha0bbee44gedc3g403cga8dage3fb613e51c1" | include "wikify" }}

![[Game/ControllerUIIcons/skills_png/Action_PostureBreaker.png]]

### Colossus Smash

- Available for [[Arms | Fighter---Arms]] Level 7+
- Costs 1 [[Action]]
- Melee weapon attack and [[CON]] [[Saving Throw]] ([[Weapon Action DC]])
- {{ get .loca "hb02ee329g9da8g4fd5gae11gaf2c0a60680c" | include "wikify" }}

![[images/ControllerIcons/skills_png/Action_Warrior_Avatar.png]]

### Avatar

- Available for [[Fury | Barbarian---Fury]] Level 6+, [[Arms | Fighter---Arms]]/[[Protection | Fighter---Protection]] Level 7+
- Costs 1 [[Bonus Action]]
- Once per [[Long Rest]]
- {{ getf .loca "hd4ca0144gf369g49b2gbf52g021b966ab445" "10" | include "wikify" }}

![[images/ControllerIcons/skills_png/Action_Warrior_Bladestorm.png]]

### Bladestorm

- Available for [[Fury | Barbarian---Fury]] Level 6+, [[Arms | Fighter---Arms]] Level 7+
- Costs 1 [[Bonus Action]]
- Once per [[Long Rest]]
- {{ get .loca "h6233e85cg8493g413ag8aa5g643a5fe66e9d" | include "wikify" }}

![[images/ControllerIcons/skills_png/Action_Warrior_Recklessness.png]]

### Recklessness

- Available for [[Fury | Barbarian---Fury]] Level 6+
- Costs 1 [[Bonus Action]]
- Once per [[Long Rest]]
- {{ getf .loca (ternary "h5e1cc5b2ga7c0g4cfcga39bg779a5c1681ba" "hb02d2a55gb259g4629ga232ga4e0fd8b8751" $.Values.FuryRevamp) "10" | replace "Reckless Attack" "[[Reckless Attack]]" | include "wikify" }}

![[images/ControllerIcons/skills_png/Action_Warrior_Dreadnaught.png]]

### Dreadnaught

- Available for [[Arms | Fighter---Arms]] Level 9+
- Costs 1 [[Action]]; melee weapon attack in a 6m line
- {{ get .loca "hfb995496ge8eeg4b40gaec5g2f7563b8565a" | include "wikify" }}
