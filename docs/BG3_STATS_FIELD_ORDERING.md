# BG3 Generated Stats Field Ordering

This document records an empirical analysis of field ordering in Baldur's Gate 3's unpacked generated stats files. It is intended to guide formatters, generators, reviews, and hand-authored `SpellData`, `PassiveData`, `StatusData`, and related records.

## Conclusion

The base game uses consistent field ordering, but the ordering key is not always the top-level stats schema:

- `SpellData` has a distinct order for each `SpellType`.
- `StatusData` has a distinct order for each `StatusType`.
- `PassiveData`, `Weapon`, `Armor`, `Object`, `Character`, and `InterruptData` each have one consistent observed order.
- `Stats/Generated/Structure/Modifiers.txt` defines valid fields and value types, but its mostly alphabetical field order is not the order used in generated data.

The ordering appears to be a deterministic authoring or export convention. This analysis does not establish that field order affects runtime behavior.

## Data set and method

The analysis parsed every record in the unpacked:

```text
Public/<Module>/Stats/Generated/Data/*.txt
```

The examined modules were:

- `Shared`
- `SharedDev`
- `Gustav`
- `GustavDev`
- `Honour`
- `GustavX`
- `HonourX`

The unpack contained no applicable generated stats records under the available patch package.

In total, the analysis covered:

| Schema | Records | Distinct fields |
| --- | ---: | ---: |
| `SpellData` | 4,806 | 158 |
| `StatusData` | 4,692 | 90 |
| `PassiveData` | 1,879 | 27 |
| `Object` | 1,749 | 50 |
| `Character` | 1,598 | 52 |
| `Armor` | 963 | 38 |
| `Weapon` | 561 | 44 |
| `InterruptData` | 344 | 24 |
| `CriticalHitTypeData` | 1 | 13 |

There were 16,593 records across 136 generated-data text files.

For each group, every pair of fields that occurred in the same record was compared. A group has a conflicting pair if one record places field `A` before field `B`, while another record in the same group places `B` before `A`.

No field was assigned more than once in any analyzed record.

## Record directive order

The record headers are fully consistent.

### SpellData

All 4,806 spell records place `SpellType` before inheritance and every other data field:

```text
new entry "Target_Example"
type "SpellData"
data "SpellType" "Target"
using "Target_Parent"
data "Level" "1"
```

When `using` is absent, `SpellType` remains the first `data` field.

### StatusData

All 4,692 status records use the equivalent structure:

```text
new entry "EXAMPLE_STATUS"
type "StatusData"
data "StatusType" "BOOST"
using "PARENT_STATUS"
data "DisplayName" "..."
```

### Other schemas

Schemas without a discriminator place `using`, when present, immediately after `type`:

```text
new entry "ExamplePassive"
type "PassiveData"
using "ParentPassive"
data "DisplayName" "..."
```

This pattern held for every analyzed `PassiveData`, `Weapon`, `Armor`, `Object`, `Character`, and `InterruptData` record.

## SpellData ordering

There is no single global order for all `SpellData`.

When all 4,806 spell records are combined, 213 co-occurring field pairs appear in both relative orders. When records are separated by `SpellType`, every conflict disappears:

| `SpellType` | Records | Distinct fields | Conflicting pairs |
| --- | ---: | ---: | ---: |
| `Target` | 2,552 | 93 | 0 |
| `Shout` | 1,092 | 76 | 0 |
| `Projectile` | 906 | 94 | 0 |
| `Zone` | 153 | 74 | 0 |
| `Throw` | 34 | 54 | 0 |
| `Rush` | 21 | 49 | 0 |
| `Teleportation` | 20 | 45 | 0 |
| `ProjectileStrike` | 17 | 51 | 0 |
| `Wall` | 11 | 43 | 0 |

Every spell record is therefore a subsequence of a stable order for its concrete `SpellType`.

### Evidence against one global SpellData order

`Target_LOW_HagSurvivor_Bloodlust` in:

```text
Gustav/Public/GustavDev/Stats/Generated/Data/Spell_Target.txt
```

places:

```text
RequirementConditions
TargetConditions
```

In contrast, `Zone_LOW_Fear_Cazador_Ritualist` in:

```text
Gustav/Public/GustavDev/Stats/Generated/Data/Spell_Zone.txt
```

places:

```text
TargetConditions
RequirementConditions
```

Neither violates its own spell family's order.

### Target order

The inferred `Target` order is:

```text
SpellType
Level
SpellSchool
SpellContainerID
ContainerSpells
ConcentrationSpellID
Cooldown
AIFlags
SpellProperties
TargetCeiling
TargetFloor
TargetRadius
AreaRadius
DeathType
Requirements
RequirementConditions
SpellRoll
RequirementEvents
SpellSuccess
SpellFail
TargetConditions
AoEConditions
AmountOfTargets
Icon
DisplayName
Description
DescriptionParams
ExtraDescription
ExtraDescriptionParams
ShortDescription
ShortDescriptionParams
TooltipDamageList
TooltipAttackSave
TooltipStatusApply
TooltipOnMiss
TooltipOnSave
TooltipUpcastDescription
TooltipUpcastDescriptionParams
TooltipPermanentWarnings
PrepareSound
PrepareLoopSound
CastSound
TargetSound
VocalComponentSound
PreviewCursor
CastTextEvent
InstrumentComponentPrepareSound
InstrumentComponentLoopingSound
InstrumentComponentCastSound
AlternativeCastTextEvents
InstrumentComponentImpactSound
CycleConditions
Autocast
AiCalculationSpellOverride
UseCosts
DualWieldingUseCosts
HitCosts
RitualCosts
SpellAnimation
DualWieldingSpellAnimation
VerbalIntent
SpellStyleGroup
WeaponTypes
SpellFlags
MaximumTotalTargetHP
RechargeValues
SpellActionType
SpellAnimationType
SpellCategory
HitAnimationType
SpellAnimationIntentType
MaximumTargets
SourceLimbIndex
MemoryCost
RootSpellID
LineOfSightFlags
PowerLevel
PrepareEffect
CastEffect
TargetEffect
HitEffect
PositionEffect
BeamEffect
DamageType
SpellSoundMagnitude
InterruptPrototype
Sheathing
CombatAIOverrideSpell
TooltipSpellDCAbilities
FollowUpOriginalSpell
SteerSpeedMultipler
DisappearEffect
HighlightConditions
```

This is one valid total ordering consistent with all observed `Target` records. It is not fully proven for every pair: 98 of the 4,278 possible field pairs never coexist and cannot be ordered from the unpack alone.

### Projectile order

The inferred `Projectile` order is:

```text
SpellType
Level
SpellSchool
ConcentrationSpellID
SpellContainerID
ContainerSpells
Cooldown
AIFlags
SpellProperties
TargetCeiling
TargetFloor
TargetRadius
AreaRadius
DeathType
AddRangeFromAbility
ExplodeRadius
AmountOfTargets
SpellRoll
SpellSuccess
SpellFail
TargetConditions
ExtraProjectileTargetConditions
ProjectileCount
CastTargetHitDelay
Angle
Trajectories
Icon
DisplayName
Description
DescriptionParams
ExtraDescription
ExtraDescriptionParams
TooltipDamageList
TooltipAttackSave
TooltipStatusApply
TooltipOnMiss
TooltipOnSave
TooltipUpcastDescription
TooltipUpcastDescriptionParams
PrepareSound
PrepareLoopSound
TooltipPermanentWarnings
CastSound
VocalComponentSound
PreviewCursor
CastTextEvent
ProjectileTerrainOffset
AlternativeCastTextEvents
ProjectileType
CycleConditions
UseCosts
DualWieldingUseCosts
HitCosts
SpellAnimation
DualWieldingSpellAnimation
VerbalIntent
SpellStyleGroup
WeaponTypes
SpellFlags
SpellActionType
SpellCategory
HitAnimationType
SourceLimbIndex
SpellAnimationIntentType
RechargeValues
ForkChance
MaxForkCount
ForkLevels
ForkingConditions
SpellJumpType
MinJumpDistance
Requirements
MemoryCost
RootSpellID
RequirementConditions
RequirementEvents
PowerLevel
PrepareEffect
CastEffect
TargetEffect
HitEffect
TargetHitEffect
TargetGroundEffect
PositionEffect
SpellEffect
BeamEffect
ImpactEffect
DamageType
SpellSoundMagnitude
Sheathing
CombatAIOverrideSpell
TooltipSpellDCAbilities
MaximumTargets
FollowUpOriginalSpell
```

There are 65 empirically incomparable pairs among the 4,371 possible `Projectile` field pairs.

### Other SpellTypes

The other spell families also have conflict-free internal orders, but some have relatively few records. Their ordering evidence should therefore be treated as weaker:

- `ProjectileStrike`: 17 records
- `Rush`: 21 records
- `Teleportation`: 20 records
- `Throw`: 34 records
- `Wall`: 11 records

For a formatter, derive or preserve a separate order for each of these families rather than falling back to the `Target` or `Projectile` order.

## PassiveData ordering

All 1,879 passive records are consistent with this inferred order:

```text
DisplayName
Description
DescriptionParams
ExtraDescription
ExtraDescriptionParams
LoreDescription
TooltipUseCosts
TooltipSave
TooltipConditionalDamage
TooltipPermanentWarnings
Icon
EnabledConditions
EnabledContext
PriorityOrder
Properties
BoostContext
BoostConditions
Boosts
StatsFunctorContext
Conditions
StatsFunctors
ToggleOnFunctors
ToggleOffFunctors
ToggleOnEffect
ToggleOffContext
ToggleGroup
DynamicAnimationTag
```

Only 10 of 351 possible field pairs are empirically incomparable. Most involve the rarely used `DynamicAnimationTag`; `PriorityOrder` also never co-occurs with both enabled-condition fields in enough combinations to prove its exact position relative to them.

## StatusData ordering

There is no single global order for all `StatusData`.

Combining all status types produces 39 conflicting field pairs. Separating records by `StatusType` removes every conflict:

| `StatusType` | Records | Distinct fields | Conflicting pairs |
| --- | ---: | ---: | ---: |
| `BOOST` | 3,726 | 68 | 0 |
| `POLYMORPHED` | 409 | 30 | 0 |
| `EFFECT` | 365 | 27 | 0 |
| `INCAPACITATED` | 124 | 48 | 0 |
| `INVISIBLE` | 20 | 25 | 0 |
| `KNOCKED_DOWN` | 20 | 29 | 0 |
| `DOWNED` | 15 | 30 | 0 |
| `FEAR` | 9 | 20 | 0 |
| `HEAL` | 2 | 7 | 0 |
| `DEACTIVATED` | 1 | 10 | 0 |
| `SNEAKING` | 1 | 10 | 0 |

The one- and two-record status types establish the order of their shipped records but provide limited evidence for a general serializer order.

### BOOST order

The inferred `BOOST` order is:

```text
StatusType
DisplayName
Description
DescriptionParams
Icon
StatusEffectOverrideForItems
MeshEffect
FormatColor
MaterialType
MaterialApplyBody
MaterialApplyArmor
MaterialApplyWeapon
StatusEffectOverride
MaterialApplyNormalMap
StillAnimationType
StillAnimationPriority
HitAnimationType
SoundVocalLoop
SoundVocalStart
SoundStart
SoundLoop
SoundStop
StatusSoundState
SoundVocalEnd
MaterialFadeAmount
OnApplyConditions
StackId
StackPriority
Toggle
StackType
WeaponOverride
AuraRadius
AuraStatuses
SurfaceChange
AuraFlags
TickType
Boosts
Passives
RemoveConditions
RemoveEvents
TooltipSave
TooltipDamage
TickFunctors
StatusPropertyFlags
OnApplyFunctors
OnApplyRoll
OnApplySuccess
OnApplyFail
OnRemoveFunctors
OnTickRoll
OnTickSuccess
OnTickFail
StatusGroups
IsUnique
ApplyEffect
StatusEffect
SplatterDirtAmount
SplatterBloodAmount
PerformEventName
StatusEffectOnTurn
ManagedStatusEffectType
TooltipPermanentWarnings
DynamicAnimationTag
ManagedStatusEffectGroup
EndEffect
Sheathing
BeamEffect
SplatterSweatAmount
```

There are 135 incomparable pairs among the 2,278 possible `BOOST` field pairs.

### EFFECT order

The inferred `EFFECT` order is:

```text
StatusType
DisplayName
Description
PlayerHasTag
PeaceOnly
Icon
FormatColor
SoundStart
SoundLoop
SoundStop
StackId
RemoveConditions
Boosts
TickType
TickFunctors
StatusPropertyFlags
SplatterBloodAmount
OnApplyFunctors
OnRemoveFunctors
RemoveEvents
ApplyEffect
StatusGroups
StatusEffect
SplatterDirtAmount
BeamEffect
SplatterSweatAmount
DynamicAnimationTag
```

There are 43 incomparable pairs among the 351 possible `EFFECT` field pairs.

Notably, `BOOST` normally places `RemoveEvents` before `StatusPropertyFlags`, while `EFFECT` places `RemoveEvents` after the apply/remove functors. This is one reason a global `StatusData` order fails.

## Other generated-data schemas

The following schemas had no conflicting co-occurring field pairs:

| Schema | Records | Co-occurring field pairs | Conflicting pairs |
| --- | ---: | ---: | ---: |
| `Weapon` | 561 | 412 | 0 |
| `Armor` | 963 | 366 | 0 |
| `Object` | 1,749 | 739 | 0 |
| `Character` | 1,598 | 1,173 | 0 |
| `InterruptData` | 344 | 232 | 0 |

These schemas can each use a single inferred ordering. As with the primary schemas, fields that never coexist are only partially ordered by the corpus.

## Modifiers.txt is a schema, not a formatting guide

The relevant schema definitions are in:

```text
Shared/Public/Shared/Stats/Generated/Structure/Modifiers.txt
```

Important starting lines in the analyzed unpack are:

| Schema | Line |
| --- | ---: |
| `Armor` | 1 |
| `Character` | 54 |
| `InterruptData` | 126 |
| `Object` | 163 |
| `PassiveData` | 219 |
| `SpellData` | 253 |
| `StatusData` | 459 |
| `Weapon` | 584 |

Most fields in this file are alphabetized after any leading discriminator. Generated records instead group identity, mechanics, targeting, presentation, costs, animation, and effects. Consequently:

- use `Modifiers.txt` to validate whether a field exists and what value type it accepts;
- do not use its sequence as the canonical generated-data field order.

For example, only 665 of 4,806 spell records happen to be subsequences of the `SpellData` sequence in `Modifiers.txt`.

## Formatter and generator guidance

Use the following lookup hierarchy:

```text
("SpellData", SpellType)   -> spell-family order
("StatusData", StatusType) -> status-family order
("PassiveData")            -> passive order
("Weapon")                 -> weapon order
("Armor")                  -> armor order
("Object")                 -> object order
("Character")              -> character order
("InterruptData")          -> interrupt order
```

Recommended behavior:

1. Emit `new entry` and `type` first.
2. For spells and statuses, emit `SpellType` or `StatusType` next.
3. Emit `using` immediately after the discriminator, or immediately after `type` for schemas without one.
4. Sort remaining fields with the applicable concrete-type ordering.
5. Preserve source order between fields whose relative order is not established.
6. Preserve an unknown field's source position when reformatting existing data.
7. When generating a new record and no placement is known, append the unknown field rather than inventing a semantic position.
8. Do not reorder semicolon-separated values inside a field merely because the outer fields are being sorted; those lists can have their own semantic ordering.

The safest representation of these findings in code is a partial-order constraint graph rather than an asserted total-order array. A stable topological sort can then retain source order for unconstrained fields.

## Interpretation limits

- A conflict-free order demonstrates a strong and consistent base-game convention; it does not prove that the engine requires that order.
- Some field pairs never occur together, so the unpack cannot establish their relative positions.
- Rare spell and status types have too few records to constrain all of their possible fields.
- `using` inheritance affects effective values but does not change the textual ordering analysis.
- Later game updates may add fields or records that constrain previously incomparable pairs.
- If the unpack is refreshed, rerun the analysis before treating these lists as exhaustive.
