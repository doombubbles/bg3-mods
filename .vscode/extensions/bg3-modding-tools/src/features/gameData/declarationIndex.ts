import { Buffer } from "node:buffer";
import type * as vscode from "vscode";
import { parseLocalizationEntries } from "./parsers/localization";
import {
  parseClassDescriptionEntries,
  parseRootTemplateEntries
} from "./parsers/lsx";
import { parseStatsEntries } from "./parsers/stats";
import type { ParsedDeclaration } from "./types";

export const SOURCE_FILES_PATTERN =
  "{**/*.txt,**/*.tmpl,**/*.loca.xml,**/RootTemplates/**/*.lsf.lsx,**/ClassDescriptions/*ClassDescriptions.lsx}";
const SOURCE_FILES_EXCLUDE_PATTERN =
  "**/{.git,build,bin,node_modules,output,temp,Wiki}/**";
const EXCLUDED_PATH_SEGMENTS = new Set([
  ".git",
  "build",
  "bin",
  "node_modules",
  "output",
  "temp",
  "wiki"
]);

const SYMBOL_KIND_NAMES: Record<
  string,
  keyof typeof vscode.SymbolKind
> = {
  Armor: "Object",
  Character: "Class",
  ClassDescription: "Class",
  CriticalHitTypeData: "Enum",
  InterruptData: "Event",
  LocalizedString: "String",
  Object: "Object",
  ObjectCategories: "Namespace",
  PassiveData: "Property",
  RootTemplate: "Object",
  SpellData: "Function",
  StatusData: "Event",
  Weapon: "Object"
};

interface SourcePosition {
  line: number;
  character: number;
}

interface IndexedIdentifier {
  name: string;
  location: vscode.Location;
}

interface IndexedDeclaration {
  name: string;
  type: string;
  detail: string;
  displayName: string;
  symbolDetail: string;
  hoverText: string;
  location: vscode.Location;
  identifiers: IndexedIdentifier[];
}

interface IndexedLocalization {
  text: string;
  location: vscode.Location;
}

export function createLineStarts(text: string): number[] {
  const starts = [0];

  for (let index = 0; index < text.length; index += 1) {
    if (text.charCodeAt(index) === 10) {
      starts.push(index + 1);
    }
  }

  return starts;
}

export function positionForOffset(
  lineStarts: number[],
  offset: number
): SourcePosition {
  let low = 0;
  let high = lineStarts.length;

  while (low < high) {
    const middle = Math.floor((low + high) / 2);
    if (lineStarts[middle] <= offset) {
      low = middle + 1;
    } else {
      high = middle;
    }
  }

  const line = Math.max(0, low - 1);
  return {
    line,
    character: offset - lineStarts[line]
  };
}

function uriPath(uri: vscode.Uri): string {
  return uri.path || uri.fsPath || uri.toString();
}

export function entriesForUri(
  uri: vscode.Uri,
  text: string
): ParsedDeclaration[] {
  const lowerPath = uriPath(uri).toLowerCase();

  if (lowerPath.endsWith(".loca.xml")) {
    return parseLocalizationEntries(text);
  }
  if (lowerPath.endsWith("classdescriptions.lsx")) {
    return parseClassDescriptionEntries(text);
  }
  if (lowerPath.endsWith(".lsf.lsx")) {
    return parseRootTemplateEntries(text);
  }
  return parseStatsEntries(text);
}

export function isSourceFile(
  vscodeApi: typeof vscode,
  uri: vscode.Uri
): boolean {
  const relativePath = vscodeApi.workspace
    .asRelativePath(uri, false)
    .replaceAll("\\", "/");
  const lowerPath = relativePath.toLowerCase();
  const segments = lowerPath.split("/");
  const isSupportedFile =
    lowerPath.endsWith(".txt") ||
    lowerPath.endsWith(".tmpl") ||
    lowerPath.endsWith(".loca.xml") ||
    (lowerPath.endsWith(".lsf.lsx") &&
      segments.includes("roottemplates")) ||
    (lowerPath.endsWith("classdescriptions.lsx") &&
      segments.includes("classdescriptions"));

  return (
    isSupportedFile &&
    !segments.some((segment) => EXCLUDED_PATH_SEGMENTS.has(segment))
  );
}

export function symbolKindForType(
  vscodeApi: typeof vscode,
  type: string
): vscode.SymbolKind {
  const kindName = SYMBOL_KIND_NAMES[type] ?? "Object";
  return vscodeApi.SymbolKind[kindName];
}

export class GameDataDeclarationIndex {
  readonly ready: Promise<void>;

  private declarationsByUri = new Map<
    string,
    IndexedDeclaration[]
  >();

  private declarationsByName = new Map<string, vscode.Location[]>();

  private localizationByName = new Map<
    string,
    IndexedLocalization[]
  >();

  constructor(private readonly vscodeApi: typeof vscode) {
    this.ready = this.initialize();
  }

  private async initialize(): Promise<void> {
    const uris = await this.vscodeApi.workspace.findFiles(
      SOURCE_FILES_PATTERN,
      SOURCE_FILES_EXCLUDE_PATTERN
    );

    await Promise.all(
      uris.map(async (uri) => {
        if (isSourceFile(this.vscodeApi, uri)) {
          await this.loadUri(uri, false);
        }
      })
    );

    this.rebuildNameIndex();
  }

  async loadUri(uri: vscode.Uri, rebuild = true): Promise<void> {
    try {
      const bytes = await this.vscodeApi.workspace.fs.readFile(uri);
      this.setText(uri, Buffer.from(bytes).toString("utf8"), rebuild);
    } catch {
      this.removeUri(uri);
    }
  }

  setText(uri: vscode.Uri, text: string, rebuild = true): void {
    if (!isSourceFile(this.vscodeApi, uri)) {
      return;
    }

    const lineStarts = createLineStarts(text);
    const declarations = entriesForUri(uri, text).map((entry) => {
      const identifiers = [
        {
          name: entry.name,
          nameStartOffset: entry.nameStartOffset,
          nameEndOffset: entry.nameEndOffset
        },
        ...(entry.aliases ?? [])
      ].map((identifier): IndexedIdentifier => {
        const start = positionForOffset(
          lineStarts,
          identifier.nameStartOffset
        );
        const end = positionForOffset(
          lineStarts,
          identifier.nameEndOffset
        );

        return {
          name: identifier.name,
          location: new this.vscodeApi.Location(
            uri,
            new this.vscodeApi.Range(
              new this.vscodeApi.Position(start.line, start.character),
              new this.vscodeApi.Position(end.line, end.character)
            )
          )
        };
      });

      const location = identifiers[0]!.location;

      return {
        name: entry.name,
        type: entry.type,
        detail: entry.detail ?? "",
        displayName: entry.displayName ?? "",
        symbolDetail: entry.symbolDetail ?? "",
        hoverText: entry.hoverText ?? "",
        location,
        identifiers
      };
    });

    this.declarationsByUri.set(uri.toString(), declarations);

    if (rebuild) {
      this.rebuildNameIndex();
    }
  }

  removeUri(uri: vscode.Uri): void {
    if (this.declarationsByUri.delete(uri.toString())) {
      this.rebuildNameIndex();
    }
  }

  private rebuildNameIndex(): void {
    const declarationsByName = new Map<string, vscode.Location[]>();
    const localizationByName = new Map<
      string,
      IndexedLocalization[]
    >();

    for (const declarations of this.declarationsByUri.values()) {
      for (const declaration of declarations) {
        for (const identifier of declaration.identifiers) {
          const matches =
            declarationsByName.get(identifier.name) ?? [];
          matches.push(identifier.location);
          declarationsByName.set(identifier.name, matches);
        }

        if (declaration.hoverText) {
          const localizations =
            localizationByName.get(declaration.name) ?? [];
          localizations.push({
            text: declaration.hoverText,
            location: declaration.location
          });
          localizationByName.set(declaration.name, localizations);
        }
      }
    }

    for (const locations of declarationsByName.values()) {
      locations.sort((left, right) => {
        const pathComparison = left.uri
          .toString()
          .localeCompare(right.uri.toString());
        if (pathComparison !== 0) {
          return pathComparison;
        }

        return left.range.start.compareTo(right.range.start);
      });
    }

    for (const localizations of localizationByName.values()) {
      localizations.sort((left, right) =>
        left.location.uri
          .toString()
          .localeCompare(right.location.uri.toString())
      );
    }

    this.declarationsByName = declarationsByName;
    this.localizationByName = localizationByName;
  }

  definitionsFor(name: string): readonly vscode.Location[] {
    return this.declarationsByName.get(name) ?? [];
  }

  hasDefinition(name: string): boolean {
    return this.declarationsByName.has(name);
  }

  localizationHoverFor(name: string): string[] {
    const localizations = this.localizationByName.get(name) ?? [];
    return Array.from(
      new Set(
        localizations.map((localization) => localization.text)
      )
    );
  }

  workspaceSymbolsFor(
    query: string,
    token: vscode.CancellationToken
  ): vscode.SymbolInformation[] {
    const normalizedQuery = query.toLowerCase();
    const symbols: vscode.SymbolInformation[] = [];

    for (const declarations of this.declarationsByUri.values()) {
      for (const declaration of declarations) {
        if (token.isCancellationRequested) {
          return symbols;
        }

        const hasDisplayName = Boolean(declaration.displayName);
        const identifierText = declaration.identifiers
          .map((identifier) => identifier.name)
          .join("\n");
        const searchableText = hasDisplayName
          ? `${identifierText}\n${declaration.displayName}\n${declaration.hoverText}`
          : identifierText;
        if (!searchableText.toLowerCase().includes(normalizedQuery)) {
          continue;
        }

        symbols.push(
          new this.vscodeApi.SymbolInformation(
            hasDisplayName
              ? declaration.displayName
              : declaration.name,
            symbolKindForType(this.vscodeApi, declaration.type),
            hasDisplayName
              ? declaration.symbolDetail || declaration.name
              : declaration.type,
            declaration.location
          )
        );
      }
    }

    symbols.sort((left, right) => {
      const nameComparison = left.name.localeCompare(right.name);
      if (nameComparison !== 0) {
        return nameComparison;
      }

      const pathComparison = left.location.uri
        .toString()
        .localeCompare(right.location.uri.toString());
      if (pathComparison !== 0) {
        return pathComparison;
      }

      return left.location.range.start.compareTo(
        right.location.range.start
      );
    });

    return symbols;
  }
}
