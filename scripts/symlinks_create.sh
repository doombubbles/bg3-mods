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

cmd /c mklink "$GAME_LOCA_DIR/$(basename "$LOCA")" "$LOCA"
cmd /c mklink /d "$GAME_PUBLIC_DIR/$(basename "$PUBLIC_FOLDER")" "$PUBLIC_FOLDER"
cmd /c mklink /d "$GAME_MODS_DIR/$(basename "$MODS_FOLDER")" "$MODS_FOLDER"

echo "$ASSET_FOLDERS" | while read -r ASSET_FOLDER; do
  cmd /c mklink /d "$GAME_ASSETS_DIR/$(basename "$ASSET_FOLDER")" "$ASSET_FOLDER"
done