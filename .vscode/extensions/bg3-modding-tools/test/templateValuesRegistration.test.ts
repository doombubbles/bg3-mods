import assert from "node:assert/strict";
import test from "node:test";
import type * as vscode from "vscode";
import { registerTemplateValueFeatures } from "../src/features/templateValues";
import {
  asVscodeApi,
  cancellationToken,
  createDocument,
  createVscodeMock
} from "./vscodeMock";

function disposable(): vscode.Disposable {
  return { dispose() {} };
}

test("template-value registration serves completions and refreshes YAML", async () => {
  const vscodeMock = createVscodeMock({
    "Mod/Values.yaml": "Original: true\n"
  });
  let provider: vscode.CompletionItemProvider | undefined;
  let documentChange:
    | ((event: vscode.TextDocumentChangeEvent) => unknown)
    | undefined;
  const watcherCallbacks: {
    delete?: (uri: vscode.Uri) => unknown;
  } = {};

  vscodeMock.languages = {
    registerCompletionItemProvider(
      _selector: vscode.DocumentSelector,
      registeredProvider: vscode.CompletionItemProvider
    ) {
      provider = registeredProvider;
      return disposable();
    }
  };
  vscodeMock.workspace.createFileSystemWatcher = () => ({
    ...disposable(),
    onDidCreate() {
      return disposable();
    },
    onDidChange() {
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
    documentChange = callback;
    return disposable();
  };

  const context = {
    subscriptions: [] as vscode.Disposable[]
  } as unknown as vscode.ExtensionContext;
  registerTemplateValueFeatures(asVscodeApi(vscodeMock), context);
  assert.ok(provider);

  const templateText = "{{ $.Values.";
  const templateDocument = createDocument(
    "Mod/Public/Mod/Test.txt",
    templateText
  );
  const initial = await provider.provideCompletionItems(
    templateDocument,
    templateDocument.positionAt(templateText.length),
    cancellationToken(),
    {} as vscode.CompletionContext
  );
  assert.deepEqual(
    Array.isArray(initial)
      ? initial.map((item) => item.label)
      : [],
    ["Original"]
  );

  documentChange?.({
    document: createDocument(
      "Mod/Values.yaml",
      "Updated: true\n"
    )
  } as vscode.TextDocumentChangeEvent);
  const updated = await provider.provideCompletionItems(
    templateDocument,
    templateDocument.positionAt(templateText.length),
    cancellationToken(),
    {} as vscode.CompletionContext
  );
  assert.deepEqual(
    Array.isArray(updated)
      ? updated.map((item) => item.label)
      : [],
    ["Updated"]
  );

  watcherCallbacks.delete?.(
    createDocument("Mod/Values.yaml", "").uri
  );
  const removed = await provider.provideCompletionItems(
    templateDocument,
    templateDocument.positionAt(templateText.length),
    cancellationToken(),
    {} as vscode.CompletionContext
  );
  assert.equal(removed, undefined);

  for (const subscription of context.subscriptions) {
    subscription.dispose();
  }
});
