package main

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func mustExpandWikiLinks(t *testing.T, source string, currentPage string, index *wikiIndex) (string, bool) {
	t.Helper()
	got, changed, err := expandWikiLinks([]byte(source), currentPage, index)
	if err != nil {
		t.Fatal(err)
	}
	return string(got), changed
}

func requireEqual(t *testing.T, got string, want string) {
	t.Helper()
	if got != want {
		t.Fatalf("unexpected output:\n%s\nwant:\n%s", got, want)
	}
}

func TestLoadConceptAliases(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "wikilinks.yaml")
	content := "concepts:\n  Action Point:\n    href: https://bg3.wiki/wiki/Action\n    aliases: [Action, Actions]\n"
	if err := os.WriteFile(path, []byte(content), 0644); err != nil {
		t.Fatal(err)
	}
	index := newWikiIndex()
	if err := index.loadConcepts(path); err != nil {
		t.Fatal(err)
	}
	for _, name := range []string{"Action Point", "Action", "Actions"} {
		if got := index.Concepts[normalizeWikiName(name)].Name; got != "Action Point" {
			t.Fatalf("%s resolved to %q", name, got)
		}
	}
}

func TestExpandWikiLinksUsesLocalHeadingAndIcon(t *testing.T) {
	index := newWikiIndex()
	page := &wikiPage{Name: "Fighter---Arms", Headings: map[string][]wikiTarget{}}
	target := wikiTarget{Name: "Mortal Strike", Page: page.Name, Anchor: "mortal-strike", Icons: []string{"images/MortalStrike.png"}}
	page.Headings[normalizeWikiName(target.Name)] = []wikiTarget{target}
	index.Pages[normalizeWikiName(page.Name)] = page
	index.Headings[normalizeWikiName(target.Name)] = []wikiTarget{target}

	got, changed := mustExpandWikiLinks(t, "Use [[Mortal Strike]] now.", page.Name, index)
	if !changed {
		t.Fatal("expected wikilink expansion")
	}
	want := "Use <a href='#mortal-strike'><img src='images/MortalStrike.png' height='25' align='top' alt='Mortal Strike' />Mortal Strike</a> now."
	requireEqual(t, got, want)
}

func TestExpandWikiLinksSupportsGitHubDisplayTargetOrder(t *testing.T) {
	page := &wikiPage{Name: "Fighter---Arms", Headings: map[string][]wikiTarget{}}
	index := newWikiIndex()
	index.Pages[normalizeWikiName(page.Name)] = page

	got, _ := mustExpandWikiLinks(t, "[[Arms Fighter | Fighter---Arms]]", "Home", index)
	requireEqual(t, got, "[[Arms Fighter | Fighter---Arms]]")
}

func TestExpandWikiLinksPreservesResolvedPageFilename(t *testing.T) {
	page := &wikiPage{Name: "Doombubbles---Difficulty", Headings: map[string][]wikiTarget{}}
	index := newWikiIndex()
	index.Pages[normalizeWikiName("Doombubbles Difficulty")] = page

	got, _ := mustExpandWikiLinks(t, "[[Doombubbles Difficulty]]", "Home", index)
	requireEqual(t, got, "[[Doombubbles Difficulty | Doombubbles---Difficulty]]")
}

func TestCleanHeadingNameUsesWikilinkDisplayText(t *testing.T) {
	got := cleanHeadingName("[[Arms Fighter | Fighter---Arms]]")
	if got != "Arms Fighter" {
		t.Fatalf("unexpected heading name %q", got)
	}
}

func TestExpandWikiLinksSupportsBuiltInConcept(t *testing.T) {
	index := newWikiIndex()
	index.Concepts[normalizeWikiName("Action Point")] = wikiTarget{Name: "Action Point", Href: "https://bg3.wiki/wiki/Action", Icons: []string{"Game/ActionResources_c/Icons/c_ico_AP.png"}}
	got, _ := mustExpandWikiLinks(t, "Spend an [[Action Point]].", "Page", index)
	want := "Spend an <a href='https://bg3.wiki/wiki/Action'><img src='Game/ActionResources_c/Icons/c_ico_AP.png' height='25' align='top' alt='Action Point' />Action Point</a>."
	requireEqual(t, got, want)
}

func TestExpandWikiImage(t *testing.T) {
	got, changed := mustExpandWikiLinks(t, "![[Game/ControllerUIIcons/skills_png/PassiveFeature_Test.png]]\n", "Page", newWikiIndex())
	if !changed {
		t.Fatal("expected embedded image expansion")
	}
	want := "<img src=\"Game/ControllerUIIcons/skills_png/PassiveFeature_Test.png\" height=\"40\" align=\"left\" alt=\"\" />\n"
	requireEqual(t, got, want)
}

func TestExpandWikiImageRejectsDisplayText(t *testing.T) {
	_, _, err := expandWikiLinks([]byte("![[label | image.png]]"), "Page", newWikiIndex())
	if err == nil || !strings.Contains(err.Error(), "cannot have display text") {
		t.Fatalf("expected invalid image error, got %v", err)
	}
}

func TestExpandBG3WikiSearchLink(t *testing.T) {
	got, changed := mustExpandWikiLinks(t, "See ?[[Great Weapon Fighting]].\n", "Page", newWikiIndex())
	if !changed {
		t.Fatal("expected BG3 Wiki search link expansion")
	}
	want := "See <a href='https://bg3.wiki/w/index.php?go=Go&amp;search=Great+Weapon+Fighting'>Great Weapon Fighting</a>.\n"
	requireEqual(t, got, want)
}

func TestExpandBG3WikiSearchLinkSupportsDisplayText(t *testing.T) {
	got, _ := mustExpandWikiLinks(t, "?[[temporary HP | Temporary Hit Points]]", "Page", newWikiIndex())
	want := "<a href='https://bg3.wiki/w/index.php?go=Go&amp;search=Temporary+Hit+Points'>temporary HP</a>"
	requireEqual(t, got, want)
}

func TestExpandWikiLinkUsesConfiguredIconPath(t *testing.T) {
	index := newWikiIndex()
	index.Concepts[normalizeWikiName("Test Feature")] = wikiTarget{Name: "Test Feature", Href: "Test-Page", Icons: []string{"Game/ControllerUIIcons/skills_png/PassiveFeature_Test.png"}}
	got, _ := mustExpandWikiLinks(t, "[[Test Feature]]", "Page", index)
	want := "<a href='Test-Page'><img src='Game/ControllerUIIcons/skills_png/PassiveFeature_Test.png' height='25' align='top' alt='Test Feature' />Test Feature</a>"
	requireEqual(t, got, want)
}

func TestExpandWikiLinkUsesMultipleConfiguredIcons(t *testing.T) {
	target := wikiTarget{
		Name:  "Any Rune",
		Href:  "Death-Knight#rune-casting",
		Icons: []string{"images/BloodRune.png", "images/FrostRune.png", "images/UnholyRune.png"},
	}
	index := newWikiIndex()
	index.Concepts[normalizeWikiName("Any Rune")] = target
	index.Concepts[normalizeWikiName("Any Runes")] = target
	got, _ := mustExpandWikiLinks(t, "Spend [[Any Runes]].", "Page", index)
	want := "Spend <a href='Death-Knight#rune-casting'><img src='images/BloodRune.png' height='25' align='top' alt='Any Rune' /><img src='images/FrostRune.png' height='25' align='top' alt='Any Rune' /><img src='images/UnholyRune.png' height='25' align='top' alt='Any Rune' />Any Runes</a>."
	requireEqual(t, got, want)
}

func TestExpandWikiImageInsideHTML(t *testing.T) {
	source := "<a href=\"Page\">\n![[Game/ControllerUIIcons/skills_png/PassiveFeature_Test.png]]\nTest\n</a>\n"
	got, _ := mustExpandWikiLinks(t, source, "Page", newWikiIndex())
	if strings.Contains(got, "![[") {
		t.Fatalf("embedded image inside HTML was not expanded: %s", got)
	}
}

func TestExpandWikiLinkInsideHTML(t *testing.T) {
	target := wikiTarget{Name: "Mortal Strike", Page: "Fighter---Arms", Anchor: "mortal-strike", Icons: []string{"images/MortalStrike.png"}}
	index := newWikiIndex()
	index.Headings[normalizeWikiName(target.Name)] = []wikiTarget{target}
	source := "<td>[[Mortal Strike]]</td>\n"
	got, _ := mustExpandWikiLinks(t, source, "Page", index)
	if strings.Contains(got, "[[") || !strings.Contains(got, "images/MortalStrike.png") {
		t.Fatalf("wikilink inside HTML was not expanded: %s", got)
	}
}

func TestExpandWikiLinkWithoutIconInsideHTML(t *testing.T) {
	page := &wikiPage{Name: "Death-Knight", Headings: map[string][]wikiTarget{}}
	target := wikiTarget{Name: "Level 1", Page: page.Name, Anchor: "level-1"}
	page.Headings[normalizeWikiName(target.Name)] = []wikiTarget{target}
	index := newWikiIndex()
	index.Pages[normalizeWikiName(page.Name)] = page
	index.Headings[normalizeWikiName(target.Name)] = []wikiTarget{target}
	source := "<td>[[1st | #level-1]]</td>\n"
	got, _ := mustExpandWikiLinks(t, source, page.Name, index)
	want := "<td><a href='#level-1'>1st</a></td>\n"
	requireEqual(t, got, want)
}

func TestExpandWikiLinksIgnoresCode(t *testing.T) {
	source := "`[[Inline]] ?[[Search]] ![[image.png]]`\n\n```md\n[[Fenced]] ?[[Search]] ![[image.png]]\n```\n\n    [[Indented]] ?[[Search]] ![[image.png]]\n"
	got, changed := mustExpandWikiLinks(t, source, "Page", newWikiIndex())
	if changed || got != source {
		t.Fatalf("code content was modified: %s", got)
	}
}

func TestResolveRejectsAmbiguousHeadings(t *testing.T) {
	targets := []wikiTarget{
		{Name: "Charge", Page: "Fighter---Arms", Anchor: "charge"},
		{Name: "Charge", Page: "Barbarian---Fury", Anchor: "charge"},
	}
	index := newWikiIndex()
	index.Headings[normalizeWikiName("Charge")] = targets
	_, err := index.resolve("Charge", "Home")
	if err == nil || !strings.Contains(err.Error(), "ambiguous") {
		t.Fatalf("expected ambiguity error, got %v", err)
	}
}
