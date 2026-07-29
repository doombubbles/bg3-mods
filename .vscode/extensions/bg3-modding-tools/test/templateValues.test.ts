import assert from "node:assert/strict";
import test from "node:test";
import type * as vscode from "vscode";
import { provideTemplateValueCompletions } from "../src/features/templateValues/completions";
import {
  templateValueCompletionContext,
  valueNodeAtPath,
  valuePreview,
  valueTreeFromYamlFiles
} from "../src/features/templateValues/model";
import { TemplateValueIndex } from "../src/features/templateValues/valueIndex";
import {
  asVscodeApi,
  createDocument,
  createUri,
  createVscodeMock
} from "./vscodeMock";

test("value tree mirrors dotted YAML filenames and nested mappings", () => {
  const tree = valueTreeFromYamlFiles([
    {
      relativePath: "Mod/Values.yaml",
      text: "Enabled: true\nCombat:\n  CriticalChance: 5\n"
    },
    {
      relativePath: "Mod/Paladin.Dice.yaml",
      text: "Judgement: LevelMapValue(2HolyDie)\n"
    },
    {
      relativePath: "Mod/Broken.yaml",
      text: "Invalid: ["
    }
  ]);

  assert.equal(
    valueNodeAtPath(tree, ["Values", "Enabled"])?.value,
    true
  );
  assert.equal(
    valueNodeAtPath(tree, [
      "Values",
      "Combat",
      "CriticalChance"
    ])?.value,
    5
  );
  assert.equal(
    valueNodeAtPath(tree, ["Paladin", "Dice", "Judgement"])
      ?.value,
    "LevelMapValue(2HolyDie)"
  );
  assert.equal(tree.children.has("Broken"), false);
  assert.equal(
    valuePreview(valueNodeAtPath(tree, ["Values"])!),
    "2 values"
  );
});

test("completion YAML parser handles common presentation syntax", () => {
  const tree = valueTreeFromYamlFiles([
    {
      relativePath: "Mod/Presentation.yaml",
      text: [
        "'Quoted Key': 12 # inline comment",
        "Description: |",
        "  text: that is not a mapping",
        "Icons:",
        "  - First",
        "  - Second",
        "After: false"
      ].join("\n")
    }
  ]);

  assert.equal(
    valueNodeAtPath(tree, ["Presentation", "Quoted Key"])
      ?.value,
    12
  );
  assert.equal(
    valueNodeAtPath(tree, ["Presentation", "After"])?.value,
    false
  );
  assert.equal(
    valueNodeAtPath(tree, [
      "Presentation",
      "Description",
      "text"
    ]),
    undefined
  );
  assert.equal(
    valueNodeAtPath(tree, ["Presentation", "Icons"])?.children
      .size,
    0
  );
});

test("completion context recognizes only open root-value actions", () => {
  assert.deepEqual(
    templateValueCompletionContext("value {{ $.Values.Com"),
    {
      parentPath: ["Values"],
      partial: "Com",
      replaceStart: 18
    }
  );
  assert.deepEqual(templateValueCompletionContext("{{ $."), {
    parentPath: [],
    partial: "",
    replaceStart: 5
  });
  assert.equal(
    templateValueCompletionContext("{{ $.Values }} later"),
    undefined
  );
  assert.equal(
    templateValueCompletionContext("ordinary $.Values"),
    undefined
  );
});

test("index scopes YAML values to the nearest mod root", async () => {
  const index = new TemplateValueIndex(
    asVscodeApi(
      createVscodeMock({
        "First/Values.yaml": "Name: First\n",
        "First/Nested.Options.yaml": "Enabled: true\n",
        "Second/Values.yaml": "Name: Second\n"
      })
    )
  );
  await index.ready;

  const first = index.treeFor(
    createUri("First/Public/First/Stats/Test.txt")
  );
  assert.equal(
    valueNodeAtPath(first!, ["Values", "Name"])?.value,
    "First"
  );
  assert.equal(
    valueNodeAtPath(first!, ["Nested", "Options", "Enabled"])
      ?.value,
    true
  );
  assert.equal(
    valueNodeAtPath(first!, ["Values", "Name"])?.value,
    "First"
  );

  index.setText(
    createUri("First/Values.yaml"),
    "Name: Updated\n"
  );
  assert.equal(
    valueNodeAtPath(
      index.treeFor(
        createUri("First/Public/First/Stats/Test.txt")
      )!,
      ["Values", "Name"]
    )?.value,
    "Updated"
  );
  index.removeUri(createUri("First/Values.yaml"));
  assert.equal(
    index.treeFor(createUri("First/Public/First/Stats/Test.txt")),
    undefined
  );
});

test("completion provider filters and replaces the partial key", async () => {
  const vscodeMock = createVscodeMock({
    "Mod/Values.yaml": [
      "Enabled: true",
      "EnemyHealth: 125",
      "Nested:",
      "  Child: value"
    ].join("\n")
  });
  const vscodeApi = asVscodeApi(vscodeMock);
  const index = new TemplateValueIndex(vscodeApi);
  await index.ready;
  const text = "value {{ $.Values.En";
  const document = createDocument(
    "Mod/Public/Mod/Stats/Test.txt",
    text
  );

  const items = provideTemplateValueCompletions(
    vscodeApi,
    index,
    document,
    document.positionAt(text.length)
  );

  assert.deepEqual(
    items?.map((item) => item.label),
    ["Enabled", "EnemyHealth"]
  );
  assert.equal(items?.[0]?.detail, "true");
  assert.equal(
    (items?.[0]?.range as vscode.Range).start.character,
    text.length - 2
  );

  const nestedText = "{{ $.Values.Nested.";
  const nestedDocument = createDocument(
    "Mod/Public/Mod/Stats/Test.txt",
    nestedText
  );
  const nestedItems = provideTemplateValueCompletions(
    vscodeApi,
    index,
    nestedDocument,
    nestedDocument.positionAt(nestedText.length)
  );
  assert.deepEqual(
    nestedItems?.map((item) => item.label),
    ["Child"]
  );
});
