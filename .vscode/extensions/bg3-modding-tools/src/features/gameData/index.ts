import type * as vscode from "vscode";
import {
  GameDataDeclarationIndex,
  isSourceFile,
  SOURCE_FILES_PATTERN
} from "./declarationIndex";
import {
  clickableDecorationRanges,
  DEFINITION_SELECTOR,
  definitionLinksFor,
  DOCUMENT_SYMBOL_SELECTOR,
  IDENTIFIER_PATTERN,
  provideDocumentSymbols
} from "./navigation";
import { findReferences } from "./references";

export function registerGameDataFeatures(
  vscodeApi: typeof vscode,
  context: vscode.ExtensionContext
): void {
  const declarationIndex = new GameDataDeclarationIndex(vscodeApi);
  const watcher = vscodeApi.workspace.createFileSystemWatcher(
    SOURCE_FILES_PATTERN
  );
  const clickableDecorationType =
    vscodeApi.window.createTextEditorDecorationType({
      textDecoration: "underline"
    });
  const pendingDocumentUpdates = new Map<
    string,
    ReturnType<typeof setTimeout>
  >();
  let pendingDecorationUpdate:
    | ReturnType<typeof setTimeout>
    | undefined;

  const updateVisibleDecorations = (): void => {
    for (const editor of vscodeApi.window.visibleTextEditors) {
      editor.setDecorations(
        clickableDecorationType,
        clickableDecorationRanges(
          vscodeApi,
          editor.document,
          declarationIndex
        )
      );
    }
  };

  function scheduleVisibleDecorationUpdate(delay = 0): void {
    clearTimeout(pendingDecorationUpdate);
    pendingDecorationUpdate = setTimeout(async () => {
      await declarationIndex.ready;
      updateVisibleDecorations();
      pendingDecorationUpdate = undefined;
    }, delay);
  }

  const updateFromDisk = async (uri: vscode.Uri): Promise<void> => {
    await declarationIndex.ready;
    if (isSourceFile(vscodeApi, uri)) {
      await declarationIndex.loadUri(uri);
      scheduleVisibleDecorationUpdate();
    }
  };

  const updateFromDocument = (document: vscode.TextDocument): void => {
    if (!isSourceFile(vscodeApi, document.uri)) {
      return;
    }

    const key = document.uri.toString();
    clearTimeout(pendingDocumentUpdates.get(key));
    pendingDocumentUpdates.set(
      key,
      setTimeout(async () => {
        await declarationIndex.ready;
        declarationIndex.setText(document.uri, document.getText());
        pendingDocumentUpdates.delete(key);
      }, 150)
    );
  };

  context.subscriptions.push(
    vscodeApi.languages.registerDocumentSymbolProvider(
      DOCUMENT_SYMBOL_SELECTOR,
      {
        provideDocumentSymbols(document, token) {
          return provideDocumentSymbols(vscodeApi, document, token);
        }
      },
      {
        label: "BG3 Game Data"
      }
    ),
    vscodeApi.languages.registerDefinitionProvider(
      DEFINITION_SELECTOR,
      {
        async provideDefinition(document, position, token) {
          const wordRange = document.getWordRangeAtPosition(
            position,
            IDENTIFIER_PATTERN
          );
          if (!wordRange || token.isCancellationRequested) {
            return undefined;
          }

          await declarationIndex.ready;
          declarationIndex.setText(document.uri, document.getText());

          if (token.isCancellationRequested) {
            return undefined;
          }

          const name = document.getText(wordRange);
          const definitions = declarationIndex.definitionsFor(name);
          return definitions.length > 0
            ? definitionLinksFor(wordRange, definitions)
            : undefined;
        }
      }
    ),
    vscodeApi.languages.registerReferenceProvider(
      DEFINITION_SELECTOR,
      {
        async provideReferences(
          document,
          position,
          referenceContext,
          token
        ) {
          const wordRange = document.getWordRangeAtPosition(
            position,
            IDENTIFIER_PATTERN
          );
          if (!wordRange || token.isCancellationRequested) {
            return undefined;
          }

          await declarationIndex.ready;
          declarationIndex.setText(document.uri, document.getText());

          const name = document.getText(wordRange);
          if (
            token.isCancellationRequested ||
            !declarationIndex.hasDefinition(name)
          ) {
            return undefined;
          }

          return findReferences(
            vscodeApi,
            declarationIndex,
            document,
            name,
            referenceContext.includeDeclaration,
            token
          );
        }
      }
    ),
    vscodeApi.languages.registerHoverProvider(DEFINITION_SELECTOR, {
      async provideHover(document, position, token) {
        const wordRange = document.getWordRangeAtPosition(
          position,
          IDENTIFIER_PATTERN
        );
        if (!wordRange || token.isCancellationRequested) {
          return undefined;
        }

        await declarationIndex.ready;
        declarationIndex.setText(document.uri, document.getText());

        if (token.isCancellationRequested) {
          return undefined;
        }

        const name = document.getText(wordRange);
        const contents = declarationIndex.localizationHoverFor(name);
        return contents.length > 0
          ? new vscodeApi.Hover(contents, wordRange)
          : undefined;
      }
    }),
    vscodeApi.languages.registerWorkspaceSymbolProvider({
      async provideWorkspaceSymbols(query, token) {
        await declarationIndex.ready;
        return declarationIndex.workspaceSymbolsFor(query, token);
      }
    }),
    vscodeApi.workspace.onDidChangeTextDocument((event) => {
      updateFromDocument(event.document);
      scheduleVisibleDecorationUpdate(175);
    }),
    vscodeApi.window.onDidChangeVisibleTextEditors(() => {
      scheduleVisibleDecorationUpdate();
    }),
    watcher,
    watcher.onDidCreate(updateFromDisk),
    watcher.onDidChange(updateFromDisk),
    watcher.onDidDelete(async (uri) => {
      await declarationIndex.ready;
      declarationIndex.removeUri(uri);
      scheduleVisibleDecorationUpdate();
    }),
    clickableDecorationType,
    {
      dispose() {
        for (const timeout of pendingDocumentUpdates.values()) {
          clearTimeout(timeout);
        }
        pendingDocumentUpdates.clear();
        clearTimeout(pendingDecorationUpdate);
      }
    }
  );

  scheduleVisibleDecorationUpdate();
}
