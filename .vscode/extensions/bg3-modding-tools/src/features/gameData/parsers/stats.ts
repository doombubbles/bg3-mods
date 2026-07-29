import type { ParsedDeclaration } from "../types";

const ENTRY_PATTERN = /^new entry[ \t]+"([^"\r\n]+)"[ \t]*\r?$/gm;
const TYPE_PATTERN = /^type[ \t]+"([^"\r\n]+)"[ \t]*\r?$/m;

export function parseStatsEntries(text: string): ParsedDeclaration[] {
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
