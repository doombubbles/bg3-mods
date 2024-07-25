MODNAME=$(basename "$(pwd)")
GAME_DATA_DIR="C:/Program Files (x86)/Steam/steamapps/common/Baldur's Gate 3/Data"
GAME_LOCA_DIR="$GAME_DATA_DIR/Localization/English"
GAME_PUBLIC_DIR="$GAME_DATA_DIR/Public"
GAME_MODS_DIR="$GAME_DATA_DIR/Mods"
GAME_ASSETS_DIR="$GAME_PUBLIC_DIR/Game/GUI/Assets"

LOCA="$(pwd)/output/$MODNAME/Localization/English/$MODNAME.loca.xml"
PUBLIC_FOLDER="$(pwd)/output/$MODNAME/Public/$MODNAME"
MODS_FOLDER="$(pwd)/$MODNAME/Mods/$MODNAME"
ASSET_FOLDERS="$(find "$(pwd)/output/$MODNAME/Public/Game/GUI/Assets" -maxdepth 1 -mindepth 1)"

rm "$GAME_LOCA_DIR/$(basename "$LOCA")" && echo "Symbolic link deleted for $GAME_LOCA_DIR/$(basename "$LOCA")"
rm "$GAME_PUBLIC_DIR/$(basename "$PUBLIC_FOLDER")" && echo "Symbolic link deleted for $GAME_PUBLIC_DIR/$(basename "$PUBLIC_FOLDER")/"
rm "$GAME_MODS_DIR/$(basename "$MODS_FOLDER")" && echo "Symbolic link deleted for $GAME_MODS_DIR/$(basename "$MODS_FOLDER")/"

echo "$ASSET_FOLDERS" | while read -r ASSET_FOLDER; do
  rm "$GAME_ASSETS_DIR/$(basename "$ASSET_FOLDER")" && echo "Symbolic link deleted for $GAME_ASSETS_DIR/$(basename "$ASSET_FOLDER")/"
done