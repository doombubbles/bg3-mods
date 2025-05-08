set -e

# Space-separated list of source directories
SOURCE_DIRS="./DoombubblesTweaks/Mods/DoombubblesTweaks/GUI/Assets ./WoWDeathKnight/Mods/WoWDeathKnight/GUI/Assets ./WoWSubclasses/Mods/WoWSubclasses/GUI/Assets"
TARGET_DIR="./Wiki/images"

mkdir -p "$TARGET_DIR"

for SOURCE_DIR in $SOURCE_DIRS; do
    echo "Processing source: $SOURCE_DIR"
    ./bin/DDStronk.exe "$SOURCE_DIR"

    find "$SOURCE_DIR" -type f -name "*.png" | while read -r FILE; do
        RELATIVE_PATH="${FILE#$SOURCE_DIR/}"
        RELATIVE_DIR=$(dirname "$RELATIVE_PATH")

        mkdir -p "$TARGET_DIR/$RELATIVE_DIR"
        mv "$FILE" "$TARGET_DIR/$RELATIVE_PATH"

        echo "Moved $TARGET_DIR/$RELATIVE_PATH"
    done
done

echo "Finished successfully"
