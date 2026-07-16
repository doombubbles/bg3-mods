# Compact Wiki Authoring Syntax

The Wiki source should optimize for readability. `ProcessTemplates` expands compact Wiki links and image embeds after localization and Go templates have rendered. The exact generated Markdown or HTML is an implementation detail; `build/Wiki` only needs to render correctly when published to the GitHub Wiki.

## Named links

Use a short Wiki link for a known concept or a mod feature:

```md
Spend an [[Action Point]].
Your next [[Raging Blow]] deals additional damage.
```

`ProcessTemplates` resolves names from two places:

1. headings in the rendered Wiki, including headings supplied by snippets;
2. the centralized base-game concept registry in `Wiki/!wikilinks.yaml`.

A heading's preceding 40-pixel image becomes the 25-pixel icon shown beside links to that heading. When a heading name is ambiguous, use GitHub Wiki's Gollum `display | target` order:

```md
[[Charge | Fighter---Arms#Charge]]
```

Links that do not need generated icon markup may remain real `[[Wiki Link]]` syntax in the output.

## Direct images

Use an embedded Wiki link instead of writing a complete heading image tag:

```md
![[Game/ControllerUIIcons/skills_png/PassiveFeature_FightingStyle_TwoWeaponFighting.png]]
```

This expands to a 40-pixel, left-aligned image. Other repository-relative image paths work too:

```md
![[images/ControllerIcons/skills_png/Action_DeathKnight_DeathCoil.png]]
```

Use the compact `Game/...` package path for base-game controller icons. Continue using `images/ControllerIcons/skills_png/Filename.png` for custom mod icons.

The image macro also works inside legacy raw HTML blocks. Named wikilinks work inside legacy HTML tables as well; the processor emits an HTML anchor there so the link does not depend on GitHub parsing Markdown inside raw HTML. Inline and fenced code are left untouched.

## Unregistered BG3 Wiki links

Use a question-mark wikilink for a one-off BG3 Wiki reference that does not need an icon or a centralized registry entry:

```md
?[[Great Weapon Fighting]]
```

The processor URL-escapes the name and links through the BG3 Wiki's **Go** search. An exact page or redirect opens directly; otherwise, the link opens search results. Custom display text uses the same `display | target` order as other wikilinks:

```md
?[[temporary HP | Temporary Hit Points]]
```

Prefer `[[Concept]]` for repeated references, links that should have icons, and targets that should be validated during the Wiki build. Prefer `?[[Name]]` for isolated base-game references such as the individual entries on `Item-Changes.md`.

## Central concept registry

`Wiki/!wikilinks.yaml` defines named concepts that are not headings in this Wiki:

```yaml
concepts:
  Action Point:
    href: https://bg3.wiki/wiki/Action
    icon: Game/ActionResources_c/Icons/c_ico_AP.png
    aliases: [Action, Actions]
```

Add concepts here when authors should be able to write `[[Name]]`. Aliases share the canonical entry's destination and icon, but preserve the alias text as the displayed label. Names and aliases must be unique across the registry. The Wiki build fails when an entry has no destination, references a missing icon, or collides with another name.

Concepts that need a composite resource indicator can use `icons` instead of `icon`:

```yaml
Any Rune:
  href: Death-Knight#rune-casting
  icons:
    - images/ActionResources_c/Icons/Resources/BloodRune.png
    - images/ActionResources_c/Icons/Resources/FrostRune.png
    - images/ActionResources_c/Icons/Resources/UnholyRune.png
  aliases: [Any Runes]
```

All configured icons are rendered before the link label. Do not define both `icon` and `icons` on the same concept.

Keep destinations and icon choices centralized rather than adding another VS Code snippet or a static-string `wikify` call. Organize new entries under the existing resource, ability, damage, mechanics, or rest sections.

## Role of `wikify`

`wikify` remains useful for text obtained from localization:

```md
{{ get .loca "handle" | include "wikify" }}
{{ getf .loca "handle" "value" | include "wikify" }}
```

It turns terms embedded inside localized strings into Wiki-compatible links and icons. Do not normally wrap hand-authored prose in `wikify`; write named concepts directly with `[[Concept]]` instead.

## Image synchronization

`scripts/sync-bg3-wiki-images.sh` reads all source Markdown, snippets, templates, and the concept registry. It manages `Wiki/Game`, `Wiki/Gustav_Textures`, and `Wiki/Icons`, expanding each compact package path back to its full location beneath `UnpackedData` while copying, converting, and removing unused output. Custom icons remain under `Wiki/images` and are not copied into these directories.

## Current replacement coverage

The compact syntax can replace:

- 40-pixel heading `<img>` tags;
- internal links to mod actions, spells, passives, and statuses;
- their repeated 25-pixel link icons;
- named base-game concepts registered in YAML;
- static prose passed through `wikify` only to add known links or icons;
- most image-only VS Code snippets.

`wikify` is still needed for localized `get`/`getf` results. Bespoke HTML layout, nonstandard image sizes or alignment, tooltip markup, and parameter substitution remain outside this syntax.
