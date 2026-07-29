import assert from "node:assert/strict";
import test from "node:test";
import { referenceLocationsInText } from "../src/features/gameData/references";
import {
  asVscodeApi,
  createUri,
  createVscodeMock
} from "./vscodeMock";

test("reference matching finds complete identifiers only", () => {
  const name = "Target_Test";
  const text = [
    name,
    `${name}_Extended`,
    `Prefix${name}`,
    `${name}-Suffix`,
    `(${name})`
  ].join(" ");
  const vscodeApi = asVscodeApi(createVscodeMock());

  const locations = referenceLocationsInText(
    vscodeApi,
    createUri("References.khn"),
    text,
    name
  );

  assert.equal(locations.length, 2);
  assert.equal(
    text.slice(
      locations[0]!.range.start.character,
      locations[0]!.range.end.character
    ),
    name
  );
});
