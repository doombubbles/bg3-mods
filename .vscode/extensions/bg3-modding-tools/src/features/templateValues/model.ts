export interface ValueSourceFile {
  relativePath: string;
  text: string;
}

export interface ValueNode {
  children: Map<string, ValueNode>;
  source?: string;
  value?: unknown;
}

export interface ValueCompletionContext {
  parentPath: string[];
  partial: string;
  replaceStart: number;
}

export function createValueNode(): ValueNode {
  return { children: new Map() };
}

type ParsedMapping = Record<string, unknown>;

function mappingColon(line: string): number {
  let quote = "";
  let flowDepth = 0;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (quote) {
      if (character === quote && line[index - 1] !== "\\") {
        quote = "";
      }
      continue;
    }
    if (character === "'" || character === '"') {
      quote = character;
    } else if (character === "[" || character === "{") {
      flowDepth += 1;
    } else if (character === "]" || character === "}") {
      flowDepth = Math.max(0, flowDepth - 1);
    } else if (character === ":" && flowDepth === 0) {
      return index;
    }
  }

  return -1;
}

function withoutComment(value: string): string {
  let quote = "";
  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];
    if (quote) {
      if (character === quote && value[index - 1] !== "\\") {
        quote = "";
      }
    } else if (character === "'" || character === '"') {
      quote = character;
    } else if (
      character === "#" &&
      (index === 0 || /\s/.test(value[index - 1] ?? ""))
    ) {
      return value.slice(0, index).trimEnd();
    }
  }
  return value;
}

function unquote(value: string): string {
  if (value.startsWith('"') && value.endsWith('"')) {
    try {
      return JSON.parse(value) as string;
    } catch {
      return value.slice(1, -1);
    }
  }
  if (value.startsWith("'") && value.endsWith("'")) {
    return value.slice(1, -1).replaceAll("''", "'");
  }
  return value;
}

function scalarValue(source: string): unknown {
  const value = withoutComment(source).trim();
  if (value === "" || /^[>|][+-]?$/.test(value)) {
    return {};
  }
  if (value === "true") {
    return true;
  }
  if (value === "false") {
    return false;
  }
  if (value === "null" || value === "~") {
    return null;
  }
  if (/^[-+]?(?:\d+\.?\d*|\.\d+)$/.test(value)) {
    return Number(value);
  }
  return unquote(value);
}

export function parseCompletionYaml(
  text: string
): ParsedMapping | undefined {
  const root: ParsedMapping = {};
  const stack: Array<{
    indent: number;
    mapping: ParsedMapping;
  }> = [{ indent: -1, mapping: root }];
  let ignoredSequenceIndent: number | undefined;
  let ignoredBlockIndent: number | undefined;

  for (const rawLine of text.split(/\r?\n/)) {
    if (/^\s*$/.test(rawLine) || /^\s*#/.test(rawLine)) {
      continue;
    }
    const indentText = rawLine.match(/^[ \t]*/)?.[0] ?? "";
    if (indentText.includes("\t")) {
      continue;
    }
    const indent = indentText.length;
    const line = rawLine.slice(indent);
    if (line === "---" || line === "..." || line.startsWith("%")) {
      continue;
    }

    if (
      ignoredBlockIndent !== undefined &&
      indent > ignoredBlockIndent
    ) {
      continue;
    }
    if (
      ignoredBlockIndent !== undefined &&
      indent <= ignoredBlockIndent
    ) {
      ignoredBlockIndent = undefined;
    }
    if (
      ignoredSequenceIndent !== undefined &&
      indent > ignoredSequenceIndent
    ) {
      continue;
    }
    if (
      ignoredSequenceIndent !== undefined &&
      indent <= ignoredSequenceIndent
    ) {
      ignoredSequenceIndent = undefined;
    }
    if (line.startsWith("-")) {
      ignoredSequenceIndent = indent;
      continue;
    }

    const colon = mappingColon(line);
    if (colon < 0) {
      continue;
    }
    const key = unquote(line.slice(0, colon).trim());
    if (!key || key === "?") {
      continue;
    }
    const rawValue = withoutComment(line.slice(colon + 1)).trim();
    const openingFlows = (rawValue.match(/[\[{]/g) ?? []).length;
    const closingFlows = (rawValue.match(/[\]}]/g) ?? []).length;
    if (openingFlows !== closingFlows) {
      return undefined;
    }

    while (
      stack.length > 1 &&
      indent <= stack[stack.length - 1]!.indent
    ) {
      stack.pop();
    }
    const parent = stack[stack.length - 1]!.mapping;
    const value = scalarValue(rawValue);
    parent[key] = value;

    if (/^[>|][+-]?$/.test(rawValue)) {
      ignoredBlockIndent = indent;
      continue;
    }
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value)
    ) {
      stack.push({
        indent,
        mapping: value as ParsedMapping
      });
    }
  }

  return root;
}

function populateNode(
  node: ValueNode,
  value: unknown,
  source: string
): void {
  node.children.clear();
  node.source = source;
  node.value = value;

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return;
  }

  for (const [key, childValue] of Object.entries(value)) {
    const child = createValueNode();
    populateNode(child, childValue, source);
    node.children.set(key, child);
  }
}

export function valueTreeFromYamlFiles(
  files: readonly ValueSourceFile[]
): ValueNode {
  const root = createValueNode();

  for (const file of [...files].sort((a, b) =>
    a.relativePath.localeCompare(b.relativePath)
  )) {
    const filename = file.relativePath.replaceAll("\\", "/").split("/").at(-1);
    if (!filename?.toLowerCase().endsWith(".yaml")) {
      continue;
    }

    const parsed = parseCompletionYaml(file.text);
    if (!parsed) {
      continue;
    }

    const parts = filename
      .slice(0, -".yaml".length)
      .split(".")
      .filter(Boolean);
    if (parts.length === 0) {
      continue;
    }

    let current = root;
    for (const part of parts) {
      let child = current.children.get(part);
      if (!child) {
        child = createValueNode();
        current.children.set(part, child);
      }
      current = child;
    }

    populateNode(current, parsed, file.relativePath);
  }

  return root;
}

export function valueNodeAtPath(
  root: ValueNode,
  path: readonly string[]
): ValueNode | undefined {
  let current = root;
  for (const segment of path) {
    const child = current.children.get(segment);
    if (!child) {
      return undefined;
    }
    current = child;
  }
  return current;
}

export function templateValueCompletionContext(
  textBeforeCursor: string
): ValueCompletionContext | undefined {
  const opening = textBeforeCursor.lastIndexOf("{{");
  const closing = textBeforeCursor.lastIndexOf("}}");
  if (opening <= closing) {
    return undefined;
  }

  const actionText = textBeforeCursor.slice(opening + 2);
  const match = actionText.match(/\$\.([A-Za-z0-9_.-]*)$/);
  if (!match) {
    return undefined;
  }

  const valuePath = match[1];
  const segments = valuePath.split(".");
  const partial = segments.pop() ?? "";
  return {
    parentPath: segments.filter(Boolean),
    partial,
    replaceStart: textBeforeCursor.length - partial.length
  };
}

export function valuePreview(node: ValueNode): string {
  if (node.children.size > 0) {
    return `${node.children.size} value${node.children.size === 1 ? "" : "s"}`;
  }
  if (typeof node.value === "string") {
    return node.value;
  }
  if (node.value === undefined) {
    return "";
  }
  return JSON.stringify(node.value);
}
