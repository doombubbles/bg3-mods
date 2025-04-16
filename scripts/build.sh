set -e

VERSION="$(date +'%y.%-m.%-d').$(( $(date "+10#%H * 60 + 10#%M") ))"
MODNAME=${1:-$(basename "$(pwd)")}
BUILD="./build/$MODNAME"
RESULT="./output/$MODNAME.pak"
DESTINATION="$LOCALAPPDATA/Larian Studios/Baldur's Gate 3/Mods/$MODNAME.pak"
BG3_DATA="C:/Program Files (x86)/Steam/steamapps/common/Baldurs Gate 3/Data"

# Process Templates
rm -rf "$BUILD/Mods/$MODNAME"
bin/ProcessTemplates.exe -s "$MODNAME" -d "$BUILD" -r build/values.yaml

# Build Mod
bg3-modders-multitool.exe -s "$BUILD" -d "$RESULT" -c "1" -v "$VERSION"

cp "$BUILD/Mods/$MODNAME/meta.lsx" "./$MODNAME/Mods/$MODNAME/meta.lsx"

cp "$RESULT" "$DESTINATION" && echo "Build Complete for $MODNAME $VERSION $DESTINATION" || echo "Build Complete for $MODNAME $VERSION $RESULT"

# Unpack to Output
rm -rf ./output/$MODNAME
bg3-modders-multitool.exe -s "$RESULT" -d "./output"

mv "$(find "./output/$MODNAME/Localization/English" -iname *.loca.xml)" "./output/$MODNAME/Localization/English/$MODNAME.loca.xml"

# Convert output
find "./output/$MODNAME" -type f -name "*.lsf.lsx" | while read -r file; do
  lsf_lsx_file=$(realpath "$file")
  lsf_file="${lsf_lsx_file%.lsf.lsx}.lsf"
  lsx_file="${lsf_lsx_file%.lsf.lsx}.lsx"

  if [ ! -f "$lsx_file" ]; then
    Divine -g bg3 -a convert-resource -s "$lsf_lsx_file" -d "$lsf_file"
  fi

  rm "$lsf_lsx_file"
done

# Copy to Toolkit

rm -rf "$BG3_DATA/Generated/$MODNAME"
if [ -d "./output/$MODNAME/Generated" ]; then
  mkdir -p "$BG3_DATA/Generated/$MODNAME"
  cp -r "./output/$MODNAME/Generated/." "$BG3_DATA/Generated/$MODNAME"
fi

rm -rf "$BG3_DATA/Mods/$MODNAME"
mkdir -p "$BG3_DATA/Mods/$MODNAME"
cp -r "./output/$MODNAME/Mods/$MODNAME/." "$BG3_DATA/Mods/$MODNAME"
cp -r "./output/$MODNAME/Localization" "$BG3_DATA/Mods/$MODNAME"
cp -r "./output/$MODNAME/Scripts" "$BG3_DATA/Mods/$MODNAME"
if [ -d "./output/$MODNAME/Public/Game" ]; then
  cp -r "./output/$MODNAME/Public/Game/." "$BG3_DATA/Mods/$MODNAME"
fi
# cp -r "$BG3_DATA/Mods/$MODNAME/GUI/Assets" "$BG3_DATA/Mods/$MODNAME/GUI/AssetsLowRes"

rm -rf "$BG3_DATA/Public/$MODNAME"
mkdir -p "$BG3_DATA/Public/"
cp -r "./output/$MODNAME/Public/$MODNAME" "$BG3_DATA/Public"

rm -rf "$BG3_DATA/Projects/$MODNAME"
mkdir -p "$BG3_DATA/Projects/"
cp -r "./output/$MODNAME/Projects/$MODNAME" "$BG3_DATA/Projects"

echo "Finished Build!"