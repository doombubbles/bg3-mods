import type {
  ParsedDeclaration,
  ParsedIdentifier
} from "../types";

const ROOT_TEMPLATE_NODE_PATTERN =
  /<node\s+id="GameObjects"\s*>([\s\S]*?)(?=<children>|<\/node>)/g;
const CLASS_DESCRIPTION_NODE_PATTERN =
  /<node\s+id="ClassDescription"\s*>([\s\S]*?)(?=<children>|<\/node>)/g;
const XML_ATTRIBUTE_PATTERN = /<attribute\b([^>]*)\/?>/g;
const XML_PROPERTY_PATTERN = /([A-Za-z_][A-Za-z0-9_]*)="([^"]*)"/g;

interface DirectXmlAttribute {
  value: string;
  valueStartOffset: number;
}

function parseXmlProperties(
  attributeText: string
): Map<string, string> {
  return new Map(
    Array.from(
      attributeText.matchAll(XML_PROPERTY_PATTERN),
      (match) => [match[1], match[2]]
    )
  );
}

function directXmlAttributesForNode(
  nodeMatch: RegExpMatchArray
): {
  attributes: Map<string, DirectXmlAttribute>;
  nodeEndOffset: number;
} {
  const directAttributes = new Map<string, DirectXmlAttribute>();
  const nodeBody = nodeMatch[1];
  const nodeMatchIndex = nodeMatch.index ?? 0;
  const nodeBodyOffset =
    nodeMatchIndex + nodeMatch[0].indexOf(nodeBody);

  for (const attributeMatch of nodeBody.matchAll(XML_ATTRIBUTE_PATTERN)) {
    const properties = parseXmlProperties(attributeMatch[1]);
    const id = properties.get("id");
    const value = properties.get("value");
    if (!id || value === undefined) {
      continue;
    }

    const valueMarker = `value="${value}"`;
    directAttributes.set(id, {
      value,
      valueStartOffset:
        nodeBodyOffset +
        attributeMatch.index +
        attributeMatch[0].indexOf(valueMarker) +
        'value="'.length
    });
  }

  return {
    attributes: directAttributes,
    nodeEndOffset: nodeBodyOffset + nodeBody.length
  };
}

export function parseRootTemplateEntries(
  text: string
): ParsedDeclaration[] {
  const entries: ParsedDeclaration[] = [];

  for (const nodeMatch of text.matchAll(ROOT_TEMPLATE_NODE_PATTERN)) {
    const nodeMatchIndex = nodeMatch.index ?? 0;
    const { attributes, nodeEndOffset } =
      directXmlAttributesForNode(nodeMatch);
    const mapKey = attributes.get("MapKey");
    if (!mapKey) {
      continue;
    }

    const displayName =
      attributes.get("Stats")?.value ??
      attributes.get("Name")?.value ??
      mapKey.value;

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

export function parseClassDescriptionEntries(
  text: string
): ParsedDeclaration[] {
  const entries: ParsedDeclaration[] = [];

  for (const nodeMatch of text.matchAll(CLASS_DESCRIPTION_NODE_PATTERN)) {
    const nodeMatchIndex = nodeMatch.index ?? 0;
    const { attributes, nodeEndOffset } =
      directXmlAttributesForNode(nodeMatch);
    const uuid = attributes.get("UUID");
    const progressionTableUuid = attributes.get("ProgressionTableUUID");
    const primaryIdentifier = uuid ?? progressionTableUuid;
    if (!primaryIdentifier) {
      continue;
    }

    const displayName =
      attributes.get("Name")?.value ?? primaryIdentifier.value;
    const aliases: ParsedIdentifier[] =
      uuid &&
      progressionTableUuid &&
      progressionTableUuid.value !== uuid.value
        ? [
            {
              name: progressionTableUuid.value,
              nameStartOffset: progressionTableUuid.valueStartOffset,
              nameEndOffset:
                progressionTableUuid.valueStartOffset +
                progressionTableUuid.value.length
            }
          ]
        : [];
    const identifierNames = [uuid, progressionTableUuid]
      .filter(
        (identifier): identifier is DirectXmlAttribute =>
          identifier !== undefined
      )
      .map((identifier) => identifier.value);

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
      nameEndOffset:
        primaryIdentifier.valueStartOffset +
        primaryIdentifier.value.length
    });
  }

  return entries;
}
