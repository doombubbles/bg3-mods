# Searching BG3 Base-Game Data

This guide is for LLMs and humans investigating base-game Baldur's Gate 3 data while working in this repository. Prefer the local unpacked files as the source of truth, use the repository's mods as working examples, and use public web indexes mainly for discovery or cross-checking.

## Local data location

From the repository root, the unpacked game data is at:

```text
bin/bg3-modders-multitool/UnpackedData
```

PowerShell setup:

```powershell
$U = Join-Path $PWD 'bin\bg3-modders-multitool\UnpackedData'
```

Important: `bin/` is ignored by Git, so Ripgrep respects the ignore rule and silently skips `UnpackedData` unless `--no-ignore` is supplied.

```powershell
# Correct
rg --no-ignore -n -F 'Projectile_FireBolt' $U

# Usually returns nothing because bin/ is ignored
rg -n -F 'Projectile_FireBolt' $U
```

Always quote paths because this repository's absolute path contains spaces.

## Search strategy

Use this sequence instead of starting with an unrestricted search:

1. Identify the kind of identifier: stats entry, UUID, localization handle, root template, icon, visual, spell list, status, VFX, script symbol, and so on.
2. Search the most likely package and file type first.
3. Find the defining record, not only references to it.
4. Follow its links into the other data layers.
5. Check later packages and patches for overrides.
6. Compare a nearby base-game example and an established example in this repo before editing.

Use fixed-string searches (`-F`) for IDs, UUIDs, handles, paths, and exact property values. Use regex only when matching structure such as `new entry` or an LSX attribute.

```powershell
rg --no-ignore -n -F 'MAG_LEGENDARY_CHROMATIC_ATTUNEMENT_FIRE' $U
rg --no-ignore -n '^new entry "Projectile_FireBolt"$' $U -g '*.txt'
```

Avoid searching binary `.lsf` files when a converted `.lsf.lsx` or `.lsx` sibling exists. `rg` is useful for textual `.txt`, `.lsx`, `.xml`, `.lsfx`, `.khn`, and script files; it is not a parser for `.lsf`, `.gr2`, `.dds`, or other binaries.

## Package and override order

The important package families in this unpack are:

- `Shared`: general 5e systems and most common spells, statuses, passives, weapons, armor, classes, races, lists, and shared templates.
- `Gustav`: campaign-specific records, items, characters, spells, statuses, and world data.
- `GustavX`: expansion/later campaign content and overrides.
- `Game`: UI, client data, scripts, icons, and other engine-facing resources.
- `English`: English localization.
- `Assets`, `Models`, and `Icons`: binary visual resources and their metadata.
- `Patch*` and `Patch*_Hotfix*`: later overrides. A matching entry here can supersede an earlier `Shared`, `Gustav`, or `GustavX` definition.

Do not assume the first match is effective. When an entry appears more than once, compare all definitions and prefer the latest applicable patch/package. Also check the directory dates: this workspace may contain packages unpacked at different times. If current-game accuracy matters and data looks inconsistent, refresh the Multitool unpack/index.

Useful broad package check:

```powershell
rg --no-ignore -n '^new entry "Target_MistyStep"$' `
  "$U\Shared" "$U\Gustav" "$U\GustavX" "$U\Patch*" -g '*.txt'
```

PowerShell does not expand a quoted wildcard path for every native command consistently. If a `Patch*` argument fails, enumerate package directories first or search `$U` with a narrow glob.

## Search routing by data type

### Stats entries: spells, passives, statuses, weapons, armor, objects, characters

Start in each package's:

```text
Public/<Package>/Stats/Generated/Data/
```

The most relevant files in this repo's work are:

| Data | Files to search first | Definition shape |
| --- | --- | --- |
| Spell data | `Spell_Projectile.txt`, `Spell_Target.txt`, `Spell_Shout.txt`, `Spell_Zone.txt`, `Spell_Rush.txt`, `Spell_Throw.txt`, `Spell_Teleportation.txt`, `Spell_Wall.txt` | `new entry "..."` + `type "SpellData"` |
| Passives | `Passive.txt` | `type "PassiveData"` |
| Boost/status data | `Status_BOOST.txt` | `type "StatusData"` |
| Other statuses | `Status_EFFECT.txt`, `Status_POLYMORPHED.txt`, `Status_INCAPACITATED.txt`, `Status_DOWNED.txt`, etc. | `type "StatusData"` |
| Weapons | `Weapon.txt` | `type "Weapon"` |
| Armor and wearable stats | `Armor.txt` | `type "Armor"` |
| Inventory/world objects | `Object.txt` | `type "Object"` |
| Characters/summons | `Character.txt` | `type "Character"` |
| Reactions/interrupts | `Interrupt.txt` | interrupt definitions |
| General stat data | `Data.txt` | miscellaneous stat records |

Examples:

```powershell
$stats = "$U\Shared\Public\Shared\Stats\Generated\Data"

rg --no-ignore -n -A 35 '^new entry "WPN_Longsword_2"$' $stats -g 'Weapon.txt'
rg --no-ignore -n -A 50 '^new entry "Projectile_FireBolt"$' $stats -g 'Spell_*.txt'
rg --no-ignore -n -A 40 '^new entry "MAG_FROST_FROST_WEAPON"$' $stats -g 'Status_*.txt'
rg --no-ignore -n -A 35 '^new entry "PotentCantrip"$' $stats -g 'Passive.txt'
```

Search both definitions and references:

```powershell
# Definition
rg --no-ignore -n '^new entry "Target_Smite_Thunderous"$' $U -g '*.txt'

# Inheritance and use sites
rg --no-ignore -n -F 'using "Target_Smite_Thunderous"' $U -g '*.txt'
rg --no-ignore -n -F 'UnlockSpell(Target_Smite_Thunderous)' $U -g '*.txt'
```

`using` is inheritance. Resolve the entire inheritance chain before concluding which fields are effective. A child may omit damage, icon, costs, flags, weapon actions, or other values because it inherits them.

### Root templates and item UUIDs

Stats define gameplay. Root templates connect gameplay stats to spawnable game objects, names, visuals, physics, icons, statuses, tags, and UUIDs.

Search:

```text
Public/<Package>/RootTemplates/_merged.lsf.lsx
```

Prefer `.lsf.lsx` over the binary `_merged.lsf`.

Useful root-template fields:

- `MapKey`: the spawn/template UUID.
- `Name`: root-template name or UID.
- `Stats`: linked stats entry.
- `ParentTemplateId`: inherited root template.
- `VisualTemplate`: model/visual resource link.
- `PhysicsTemplate`: physics resource link.
- `Icon`: icon identifier.
- `DisplayName` and `Description`: localization handles.
- `StatusList`: permanent object statuses, often elemental weapon visuals/damage.
- `Tags`: gameplay and item tags.

Examples:

```powershell
$roots = "$U\Shared\Public\Shared\RootTemplates\_merged.lsf.lsx"

rg --no-ignore -n -B 15 -A 45 -F 'value="e3b2adb6-7493-466e-9c65-4281fb74e83f"' $roots
rg --no-ignore -n -B 15 -A 45 -F 'value="WPN_HUM_Longsword_A_2"' $roots
rg --no-ignore -n -B 15 -A 45 -F 'value="WPN_Longsword_2"' $roots
```

A parent can supply `VisualTemplate`, `PhysicsTemplate`, `Icon`, `EquipmentTypeID`, readiness flags, and other fields. Compare the complete parent chain before copying a full exported root node. In this repository, explicit visual templates are often still used to make the desired model unambiguous; see `DoombubblesTweaks/Public/DoombubblesTweaks/RootTemplates/Items/`.

### Localization and translated-string handles

English text is primarily in:

```text
English/Localization/English/english.loca.xml
```

Search by visible English text to discover a handle, or by handle to resolve text:

```powershell
$loc = "$U\English\Localization\English\english.loca.xml"

rg --no-ignore -n -i -F 'This longsword never dulls' $loc
rg --no-ignore -n -F 'h12345678g1234g1234g1234g123456789abc' $loc
```

Localization-first discovery is often the best way to find a base-game record when only its in-game display name is known. Search for the text between the XML element boundaries so that a name such as `Fireball` does not initially match every description that merely mentions Fireball:

```powershell
rg --no-ignore -n -F '>Fireball<' $loc
```

The matching localization entry will look similar to:

```xml
<content contentuid="h..." version="1">Fireball</content>
```

Copy its `contentuid` handle, then search that handle in the likely data layers:

```powershell
$handle = 'h...'

# Spell/passive/status stats and other generated data
rg --no-ignore -n -F $handle $U -g '*.txt'

# Root templates, lists, progressions, descriptions, and other resources
rg --no-ignore -n -F $handle $U -g '*.lsx'
```

The handle match usually reveals the internal stats or resource ID through a nearby `new entry`, `DisplayName`, or LSX node. Continue the investigation using that internal ID rather than the player-facing name. Inspect every exact localization match: different records can legitimately have the same displayed text but use different handles, and one record can have separate display-name, description, tooltip, or upcast handles.

BG3 translated-string handles use the convention shown in this repo's `.vscode/loca.code-snippets`:

```text
h${UUID/-/g/g}
```

That is `h` followed by a UUID with each hyphen replaced by `g`. Do not use an item/root UUID as a localization handle unless it was deliberately generated for that independent purpose.

### Spell, passive, skill, and ability lists

Search these files when determining where a spell or passive is granted:

```text
Shared/Public/Shared/Lists/SpellLists.lsx
Shared/Public/Shared/Lists/PassiveLists.lsx
Shared/Public/Shared/Lists/SkillLists.lsx
Shared/Public/Shared/Lists/AbilityLists.lsx
```

The same paths may exist under `Gustav` or `GustavX` and can add or override lists.

```powershell
rg --no-ignore -n -B 12 -A 20 -F 'Target_MistyStep' $U -g '*Lists.lsx'
rg --no-ignore -n -B 12 -A 20 -F 'PotentCantrip' $U -g 'PassiveLists.lsx'
```

Record the containing list UUID as well as the member identifier. Progressions normally reference list UUIDs, not filenames or friendly names.

### Classes, subclasses, progressions, and feats

Search these LSX families:

```text
Public/<Package>/ClassDescriptions/ClassDescriptions.lsx
Public/<Package>/Progressions/Progressions.lsx
Public/<Package>/Progressions/ProgressionDescriptions.lsx
Public/<Package>/Feats/Feats.lsx
Public/<Package>/Feats/FeatDescriptions.lsx
Public/<Package>/CharacterCreation/
Public/<Package>/CharacterCreationPresets/
Public/<Package>/DefaultValues/
```

Relevant links include:

- class/subclass UUIDs;
- `ProgressionTableUUID`;
- progression `UUID` and level;
- `Boosts`, `PassivesAdded`, `Selectors`, spell-list UUIDs, and resource UUIDs;
- character-creation parent class and ability-distribution records;
- default hotbar/action placement and default spell/passive selections.

Search a known UUID across only LSX first:

```powershell
rg --no-ignore -n -F 'e11dbbc9-cd7f-4239-809d-a693084a0072' $U -g '*.lsx'
```

Then inspect neighboring nodes instead of treating every matching UUID as the same semantic field.

### Action resources and costs

Resource definitions are in:

```text
Public/<Package>/ActionResourceDefinitions/ActionResourceDefinitions.lsx
Public/<Package>/ActionResourceGroupDefinitions/
```

Spell and passive stats refer to these through `UseCosts`, `DualWieldingUseCosts`, `HitCosts`, and similar fields. Search both the readable resource name and UUID.

### Tags, equipment types, rulesets, defaults, and errors

Useful LSX directories include:

```text
Public/<Package>/Tags/
Public/<Package>/EquipmentTypes/
Public/<Package>/WeaponAnimationSetData/
Public/<Package>/Ruleset/
Public/<Package>/DefaultValues/
Public/<Package>/ErrorDescriptions/
Public/<Package>/ItemThrowParams/
```

Search these when a UUID is not a spell/list/class UUID, when an item animation or proficiency behaves incorrectly, or when a condition references a named error.

### Icons, models, visuals, physics, and materials

Start from the root template, not from a guessed filename:

1. Find the item root template.
2. Record `Icon`, `VisualTemplate`, `PhysicsTemplate`, and `ParentTemplateId`.
3. Resolve the parent if a field is missing.
4. Search those identifiers in converted `.lsx` metadata.
5. Only then search binary filenames in `Icons`, `Models`, `Assets`, or `Game`.

Examples:

```powershell
rg --no-ignore -n -F '910f74da-8b12-9762-1e97-f6f3457d80de' $U -g '*.lsx'
rg --files --no-ignore $U | rg -i 'Item_WPN_HUM_Longsword_A_2|Longsword_A_2'
```

Common formats:

- `.dds`: texture/icon image.
- `.gr2`: Granny model/animation; binary, so search the filename or linked UUID rather than contents.
- `.lsx`: converted resource metadata and banks.
- `.lsf`: binary resource; use its converted `.lsf.lsx` sibling or convert it with LSLib.
- `.lsj`: JSON-like Larian resource format; textual in some exports, but prefer a converted/readable representation when available.

Do not assume a stats `Icon` string is a `.dds` filename. It can be resolved through icon/texture-bank metadata.

When the resolved icon is a spell, action, or passive icon, first check `Game/Public/Game/GUI/Assets/ControllerUIIcons/skills_png/`. Prefer that controller variant for Wiki use because it retains the unfaded artwork. Fall back to the matching `Game/Public/Game/GUI/Assets/Tooltips/Icons/` file only if the controller version is absent.

### VFX and spell effects

Search by the spell/status ID first, then follow effect UUIDs and resource names through:

```text
Public/<Package>/VFX/
Public/<Package>/MultiEffectInfos/
Public/<Package>/Assets/Effects/
Public/<Package>/Content/Assets/Effects/
```

Relevant formats include `.lsx` and `.lsfx`. `.lsfx` is text and should be searched directly; particle/model/texture dependencies may lead to binary assets.

```powershell
rg --no-ignore -n -F 'PrepareEffect' $U -g '*.txt'
rg --no-ignore -n -F '<effect UUID>' $U -g '*.lsx' -g '*.lsfx'
```

### Scripts and conditions

Base-game script-related searches may involve:

- `.itemScript` and `.charScript` under package `Scripts/` directories;
- `.khn` Thoth/client scripts, especially under `Game`;
- story/script resources stored in binary or compiled formats;
- stats conditions embedded directly in `.txt` (`RequirementConditions`, `TargetConditions`, `Conditions`, functors).

Start with textual stats and scripts:

```powershell
rg --no-ignore -n -F 'Tagged(' $U -g '*.txt' -g '*.khn' -g '*.itemScript' -g '*.charScript'
rg --no-ignore -n -F 'HasStatus(' $U -g '*.txt' -g '*.khn'
```

Search the repository's `Scripts/thoth/helpers/` for established local condition syntax before inventing an expression.

### Treasure tables, equipment, item combinations, and world placement

Search package stats directories for:

```text
Stats/Generated/TreasureTable.txt
Stats/Generated/Equipment.txt
Stats/Generated/ItemCombos.txt
```

World placements and characters appear under `Globals/` and `Levels/`, often in `_merged.lsf.lsx` or converted item resources. Search a root-template UUID to find placements:

```powershell
rg --no-ignore -n -F '<root-template UUID>' $U -g '*.lsx'
```

Distinguish:

- stats ID: used in `new entry`, `using`, recipes, and gameplay references;
- root-template UUID/`MapKey`: used for spawning and world placement;
- root-template `Name`: human-readable template UID;
- mod UUID: identifies a package in `meta.lsx` and is unrelated to item UUIDs.

## Following a record across layers

### Item workflow

For an item such as a longsword:

1. Search `Weapon.txt` for its stats entry.
2. Record `RootTemplate`, `using`, `StatusOnEquip`, `Boosts`, `PassivesOnEquip`, and spell unlocks.
3. Resolve the full stats inheritance chain.
4. Search root templates for the `RootTemplate` UUID.
5. Record `MapKey`, `Name`, `Stats`, parent, visual, physics, icon, localization handles, statuses, and tags.
6. Resolve inherited root-template fields.
7. Resolve localization handles in `english.loca.xml`.
8. Resolve visual/icon UUIDs in converted metadata or the Multitool GameObject Explorer.
9. Search the root UUID in world placements, treasure tables, and recipes if acquisition matters.

The Wyrm Staff/Sword work in this repository is a useful example spanning:

```text
DoombubblesTweaks/Public/DoombubblesTweaks/Stats/Generated/Data/NewItems/
DoombubblesTweaks/Public/DoombubblesTweaks/RootTemplates/Items/
DoombubblesTweaks/Public/DoombubblesTweaks/Stats/Generated/ItemCombos.txt
DoombubblesTweaks/Localization/English/Staves.loca.xml
Wiki/UUIDS.md
```

### Spell workflow

1. Identify the spell stats type from its prefix (`Projectile_`, `Target_`, `Shout_`, `Zone_`, etc.).
2. Search the matching `Spell_*.txt`, then all `Spell_*.txt` if necessary.
3. Resolve `using` and any `RootSpellID`/container relationship.
4. Follow statuses, passives, interrupts, projectiles, and functors referenced by the spell.
5. Search spell lists and progression selectors to learn how it is granted.
6. Resolve display/description handles and icon/effect references.

### Class/subclass workflow

1. Find the class in `ClassDescriptions.lsx` and record its UUID and `ProgressionTableUUID`.
2. Find progression nodes with that table UUID.
3. Resolve spell-list, passive-list, resource, and selector UUIDs.
4. Inspect `ProgressionDescriptions.lsx`, `DefaultValues/`, and character-creation records.
5. Search stats definitions for every referenced passive/spell.

## Repository-first examples

Before creating or changing a data type, find how this repository already does it:

```powershell
# Stats inheritance
rg -n '^using ' DoombubblesTweaks WoWSubclasses WoWDeathKnight -g '*.txt'

# Root templates and visuals
rg -n 'ParentTemplateId|VisualTemplate|PhysicsTemplate' `
  DoombubblesTweaks WoWSubclasses WoWDeathKnight -g '*.lsx'

# Progression/list wiring
rg -n 'ProgressionTableUUID|SpellList|PassiveList|PassivesAdded|Selectors' `
  DoombubblesTweaks WoWSubclasses WoWDeathKnight -g '*.lsx'

# Conditions and functors
rg -n 'RequirementConditions|Conditions|StatsFunctors|SpellProperties' `
  DoombubblesTweaks WoWSubclasses WoWDeathKnight -g '*.txt'
```

Do not copy an old mod record blindly. Use it to identify required layers and conventions, then verify the referenced base-game entries in the current unpack.

## Efficient `rg` practices

Recommended flags:

- `--no-ignore`: required for this ignored unpack directory.
- `-F`: exact/fixed-string match for identifiers.
- `-n`: line numbers.
- `-i`: case-insensitive only for human-facing names or uncertain filename casing.
- `-B N -A N`: inspect a bounded record neighborhood.
- `-g '*.txt'`, `-g '*.lsx'`, etc.: restrict formats early.
- `-l`: list matching files before opening large records.
- `-m N`: cap matches during discovery.

Examples:

```powershell
# Find candidate defining files quickly
rg --no-ignore -l -F 'Target_Disintegrate' $U -g 'Spell_*.txt'

# Exact stats record with context
rg --no-ignore -n -A 60 '^new entry "Target_Disintegrate"$' $U -g 'Spell_*.txt'

# UUID only in readable resource files
rg --no-ignore -n -F 'f85002a2-8e0e-4a49-0faa-2ef57d983a3a' $U -g '*.lsx'

# Search filenames for a binary asset
rg --files --no-ignore $U | rg -i 'longsword.*\.(gr2|dds)$'
```

For very large `_merged.lsf.lsx` files, search first and read only a bounded line range around the match. Do not load the entire file into model context.

## Public resources

Use these when local discovery is difficult, but verify important values against the local unpack because web indexes can represent a different patch:

- [BG3 Modder's Multitool](https://github.com/ShinyHobo/BG3-Modders-Multitool): unpacking, indexing, index search, UUID/handle generation, and GameObject Explorer.
- [Multitool unpacking guide](https://github.com/ShinyHobo/BG3-Modders-Multitool/wiki/Unpacking-Game-Files): explains the roles of Shared, Gustav, Game, English, assets, and patch packages.
- [Norbyte's LSLib](https://github.com/Norbyte/lslib): unpacking/packing and conversion among LSF, LSX, LSJ, models, textures, and other Larian formats.
- [Norbyte BG3 data search](https://bg3.norbyte.dev/search): convenient web search over game data; useful for identifiers and examples, but cross-check patch-sensitive findings locally.
- [BG3 Community Wiki modding pages](https://bg3.wiki/wiki/Category:Modding): folder-structure and data-format orientation.
- [BG3 Wiki](https://bg3.wiki/): useful for mapping a player-facing item/spell name to UID, UUID, or stats name. It is a discovery aid, not a replacement for raw definitions.

The Multitool's indexed search or GameObject Explorer can be faster than filesystem search for broad discovery and can connect stats, templates, icons, models, and translations. Direct local search remains better for reproducible evidence, exact context, inheritance, and package override comparisons.

## Common failure modes

- Forgetting `--no-ignore` and incorrectly concluding that data is absent.
- Searching binary `.lsf` or `.gr2` contents instead of converted text or filenames.
- Searching all 180,000+ unpacked files when one stats file would suffice.
- Treating the first package match as effective without checking patches/overrides.
- Confusing a stats ID, root-template name, root UUID, resource UUID, localization handle, and mod UUID.
- Copying a child record without resolving its `using` inheritance.
- Copying a root template without resolving `ParentTemplateId` inheritance.
- Assuming a missing child field is missing at runtime when the parent supplies it.
- Conversely, relying on implicit visuals without checking the effective parent's `VisualTemplate`.
- Searching only `Shared`; many named campaign items and characters live in `Gustav` or `GustavX`.
- Generating handles that do not follow `h${UUID/-/g/g}` or reusing a gameplay UUID as a localization handle.
- Reusing an item/root UUID. Always check the repository and unpack for collisions.
- Trusting a web result without checking its game patch or local package precedence.
- Editing generated build output instead of the repository's template/source file.

## Minimum evidence to report

When presenting a base-game-data conclusion, include:

1. the defining file and record ID;
2. the relevant package (`Shared`, `Gustav`, `GustavX`, patch);
3. inherited parents (`using` and/or `ParentTemplateId`);
4. linked UUIDs/handles and what each one represents;
5. any later override found;
6. the closest established example in this repository;
7. uncertainty caused by stale, missing, or binary-only data.

This makes future edits auditable and prevents a plausible-looking identifier from being treated as verified base-game behavior.
