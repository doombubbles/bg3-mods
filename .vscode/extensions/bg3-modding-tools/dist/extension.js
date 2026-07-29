"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var vscode = __toESM(require("vscode"));

// src/features/gameData/declarationIndex.ts
var import_node_buffer = require("node:buffer");

// src/features/gameData/parsers/localization.ts
var LOCALIZATION_ENTRY_PATTERN = /<content\b[^>]*\bcontentuid="([^"\r\n]+)"[^>]*>[\s\S]*?<\/content>/g;
function decodeXmlEntities(text) {
  return text.replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&quot;", '"').replaceAll("&apos;", "'").replaceAll("&amp;", "&");
}
function localizationText(content) {
  return decodeXmlEntities(content).replace(/<br\s*\/?>/gi, "\n").replace(/<\/?LSTag\b[^>]*>/gi, "").replace(/<[^>]+>/g, "").split(/\r?\n/).map((line) => line.replace(/\s+/g, " ").trim()).join("\n").trim();
}
function localizationPreview(content) {
  const preview = content.replace(/\s+/g, " ").trim();
  return preview.length > 100 ? `${preview.slice(0, 97)}...` : preview;
}
function parseLocalizationEntries(text) {
  return Array.from(
    text.matchAll(LOCALIZATION_ENTRY_PATTERN),
    (match) => {
      const matchIndex = match.index;
      const name = match[1];
      const nameStartOffset = matchIndex + match[0].indexOf(name);
      const contentStartOffset = matchIndex + match[0].indexOf(">") + 1;
      const contentEndOffset = matchIndex + match[0].lastIndexOf("</content>");
      const hoverText = localizationText(
        text.slice(contentStartOffset, contentEndOffset)
      );
      const displayName = localizationPreview(hoverText);
      return {
        name,
        type: "LocalizedString",
        detail: displayName,
        displayName,
        hoverText,
        startOffset: matchIndex,
        endOffset: matchIndex + match[0].length,
        nameStartOffset,
        nameEndOffset: nameStartOffset + name.length
      };
    }
  );
}

// src/features/gameData/parsers/lsx.ts
var ROOT_TEMPLATE_NODE_PATTERN = /<node\s+id="GameObjects"\s*>([\s\S]*?)(?=<children>|<\/node>)/g;
var CLASS_DESCRIPTION_NODE_PATTERN = /<node\s+id="ClassDescription"\s*>([\s\S]*?)(?=<children>|<\/node>)/g;
var XML_ATTRIBUTE_PATTERN = /<attribute\b([^>]*)\/?>/g;
var XML_PROPERTY_PATTERN = /([A-Za-z_][A-Za-z0-9_]*)="([^"]*)"/g;
function parseXmlProperties(attributeText) {
  return new Map(
    Array.from(
      attributeText.matchAll(XML_PROPERTY_PATTERN),
      (match) => [match[1], match[2]]
    )
  );
}
function directXmlAttributesForNode(nodeMatch) {
  const directAttributes = /* @__PURE__ */ new Map();
  const nodeBody = nodeMatch[1];
  const nodeMatchIndex = nodeMatch.index ?? 0;
  const nodeBodyOffset = nodeMatchIndex + nodeMatch[0].indexOf(nodeBody);
  for (const attributeMatch of nodeBody.matchAll(XML_ATTRIBUTE_PATTERN)) {
    const properties = parseXmlProperties(attributeMatch[1]);
    const id = properties.get("id");
    const value = properties.get("value");
    if (!id || value === void 0) {
      continue;
    }
    const valueMarker = `value="${value}"`;
    directAttributes.set(id, {
      value,
      valueStartOffset: nodeBodyOffset + attributeMatch.index + attributeMatch[0].indexOf(valueMarker) + 'value="'.length
    });
  }
  return {
    attributes: directAttributes,
    nodeEndOffset: nodeBodyOffset + nodeBody.length
  };
}
function parseRootTemplateEntries(text) {
  const entries = [];
  for (const nodeMatch of text.matchAll(ROOT_TEMPLATE_NODE_PATTERN)) {
    const nodeMatchIndex = nodeMatch.index ?? 0;
    const { attributes, nodeEndOffset } = directXmlAttributesForNode(nodeMatch);
    const mapKey = attributes.get("MapKey");
    if (!mapKey) {
      continue;
    }
    const displayName = attributes.get("Stats")?.value ?? attributes.get("Name")?.value ?? mapKey.value;
    entries.push({
      name: mapKey.value,
      type: "RootTemplate",
      detail: displayName,
      displayName,
      startOffset: nodeMatchIndex,
      endOffset: nodeEndOffset,
      nameStartOffset: mapKey.valueStartOffset,
      nameEndOffset: mapKey.valueStartOffset + mapKey.value.length
    });
  }
  return entries;
}
function parseClassDescriptionEntries(text) {
  const entries = [];
  for (const nodeMatch of text.matchAll(CLASS_DESCRIPTION_NODE_PATTERN)) {
    const nodeMatchIndex = nodeMatch.index ?? 0;
    const { attributes, nodeEndOffset } = directXmlAttributesForNode(nodeMatch);
    const uuid = attributes.get("UUID");
    const progressionTableUuid = attributes.get("ProgressionTableUUID");
    const primaryIdentifier = uuid ?? progressionTableUuid;
    if (!primaryIdentifier) {
      continue;
    }
    const displayName = attributes.get("Name")?.value ?? primaryIdentifier.value;
    const aliases = uuid && progressionTableUuid && progressionTableUuid.value !== uuid.value ? [
      {
        name: progressionTableUuid.value,
        nameStartOffset: progressionTableUuid.valueStartOffset,
        nameEndOffset: progressionTableUuid.valueStartOffset + progressionTableUuid.value.length
      }
    ] : [];
    const identifierNames = [uuid, progressionTableUuid].filter(
      (identifier) => identifier !== void 0
    ).map((identifier) => identifier.value);
    entries.push({
      name: primaryIdentifier.value,
      aliases,
      type: "ClassDescription",
      detail: displayName,
      displayName,
      symbolDetail: identifierNames.join(" / "),
      startOffset: nodeMatchIndex,
      endOffset: nodeEndOffset,
      nameStartOffset: primaryIdentifier.valueStartOffset,
      nameEndOffset: primaryIdentifier.valueStartOffset + primaryIdentifier.value.length
    });
  }
  return entries;
}

// src/features/gameData/parsers/stats.ts
var ENTRY_PATTERN = /^new entry[ \t]+"([^"\r\n]+)"[ \t]*\r?$/gm;
var TYPE_PATTERN = /^type[ \t]+"([^"\r\n]+)"[ \t]*\r?$/m;
function parseStatsEntries(text) {
  const matches = Array.from(text.matchAll(ENTRY_PATTERN));
  return matches.map((match, index) => {
    const matchIndex = match.index;
    const nextMatchIndex = matches[index + 1]?.index;
    const rawEndOffset = nextMatchIndex ?? text.length;
    let endOffset = rawEndOffset;
    while (endOffset > matchIndex && /\s/.test(text[endOffset - 1])) {
      endOffset -= 1;
    }
    const minimumEndOffset = matchIndex + match[0].length;
    endOffset = Math.max(endOffset, minimumEndOffset);
    const blockText = text.slice(minimumEndOffset, rawEndOffset);
    const typeMatch = TYPE_PATTERN.exec(blockText);
    const name = match[1];
    const nameOffset = matchIndex + match[0].indexOf(name);
    return {
      name,
      type: typeMatch?.[1] ?? "",
      startOffset: matchIndex,
      endOffset,
      nameStartOffset: nameOffset,
      nameEndOffset: nameOffset + name.length
    };
  });
}

// src/features/gameData/declarationIndex.ts
var SOURCE_FILES_PATTERN = "{**/*.txt,**/*.tmpl,**/*.loca.xml,**/RootTemplates/**/*.lsf.lsx,**/ClassDescriptions/*ClassDescriptions.lsx}";
var SOURCE_FILES_EXCLUDE_PATTERN = "**/{.git,build,bin,node_modules,output,temp,Wiki}/**";
var EXCLUDED_PATH_SEGMENTS = /* @__PURE__ */ new Set([
  ".git",
  "build",
  "bin",
  "node_modules",
  "output",
  "temp",
  "wiki"
]);
var SYMBOL_KIND_NAMES = {
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
function createLineStarts(text) {
  const starts = [0];
  for (let index = 0; index < text.length; index += 1) {
    if (text.charCodeAt(index) === 10) {
      starts.push(index + 1);
    }
  }
  return starts;
}
function positionForOffset(lineStarts, offset) {
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
function uriPath(uri) {
  return uri.path || uri.fsPath || uri.toString();
}
function entriesForUri(uri, text) {
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
function isSourceFile(vscodeApi, uri) {
  const relativePath = vscodeApi.workspace.asRelativePath(uri, false).replaceAll("\\", "/");
  const lowerPath = relativePath.toLowerCase();
  const segments = lowerPath.split("/");
  const isSupportedFile = lowerPath.endsWith(".txt") || lowerPath.endsWith(".tmpl") || lowerPath.endsWith(".loca.xml") || lowerPath.endsWith(".lsf.lsx") && segments.includes("roottemplates") || lowerPath.endsWith("classdescriptions.lsx") && segments.includes("classdescriptions");
  return isSupportedFile && !segments.some((segment) => EXCLUDED_PATH_SEGMENTS.has(segment));
}
function symbolKindForType(vscodeApi, type) {
  const kindName = SYMBOL_KIND_NAMES[type] ?? "Object";
  return vscodeApi.SymbolKind[kindName];
}
var GameDataDeclarationIndex = class {
  constructor(vscodeApi) {
    this.vscodeApi = vscodeApi;
    this.ready = this.initialize();
  }
  ready;
  declarationsByUri = /* @__PURE__ */ new Map();
  declarationsByName = /* @__PURE__ */ new Map();
  localizationByName = /* @__PURE__ */ new Map();
  async initialize() {
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
  async loadUri(uri, rebuild = true) {
    try {
      const bytes = await this.vscodeApi.workspace.fs.readFile(uri);
      this.setText(uri, import_node_buffer.Buffer.from(bytes).toString("utf8"), rebuild);
    } catch {
      this.removeUri(uri);
    }
  }
  setText(uri, text, rebuild = true) {
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
        ...entry.aliases ?? []
      ].map((identifier) => {
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
      const location = identifiers[0].location;
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
  removeUri(uri) {
    if (this.declarationsByUri.delete(uri.toString())) {
      this.rebuildNameIndex();
    }
  }
  rebuildNameIndex() {
    const declarationsByName = /* @__PURE__ */ new Map();
    const localizationByName = /* @__PURE__ */ new Map();
    for (const declarations of this.declarationsByUri.values()) {
      for (const declaration of declarations) {
        for (const identifier of declaration.identifiers) {
          const matches = declarationsByName.get(identifier.name) ?? [];
          matches.push(identifier.location);
          declarationsByName.set(identifier.name, matches);
        }
        if (declaration.hoverText) {
          const localizations = localizationByName.get(declaration.name) ?? [];
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
        const pathComparison = left.uri.toString().localeCompare(right.uri.toString());
        if (pathComparison !== 0) {
          return pathComparison;
        }
        return left.range.start.compareTo(right.range.start);
      });
    }
    for (const localizations of localizationByName.values()) {
      localizations.sort(
        (left, right) => left.location.uri.toString().localeCompare(right.location.uri.toString())
      );
    }
    this.declarationsByName = declarationsByName;
    this.localizationByName = localizationByName;
  }
  definitionsFor(name) {
    return this.declarationsByName.get(name) ?? [];
  }
  hasDefinition(name) {
    return this.declarationsByName.has(name);
  }
  localizationHoverFor(name) {
    const localizations = this.localizationByName.get(name) ?? [];
    return Array.from(
      new Set(
        localizations.map((localization) => localization.text)
      )
    );
  }
  workspaceSymbolsFor(query, token) {
    const normalizedQuery = query.toLowerCase();
    const symbols = [];
    for (const declarations of this.declarationsByUri.values()) {
      for (const declaration of declarations) {
        if (token.isCancellationRequested) {
          return symbols;
        }
        const hasDisplayName = Boolean(declaration.displayName);
        const identifierText = declaration.identifiers.map((identifier) => identifier.name).join("\n");
        const searchableText = hasDisplayName ? `${identifierText}
${declaration.displayName}
${declaration.hoverText}` : identifierText;
        if (!searchableText.toLowerCase().includes(normalizedQuery)) {
          continue;
        }
        symbols.push(
          new this.vscodeApi.SymbolInformation(
            hasDisplayName ? declaration.displayName : declaration.name,
            symbolKindForType(this.vscodeApi, declaration.type),
            hasDisplayName ? declaration.symbolDetail || declaration.name : declaration.type,
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
      const pathComparison = left.location.uri.toString().localeCompare(right.location.uri.toString());
      if (pathComparison !== 0) {
        return pathComparison;
      }
      return left.location.range.start.compareTo(
        right.location.range.start
      );
    });
    return symbols;
  }
};

// src/features/gameData/navigation.ts
var DOCUMENT_SYMBOL_SELECTOR = [
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
];
var DEFINITION_SELECTOR = [
  { scheme: "file", pattern: "**/*.txt" },
  { scheme: "file", pattern: "**/*.tmpl" },
  { scheme: "file", pattern: "**/*.lsx" },
  { scheme: "file", pattern: "**/*.loca.xml" },
  { scheme: "file", pattern: "**/*.khn" },
  { scheme: "file", pattern: "**/*.md" }
];
var UUID_PATTERN_SOURCE = "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}";
var IDENTIFIER_PATTERN = new RegExp(
  `(?:${UUID_PATTERN_SOURCE}|[A-Za-z_][A-Za-z0-9_]*)`
);
var CLICKABLE_REFERENCE_PATTERN = new RegExp(
  `(?:${UUID_PATTERN_SOURCE}|h[0-9a-zA-Z]{20,})`,
  "g"
);
function definitionLinksFor(originSelectionRange, locations) {
  return locations.map((location) => ({
    originSelectionRange,
    targetUri: location.uri,
    targetRange: location.range,
    targetSelectionRange: location.range
  }));
}
function supportsDefinitionLinks(uri) {
  const path = (uri.path || uri.fsPath || uri.toString()).toLowerCase();
  return path.endsWith(".txt") || path.endsWith(".tmpl") || path.endsWith(".lsx") || path.endsWith(".loca.xml") || path.endsWith(".khn") || path.endsWith(".md");
}
function clickableDecorationRanges(vscodeApi, document, declarationIndex) {
  if (!supportsDefinitionLinks(document.uri)) {
    return [];
  }
  const ranges = [];
  const matches = document.getText().matchAll(new RegExp(CLICKABLE_REFERENCE_PATTERN.source, "g"));
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
function provideDocumentSymbols(vscodeApi, document, token) {
  const entries = entriesForUri(document.uri, document.getText());
  const symbols = [];
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
        hasDisplayName ? entry.displayName : entry.name,
        hasDisplayName ? entry.symbolDetail || entry.name : entry.detail || entry.type,
        symbolKindForType(vscodeApi, entry.type),
        range,
        selectionRange
      )
    );
  }
  return symbols;
}

// src/features/gameData/references.ts
var import_node_buffer2 = require("node:buffer");
var REFERENCE_FILES_PATTERN = "{**/*.txt,**/*.tmpl,**/*.lsx,**/*.loca.xml,**/*.khn,**/*.md}";
var REFERENCE_FILES_EXCLUDE_PATTERN = "**/{.git,build,bin,node_modules,output,temp}/**";
var IDENTIFIER_EDGE_CHARACTER = /[A-Za-z0-9_-]/;
function locationKey(location) {
  const { start, end } = location.range;
  return [
    location.uri.toString(),
    start.line,
    start.character,
    end.line,
    end.character
  ].join(":");
}
function referenceLocationsInText(vscodeApi, uri, text, name) {
  if (!name) {
    return [];
  }
  const locations = [];
  const lineStarts = createLineStarts(text);
  let offset = 0;
  while ((offset = text.indexOf(name, offset)) !== -1) {
    const endOffset = offset + name.length;
    const precedingCharacter = text[offset - 1];
    const followingCharacter = text[endOffset];
    const hasIdentifierBefore = precedingCharacter !== void 0 && IDENTIFIER_EDGE_CHARACTER.test(precedingCharacter);
    const hasIdentifierAfter = followingCharacter !== void 0 && IDENTIFIER_EDGE_CHARACTER.test(followingCharacter);
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
async function findReferences(vscodeApi, declarationIndex, originDocument, name, includeDeclaration, token) {
  const uris = await vscodeApi.workspace.findFiles(
    REFERENCE_FILES_PATTERN,
    REFERENCE_FILES_EXCLUDE_PATTERN
  );
  if (token.isCancellationRequested) {
    return [];
  }
  const openDocuments = new Map(
    vscodeApi.workspace.textDocuments.filter((document) => supportsDefinitionLinks(document.uri)).map((document) => [document.uri.toString(), document])
  );
  openDocuments.set(originDocument.uri.toString(), originDocument);
  const urisByKey = new Map(
    uris.filter((uri) => supportsDefinitionLinks(uri)).map((uri) => [uri.toString(), uri])
  );
  for (const document of openDocuments.values()) {
    urisByKey.set(document.uri.toString(), document.uri);
  }
  const locations = (await Promise.all(
    Array.from(urisByKey.values(), async (uri) => {
      if (token.isCancellationRequested) {
        return [];
      }
      const openDocument = openDocuments.get(uri.toString());
      try {
        const text = openDocument?.getText() ?? import_node_buffer2.Buffer.from(
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
  )).flat();
  const definitionKeys = includeDeclaration ? /* @__PURE__ */ new Set() : new Set(
    declarationIndex.definitionsFor(name).map((location) => locationKey(location))
  );
  const references = locations.filter(
    (location) => !definitionKeys.has(locationKey(location))
  );
  references.sort((left, right) => {
    const pathComparison = left.uri.toString().localeCompare(right.uri.toString());
    return pathComparison || left.range.start.compareTo(right.range.start);
  });
  return references;
}

// src/features/gameData/index.ts
function registerGameDataFeatures(vscodeApi, context) {
  const declarationIndex = new GameDataDeclarationIndex(vscodeApi);
  const watcher = vscodeApi.workspace.createFileSystemWatcher(
    SOURCE_FILES_PATTERN
  );
  const clickableDecorationType = vscodeApi.window.createTextEditorDecorationType({
    textDecoration: "underline"
  });
  const pendingDocumentUpdates = /* @__PURE__ */ new Map();
  let pendingDecorationUpdate;
  const updateVisibleDecorations = () => {
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
  function scheduleVisibleDecorationUpdate(delay = 0) {
    clearTimeout(pendingDecorationUpdate);
    pendingDecorationUpdate = setTimeout(async () => {
      await declarationIndex.ready;
      updateVisibleDecorations();
      pendingDecorationUpdate = void 0;
    }, delay);
  }
  const updateFromDisk = async (uri) => {
    await declarationIndex.ready;
    if (isSourceFile(vscodeApi, uri)) {
      await declarationIndex.loadUri(uri);
      scheduleVisibleDecorationUpdate();
    }
  };
  const updateFromDocument = (document) => {
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
            return void 0;
          }
          await declarationIndex.ready;
          declarationIndex.setText(document.uri, document.getText());
          if (token.isCancellationRequested) {
            return void 0;
          }
          const name = document.getText(wordRange);
          const definitions = declarationIndex.definitionsFor(name);
          return definitions.length > 0 ? definitionLinksFor(wordRange, definitions) : void 0;
        }
      }
    ),
    vscodeApi.languages.registerReferenceProvider(
      DEFINITION_SELECTOR,
      {
        async provideReferences(document, position, referenceContext, token) {
          const wordRange = document.getWordRangeAtPosition(
            position,
            IDENTIFIER_PATTERN
          );
          if (!wordRange || token.isCancellationRequested) {
            return void 0;
          }
          await declarationIndex.ready;
          declarationIndex.setText(document.uri, document.getText());
          const name = document.getText(wordRange);
          if (token.isCancellationRequested || !declarationIndex.hasDefinition(name)) {
            return void 0;
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
          return void 0;
        }
        await declarationIndex.ready;
        declarationIndex.setText(document.uri, document.getText());
        if (token.isCancellationRequested) {
          return void 0;
        }
        const name = document.getText(wordRange);
        const contents = declarationIndex.localizationHoverFor(name);
        return contents.length > 0 ? new vscodeApi.Hover(contents, wordRange) : void 0;
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

// src/extension.ts
function activate(context) {
  registerGameDataFeatures(vscode, context);
}
function deactivate() {
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
