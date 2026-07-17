set -e

UNPACKED_DATA="./bin/bg3-modders-multitool/UnpackedData"
WIKI_SOURCES="./Wiki"
CONTROLLER_COLOR_OVERRIDES_FILE="./scripts/bg3-wiki-controller-color-overrides.yaml"
ATLAS_WORK_DIR="$WIKI_SOURCES/.bg3-atlas-work"
LEGACY_TARGET_DIR="$WIKI_SOURCES/images/_bg3"
LEGACY_SKILL_TARGET_DIR="./Wiki/skills_png"

IMAGE_PATHS=$(find "$WIKI_SOURCES" -type f \( -name '*.md' -o -name '*.tpl' -o -name '*.yaml' \) \
    -exec grep -hoE '(Game|Gustav_Textures)/[A-Za-z0-9_./-]+\.png|Icons/Textures/[A-Za-z0-9_./-]+\.png' {} \; \
    | sort -u)

CONTROLLER_COLOR_OVERRIDES=$(sed -n 's/^[[:space:]]*-[[:space:]]*//p' \
    "$CONTROLLER_COLOR_OVERRIDES_FILE")

LEGACY_IMAGE_REFS=$(find "$WIKI_SOURCES" -type f \( -name '*.md' -o -name '*.tpl' -o -name '*.yaml' \) \
    -exec grep -hoE 'https://bg3\.wiki/w/images/[^"'"'"' )>]+' {} \; | sort -u || true)

if [ -n "$LEGACY_IMAGE_REFS" ]; then
    echo "Legacy BG3 Wiki image references remain:" >&2
    printf '%s\n' "$LEGACY_IMAGE_REFS" >&2
    exit 1
fi

if [ -z "$IMAGE_PATHS" ]; then
    echo "No BG3 Wiki image references found"
    exit 1
fi

unpacked_source_path() {
    case "$1" in
        Game/*)
            printf 'Game/Public/Game/GUI/Assets/%s' "${1#Game/}"
            ;;
        Gustav_Textures/*)
            printf 'Gustav_Textures/Mods/GustavX/GUI/Assets/%s' "${1#Gustav_Textures/}"
            ;;
        Icons/*)
            printf 'Icons/Public/Shared/Assets/%s' "${1#Icons/}"
            ;;
        *)
            echo "Unsupported compact BG3 image path: $1" >&2
            return 1
            ;;
    esac
}

atlas_source_path() {
    printf '%s.DDS' "${1%%.DDS/*}"
}

atlas_icon_key() {
    basename "${1%.png}"
}

source_relative_path() {
    case "$1" in
        *.DDS/*.png)
            atlas_source_path "$1"
            ;;
        *)
            printf '%s.DDS' "${1%.png}"
            ;;
    esac
}

unpacked_image_path() {
    local source_relative
    source_relative=$(source_relative_path "$1") || return 1
    printf '%s/%s' "$UNPACKED_DATA" "$(unpacked_source_path "$source_relative")"
}

tooltip_color_source_path() {
    case "$1" in
        Game/ControllerUIIcons/skills_png/*.png)
            printf '%s/Game/Public/Game/GUI/Assets/Tooltips/Icons/%s.DDS' \
                "$UNPACKED_DATA" "$(basename "${1%.png}")"
            ;;
    esac
}

uses_tooltip_colors() {
    printf '%s\n' "$CONTROLLER_COLOR_OVERRIDES" | grep -Fxq "$1"
}

atlas_definition_path() {
    local atlas_relative_path="$1"
    local icon_key="$2"
    local atlas_name
    local candidate
    local matches=""
    local match_count
    atlas_name=$(basename "${atlas_relative_path%.DDS}")

    # Icon atlas catalogs follow <package>/Public/<module>/GUI/<atlas>.lsx.
    # Using that bounded layout avoids scanning large animation and texture trees.
    for candidate in "$UNPACKED_DATA"/*/Public/*/GUI/"$atlas_name.lsx"; do
        [ -f "$candidate" ] || continue

        if grep -Fq "value=\"$icon_key\"" "$candidate"; then
            matches="${matches}${matches:+
}$candidate"
        fi
    done

    match_count=$(printf '%s\n' "$matches" | grep -c . || true)
    if [ "$match_count" -ne 1 ]; then
        echo "Expected one atlas definition for $atlas_name/$icon_key, found $match_count" >&2
        return 1
    fi

    printf '%s' "$matches"
}

atlas_crop_spec() {
    local atlas_relative_path="$1"
    local icon_key="$2"
    local definition_path
    definition_path=$(atlas_definition_path "$atlas_relative_path" "$icon_key") || return 1

    awk -v key="$icon_key" '
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
    ' "$definition_path" || {
        echo "Could not parse atlas entry $icon_key from $definition_path" >&2
        return 1
    }
}

# Check every source before replacing the generated image directory.
HAS_ATLAS_IMAGES=false
HAS_CONTROLLER_COLORS=false
for WIKI_PATH in $IMAGE_PATHS; do
    SOURCE_PATH=$(unpacked_image_path "$WIKI_PATH")

    if uses_tooltip_colors "$WIKI_PATH"; then
        TOOLTIP_COLOR_SOURCE=$(tooltip_color_source_path "$WIKI_PATH")
        if [ -z "$TOOLTIP_COLOR_SOURCE" ] || [ ! -f "$TOOLTIP_COLOR_SOURCE" ]; then
            echo "Missing tooltip color source for $WIKI_PATH" >&2
            exit 1
        fi
        HAS_CONTROLLER_COLORS=true
    fi

    case "$WIKI_PATH" in
        *.DDS/*.png)
            HAS_ATLAS_IMAGES=true
            ATLAS_RELATIVE_PATH=$(atlas_source_path "$WIKI_PATH")
            ICON_KEY=$(atlas_icon_key "$WIKI_PATH")
            atlas_crop_spec "$ATLAS_RELATIVE_PATH" "$ICON_KEY" > /dev/null
            ;;
    esac

    if [ ! -f "$SOURCE_PATH" ]; then
        echo "Missing source image: $SOURCE_PATH"
        exit 1
    fi
done

if [ "$HAS_ATLAS_IMAGES" = true ] || [ "$HAS_CONTROLLER_COLORS" = true ]; then
    if command -v magick > /dev/null 2>&1; then
        MAGICK=magick
    elif command -v magick.exe > /dev/null 2>&1; then
        MAGICK=magick.exe
    else
        echo "ImageMagick is required to process BG3 Wiki images"
        exit 1
    fi
fi

for PACKAGE in Game Gustav_Textures Icons; do
    rm -rf "$WIKI_SOURCES/$PACKAGE"
    mkdir -p "$WIKI_SOURCES/$PACKAGE"
done
rm -rf "$ATLAS_WORK_DIR"

for WIKI_PATH in $IMAGE_PATHS; do
    SOURCE_RELATIVE_PATH=$(source_relative_path "$WIKI_PATH")
    SOURCE_PATH=$(unpacked_image_path "$WIKI_PATH")

    case "$WIKI_PATH" in
        *.DDS/*.png)
            TARGET_PATH="$ATLAS_WORK_DIR/$SOURCE_RELATIVE_PATH"
            ;;
        *)
            TARGET_PATH="$WIKI_SOURCES/$SOURCE_RELATIVE_PATH"
            ;;
    esac

    if [ ! -f "$TARGET_PATH" ]; then
        mkdir -p "$(dirname "$TARGET_PATH")"
        cp "$SOURCE_PATH" "$TARGET_PATH"
    fi
done

for PACKAGE in Game Gustav_Textures Icons; do
    ./bin/DDStronk.exe "$WIKI_SOURCES/$PACKAGE"
done
if [ "$HAS_ATLAS_IMAGES" = true ]; then
    ./bin/DDStronk.exe "$ATLAS_WORK_DIR"
fi

for WIKI_PATH in $IMAGE_PATHS; do
    case "$WIKI_PATH" in
        *.DDS/*.png)
            ATLAS_RELATIVE_PATH=$(atlas_source_path "$WIKI_PATH")
            ICON_KEY=$(atlas_icon_key "$WIKI_PATH")
            CROP_SPEC=$(atlas_crop_spec "$ATLAS_RELATIVE_PATH" "$ICON_KEY")
            set -- $CROP_SPEC
            TARGET_PATH="$WIKI_SOURCES/$WIKI_PATH"
            ATLAS_PATH="$ATLAS_WORK_DIR/${ATLAS_RELATIVE_PATH%.DDS}.png"

            mkdir -p "$(dirname "$TARGET_PATH")"
            # Remove converter timestamps so regenerated atlas icons are reproducible.
            "$MAGICK" "$ATLAS_PATH" -crop "$3x$4+$1+$2" +repage -strip "$TARGET_PATH"
            ;;
    esac
done

# Controller icons avoid the tooltip icons' bottom fade, but some rely on runtime
# tinting and have incomplete colors in their source texture. Combine the tooltip
# RGB channels with the controller alpha channel to retain both desirable traits.
if [ "$HAS_CONTROLLER_COLORS" = true ]; then
    for WIKI_PATH in $IMAGE_PATHS; do
        uses_tooltip_colors "$WIKI_PATH" || continue
        TOOLTIP_COLOR_SOURCE=$(tooltip_color_source_path "$WIKI_PATH")

        TARGET_PATH="$WIKI_SOURCES/$WIKI_PATH"
        COLOR_TARGET_PATH="$TARGET_PATH.color.png"
        DIMENSIONS=$("$MAGICK" identify -format '%wx%h' "$TARGET_PATH")

        "$MAGICK" "$TOOLTIP_COLOR_SOURCE" -resize "$DIMENSIONS!" -alpha off \
            \( "$TARGET_PATH" -alpha extract \) -compose CopyAlpha -composite \
            -strip "$COLOR_TARGET_PATH"
        mv "$COLOR_TARGET_PATH" "$TARGET_PATH"
    done
fi

rm -rf "$ATLAS_WORK_DIR"
for PACKAGE in Game Gustav_Textures Icons; do
    find "$WIKI_SOURCES/$PACKAGE" -type f -iname '*.dds' -exec rm -f {} \;
done
rm -rf "$LEGACY_TARGET_DIR"
rm -rf "$LEGACY_SKILL_TARGET_DIR"

echo "Finished syncing BG3 Wiki images"
