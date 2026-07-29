import { Buffer } from "node:buffer";
import type * as vscode from "vscode";
import {
  createLineStarts,
  GameDataDeclarationIndex,
  positionForOffset
} from "./declarationIndex";
import { supportsDefinitionLinks } from "./navigation";

const REFERENCE_FILES_PATTERN =
  "{**/*.txt,**/*.tmpl,**/*.lsx,**/*.loca.xml,**/*.khn,**/*.md}";
const REFERENCE_FILES_EXCLUDE_PATTERN =
  "**/{.git,build,bin,node_modules,output,temp}/**";
const IDENTIFIER_EDGE_CHARACTER = /[A-Za-z0-9_-]/;

function locationKey(location: vscode.Location): string {
  const { start, end } = location.range;
  return [
    location.uri.toString(),
    start.line,
    start.character,
    end.line,
    end.character
  ].join(":");
}

export function referenceLocationsInText(
  vscodeApi: typeof vscode,
  uri: vscode.Uri,
  text: string,
  name: string
): vscode.Location[] {
  if (!name) {
    return [];
  }

  const locations: vscode.Location[] = [];
  const lineStarts = createLineStarts(text);
  let offset = 0;

  while ((offset = text.indexOf(name, offset)) !== -1) {
    const endOffset = offset + name.length;
    const precedingCharacter = text[offset - 1];
    const followingCharacter = text[endOffset];
    const hasIdentifierBefore =
      precedingCharacter !== undefined &&
      IDENTIFIER_EDGE_CHARACTER.test(precedingCharacter);
    const hasIdentifierAfter =
      followingCharacter !== undefined &&
      IDENTIFIER_EDGE_CHARACTER.test(followingCharacter);

    if (!hasIdentifierBefore && !hasIdentifierAfter) {
      const start = positionForOffset(lineStarts, offset);
      const end = positionForOffset(lineStarts, endOffset);
      locations.push(
        new vscodeApi.Location(
          uri,
          new vscodeApi.Range(
            new vscodeApi.Position(start.line, start.character),
            new vscodeApi.Position(end.line, end.character)
          )
        )
      );
    }

    offset = endOffset;
  }

  return locations;
}

export async function findReferences(
  vscodeApi: typeof vscode,
  declarationIndex: GameDataDeclarationIndex,
  originDocument: vscode.TextDocument,
  name: string,
  includeDeclaration: boolean,
  token: vscode.CancellationToken
): Promise<vscode.Location[]> {
  const uris = await vscodeApi.workspace.findFiles(
    REFERENCE_FILES_PATTERN,
    REFERENCE_FILES_EXCLUDE_PATTERN
  );
  if (token.isCancellationRequested) {
    return [];
  }

  const openDocuments = new Map(
    vscodeApi.workspace.textDocuments
      .filter((document) => supportsDefinitionLinks(document.uri))
      .map((document) => [document.uri.toString(), document])
  );
  openDocuments.set(originDocument.uri.toString(), originDocument);

  const urisByKey = new Map(
    uris
      .filter((uri) => supportsDefinitionLinks(uri))
      .map((uri) => [uri.toString(), uri])
  );
  for (const document of openDocuments.values()) {
    urisByKey.set(document.uri.toString(), document.uri);
  }

  const locations = (
    await Promise.all(
      Array.from(urisByKey.values(), async (uri) => {
        if (token.isCancellationRequested) {
          return [];
        }

        const openDocument = openDocuments.get(uri.toString());
        try {
          const text =
            openDocument?.getText() ??
            Buffer.from(
              await vscodeApi.workspace.fs.readFile(uri)
            ).toString("utf8");
          return referenceLocationsInText(
            vscodeApi,
            uri,
            text,
            name
          );
        } catch {
          return [];
        }
      })
    )
  ).flat();

  const definitionKeys = includeDeclaration
    ? new Set<string>()
    : new Set(
        declarationIndex
          .definitionsFor(name)
          .map((location) => locationKey(location))
      );
  const references = locations.filter(
    (location) => !definitionKeys.has(locationKey(location))
  );

  references.sort((left, right) => {
    const pathComparison = left.uri
      .toString()
      .localeCompare(right.uri.toString());
    return (
      pathComparison ||
      left.range.start.compareTo(right.range.start)
    );
  });

  return references;
}
