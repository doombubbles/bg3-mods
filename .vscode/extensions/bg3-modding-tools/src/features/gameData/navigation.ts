import type * as vscode from "vscode";
import {
  entriesForUri,
  GameDataDeclarationIndex,
  symbolKindForType
} from "./declarationIndex";

export const DOCUMENT_SYMBOL_SELECTOR = [
  { scheme: "file", language: "bg3" },
  { scheme: "file", pattern: "**/*.txt" },
  { scheme: "file", pattern: "**/*.tmpl" },
  { scheme: "file", pattern: "**/*.loca.xml" },
  {
    scheme: "file",
    pattern: "**/RootTemplates/**/*.lsf.lsx"
  },
  {
    scheme: "file",
    pattern: "**/ClassDescriptions/*ClassDescriptions.lsx"
  }
] satisfies vscode.DocumentSelector;

export const DEFINITION_SELECTOR = [
  { scheme: "file", pattern: "**/*.txt" },
  { scheme: "file", pattern: "**/*.tmpl" },
  { scheme: "file", pattern: "**/*.lsx" },
  { scheme: "file", pattern: "**/*.loca.xml" },
  { scheme: "file", pattern: "**/*.khn" },
  { scheme: "file", pattern: "**/*.md" }
] satisfies vscode.DocumentSelector;

const UUID_PATTERN_SOURCE =
  "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}";
export const IDENTIFIER_PATTERN = new RegExp(
  `(?:${UUID_PATTERN_SOURCE}|[A-Za-z_][A-Za-z0-9_]*)`
);
export const CLICKABLE_REFERENCE_PATTERN = new RegExp(
  `(?:${UUID_PATTERN_SOURCE}|h[0-9a-zA-Z]{20,})`,
  "g"
);

export function definitionLinksFor(
  originSelectionRange: vscode.Range,
  locations: readonly vscode.Location[]
): vscode.LocationLink[] {
  return locations.map((location) => ({
    originSelectionRange,
    targetUri: location.uri,
    targetRange: location.range,
    targetSelectionRange: location.range
  }));
}

export function supportsDefinitionLinks(uri: vscode.Uri): boolean {
  const path = (uri.path || uri.fsPath || uri.toString()).toLowerCase();
  return (
    path.endsWith(".txt") ||
    path.endsWith(".tmpl") ||
    path.endsWith(".lsx") ||
    path.endsWith(".loca.xml") ||
    path.endsWith(".khn") ||
    path.endsWith(".md")
  );
}

export function clickableDecorationRanges(
  vscodeApi: typeof vscode,
  document: vscode.TextDocument,
  declarationIndex: Pick<GameDataDeclarationIndex, "hasDefinition">
): vscode.Range[] {
  if (!supportsDefinitionLinks(document.uri)) {
    return [];
  }

  const ranges: vscode.Range[] = [];
  const matches = document
    .getText()
    .matchAll(new RegExp(CLICKABLE_REFERENCE_PATTERN.source, "g"));

  for (const match of matches) {
    const matchIndex = match.index;
    if (!declarationIndex.hasDefinition(match[0])) {
      continue;
    }

    ranges.push(
      new vscodeApi.Range(
        document.positionAt(matchIndex),
        document.positionAt(matchIndex + match[0].length)
      )
    );
  }

  return ranges;
}

export function provideDocumentSymbols(
  vscodeApi: typeof vscode,
  document: vscode.TextDocument,
  token: vscode.CancellationToken
): vscode.DocumentSymbol[] {
  const entries = entriesForUri(document.uri, document.getText());
  const symbols: vscode.DocumentSymbol[] = [];

  for (const entry of entries) {
    if (token.isCancellationRequested) {
      return symbols;
    }

    const hasDisplayName = Boolean(entry.displayName);
    const range = new vscodeApi.Range(
      document.positionAt(entry.startOffset),
      document.positionAt(entry.endOffset)
    );
    const selectionRange = new vscodeApi.Range(
      document.positionAt(entry.nameStartOffset),
      document.positionAt(entry.nameEndOffset)
    );

    symbols.push(
      new vscodeApi.DocumentSymbol(
        hasDisplayName ? entry.displayName! : entry.name,
        hasDisplayName
          ? entry.symbolDetail || entry.name
          : entry.detail || entry.type,
        symbolKindForType(vscodeApi, entry.type),
        range,
        selectionRange
      )
    );
  }

  return symbols;
}
