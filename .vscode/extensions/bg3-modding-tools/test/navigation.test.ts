import assert from "node:assert/strict";
import test from "node:test";
import type * as vscode from "vscode";
import {
  clickableDecorationRanges,
  DEFINITION_SELECTOR,
  definitionLinksFor,
  provideDocumentSymbols,
  supportsDefinitionLinks
} from "../src/features/gameData/navigation";
import {
  asVscodeApi,
  cancellationToken,
  createDocument,
  createUri,
  createVscodeMock
} from "./vscodeMock";

const HANDLE = "h12345678g1234g1234g1234g123456789012";
const UUID = "11111111-1111-1111-1111-111111111111";

test("definition links preserve the complete clickable origin range", () => {
  const originSelectionRange = {
    start: 10,
    end: 46
  } as unknown as vscode.Range;
  const location = {
    uri: createUri("target.lsx"),
    range: { start: 1, end: 2 }
  } as unknown as vscode.Location;

  const [link] = definitionLinksFor(originSelectionRange, [location]);
  assert.ok(link);

  assert.equal(link.originSelectionRange, originSelectionRange);
  assert.equal(link.targetUri, location.uri);
  assert.equal(link.targetRange, location.range);
  assert.equal(link.targetSelectionRange, location.range);
});

test("definition and decoration support includes Markdown", () => {
  assert.equal(supportsDefinitionLinks(createUri("notes.md")), true);
  assert.equal(supportsDefinitionLinks(createUri("data.txt")), true);
  assert.equal(supportsDefinitionLinks(createUri("data.lsx")), true);
  assert.equal(supportsDefinitionLinks(createUri("script.khn")), true);
  assert.equal(supportsDefinitionLinks(createUri("data.json")), false);
  assert.ok(
    DEFINITION_SELECTOR.some(
      (selector) =>
        typeof selector !== "string" &&
        selector.pattern === "**/*.md"
    )
  );
});

test("decorations include only complete identifiers with definitions", () => {
  const unknownUuid =
    "99999999-9999-9999-9999-999999999999";
  const text = `${HANDLE} ${UUID} ${unknownUuid}`;
  const document = createDocument("notes.md", text);
  const vscodeApi = asVscodeApi(createVscodeMock());
  const known = new Set([HANDLE, UUID]);

  const ranges = clickableDecorationRanges(
    vscodeApi,
    document,
    {
      hasDefinition(name: string) {
        return known.has(name);
      }
    }
  );

  assert.deepEqual(
    ranges.map((range) => document.getText(range)),
    [HANDLE, UUID]
  );
});

test("localization document symbols show content and retain handle detail", () => {
  const text =
    `<content contentuid="${HANDLE}" version="1">Aura of Testing</content>`;
  const document = createDocument(
    "Mod/Localization/English/Mod.loca.xml",
    text
  );
  const vscodeApi = asVscodeApi(createVscodeMock());

  const [symbol] = provideDocumentSymbols(
    vscodeApi,
    document,
    cancellationToken()
  );
  assert.ok(symbol);

  assert.equal(symbol.name, "Aura of Testing");
  assert.equal(symbol.detail, HANDLE);
  assert.equal(document.getText(symbol.selectionRange), HANDLE);
});

test("root-template and class symbols use readable names", () => {
  const rootTemplateText = [
    '<node id="GameObjects">',
    `  <attribute id="MapKey" type="FixedString" value="${UUID}" />`,
    '  <attribute id="Stats" type="FixedString" value="OBJ_Test" />',
    "</node>"
  ].join("\n");
  const classText = [
    '<node id="ClassDescription">',
    '  <attribute id="Name" type="FixedString" value="TestClass" />',
    '  <attribute id="ProgressionTableUUID" type="guid" value="22222222-2222-2222-2222-222222222222" />',
    `  <attribute id="UUID" type="guid" value="${UUID}" />`,
    "</node>"
  ].join("\n");
  const vscodeApi = asVscodeApi(createVscodeMock());

  const [rootSymbol] = provideDocumentSymbols(
    vscodeApi,
    createDocument(
      "Mod/Public/Mod/RootTemplates/Items.lsf.lsx",
      rootTemplateText
    ),
    cancellationToken()
  );
  const [classSymbol] = provideDocumentSymbols(
    vscodeApi,
    createDocument(
      "Mod/Public/Mod/ClassDescriptions/Test.ClassDescriptions.lsx",
      classText
    ),
    cancellationToken()
  );
  assert.ok(rootSymbol);
  assert.ok(classSymbol);

  assert.equal(rootSymbol.name, "OBJ_Test");
  assert.equal(rootSymbol.detail, UUID);
  assert.equal(classSymbol.name, "TestClass");
  assert.match(classSymbol.detail, new RegExp(UUID));
});
