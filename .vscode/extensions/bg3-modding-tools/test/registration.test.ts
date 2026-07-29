import assert from "node:assert/strict";
import test from "node:test";
import type * as vscode from "vscode";
import { registerGameDataFeatures } from "../src/features/gameData";
import {
  asVscodeApi,
  cancellationToken,
  createDocument,
  createVscodeMock
} from "./vscodeMock";

const HANDLE = "h12345678g1234g1234g1234g123456789012";

function disposable(): vscode.Disposable {
  return {
    dispose() {}
  };
}

function wordRangeFor(
  document: vscode.TextDocument,
  text: string
): vscode.Range {
  const source = document.getText();
  const start = source.indexOf(text);
  return {
    start: document.positionAt(start),
    end: document.positionAt(start + text.length)
  } as vscode.Range;
}

interface RegisteredProviders {
  documentSymbols?: vscode.DocumentSymbolProvider;
  definitions?: vscode.DefinitionProvider;
  references?: vscode.ReferenceProvider;
  hover?: vscode.HoverProvider;
  workspaceSymbols?: vscode.WorkspaceSymbolProvider;
}

test("feature registration wires providers and serves indexed results", async () => {
  const files: Record<string, string> = {
    "Mod/Public/Mod/Stats/Generated/Data/Spells.txt": [
      'new entry "Target_TestSpell"',
      'type "SpellData"'
    ].join("\n"),
    "Mod/Localization/English/Mod.loca.xml":
      `<content contentuid="${HANDLE}" version="1">Localized Name</content>`,
    "Wiki/References.md": `The localized name is ${HANDLE}.`
  };
  const vscodeMock = createVscodeMock(files);
  const providers: RegisteredProviders = {};
  const watcherCallbacks: {
    create?: (uri: vscode.Uri) => unknown;
    change?: (uri: vscode.Uri) => unknown;
    delete?: (uri: vscode.Uri) => unknown;
  } = {};
  const eventCallbacks: {
    documentChange?: (
      event: vscode.TextDocumentChangeEvent
    ) => unknown;
    visibleEditors?: () => unknown;
  } = {};
  const decorations: vscode.Range[][] = [];

  vscodeMock.languages = {
    registerDocumentSymbolProvider(
      _selector: vscode.DocumentSelector,
      provider: vscode.DocumentSymbolProvider
    ) {
      providers.documentSymbols = provider;
      return disposable();
    },
    registerDefinitionProvider(
      _selector: vscode.DocumentSelector,
      provider: vscode.DefinitionProvider
    ) {
      providers.definitions = provider;
      return disposable();
    },
    registerReferenceProvider(
      _selector: vscode.DocumentSelector,
      provider: vscode.ReferenceProvider
    ) {
      providers.references = provider;
      return disposable();
    },
    registerHoverProvider(
      _selector: vscode.DocumentSelector,
      provider: vscode.HoverProvider
    ) {
      providers.hover = provider;
      return disposable();
    },
    registerWorkspaceSymbolProvider(
      provider: vscode.WorkspaceSymbolProvider
    ) {
      providers.workspaceSymbols = provider;
      return disposable();
    }
  };
  vscodeMock.workspace.createFileSystemWatcher = () => ({
    ...disposable(),
    onDidCreate(callback: (uri: vscode.Uri) => unknown) {
      watcherCallbacks.create = callback;
      return disposable();
    },
    onDidChange(callback: (uri: vscode.Uri) => unknown) {
      watcherCallbacks.change = callback;
      return disposable();
    },
    onDidDelete(callback: (uri: vscode.Uri) => unknown) {
      watcherCallbacks.delete = callback;
      return disposable();
    }
  });
  vscodeMock.workspace.onDidChangeTextDocument = (
    callback: (event: vscode.TextDocumentChangeEvent) => unknown
  ) => {
    eventCallbacks.documentChange = callback;
    return disposable();
  };
  const mockWindow = {
    visibleTextEditors: [] as vscode.TextEditor[],
    createTextEditorDecorationType() {
      return disposable();
    },
    onDidChangeVisibleTextEditors(callback: () => unknown) {
      eventCallbacks.visibleEditors = callback;
      return disposable();
    }
  };
  vscodeMock.window = mockWindow;
  vscodeMock.Hover = class Hover {
    constructor(
      readonly contents: vscode.MarkdownString[],
      readonly range: vscode.Range
    ) {}
  };

  const context = {
    subscriptions: [] as vscode.Disposable[]
  } as unknown as vscode.ExtensionContext;
  registerGameDataFeatures(asVscodeApi(vscodeMock), context);

  assert.ok(providers.documentSymbols);
  assert.ok(providers.definitions);
  assert.ok(providers.references);
  assert.ok(providers.hover);
  assert.ok(providers.workspaceSymbols);
  assert.ok(watcherCallbacks.change);
  assert.ok(eventCallbacks.documentChange);

  const token = cancellationToken();
  const workspaceSymbols = await providers.workspaceSymbols
    .provideWorkspaceSymbols("Localized Name", token);
  assert.ok(Array.isArray(workspaceSymbols));
  assert.equal(workspaceSymbols[0]?.name, "Localized Name");

  const markdownDocument = createDocument("notes.md", HANDLE);
  const handleRange = wordRangeFor(markdownDocument, HANDLE);
  markdownDocument.getWordRangeAtPosition = () => handleRange;

  const definitions = await providers.definitions.provideDefinition(
    markdownDocument,
    handleRange.start,
    token
  );
  assert.ok(Array.isArray(definitions));
  assert.equal(definitions.length, 1);
  assert.equal(
    (definitions[0] as vscode.LocationLink).originSelectionRange,
    handleRange
  );

  const references = await providers.references.provideReferences(
    markdownDocument,
    handleRange.start,
    { includeDeclaration: false },
    token
  );
  assert.ok(Array.isArray(references));
  assert.equal(references.length, 2);
  assert.deepEqual(
    references.map((reference) => reference.uri.toString()),
    [
      markdownDocument.uri.toString(),
      createDocument("Wiki/References.md", "").uri.toString()
    ]
  );

  const referencesWithDeclaration =
    await providers.references.provideReferences(
      markdownDocument,
      handleRange.start,
      { includeDeclaration: true },
      token
    );
  assert.ok(Array.isArray(referencesWithDeclaration));
  assert.equal(referencesWithDeclaration.length, 3);

  const hover = await providers.hover.provideHover(
    markdownDocument,
    handleRange.start,
    token
  );
  assert.ok(hover);
  assert.deepEqual(hover.contents, ["Localized Name"]);

  const localizationDocument = createDocument(
    "Mod/Localization/English/Mod.loca.xml",
    files["Mod/Localization/English/Mod.loca.xml"]!
  );
  const symbols =
    await providers.documentSymbols.provideDocumentSymbols(
      localizationDocument,
      token
    );
  assert.ok(Array.isArray(symbols));
  assert.equal(symbols[0]?.name, "Localized Name");

  mockWindow.visibleTextEditors = [
    {
      document: markdownDocument,
      setDecorations(
        _type: vscode.TextEditorDecorationType,
        ranges: readonly vscode.Range[]
      ) {
        decorations.push([...ranges]);
      }
    } as vscode.TextEditor
  ];
  await eventCallbacks.visibleEditors?.();
  await new Promise((resolve) => setTimeout(resolve, 10));
  assert.equal(decorations.at(-1)?.length, 1);

  for (const subscription of context.subscriptions) {
    subscription.dispose();
  }
});
