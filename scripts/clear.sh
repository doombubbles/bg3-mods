set -e

MODNAME=$(basename "$(pwd)")
BG3_DATA="C:/Program Files (x86)/Steam/steamapps/common/Baldurs Gate 3/Data"

rm -rf "$BG3_DATA/Generated/$MODNAME"
rm -rf "$BG3_DATA/Mods/$MODNAME"
rm -rf "$BG3_DATA/Public/$MODNAME"