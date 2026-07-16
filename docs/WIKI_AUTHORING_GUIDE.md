# Writing Mod-Derived Wiki Content

This guide is for LLMs and humans adding or revising pages in this repository's `Wiki/` directory. It describes the established authoring style, how to translate mod implementation data into useful player-facing documentation, and how to use the repository's Wiki templating system without duplicating facts that already live in localization.

The goal is not to reproduce raw stats records. The Wiki should tell a player what changed, what a new feature does, when or where it is available, and how it fits into the rest of the mod.

## Core principles

1. Treat the mod files as the source of truth.
2. Write for a player, not for a mod author or engine programmer.
3. Reuse localization for canonical names and descriptions when practical.
4. Add the important context localization does not contain.
5. Document effective behavior, including inheritance and supporting records, rather than one isolated stats entry.
6. Match the structure of the surrounding Wiki page before introducing a new format.
7. Prefer concise, concrete statements over promotional prose or exhaustive implementation detail.

## Source-of-truth order

When sources appear to disagree, use this order while investigating:

1. The mod's effective, rendered output for the configuration being documented.
2. Progressions, spell/passive lists, treasure tables, recipes, and other records that make content available.
3. The complete effective stats definition, including `using` inheritance and related passives or statuses.
4. Root templates and object definitions for item identity, display data, and world objects.
5. Localization for the intended player-facing name and description.
6. Existing Wiki prose, which may be stale.

Localization is authoritative for intended wording, but it is not by itself proof that content is obtainable, assigned at a particular level, or mechanically implemented exactly as described. Conversely, a stats entry may exist without ever being granted to a player.

Use `docs/BG3_BASE_GAME_DATA_SEARCH.md` when the investigation depends on inherited base-game data.

## What to investigate before writing

### New actions, spells, passives, and statuses

Confirm all of the following that apply:

- internal stats entry and `using` parent;
- display-name and description handles;
- `DescriptionParams` and any tooltip damage/healing fields;
- action-resource cost and action type;
- range, area, targeting rules, and required equipment;
- attack roll or saving throw and success behavior;
- damage, healing, duration, scaling, and recharge rules;
- applied statuses and what those statuses actually do;
- supporting passives that add procs, damage, or conditional behavior;
- spell/passive lists and progressions that determine availability;
- configuration templates that can change the rendered result.

Do not infer mechanics from an entry's name, icon, or localization alone. A short spell definition can inherit most of its behavior, and the visible result can be split between the spell, a status, and one or more hidden passives.

### Classes, subclasses, and races

Trace the complete progression rather than searching only for named features:

- class or subclass description record;
- progression table UUID;
- every relevant progression level;
- `PassivesAdded`, `Boosts`, and `Selectors`;
- spell and passive list UUIDs referenced by selectors;
- number of choices and whether earlier choices remain available;
- always-prepared spells, replacements, and removed features;
- class-level versus character-level scaling;
- multiclass-specific behavior where relevant.

A feature being present in a spell list does not establish the level at which it is learned. The progression selector establishes that relationship.

### Items

Confirm:

- stats ID and complete `using` chain;
- root-template UUID and parent template;
- display name, description, rarity, icon, and equipment type;
- `Boosts`, `PassivesOnEquip`, `StatusOnEquip`, and unlocked spells;
- treasure-table, trader, world-placement, or drop wiring;
- crafting recipes and which inputs are consumed;
- upgrade relationships and required combination items;
- whether a family of generated items follows one shared template with exceptions.

The player usually needs the item's effects and acquisition method. They usually do not need its root-template ancestry, UUID, or recipe internals unless the page is explicitly an ID catalog such as `Wiki/UUIDS.md`.

### Overrides and balance changes

Compare the modded definition with the inherited or base-game definition. Identify the actual delta and document that delta, not the entire unchanged feature.

Good change descriptions answer one or more of these questions:

- What value changed from what to what?
- What restriction was removed or added?
- What new target, damage type, action, or interaction is supported?
- How often can the feature now be used?
- Was incorrect behavior fixed to match the tooltip?
- Was the tooltip changed to match behavior?

## Page archetypes

The Wiki uses several recurring page styles. Choose the one that matches the content.

### Concise change lists

Examples include `Item-Changes.md`, `Feat-Changes.md`, `Spell-Changes.md`, and most class change pages.

Use a bold feature name followed by a short, direct delta:

```md
**[Feature Name](https://bg3.wiki/wiki/Feature_Name)** - Now deals 1d8 damage instead of 1d4.
```

Conventions:

- Link base-game features to their BG3 Wiki page.
- Lead with the player-visible subject.
- Use words such as `Now`, `No longer`, `Also`, `Increased`, `Reduced`, or `Fixed` to make the delta obvious.
- State both old and new values when the comparison is useful.
- Keep a simple change on one line.
- Use a heading and nested bullets when one item or system has several related changes.
- Do not repeat unchanged base-game rules merely to make an entry longer.

For a complex feature:

```md
### [Feature Name](https://bg3.wiki/wiki/Feature_Name)

- Added a new option.
  - Lasts until Long Rest.
  - Applies 2 turns of the associated condition.
- Existing option now recharges on Short Rest.
```

### New item and feat catalogs

Examples include `New-Items.md` and `New-Feats.md`.

For a standalone entry, use a bold name, a compact mechanical summary, and acquisition information:

```md
**Item Name** - Grants the listed effect. Sold by Trader Name in Location Name.
```

Group related families under `###` headings. Introduce the family in one or two sentences, then describe members or the shared upgrade process. Avoid repeating identical shared mechanics on every family member.

Include:

- defining mechanical identity;
- damage type or spell identity where that distinguishes variants;
- vendor, drop, location, or crafting method;
- upgrade inputs and consumption behavior when relevant.

Do not include UUIDs inline. Keep IDs in the dedicated UUID table.

### Class, subclass, and race pages

The common structure is:

```md
# Feature Name

<img align="right" alt="Feature icon" height="150" src="images/.../Icon.png" />

**Feature Name** is a modded Subclass of [Base Class](https://bg3.wiki/wiki/Base_Class) that focuses on its defining playstyle.

> {{ get .loca "description-handle" | quote }}

# Subclass Features

## Level 3

### Feature Name

{{ get .loca "feature-description-handle" | include "wikify" }}
```

Conventions:

- Begin with a plain-language identity statement explaining the gameplay focus.
- Use a right-aligned 150-pixel class/subclass/race icon near the introduction when one exists.
- Use the localized flavor description as a blockquote when it adds identity rather than mechanics.
- Organize progression information under `## Level N` headings.
- Use `###` for features gained at that level and `####` only for variants or children of that feature.
- Describe selectable counts explicitly: for example, `Choose 2 additional Arms Strikes to know`.
- Link traditional base-game spells instead of restating their full descriptions.
- State replacements clearly, such as `Replaces Rage` or `Choose either X or Y`.
- Mention unusual multiclass behavior in an italicized note close to the affected level.

Subclass introductions may have a little personality, especially when explaining design inspiration, but mechanical sections should remain concise and factual.

### Ability or spell compendiums

Examples include `Paladin---Abilities.md` and `Death-Knight-Spells.md`.

Group entries by the distinction a player uses to browse them, such as resource cost, minimum level, specialization, rune count, or category.

The recurring action entry is:

```md
![[images/ControllerIcons/skills_png/Action_Name.png]]

### Action Name

- Available at Level 3
- Costs 1 [[Action Point]], 1 Resource Charge
- Weapon Attack, melee range
- {{ getf .loca "description-handle" "resolved parameter" | include "wikify" }}
```

Put high-value facts in a stable order when they apply:

1. availability;
2. action and resource cost;
3. attack/save, range, area, and equipment requirements;
4. localized description;
5. explicit damage, healing, scaling, duration, or recharge details not adequately expressed by the description.

Not every entry needs every line. Omit redundant metadata rather than creating empty ceremony.

### Overview and navigation pages

Overview pages such as `WoW-Subclasses.md` advertise and connect larger features. Use linked icons, a short identity summary, and a localized flavor quote. Keep detailed level-by-level mechanics on the dedicated page.

When adding a new public page, also consider:

- `Wiki/_Sidebar.md` for navigation;
- overview pages that list related content;
- cross-links from the parent class or system page;
- `Wiki/UUIDS.md` if new item IDs are useful to users.

### System-explanation pages

Pages such as `Downcasting.md`, `Upcasting.md`, and the difficulty overview begin with a brief explanation of the system, then list concrete examples or affected features.

Use an `Explanation:` paragraph when recording design intent helps users understand a non-obvious balance change. Reserve this for meaningful rationale; ordinary numeric changes do not need justification.

### Reference tables

Use a Markdown table for dense, repeated fields such as display name, stats ID, and UUID. Put identifiers in inline code and keep one semantic type per column.

Reference tables are an exception to the normal player-facing rule: exact internal identifiers are the purpose of the page.

## Voice and wording

The established voice is direct, practical, and moderately informal.

### Prefer

- `Make a melee attack against a creature.`
- `Now recharges once per combat instead of on Short Rest.`
- `Choose 2 additional Fury Attacks to know.`
- `Sold by Blurg at Ebonlake Grotto.`
- `On a hit, the target cannot regain hit points for 3 turns.`

### Avoid

- vague claims such as `greatly improves the ability`;
- engine-centered prose such as `the StatsFunctor applies STATUS_X`;
- unsupported interpretation of names or comments;
- marketing language such as `an amazing new devastating attack`;
- exhaustive restatement of ordinary BG3 rules;
- presenting a planned or commented-out feature as currently active.

Use second person for rules that address the player's character: `You gain`, `Your attacks`, and `Choose`. Use the feature name or neutral third person for change-log subjects.

Use complete sentences for introductions, explanations, and complicated mechanics. Compact fragments are acceptable for metadata bullets such as `Weapon Attack, melee range` or `10-turn duration`.

### Terminology

Follow the terminology used by BG3 and the mod's localization:

- `Armour Class`, not `Armor Class`, when matching BG3 text;
- `hit points`, `temporary hit points`, and `saving throw`;
- `Short Rest`, `Long Rest`, `Action`, and `Bonus Action` when referring to the game concepts;
- `1 turn`, `3 turns`, `9m range`, and `3m radius`;
- dice as `1d6`, `2d8`, or `1d12 + Charisma Modifier`;
- `once per combat`, `once per Short Rest`, or `until Long Rest`;
- `melee weapon attack`, `spell attack`, or the more compact metadata form used by the surrounding page.

Preserve official or localized capitalization for feature names. In normal prose, do not capitalize every mechanical noun unless it is being treated as a named BG3 concept.

The existing Wiki contains occasional typos, encoding artifacts, inconsistent heading levels, duplicated headings, and legacy external image URLs. These are not conventions to imitate. Match the intended pattern and correct obvious errors in newly written material.

## Localization and templates

The Wiki is processed by `ProcessTemplates`. Localization XML is loaded into `.loca`, BG3 localization tags are converted into Markdown-friendly emphasis, `<br>` becomes paragraph breaks, and numbered placeholders such as `[1]` become format placeholders.

### `get` for text without parameters

```md
{{ get .loca "h123..." | include "wikify" }}
```

Use `get` when the localization has no numbered placeholders.

### `getf` for parameterized text

```md
{{ getf .loca "h123..." "3 turns" "1d8 Force damage" | include "wikify" }}
```

Use `getf` when localization contains `[1]`, `[2]`, and similar placeholders. Supply arguments in placeholder order.

Resolve parameters from the effective stats entry's `DescriptionParams`, tooltip fields, level maps, or other relevant source. Convert engine expressions into player-facing values. Do not paste a functor such as `DealDamage(...)` into Wiki prose.

Some in-game descriptions modified dynamically through `ModifyDescription()` do not receive ordinary `DescriptionParams`. In those cases, do not assume the Wiki template can obtain the missing parameter automatically. Write the effective value explicitly when it can be proven, or use the non-parameterized description that actually renders.

### `wikify`

The `wikify` helper adds the repository's standard links and inline icons to text obtained from localization. Its mod-feature replacements emit compact Wiki links that `ProcessTemplates` resolves after the page has rendered.

Use it with localized `get` and `getf` results:

```md
{{ get .loca "h123..." | include "wikify" }}
```

For hand-authored prose, use named concepts directly instead of wrapping a string in `wikify`:

```md
Costs 1 [[Bonus Action]] and deals 2d8 [[Thunder Damage]].
```

Named external concepts are defined centrally in `Wiki/!wikilinks.yaml`; documented mod features are discovered from Wiki headings. Add reusable metadata to that registry instead of adding another static-string template call or image snippet.

Do not manually add an icon for a term and then pass the same text through `wikify`, because that can produce duplicate markup. Keep separate localization lookups and supplemental sentences on separate lines; do not combine them with `printf` merely to run them through the helper.

Be selective with complex text. Most of `wikify` still performs text replacement rather than Markdown-aware parsing, so a known term inside a link destination or proper name can also be replaced. Smart Wiki links themselves are parsed with Goldmark and are ignored inside inline and fenced code.

### Flavor quotes

Localized class, subclass, race, or feature flavor text is commonly shown as:

```md
> {{ get .loca "h123..." | quote }}
```

Do not quote ordinary mechanical text merely for decoration.

### Shared snippets

Use shared snippets when the same authored block appears on multiple pages:

```md
{{ tpl (readFile "Wiki/Snippets/Talent.md") $ }}
```

Create a snippet when several pages must stay synchronized. Do not create one for a single short occurrence.

### Configuration-aware Wiki text

The processor loads YAML values from the mod sources and rendered localization supplied by the Wiki workflow. If the documented behavior changes with a template value, mirror the same conditional in the Wiki or write wording that is accurate for every supported configuration.

Never document one branch as universal without checking the configured build used by `.github/workflows/wiki.yml`.

## Links

### Base-game concepts

Link a base-game feature on first useful mention:

```md
[Armour Class](https://bg3.wiki/wiki/Armour_Class)
```

Use the canonical BG3 Wiki target, including fragments or disambiguation suffixes where needed. Do not link every repeated occurrence if it makes a paragraph noisy.

### Repository Wiki pages

Use smart Wiki links for repository pages and for documented mod features. This repository follows the standard GitHub/MediaWiki `target | display` ordering:

```md
[[Paladin---Abilities | Paladin Channel Oath Abilities]]
[[Paladin---Abilities#Crusader Strike | Crusader Strike]]
```

For a uniquely named heading, or a heading on the current page, the short form is sufficient:

```md
[[Mortal Strike]]
```

`ProcessTemplates` indexes the final rendered root Wiki pages. A link resolves in this order: an exact page name or title, a matching heading on the current page, then a unique matching heading anywhere in the Wiki. Use an explicit `Page#Heading` target when the name is ambiguous. Ambiguous, missing-page, and missing-heading links fail the Wiki build.

When a heading has an image embed immediately before it, links to that heading automatically receive a 25-pixel version of the same icon. Page-only links may remain ordinary GitHub Wiki syntax. Write the human heading text after `#`; the processor computes the final GitHub-compatible anchor, including duplicate-heading suffixes.

Markdown files under `Wiki/Snippets/` are template intermediates rather than standalone Wiki pages. Their links are resolved after the snippet is included in a root page, allowing shared names such as `Charge` to select the Arms or Fury entry from the consuming page's context.

## Images

The Wiki uses three main image sizes:

- `150` pixels, right aligned: class, subclass, and race identity art;
- `40` pixels, left aligned: an action, passive, spell, or feature heading;
- `25` pixels, top aligned: inline game concepts and resources.

Examples:

```md
<img align="right" alt="Arms class icon" height="150" src="images/ClassIcons/Arms.png" />
```

```md
![[images/ControllerIcons/skills_png/Action_Name.png]]
```

```md
<img src="Game/ActionResources_c/Icons/c_ico_AP.png" height="25" align="top" alt="Action" />
```

Leave a blank line between a standalone image embed and its heading.

For base-game images, prefer the repository's local package-root image pipeline over adding a new direct `bg3.wiki` image URL. Base-game paths begin directly with `Game/`, `Gustav_Textures/`, or `Icons/` and omit each package's invariant path through `Assets`:

- `Game/Public/Game/GUI/Assets/` becomes `Game/`;
- `Gustav_Textures/Mods/GustavX/GUI/Assets/` becomes `Gustav_Textures/`;
- `Icons/Public/Shared/Assets/` becomes `Icons/`.

For base-game spell, action, and passive icons, use the compact controller-icon path when the matching file exists under `Game/Public/Game/GUI/Assets/ControllerUIIcons/skills_png/`:

```md
![[Game/ControllerUIIcons/skills_png/PassiveFeature_FightingStyle_TwoWeaponFighting.png]]
```

These controller variants preserve the unfaded icon artwork better than the corresponding `Tooltips/Icons/` files. Use `Tooltips/Icons/` only when no controller variant is available. Base-game icons use their compact package-root path directly; custom mod icons continue to use `![[images/ControllerIcons/skills_png/Filename.png]]`.

```text
Icons/Textures/Icons/Icons_Skills.DDS/Status_Restrained.png
```

Run the BG3 Wiki image sync script after introducing a new `Game/`, `Gustav_Textures/`, or `Icons/` image reference.

## Markdown structure and spacing

- Use one top-level `#` title for a standalone feature page.
- Use `##` for major sections or levels.
- Use `###` for individual features.
- Use `####` only for variants nested under a feature.
- Leave blank lines around headings, lists, blockquotes, and standalone images.
- Use `---` sparingly to separate large entries on an overview page.
- Use nested bullets for dependent details rather than flattening everything into separate top-level bullets.
- Use inline code for internal IDs, UUIDs, stats names, and literal property values.
- Use HTML comments only for intentionally retained drafts or temporarily disabled entries. Commented mod or Wiki content is not evidence of an active feature.

When editing an older page with unconventional heading levels, match the surrounding structure unless the task includes cleanup. Do not propagate an obvious malformed pattern into a new page.

## Deciding what to include

Prioritize information in this order:

1. what the feature does;
2. when, where, or how the player gets it;
3. action/resource cost and recharge;
4. targeting, attack/save, range, and area;
5. damage, healing, duration, and scaling;
6. important restrictions, replacements, or synergies;
7. design rationale, only when it explains an unusual system-level choice.

Usually omit:

- internal entry names;
- visual, animation, and sound resource IDs;
- hidden helper passives and statuses as separate features;
- UUIDs outside an ID reference page;
- implementation workarounds that do not change player behavior;
- inherited default details every BG3 player would expect;
- speculative future behavior.

Mention an implementation detail only when it explains a player-visible edge case, compatibility requirement, or important difference from the apparent tooltip.

## Recommended authoring workflow

1. Identify the correct page archetype and inspect two nearby examples.
2. Find the content's stats entry, localization, and availability wiring.
3. Follow `using` inheritance and supporting statuses/passives.
4. Resolve configuration templates and determine the effective values.
5. Make a small fact sheet before drafting:
   - name;
   - availability or acquisition;
   - cost and recharge;
   - attack/save and targeting;
   - effect and scaling;
   - restrictions or replacements;
   - relevant base-game and internal Wiki links.
6. Decide which facts should come from localization templates and which require authored context.
7. Write the shortest entry that answers the player's likely questions.
8. Add navigation, overview, or UUID references if the new content warrants them.
9. Run the VS Code `Process Wiki` task, or its exact command-line equivalent below, and inspect `build/Wiki` rather than reviewing only the template source.

## Validation

The VS Code `Process Wiki` task is the official validation for Wiki changes. Run it after every Wiki edit. From the repository root, its command-line equivalent is:

```sh
bin/ProcessTemplates.exe \
  -s Wiki \
  -d build/Wiki \
  -v DoombubblesTweaks \
  -v build/DoombubblesTweaks/Localization \
  -v WoWDeathKnight \
  -v build/WoWDeathKnight/Localization \
  -v WoWSubclasses \
  -v build/WoWSubclasses/Localization
```

Keep this command equivalent to the task in `.vscode/tasks.json`; do not substitute a partial template or Markdown check. The task renders the complete Wiki with the mod sources and rendered localization directories it depends on. If those localization builds are stale, regenerate them before treating the Wiki output as validated.

Only inspect the processed files under `build/Wiki` after the task succeeds. Check:

- every localization handle resolved to non-empty text;
- every `getf` received the right number and order of parameters;
- no formatting-error markers such as `%!s(MISSING)` appear;
- headings and anchors are unique and correctly nested;
- lists render as lists rather than running into images or paragraphs;
- internal Wiki links point to real pages and headings;
- local image paths exist in `build/Wiki`;
- new base-game package images were synchronized successfully;
- stated levels match progressions and selectors;
- costs, ranges, durations, and scaling match effective stats;
- acquisition statements match treasure, trader, placement, or recipe data;
- hidden, commented, or configuration-disabled content was not presented as active.

## Compact review checklist

Before considering a Wiki addition complete, answer yes to each relevant question:

- Did I verify the feature exists and is actually granted or obtainable?
- Did I inspect inheritance and supporting records?
- Did I document the effective configured behavior?
- Is the entry written for a player rather than around engine syntax?
- Does it match the surrounding page archetype?
- Did I reuse localization without omitting important parameters?
- Did I state availability or acquisition?
- Did I include the important cost, recharge, targeting, and scaling facts?
- Did I link relevant base-game concepts and internal pages?
- Did I use local image conventions for new assets?
- Did I run `Process Wiki` (or its exact equivalent) and inspect `build/Wiki`?
- Did I avoid copying legacy typos and accidental formatting inconsistencies?
