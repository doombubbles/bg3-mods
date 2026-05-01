set -e

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
REPO_ROOT=$(cd "$SCRIPT_DIR/.." && pwd)
TEMPLATE_DIR="$SCRIPT_DIR/TemplateMod"

if [ ! -d "$TEMPLATE_DIR" ]; then
  echo "TemplateMod directory not found at $TEMPLATE_DIR"
  exit 1
fi

MOD_NAME=$1
MOD_AUTHOR=$2
MOD_DESCRIPTION=$3

while :; do
  if [ -z "$MOD_NAME" ]; then
    printf "Mod name (no spaces): "
    read MOD_NAME
  fi
  case "$MOD_NAME" in
    "") echo "Mod name cannot be empty." ;;
    *[[:space:]]*) echo "Mod name cannot contain spaces."; MOD_NAME="" ;;
    *) break ;;
  esac
done

if [ -z "$MOD_AUTHOR" ]; then
  printf "Author: "
  read MOD_AUTHOR
fi

if [ -z "$MOD_DESCRIPTION" ]; then
  printf "Description: "
  read MOD_DESCRIPTION
fi

TARGET_DIR="$REPO_ROOT/$MOD_NAME"
if [ -e "$TARGET_DIR" ]; then
  echo "Target already exists: $TARGET_DIR"
  exit 1
fi

gen_uuid() {
  printf '%04x%04x-%04x-%04x-%04x-%04x%04x%04x\n' \
    $((RANDOM)) $((RANDOM)) \
    $((RANDOM)) \
    $((RANDOM)) \
    $((RANDOM)) \
    $((RANDOM)) $((RANDOM)) $((RANDOM))
}

MOD_GUID=$(gen_uuid)
PROJECT_GUID=$(gen_uuid)

echo "Creating $MOD_NAME"
echo "  MOD_GUID:     $MOD_GUID"
echo "  PROJECT_GUID: $PROJECT_GUID"

cp -r "$TEMPLATE_DIR" "$TARGET_DIR"

# Escape strings for use on the right-hand side of a sed s/// expression.
sed_escape() {
  printf '%s' "$1" | sed -e 's/[\\&|]/\\&/g'
}

ESC_NAME=$(sed_escape "$MOD_NAME")
ESC_AUTHOR=$(sed_escape "$MOD_AUTHOR")
ESC_DESCRIPTION=$(sed_escape "$MOD_DESCRIPTION")
ESC_MOD_GUID=$(sed_escape "$MOD_GUID")
ESC_PROJECT_GUID=$(sed_escape "$PROJECT_GUID")

# Replace placeholders in file contents.
find "$TARGET_DIR" -type f | while read -r file; do
  sed -i \
    -e "s|TemplateMod|$ESC_NAME|g" \
    -e "s|AUTHOR|$ESC_AUTHOR|g" \
    -e "s|DESCRIPTION|$ESC_DESCRIPTION|g" \
    -e "s|MOD_GUID|$ESC_MOD_GUID|g" \
    -e "s|PROJECT_GUID|$ESC_PROJECT_GUID|g" \
    "$file"
done

# Rename files and directories containing TemplateMod (deepest first).
find "$TARGET_DIR" -depth -name "*TemplateMod*" | while read -r path; do
  dir=$(dirname "$path")
  base=$(basename "$path")
  newbase=$(echo "$base" | sed "s|TemplateMod|$ESC_NAME|g")
  mv "$path" "$dir/$newbase"
done

# Add the new mod to the "mod" pickString options in .vscode/tasks.json.
TASKS_JSON="$REPO_ROOT/.vscode/tasks.json"
TMP_TASKS="$TASKS_JSON.tmp"
"$REPO_ROOT/bin/jq.exe" --arg name "$MOD_NAME" \
  '(.inputs[] | select(.id == "mod") | .options) += [$name]' \
  "$TASKS_JSON" > "$TMP_TASKS"
mv "$TMP_TASKS" "$TASKS_JSON"

# format the updated tasks.json with prettier
if command -v npx >/dev/null 2>&1; then
  if ! npx --yes prettier --write "$TASKS_JSON" >/dev/null 2>&1; then
    echo "Warning: prettier formatting failed for $TASKS_JSON"
  fi
else
  echo "Warning: npx not found; skipping prettier formatting of $TASKS_JSON"
fi

echo "Created $MOD_NAME at $TARGET_DIR"
