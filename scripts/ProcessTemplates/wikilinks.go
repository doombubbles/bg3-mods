package main

import (
	"bytes"
	"fmt"
	"html"
	"net/url"
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"strings"
	"unicode"

	"github.com/yuin/goldmark"
	"github.com/yuin/goldmark/ast"
	"github.com/yuin/goldmark/text"
	"sigs.k8s.io/yaml"
)

type wikiPage struct {
	Name     string
	Headings map[string][]wikiTarget
}

type wikiTarget struct {
	Name   string
	Page   string
	Anchor string
	Icons  []string
	Href   string
}

type wikiIndex struct {
	Pages    map[string]*wikiPage
	Headings map[string][]wikiTarget
	Concepts map[string]wikiTarget
}

func newWikiIndex() *wikiIndex {
	return &wikiIndex{
		Pages:    make(map[string]*wikiPage),
		Headings: make(map[string][]wikiTarget),
		Concepts: make(map[string]wikiTarget),
	}
}

type sourceRange struct {
	Start int
	End   int
}

var (
	headingPattern      = regexp.MustCompile(`^\s{0,3}#{1,6}\s+(.+?)\s*#*\s*$`)
	imagePattern        = regexp.MustCompile(`(?i)<img\b[^>]*>`)
	height40Pattern     = regexp.MustCompile(`(?i)\bheight\s*=\s*["']40["']`)
	srcPattern          = regexp.MustCompile(`(?i)\bsrc\s*=\s*["']([^"']+)["']`)
	wikiEmbedPattern    = regexp.MustCompile(`^!\[\[([^]|]+)\]\]$`)
	markdownLinkPattern = regexp.MustCompile(`\[([^\]]+)\]\([^\)]+\)`)
	wikiLinkPattern     = regexp.MustCompile(`([!?]?)\[\[([^]\r\n]+)\]\]`)
	wikiHeadingPattern  = regexp.MustCompile(`\[\[([^]\r\n]+)\]\]`)
	htmlTagPattern      = regexp.MustCompile(`<[^>]+>`)
	markdownParser      = goldmark.DefaultParser()
)

type wikiLinkConfig struct {
	Concepts map[string]wikiLinkConcept `yaml:"concepts"`
}

type wikiLinkConcept struct {
	Href    string   `yaml:"href"`
	Icon    string   `yaml:"icon"`
	Icons   []string `yaml:"icons"`
	Aliases []string `yaml:"aliases"`
}

func processWikiLinks(root string, configPath string) error {
	pagePaths, err := findWikiPages(root)
	if err != nil || len(pagePaths) == 0 {
		return err
	}

	index, err := buildWikiIndex(pagePaths)
	if err != nil {
		return err
	}
	if err := index.loadConcepts(configPath); err != nil {
		return err
	}

	for _, path := range pagePaths {
		content, err := os.ReadFile(path)
		if err != nil {
			return fmt.Errorf("read %s: %w", path, err)
		}

		name := filepath.Base(path)
		currentPage := strings.TrimSuffix(name, filepath.Ext(name))

		processed, changed, err := expandWikiLinks(content, currentPage, index)
		if err != nil {
			return fmt.Errorf("%s: %w", name, err)
		}
		if changed {
			if err := os.WriteFile(path, processed, 0644); err != nil {
				return fmt.Errorf("write %s: %w", path, err)
			}
		}
	}

	return nil
}

func findWikiPages(root string) ([]string, error) {
	entries, err := os.ReadDir(root)
	if err != nil {
		return nil, err
	}

	files := make([]string, 0, len(entries))
	for _, entry := range entries {
		// Nested Markdown files are template inputs, not standalone Wiki pages.
		if !entry.IsDir() && strings.EqualFold(filepath.Ext(entry.Name()), ".md") {
			files = append(files, filepath.Join(root, entry.Name()))
		}
	}
	return files, nil
}

func buildWikiIndex(pagePaths []string) (*wikiIndex, error) {
	index := newWikiIndex()

	for _, path := range pagePaths {
		name := filepath.Base(path)
		pageName := strings.TrimSuffix(name, filepath.Ext(name))
		page := &wikiPage{Name: pageName, Headings: make(map[string][]wikiTarget)}
		index.Pages[normalizeWikiName(pageName)] = page

		content, err := os.ReadFile(path)
		if err != nil {
			return nil, fmt.Errorf("read %s: %w", path, err)
		}

		var pendingIcon string
		anchorCounts := make(map[string]int)
		for _, line := range strings.Split(string(content), "\n") {
			trimmed := strings.TrimSpace(line)
			if trimmed == "" {
				continue
			}

			if match := imagePattern.FindString(line); match != "" && height40Pattern.MatchString(match) {
				if src := srcPattern.FindStringSubmatch(match); len(src) == 2 {
					pendingIcon = src[1]
					continue
				}
			}
			if match := wikiEmbedPattern.FindStringSubmatch(trimmed); len(match) == 2 {
				pendingIcon = strings.TrimSpace(match[1])
				continue
			}

			heading := headingPattern.FindStringSubmatch(line)
			if len(heading) != 2 {
				pendingIcon = ""
				continue
			}

			name := cleanHeadingName(heading[1])
			if name == "" {
				pendingIcon = ""
				continue
			}

			baseAnchor := githubAnchor(name)
			anchor := baseAnchor
			if count := anchorCounts[baseAnchor]; count > 0 {
				anchor = fmt.Sprintf("%s-%d", baseAnchor, count)
			}
			anchorCounts[baseAnchor]++

			var icons []string
			if pendingIcon != "" {
				icons = []string{pendingIcon}
			}
			target := wikiTarget{Name: name, Page: pageName, Anchor: anchor, Icons: icons}
			key := normalizeWikiName(name)
			page.Headings[key] = append(page.Headings[key], target)
			index.Headings[key] = append(index.Headings[key], target)

			if strings.HasPrefix(strings.TrimSpace(line), "# ") {
				index.Pages[key] = page
			}
			pendingIcon = ""
		}
	}

	return index, nil
}

func (index *wikiIndex) loadConcepts(path string) error {
	content, err := os.ReadFile(path)
	if err != nil {
		return fmt.Errorf("read Wiki link registry %s: %w", path, err)
	}
	var config wikiLinkConfig
	if err := yaml.Unmarshal(content, &config); err != nil {
		return fmt.Errorf("parse Wiki link registry %s: %w", path, err)
	}
	for name, concept := range config.Concepts {
		if strings.TrimSpace(concept.Href) == "" {
			return fmt.Errorf("Wiki link concept %q has no href", name)
		}
		if concept.Icon != "" && len(concept.Icons) != 0 {
			return fmt.Errorf("Wiki link concept %q defines both icon and icons", name)
		}
		icons := concept.Icons
		if concept.Icon != "" {
			icons = []string{concept.Icon}
		}
		for _, icon := range icons {
			if strings.TrimSpace(icon) == "" {
				return fmt.Errorf("Wiki link concept %q has an empty icon", name)
			}
			iconPath := filepath.Join(filepath.Dir(path), filepath.FromSlash(icon))
			if info, err := os.Stat(iconPath); err != nil || info.IsDir() {
				return fmt.Errorf("Wiki link concept %q references missing icon %s", name, icon)
			}
		}
		target := wikiTarget{
			Name:  name,
			Href:  concept.Href,
			Icons: icons,
		}
		names := append([]string{name}, concept.Aliases...)
		for _, alias := range names {
			key := normalizeWikiName(alias)
			if key == "" {
				return fmt.Errorf("Wiki link concept %q has an empty alias", name)
			}
			if existing, found := index.Concepts[key]; found {
				return fmt.Errorf("Wiki link name %q is defined by both %q and %q", alias, existing.Name, name)
			}
			index.Concepts[key] = target
		}
	}
	return nil
}

func expandWikiLinks(source []byte, currentPage string, index *wikiIndex) ([]byte, bool, error) {
	document := markdownParser.Parse(text.NewReader(source))
	codeRanges, htmlRanges := markdownSourceRanges(document)

	var result bytes.Buffer
	result.Grow(len(source))
	cursor := 0
	changed := false

	for _, match := range wikiLinkPattern.FindAllSubmatchIndex(source, -1) {
		start, end := match[0], match[1]
		if overlapsAny(start, end, codeRanges) {
			continue
		}

		prefix := string(source[match[2]:match[3]])
		inner := strings.TrimSpace(string(source[match[4]:match[5]]))
		// GitHub does not expand Wiki syntax inside raw HTML blocks.
		replacement, err := expandWikiLink(prefix, inner, currentPage, index, overlapsAny(start, end, htmlRanges))
		if err != nil {
			return nil, false, err
		}

		result.Write(source[cursor:start])
		result.WriteString(replacement)
		cursor = end
		changed = true
	}

	if !changed {
		return source, false, nil
	}
	result.Write(source[cursor:])
	return result.Bytes(), true, nil
}

func expandWikiLink(prefix string, inner string, currentPage string, index *wikiIndex, inHTML bool) (string, error) {
	if inner == "" {
		return "", fmt.Errorf("empty wiki link")
	}

	display, target := parseWikiLink(inner)
	switch prefix {
	case "!":
		if strings.Contains(inner, "|") {
			return "", fmt.Errorf("embedded image %q cannot have display text", inner)
		}
		return renderWikiImage(target), nil
	case "?":
		return renderBG3WikiSearchLink(display, target), nil
	}

	resolved, err := index.resolve(target, currentPage)
	if err != nil {
		return "", fmt.Errorf("resolve [[%s]]: %w", inner, err)
	}
	return renderWikiLink(display, resolved, currentPage, inHTML), nil
}

func markdownSourceRanges(document ast.Node) (codeRanges []sourceRange, htmlRanges []sourceRange) {
	_ = ast.Walk(document, func(node ast.Node, entering bool) (ast.WalkStatus, error) {
		if !entering {
			return ast.WalkContinue, nil
		}
		switch typed := node.(type) {
		case *ast.FencedCodeBlock:
			if block, ok := blockRange(typed.Lines()); ok {
				codeRanges = append(codeRanges, block)
			}
		case *ast.CodeBlock:
			if block, ok := blockRange(typed.Lines()); ok {
				codeRanges = append(codeRanges, block)
			}
		case *ast.CodeSpan:
			if textNode, ok := typed.FirstChild().(*ast.Text); ok {
				codeRanges = append(codeRanges, sourceRange{Start: textNode.Segment.Start, End: textNode.Segment.Stop})
			}
		case *ast.HTMLBlock:
			if block, ok := blockRange(typed.Lines()); ok {
				if typed.HasClosure() {
					block.End = typed.ClosureLine.Stop
				}
				htmlRanges = append(htmlRanges, block)
			}
		}
		return ast.WalkContinue, nil
	})
	return codeRanges, htmlRanges
}

func blockRange(lines *text.Segments) (sourceRange, bool) {
	if lines.Len() == 0 {
		return sourceRange{}, false
	}
	return sourceRange{
		Start: lines.At(0).Start,
		End:   lines.At(lines.Len() - 1).Stop,
	}, true
}

func overlapsAny(start int, end int, ranges []sourceRange) bool {
	for _, candidate := range ranges {
		if start < candidate.End && end > candidate.Start {
			return true
		}
	}
	return false
}

func parseWikiLink(value string) (display string, target string) {
	parts := strings.SplitN(value, "|", 2)
	if len(parts) == 1 {
		value := strings.TrimSpace(parts[0])
		return value, value
	}
	return strings.TrimSpace(parts[1]), strings.TrimSpace(parts[0])
}

func (index *wikiIndex) resolve(reference string, currentPage string) (wikiTarget, error) {
	reference = strings.TrimSpace(reference)
	if concept, ok := index.Concepts[normalizeWikiName(reference)]; ok {
		return concept, nil
	}
	pageReference, fragment, hasFragment := strings.Cut(reference, "#")
	pageReference = strings.TrimSpace(pageReference)
	fragment = strings.TrimSpace(fragment)

	if hasFragment {
		page := index.Pages[normalizeWikiName(pageReference)]
		if pageReference == "" {
			page = index.Pages[normalizeWikiName(currentPage)]
		}
		if page == nil {
			return wikiTarget{}, fmt.Errorf("unknown page %q", pageReference)
		}
		matches := page.Headings[normalizeWikiName(fragment)]
		if len(matches) == 0 {
			for _, candidates := range page.Headings {
				for _, candidate := range candidates {
					if normalizeWikiName(candidate.Anchor) == normalizeWikiName(fragment) {
						matches = append(matches, candidate)
					}
				}
			}
		}
		if len(matches) != 1 {
			return wikiTarget{}, fmt.Errorf("heading %q on %s resolved to %d entries", fragment, page.Name, len(matches))
		}
		return matches[0], nil
	}

	key := normalizeWikiName(reference)
	if page := index.Pages[key]; page != nil {
		return wikiTarget{Name: reference, Page: page.Name}, nil
	}

	if page := index.Pages[normalizeWikiName(currentPage)]; page != nil {
		if matches := page.Headings[key]; len(matches) == 1 {
			return matches[0], nil
		}
	}

	matches := index.Headings[key]
	if len(matches) == 1 {
		return matches[0], nil
	}
	if len(matches) == 0 {
		return wikiTarget{}, fmt.Errorf("no matching page or heading")
	}

	locations := make([]string, 0, len(matches))
	for _, match := range matches {
		locations = append(locations, match.Page+"#"+match.Anchor)
	}
	sort.Strings(locations)
	return wikiTarget{}, fmt.Errorf("ambiguous heading; use an explicit target (%s)", strings.Join(locations, ", "))
}

func renderWikiLink(display string, target wikiTarget, currentPage string, inHTML bool) string {
	href := wikiLinkHref(target, currentPage)
	if len(target.Icons) == 0 && !inHTML {
		if strings.HasPrefix(href, "https://") || strings.HasPrefix(href, "http://") {
			return fmt.Sprintf("[%s](%s)", display, href)
		}
		if normalizeWikiName(display) == normalizeWikiName(href) {
			return fmt.Sprintf("[[%s]]", display)
		}
		return fmt.Sprintf("[[%s | %s]]", href, display)
	}

	return renderWikiLinkHTML(display, target, href)
}

func wikiLinkHref(target wikiTarget, currentPage string) string {
	href := target.Href
	if href == "" {
		href = target.Page
	}
	if target.Anchor != "" {
		if normalizeWikiName(target.Page) == normalizeWikiName(currentPage) {
			href = "#" + target.Anchor
		} else {
			href += "#" + target.Anchor
		}
	}
	return href
}

func renderWikiLinkHTML(display string, target wikiTarget, href string) string {
	label := html.EscapeString(display)
	escapedHref := html.EscapeString(href)
	var images strings.Builder
	for _, icon := range target.Icons {
		fmt.Fprintf(
			&images,
			"<img src='%s' height='25' align='top' alt='%s' />",
			html.EscapeString(icon),
			html.EscapeString(target.Name),
		)
	}
	return fmt.Sprintf("<a href='%s'>%s%s</a>", escapedHref, images.String(), label)
}

func renderWikiImage(path string) string {
	return fmt.Sprintf(
		"<img src=\"%s\" height=\"40\" align=\"left\" alt=\"\" />",
		html.EscapeString(path),
	)
}

func renderBG3WikiSearchLink(display string, search string) string {
	href := "https://bg3.wiki/w/index.php?go=Go&search=" + url.QueryEscape(search)
	return fmt.Sprintf(
		"<a href='%s'>%s</a>",
		html.EscapeString(href),
		html.EscapeString(display),
	)
}

func cleanHeadingName(value string) string {
	value = imagePattern.ReplaceAllString(value, "")
	value = wikiHeadingPattern.ReplaceAllStringFunc(value, func(raw string) string {
		display, _ := parseWikiLink(raw[2 : len(raw)-2])
		return display
	})
	value = markdownLinkPattern.ReplaceAllString(value, "$1")
	value = htmlTagPattern.ReplaceAllString(value, "")
	value = strings.NewReplacer("**", "", "__", "", "`", "").Replace(value)
	return strings.TrimSpace(html.UnescapeString(value))
}

func normalizeWikiName(value string) string {
	value = strings.TrimSpace(strings.TrimSuffix(filepath.ToSlash(value), ".md"))
	value = strings.ReplaceAll(value, "_", " ")
	value = strings.ReplaceAll(value, "-", " ")
	return strings.ToLower(strings.Join(strings.Fields(value), " "))
}

func githubAnchor(value string) string {
	value = strings.ToLower(cleanHeadingName(value))
	var result strings.Builder
	lastWasSpace := false
	for _, char := range value {
		switch {
		case unicode.IsLetter(char), unicode.IsDigit(char), char == '-', char == '_':
			result.WriteRune(char)
			lastWasSpace = false
		case unicode.IsSpace(char):
			if result.Len() > 0 && !lastWasSpace {
				result.WriteByte('-')
				lastWasSpace = true
			}
		}
	}
	return strings.Trim(result.String(), "-")
}
