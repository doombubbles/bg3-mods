export interface ParsedIdentifier {
  name: string;
  nameStartOffset: number;
  nameEndOffset: number;
}

export interface ParsedDeclaration extends ParsedIdentifier {
  type: string;
  startOffset: number;
  endOffset: number;
  aliases?: ParsedIdentifier[];
  detail?: string;
  displayName?: string;
  symbolDetail?: string;
  hoverText?: string;
}
