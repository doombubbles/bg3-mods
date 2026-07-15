set -e

UNPACKED_DATA="./bin/bg3-modders-multitool/UnpackedData"
TARGET_DIR="./Wiki/images/_bg3"
WIKI_SOURCES="./Wiki"

IMAGE_PATHS=$(grep -rhoE --include='*.md' --include='*.tpl' 'images/_bg3/[A-Za-z0-9_./-]+\.png' "$WIKI_SOURCES" | sort -u)

LEGACY_IMAGE_REFS=$(grep -rhoE --include='*.md' --include='*.tpl' 'https://bg3\.wiki/w/images/[^"'"'"' )>]+' "$WIKI_SOURCES" | sort -u || true)

if [ -n "$LEGACY_IMAGE_REFS" ]; then
    echo "Legacy BG3 Wiki image references remain:" >&2
    printf '%s\n' "$LEGACY_IMAGE_REFS" >&2
    exit 1
fi

if [ -z "$IMAGE_PATHS" ]; then
    echo "No BG3 Wiki image references found"
    exit 1
fi

atlas_source_path() {
    RELATIVE_PATH="$1"
    printf '%s.DDS' "${RELATIVE_PATH%%.DDS/*}"
}

atlas_icon_key() {
    basename "${1%.png}"
}

atlas_definition_path() {
    ATLAS_RELATIVE_PATH="$1"
    ICON_KEY="$2"
    ATLAS_NAME=$(basename "${ATLAS_RELATIVE_PATH%.DDS}")
    MATCHES=""

    # Icon atlas catalogs follow <package>/Public/<module>/GUI/<atlas>.lsx.
    # Using that bounded layout avoids scanning large animation and texture trees.
    for CANDIDATE in "$UNPACKED_DATA"/*/Public/*/GUI/"$ATLAS_NAME.lsx"; do
        [ -f "$CANDIDATE" ] || continue

        if grep -Fq "value=\"$ICON_KEY\"" "$CANDIDATE"; then
            MATCHES="${MATCHES}${MATCHES:+
}$CANDIDATE"
        fi
    done

    MATCH_COUNT=$(printf '%s\n' "$MATCHES" | grep -c . || true)
    if [ "$MATCH_COUNT" -ne 1 ]; then
        echo "Expected one atlas definition for $ATLAS_NAME/$ICON_KEY, found $MATCH_COUNT" >&2
        return 1
    fi

    printf '%s' "$MATCHES"
}

atlas_crop_spec() {
    ATLAS_RELATIVE_PATH="$1"
    ICON_KEY="$2"
    DEFINITION_PATH=$(atlas_definition_path "$ATLAS_RELATIVE_PATH" "$ICON_KEY") || return 1

    awk -v key="$ICON_KEY" '
        function value(line, result) {
            if (match(line, /value="[^"]+"/)) {
                result = substr(line, RSTART + 7, RLENGTH - 8)
                return result
            }
            return ""
        }

        /id="MapKey"/ && value($0) == key {
            # IconUV fields have a fixed MapKey, U1, U2, V1, V2 order.
            getline
            u1 = value($0)
            getline
            getline
            v1 = value($0)
            getline
            next
        }

        /<node id="TextureAtlasIconSize">/ { size_section = "icon"; next }
        /<node id="TextureAtlasTextureSize">/ { size_section = "texture"; next }
        size_section == "icon" && /id="Height"/ { icon_height = value($0); next }
        size_section == "icon" && /id="Width"/ { icon_width = value($0); next }
        size_section == "texture" && /id="Height"/ { texture_height = value($0); next }
        size_section == "texture" && /id="Width"/ { texture_width = value($0); next }
        size_section != "" && /<\/node>/ { size_section = ""; next }

        END {
            if (u1 == "" || v1 == "" || icon_width == "" || icon_height == "" ||
                texture_width == "" || texture_height == "") {
                exit 1
            }

            # Atlas UVs point at pixel centers, so truncation removes the half-pixel offset.
            x = int(u1 * texture_width)
            y = int(v1 * texture_height)
            printf "%d %d %d %d", x, y, icon_width, icon_height
        }
    ' "$DEFINITION_PATH" || {
        echo "Could not parse atlas entry $ICON_KEY from $DEFINITION_PATH" >&2
        return 1
    }
}

# Check every source before replacing the generated image directory.
HAS_ATLAS_IMAGES=false
for WIKI_PATH in $IMAGE_PATHS; do
    RELATIVE_PATH="${WIKI_PATH#images/_bg3/}"

    case "$RELATIVE_PATH" in
        *.DDS/*.png)
            HAS_ATLAS_IMAGES=true
            ATLAS_RELATIVE_PATH=$(atlas_source_path "$RELATIVE_PATH")
            SOURCE_PATH="$UNPACKED_DATA/$ATLAS_RELATIVE_PATH"
            ICON_KEY=$(atlas_icon_key "$RELATIVE_PATH")
            atlas_crop_spec "$ATLAS_RELATIVE_PATH" "$ICON_KEY" > /dev/null
            ;;
        *)
            SOURCE_PATH="$UNPACKED_DATA/${RELATIVE_PATH%.png}.DDS"
            ;;
    esac

    if [ ! -f "$SOURCE_PATH" ]; then
        echo "Missing source image: $SOURCE_PATH"
        exit 1
    fi
done

if [ "$HAS_ATLAS_IMAGES" = true ] && ! command -v magick > /dev/null 2>&1; then
    echo "ImageMagick is required to crop BG3 atlas images"
    exit 1
fi

rm -rf "$TARGET_DIR"
mkdir -p "$TARGET_DIR"

for WIKI_PATH in $IMAGE_PATHS; do
    RELATIVE_PATH="${WIKI_PATH#images/_bg3/}"

    case "$RELATIVE_PATH" in
        *.DDS/*.png)
            ATLAS_RELATIVE_PATH=$(atlas_source_path "$RELATIVE_PATH")
            SOURCE_PATH="$UNPACKED_DATA/$ATLAS_RELATIVE_PATH"
            TARGET_PATH="$TARGET_DIR/.atlas-work/$ATLAS_RELATIVE_PATH"
            ;;
        *)
            SOURCE_PATH="$UNPACKED_DATA/${RELATIVE_PATH%.png}.DDS"
            TARGET_PATH="$TARGET_DIR/${RELATIVE_PATH%.png}.DDS"
            ;;
    esac

    if [ ! -f "$TARGET_PATH" ]; then
        mkdir -p "$(dirname "$TARGET_PATH")"
        cp "$SOURCE_PATH" "$TARGET_PATH"
    fi
done

./bin/DDStronk.exe "$TARGET_DIR"

for WIKI_PATH in $IMAGE_PATHS; do
    RELATIVE_PATH="${WIKI_PATH#images/_bg3/}"

    case "$RELATIVE_PATH" in
        *.DDS/*.png)
            ATLAS_RELATIVE_PATH=$(atlas_source_path "$RELATIVE_PATH")
            ICON_KEY=$(atlas_icon_key "$RELATIVE_PATH")
            CROP_SPEC=$(atlas_crop_spec "$ATLAS_RELATIVE_PATH" "$ICON_KEY")
            set -- $CROP_SPEC
            TARGET_PATH="$TARGET_DIR/$RELATIVE_PATH"
            ATLAS_PATH="$TARGET_DIR/.atlas-work/${ATLAS_RELATIVE_PATH%.DDS}.png"

            mkdir -p "$(dirname "$TARGET_PATH")"
            magick "$ATLAS_PATH" -crop "$3x$4+$1+$2" +repage "$TARGET_PATH"
            ;;
    esac
done

rm -rf "$TARGET_DIR/.atlas-work"
find "$TARGET_DIR" -type f -iname '*.dds' -exec rm -f {} \;

echo "Finished syncing BG3 Wiki images"
