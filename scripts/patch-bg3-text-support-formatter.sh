set -e

SINGLE_INDENT="vscode.TextEdit.replace(line.range, '\\t' + lineText)"
DOUBLE_INDENT="vscode.TextEdit.replace(line.range, '\\t\\t' + lineText)"
UNINDENTED="vscode.TextEdit.replace(line.range, lineText)"
FOUND=false
CHANGED=false

for extensions_dir in \
  "$HOME/.vscode/extensions" \
  "$HOME/.vscode-insiders/extensions" \
  "$HOME/.cursor/extensions"; do
  for extension_dir in "$extensions_dir"/chromosome16.bg3-text-support-*; do
    if [ ! -d "$extension_dir" ]; then
      continue
    fi

    FOUND=true
    formatter="$extension_dir/src/document_formatter.js"

    if [ ! -f "$formatter" ]; then
      echo "Skipping $extension_dir: src/document_formatter.js was not found."
      continue
    fi

    has_single=false
    has_double=false
    grep -Fq "$SINGLE_INDENT" "$formatter" && has_single=true
    grep -Fq "$DOUBLE_INDENT" "$formatter" && has_double=true

    if [ "$has_single" = false ] && [ "$has_double" = false ]; then
      if grep -Fq "$UNINDENTED" "$formatter"; then
        echo "Already patched: $formatter"
        continue
      fi

      echo "Unfamiliar formatter implementation in $formatter; no changes were made."
      exit 1
    fi

    if [ "$has_single" != true ] || [ "$has_double" != true ]; then
      echo "Only part of the expected formatter implementation was found in $formatter; no changes were made."
      exit 1
    fi

    sed -i \
      -e "s|$SINGLE_INDENT|$UNINDENTED|g" \
      -e "s|$DOUBLE_INDENT|$UNINDENTED|g" \
      "$formatter"

    echo "Patched: $formatter"
    CHANGED=true
  done
done

if [ "$FOUND" = false ]; then
  echo "BG3 Text Support (chromosome16.bg3-text-support) was not found."
  exit 1
fi

if [ "$CHANGED" = true ]; then
  echo "Reload the VS Code window for the formatter change to take effect."
fi
