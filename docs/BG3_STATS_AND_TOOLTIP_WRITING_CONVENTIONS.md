# BG3 Stats and Tooltip Writing Conventions

This document is a practical reference for writing `SpellData`, `PassiveData`, and `StatusData` entries that resemble Baldur's Gate 3's base-game data and player-facing text. It covers both the stats-file grammar and the localization markup used to produce formatted tooltips.

The findings are based primarily on the unpacked English data in:

- `bin/bg3-modders-multitool/UnpackedData/Shared/Public/Shared/Stats/Generated/Data`
- `bin/bg3-modders-multitool/UnpackedData/Shared/Public/SharedDev/Stats/Generated/Data`
- `bin/bg3-modders-multitool/UnpackedData/Gustav/Public/Gustav/Stats/Generated/Data`
- `bin/bg3-modders-multitool/UnpackedData/Gustav/Public/GustavDev/Stats/Generated/Data`
- `bin/bg3-modders-multitool/UnpackedData/English/Localization/English/english.loca.xml`

It was cross-checked against Larian's [Making a Basic Spell](https://docs.baldursgate3.game/Making_a_Basic_Spell) guide. The empirical counts below describe references found in the unpacked stats, not necessarily unique strings: several entries intentionally reuse the same localization handle, and Shared/SharedDev contain some parallel definitions.

## 1. Stats-file grammar

### Basic record structure

Generated stats records use four top-level directives:

```text
new entry "Target_Example"
type "SpellData"
using "Target_ParentSpell"
data "DisplayName" "h00000000g0000g0000g0000g000000000000"
data "Description" "h11111111g1111g1111g1111g111111111111"
```

- `new entry` starts a record and supplies its unique technical name.
- `type` selects the stats schema, such as `SpellData`, `PassiveData`, or `StatusData`.
- `using` names a parent record. It is optional and causes unspecified values to be inherited.
- `data` assigns a value to a schema field.

Base-game generated files keep all four directives at column zero. Entries are normally separated by a blank line. Fields are quoted even when their contents are numeric, Boolean-like, an enum, or a list.

The familiar technical-name pattern is descriptive rather than syntactically mandatory:

```text
Target_MenacingAttack
Projectile_Fireball
Shout_ActionSurge
Zone_ConeOfCold
Interrupt_Parry
```

The prefix generally agrees with `SpellType`, but inheritance and specialized spell families produce exceptions. Prefer a correct, searchable name over imitating an exception.

### Inheritance and overrides

Treat `using` as semantic inheritance, not textual inclusion. A child needs to state only values that differ from the resolved parent.

```text
new entry "Target_Example"
type "SpellData"
using "Target_MainHandAttack"
data "DisplayName" "..."
data "Description" "..."
data "SpellSuccess" "..."
```

Important consequences:

- Repeating an inherited value is usually harmless but makes future auditing harder.
- An explicitly empty value normally clears the inherited value.
- List-like strings are frequently replaced, not merged. For example, assigning `SpellFlags` or `SpellSuccess` generally replaces the parent's whole field.
- Always inspect the complete `using` chain before deciding that a field is missing.

### Lists, functors, and conditions

Semicolons usually separate peer expressions:

```text
data "UseCosts" "ActionPoint:1;SuperiorityDie:1"
data "SpellSuccess" "DealDamage(1d8,Fire);ApplyStatus(BURNING,100,2)"
data "SpellFlags" "IsAttack;IsMelee;IsHarmful"
```

Conditions use a Boolean expression grammar:

```text
data "TargetConditions" "Character() and not Self() and not Dead()"
```

Common style in shipped data includes:

- Lowercase `and`, `or`, and `not`.
- Parentheses where mixed operators or contextual clauses would otherwise be ambiguous.
- Enum values qualified when the function expects them, such as `Ability.Strength` or `AttackType.MeleeWeaponAttack`.
- Context expressions such as `context.Source` and `context.Target` when the implicit evaluation subject is insufficient.
- No requirement for spaces after commas; the base game contains both compact and spaced forms. Within a new record, be consistent.

Functor expressions are player mechanics, not player-facing prose. They do not accept localization markup. Tooltip fields translate the mechanics into UI elements.

## 2. Player-facing fields and their responsibilities

The base game separates prose, substituted values, and structured tooltip rows. Avoid asking one field to do all three jobs.

### `DisplayName`

`DisplayName` is a translated-string handle for the title shown to the player.

Base-game naming style is title case:

```text
Fireball
Savage Attacker
Great Weapon Master: Bonus Attack
Menacing Attack (Melee)
```

Conventions:

- Use a parenthetical suffix for mechanically distinct variants such as `(Melee)` and `(Ranged)`.
- Use a colon when the entry is a named subfeature of a larger feature.
- Do not put an `<LSTag>` around the display name itself.
- A spell and the status it applies may intentionally share a display name when they represent the same named effect.

### `Description`

`Description` is the principal translated prose. It should explain purpose, targeting, important conditions, and effects that are not already obvious from the structured rows.

Larian's official guide recommends not hard-coding variable damage or healing values in this text. Use `[1]`, `[2]`, and so on, backed by `DescriptionParams`.

Base-game practice is somewhat pragmatic rather than absolute:

- Scaling, rolled, distance, duration, and resource values are commonly parameters.
- Small invariant rule constants are sometimes written directly, such as Haste's `+2` Armour Class.
- Damage already presented in `TooltipDamageList` is often omitted from the prose entirely.
- The description does not normally restate “make an attack” when the attack row, range, weapon requirement, and damage row already communicate it.

### `DescriptionParams`

`DescriptionParams` supplies values for one-based placeholders in the localized description:

```text
data "Description" "... [1] ... [2] ..."
data "DescriptionParams" "Distance(3);2"
```

- `[1]` maps to the first semicolon-separated parameter, `[2]` to the second, and so on.
- Parameters may be raw values or tooltip expressions such as `Distance(3)`, `DealDamage(...)`, or `RegainHitPoints(...)`.
- Keep the parameter order synchronized with the prose. The engine cannot infer a reordered translation.
- Do not put an extra parameter into the prose as a literal merely because it is easier in English; that makes localization and later scaling harder.
- Some base entries contain a trailing semicolon. It is accepted, but new entries should omit it unless an empty parameter is intentional.

Example from Thunderous Smite:

```text
Description:       Pushes your target [1] away and possibly knocks it Prone.
DescriptionParams: Distance(3)
```

### `ExtraDescription` and `ExtraDescriptionParams`

These provide a secondary prose block for an important caveat, secondary mode, prerequisite, or explanatory rule that should not crowd the main sentence.

Sneak Attack is a representative pattern:

- Main description: the primary benefit.
- Extra description: the alternate ally-within-range condition.
- Extra parameter: the required distance.

Use this split when the first sentence remains useful on its own and the additional rule is genuinely secondary. Do not use it merely to avoid editing a long sentence.

### `ShortDescription` and `ShortDescriptionParams`

These are used by schemas and UI contexts that need a condensed description. They are less common in ordinary action records. If an inherited entry already has a short description, check whether the child still describes the same effect; stale inherited short text is easy to miss.

### `TooltipDamageList`

This is parsed mechanical data, not prose and not localization markup:

```text
data "TooltipDamageList" "DealDamage(MainMeleeWeapon, MainMeleeWeaponDamageType);DealDamage(2d6,Thunder)"
```

It produces formatted damage/healing rows, dice icons, damage types, and calculated values. It may intentionally differ from the executable functor syntax—for example, the official guide omits the executable `Magical` argument in its tooltip `DealDamage` expression.

Prefer this field over manually writing rolled damage in `Description`.

### `TooltipAttackSave`

This is a semicolon-separated structured summary:

```text
data "TooltipAttackSave" "MeleeWeaponAttack;Strength"
```

Common values include:

- `MeleeWeaponAttack`
- `RangedWeaponAttack`
- an ability such as `Strength`, `Dexterity`, or `Wisdom`
- an attack type followed by a save ability when both occur

Do not add `<LSTag>` markup here. The UI supplies the labels and formatting.

### `TooltipStatusApply`

This displays status application and duration through parsed functor syntax:

```text
data "TooltipStatusApply" "ApplyStatus(FRIGHTENED,100,2)"
```

Use it when a status is a central, visible result. It lets the status supply its own name, icon, description, and hover tooltip instead of duplicating all status rules in the action description.

Conditional status durations cannot always be fully expressed by one static tooltip row. In those cases:

- Show the guaranteed/default application in `TooltipStatusApply`.
- Explain the conditional extension in prose.
- Ensure the status description explains what the status itself does, not how this particular action applied it.

### Other related fields

- `TooltipOnMiss` generally points to a predefined tooltip warning UUID rather than localized prose.
- `TooltipPermanentWarnings` similarly supplies reusable warnings, such as a once-per-rest limitation.
- `TooltipUpcastDescription` and its parameter field describe changes from upcasting rather than repeating the base effect.
- Status `DescriptionParams` are particularly useful for damage-per-turn and variable bonuses.

## 3. Voice and grammar by entry type

The localized corpus contains approximately 2,251 spell description references, 1,444 passive/extra-description references, and 1,973 status description references in the selected base-game stats. Around 86% of action descriptions, 87% of passive descriptions, and 86% of status descriptions end in a period. New gameplay text should normally do the same.

### Actions and spells: imperative and outcome-focused

Action descriptions usually begin with a command or the immediate result:

```text
Shoot a bright flame from your fingers that explodes upon contact, torching everything in the vicinity.

Possibly knock your enemy Prone.

Deal extra damage to a foe you have Advantage against.

Pushes your target [1] away and possibly knocks it Prone.
```

Patterns:

- Prefer a concise imperative: `Shoot`, `Strike`, `Deal`, `Target`, `Summon`, `Gain`.
- A result-led third-person construction (`Pushes your target...`) also occurs, especially when inherited or templated UI supplies the implied action.
- Use `Possibly` for a save-gated secondary effect when the structured save row provides the exact ability.
- Address the player as `you` and use `your target`; avoid tabletop-instruction phrasing such as “the attacking creature” unless rules precision requires it.
- Avoid introductory filler such as “You may use this action to...”.
- Avoid restating routine UI facts: melee range, action cost, weapon damage, and attack roll are normally visible elsewhere.

### Passives: conditional or declarative

Passives commonly use one of these shapes:

```text
When you land a Critical Hit or kill a target with a melee weapon attack, you can...

When making melee weapon attacks, you roll your damage dice twice and use the highest result.

Can make an additional free attack after making an unarmed or weapon attack.
```

Patterns:

- Lead with `When`, `Whenever`, `After`, `While`, or `If` when there is a trigger.
- Use present tense.
- State the benefit after the condition.
- `You` is preferred when the passive belongs to the player; subjectless `Can...` appears in terse class-feature descriptions.
- If a passive unlocks or modifies a named action, link that action with `Type="Spell"` rather than describing an unlinked name.

### Statuses: describe the bearer, usually with an omitted subject

Statuses are normally terse state descriptions:

```text
Takes [1] per turn.

Cannot move. Frightened entities also have Disadvantage on Ability Checks and Attack Rolls.

Has Disadvantage on Wisdom Saving Throws, can't take reactions, and loses the Dexterity bonus to their Armour Class.
```

Patterns:

- The implicit subject is the affected entity: `Takes`, `Has`, `Cannot`, `Gains`, `Deals`.
- Use present tense and describe only the current condition.
- Do not repeat the status name as a sentence subject unless it improves clarity.
- Removal instructions follow the mechanics after a double line break: `<br><br>Removed by healing.`
- Complex statuses split independent rule groups with `<br><br>`.
- Use the status description for the actual modifier (`Armour Class reduced by 5.`), while the applying action explains duration and saving-throw logic.

### Capitalization and terminology

Base-game English capitalizes formal UI/rules terms when they are presented as such:

```text
Attack Roll / Attack Rolls
Saving Throw / Saving Throws
Ability Check / Ability Checks
Armour Class
Critical Hit
Long Rest / Short Rest
Advantage / Disadvantage
```

The visible text inside a tag can be inflected or lowercased to fit the sentence. For example, an `ActionResource` link to `BonusActionPoint` may display as `bonus action`.

Use BG3's British-English presentation where the game does: `Armour Class`, not `Armor Class`. The internal tooltip key is also spelled `ArmourClass` in the English base-game localization.

Contractions are normal (`can't`, `they'll`, `don't`). They often make status and action text more compact.

## 4. Localization XML and special formatting

### Handles and XML encoding

Localization entries look like this:

```xml
<content contentuid="h297f1716g8822g481fgb2bcg6c7a0f6f757c" version="2">Fireball</content>
```

Conventions:

- A generated handle is `h` followed by a UUID whose hyphens have been replaced with `g`.
- The stats field may append a translated-string version suffix, such as `;2`.
- The localization node has its own numeric `version` attribute.
- Markup inside `.loca.xml` content must be XML-escaped: write `&lt;LSTag ...&gt;`, not a literal `<LSTag ...>`.
- Ordinary XML characters must also be escaped (`&amp;`, `&lt;`, and so on).

### Implicit glossary tooltips

The most common gameplay tag links visible prose to a glossary/rules tooltip:

```xml
&lt;LSTag Tooltip="AttackRoll"&gt;Attack Roll&lt;/LSTag&gt;
&lt;LSTag Tooltip="SavingThrow"&gt;Saving Throws&lt;/LSTag&gt;
&lt;LSTag Tooltip="ArmourClass"&gt;Armour Class&lt;/LSTag&gt;
&lt;LSTag Tooltip="Advantage"&gt;Advantage&lt;/LSTag&gt;
```

No `Type` is needed for ordinary glossary concepts. The `Tooltip` key is case-sensitive in practice; copy it from base-game localization rather than deriving it from the displayed words.

Frequently used exact keys include:

| Visible concept | Tooltip key |
|---|---|
| Attack Roll(s) | `AttackRoll` |
| Saving Throw(s) | `SavingThrow` |
| Ability Check(s) | `AbilityCheck` |
| Armour Class | `ArmourClass` |
| Advantage | `Advantage` |
| Disadvantage | `Disadvantage` |
| Critical Hit | `CriticalHit` |
| Hit Points | `HitPoints` |
| Temporary Hit Points | `TemporaryHitPoints` |
| Movement Speed | `MovementSpeed` |
| Proficiency Bonus | `ProficiencyBonus` |
| Long Rest | `LongRest` |
| Short Rest | `ShortRest` |
| Resistance / Resistant | `Resistant` |
| Vulnerability / Vulnerable | `Vulnerable` |
| Immunity / Immune | `Immune` |

Do not assume that singular/plural visible text changes the key. The base game uses `SavingThrow` for both “Saving Throw” and “Saving Throws.”

### Links to concrete game objects

Use a typed tag when the hover should resolve a specific stats object:

```xml
&lt;LSTag Type="Status" Tooltip="PRONE"&gt;Prone&lt;/LSTag&gt;
&lt;LSTag Type="Spell" Tooltip="Target_Help"&gt;Help&lt;/LSTag&gt;
&lt;LSTag Type="Passive" Tooltip="Darkvision"&gt;Darkvision&lt;/LSTag&gt;
&lt;LSTag Type="ActionResource" Tooltip="BonusActionPoint"&gt;bonus action&lt;/LSTag&gt;
```

Use the technical name in `Tooltip`, not the localized display name.

The main gameplay types found in base localization are:

- `Status`: a `StatusData` technical name.
- `Spell`: an action/spell technical name, including nonmagical actions.
- `Passive`: a `PassiveData` technical name.
- `ActionResource`: an action-resource definition name.

Do not use `Type="Status"` merely to color a word that happens to resemble a condition. It should resolve to a real status entry.

### Other `LSTag` forms

These exist but are uncommon in ordinary action/passive/status descriptions:

- `Type="Image" Info="..."`: embeds a tutorial/controller/UI image. It is usually self-closing.
- `Type="Tooltip"`: explicit generic-tooltip form, found mainly in tutorial prose. Ordinary gameplay prose uses the implicit form.
- `Type="Damage"`: wraps computed damage in specialized UI strings.
- `Type="Skills"`: explicit skill links, chiefly tutorial content.
- `Type="Text"`: specialized UI text treatment.

For normal modded gameplay tooltips, implicit glossary tags plus `Status`, `Spell`, `Passive`, and `ActionResource` cover almost every need.

### Line breaks and emphasis

Supported markup observed in the English localization includes:

- `&lt;br&gt;` for a line break.
- `&lt;br&gt;&lt;br&gt;` for a paragraph-like break.
- `&lt;i&gt;...&lt;/i&gt;` for italic text.
- `&lt;b&gt;...&lt;/b&gt;` for bold text.
- `&lt;hl&gt;...&lt;/hl&gt;` for highlighting.

Most `<i>` and `<b>` usage belongs to dialogue, books, warnings, or UI copy rather than ordinary combat tooltips. Prefer semantic `LSTag` links to manual emphasis. Use double breaks for genuinely separate status rules or removal instructions, not after every sentence.

### Placeholders versus input tokens

Numeric placeholders are one-based description parameters:

```text
[1] [2] [3] [4]
```

Named bracket tokens such as `[IE_ToggleSpells]` are input/UI substitutions, not `DescriptionParams`. They are common in tutorials but generally inappropriate for spell, passive, and status descriptions.

## 5. Representative base-game patterns

### Simple damaging action

Fireball keeps damage out of its prose:

```text
Description:       Shoot a bright flame from your fingers that explodes upon contact, torching everything in the vicinity.
TooltipDamageList: DealDamage(8d6,Fire)
TooltipAttackSave: Dexterity
```

### Save-gated weapon action

Backbreaker uses minimal prose and lets structured fields carry the details:

```text
Description:        Possibly knock your enemy <Status:PRONE>Prone</Status>.
TooltipDamageList:  DealDamage(...)
TooltipAttackSave:  MeleeWeaponAttack;Strength
TooltipStatusApply: ApplyStatus(PRONE,100,2)
```

### Action with a substituted distance

```text
Description:       Pushes your target [1] away and possibly knocks it <Status:PRONE>Prone</Status>.
DescriptionParams: Distance(3)
```

### Triggered passive

```text
When you land a <CriticalHit>Critical Hit</CriticalHit> or kill a target with a
<MeleeWeaponAttack>melee weapon attack</MeleeWeaponAttack>, you can make another
melee weapon attack as a <ActionResource:BonusActionPoint>bonus action</ActionResource>
that turn.
```

### Status with mechanics and removal clause

```text
Takes [1] at the start of each turn and has Disadvantage on Constitution Saving Throws.

Removed by healing.
```

In actual `.loca.xml`, the blank line above is encoded as `&lt;br&gt;&lt;br&gt;` and the rules concepts are `LSTag` elements.

## 6. A practical authoring checklist

Before considering a tooltip complete:

1. Resolve the entire `using` chain and remove accidental redundant overrides.
2. Give the action, passive, and any visible status their own appropriate player-facing text.
3. Put rolled/scaling damage in `TooltipDamageList` rather than prose.
4. Put attacks and saves in `TooltipAttackSave` rather than spelling out DC mechanics.
5. Put visible status application in `TooltipStatusApply`.
6. Use `[n]` plus `DescriptionParams` for variable values, distances, durations, and dice expressions.
7. Write actions as concise imperatives, passives as conditional/declarative rules, and statuses as present-state fragments.
8. End normal gameplay descriptions with a period.
9. Tag formal rules concepts and named game objects with exact base-game tooltip keys.
10. Use `ArmourClass` and `SavingThrow`, matching base-game spelling and casing.
11. Use `Type="Status"`, `Spell`, `Passive`, or `ActionResource` only when linking an actual technical entry.
12. XML-escape every markup tag in `.loca.xml`.
13. Avoid duplicating structured rows in prose unless a conditional interaction cannot be represented there.
14. Test nested hovers in game; a syntactically valid `LSTag` can still point at the wrong technical object.

## 7. Recommended pattern for Colossus Smash

For an action that always lowers Armour Class on hit and conditionally extends the duration after a Strength save, a base-game-like division is:

```text
DisplayName: Colossus Smash

Description:
Smash through a creature's defences, reducing its Armour Class by 5 until the end
of your turn. If it fails a Strength Saving Throw, the reduction lasts until the
end of your next turn instead.

TooltipDamageList:
DealDamage(MainMeleeWeapon, MainMeleeWeaponDamageType)

TooltipAttackSave:
MeleeWeaponAttack;Strength

TooltipStatusApply:
ApplyStatus(COLOSSUS_SMASH,100,1)

Status description:
Armour Class reduced by 5.
```

The localized rules terms should be encoded as:

```xml
&lt;LSTag Tooltip="ArmourClass"&gt;Armour Class&lt;/LSTag&gt;
&lt;LSTag Tooltip="SavingThrow"&gt;Saving Throw&lt;/LSTag&gt;
```

This wording omits “Make a melee weapon attack against a creature” because the attack/save row, weapon damage row, targeting, and melee presentation already show that information. It uses an imperative opening and gives the action some identity while retaining the full conditional-duration rule that the structured tooltip cannot express by itself.
