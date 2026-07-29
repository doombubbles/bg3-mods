import type * as vscode from "vscode";
import {
  templateValueCompletionContext,
  valueNodeAtPath,
  valuePreview
} from "./model";
import { TemplateValueIndex } from "./valueIndex";

export const TEMPLATE_VALUE_SELECTOR = [
  { scheme: "file", pattern: "**/*.txt" },
  { scheme: "file", pattern: "**/*.tmpl" },
  { scheme: "file", pattern: "**/*.lsx" },
  { scheme: "file", pattern: "**/*.loca.xml" },
  { scheme: "file", pattern: "**/*.khn" },
  { scheme: "file", pattern: "**/*.md" }
] satisfies vscode.DocumentSelector;

export function provideTemplateValueCompletions(
  vscodeApi: typeof vscode,
  index: TemplateValueIndex,
  document: vscode.TextDocument,
  position: vscode.Position
): vscode.CompletionItem[] | undefined {
  const cursorOffset = document.offsetAt(position);
  const context = templateValueCompletionContext(
    document.getText().slice(0, cursorOffset)
  );
  if (!context) {
    return undefined;
  }

  const root = index.treeFor(document.uri);
  const parent = root && valueNodeAtPath(root, context.parentPath);
  if (!parent) {
    return undefined;
  }

  const replaceRange = new vscodeApi.Range(
    document.positionAt(context.replaceStart),
    position
  );

  return [...parent.children.entries()]
    .filter(([name]) =>
      name.toLowerCase().startsWith(context.partial.toLowerCase())
    )
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([name, node]) => {
      const item = new vscodeApi.CompletionItem(
        name,
        node.children.size > 0
          ? vscodeApi.CompletionItemKind.Module
          : vscodeApi.CompletionItemKind.Value
      );
      item.range = replaceRange;
      item.detail = valuePreview(node);
      if (node.source) {
        item.documentation = `Defined by ${node.source}`;
      }
      return item;
    });
}
