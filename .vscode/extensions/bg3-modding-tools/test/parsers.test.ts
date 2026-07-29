import assert from "node:assert/strict";
import test from "node:test";
import {
  decodeXmlEntities,
  localizationText,
  parseLocalizationEntries
} from "../src/features/gameData/parsers/localization";
import {
  parseClassDescriptionEntries,
  parseRootTemplateEntries
} from "../src/features/gameData/parsers/lsx";
import { parseStatsEntries } from "../src/features/gameData/parsers/stats";

test("stats parser returns entry names, types, and source ranges", () => {
  const text = [
    'new entry "Target_First"',
    'type "SpellData"',
    'data "DisplayName" "h123"',
    "",
    'new entry "SecondPassive"',
    'type "PassiveData"'
  ].join("\n");

  const entries = parseStatsEntries(text);

  assert.deepEqual(
    entries.map(({ name, type }) => ({ name, type })),
    [
      { name: "Target_First", type: "SpellData" },
      { name: "SecondPassive", type: "PassiveData" }
    ]
  );
  assert.equal(
    text.slice(
      entries[0]!.nameStartOffset,
      entries[0]!.nameEndOffset
    ),
    "Target_First"
  );
  assert.ok(entries[0]!.endOffset < entries[1]!.startOffset);
});

test("localization parser creates readable previews and hover text", () => {
  const text = [
    "<contentList>",
    '  <content contentuid="h12345678g1234g1234g1234g123456789012" version="1">',
    "    Gain &lt;LSTag Tooltip=\"ShortRest\"&gt;Short Rest&lt;/LSTag&gt;.&lt;br&gt;Ready.",
    "  </content>",
    "</contentList>"
  ].join("\n");

  const [entry] = parseLocalizationEntries(text);
  assert.ok(entry);

  assert.equal(
    entry.name,
    "h12345678g1234g1234g1234g123456789012"
  );
  assert.equal(entry.displayName, "Gain Short Rest. Ready.");
  assert.equal(entry.hoverText, "Gain Short Rest.\nReady.");
  assert.equal(
    decodeXmlEntities("&lt;tag&gt;&amp;&quot;&apos;"),
    '<tag>&"\''
  );
  assert.equal(localizationText("One&lt;br&gt;Two"), "One\nTwo");
});

test("root-template parser uses Stats and falls back to Name", () => {
  const text = [
    '<node id="GameObjects">',
    '  <attribute id="MapKey" type="FixedString" value="11111111-1111-1111-1111-111111111111" />',
    '  <attribute id="Name" type="LSString" value="Fallback_Name" />',
    '  <attribute id="Stats" type="FixedString" value="Stats_Name" />',
    "  <children>",
    '    <node id="Object">',
    '      <attribute id="MapKey" type="guid" value="22222222-2222-2222-2222-222222222222" />',
    "    </node>",
    "  </children>",
    "</node>",
    '<node id="GameObjects">',
    '  <attribute id="MapKey" type="FixedString" value="33333333-3333-3333-3333-333333333333" />',
    '  <attribute id="Name" type="LSString" value="Fallback_Only" />',
    "</node>"
  ].join("\n");

  const entries = parseRootTemplateEntries(text);

  assert.deepEqual(
    entries.map(({ name, displayName }) => ({ name, displayName })),
    [
      {
        name: "11111111-1111-1111-1111-111111111111",
        displayName: "Stats_Name"
      },
      {
        name: "33333333-3333-3333-3333-333333333333",
        displayName: "Fallback_Only"
      }
    ]
  );
  assert.ok(
    !entries.some(
      ({ name }) =>
        name === "22222222-2222-2222-2222-222222222222"
    )
  );
});

test("class-description parser exposes UUID and ProgressionTableUUID", () => {
  const text = [
    '<node id="ClassDescription">',
    '  <attribute id="Name" type="FixedString" value="MountainThane" />',
    '  <attribute id="ProgressionTableUUID" type="guid" value="aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa" />',
    '  <attribute id="UUID" type="guid" value="bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb" />',
    "</node>"
  ].join("\n");

  const [entry] = parseClassDescriptionEntries(text);
  assert.ok(entry);

  assert.equal(entry.displayName, "MountainThane");
  assert.equal(
    entry.name,
    "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"
  );
  assert.deepEqual(
    entry.aliases?.map(({ name }) => name),
    ["aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"]
  );
  assert.equal(
    entry.symbolDetail,
    "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb / aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
  );
});
