import { Buffer } from "node:buffer";
import type * as vscode from "vscode";

export class Position {
  constructor(
    readonly line: number,
    readonly character: number
  ) {}

  compareTo(other: Position): number {
    return (
      this.line - other.line || this.character - other.character
    );
  }
}

export class Range {
  constructor(
    readonly start: Position,
    readonly end: Position
  ) {}
}

class Location {
  constructor(
    readonly uri: vscode.Uri,
    readonly range: vscode.Range
  ) {}
}

class SymbolInformation {
  constructor(
    readonly name: string,
    readonly kind: vscode.SymbolKind,
    readonly containerName: string,
    readonly location: vscode.Location
  ) {}
}

class DocumentSymbol {
  constructor(
    readonly name: string,
    readonly detail: string,
    readonly kind: vscode.SymbolKind,
    readonly range: vscode.Range,
    readonly selectionRange: vscode.Range
  ) {}
}

class CompletionItem {
  range?: vscode.Range;
  detail?: string;
  documentation?: string;

  constructor(
    readonly label: string,
    readonly kind?: vscode.CompletionItemKind
  ) {}
}

export interface MockVscodeApi {
  Position: typeof Position;
  Range: typeof Range;
  Location: typeof Location;
  SymbolInformation: typeof SymbolInformation;
  DocumentSymbol: typeof DocumentSymbol;
  CompletionItem: typeof CompletionItem;
  CompletionItemKind: Record<string, vscode.CompletionItemKind>;
  SymbolKind: Record<string, vscode.SymbolKind>;
  workspace: {
    textDocuments: vscode.TextDocument[];
    findFiles(...args: unknown[]): Promise<vscode.Uri[]>;
    asRelativePath(uri: vscode.Uri): string;
    fs: {
      readFile(uri: vscode.Uri): Promise<Uint8Array>;
    };
    createFileSystemWatcher?: unknown;
    onDidChangeTextDocument?: unknown;
  };
  languages?: unknown;
  window?: unknown;
  Hover?: unknown;
}

interface MockUriData {
  relativePath: string;
}

export function createUri(relativePath: string): vscode.Uri {
  const path = `C:/workspace/${relativePath.replaceAll("\\", "/")}`;
  return {
    path,
    fsPath: path,
    relativePath,
    toString() {
      return `file:///${path}`;
    }
  } as unknown as vscode.Uri;
}

function relativePathFor(uri: vscode.Uri): string {
  return (uri as unknown as MockUriData).relativePath;
}

function positionAt(text: string, offset: number): Position {
  const precedingText = text.slice(0, offset);
  const lines = precedingText.split("\n");
  return new Position(
    lines.length - 1,
    lines.at(-1)?.length ?? 0
  );
}

export function createDocument(
  relativePath: string,
  text: string
): vscode.TextDocument {
  const document = {
    uri: createUri(relativePath),
    getText(range?: vscode.Range) {
      if (!range) {
        return text;
      }

      const lines = text.split("\n");
      const offsetFor = (position: vscode.Position): number => {
        let offset = 0;
        for (let line = 0; line < position.line; line += 1) {
          offset += (lines[line]?.length ?? 0) + 1;
        }
        return offset + position.character;
      };

      return text.slice(
        offsetFor(range.start),
        offsetFor(range.end)
      );
    },
    positionAt(offset: number) {
      return positionAt(text, offset);
    },
    offsetAt(position: vscode.Position) {
      const lines = text.split("\n");
      let offset = 0;
      for (let line = 0; line < position.line; line += 1) {
        offset += (lines[line]?.length ?? 0) + 1;
      }
      return offset + position.character;
    }
  };

  return document as unknown as vscode.TextDocument;
}

export function createVscodeMock(
  files: Record<string, string> = {}
): MockVscodeApi {
  const entries = Object.entries(files);
  const uris = new Map(
    entries.map(([relativePath]) => [
      relativePath,
      createUri(relativePath)
    ])
  );

  return {
    Position,
    Range,
    Location,
    SymbolInformation,
    DocumentSymbol,
    CompletionItem,
    CompletionItemKind: {
      Module: 1,
      Value: 2
    },
    SymbolKind: {
      Object: 1,
      Class: 2,
      Enum: 3,
      Event: 4,
      Namespace: 5,
      Property: 6,
      Function: 7,
      String: 8
    },
    workspace: {
      textDocuments: [],
      async findFiles(_include, exclude) {
        const excludePattern =
          typeof exclude === "string" ? exclude.toLowerCase() : "";
        const excludedSegments = new Set(
          (excludePattern.match(/\{([^}]+)\}/)?.[1] ?? "")
            .split(",")
            .filter(Boolean)
        );
        return Array.from(uris.values()).filter((uri) => {
          const segments = relativePathFor(uri)
            .replaceAll("\\", "/")
            .toLowerCase()
            .split("/");
          return !segments.some((segment) =>
            excludedSegments.has(segment)
          );
        });
      },
      asRelativePath(uri) {
        return relativePathFor(uri);
      },
      fs: {
        async readFile(uri) {
          return Buffer.from(files[relativePathFor(uri)], "utf8");
        }
      }
    }
  };
}

export function asVscodeApi(
  mock: MockVscodeApi
): typeof vscode {
  return mock as unknown as typeof vscode;
}

export function cancellationToken(
  isCancellationRequested = false
): vscode.CancellationToken {
  return {
    isCancellationRequested
  } as vscode.CancellationToken;
}
