import type * as vscode from "vscode";
import {
  provideTemplateValueCompletions,
  TEMPLATE_VALUE_SELECTOR
} from "./completions";
import {
  TemplateValueIndex,
  YAML_FILES_PATTERN
} from "./valueIndex";

export function registerTemplateValueFeatures(
  vscodeApi: typeof vscode,
  context: vscode.ExtensionContext
): void {
  const index = new TemplateValueIndex(vscodeApi);
  const watcher = vscodeApi.workspace.createFileSystemWatcher(
    YAML_FILES_PATTERN
  );

  const updateFromDisk = async (uri: vscode.Uri): Promise<void> => {
    await index.ready;
    await index.loadUri(uri);
  };

  context.subscriptions.push(
    vscodeApi.languages.registerCompletionItemProvider(
      TEMPLATE_VALUE_SELECTOR,
      {
        async provideCompletionItems(document, position, token) {
          await index.ready;
          if (token.isCancellationRequested) {
            return undefined;
          }
          return provideTemplateValueCompletions(
            vscodeApi,
            index,
            document,
            position
          );
        }
      },
      "."
    ),
    vscodeApi.workspace.onDidChangeTextDocument((event) => {
      if (event.document.uri.path.toLowerCase().endsWith(".yaml")) {
        index.setText(event.document.uri, event.document.getText());
      }
    }),
    watcher,
    watcher.onDidCreate(updateFromDisk),
    watcher.onDidChange(updateFromDisk),
    watcher.onDidDelete((uri) => index.removeUri(uri))
  );
}
