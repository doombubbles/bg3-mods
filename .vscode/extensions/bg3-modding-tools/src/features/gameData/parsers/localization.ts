import type { ParsedDeclaration } from "../types";

const LOCALIZATION_ENTRY_PATTERN =
  /<content\b[^>]*\bcontentuid="([^"\r\n]+)"[^>]*>[\s\S]*?<\/content>/g;

export function decodeXmlEntities(text: string): string {
  return text
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'")
    .replaceAll("&amp;", "&");
}

export function localizationText(content: string): string {
  return decodeXmlEntities(content)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?LSTag\b[^>]*>/gi, "")
    .replace(/<[^>]+>/g, "")
    .split(/\r?\n/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .join("\n")
    .trim();
}

function localizationPreview(content: string): string {
  const preview = content.replace(/\s+/g, " ").trim();
  return preview.length > 100 ? `${preview.slice(0, 97)}...` : preview;
}

export function parseLocalizationEntries(
  text: string
): ParsedDeclaration[] {
  return Array.from(
    text.matchAll(LOCALIZATION_ENTRY_PATTERN),
    (match) => {
      const matchIndex = match.index;
      const name = match[1];
      const nameStartOffset =
        matchIndex + match[0].indexOf(name);
      const contentStartOffset =
        matchIndex + match[0].indexOf(">") + 1;
      const contentEndOffset =
        matchIndex + match[0].lastIndexOf("</content>");
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
