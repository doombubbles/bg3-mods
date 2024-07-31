set -e

SOURCE_DIR="${1:-./DoombubblesTweaks/Public/Game/GUI/Assets}"
TARGET_DIR="${2:-./Wiki/images}"

mkdir -p "$TARGET_DIR"

./bin/DDStronk.exe "$SOURCE_DIR"

find "$SOURCE_DIR" -type f -name "*.png" | while read -r FILE; do
    RELATIVE_PATH="${FILE#$SOURCE_DIR/}"
    RELATIVE_DIR=$(dirname "$RELATIVE_PATH")

    mkdir -p "$TARGET_DIR/$RELATIVE_DIR"
    mv "$FILE" "$TARGET_DIR/$RELATIVE_PATH"

    echo "Moved $TARGET_DIR/$RELATIVE_PATH"
done

echo "Finished successfully"