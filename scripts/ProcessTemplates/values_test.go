package main

import (
	stdjson "encoding/json"
	"os"
	"path/filepath"
	"testing"
)

func TestBuildValuesMapMergesSources(t *testing.T) {
	previousDestination, previousResultValues := destination, resultValues
	t.Cleanup(func() {
		destination, resultValues = previousDestination, previousResultValues
	})
	dir := t.TempDir()
	destination = filepath.Join(dir, "output")
	resultValues = ""
	values := make(Values)
	sources := []struct {
		filename string
		content  string
	}{
		{"Values.yaml", `FirstMod: true
Enabled: true
Count: 3
Text: original
Clear:
  Old: true
List: [one, two]
EmptyList: [one]
EmptyMap:
  Keep: true
Nested:
  Keep: original
  Replace: original
MapToScalar:
  Old: true
ScalarToMap: original
`},
		{"Values.yaml", `SecondMod: true
Enabled: false
Count: 0
Text: ""
Clear: null
List: [three]
EmptyList: []
EmptyMap: {}
Nested:
  Replace: later
  Added: true
MapToScalar: later
ScalarToMap:
  New: true
`},
		{"Values.Nested.yaml", "Dotted: true\n"},
		{"Values.yaml", "Nested:\n  AfterDotted: true\n"},
	}
	for i, source := range sources {
		root := filepath.Join(dir, string(rune('a'+i)))
		if err := os.MkdirAll(root, 0755); err != nil {
			t.Fatal(err)
		}
		if err := os.WriteFile(filepath.Join(root, source.filename), []byte(source.content), 0644); err != nil {
			t.Fatal(err)
		}
		if err := buildValuesMap(root, &values); err != nil {
			t.Fatal(err)
		}
	}
	got, err := stdjson.Marshal(values)
	if err != nil {
		t.Fatal(err)
	}
	want := `{"Values":{"Clear":null,"Count":0,"EmptyList":[],"EmptyMap":{"Keep":true},"Enabled":false,"FirstMod":true,"List":["three"],"MapToScalar":"later","Nested":{"Added":true,"AfterDotted":true,"Dotted":true,"Keep":"original","Replace":"later"},"ScalarToMap":{"New":true},"SecondMod":true,"Text":""}}`
	if string(got) != want {
		t.Fatalf("unexpected merged values:\n%s\nwant:\n%s", got, want)
	}
}

func TestBuildValuesMapDottedPathReplacesScalar(t *testing.T) {
	previousDestination, previousResultValues := destination, resultValues
	t.Cleanup(func() {
		destination, resultValues = previousDestination, previousResultValues
	})
	dir := t.TempDir()
	destination = filepath.Join(dir, "output")
	resultValues = ""
	values := Values{"Settings": "old"}
	path := filepath.Join(dir, "Settings.Nested.yaml")
	if err := os.WriteFile(path, []byte("Enabled: false\n"), 0644); err != nil {
		t.Fatal(err)
	}
	if err := buildValuesMap(path, &values); err != nil {
		t.Fatal(err)
	}
	got, err := stdjson.Marshal(values)
	if err != nil {
		t.Fatal(err)
	}
	if string(got) != `{"Settings":{"Nested":{"Enabled":false}}}` {
		t.Fatalf("unexpected dotted values: %s", got)
	}
}
