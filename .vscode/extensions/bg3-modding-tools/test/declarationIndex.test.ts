import assert from "node:assert/strict";
import test from "node:test";
import {
  GameDataDeclarationIndex,
  isSourceFile
} from "../src/features/gameData/declarationIndex";
import {
  asVscodeApi,
  cancellationToken,
  createUri,
  createVscodeMock
} from "./vscodeMock";

const HANDLE = "h12345678g1234g1234g1234g123456789012";
const ROOT_TEMPLATE_UUID =
  "11111111-1111-1111-1111-111111111111";
const CLASS_UUID = "22222222-2222-2222-2222-222222222222";
const PROGRESSION_UUID =
  "33333333-3333-3333-3333-333333333333";

const FILES: Record<string, string> = {
  "Mod/Public/Mod/Stats/Generated/Data/Spells.txt": [
    'new entry "Target_TestSpell"',
    'type "SpellData"'
  ].join("\n"),
  "Mod/Localization/English/Mod.loca.xml":
    `<content contentuid="${HANDLE}" version="1">Localized Name</content>`,
  "Mod/Public/Mod/RootTemplates/Items.lsf.lsx": [
    '<node id="GameObjects">',
    `  <attribute id="MapKey" type="FixedString" value="${ROOT_TEMPLATE_UUID}" />`,
    '  <attribute id="Stats" type="FixedString" value="OBJ_TestItem" />',
    "</node>"
  ].join("\n"),
  "Mod/Public/Mod/ClassDescriptions/Test.ClassDescriptions.lsx": [
    '<node id="ClassDescription">',
    '  <attribute id="Name" type="FixedString" value="TestClass" />',
    `  <attribute id="ProgressionTableUUID" type="guid" value="${PROGRESSION_UUID}" />`,
    `  <attribute id="UUID" type="guid" value="${CLASS_UUID}" />`,
    "</node>"
  ].join("\n"),
  "bin/UnpackedData/Public/Shared/Stats/Generated/Data/Ignored.txt": [
    'new entry "Ignored_Unpacked_Entry"',
    'type "SpellData"'
  ].join("\n")
};

function createIndex(): GameDataDeclarationIndex {
  return new GameDataDeclarationIndex(
    asVscodeApi(createVscodeMock(FILES))
  );
}

test("declaration index resolves every supported format and aliases", async () => {
  const index = createIndex();
  await index.ready;

  assert.equal(index.definitionsFor("Target_TestSpell").length, 1);
  assert.equal(index.definitionsFor(HANDLE).length, 1);
  assert.equal(index.definitionsFor(ROOT_TEMPLATE_UUID).length, 1);
  assert.equal(index.definitionsFor(CLASS_UUID).length, 1);
  assert.equal(index.definitionsFor(PROGRESSION_UUID).length, 1);
  assert.equal(
    index.definitionsFor("Ignored_Unpacked_Entry").length,
    0
  );
  assert.equal(index.hasDefinition(PROGRESSION_UUID), true);
});

test("workspace symbols search display names and every identifier", async () => {
  const index = createIndex();
  await index.ready;
  const token = cancellationToken();

  assert.equal(
    index.workspaceSymbolsFor("Localized Name", token)[0]!.name,
    "Localized Name"
  );
  assert.equal(
    index.workspaceSymbolsFor("OBJ_TestItem", token)[0]!.name,
    "OBJ_TestItem"
  );
  assert.equal(
    index.workspaceSymbolsFor("TestClass", token)[0]!.name,
    "TestClass"
  );
  assert.equal(
    index.workspaceSymbolsFor(
      PROGRESSION_UUID.slice(0, 12),
      token
    )[0]!.name,
    "TestClass"
  );
  assert.equal(
    index.workspaceSymbolsFor("Target_Test", token)[0]!.name,
    "Target_TestSpell"
  );
});

test("localization hover content is indexed and deduplicated", async () => {
  const index = createIndex();
  await index.ready;

  assert.deepEqual(index.localizationHoverFor(HANDLE), [
    "Localized Name"
  ]);
  assert.deepEqual(index.localizationHoverFor(CLASS_UUID), []);
});

test("declaration index updates and removes individual source files", async () => {
  const index = createIndex();
  await index.ready;
  const spellUri = createUri(
    "Mod/Public/Mod/Stats/Generated/Data/Spells.txt"
  );

  index.setText(
    spellUri,
    ['new entry "Target_UpdatedSpell"', 'type "SpellData"'].join(
      "\n"
    )
  );
  assert.equal(index.hasDefinition("Target_TestSpell"), false);
  assert.equal(index.hasDefinition("Target_UpdatedSpell"), true);

  index.removeUri(spellUri);
  assert.equal(index.hasDefinition("Target_UpdatedSpell"), false);

  await index.loadUri(
    createUri("Mod/Public/Mod/Stats/Generated/Data/Missing.txt")
  );
  assert.equal(index.hasDefinition("Target_UpdatedSpell"), false);
});

test("source filtering includes authored sources and excludes generated roots", () => {
  const vscodeApi = asVscodeApi(createVscodeMock(FILES));

  assert.equal(
    isSourceFile(
      vscodeApi,
      createUri("Mod/Localization/English/Mod.loca.xml")
    ),
    true
  );
  assert.equal(
    isSourceFile(
      vscodeApi,
      createUri(
        "Mod/Public/Mod/ClassDescriptions/Test.ClassDescriptions.lsx"
      )
    ),
    true
  );
  assert.equal(
    isSourceFile(
      vscodeApi,
      createUri("Mod/Public/Mod/RootTemplates/Items.lsf.lsx")
    ),
    true
  );
  assert.equal(
    isSourceFile(
      vscodeApi,
      createUri(
        "bin/UnpackedData/Public/Shared/Stats/Generated/Data/Ignored.txt"
      )
    ),
    false
  );
  assert.equal(
    isSourceFile(
      vscodeApi,
      createUri("build/Mod/Generated.txt")
    ),
    false
  );
});
